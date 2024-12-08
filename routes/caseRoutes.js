const express = require("express");
const { addCase } = require("../controllers/caseController");
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");
const { getMyCases } = require("../controllers/caseController");
const { getDistinctCategories, searchCasesByCategory } = require("../controllers/caseController");
const { getCaseById } = require("../controllers/caseController");
const { deleteCase} = require("../controllers/caseController")


// Initialize Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Add Case Route
router.post("/add", authMiddleware, upload.single("file"), addCase);
router.get("/my-cases", authMiddleware, getMyCases);

router.get("/categories", authMiddleware, getDistinctCategories);
router.get("/search", authMiddleware, searchCasesByCategory);
router.get("/:id", authMiddleware, getCaseById);

// Delete Case Route
router.delete("/:id", authMiddleware, deleteCase);

module.exports = router;