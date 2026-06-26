import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import Budget from "../models/budget.js";
import category from "../models/category.js";
import { calculateBudgetProgress } from "../service/budget-service.js";

const createBudget = async (req, res, next) => {
  const { id } = req.user;
  const payload = req.body;

  try {
    const categoryExist = await category.findOne({
      user: id,
      _id: payload.category,
    });
    if (!categoryExist) {
      const err = new NotFoundError("Category does not exist");
      return next(err);
    }

    const existingBudget = await Budget.findOne({
      user: id,
      category: payload.category,
    });
    if (existingBudget) {
      const err = new BadRequestError(
        "Budget already exist, update budget to preference",
      );
      return next(err);
    }

    const newBudget = await Budget.create({
      ...payload,
      user: id,
    });

    const { spent, percentage, endDate } =
      await calculateBudgetProgress(newBudget);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        ...newBudget.toObject(),
        spent,
        percentage,
        endDate,
      },
      message: "budget created successfully",
    });
  } catch (error) {
    next(error);
  }
};
const getBudget = async (req, res, next) => {
  const { id } = req.params;

  try {
    const budget = await Budget.findOne({ user: req.user.id, _id: id })
      .select("user category limit period startDate")
      .populate("category");
    if (!budget) {
      const err = new NotFoundError("Budget doesn't exist");
      return next(err);
    }

    const { spent, percentage, endDate } =
      await calculateBudgetProgress(budget);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        ...budget.toObject(),
        spent,
        percentage,
        endDate,
      },
      message: "successful",
    });
  } catch (error) {
    next(error);
  }
};

const getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({
      user: req.user.id,
    }).populate("category");

    const data = await Promise.all(
      budgets.map(async (budget) => {
        const { spent, percentage, endDate } =
          await calculateBudgetProgress(budget);

        return {
          ...budget.toObject(),
          spent,
          percentage,
          endDate,
        };
      }),
    );

    res.status(StatusCodes.OK).json(data);
  } catch (error) {
    next(error);
  }
};

const updateBudget = async (req, res, next) => {
  const { id } = req.params;
  const payload = req.body;

  try {
    const budget = await Budget.findOne({ user: req.user.id, _id: id });
    if (!budget) {
      const err = new NotFoundError("Budget not found");
      return next(err);
    }

    const updatebudget = await Budget.findOneAndUpdate(
      {
        user: req.user.id,
        _id: id,
      },
      payload,
      { new: true },
    ).populate("category");
    const { spent, percentage, endDate } =
      await calculateBudgetProgress(updatebudget);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        ...updatebudget.toObject(),
        spent,
        percentage,
        endDate,
      },
      message: "budget updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteBudget = async (req, res, next) => {
  const { id } = req.params;

  try {
    const budget = await Budget.findOne({ user: req.user.id, _id: id });
    if (!budget) {
      const err = new NotFoundError("Budget not found");
      return next(err);
    }

    await Budget.findOneAndDelete({
      user: req.user.id,
      _id: id,
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "budget updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
export { createBudget, getBudget, updateBudget, deleteBudget, getBudgets };
