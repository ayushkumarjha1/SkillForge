const User = require("../models/User");
const Project = require("../models/Project");

// ==============================
// Manage Portfolio Page
// ==============================
exports.managePortfolio = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        const projects = await Project.find({ user: req.session.user.id }).sort({ createdAt: -1 });

        res.render("portfolio/manage", { profileUser: user, projects });

    } catch (error) {
        console.log(error);
        res.send("Unable to load portfolio manager.");
    }
};

// ==============================
// Toggle a Project's Featured Status
// ==============================
exports.toggleFeatured = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, user: req.session.user.id });

        if (!project) {
            return res.send("Project not found.");
        }

        project.featured = !project.featured;
        await project.save();

        res.redirect("/portfolio");

    } catch (error) {
        console.log(error);
        res.send("Unable to update project.");
    }
};

// ==============================
// Update Portfolio Theme
// ==============================
exports.updateTheme = async (req, res) => {
    try {
        const { portfolioTheme } = req.body;

        await User.findByIdAndUpdate(req.session.user.id, {
            portfolioTheme: portfolioTheme === "Light" ? "Light" : "Dark",
        });

        res.redirect("/portfolio");

    } catch (error) {
        console.log(error);
        res.send("Unable to update theme.");
    }
};
