const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    recipientPhone: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    channel: {
        type: String,
        enum: ['SMS', 'WhatsApp', 'Email'],
        required: true
    },
    status: {
        type: String,
        enum: ['Sent', 'Failed', 'Pending'],
        default: 'Sent'
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);