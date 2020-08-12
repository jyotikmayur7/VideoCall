const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer();
const socket = require('socket.io');
const io = socket(server);



server.listen(8000, () => {
    console.log("Listening at port 8000");
})
