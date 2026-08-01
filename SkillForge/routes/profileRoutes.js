const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profileController");
const { isLoggedIn } = require("../middleware/authMiddleware");
const { uploadAvatar } = require("../config/upload");

// ==============================
// Own Profile
// ==============================
router.get("/profile", isLoggedIn, profileController.viewProfile);
router.get("/profile/edit", isLoggedIn, profileController.editProfilePage);
router.post(
    "/profile/edit",
    isLoggedIn,
    uploadAvatar.single("avatar"),
    profileController.updateProfile
);

// ==============================
// Public Profile
// ==============================
router.get("/u/:username", profileController.publicProfile);

module.exports = router;
