const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer();
const socket = require('socket.io');
const io = socket(server);

users = {};

io.on('connection', socket => {

    // Sending client the socket id and receiving username and also maintaining the user's list
    socket.emit("yourID", socket.id);
    socket.on("username", (username) => {
        if (!user[socket.id]) {
            users[socket.id] = username;
        }
    })

    // Sending the data of all the users
    socket.emit("usersData", users);

    // On call disconnect
    socket.on("disconnect", () => {
        delete users[socket.id];
    })

    // Establishing WebRTC handshake between users

})


server.listen(8000, () => {
    console.log("Listening at port 8000");
})
