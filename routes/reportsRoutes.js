const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard-stats', protect, authorize("super_admin", "admin"), reportsController.getDashboardStats);
router.get('/fee-report', protect, authorize("super_admin", "admin"), reportsController.getUnifiedFeeReport);

module.exports = router;