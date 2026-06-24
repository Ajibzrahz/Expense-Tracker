import Joi from "joi";

export const createBudgetSchema = Joi.object({
  category: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.empty": "Category is required",
      "string.length": "Invalid category ID",
    }),

  limit: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "Limit must be a number",
      "number.min": "Limit cannot be negative",
    }),

  period: Joi.string()
    .valid("monthly", "weekly", "daily", "custom")
    .default("monthly"),

  startDate: Joi.date().optional(),
});

export const updateBudgetSchema = Joi.object({
  category: Joi.string()
    .hex()
    .length(24),

  limit: Joi.number()
    .min(0),

  period: Joi.string()
    .valid("monthly", "weekly", "daily", "custom"),

  startDate: Joi.date(),
})
.min(1)
.messages({
  "object.min": "At least one field is required for update",
});