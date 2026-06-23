import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    limit: {
      type: Number,
      required: true,
      min: 0,
    },
    period: {
      type: String,
      enum: ["monthly", "weekly", "daily", "custom"],
      default: "monthly",
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now,
    }
  },
  { timestamps: true },
);

const Budget = mongoose.model("Budget", budgetSchema)
export default Budget