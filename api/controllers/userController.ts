import { Request, Response } from "express";
import db from "../database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../types/User";

const SECRET_KEY = process.env.JWT_SECRET || "minha_chave_secreta";

// registrar
export const createUser = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, cpf, budget, goal } = req.body;

    if (!name || !email || !password || !cpf) {
        res.status(400).json({ error: "Todos os campos são obrigatórios." });
        return;
    }

    const checkStmt = db.prepare("SELECT * FROM users WHERE email = ? OR cpf = ?");
    const user = checkStmt.get(email, cpf);

    if (user) {
        res.status(400).json({ error: "Usuário já existe." });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertUserStmt = db.prepare(
        "INSERT INTO users (name, email, password, cpf, budget, goal) VALUES (?, ?, ?, ?, ?, ?)"
    );

    try {
        const result = insertUserStmt.run(name, email, hashedPassword, cpf, budget ?? 0, goal ?? 0);
        const userId = result.lastInsertRowid as number;

        const insertBalanceStmt = db.prepare("INSERT INTO balance (user_id, value) VALUES (?, ?)");
        insertBalanceStmt.run(userId, 0);

        res.status(201).json({ message: "Usuário registrado com sucesso." });
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        res.status(500).json({ error: "Erro interno no servidor." });
    }
};

// login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        res.status(400).json({ error: "E-mail e senha são obrigatórios." });
        return;
    }

    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    const user = stmt.get(email) as User | undefined;
    if (!user) {
        res.status(404).json({ error: "Usuário não encontrado." });
        return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        res.status(401).json({ error: "Senha incorreta." });
        return;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

    // Inclua o userId na resposta
    res.json({ message: "Login realizado com sucesso.", token, userId: user.id });
};

// editar
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, email, cpf, budget, goal } = req.body;

    const stmt = db.prepare(
        "UPDATE users SET name = ?, email = ?, cpf = ?, budget = ?, goal = ? WHERE id = ?"
    );

    try {
        stmt.run(name, email, cpf, budget, goal, id);
        res.json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// deletar
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const stmt = db.prepare("DELETE FROM users WHERE id = ?");
    stmt.run(id);

    res.json({ message: "User successfully deleted" });
};

// visualizar
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const stmt = db.prepare("SELECT id, name, email, cpf, budget, goal FROM users WHERE id = ?");
    const user = stmt.get(id) as Omit<User, "password"> | undefined;

    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    res.json(user);
};

