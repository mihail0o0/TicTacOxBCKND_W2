const express = require('express');
const { connect } = require('http2');
const app = express();
const server = require("http").createServer(app);
// const serverless = require('serverless-http');
const io = require('socket.io')(server, {cors: {origin: "*"}});
const helperFunctions = require('./helper');

const router = express.Router();
port = 3001;

server.listen(process.env.PORT || port, () => {
    console.log("Local server is running!");
});

app.use('/', router);

router.get('/', (req, res) => {
    res.json({
        message: "Hosting sucessfuly"
    });
});

// socket stuff
io.on('connection', (socket) =>{
    console.log("User connected " + socket.id);
    // pick a color for the player

    socket.on('joinedRoom', (data) =>{
        // create room if player is host
        if(data.host == 'true'){
            let room = helperFunctions.createRandomString(8);
            let turn = helperFunctions.decidePlayerTurn();
            socket.join(room);
            socket.emit('createdRoomAck', {
                "roomID": room,
                "turn": turn
            });
        }
        // join room if player is not host and has provided the username
        else if(data.userName != "noUserName" && data.userName != "" && data.roomID != ''){
            socket.join(data.roomID);
            io.sockets.in(data.roomID).emit('joinedRoomACK', {
                "userName2": data.userName
            });
        }
    });

    socket.on('sendHostName', (data) => {
        socket.to(data.roomID).emit('receiveHostName', {
            "userName": data.userName,
            "turn": data.turn
        });
    });

    socket.on('makeMove', (data) => {
        let playableMove = helperFunctions.decidePlayableMove(data);
        console.log(data);

        io.sockets.in(data.roomID).emit('receiveMove', {
            "playableMove": playableMove,
            "cellIndex": data.cellIndex 
        });
    });

    socket.on('sendRestartGame', (data) => {
        io.sockets.in(data.roomID).emit('receiveRestartGame');
    });
});



// app.use('/.netlify/functions/api', router);

// module.exports = app;
// module.exports.handler = serverless(app);