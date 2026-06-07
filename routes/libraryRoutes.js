const express = require("express");
const router = express.Router();
const libraryController = require("../controllers/libraryController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post(
  "/books",
  protect,
  authorize("super_admin", "admin"),
  libraryController.addBook,
);
router.post(
  "/issue",
  protect,
  authorize("super_admin", "admin"),
  libraryController.issueBook,
);
router.put(
  "/return/:issueId",
  protect,
  authorize("super_admin", "admin"),
  libraryController.returnBook,
);

router.get("/issued-list", protect, libraryController.getIssuedBooks);
router.put(
  "/books/:id",
  protect,
  authorize("super_admin", "admin"),
  libraryController.updateBook,
);
router.delete(
  "/books/:id",
  protect,
  authorize("super_admin", "admin"),
  libraryController.deleteBook,
);
module.exports = router;
