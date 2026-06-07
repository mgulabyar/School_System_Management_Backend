const express = require("express");
const router = express.Router();
const transportController = require("../controllers/transportController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post(
  "/vehicles",
  protect,
  authorize("super_admin", "admin"),
  transportController.addVehicle,
);
router.post(
  "/routes",
  protect,
  authorize("super_admin", "admin"),
  transportController.createRoute,
);
router.post(
  "/allocate",
  protect,
  authorize("super_admin", "admin"),
  transportController.allocateTransport,
);

router.get("/report", protect, transportController.getTransportReport);
router.put(
  "/vehicles/:id",
  protect,
  authorize("super_admin", "admin"),
  transportController.updateVehicle,
);
router.delete(
  "/vehicles/:id",
  protect,
  authorize("super_admin", "admin"),
  transportController.deleteVehicle,
);

router.put(
  "/routes/:id",
  protect,
  authorize("super_admin", "admin"),
  transportController.updateRoute,
);
router.delete(
  "/routes/:id",
  protect,
  authorize("super_admin", "admin"),
  transportController.deleteRoute,
);

router.delete(
  "/allocate/:id",
  protect,
  authorize("super_admin", "admin"),
  transportController.cancelAllocation,
);
module.exports = router;
