import express from "express";
import {
  forgotPassword,
  getProfile,
  googleLogin,
  login,
  logout,
  register,
  resetPassword,
  verifyEmail,
} from "../controllers/auth-controller.js";
import {
  loginValidation,
  registerValidation,
} from "../validators/user-validator.js";
import validator from "../middleware/validator.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", validator(registerValidation), register);
router.post("/login", validator(loginValidation), login);
router.delete("/logout", authenticateUser, logout);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/google-login", googleLogin);
router.get("/profile", authenticateUser, getProfile);

export default router;
