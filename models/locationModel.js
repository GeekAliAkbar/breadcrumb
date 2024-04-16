const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    userId: {
        type: Number,
    },
    locationTagTiming: {
        type: Date,
        required: [true, 'Please provide location tag time'],
    },
    latitude: {
        type: Number,
        required: [true, 'Please provide latitude'],
    },
    longitude: {
        type: Number,
        required: [true, 'Please provide longitude'],
    },
    formattedAddress: {
        type: String,
        default: 'No Value',
    }
});

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;