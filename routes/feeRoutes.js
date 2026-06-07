const express = require("express");
const router = express.Router();
const feeController = require("../controllers/feeController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post(
  "/structure",
  protect,
  authorize("super_admin", "admin", "accountant"),
  feeController.setupFeeStructure,
);
router.post(
  "/generate",
  protect,
  authorize("super_admin", "admin", "accountant"),
  feeController.generateMonthlyFees,
);
router.put(
  "/collect/:invoiceId",
  protect,
  authorize("super_admin", "admin", "accountant"),
  feeController.collectFee,
);
router.get(
  "/defaulters",
  protect,
  authorize("super_admin", "admin", "accountant"),
  feeController.getDefaultersList,
);
router.delete(
  "/collect/:id",
  protect,
  authorize("super_admin", "admin", "accountant"),
  feeController.voidInvoice,
);
module.exports = router;
