const express = require("express");
const router = express.Router();

const aiCoachController = require("../controllers/aiCoachController");
const aiResumeController = require("../controllers/aiResumeController");
const aiInterviewController = require("../controllers/aiInterviewController");
const { isLoggedIn } = require("../middleware/authMiddleware");

// AI Career Coach
router.get("/ai/coach", isLoggedIn, aiCoachController.coachPage);
router.post("/ai/coach", isLoggedIn, aiCoachController.generateGuidance);

// AI Resume Analyzer
router.get("/ai/resume-analyzer", isLoggedIn, aiResumeController.analyzerPage);
router.post("/ai/resume-analyzer", isLoggedIn, aiResumeController.analyzeResume);

// AI Mock Interview
router.get("/ai/mock-interview", isLoggedIn, aiInterviewController.interviewPage);
router.post("/ai/mock-interview/question", isLoggedIn, aiInterviewController.generateQuestion);
router.post("/ai/mock-interview/answer", isLoggedIn, aiInterviewController.submitAnswer);

module.exports = router;
