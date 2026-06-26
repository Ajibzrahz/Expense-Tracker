import { StatusCodes } from "http-status-codes";
import transaction from "../models/transaction.js";
import category from "../models/category.js";
import { NotFoundError } from "../errors/index.js";
import { getPagination, buildPagination } from "../utils/pagination.js";

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
      success: true,
      data: newTransaction,
      message: "transaction created sucessfully",
    });
  } catch (error) {
    next(error);
  }
};


const getTransactions = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const filter = { user: req.user.id };
    // ...add type / category / date filters here...

    const [data, total] = await Promise.all([
      transaction
        .find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      transaction.countDocuments(filter),
    ]);

    return res.status(StatusCodes.OK).json({
      success: true,
      data,
      pagination: buildPagination({ page, limit, total }),
    });
  } catch (error) {
    next(error);
  }
};

const getTransaction = async (req, res, next) => {
  const { id } = req.params;
  try {
    const findtransaction = await transaction.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!findtransaction) {
      const err = new NotFoundError("Transaction does not exist");
      return next(err);
    }

    return res
      .status(StatusCodes.OK)
      .json({ success: true, data: findtransaction, message: "successful" });
  } catch (error) {
    next(error);
  }
};

const updateTransaction = async (req, res, next) => {
  const { id } = req.params;
  const { amount, description } = req.body;

  try {
    const findtransaction = await transaction.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!findtransaction) {
      const err = new NotFoundError("Transaction does not exist");
      return next(err);
    }

    findtransaction.amount = req.body.amount;
    findtransaction.description = req.body.description;

    const updatedtransaction = await findtransaction.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      data: findtransaction,
      message: "Transaction updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteTransaction = async (req, res, next) => {
  const { id } = req.params;
  try {
    const findtransaction = await transaction.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!findtransaction) {
      const err = new NotFoundError("Transaction does not exist");
      return next(err);
    }

    await transaction.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "transaction deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const stats = async (req, res, next) => {};

export {
  createTransaction,
  getTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  stats,
};
