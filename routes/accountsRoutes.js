const express = require("express");
const router = express.Router();
const accountsController = require("../controllers/accountsController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post(
  "/transaction",
  protect,
  authorize("super_admin", "admin", "accountant"),
  accountsController.addTransaction,
);
router.get(
  "/report",
  protect,
  authorize("super_admin", "admin", "accountant"),
  accountsController.getFinancialReport,
);

module.exports = router;
