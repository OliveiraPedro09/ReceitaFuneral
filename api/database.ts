import Database from "better-sqlite3";

const db = new Database("database.sqlite", { verbose: console.log });

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        cpf TEXT NOT NULL,
        budget FLOAT,
        goal FLOAT
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS balance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        value FLOAT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS revenue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        value FLOAT NOT NULL,
        tag_id INTEGER NOT NULL,
        transaction_date DATE NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(tag_id) REFERENCES tags(id)
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS expense (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        value FLOAT NOT NULL,
        tag_id INTEGER NOT NULL,
        transaction_date DATE NOT NULL,
        billing_date DATE,
        due_date DATE NOT NULL,
        is_paid BOOLEAN DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(tag_id) REFERENCES tags(id)
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        value FLOAT NOT NULL,
        tag_id INTEGER NOT NULL,
        transaction_date DATE NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('expense', 'revenue')),
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(tag_id) REFERENCES tags(id)
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL UNIQUE,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
`);

export default db;
