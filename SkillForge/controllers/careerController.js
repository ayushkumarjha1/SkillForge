const CareerItem = require("../models/CareerItem");

exports.listItems = async (req, res) => {
    try {
        const items = await CareerItem.find({ user: req.session.user.id }).sort({ createdAt: -1 });

        const grouped = {
            Goal: items.filter((i) => i.type === "Goal"),
            Task: items.filter((i) => i.type === "Task"),
            Habit: items.filter((i) => i.type === "Habit"),
        };

        res.render("career/index", { grouped });
    } catch (error) {
        console.log(error);
        res.send("Unable to load career planner.");
    }
};

exports.addItemPage = (req, res) => res.render("career/add");

exports.createItem = async (req, res) => {
    try {
        await CareerItem.create({ ...req.body, user: req.session.user.id });
        res.redirect("/career");
    } catch (error) {
        console.log(error);
        res.send("Unable to add item.");
    }
};

exports.editItemPage = async (req, res) => {
    try {
        const item = await CareerItem.findOne({ _id: req.params.id, user: req.session.user.id });
        if (!item) return res.send("Item not found.");
        res.render("career/edit", { item });
    } catch (error) {
        console.log(error);
        res.send("Unable to load item.");
    }
};

exports.updateItem = async (req, res) => {
    try {
        await CareerItem.findOneAndUpdate({ _id: req.params.id, user: req.session.user.id }, req.body);
        res.redirect("/career");
    } catch (error) {
        console.log(error);
        res.send("Unable to update item.");
    }
};

exports.deleteItem = async (req, res) => {
    try {
        await CareerItem.findOneAndDelete({ _id: req.params.id, user: req.session.user.id });
        res.redirect("/career");
    } catch (error) {
        console.log(error);
        res.send("Unable to delete item.");
    }
};
