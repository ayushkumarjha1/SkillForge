const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projectController");
const { isLoggedIn } = require("../middleware/authMiddleware");
const { uploadCoverImage } = require("../config/upload");

// ==============================
// View All Projects
// ==============================
router.get("/projects", isLoggedIn, projectController.getProjects);

// ==============================
// Add Project
// ==============================
router.get("/projects/add", isLoggedIn, projectController.addProjectPage);
router.post(
    "/projects/add",
    isLoggedIn,
    uploadCoverImage.single("coverImage"),
    projectController.createProject
);

// ==============================
// Edit Project
// ==============================
router.get(
    "/projects/edit/:id",
    isLoggedIn,
    projectController.editProjectPage
);

router.post(
    "/projects/edit/:id",
    isLoggedIn,
    uploadCoverImage.single("coverImage"),
    projectController.updateProject
);

// ==============================
// Delete Project
// ==============================
router.get(
    "/projects/delete/:id",
    isLoggedIn,
    projectController.deleteProject
);

module.exports = router;