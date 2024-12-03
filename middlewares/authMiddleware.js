const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    // Check if authorization header exists
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).send({
        message: "Authorization header missing or malformed",
        success: false,
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({
        message: "Token not found",
        success: false,
      });
    }

    // Verify token
    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({
          message: "Invalid or expired token",
          success: false,
        });
      }

      // Attach userId to request body
      req.body.userId = decode.id;
      next();
    });
  } catch (error) {
    console.error("Error in auth middleware:", error);
    res.status(500).send({
      message: "Authentication failed due to an internal error",
      success: false,
    });
  }
};