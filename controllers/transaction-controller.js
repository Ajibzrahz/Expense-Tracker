import { StatusCodes } from "http-status-codes";
import transaction from "../models/transaction.js";
import category from "../models/category.js";
import { NotFoundError } from "../errors/index.js";

const createTransaction = async (req, res, next) => {
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
    const newTransaction = await transaction.create({
      ...payload,
      user: id,
    });

    return res.status(StatusCodes.CREATED).json({
      message: "transaction created sucessfully",
      data: newTransaction,
    });
  } catch (error) {
    next(error);
  }
};

export { createTransaction };
