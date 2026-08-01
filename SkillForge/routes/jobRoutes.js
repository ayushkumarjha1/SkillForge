const express = require("express");
const router = express.Router();

const jobController = require("../controllers/jobController");
const { isLoggedIn } = require("../middleware/authMiddleware");

router.get("/jobs", isLoggedIn, jobController.listJobs);
router.get("/jobs/add", isLoggedIn, jobController.addJobPage);
router.post("/jobs/add", isLoggedIn, jobController.createJob);
router.get("/jobs/edit/:id", isLoggedIn, jobController.editJobPage);
router.post("/jobs/edit/:id", isLoggedIn, jobController.updateJob);
router.post("/jobs/move/:id/:direction", isLoggedIn, jobController.moveJobStage);
router.post("/jobs/delete/:id", isLoggedIn, jobController.deleteJob);

module.exports = router;
