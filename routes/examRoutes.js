const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Schedule an Exam (Admins only)
router.post(
  "/schedule",
  protect,
  authorize("super_admin", "admin"),
  examController.createExam,
);

// Get All Scheduled Exams list (Admins, Teachers, and Students can view)
router.get("/", protect, examController.getExams); // Added GET Route

// Marks entry (Admins & Teachers)
router.post(
  "/marks-entry",
  protect,
  authorize("super_admin", "admin", "teacher"),
  examController.enterMarks,
);

// Result/Report card (All Authenticated users)
router.get(
  "/report-card/:studentId/:examId",
  protect,
  examController.getStudentReportCard,
);

// Merit list (All Authenticated users)
router.get("/merit-list/:examId", protect, examController.getMeritList);

module.exports = router;
