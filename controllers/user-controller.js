import { StatusCodes } from "http-status-codes";
import User from "../models/user.js";

const showCurrentUser = async (req, res, next) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateProfile = async (req, res, next) => {
  const { id } = req.user;
  const { name, email } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    const updateUser = await User.findByIdAndUpdate(
      id,
      { name: name, email: email },
      { new: true },
    ).select("-password");

    return res
      .status(StatusCodes.OK)
      .json({ success: true, data: updateUser, message: "profile updated" });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  const { id } = req.user;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(id).select("+password");
    if (!user) {
      return next(new NotFoundError("User not found"));
    }
    const checkCredentials = await user.comparePassword(oldPassword);
    if (!checkCredentials) {
      const err = new UnauthenticatedError("Incorrect Credentials");
      return next(err);
    }

    const isSamePassword = await user.comparePassword(newPassword);

    if (isSamePassword) {
      return next(
        new BadRequestError("New password must be different from old password"),
      );
    }

    user.password = newPassword;

    await user.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "your password has been changed",
    });
  } catch (error) {
    next(error);
  }
};
export { showCurrentUser, updateProfile, changePassword };
