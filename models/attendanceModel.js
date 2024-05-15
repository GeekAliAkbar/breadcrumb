const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true,
    },
    attendenceTiming: {
        type: Date,
        required: [true, 'Please provide attendance timing'],
    },
    activity: {
        type: String,
        enum: ['start', 'stop'],
        required: [true, 'Please provide activity'],
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;