const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        issuer: { type: String, required: true, trim: true },
        category: {
            type: String,
            enum: ["Course", "Internship", "Hackathon", "Certification Exam", "Workshop", "Other"],
            default: "Other",
        },
        issueDate: { type: String, default: "" },
        credentialUrl: { type: String, default: "" },
        image: { type: String, default: "" },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Certificate", certificateSchema);
