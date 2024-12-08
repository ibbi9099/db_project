const express = require("express");
const {
  addBookmark,
  getBookmarkedCases,
  removeBookmark,
} = require("../controllers/bookmarkController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Add bookmark
router.post("/add", authMiddleware, addBookmark);

// Get all bookmarks
router.get("/", authMiddleware, getBookmarkedCases);

// Remove bookmark
router.delete("/:bookmarkId", authMiddleware, removeBookmark);

module.exports = router;
