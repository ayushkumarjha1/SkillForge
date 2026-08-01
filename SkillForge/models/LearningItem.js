const mongoose = require("mongoose");

const learningItemSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        platform: { type: String, default: "" },
        category: {
            type: String,
            enum: ["Course", "Roadmap", "Book", "YouTube Series", "Other"],
            default: "Course",
        },
        status: {
            type: String,
            enum: ["Not Started", "In Progress", "Completed"],
            default: "Not Started",
        },
        progress: { type: Number, min: 0, max: 100, default: 0 },
        link: { type: String, default: "" },
        notes: { type: String, default: "" },
        revisionDate: { type: String, default: "" },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("LearningItem", learningItemSchema);
