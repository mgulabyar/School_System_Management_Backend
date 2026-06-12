const Book = require("../models/Book");
const BookIssue = require("../models/BookIssue");

exports.addBook = async (req, res) => {
  try {
    const { title, author, isbn, quantity, rackNo } = req.body;

    const bookExists = await Book.findOne({ isbn });
    if (isbn && bookExists) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Book with this ISBN already exists!",
        });
    }

    const newBook = await Book.create({
      title,
      author,
      isbn,
      quantity,
      available: quantity,
      rackNo,
    });

    res.status(201).json({
      success: true,
      message: "Book added to Library successfully!",
      data: newBook,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.issueBook = async (req, res) => {
  try {
    const { bookId, borrowerId, dueDate } = req.body;
    const markedBy = req.user.id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found in Library!" });
    }

    if (book.available <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Book is currently out of stock!" });
    }

    const issueRecord = await BookIssue.create({
      book: bookId,
      borrower: borrowerId,
      dueDate,
      markedBy,
    });

    book.available -= 1;
    await book.save();

    res.status(201).json({
      success: true,
      message: "Book issued successfully!",
      data: issueRecord,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { issueId } = req.params;

    const record = await BookIssue.findById(issueId);
    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Issue record not found!" });
    }

    if (record.status === "Returned") {
      return res
        .status(400)
        .json({ success: false, message: "Book has already been returned!" });
    }

    const today = new Date();
    let fine = 0;

    if (today > record.dueDate) {
      const diffTime = Math.abs(today.getTime() - record.dueDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine = diffDays * 10; 
    }

    record.returnDate = today;
    record.status = "Returned";
    record.fineAmount = fine;
    await record.save();

    const book = await Book.findById(record.book);
    if (book) {
      book.available += 1;
      await book.save();
    }

    res.status(200).json({
      success: true,
      message:
        fine > 0
          ? `Book returned late! Fine of Rs. ${fine} generated.`
          : "Book returned successfully!",
      data: record,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getIssuedBooks = async (req, res) => {
  try {
    const issuedList = await BookIssue.find({ status: "Issued" })
      .populate("book", "title author")
      .populate("borrower", "name email role");

    res.status(200).json({
      success: true,
      count: issuedList.length,
      data: issuedList,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
