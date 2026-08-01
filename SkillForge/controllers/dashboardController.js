const Project = require("../models/Project");

exports.studentDashboard = async (req, res) => {
    try {

        const userId = req.session.user.id;

        const totalProjects = await Project.countDocuments({
            user: userId
        });

        const planningProjects = await Project.countDocuments({
            user: userId,
            status: "Planning"
        });

        const progressProjects = await Project.countDocuments({
            user: userId,
            status: "In Progress"
        });

        const completedProjects = await Project.countDocuments({
            user: userId,
            status: "Completed"
        });

        res.render("student/dashboard", {
            user: req.session.user,
            totalProjects,
            planningProjects,
            progressProjects,
            completedProjects
        });

    } catch (error) {

        console.log(error);

        res.send("Unable to load dashboard.");

    }
};