const express = require("express");
const multer = require("multer");
const { uploadFile } = require("../controllers/fileController");
const { downloadFileByCaseId } = require("../controllers/fileController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for uploading files
router.post("/upload", upload.single("file"), uploadFile);
router.get("/download/case/:caseId", authMiddleware, downloadFileByCaseId);
module.exports = router;
