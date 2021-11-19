const mongoose = require('mongoose');
const ChatSchema = require('./schema');

const ChatModel = mongoose.model('chat', ChatSchema);

module.exports = ChatModel;
