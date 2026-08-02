const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notificationController");
const { isLoggedIn } = require("../middleware/authMiddleware");

router.get("/notifications", isLoggedIn, notificationController.listNotifications);
router.post("/notifications/read-all", isLoggedIn, notificationController.markAllRead);
router.post("/notifications/read/:id", isLoggedIn, notificationController.markRead);
router.post("/notifications/delete/:id", isLoggedIn, notificationController.deleteNotification);

module.exports = router;
