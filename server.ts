import express, { Application, Response } from 'express';
import http, { Server } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

const app: Application = express();
const server: Server = http.createServer(app);
const socketio: SocketIOServer = require("socket.io")(server, {
    cors: { origin: "*" }
});


socketio.on('connection', (socket: Socket) => {

    socket.on('chatMessage', (message: string) => {
        console.log(message);
        socketio.emit('chatMessage', `${message}`)
    })

    // Listen for user disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
})
/***Connnections **********************************************/

const port = 3001;

server.listen(port, () => {
    console.log(`Running on port ${port}`);
})

