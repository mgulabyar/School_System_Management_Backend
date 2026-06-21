const mongoose = require('mongoose');
const feeInvoiceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', 
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    month: {
        type: Date, 
        required: true
    },
    tuitionFee: {
        type: Number,
        required: true
    },
    otherCharges: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Paid', 'Unpaid'],
        default: 'Unpaid'
    },
    paymentDate: {
        type: Date
    }
}, { timestamps: true });

feeInvoiceSchema.index({ student: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('FeeInvoice', feeInvoiceSchema);