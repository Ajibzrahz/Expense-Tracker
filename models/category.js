import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        maxLength: 20,
        required: true
    },
    type: {
        type: String,
        enum: ["expense", "income"],
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

const category = mongoose.model("Category", categorySchema)
export default category