const mongoose = require('mongoose');
// it is for book database schema.
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true 
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    isbn: {
        type: String,
        unique: true,
        sparse: true, 
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1 
    },
    available: {
        type: Number,
        required: true,
        default: 1 
    },
    rackNo: {
        type: String,
        trim: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);