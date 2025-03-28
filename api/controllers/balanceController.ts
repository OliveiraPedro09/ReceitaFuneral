import { Request, Response } from "express";
import db from "../database";

export const getLastBalance = (req: Request, res: Response): void => {
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
        const stmt = db.prepare("SELECT value FROM balance WHERE user_id = ? ORDER BY id DESC LIMIT 1");
        const balance = stmt.get(userId) as { value: number } | undefined;

        if (!balance) {
            res.status(404).json({ error: "Saldo não encontrado para o usuário especificado." });
            return;
        }

        res.status(200).json({ balance: balance.value });
    } catch (error) {
        console.error("Erro ao buscar saldo:", error);
        res.status(500).json({ error: "Erro interno no servidor." });
    }
};