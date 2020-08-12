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
    io.sockets.emit("usersData", users);

    // On call disconnect
    socket.on("disconnect", () => {
        delete users[socket.id];
    })

    // Establishing WebRTC handshake between 2 users
    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("hey", { signal: data.signalData, from: data.from });
    })

    socket.on("acceptCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    })

})


server.listen(8000, () => {
    console.log("Listening at port 8000");
})
