import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import transaction from "../models/transaction.js";

const getSummary = async (req, res, next) => {
  const { id } = req.user;
  try {
    const transactions = await transaction.find({ user: id });

    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach((t) => {
      if (t.type === "income") totalIncome += t.amount;
      else totalExpense += t.amount;
    });

    const balance = totalIncome - totalExpense;
    const savingsRate =
      totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

    res.status(StatusCodes.OK).json({
      success: true,
      summary: { totalIncome, totalExpense, balance, savingsRate },
    });
  } catch (error) {
    next(error);
  }
};

// Returns 12 rows (Jan..Dec) for THIS year, each: { month, income, expense }
const getOverviewChart = async (req, res, next) => {
  const { id } = req.user;
  try {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);

    const grouped = await transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(id),
          date: { $gte: startOfYear },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$date" }, type: "$type" },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    // build 12 rows initialised to zero
    const data = months.map((m) => ({ month: m, income: 0, expense: 0 }));
    grouped.forEach((g) => {
      const idx = g._id.month - 1; // $month is 1-12
      if (g._id.type === "income") data[idx].income = g.totalAmount;
      else data[idx].expense = g.totalAmount;
    });

    return res.status(StatusCodes.OK).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Returns 7 rows (oldest first) for the last 7 days, each: { date: "YYYY-MM-DD", total }
const getTrendChart = async (req, res, next) => {
  const { id } = req.user;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 7 days incl. today

    const grouped = await transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(id),
          type: "expense",
          date: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          total: { $sum: "$amount" },
        },
      },
    ]);

    // map results, then fill every day in the window (zeros for missing days)
    const byDate = {};
    grouped.forEach((g) => {
      byDate[g._id] = g.total;
    });

    const data = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      data.push({ date: key, total: byDate[key] || 0 });
    }

    return res.status(StatusCodes.OK).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export { getSummary, getOverviewChart, getTrendChart };
