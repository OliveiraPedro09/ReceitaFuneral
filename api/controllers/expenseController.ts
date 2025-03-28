import { Request, Response } from "express";
import db from "../database";

// Registrar despesa
export const createExpense = (req: Request, res: Response): void => {
    const { user_id, value, tag_id, transaction_date, due_date } = req.body;

    // Validação dos campos obrigatórios
    if (!user_id || !value || !tag_id || !transaction_date || !due_date) {
        res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
        return;
    }

    const formattedValue = parseFloat(value);
    if (isNaN(formattedValue)) {
        res.status(400).json({ error: "O campo value deve ser um número válido." });
        return;
    }

    // Preparar as queries para inserir na tabela `expense` e `transactions`
    const expenseStmt = db.prepare(`
        INSERT INTO expense (user_id, value, tag_id, transaction_date, billing_date, due_date, is_paid)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const transactionStmt = db.prepare(`
        INSERT INTO transactions (user_id, value, tag_id, transaction_date, type)
        VALUES (?, ?, ?, ?, 'expense')
    `);

    try {
        // Inserir na tabela `expense`
        expenseStmt.run(user_id, formattedValue, tag_id, transaction_date, null, due_date, 0);

        // Inserir na tabela `transactions`
        transactionStmt.run(user_id, formattedValue, tag_id, transaction_date);

        res.status(201).json({ message: "Despesa registrada com sucesso." });
    } catch (error) {
        console.error("Erro ao registrar despesa:", error);
        res.status(500).json({ error: "Erro ao registrar despesa." });
    }
};

export const getExpensesByUser = (req: Request, res: Response): void => {
    const { user_id } = req.params;
    console.log("User ID recebido:", req.params.user_id);
    
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
        const stmt = db.prepare("SELECT * FROM expense WHERE user_id = ? ORDER BY transaction_date DESC");
        const expenses = stmt.all(userId);

        if (!expenses || expenses.length === 0) {
            res.status(404).json({ error: "Nenhuma despesa encontrada para o usuário especificado." });
            return;
        }

        res.status(200).json({ expenses });
    } catch (error) {
        console.error("Erro ao buscar despesas:", error);
        res.status(500).json({ error: "Erro interno no servidor." });
    }
};