const Internship = require("../models/Internship");

exports.listInternships = async (req, res) => {
    try {
        const internships = await Internship.find({ user: req.session.user.id }).sort({ createdAt: -1 });

        const stats = {
            total: internships.length,
            applied: internships.filter((i) => i.status === "Applied").length,
            interview: internships.filter((i) => i.status === "Interview").length,
            offer: internships.filter((i) => i.status === "Offer").length,
        };

        res.render("internships/index", { internships, stats });
    } catch (error) {
        console.log(error);
        res.send("Unable to load internships.");
    }
};

exports.addInternshipPage = (req, res) => {
    res.render("internships/add");
};

exports.createInternship = async (req, res) => {
    try {
        await Internship.create({ ...req.body, user: req.session.user.id });
        res.redirect("/internships");
    } catch (error) {
        console.log(error);
        res.send("Unable to add internship.");
    }
};

exports.editInternshipPage = async (req, res) => {
    try {
        const internship = await Internship.findOne({ _id: req.params.id, user: req.session.user.id });
        if (!internship) return res.send("Internship not found.");
        res.render("internships/edit", { internship });
    } catch (error) {
        console.log(error);
        res.send("Unable to load internship.");
    }
};

exports.updateInternship = async (req, res) => {
    try {
        await Internship.findOneAndUpdate(
            { _id: req.params.id, user: req.session.user.id },
            req.body
        );
        res.redirect("/internships");
    } catch (error) {
        console.log(error);
        res.send("Unable to update internship.");
    }
};

exports.deleteInternship = async (req, res) => {
    try {
        await Internship.findOneAndDelete({ _id: req.params.id, user: req.session.user.id });
        res.redirect("/internships");
    } catch (error) {
        console.log(error);
        res.send("Unable to delete internship.");
    }
};
