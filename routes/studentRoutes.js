const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post(
  "/admit",
  protect,
  authorize("super_admin", "admin"),
  studentController.admitStudent,
);

router.get("/profile/:id", protect, studentController.getStudentProfile);
router.get("/", protect, studentController.getAllStudents);
router.put(
  "/promote",
  protect,
  authorize("super_admin", "admin"),
  studentController.promoteStudent,
);
router.put(
  "/issue-tc",
  protect,
  authorize("super_admin", "admin"),
  studentController.issueTransferCertificate,
);

router.put(
  "/:id",
  protect,
  authorize("super_admin", "admin"),
  studentController.updateStudentProfile,
);
router.delete(
  "/:id",
  protect,
  authorize("super_admin", "admin"),
  studentController.deleteStudent,
);
module.exports = router;
