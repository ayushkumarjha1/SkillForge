const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        company: { type: String, required: true, trim: true },
        role: { type: String, default: "" },
        status: {
            type: String,
            enum: ["Wishlist", "Applied", "Interview", "Offer", "Rejected"],
            default: "Wishlist",
        },
        applyLink: { type: String, default: "" },
        location: { type: String, default: "" },
        salary: { type: String, default: "" },
        notes: { type: String, default: "" },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
