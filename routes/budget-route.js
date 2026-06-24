import express from "express";
import {
  createBudget,
  deleteBudget,
  getBudget,
  updateBudget,
} from "../controllers/budget-controller.js";
import { authenticateUser } from "../middleware/auth.js";
import validator from "../middleware/validator.js";
import {
  createBudgetSchema,
  updateBudgetSchema,
} from "../validators/budget-validator.js";

const router = express.Router();
router.use(authenticateUser);

router.route("").post(validator(createBudgetSchema), createBudget);
router
  .route("/:id")
  .get(getBudget)
  .put(validator(updateBudgetSchema), updateBudget)
  .delete(deleteBudget);

export default router;
