import { Request, Response } from "express";
import db from "../database";

export const createTag = (req: Request, res: Response): void => {
    const { user_id, name } = req.body;

    if (!user_id || !name) {
        res.status(400).json({ error: "Os campos user_id e name são obrigatórios." });
        return;
    }

    try {
        const stmt = db.prepare("INSERT INTO tags (user_id, name) VALUES (?, ?)");
        stmt.run(user_id, name);
        res.status(201).json({ message: "Tag criada com sucesso." });
    } catch (error) {
        console.error("Erro ao criar tag:", error);
        res.status(500).json({ error: "Erro ao criar tag." });
    }
};

export const getTagsByUser = (req: Request, res: Response): void => {
    const { user_id } = req.params;

    if (!user_id) {
        res.status(400).json({ error: "O campo user_id é obrigatório." });
        return;
    }

    try {
        const stmt = db.prepare("SELECT * FROM tags WHERE user_id = ?");
        const tags = stmt.all(user_id);
        res.status(200).json({ tags });
    } catch (error) {
        console.error("Erro ao buscar tags:", error);
        res.status(500).json({ error: "Erro ao buscar tags." });
    }
};

export const deleteTag = (req: Request, res: Response): void => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: "O campo id é obrigatório." });
        return;
    }

    try {
        const stmt = db.prepare("DELETE FROM tags WHERE id = ?");
        stmt.run(id);
        res.status(200).json({ message: "Tag deletada com sucesso." });
    } catch (error) {
        console.error("Erro ao deletar tag:", error);
        res.status(500).json({ error: "Erro ao deletar tag." });
    }
};