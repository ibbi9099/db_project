const express = require("express");
const multer = require("multer");
const { uploadFile } = require("../controllers/fileController");
const { downloadFile } = require("../controllers/fileController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for uploading files
router.post("/upload", upload.single("file"), uploadFile);
router.get("/download/:fileId", authMiddleware, downloadFile);

module.exports = router;
