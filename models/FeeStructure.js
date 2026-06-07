const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class', 
        required: true,
        unique: true 
    },
    tuitionFee: {
        type: Number,
        required: true,
        default: 0
    },
    admissionFee: {
        type: Number,
        required: true,
        default: 0
    },
    otherCharges: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('FeeStructure', feeStructureSchema);