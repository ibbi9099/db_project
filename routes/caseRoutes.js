const express = require("express");
const { addCase } = require("../controllers/caseController");
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");
const { getMyCases } = require("../controllers/caseController");


// Initialize Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Add Case Route
router.post("/add", authMiddleware, upload.single("file"), addCase);
router.get("/my-cases", authMiddleware, getMyCases);


module.exports = router;
