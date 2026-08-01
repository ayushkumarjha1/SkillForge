const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        techStack: {
            type: String,
            required: true,
        },

        githubLink: {
            type: String,
            default: "",
        },

        liveLink: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: ["Planning", "In Progress", "Completed"],
            default: "Planning",
        },

        category: {
            type: String,
            enum: [
                "Web App",
                "Mobile App",
                "AI/ML",
                "Data Science",
                "Game Dev",
                "DevOps/Tools",
                "Other",
            ],
            default: "Other",
        },

        tags: {
            type: [String],
            default: [],
        },

        coverImage: {
            type: String,
            default: "",
        },

        featured: {
            type: Boolean,
            default: false,
        },

        statusHistory: {
            type: [
                {
                    status: {
                        type: String,
                        enum: ["Planning", "In Progress", "Completed"],
                        required: true,
                    },
                    changedAt: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
            default: [],
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Project", projectSchema);