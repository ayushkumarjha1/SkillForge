const mongoose = require("mongoose");

const careerItemSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        type: {
            type: String,
            enum: ["Goal", "Task", "Habit"],
            default: "Task",
        },
        targetDate: { type: String, default: "" },
        status: {
            type: String,
            enum: ["Not Started", "In Progress", "Done"],
            default: "Not Started",
        },
        notes: { type: String, default: "" },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("CareerItem", careerItemSchema);
