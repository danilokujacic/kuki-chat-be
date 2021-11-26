const chatRouter = require('./chat');
const userRouter = require('./user');
const preferenceRouter = require('./preferences');

module.exports = [preferenceRouter, chatRouter, userRouter];
