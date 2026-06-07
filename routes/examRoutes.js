const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/schedule', protect, authorize("super_admin", "admin"), examController.createExam);

router.post(
  "/marks-entry",
  protect,
  authorize("super_admin", "admin", "teacher"),
  examController.enterMarks
);

router.get(
  "/report-card/:studentId/:examId",
  protect,
  examController.getStudentReportCard
);
router.get(
  "/merit-list/:examId",
  protect,
  examController.getMeritList
);

module.exports = router;