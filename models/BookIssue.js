const mongoose = require('mongoose');
const bookIssueSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    issueDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true 
    },
    returnDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Issued', 'Returned'],
        default: 'Issued'
    },
    fineAmount: {
        type: Number,
        default: 0
    },
    finePaid: {
        type: Boolean,
        default: false
    },
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('BookIssue', bookIssueSchema);