import { Router } from "express";
import { createUser, deleteUser, getUserById, loginUser, updateUser } from "../controllers/userController";
import { authenticateToken } from "../middlewares/userValidation";

const router = Router();

router.post("/register", createUser);

router.post("/login", loginUser);

router.put("/profile/:id", updateUser);

router.delete("/profile/:id", deleteUser);

router.get("/profile/:id", getUserById);

export default router;