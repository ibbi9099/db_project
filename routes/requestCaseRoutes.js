const express = require('express');
const {
  createRequestController,
  getUserRequestsController,
  getAllRequestsController,
} = require('../controllers/requestCaseCtrl');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to create a case request
router.post('/create', authMiddleware, createRequestController);

// Route to get case requests for a specific user
router.get('/user-requests', authMiddleware, getUserRequestsController);

// Route to get all case requests (admin/lawyer only)
router.get('/all-requests', authMiddleware, getAllRequestsController);

module.exports = router;
