const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post(
  "/register",
  protect,
  authorize("super_admin", "admin"),
  teacherController.registerTeacher,
);
router.post(
  "/pay-salary",
  protect,
  authorize("super_admin", "admin"),
  teacherController.paySalary,
);
router.put(
  "/allocate",
  protect,
  authorize("super_admin", "admin"),
  teacherController.allocateClassAndSubject,
);

router.get("/profile/:id", protect, teacherController.getTeacherProfile);
router.get("/", protect, teacherController.getAllTeachers);

router.put(
  "/:id",
  protect,
  authorize("super_admin", "admin"),
  teacherController.updateTeacherProfile,
);
router.put(
  "/clear-allocations/:id",
  protect,
  authorize("super_admin", "admin"),
  teacherController.clearTeacherAllocations,
);
router.delete(
  "/:id",
  protect,
  authorize("super_admin", "admin"),
  teacherController.deleteTeacher,
);
module.exports = router;
// teacherRoutes.js