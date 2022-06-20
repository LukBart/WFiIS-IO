const express = require('express')
const app = express()
const http = require("http")
const { Server } = require('socket.io')
const cors = require("cors")
const { disconnect } = require('process')

const users = new Map()
const roomsUsers = new Map()
const words = new Map()
const admins = new Map()

const PORT = process.env.serverURL || 3002

app.use(cors())
const server = http.createServer(app)

const io = 
new Server(server, {
    cors:{
        origin: process.env.frontURL || "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`)

    socket.on("give_username", (data) => {
        users.set(socket.id, data)
    })

    socket.on("send_words_count", (wrd, incwrd) => {
        socket.to(Array.from(socket.rooms)[Array.from(socket.rooms).length - 1]).emit("player_words_count", users.get(socket.id), wrd, incwrd)
    })

    socket.on("make_room", (room, words_list) => {
        words.set(room, words_list)
        socket.join(room)
        admins.set(room, socket.id)
        var usr = new Array()
        usr.push(socket.id)
        roomsUsers.set(room, usr)
        socket.to(socket.id).emit("new_users", [users.get(socket.id)])
    })

    socket.on("join_room", (room) => {
        socket.join(room)
        var roomUsers = roomsUsers.get(room)
        roomUsers.push(socket.id)
        roomsUsers.set(room, roomUsers)
        var usr = new Array()
        roomsUsers.get(room).forEach(element => {
            usr.push(users.get(element))
        })
        socket.to(room).emit("new_users", usr, socket.id)
        socket.to(socket.id).emit("after_join", usr, words.get(Array.from(socket.rooms)[Array.from(socket.rooms).length - 1]))
    })

    socket.on("begin_game", () => {
        console.log("Begin game in room: ", Array.from(socket.rooms)[Array.from(socket.rooms).length - 1])
        socket.to(Array.from(socket.rooms)[Array.from(socket.rooms).length - 1]).emit("start")
    })

    socket.on("disconnect_room", (room) => {
        socket.leave(room)
    })
    socket.on("resend_data", (id) =>{
        var usr = new Array()
        roomsUsers.get(Array.from(socket.rooms)[Array.from(socket.rooms).length - 1]).forEach(element => {
            usr.push(users.get(element))
        })
        socket.to(id).emit("resended_data", words.get(Array.from(socket.rooms)[Array.from(socket.rooms).length - 1]), usr)
    })
})


server.listen(PORT, () =>{
    console.log("server is running")
})