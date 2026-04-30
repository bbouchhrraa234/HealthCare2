// middleware/auth.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
    // Get token from request header
    const authHeader = req.headers["authorization"];
const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token, access denied ❌" });
    }

    try {
        // Verify the token and attach user info to request
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token ❌" });
    }
};
