import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import {
  getOverviewChart,
  getSummary,
  getTrendChart,
} from "../controllers/dashboard-controller.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/summary", getSummary);
router.get("/overview", getOverviewChart);
router.get("/trends", getTrendChart);

export default router;
