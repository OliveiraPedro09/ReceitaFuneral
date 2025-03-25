import { Router } from "express";
import { createRevenue } from "../controllers/revenueController";
import { createExpense } from "../controllers/expenseController";
import { authenticateToken } from "../middlewares/userValidation";

const router = Router();

router.post("/revenue", createRevenue, authenticateToken);
router.post("/expense", createExpense, authenticateToken);

export default router;