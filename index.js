const { Server } = require('socket.io');
const { createServer } = require('http');
const express = require('express');
const cors = require('cors');
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
const chats = [];
const users = [];

const formatDate = (date) => {
    return `${date.getHours()} : ${date.getMinutes()}`;
};

io.on('connection', (socket) => {
    console.log('Initialised socket connection: ', socket.id);
    for (let [id, socket] of io.of('/').sockets) {
        users.push({ id, username: socket.username });
    }
    socket.on('send-message', (data) => {
        data.chatDate = formatDate(new Date(data.date));
        chats.push(data);
        io.sockets.emit('receive_message', chats);
    });
});
httpServer.listen(process.env.PORT || 9000, () => {
    console.log('Listening ot port: ' + process.env.PORT || 9000);
});
