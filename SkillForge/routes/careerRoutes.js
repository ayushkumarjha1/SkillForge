const express = require("express");
const router = express.Router();

const careerController = require("../controllers/careerController");
const { isLoggedIn } = require("../middleware/authMiddleware");

router.get("/career", isLoggedIn, careerController.listItems);
router.get("/career/add", isLoggedIn, careerController.addItemPage);
router.post("/career/add", isLoggedIn, careerController.createItem);
router.get("/career/edit/:id", isLoggedIn, careerController.editItemPage);
router.post("/career/edit/:id", isLoggedIn, careerController.updateItem);
router.post("/career/delete/:id", isLoggedIn, careerController.deleteItem);

module.exports = router;
