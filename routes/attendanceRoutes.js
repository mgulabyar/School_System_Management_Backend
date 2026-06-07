const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post(
  "/student",
  protect,
  authorize("super_admin", "admin", "teacher"),
  attendanceController.markStudentAttendance,
);
router.get(
  "/student/report",
  protect,
  attendanceController.getStudentAttendanceReport,
);

router.post(
  "/staff",
  protect,
  authorize("super_admin", "admin"),
  attendanceController.markStaffAttendance,
);
router.get(
  "/staff/report",
  protect,
  authorize("super_admin", "admin"),
  attendanceController.getStaffAttendanceReport,
);

module.exports = router;
