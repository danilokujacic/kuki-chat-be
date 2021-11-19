const { Router } = require('express');
const chatRouter = Router();
const ChatModel = require('../models/chat/chat');
chatRouter.get('/list/:user', (req, res) => {});
chatRouter.post('/:id?', async (req, res) => {
    const { id } = req.params;
    const { chats, users } = req.body;
    try {
        if (typeof id === 'undefined') {
            const chat = new ChatModel({
                id: Math.floor(Math.random() * 1000000),
                chats,
                users,
            });
            await chat.save();
            return res.json(chat);
        } else {
            const chat = await ChatModel.findOneAndUpdate(
                { id: Number(id) },
                { chats },
            );
            if (!chat) {
                return res.json({ error: true, message: 'Chat doesnt excist' });
            }
            return res.json(chat);
        }
    } catch (err) {
        throw Error(err);
    }
});
chatRouter.delete('/:id', (req, res) => {
    const { body } = request;
});
chatRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const chat = await ChatModel.findOne({ id: Number(id) });
        if (!chat) {
            return res.json({ error: true, message: 'Chat doesnt excist' });
        }
        res.json(chat.chats);
    } catch (err) {
        throw Error(err);
    }
});

module.exports = { path: '/chat', router: chatRouter };
