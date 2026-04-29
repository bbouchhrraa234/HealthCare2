// routes/notifications.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/auth");

// ==============================
// GET /api/notifications
// Get all notifications for logged-in user
// ==============================
router.get("/", authMiddleware, (req, res) => {
    const userId = req.user.id;

    db.query(
        "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
        [userId],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Server error ❌" });
            res.json(results);
        }
    );
});

// ==============================
// DELETE /api/notifications/:id
// Delete one notification
// ==============================
router.delete("/:id", authMiddleware, (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    db.query(
        "DELETE FROM notifications WHERE id = ? AND user_id = ?",
        [id, userId],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Server error ❌" });
            if (result.affectedRows === 0)
                return res.status(404).json({ message: "Notification not found ❌" });

            res.json({ message: "Notification deleted ✔" });
        }
    );
});

// ==============================
// DELETE /api/notifications
// Delete ALL notifications for user
// ==============================
router.delete("/", authMiddleware, (req, res) => {
    const userId = req.user.id;

    db.query(
        "DELETE FROM notifications WHERE user_id = ?",
        [userId],
        (err) => {
            if (err) return res.status(500).json({ message: "Server error ❌" });
            res.json({ message: "All notifications cleared ✔" });
        }
    );
});

module.exports = router;