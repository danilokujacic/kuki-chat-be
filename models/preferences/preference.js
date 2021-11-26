const mongoose = require('mongoose');
const PreferenceSchema = require('./schema');

const PreferenceModel = mongoose.model('preference', PreferenceSchema);

module.exports = PreferenceModel;
