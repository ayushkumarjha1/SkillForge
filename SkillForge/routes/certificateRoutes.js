const express = require("express");
const router = express.Router();

const certificateController = require("../controllers/certificateController");
const { isLoggedIn } = require("../middleware/authMiddleware");
const { uploadCertificate } = require("../config/upload");

router.get("/certificates", isLoggedIn, certificateController.listCertificates);
router.get("/certificates/add", isLoggedIn, certificateController.addCertificatePage);
router.post("/certificates/add", isLoggedIn, uploadCertificate.single("image"), certificateController.createCertificate);
router.get("/certificates/edit/:id", isLoggedIn, certificateController.editCertificatePage);
router.post("/certificates/edit/:id", isLoggedIn, uploadCertificate.single("image"), certificateController.updateCertificate);
router.post("/certificates/delete/:id", isLoggedIn, certificateController.deleteCertificate);

module.exports = router;
