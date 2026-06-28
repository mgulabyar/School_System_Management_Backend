// const express = require("express");
// const router = express.Router();
// const academicController = require("../controllers/academicController");

// const { protect, authorize } = require("../middleware/authMiddleware");

// router.post(
//   "/sections",
//   protect,
//   authorize("super_admin", "admin"),
//   academicController.createSection,
// );
// router.post(
//   "/classes",
//   protect,
//   authorize("super_admin", "admin"),
//   academicController.createClass,
// );
// router.get("/classes", protect, academicController.getAllClasses);

// router.post(
//   "/subjects",
//   protect,
//   authorize("super_admin", "admin"),
//   academicController.createSubject,
// );
// router.get(
//   "/classes/:classId/subjects",
//   protect,
//   academicController.getSubjectsByClass,
// );
// router.post(
//   "/timetable",
//   protect,
//   authorize("super_admin", "admin"),
//   academicController.createTimetableSlot,
// );
// router.get(
//   "/timetable/:classId/:sectionId",
//   protect,
//   academicController.getTimetable,
// );

// router.post(
//   "/calendar",
//   protect,
//   authorize("super_admin", "admin"),
//   academicController.createCalendarEvent,
// );

// router.put(
//   "/classes/:id",
//   protect,
//   authorize("super_admin", "admin"),
//   academicController.updateClass,
// );
// router.delete(
//   "/classes/:id",
//   protect,
//   authorize("super_admin", "admin"),
//   academicController.deleteClass,
// );

// router.put(
//   "/subjects/:id",
//   protect,
//   authorize("super_admin", "admin"),
//   academicController.updateSubject,
// );
// router.delete(
//   "/subjects/:id",
//   protect,
//   authorize("super_admin", "admin"),
//   academicController.deleteSubject,
// );

// router.put(
//   "/timetable/:id",
//   protect,
//   authorize("super_admin", "admin"),
//   academicController.updateTimetableSlot,
// );
// router.delete(
//   "/timetable/:id",
//   protect,
//   authorize("super_admin", "admin"),
//   academicController.deleteTimetableSlot,
// );
// router.get("/calendar", protect, academicController.getCalendarEvents);
// module.exports = router;


const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Sections CRUD
router.post('/sections', protect, authorize('super_admin', 'admin'), academicController.createSection);
router.get('/sections', protect, academicController.getSections); // Added GET Sections Route

// Classes CRUD
router.post('/classes', protect, authorize('super_admin', 'admin'), academicController.createClass);
router.get('/classes', protect, academicController.getAllClasses);

// Subjects CRUD
router.post('/subjects', protect, authorize('super_admin', 'admin'), academicController.createSubject);
router.get('/classes/:classId/subjects', protect, academicController.getSubjectsByClass);

// Timetable & Calendar routes
router.post('/timetable', protect, authorize('super_admin', 'admin'), academicController.createTimetableSlot);
router.get('/timetable/:classId/:sectionId', protect, academicController.getTimetable);

router.post('/calendar', protect, authorize('super_admin', 'admin'), academicController.createCalendarEvent);

// PUT & DELETE CRUD Routes for Academic
router.put('/classes/:id', protect, authorize('super_admin', 'admin'), academicController.updateClass);
router.delete('/classes/:id', protect, authorize('super_admin', 'admin'), academicController.deleteClass);

router.put('/subjects/:id', protect, authorize('super_admin', 'admin'), academicController.updateSubject);
router.delete('/subjects/:id', protect, authorize('super_admin', 'admin'), academicController.deleteSubject);

router.put('/timetable/:id', protect, authorize('super_admin', 'admin'), academicController.updateTimetableSlot);
router.delete('/timetable/:id', protect, authorize('super_admin', 'admin'), academicController.deleteTimetableSlot);

router.get('/calendar', protect, academicController.getCalendarEvents);

module.exports = router;