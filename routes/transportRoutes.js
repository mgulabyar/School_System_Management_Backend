const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transportController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Setup and allocation secured for Admins/Super Admins
router.post('/vehicles', protect, authorize('super_admin', 'admin'), transportController.addVehicle);
router.get('/vehicles', protect, transportController.getVehicles); // Added GET Vehicles

router.post('/routes', protect, authorize('super_admin', 'admin'), transportController.createRoute);
router.get('/routes', protect, transportController.getRoutes); // Added GET Routes

router.post('/allocate', protect, authorize('super_admin', 'admin'), transportController.allocateTransport);

// View allocations
router.get('/report', protect, transportController.getTransportReport);

// PUT & DELETE CRUD Routes for Vehicles & Routes
router.put('/vehicles/:id', protect, authorize('super_admin', 'admin'), transportController.updateVehicle);
router.delete('/vehicles/:id', protect, authorize('super_admin', 'admin'), transportController.deleteVehicle);

router.put('/routes/:id', protect, authorize('super_admin', 'admin'), transportController.updateRoute);
router.delete('/routes/:id', protect, authorize('super_admin', 'admin'), transportController.deleteRoute);

// Cancel student transport allocation
router.delete('/allocate/:id', protect, authorize('super_admin', 'admin'), transportController.cancelAllocation);

module.exports = router;