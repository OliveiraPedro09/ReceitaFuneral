import { Router } from "express";
import { createTag, getTagsByUser, deleteTag } from "../controllers/tagController";
import { authenticateToken } from "../middlewares/userValidation";

const router = Router();

router.post("/tags", authenticateToken, createTag);
router.get("/tags/:user_id", authenticateToken, getTagsByUser);
router.delete("/tags/:id", authenticateToken, deleteTag);

export default router;