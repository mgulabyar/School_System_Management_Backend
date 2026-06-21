const mongoose = require('mongoose');
// section 
const sectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Section', sectionSchema);