const express = require("express");
const router = express.Router();

const internshipController = require("../controllers/internshipController");
const { isLoggedIn } = require("../middleware/authMiddleware");

router.get("/internships", isLoggedIn, internshipController.listInternships);
router.get("/internships/add", isLoggedIn, internshipController.addInternshipPage);
router.post("/internships/add", isLoggedIn, internshipController.createInternship);
router.get("/internships/edit/:id", isLoggedIn, internshipController.editInternshipPage);
router.post("/internships/edit/:id", isLoggedIn, internshipController.updateInternship);
router.post("/internships/delete/:id", isLoggedIn, internshipController.deleteInternship);

module.exports = router;
