const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vehicleNo: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    registrationNo: {
        type: String,
        required: true,
        unique: true,
        trim: true 
    },
    driverName: {
        type: String,
        required: true,
        trim: true
    },
    driverPhone: {
        type: String,
        required: true,
        trim: true
    },
    capacity: {
        type: Number,
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);