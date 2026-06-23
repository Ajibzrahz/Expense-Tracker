import express from "express";
import { createBudget, getBudget } from "../controllers/budget-controller.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticateUser);

router.route("").post(createBudget);
router.get("/:id", getBudget);

export default router;
