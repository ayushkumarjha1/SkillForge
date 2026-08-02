const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const { isLoggedIn, isAdmin } = require("../middleware/authMiddleware");

router.get("/admin", isLoggedIn, isAdmin, adminController.dashboard);
router.post("/admin/role/:id", isLoggedIn, isAdmin, adminController.changeUserRole);
router.post("/admin/delete/:id", isLoggedIn, isAdmin, adminController.deleteUser);

module.exports = router;
