import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      maxLength: 50,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["expense", "income"],
      required: true,
    },
    description: {
      type: String,
      maxLength: 1000,
    },
    Date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const transaction = mongoose.model("Transaction", transactionSchema)
export default transactionransaction