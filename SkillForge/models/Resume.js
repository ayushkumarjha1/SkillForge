const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            default: "Untitled Resume",
            trim: true,
        },

        template: {
            type: String,
            enum: ["Modern", "Minimal", "Classic"],
            default: "Modern",
        },

        fullName: { type: String, default: "" },
        contactEmail: { type: String, default: "" },
        contactPhone: { type: String, default: "" },
        location: { type: String, default: "" },

        summary: { type: String, default: "" },

        skills: {
            type: [String],
            default: [],
        },

        education: {
            type: [
                {
                    institution: { type: String, required: true },
                    degree: { type: String, default: "" },
                    field: { type: String, default: "" },
                    startYear: { type: String, default: "" },
                    endYear: { type: String, default: "" },
                },
            ],
            default: [],
        },

        experience: {
            type: [
                {
                    company: { type: String, required: true },
                    role: { type: String, default: "" },
                    startDate: { type: String, default: "" },
                    endDate: { type: String, default: "" },
                    description: { type: String, default: "" },
                },
            ],
            default: [],
        },

        projects: {
            type: [
                {
                    title: { type: String, required: true },
                    description: { type: String, default: "" },
                    techStack: { type: String, default: "" },
                    link: { type: String, default: "" },
                },
            ],
            default: [],
        },

        certifications: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Resume", resumeSchema);
