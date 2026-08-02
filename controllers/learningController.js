const LearningItem = require("../models/LearningItem");

exports.listItems = async (req, res) => {
    try {
        const items = await LearningItem.find({ user: req.session.user.id }).sort({ createdAt: -1 });

        const stats = {
            total: items.length,
            completed: items.filter((i) => i.status === "Completed").length,
            inProgress: items.filter((i) => i.status === "In Progress").length,
        };

        res.render("learning/index", { items, stats });
    } catch (error) {
        console.log(error);
        res.send("Unable to load learning hub.");
    }
};

exports.addItemPage = (req, res) => res.render("learning/add");

exports.createItem = async (req, res) => {
    try {
        await LearningItem.create({ ...req.body, user: req.session.user.id });
        res.redirect("/learning");
    } catch (error) {
        console.log(error);
        res.send("Unable to add item.");
    }
};

exports.editItemPage = async (req, res) => {
    try {
        const item = await LearningItem.findOne({ _id: req.params.id, user: req.session.user.id });
        if (!item) return res.send("Item not found.");
        res.render("learning/edit", { item });
    } catch (error) {
        console.log(error);
        res.send("Unable to load item.");
    }
};

exports.updateItem = async (req, res) => {
    try {
        const progress = Math.max(0, Math.min(100, parseInt(req.body.progress, 10) || 0));
        await LearningItem.findOneAndUpdate(
            { _id: req.params.id, user: req.session.user.id },
            { ...req.body, progress }
        );
        res.redirect("/learning");
    } catch (error) {
        console.log(error);
        res.send("Unable to update item.");
    }
};

exports.deleteItem = async (req, res) => {
    try {
        await LearningItem.findOneAndDelete({ _id: req.params.id, user: req.session.user.id });
        res.redirect("/learning");
    } catch (error) {
        console.log(error);
        res.send("Unable to delete item.");
    }
};
