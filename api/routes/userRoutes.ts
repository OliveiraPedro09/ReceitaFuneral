import { Router } from "express";
import { createUser, deleteUser, getUserById, loginUser, updateUser } from "../controllers/userController";
import { authenticateToken } from "../middlewares/userValidation";

const router = Router();

router.post("/register", createUser);

router.post("/login", loginUser);

router.put("/profile/:id", updateUser, authenticateToken);

router.delete("/profile/:id", deleteUser, authenticateToken);

router.get("/profile/:id", getUserById, authenticateToken);

export default router;