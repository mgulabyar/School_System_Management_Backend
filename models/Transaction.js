const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Income', 'Expense'],
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true 
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now 
    },
    description: {
        type: String,
        trim: true 
    },
    referenceId: {
        type: mongoose.Schema.Types.ObjectId 
    },
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);