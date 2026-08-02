const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const Project = require("../models/Project");
const Resume = require("../models/Resume");
const Certificate = require("../models/Certificate");
const Internship = require("../models/Internship");
const Job = require("../models/Job");
const LearningItem = require("../models/LearningItem");
const DsaProblem = require("../models/DsaProblem");
const CareerItem = require("../models/CareerItem");
const Notification = require("../models/Notification");
const { coverDir, avatarDir, certificateDir } = require("../config/upload");

const removeFile = (dir, filename) => {
    if (!filename) return;
    fs.unlink(path.join(dir, filename), (err) => {
        if (err && err.code !== "ENOENT") console.error(`Failed to remove ${dir}/${filename}:`, err.message);
    });
};

exports.settingsPage = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        res.render("settings/index", { profileUser: user, error: null, success: null });
    } catch (error) {
        console.log(error);
        res.send("Unable to load settings.");
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const user = await User.findById(req.session.user.id);

        if (!user) return res.send("User not found.");

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.render("settings/index", { profileUser: user, error: "Current password is incorrect.", success: null });
        }

        if (newPassword !== confirmPassword) {
            return res.render("settings/index", { profileUser: user, error: "New passwords do not match.", success: null });
        }

        if (!newPassword || newPassword.length < 6) {
            return res.render("settings/index", { profileUser: user, error: "New password must be at least 6 characters.", success: null });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.render("settings/index", { profileUser: user, error: null, success: "Password updated successfully." });

    } catch (error) {
        console.log(error);
        res.send("Unable to update password.");
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.session.user.id;

        const user = await User.findById(userId);
        const projects = await Project.find({ user: userId }, "coverImage");
        const certificates = await Certificate.find({ user: userId }, "image");

        // Clean up files on disk before removing the DB records that reference them
        if (user && user.avatar) removeFile(avatarDir, user.avatar);
        projects.forEach((p) => removeFile(coverDir, p.coverImage));
        certificates.forEach((c) => removeFile(certificateDir, c.image));

        // Remove all data owned by this user across every module
        await Promise.all([
            Project.deleteMany({ user: userId }),
            Resume.deleteMany({ user: userId }),
            Certificate.deleteMany({ user: userId }),
            Internship.deleteMany({ user: userId }),
            Job.deleteMany({ user: userId }),
            LearningItem.deleteMany({ user: userId }),
            DsaProblem.deleteMany({ user: userId }),
            CareerItem.deleteMany({ user: userId }),
            Notification.deleteMany({ user: userId }),
        ]);

        await User.findByIdAndDelete(userId);

        req.session.destroy(() => {
            res.redirect("/login");
        });
    } catch (error) {
        console.log(error);
        res.send("Unable to delete account.");
    }
};
