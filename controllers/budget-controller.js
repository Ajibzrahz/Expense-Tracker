import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import Budget from "../models/budget.js";
import category from "../models/category.js";
import mongoose from "mongoose";
import transaction from "../models/transaction.js";

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

    res.status(StatusCodes.OK).json({
      success: true,
      data: newBudget,
      message: "Budget created",
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

    const startDate = budget.startDate;
    const endDate = new Date(startDate);

    switch (budget.period) {
      case "weekly":
        endDate.setDate(endDate.getDate() + 7);
        break;

      case "monthly":
        endDate.setMonth(endDate.getMonth() + 1);
        break;

      case "yearly":
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }

    const result = await transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(budget.user),
          category: new mongoose.Types.ObjectId(budget.category),
          type: "expense",
          createdAt: {
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
    const percentage = (spent / budget.limit) * 100;

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
    const {id} = req.user
}

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
    );

    return res
      .status(StatusCodes.CREATED)
      .json({
        success: true,
        data: updatebudget,
        message: "budget updated successfully",
      });
  } catch (error) {
    next(error);
  }
};

const deleteBudget = async (req, res , next) => {
    const {id} = req.params

    try {
        const budget = await Budget.findOne({ user: req.user.id, _id: id });
    if (!budget) {
      const err = new NotFoundError("Budget not found");
      return next(err);
    }

    await Budget.findOneAndDelete(
      {
        user: req.user.id,
        _id: id,
      },
    );

    return res
      .status(StatusCodes.CREATED)
      .json({
        success: true,
        message: "budget updated successfully",
      });
    } catch (error) {
        next(error)
    }
}
export { createBudget, getBudget, updateBudget, deleteBudget };
