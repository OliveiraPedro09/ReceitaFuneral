import { Request, Response } from "express";
import db from "../database";

export const getLastTransactions = (req: Request, res: Response): void => {
    const { user_id } = req.params;

    if (!user_id) {
        res.status(400).json({ error: "O campo user_id é obrigatório." });
        return;
    }

    const userId = Math.floor(Number(user_id));
    if (isNaN(userId)) {
        res.status(400).json({ error: "O campo user_id deve ser um número válido." });
        return;
    }

    try {
        const stmt = db.prepare(`
            SELECT t.id, t.value, t.transaction_date, t.type, tg.name AS tag_name
            FROM transactions t
            JOIN tags tg ON t.tag_id = tg.id
            WHERE t.user_id = ?
            ORDER BY t.transaction_date DESC
            LIMIT 10
        `);
        const transactions = stmt.all(userId);

        res.status(200).json({ transactions });
    } catch (error) {
        console.error("Erro ao buscar transações:", error);
        res.status(500).json({ error: "Erro ao buscar transações." });
    }
};