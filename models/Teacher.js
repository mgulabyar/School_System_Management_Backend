const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    employeeId: {
        type: String,
        required: true,
        unique: true,
        trim: true 
    },
    qualification: {
        type: String,
        required: true,
        trim: true
    },
    salary: {
        type: Number,
        required: true 
    },
    allocatedClasses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class'
        }
    ],
    allocatedSections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Section'
        }
    ],
    allocatedSubjects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject'
        }
    ],
    status: {
        type: String,
        enum: ['Active', 'On Leave', 'Resigned'],
        default: 'Active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);