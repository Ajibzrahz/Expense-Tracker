import express from "express";
import {
  createCategory,
  deleteCategory,
  getUserCatgory,
  updateCategory,
} from "../controllers/category-controller.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticateUser);

router
  .route("")
  .post(createCategory)
  .get(getUserCatgory)
router
  .route("/:id")  
  .delete(deleteCategory)
  .patch(updateCategory);

export default router;
