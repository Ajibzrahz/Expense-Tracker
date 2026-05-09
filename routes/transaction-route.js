import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import { createTransaction } from "../controllers/transaction-controller.js";
import { createTransactionValidation } from "../validators/transaction-validator.js";
import validator from "../middleware/validator.js";

const router = express.Router();

router.use(authenticateUser);

router.post("/", validator(createTransactionValidation), createTransaction);
export default router;
