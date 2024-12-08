const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

// View Profile
const getUserProfile     = async (req, res) => {
    try {
        const userId = req.user?.id; // Decoded from token
    
        console.log("Fetching profile for user ID:", userId);
    
        if (!userId) {
          return res.status(400).json({ success: false, message: "User ID is required" });
        }
    
        const user = await userModel.getUserById(userId);
    
        if (!user) {
          return res.status(404).json({ success: false, message: "No profile data found" });
        }
    
        let extraData = {};
    
        if (user.USER_TYPE === "Lawyer") {
          extraData = await userModel.getLawyerDetails(userId);
        } else if (user.USER_TYPE === "LawStudent") {
          extraData = await userModel.getLawStudentDetails(userId);
        }
    
        res.status(200).json({
          success: true,
          data: {
            ...user,
            ...extraData,
          },
        });
      } catch (error) {
        console.error("Error fetching profile:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
      }
  };

// Update Profile
const updateProfile = async (req, res) => {
    const userId = req.user?.id;
    const userType = req.user?.userType;
    const { name, password, educationalInstitute, specialization, experienceYears } = req.body;
  
    try {
      const updateData = {};
  
      if (name) updateData.name = name;
      if (password) updateData.password = await bcrypt.hash(password, 10); // Hash the password
      if (educationalInstitute && userType === "LawStudent") {
        updateData.educationalInstitute = educationalInstitute;
      }
      if (specialization && userType === "Lawyer") {
        updateData.specialization = specialization;
      }
      if (experienceYears && userType === "Lawyer") {
        updateData.experienceYears = experienceYears;
      }
  
      // Update the user
      await userModel.updateUserById(userId, updateData, userType);
  
      res.status(200).json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating profile:", error.message);
      res.status(500).json({ success: false, message: "Failed to update profile" });
    }
  };
  
  
module.exports = { getUserProfile, updateProfile };
