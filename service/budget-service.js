import transaction from "../models/transaction.js";
import mongoose from "mongoose";

// Returns the start and end of the CURRENT period (this week/month/year),
// so the budget reflects what you've spent in the period you're in now.
const getCurrentPeriodWindow = (period) => {
  const now = new Date();
  let start, end;

  switch (period) {
    case "daily":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(start);
      end.setDate(end.getDate() + 1);
      break;
    case "weekly": {
      const day = now.getDay(); // 0 = Sun
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
      end = new Date(start);
      end.setDate(end.getDate() + 7);
      break;
    }
    case "yearly":
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear() + 1, 0, 1);
      break;
    case "monthly":
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      break;
  }
  return { start, end };
};

const calculateBudgetProgress = async (budget) => {
  const { start, end } = getCurrentPeriodWindow(budget.period);
  const categoryId = budget.category?._id ?? budget.category;

  const result = await transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(budget.user),
        category: new mongoose.Types.ObjectId(categoryId),
        type: "expense",
        date: { $gte: start, $lt: end },
      },
    },
    { $group: { _id: null, spent: { $sum: "$amount" } } },
  ]);

  const spent = result[0]?.spent || 0;
  const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

  return { spent, percentage, endDate: end };
};

export { calculateBudgetProgress };
