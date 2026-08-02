const Notification = require("../models/Notification");

// Fire-and-forget: notification failures should never break the main action
const createNotification = async (userId, message, type = "info", link = "") => {
    try {
        await Notification.create({ user: userId, message, type, link });
    } catch (error) {
        console.error("Failed to create notification:", error.message);
    }
};

module.exports = { createNotification };
