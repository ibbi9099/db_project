const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attaching user info to the request object
        next();
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;
