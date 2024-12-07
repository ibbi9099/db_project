const express = require("express");
const {
    loginController,
    registerController,
    authController,
    LawyersController,

} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

//router object
const router = express.Router();

//routes

//LOGIN || POST
router.post("/login", loginController);

//REGISTER || POST
router.post("/register", registerController);

//AUTH || POST
router.post("/getUserData", authMiddleware, authController)

// Route to fetch all registered lawyers
router.get("/lawyers", LawyersController);

    
module.exports = router;