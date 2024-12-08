const express = require("express");
const { getUserProfile, updateProfile } = require("../controllers/profileController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Routes
router.get('/profile', authMiddleware, getUserProfile);
router.put("/update", authMiddleware, updateProfile); // Update profile

module.exports = router;
