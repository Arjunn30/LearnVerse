
const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import authentication routes
const authRoutes = require("./routes/authRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");

// Create Express application
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/enrollments", enrollmentRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "LearnVerse Backend API is running!",
    status: "success",
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Server port
const PORT = process.env.PORT || 5000;

// Connect MongoDB and start server
async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully!");

    app.listen(PORT, () => {
      console.log(
        `LearnVerse server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
    process.exit(1);
  }
}

startServer();
