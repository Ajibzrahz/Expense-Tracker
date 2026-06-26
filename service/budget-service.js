import transaction from "../models/transaction.js";
import { getBudgetPeriod } from "../utils/budget-period.js";
import mongoose from "mongoose";

const calculateBudgetProgress = async (budget) => {
  const startDate = budget.startDate;
  const endDate = getBudgetPeriod(startDate, budget.period);

  const categoryId = budget.category?._id ?? budget.category;

  const result = await transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(budget.user),
        category: new mongoose.Types.ObjectId(categoryId),
        type: "expense",
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        spent: { $sum: "$amount" },
      },
    },
  ]);

  const spent = result[0]?.spent || 0;
  const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

  return { spent, percentage, endDate };
};

export { calculateBudgetProgress };
