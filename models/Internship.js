const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
    {
        company: { type: String, required: true, trim: true },
        role: { type: String, default: "" },
        status: {
            type: String,
            enum: ["Applied", "OA/Test", "Interview", "Offer", "Rejected", "Withdrawn"],
            default: "Applied",
        },
        applyLink: { type: String, default: "" },
        deadline: { type: String, default: "" },
        notes: { type: String, default: "" },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Internship", internshipSchema);
