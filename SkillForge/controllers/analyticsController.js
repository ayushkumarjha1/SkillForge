const Project = require("../models/Project");
const DsaProblem = require("../models/DsaProblem");
const LearningItem = require("../models/LearningItem");
const Internship = require("../models/Internship");
const Job = require("../models/Job");
const Certificate = require("../models/Certificate");

exports.viewAnalytics = async (req, res) => {
    try {
        const userId = req.session.user.id;

        const [projects, dsaProblems, learningItems, internships, jobs, certificates] = await Promise.all([
            Project.find({ user: userId }),
            DsaProblem.find({ user: userId }),
            LearningItem.find({ user: userId }),
            Internship.find({ user: userId }),
            Job.find({ user: userId }),
            Certificate.find({ user: userId }),
        ]);

        const countBy = (arr, field) => {
            const counts = {};
            arr.forEach((item) => {
                const key = item[field] || "Unspecified";
                counts[key] = (counts[key] || 0) + 1;
            });
            return counts;
        };

        const data = {
            projects: {
                total: projects.length,
                byStatus: countBy(projects, "status"),
                byCategory: countBy(projects, "category"),
            },
            dsa: {
                total: dsaProblems.length,
                solved: dsaProblems.filter((p) => p.status === "Solved").length,
                byDifficulty: countBy(dsaProblems.filter((p) => p.status === "Solved"), "difficulty"),
            },
            learning: {
                total: learningItems.length,
                byStatus: countBy(learningItems, "status"),
            },
            internships: {
                total: internships.length,
                byStatus: countBy(internships, "status"),
            },
            jobs: {
                total: jobs.length,
                byStatus: countBy(jobs, "status"),
            },
            certificates: {
                total: certificates.length,
            },
        };

        res.render("analytics/index", { data });

    } catch (error) {
        console.log(error);
        res.send("Unable to load analytics.");
    }
};
