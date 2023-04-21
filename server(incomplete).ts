import express, { Application, Response } from 'express';
import http, { Server } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';
// import { LocalStrategy } from "passport-local";
import { userReg } from "./controllers/userReg";
import { fetchChat } from './controllers/getChat';
import session, { SessionOptions } from "express-session"
import MongoStore from 'connect-mongo';
const User = require("./models/userModel");
const LocalStrategy = require('passport-local');


import userRoutes from "./routes/userRoutes";

const app: Application = express();
const server: Server = http.createServer(app);
const socketio: SocketIOServer = require("socket.io")(server, {
    cors: { origin: "*" }
});


app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

/***Connnections **********************************************/
/* process.env.ATLAS_DB */
const dbURL = 'mongodb://localhost:27017/chatap';

mongoose.connect(dbURL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error! Please Review!'));
db.once('open', () => {
    console.log('Success! Mongoose Connected!')
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

const secret = process.env.SECRET ?? 'thisshouldbeabettersecret!';

const MongoDBStore = new MongoStore({
    mongoUrl: dbURL, // MongoDB connection URL
    collectionName: 'sessions',
    crypto: {
        secret: secret
    },
    touchAfter: 24 * 60 * 60
})

// const store = new MongoStore({
//     url: dbURL,
//     secret,
//     touchAfter: 
// });

MongoDBStore.on("error", function (e: Error) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig: SessionOptions = {
    store: MongoDBStore,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//-------------------------ROUTERS---------------//

app.get('/test', async (req, res) => {
    res.send("Test Success!")
});
app.post('/login', userReg);
app.post('/register', userReg);
app.get('/', userRoutes);

app.all('*', async (req, res) => {
    res.send("It's not  you, it's us. Please refresh or go back home.")
});

const port = 3001;

server.listen(port, () => {
    console.log(`Running on port ${port}`);
})

