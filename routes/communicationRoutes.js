const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/send', protect, authorize("super_admin", "admin"), communicationController.sendNotification);
router.get('/logs', protect, authorize("super_admin", "admin"), communicationController.getNotificationLogs);

module.exports = router;