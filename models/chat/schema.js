const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    profile: {
        picture: String,
        username: String,
    },
    message: String,
    date: String,
    chatDate: String,
});
const ChatSchema = new mongoose.Schema({
    id: Number,
    chats: [MessageSchema],
    users: [String],
});

module.exports = ChatSchema;
