const Project = require("../models/Project");
const DsaProblem = require("../models/DsaProblem");
const Job = require("../models/Job");
const LearningItem = require("../models/LearningItem");
const Certificate = require("../models/Certificate");
const Notification = require("../models/Notification");

exports.studentDashboard = async (req, res) => {
    try {
        const userId = req.session.user.id;

        const [
            totalProjects,
            planningProjects,
            progressProjects,
            completedProjects,
            dsaSolvedCount,
            dsaTotalCount,
            activeJobsCount,
            learningItemsCount,
            certificatesCount,
            recentProjects,
            recentNotifications,
        ] = await Promise.all([
            Project.countDocuments({ user: userId }),
            Project.countDocuments({ user: userId, status: "Planning" }),
            Project.countDocuments({ user: userId, status: "In Progress" }),
            Project.countDocuments({ user: userId, status: "Completed" }),
            DsaProblem.countDocuments({ user: userId, status: "Solved" }),
            DsaProblem.countDocuments({ user: userId }),
            Job.countDocuments({ user: userId, status: { $in: ["Applied", "Interviewing"] } }),
            LearningItem.countDocuments({ user: userId }),
            Certificate.countDocuments({ user: userId }),
            Project.find({ user: userId }).sort({ updatedAt: -1 }).limit(3),
            Notification.find({ user: userId, isRead: false }).sort({ createdAt: -1 }).limit(3),
        ]);

        res.render("student/dashboard", {
            user: req.session.user,
            totalProjects,
            planningProjects,
            progressProjects,
            completedProjects,
            dsaSolvedCount,
            dsaTotalCount,
            activeJobsCount,
            learningItemsCount,
            certificatesCount,
            recentProjects,
            recentNotifications,
        });

    } catch (error) {
        console.error("Dashboard Load Error:", error);
        res.status(500).render("errors/500", { message: "Unable to load student dashboard." });
    }
};