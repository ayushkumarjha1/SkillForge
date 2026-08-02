const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "mentor", "recruiter", "admin"],
      default: "student",
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 160,
    },

    about: {
      type: String,
      default: "",
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

    skills: {
      type: [String],
      default: [],
    },

    languages: {
      type: [String],
      default: [],
    },

    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      website: { type: String, default: "" },
    },

    resumeLink: {
      type: String,
      default: "",
    },

    portfolioLink: {
      type: String,
      default: "",
    },

    portfolioTheme: {
      type: String,
      enum: ["Dark", "Light"],
      default: "Dark",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);