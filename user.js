// routes/user.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../db");
const authMiddleware = require("../middleware/auth");

// ==============================
// GET /api/user/profile
// Get logged-in user's data
// ==============================
router.get("/profile", authMiddleware, (req, res) => {
    const userId = req.user.id;

    db.query(
        "SELECT id, name, email, phone, location, photo FROM users WHERE id = ?",
        [userId],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Server error ❌" });
            if (results.length === 0)
                return res.status(404).json({ message: "User not found ❌" });

            res.json(results[0]);
        }
    );
});

// ==============================
// PUT /api/user/profile
// Update profile info
// ==============================
router.put("/profile", authMiddleware, (req, res) => {
    const userId = req.user.id;
    const { name, email, phone, location } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required ❌" });
    }

    db.query(
        "UPDATE users SET name = ?, email = ?, phone = ?, location = ? WHERE id = ?",
        [name, email, phone || "", location || "", userId],
        (err) => {
            if (err) return res.status(500).json({ message: "Server error ❌" });
            res.json({ message: "Profile updated successfully ✔" });
        }
    );
});

// ==============================
// PUT /api/user/photo
// Update profile photo (saves as base64)
// ==============================
router.put("/photo", authMiddleware, (req, res) => {
    const userId = req.user.id;
    const { photo } = req.body;

    if (!photo) {
        return res.status(400).json({ message: "No photo provided ❌" });
    }

    db.query(
        "UPDATE users SET photo = ? WHERE id = ?",
        [photo, userId],
        (err) => {
            if (err) return res.status(500).json({ message: "Server error ❌" });
            res.json({ message: "Photo updated successfully ✔" });
        }
    );
});

// ==============================
// PUT /api/user/password
// Change password
// ==============================
router.put("/password", authMiddleware, (req, res) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "All fields are required ❌" });
    }

    if (newPassword.length < 6) {
        return res
            .status(400)
            .json({ message: "New password must be at least 6 characters ❌" });
    }

    // Get current password from DB
    db.query(
        "SELECT password FROM users WHERE id = ?",
        [userId],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Server error ❌" });

            const isMatch = bcrypt.compareSync(oldPassword, results[0].password);

            if (!isMatch) {
                return res.status(401).json({ message: "Old password is wrong ❌" });
            }

            const hashed = bcrypt.hashSync(newPassword, 10);

            db.query(
                "UPDATE users SET password = ? WHERE id = ?",
                [hashed, userId],
                (err) => {
                    if (err) return res.status(500).json({ message: "Server error ❌" });
                    res.json({ message: "Password changed successfully ✔" });
                }
            );
        }
    );
});

module.exports = router;