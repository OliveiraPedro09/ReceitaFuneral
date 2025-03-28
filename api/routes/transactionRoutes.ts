import { Router } from "express";
import { createRevenue } from "../controllers/revenueController";
import { createExpense, getExpensesByUser } from "../controllers/expenseController";
import { authenticateToken } from "../middlewares/userValidation";
import { getLastBalance } from "../controllers/balanceController";
import { getLastTransactions } from "../controllers/transactionController";

const router = Router();

router.post("/revenue", createRevenue, authenticateToken);
router.post("/expense", createExpense, authenticateToken);
router.get("/balance/:user_id", getLastBalance, authenticateToken);
router.get("/expenses/:user_id", getExpensesByUser, authenticateToken);
router.get("/transactions/:user_id", getLastTransactions, authenticateToken);

export default router;