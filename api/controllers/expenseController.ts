import { Request, Response } from "express";
import db from "../database";

// Registrar despesa
export const createExpense = (req: Request, res: Response): void => {
    let { user_id, value, tag, transaction_date, billing_date, due_date } = req.body;

    if (!user_id || !value || !tag || !transaction_date || !billing_date || !due_date) {
        res.status(400).json({ error: "Todos os campos são obrigatórios." });
        return;
    }

    user_id = Math.floor(Number(user_id));
    if (isNaN(user_id)) {
        res.status(400).json({ error: "O campo user_id deve ser um número válido." });
        return;
    }

    const balanceStmt = db.prepare("SELECT id, value FROM balance WHERE user_id = ? ORDER BY id DESC LIMIT 1");
    const lastBalanceRecord = balanceStmt.get(user_id) as { id: number; value: number } | undefined;

    let balanceId: number;
    let lastBalance: number;

    if (!lastBalanceRecord) {
        const initialBalanceStmt = db.prepare("INSERT INTO balance (user_id, value) VALUES (?, ?)");
        const result = initialBalanceStmt.run(user_id, 0); // Saldo inicial como 0
        balanceId = result.lastInsertRowid as number;
        lastBalance = 0;
    } else {
        balanceId = lastBalanceRecord.id;
        lastBalance = lastBalanceRecord.value;
    }

    const newBalance = lastBalance - value;

    const expenseStmt = db.prepare(
        "INSERT INTO expense (balance_id, value, tag, transaction_date, billing_date, due_date) VALUES (?, ?, ?, ?, ?, ?)"
    );
    const balanceUpdateStmt = db.prepare(
        "INSERT INTO balance (user_id, value) VALUES (?, ?)"
    );

    try {
        // Inserir a despesa
        expenseStmt.run(balanceId, value, tag, transaction_date, billing_date, due_date);

        // Atualizar o saldo
        balanceUpdateStmt.run(user_id, newBalance);

        res.status(201).json({ message: "Despesa registrada com sucesso.", newBalance });
    } catch (error) {
        console.error("Erro ao registrar despesa:", error);
        res.status(500).json({ error: "Erro ao registrar despesa." });
    }
};