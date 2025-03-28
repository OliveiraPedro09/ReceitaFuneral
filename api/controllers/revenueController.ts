import { Request, Response } from "express";
import db from "../database";

// Registrar receita
export const createRevenue = (req: Request, res: Response): void => {
    const { user_id, value, tag_id, transaction_date } = req.body;

    if (!user_id || !value || !tag_id || !transaction_date) {
        res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
        return;
    }

    const formattedValue = parseFloat(value);
    if (isNaN(formattedValue)) {
        res.status(400).json({ error: "O campo value deve ser um número válido." });
        return;
    }

    const balanceStmt = db.prepare("SELECT id, value FROM balance WHERE user_id = ? ORDER BY id DESC LIMIT 1");
    const lastBalanceRecord = balanceStmt.get(user_id) as { id: number; value: number } | undefined;

    let lastBalance: number;

    if (!lastBalanceRecord) {
        const initialBalanceStmt = db.prepare("INSERT INTO balance (user_id, value) VALUES (?, ?)");
        initialBalanceStmt.run(user_id, 0);
        lastBalance = 0;
    } else {
        lastBalance = lastBalanceRecord.value;
    }

    const newBalance = lastBalance + formattedValue;

    const revenueStmt = db.prepare(`
        INSERT INTO revenue (user_id, value, tag_id, transaction_date)
        VALUES (?, ?, ?, ?)
    `);

    const transactionStmt = db.prepare(`
        INSERT INTO transactions (user_id, value, tag_id, transaction_date, type)
        VALUES (?, ?, ?, ?, 'revenue')
    `);

    const balanceUpdateStmt = db.prepare(`
        INSERT INTO balance (user_id, value) VALUES (?, ?)
    `);

    try {
        revenueStmt.run(user_id, formattedValue, tag_id, transaction_date);

        transactionStmt.run(user_id, formattedValue, tag_id, transaction_date);

        balanceUpdateStmt.run(user_id, newBalance);

        res.status(201).json({ message: "Receita registrada com sucesso.", newBalance });
    } catch (error) {
        console.error("Erro ao registrar receita:", error);
        res.status(500).json({ error: "Erro ao registrar receita." });
    }
};