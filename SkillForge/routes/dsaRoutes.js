const express = require("express");
const router = express.Router();

const dsaController = require("../controllers/dsaController");
const { isLoggedIn } = require("../middleware/authMiddleware");

router.get("/dsa", isLoggedIn, dsaController.listProblems);
router.get("/dsa/add", isLoggedIn, dsaController.addProblemPage);
router.post("/dsa/add", isLoggedIn, dsaController.createProblem);
router.get("/dsa/edit/:id", isLoggedIn, dsaController.editProblemPage);
router.post("/dsa/edit/:id", isLoggedIn, dsaController.updateProblem);
router.post("/dsa/delete/:id", isLoggedIn, dsaController.deleteProblem);

module.exports = router;
