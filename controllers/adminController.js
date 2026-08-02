const User = require("../models/User");
const Project = require("../models/Project");
const DsaProblem = require("../models/DsaProblem");
const Job = require("../models/Job");
const Internship = require("../models/Internship");
const Certificate = require("../models/Certificate");

exports.dashboard = async (req, res) => {
    try {
        const [users, projectCount, dsaCount, jobCount, internshipCount, certCount] = await Promise.all([
            User.find().sort({ createdAt: -1 }),
            Project.countDocuments(),
            DsaProblem.countDocuments(),
            Job.countDocuments(),
            Internship.countDocuments(),
            Certificate.countDocuments(),
        ]);

        const roleCounts = users.reduce((acc, u) => {
            acc[u.role] = (acc[u.role] || 0) + 1;
            return acc;
        }, {});

        const stats = {
            totalUsers: users.length,
            roleCounts,
            projectCount,
            dsaCount,
            jobCount,
            internshipCount,
            certCount,
        };

        res.render("admin/dashboard", { users, stats });

    } catch (error) {
        console.log(error);
        res.send("Unable to load admin dashboard.");
    }
};

exports.deleteUser = async (req, res) => {
    try {
        // Prevent an admin from deleting their own account through this panel by accident
        if (req.params.id === req.session.user.id) {
            return res.send("You can't delete your own account from here.");
        }

        await User.findByIdAndDelete(req.params.id);
        res.redirect("/admin");

    } catch (error) {
        console.log(error);
        res.send("Unable to delete user.");
    }
};

exports.changeUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const allowedRoles = ["student", "mentor", "recruiter", "admin"];

        if (!allowedRoles.includes(role)) {
            return res.send("Invalid role.");
        }

        await User.findByIdAndUpdate(req.params.id, { role });
        res.redirect("/admin");

    } catch (error) {
        console.log(error);
        res.send("Unable to update role.");
    }
};
