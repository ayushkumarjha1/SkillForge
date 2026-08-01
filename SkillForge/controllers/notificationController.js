const Notification = require("../models/Notification");

exports.listNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.session.user.id }).sort({ createdAt: -1 }).limit(50);
        const unreadCount = notifications.filter((n) => !n.read).length;

        res.render("notifications/index", { notifications, unreadCount });
    } catch (error) {
        console.log(error);
        res.send("Unable to load notifications.");
    }
};

exports.markRead = async (req, res) => {
    try {
        await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.session.user.id },
            { read: true }
        );
        res.redirect("/notifications");
    } catch (error) {
        console.log(error);
        res.send("Unable to update notification.");
    }
};

exports.markAllRead = async (req, res) => {
    try {
        await Notification.updateMany({ user: req.session.user.id, read: false }, { read: true });
        res.redirect("/notifications");
    } catch (error) {
        console.log(error);
        res.send("Unable to update notifications.");
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        await Notification.findOneAndDelete({ _id: req.params.id, user: req.session.user.id });
        res.redirect("/notifications");
    } catch (error) {
        console.log(error);
        res.send("Unable to delete notification.");
    }
};
