const requestCaseModel = require('../models/requestCaseModel');

// Controller to create a case request
const createRequestController = async (req, res) => {
  try {
    const { caseTitle, caseDescription, lawyer, requestedDate } = req.body;
    const userId = req.user?.id; // Extract the user ID from the JWT

    if (!userId || !caseTitle || !caseDescription) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    await requestCaseModel.createRequest(userId, caseTitle, caseDescription, lawyer, requestedDate);
    res.status(201).json({ success: true, message: "Case request created successfully" });
  } catch (error) {
    console.error("Error creating case request:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// Controller to get requests by user ID
const getUserRequestsController = async (req, res) => {
  try {
    const userId = req.user?.id; // Extract the user ID from the JWT

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const requests = await requestCaseModel.getRequestsByUserId(userId);
    res.status(200).send({ success: true, data: requests });
  } catch (error) {
    console.error('Error in getUserRequestsController:', error.message);
    res.status(500).send({ message: 'Internal Server Error', success: false });
  }
};

// Controller to get all requests (for admin or lawyer)
const getAllRequestsController = async (req, res) => {
  try {
    const requests = await requestCaseModel.getAllRequests();
    res.status(200).send({ success: true, data: requests });
  } catch (error) {
    console.error('Error in getAllRequestsController:', error.message);
    res.status(500).send({ message: 'Internal Server Error', success: false });
  }
};

module.exports = {
  createRequestController,
  getUserRequestsController,
  getAllRequestsController,
};
