
const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    courseId: {
      type: Number,
      required: true,
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

// Prevent enrolling in the same course twice
enrollmentSchema.index(
  { user: 1, courseId: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "Enrollment",
  enrollmentSchema
);
