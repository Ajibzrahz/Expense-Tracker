import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/index.js";
import category from "../models/category.js";
import User from "../models/user.js";


const createCategory = async (req, res, next) => {
  const { id } = req.user;
  const { name, type } = req.body;
  try {
    const getCategory = await category.findOne({ user: id, name, type });
    if (getCategory) {
      const err = new Error("category already exist");
      err.status = StatusCodes.CONFLICT;
      return next(err);
    }

    const create_category = await category.create({
      name,
      type,
      user: id,
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "created", category: create_category });
  } catch (error) {
    next(error);
  }
};

const getUserCatgory = async (req, res, next) => {
  const { id } = req.user;
  const { type } = req.query;

  try {
    if (type && !["income", "expense"].includes(type)) {
      throw new BadRequestError("Invalid category type");
    }
    const filter = { user: id };

    if (type) {
      filter.type = type;
    }

    const categories = await category
      .find(filter)
      .sort({ name: 1 })
      .collation({ locale: "en", strength: 2 });

    return res.status(StatusCodes.OK).json({
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const categoryExist = await category.findOne({
      _id: id,
      user: req.user.id,
    });
    if (!categoryExist) {
      const err = new NotFoundError("category does not exist");
      return next(err);
    }

    await category.findByIdAndDelete(id);

    return res.status(StatusCodes.OK).json({ suuccess: true });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const categoryExist = await category.findOne({
      _id: id,
      user: req.user.id,
    });
    if (!categoryExist) {
      const err = new NotFoundError("category does not exist");
      return next(err);
    }

    categoryExist.name = req.body.name;

    const updateCategory = await categoryExist.save();

    return res.status(StatusCodes.OK).json({ suuccess: true, updateCategory });
  } catch (error) {
    next(error);
  }
};
export { createCategory, getUserCatgory, deleteCategory, updateCategory };
