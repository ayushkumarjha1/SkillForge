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
                const key = item[field] || "Other";
                counts[key] = (counts[key] || 0) + 1;
            });
            return counts;
        };

        // Calculate Career Readiness Index (0 - 100)
        let score = 20; // Base baseline
        score += Math.min(projects.filter(p => p.status === "Completed").length * 15 + projects.length * 5, 30);
        score += Math.min(dsaProblems.filter(p => p.status === "Solved").length * 3, 25);
        score += Math.min(learningItems.filter(l => l.status === "Completed").length * 5 + learningItems.length * 2, 15);
        score += Math.min((jobs.length + internships.length) * 5, 15);
        score += Math.min(certificates.length * 8, 15);
        score = Math.min(Math.round(score), 100);

        let readinessTier = "Beginner Explorer";
        if (score >= 80) readinessTier = "Senior Production Ready";
        else if (score >= 60) readinessTier = "Mid-Level Job Ready";
        else if (score >= 40) readinessTier = "Junior Developer Ready";

        // Aggregate Tech Skills from projects
        const techCounts = {};
        projects.forEach(p => {
            if (p.techStack) {
                p.techStack.split(/[,/| ]+/).forEach(t => {
                    const clean = t.trim();
                    if (clean.length > 1) {
                        techCounts[clean] = (techCounts[clean] || 0) + 1;
                    }
                });
            }
        });

        // Generate dynamic intelligent recommendations
        const milestones = [];
        if (projects.length < 2) {
            milestones.push({ title: "Build 2 Full-Stack Projects", desc: "Showcase comprehensive CRUD and authentication workflows", done: projects.length >= 2, link: "/projects/add" });
        } else {
            milestones.push({ title: "Portfolio Projects Verified", desc: `${projects.length} repositories documented`, done: true, link: "/projects" });
        }

        if (dsaProblems.filter(p => p.status === "Solved").length < 15) {
            milestones.push({ title: "Solve 15+ Core DSA Problems", desc: "Focus on Arrays, Dynamic Programming, and Binary Trees", done: dsaProblems.filter(p => p.status === "Solved").length >= 15, link: "/dsa/add" });
        } else {
            milestones.push({ title: "DSA Benchmark Met", desc: `${dsaProblems.filter(p => p.status === "Solved").length} problems mastered`, done: true, link: "/dsa" });
        }

        if (jobs.length + internships.length === 0) {
            milestones.push({ title: "Track Active Job Pipelines", desc: "Log 5 target companies into your Kanban board", done: false, link: "/jobs/add" });
        } else {
            milestones.push({ title: "Active Applications", desc: `${jobs.length + internships.length} pipeline entries tracked`, done: true, link: "/jobs" });
        }

        const data = {
            careerScore: score,
            readinessTier,
            milestones,
            techCounts,
            projects: {
                total: projects.length,
                completed: projects.filter(p => p.status === "Completed").length,
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
        console.error("Analytics Load Error:", error);
        res.status(500).render("errors/500", { message: "Unable to load analytics." });
    }
};
