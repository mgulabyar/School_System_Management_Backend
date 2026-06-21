const mongoose = require('mongoose');
// i want to make this logic for exacmt management system
const examSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true 
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class', 
        required: true
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed'],
        default: 'Scheduled'
    }
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);