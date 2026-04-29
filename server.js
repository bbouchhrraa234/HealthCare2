const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" })); // 10mb for profile photos

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const doctorRoutes = require("./routes/doctors");
const appointmentRoutes = require("./routes/appointments");
const notificationRoutes = require("./routes/notifications");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/notifications", notificationRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});