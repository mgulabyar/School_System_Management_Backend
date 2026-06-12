const express = require("express");
const router = express.Router();
const libraryController = require("../controllers/libraryController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Books CRUD
router.post(
  "/books",
  protect,
  authorize("super_admin", "admin"),
  libraryController.addBook,
);
router.get("/books", protect, libraryController.getBooks); // Added GET Books Route

// Issue & Return
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

// Logs
router.get("/issued-list", protect, libraryController.getIssuedBooks);

module.exports = router;
