const mongoose = require("mongoose");

const dsaProblemSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        platform: { type: String, default: "LeetCode" },
        topic: { type: String, default: "" },
        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Medium",
        },
        status: {
            type: String,
            enum: ["Todo", "Solved", "Needs Revision"],
            default: "Todo",
        },
        link: { type: String, default: "" },
        notes: { type: String, default: "" },
        solvedDate: { type: String, default: "" },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("DsaProblem", dsaProblemSchema);
