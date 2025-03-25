import { Request, Response } from "express";
import db from "../database";

// Registrar receita
export const createRevenue = (req: Request, res: Response): void => {
    const { user_id, value, tag, transaction_date } = req.body;

    if (!user_id || !value || !tag || !transaction_date) {
        res.status(400).json({ error: "Todos os campos são obrigatórios." });
        return;
    }

    const userId = Math.floor(Number(user_id));
    if (isNaN(userId)) {
        res.status(400).json({ error: "O campo user_id deve ser um número válido." });
        return;
    }

    const balanceStmt = db.prepare("SELECT id, value FROM balance WHERE user_id = ? ORDER BY id DESC LIMIT 1");
    const lastBalanceRecord = balanceStmt.get(userId) as { id: number; value: number } | undefined;

    let balanceId: number;
    let lastBalance: number;

    if (!lastBalanceRecord) {
        const initialBalanceStmt = db.prepare("INSERT INTO balance (user_id, value) VALUES (?, ?)");
        const result = initialBalanceStmt.run(userId, 0);
        balanceId = result.lastInsertRowid as number;
        lastBalance = 0;
    } else {
        balanceId = lastBalanceRecord.id;
        lastBalance = lastBalanceRecord.value;
    }

    const newBalance = lastBalance + value;

    const revenueStmt = db.prepare(
        "INSERT INTO revenue (balance_id, value, tag, transaction_date) VALUES (?, ?, ?, ?)"
    );
    const balanceUpdateStmt = db.prepare(
        "INSERT INTO balance (user_id, value) VALUES (?, ?)"
    );

    try {
        revenueStmt.run(balanceId, value, tag, transaction_date);

        balanceUpdateStmt.run(userId, newBalance);

        res.status(201).json({ message: "Receita registrada com sucesso.", newBalance });
    } catch (error) {
        console.error("Erro ao registrar receita:", error);
        res.status(500).json({ error: "Erro ao registrar receita." });
    }
};