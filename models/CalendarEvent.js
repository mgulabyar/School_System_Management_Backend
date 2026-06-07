const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true 
    },
    description: {
        type: String,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: ['Holiday', 'Event', 'Exam', 'Other'],
        default: 'Event'
    }
}, { timestamps: true });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);