import transaction from "../models/transaction";

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

      const balance = totalIncome - totalExpense;

      const savingsRate =
        totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;
    });

    res.status(200).json({
      success: true,
      summary: {
        totalIncome,
        totalExpenses,
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
    const transactions = await transaction
      .find({ user: id })
      .select("amount type date");
    if (!transactions) {
      return res.json({ message: "you don't have any transaction" });
    }
  } catch (error) {
    next(error);
  }
};
export { getSummary };
