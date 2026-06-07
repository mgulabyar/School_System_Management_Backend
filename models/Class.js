const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true 
    },
    sections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Section' 
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);