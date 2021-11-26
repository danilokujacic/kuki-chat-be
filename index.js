const { Server } = require('socket.io');
const { createServer } = require('http');
const express = require('express');
const cors = require('cors');
const ChatModel = require('./models/chat/chat');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config')[process.env.NODE_ENV || 'development'];

const controllers = require('./controllers');

const app = express();

app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);
app.use(bodyParser.json());

controllers.forEach((controller) => {
    console.log(controller);
    app.use(controller.path, controller.router);
});

mongoose.connect(config['database-host']).then(() => {
    console.log('MONGO DB CONNECTED', config['database-host']);
});

const httpServer = createServer(app);

//Initializing Socket io application
const io = new Server(httpServer, {
    cors: {
        origin: config['frontend-host'],
        methods: ['GET', 'POST'],
    },
});
io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error('invalid username'));
    }
    socket.username = username;
    next();
});
io.on('connection_error', (err) => {
    console.error('Error message:', err.message);
});
const users = [];

io.on('connection', (socket) => {
    console.log('Initialised socket connection: ', socket.id);

    for (let [id, socket] of io.of('/').sockets) {
        users.push({ id, username: socket.username });
    }
    socket.broadcast.emit('user-joined', socket.username);
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-left', socket.username);
    });
    socket.on('seen-message', async (data) => {
        const seenData = {
            picture: data.picture,
            username: data.username,
            date: data.date,
        };
        data.chats[data.chats.length - 1] = {
            ...data.chats[data.chats.length - 1],
            seen: [seenData, ...data.chats[data.chats.length - 1].seen],
        };
        await ChatModel.updateOne({ id: 0 }, { chats: data.chats });
        io.sockets.emit('receive_seen', data.chats);
    });
    socket.on('send-message', async (data) => {
        const chat = await ChatModel.findOne({ id: 0 });
        data.chatDate = data.date;
        chat.chats.push(data);
        await ChatModel.updateOne({ id: 0 }, { chats: chat.chats });
        io.sockets.emit('receive_message', chat.chats);
    });
});
httpServer.listen(process.env.PORT || 9000, () => {
    console.log('Listening ot port: ' + process.env.PORT || 9000);
});
