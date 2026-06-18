import express from "express";
const router = express.Router();
import { authenticateUser } from "../middleware/auth.js";
import { changePassword, showCurrentUser, updateProfile } from "../controllers/user-controller.js";

router.use(authenticateUser)

router.get("/showMe", showCurrentUser);
router.put("/profile", updateProfile)
router.post("/password", changePassword)

export default router;
