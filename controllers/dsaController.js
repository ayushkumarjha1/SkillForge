const DsaProblem = require("../models/DsaProblem");

// Counts consecutive days (including today or yesterday) with at least one solved problem
const calculateStreak = (solvedDates) => {
    const uniqueDays = [...new Set(solvedDates.filter(Boolean))]
        .map((d) => new Date(d).toDateString())
        .filter((d) => d !== "Invalid Date");

    if (uniqueDays.length === 0) return 0;

    const daySet = new Set(uniqueDays);
    let streak = 0;
    let cursor = new Date();

    // Allow the streak to still count if today has nothing yet but yesterday does
    if (!daySet.has(cursor.toDateString())) {
        cursor.setDate(cursor.getDate() - 1);
    }

    while (daySet.has(cursor.toDateString())) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
};

exports.listProblems = async (req, res) => {
    try {
        const problems = await DsaProblem.find({ user: req.session.user.id }).sort({ createdAt: -1 });

        const stats = {
            total: problems.length,
            solved: problems.filter((p) => p.status === "Solved").length,
            easy: problems.filter((p) => p.difficulty === "Easy" && p.status === "Solved").length,
            medium: problems.filter((p) => p.difficulty === "Medium" && p.status === "Solved").length,
            hard: problems.filter((p) => p.difficulty === "Hard" && p.status === "Solved").length,
            streak: calculateStreak(problems.filter((p) => p.status === "Solved").map((p) => p.solvedDate)),
        };

        res.render("dsa/index", { problems, stats });
    } catch (error) {
        console.log(error);
        res.send("Unable to load DSA tracker.");
    }
};

exports.addProblemPage = (req, res) => res.render("dsa/add");

exports.createProblem = async (req, res) => {
    try {
        const body = { ...req.body };
        if (body.status === "Solved" && !body.solvedDate) {
            body.solvedDate = new Date().toISOString().slice(0, 10);
        }
        await DsaProblem.create({ ...body, user: req.session.user.id });
        res.redirect("/dsa");
    } catch (error) {
        console.log(error);
        res.send("Unable to add problem.");
    }
};

exports.editProblemPage = async (req, res) => {
    try {
        const problem = await DsaProblem.findOne({ _id: req.params.id, user: req.session.user.id });
        if (!problem) return res.send("Problem not found.");
        res.render("dsa/edit", { problem });
    } catch (error) {
        console.log(error);
        res.send("Unable to load problem.");
    }
};

exports.updateProblem = async (req, res) => {
    try {
        const body = { ...req.body };
        if (body.status === "Solved" && !body.solvedDate) {
            body.solvedDate = new Date().toISOString().slice(0, 10);
        }
        await DsaProblem.findOneAndUpdate({ _id: req.params.id, user: req.session.user.id }, body);
        res.redirect("/dsa");
    } catch (error) {
        console.log(error);
        res.send("Unable to update problem.");
    }
};

exports.deleteProblem = async (req, res) => {
    try {
        await DsaProblem.findOneAndDelete({ _id: req.params.id, user: req.session.user.id });
        res.redirect("/dsa");
    } catch (error) {
        console.log(error);
        res.send("Unable to delete problem.");
    }
};
