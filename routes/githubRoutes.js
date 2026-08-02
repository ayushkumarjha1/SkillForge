const express = require("express");
const router = express.Router();

const githubController = require("../controllers/githubController");
const { isLoggedIn } = require("../middleware/authMiddleware");

router.get("/github", isLoggedIn, githubController.githubPage);
router.post("/github", isLoggedIn, githubController.fetchGithubStats);

module.exports = router;
