import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  updateTransaction,
} from "../controllers/transaction-controller.js";
import { createTransactionValidation } from "../validators/transaction-validator.js";
import validator from "../middleware/validator.js";

const router = express.Router();

router.use(authenticateUser);

router.post("/", validator(createTransactionValidation), createTransaction);

router
  .route("/:id")
  .get(getTransaction)
  .put(updateTransaction)
  .delete(deleteTransaction);

export default router;
