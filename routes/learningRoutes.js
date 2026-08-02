const express = require("express");
const router = express.Router();

const learningController = require("../controllers/learningController");
const { isLoggedIn } = require("../middleware/authMiddleware");

router.get("/learning", isLoggedIn, learningController.listItems);
router.get("/learning/add", isLoggedIn, learningController.addItemPage);
router.post("/learning/add", isLoggedIn, learningController.createItem);
router.get("/learning/edit/:id", isLoggedIn, learningController.editItemPage);
router.post("/learning/edit/:id", isLoggedIn, learningController.updateItem);
router.post("/learning/delete/:id", isLoggedIn, learningController.deleteItem);

module.exports = router;
