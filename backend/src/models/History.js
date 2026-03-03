const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
    location: String,
    temperature: Number,
    humidity: Number,
    windSpeed: Number,
    weatherStatus: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', HistorySchema);