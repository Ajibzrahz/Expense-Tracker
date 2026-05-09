import { StatusCodes } from "http-status-codes";

const showCurrentUser = async (req, res, next) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

export { showCurrentUser };
