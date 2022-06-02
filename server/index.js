const express = require('express');
const app = express();
const http = require("http");
const { Server } = require('socket.io');
const cors = require("cors");

const users = new Map();

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.emit("get_username");

    socket.on("get_username", (data) => {
        users.set(socket.id, data);
    });

    socket.on("send_WPM", (data) => {
        socket.to(Array.from(socket.rooms)[1]).emit("player_words_count", data);
    });

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(socket.rooms)
        var t1 = new Date();
        console.log(t1)
    });
})

// function gameInterval

server.listen(3002, () =>{
    console.log("server is running")
});