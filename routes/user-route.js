import express from "express";
const router = express.Router();
import { authenticateUser } from "../middleware/auth.js";
import { showCurrentUser } from "../controllers/user-controller.js";

// router
//   .route('/')
//   .get(authenticateUser, authorizePermissions('admin'), getAllUsers);

router.route("/showMe").get(authenticateUser, showCurrentUser);
// router.route("/updateUser").patch(authenticateUser, updateUser);
// router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);

// router.route("/:id").get(authenticateUser, getSingleUser);

export default router;
