// routes/doctors.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// ==============================
// GET /api/doctors
// Get all doctors (optional filter by specialty & location)
// ==============================
router.get("/", (req, res) => {
    const { specialty, location } = req.query;

    let query = "SELECT * FROM doctors WHERE available = TRUE";
    const params = [];

    if (specialty && specialty !== "Specialty") {
        query += " AND specialty = ?";
        params.push(specialty);
    }

    if (location && location !== "Location") {
        query += " AND location = ?";
        params.push(location);
    }

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ message: "Server error ❌" });
        res.json(results);
    });
});

// ==============================
// GET /api/doctors/:id
// Get one doctor by ID
// ==============================
router.get("/:id", (req, res) => {
    const { id } = req.params;

    db.query(
        "SELECT * FROM doctors WHERE id = ?",
        [id],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Server error ❌" });
            if (results.length === 0)
                return res.status(404).json({ message: "Doctor not found ❌" });

            res.json(results[0]);
        }
    );
});

module.exports = router;