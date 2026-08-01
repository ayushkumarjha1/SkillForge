const express = require("express");
const router = express.Router();

const portfolioController = require("../controllers/portfolioController");
const { isLoggedIn } = require("../middleware/authMiddleware");

router.get("/portfolio", isLoggedIn, portfolioController.managePortfolio);
router.post("/portfolio/toggle/:id", isLoggedIn, portfolioController.toggleFeatured);
router.post("/portfolio/theme", isLoggedIn, portfolioController.updateTheme);

module.exports = router;
