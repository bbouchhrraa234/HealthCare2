// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
require("dotenv").config();

// ==============================
// POST /api/auth/register
// ==============================
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required ❌" });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters ⚠" });
    }
    
    // Check if user exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Server error ❌" });
        
        if (results.length > 0) {
            return res.status(400).json({ message: "Email already registered ❌" });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        db.query(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword],
            (err, result) => {
                if (err) return res.status(500).json({ message: "Server error ❌" });
                
                // Create token
                const token = jwt.sign(
                    { id: result.insertId, email, name },
                    process.env.JWT_SECRET,
                    { expiresIn: "7d" }
                );
                
                res.status(201).json({
                    message: "User created successfully ✔",
                    token,
                    user: { id: result.insertId, name, email }
                });
            }
        );
    });
});

// ==============================
// POST /api/auth/login
// ==============================
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required ❌" });
    }
    
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Server error ❌" });
        
        if (results.length === 0) {
            return res.status(401).json({ message: "Wrong email or password ❌" });
        }
        
        const user = results[0];
        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
            return res.status(401).json({ message: "Wrong email or password ❌" });
        }
        
        // Create token
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        
        res.json({
            message: "Login successful ✔",
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    });
});

// ==============================
// POST /api/auth/forgot-password
// ==============================
router.post("/forgot-password", (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ message: "Email is required ❌" });
    }
    
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).json({ message: "Server error ❌" });
        
        if (results.length === 0) {
            return res.status(404).json({ message: "Email not found ❌" });
        }
        
        // In production, send email with reset link
        // For now, return a message
        res.json({ 
            message: "Password reset link sent to your email 📧",
            resetToken: jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" })
        });
    });
});

// ==============================
// GET /api/users/profile
// ==============================
router.get("/profile", (req, res) => {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ message: "No token provided ❌" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        db.query(
            "SELECT id, name, email, phone, location, photo FROM users WHERE id = ?",
            [decoded.id],
            (err, results) => {
                if (err) return res.status(500).json({ message: "Server error ❌" });
                if (results.length === 0) return res.status(404).json({ message: "User not found ❌" });
                res.json(results[0]);
            }
        );
    } catch (err) {
        return res.status(401).json({ message: "Invalid token ❌" });
    }
});

module.exports = router;
