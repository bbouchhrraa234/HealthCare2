// routes/appointments.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/auth");

// ==============================
// POST /api/appointments
// Book a new appointment
// ==============================
router.post("/", authMiddleware, (req, res) => {
    const userId = req.user.id;
    const { doctor_id, date, time } = req.body;

    if (!doctor_id || !date || !time) {
        return res.status(400).json({ message: "All fields are required ❌" });
    }

    // Check doctor exists
    db.query(
        "SELECT * FROM doctors WHERE id = ?",
        [doctor_id],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Server error ❌" });
            if (results.length === 0)
                return res.status(404).json({ message: "Doctor not found ❌" });

            // Save appointment
            db.query(
                "INSERT INTO appointments (user_id, doctor_id, date, time) VALUES (?, ?, ?, ?)",
                [userId, doctor_id, date, time],
                (err, result) => {
                    if (err) return res.status(500).json({ message: "Server error ❌" });

                    // Auto-create a notification for the user
                    const notifMsg = `📌 Appointment confirmed with ${results[0].name} on ${date} at ${time}`;
                    db.query(
                        "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
                        [userId, notifMsg]
                    );

                    res.status(201).json({
                        message: "Appointment booked successfully ✔",
                        appointment_id: result.insertId,
                    });
                }
            );
        }
    );
});

// ==============================
// GET /api/appointments
// Get all appointments for logged-in user
// ==============================
router.get("/", authMiddleware, (req, res) => {
    const userId = req.user.id;

    db.query(
        `SELECT a.id, a.date, a.time, a.status,
            d.name AS doctor_name, d.specialty, d.location
     FROM appointments a
     JOIN doctors d ON a.doctor_id = d.id
     WHERE a.user_id = ?
     ORDER BY a.date DESC`,
        [userId],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Server error ❌" });
            res.json(results);
        }
    );
});

// ==============================
// DELETE /api/appointments/:id
// Cancel an appointment
// ==============================
router.delete("/:id", authMiddleware, (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    db.query(
        "DELETE FROM appointments WHERE id = ? AND user_id = ?",
        [id, userId],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Server error ❌" });
            if (result.affectedRows === 0)
                return res.status(404).json({ message: "Appointment not found ❌" });

            res.json({ message: "Appointment cancelled ✔" });
        }
    );
});

module.exports = router;