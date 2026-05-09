import Joi from "joi";

const createTransactionValidation = Joi.object({
  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be greater than 0",
    "any.required": "Amount is required",
  }),

  type: Joi.string().valid("expense", "income").required().messages({
    "any.only": "Type must be expense or income",
    "any.required": "Transaction type is required",
  }),

  description: Joi.string().max(1000).allow("").optional().messages({
    "string.max": "Description cannot exceed 1000 characters",
  }),

  category: Joi.string().required().messages({
    "any.required": "Category is required",
  }),

  date: Joi.date().optional().messages({
    "date.base": "Invalid date",
  }),
});

export { createTransactionValidation };
