const Job = require("../models/Job");
const { createNotification } = require("../utils/notify");

const STAGES = ["Wishlist", "Applied", "Interview", "Offer", "Rejected"];

exports.listJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ user: req.session.user.id }).sort({ createdAt: -1 });

        const board = STAGES.map((stage) => ({
            stage,
            jobs: jobs.filter((j) => j.status === stage),
        }));

        res.render("jobs/index", { board });
    } catch (error) {
        console.log(error);
        res.send("Unable to load job tracker.");
    }
};

exports.addJobPage = (req, res) => {
    res.render("jobs/add", { STAGES });
};

exports.createJob = async (req, res) => {
    try {
        await Job.create({ ...req.body, user: req.session.user.id });
        res.redirect("/jobs");
    } catch (error) {
        console.log(error);
        res.send("Unable to add job.");
    }
};

exports.editJobPage = async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, user: req.session.user.id });
        if (!job) return res.send("Job not found.");
        res.render("jobs/edit", { job, STAGES });
    } catch (error) {
        console.log(error);
        res.send("Unable to load job.");
    }
};

exports.updateJob = async (req, res) => {
    try {
        await Job.findOneAndUpdate({ _id: req.params.id, user: req.session.user.id }, req.body);
        res.redirect("/jobs");
    } catch (error) {
        console.log(error);
        res.send("Unable to update job.");
    }
};

// Quick stage move (used by the kanban board's forward/back buttons)
exports.moveJobStage = async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, user: req.session.user.id });
        if (!job) return res.send("Job not found.");

        const currentIndex = STAGES.indexOf(job.status);
        const targetIndex = req.params.direction === "forward" ? currentIndex + 1 : currentIndex - 1;

        if (targetIndex >= 0 && targetIndex < STAGES.length) {
            job.status = STAGES[targetIndex];
            await job.save();

            const type = job.status === "Offer" ? "success" : job.status === "Rejected" ? "warning" : "info";
            await createNotification(
                req.session.user.id,
                `${job.company} moved to "${job.status}"`,
                type,
                "/jobs"
            );
        }

        res.redirect("/jobs");
    } catch (error) {
        console.log(error);
        res.send("Unable to move job.");
    }
};

exports.deleteJob = async (req, res) => {
    try {
        await Job.findOneAndDelete({ _id: req.params.id, user: req.session.user.id });
        res.redirect("/jobs");
    } catch (error) {
        console.log(error);
        res.send("Unable to delete job.");
    }
};
