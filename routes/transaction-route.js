import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  getTransactions,
  updateTransaction,
} from "../controllers/transaction-controller.js";
import { createTransactionValidation } from "../validators/transaction-validator.js";
import validator from "../middleware/validator.js";

const router = express.Router();

router.use(authenticateUser);

router
  .route("")
  .post(validator(createTransactionValidation), createTransaction)
  .get(getTransactions);

router
  .route("/:id")
  .get(getTransaction)
  .put(updateTransaction)
  .delete(deleteTransaction);

export default router;
