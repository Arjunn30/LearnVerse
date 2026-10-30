
const express = require("express");
const jwt = require("jsonwebtoken");
const Enrollment = require("../models/Enrollment");

const router = express.Router();

// Verify logged-in user
function verifyToken(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Please login first",
    });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

// Enroll in a course
router.post("/", verifyToken, async (req, res) => {
  try {
    const courseId = Number(req.body.courseId);

    if (!Number.isInteger(courseId) || courseId <= 0) {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }

    const existing = await Enrollment.findOne({
      user: req.userId,
      courseId,
    });

    if (existing) {
      return res.status(409).json({
        message: "Already enrolled in this course",
      });
    }

    const enrollment = await Enrollment.create({
      user: req.userId,
      courseId,
    });

    res.status(201).json({
      message: "Enrollment successful",
      enrollment,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Already enrolled in this course",
      });
    }

    res.status(500).json({
      message: "Enrollment failed",
    });
  }
});

// Get current user's enrolled courses
router.get("/", verifyToken, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json({ enrollments });
  } catch (error) {
    res.status(500).json({
      message: "Could not load enrollments",
    });
  }
});

module.exports = router;
