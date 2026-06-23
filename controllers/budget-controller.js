import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import Budget from "../models/budget.js";
import category from "../models/category.js";
import mongoose from "mongoose";

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
    const budget = await Budget.findOne({ user: req.user.id, _id: id }).select(
      "user category limit period startDate",
    );
    if (!budget) {
      const err = new NotFoundError("Budget doesn't exist");
      return next(err);
    }

    let spent = 0;
    let percentage = 0;


    return res.status(StatusCodes.OK).json({
      success: true,
      data: budget,
      message: "successful",
    });
  } catch (error) {
    next(error);
  }
};

export { createBudget, getBudget };
