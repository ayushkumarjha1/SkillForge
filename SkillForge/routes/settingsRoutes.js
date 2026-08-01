const express = require("express");
const router = express.Router();

const settingsController = require("../controllers/settingsController");
const { isLoggedIn } = require("../middleware/authMiddleware");

router.get("/settings", isLoggedIn, settingsController.settingsPage);
router.post("/settings/password", isLoggedIn, settingsController.changePassword);
router.post("/settings/delete-account", isLoggedIn, settingsController.deleteAccount);

module.exports = router;
