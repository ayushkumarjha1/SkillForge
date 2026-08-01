const express = require("express");
const router = express.Router();

const analyticsController = require("../controllers/analyticsController");
const { isLoggedIn } = require("../middleware/authMiddleware");

router.get("/analytics", isLoggedIn, analyticsController.viewAnalytics);

module.exports = router;
