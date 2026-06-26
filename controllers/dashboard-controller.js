import { StatusCodes } from "http-status-codes";
import NotFoundError from "../errors/not-found.js";
import transaction from "../models/transaction.js";

const getSummary = async (req, res, next) => {
  const { id } = req.user;

  try {
    const transactions = await transaction.find({ user: id });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") {
        totalIncome += t.amount;
      } else {
        totalExpense += t.amount;
      }
    });
    const balance = totalIncome - totalExpense;

    const savingsRate =
      totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      summary: {
        totalIncome,
        totalExpense,
        balance,
        savingsRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOverviewChart = async (req, res, next) => {
  const { id } = req.user;

  try {
    const groupTransactions = await transaction.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            type: "$type",
          },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    if (!groupTransactions) {
      return res.json({ message: "you don't have any transaction yet" });
    }

    return res.status(StatusCodes.OK).json(groupTransactions);
  } catch (error) {
    next(error);
  }
};

const getTrendChart = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const groupTransactions = await transaction.aggregate([
      {
        $match: {
          type: "expense",
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
          },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    return res.status(StatusCodes.OK).json(groupTransactions);
  } catch (error) {
    next(error);
  }
};

const getCategoriesBreakdown = async (req, res, next) => {
  
}
export { getSummary, getOverviewChart, getTrendChart, };
