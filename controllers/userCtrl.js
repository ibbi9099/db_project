const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Controller
const registerController = async (req, res) => {
    try {
        const { email, password, name, userType, specialization, experienceYears, educationalInstitute } = req.body;

        // Check if user already exists
        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists", success: false });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Set default userType if not provided
        const defaultUserType = "LawStudent";
        const validUserTypes = ["Lawyer", "LawStudent", "Admin"];
        const finalUserType = userType && validUserTypes.includes(userType) ? userType : defaultUserType;

        // Create a new user
        const newUserId = await userModel.createUser(name, email, hashedPassword, finalUserType);

        // Add specialization and experience for Lawyer
        if (finalUserType === "Lawyer") {
            if (!specialization || specialization.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "Specialization is required for Lawyers",
                });
            }

            if (!experienceYears || isNaN(experienceYears) || experienceYears < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Valid experience years are required for Lawyers",
                });
            }

            await userModel.createLawyer(newUserId, specialization, experienceYears);
        }

        // Add educational institute for LawStudent
        if (finalUserType === "LawStudent") {
            if (!educationalInstitute || educationalInstitute.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "Educational institute is required for Law Students",
                });
            }

            await userModel.createLawStudent(newUserId, educationalInstitute);
        }

        res.status(201).json({ message: "Registered successfully", success: true });
    } catch (error) {
        console.error("Error in registerController:", error.message);
        res.status(500).json({
            success: false,
            message: `Register Controller: ${error.message}`,
        });
    }
};

// Login Controller for OracleDB
const loginController = async (req, res) => {
    try {
        const user = await userModel.getUserByEmail(req.body.email);

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.PASSWORD);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Email or Password", success: false });
        }

        const token = jwt.sign(
            { id: user.USERID, userType: user.USER_TYPE },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
        });
    } catch (error) {
        console.error("Error in loginController:", error.message);
        res.status(500).json({ message: `Error in Login Controller: ${error.message}`, success: false });
    }
};

// Auth Controller
const authController = async (req, res) => {
    try {
        const userId = req.user?.id; // Extract userId from JWT
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized access", success: false });
        }

        const user = await userModel.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        res.status(200).json({
            success: true,
            data: {
                email: user.EMAIL,
                name: user.NAME,
                userType: user.USER_TYPE,
            },
        });
    } catch (error) {
        console.error("Error in authController:", error.message);
        res.status(500).json({ message: `Error in Auth Controller: ${error.message}`, success: false });
    }
};

// Lawyers Controller
const LawyersController = async (req, res) => {
    try {
        const lawyers = await userModel.getAllLawyers();
        res.status(200).json({
            success: true,
            message: "Lawyers fetched successfully",
            data: lawyers,
        });
    } catch (error) {
        console.error("Error in LawyersController:", error.message);
        res.status(500).json({
            success: false,
            message: `Error fetching lawyers: ${error.message}`,
        });
    }
};

module.exports = { loginController, registerController, authController, LawyersController };
