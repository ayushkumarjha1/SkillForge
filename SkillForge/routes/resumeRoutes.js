const express = require("express");
const router = express.Router();

const resumeController = require("../controllers/resumeController");
const { isLoggedIn } = require("../middleware/authMiddleware");

router.get("/resume", isLoggedIn, resumeController.listResumes);
router.post("/resume/create", isLoggedIn, resumeController.createResume);

router.get("/resume/:id/edit", isLoggedIn, resumeController.editResumePage);
router.post("/resume/:id/edit", isLoggedIn, resumeController.updateResume);

router.get("/resume/:id/view", isLoggedIn, resumeController.viewResume);
router.get("/resume/:id/delete", isLoggedIn, resumeController.deleteResume);

module.exports = router;
