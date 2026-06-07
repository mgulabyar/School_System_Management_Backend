const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    routeName: {
        type: String,
        required: true,
        unique: true,
        trim: true 
    },
    routeCost: {
        type: Number,
        required: true,
        default: 0 
    },
    stops: [
        {
            type: String,
            trim: true
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);