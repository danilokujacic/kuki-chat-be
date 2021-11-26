const mongoose = require('mongoose');
const PreferenceSchema = new mongoose.Schema({
    chatBubbleColor: String,
});
const PreferencesSchema = new mongoose.Schema({
    id: String,
    preferences: PreferenceSchema,
});

module.exports = PreferencesSchema;
