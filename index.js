'use strict';
const { Console } = require('console');
// Este será el servidor de nuestro juego
// 
// A continuación inicializaremos todo lo relacionado con "node.js" que vamos a necesitar
//
const { ImgurClient } = require('imgur');
require('dotenv').config();

const client = new ImgurClient({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  });
    

const imageSets = new Map();
const getAlbumsIds = async(imageSets) => {
    let res = await client.getAlbums('ph0nsy')
    for (let index = 0; index < res.data.length; index++) {
        let imagesLinks = [];
        let res2 = await client.getAlbum(res.data[index].id);       
        for (let index2 = 0; index2 < res.data[index].images_count; index2++) {
            imagesLinks[index2] = res2.data.images[index2].link;
        }
        imageSets.set(res.data[index].title, imagesLinks);
    }
}


// Express
var express = require('express');
const PORT = process.env.PORT || 8081;
//var mysql = require('mysql');
var app = express();
//app = module.exports.app = express();
// http
var server = require('http').createServer(app);
// Socket.io
var io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});
module.exports = app;
let cors = require("cors");
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
// Recogemos todos los archivos estáticos relacionados con html que necesitaremos
app.use(express.static(__dirname + '/public'));

// Tomamos el index 
app.get('/',function(req,res){
    res.sendFile(__dirname+'/public/index.html');
});

// Apuntamos al puerto 8081
server.listen(PORT,function(){ 
    console.log(`Listening on ${server.address().port}`);
});


const gameRooms = {
    // Elementos que habrá dentro de la constante
    /*[roomKey]:{
        players: {},
        numPlayers: 0,
        numRounds: 0,
        currentPlayer: 0,
        currentRound: 0,
        currentSelected: {},
    }*/
};

// Escuchamos a las conexiones y desconexiones
io.on('connection', function (socket) {
    console.log(`A socket connection has been made: ${socket.id}`);

    socket.on('disconnect', async() => {
        let roomkey = 0;
        for (let keysA in gameRooms){
            for(let keysB in gameRooms[keysA]){
                Object.keys(gameRooms[keysA][keysB]).map((el)=>{
                    if(el === socket.id){
                        roomkey = keysA;
                    }
                });
            }
        }
        const roomInfo = gameRooms[roomkey];
        if(roomInfo){
            
            delete roomInfo.players[socket.id];
            roomInfo.numPlayers = Object.keys(roomInfo.players).length;
            io.to(roomkey).emit('disconnected',{
                roomKey: roomkey,
                playerId: socket.id,
                numPlayers: roomInfo.numPlayers,
            });
        }
        console.log(`A socket has disconnected: ${socket.id}`);
    }); 
    
    socket.on('isOnRoom', function(roomKey, name){
        const roomInfo = gameRooms[roomKey];
        socket.join(roomKey);
        roomInfo.players[socket.id] = {
            playerId: socket.id,
            username: name,
            score: 0,
            ready: 0,
            selected_img: '',
        };
        console.log('roomInfo ', roomInfo);

        roomInfo.numPlayers = Object.keys(roomInfo.players).length;
        socket.emit('setState', {
            roomKey: roomInfo.roomKey,
            players: roomInfo.players,
            numPlayers: roomInfo.numPlayers,
        });

        socket.emit('currentPlayers', {
            players: roomInfo.players,
            numPlayers: roomInfo.numPlayers,
        });

        socket.to(roomKey).emit('newPlayer',{
            playerInfo: roomInfo.players[socket.id],
            numPlayers: roomInfo.numPlayers,
        });
    });

    socket.on('joinRoom', (roomKey) =>{
        const roomInfo = gameRooms[roomKey];
        if(roomInfo){
            var allReady = 0;
            Object.keys(roomInfo.players).forEach(function(id){
                if(roomInfo.players[id].ready == 1){
                    allReady++; 
                }
            });
            console.log(roomInfo.numPlayers);
            if(!roomInfo || (roomInfo && roomInfo.numPlayers > 5) || (Object.keys(roomInfo.players).length > 0 && allReady >= Object.keys(roomInfo.players).length)) {
                socket.emit('roomFull', true);
            } else {
                socket.emit('roomFull', false);
            }
        }
    });

    socket.on('isKeyValid', function(input, name){
        const keyArray = Object.keys(gameRooms)
        ? socket.emit('keyIsValid', input, name)
        : socket.emit('keyNotValid');
    });

    socket.on('createRoom', async function(rounds, name){
        let key = generateCode();
        Object.keys(gameRooms).includes(key) ? (key = generateCode()) : key;
        gameRooms[key] = {
            roomKey: key,
            players: {},
            numPlayers: 0,
            numRounds: parseInt(rounds, 10),
            currentPlayer: 0,
            currentRound: 0,
            currentSelected: {},
        };
        socket.emit('roomCreated', gameRooms[key], name);
    });

    socket.on('ready', function(roomKey, rId){
        const roomInfo = gameRooms[roomKey];
        roomInfo.players[rId].ready = 1;
        var readyGo = 0;
        Object.keys(roomInfo.players).forEach(function(id){
            if(roomInfo.players[id].ready == 1){
                readyGo++; 
            }
        });
        if(readyGo >= Object.keys(roomInfo.players).length){
            io.sockets.in(roomKey).emit('currentJudge', roomInfo, Object.keys(roomInfo.players)[roomInfo.currentPlayer]);
        }
    });

    socket.on('sendPrompt', function(key, promptQ){
        if(promptQ){
            io.sockets.in(key).emit('getPrompt', Object.keys(gameRooms[key].players)[gameRooms[key].currentPlayer], promptQ.toUpperCase());
        } else {
            /*var word = 'werd';
            io.sockets.in(key).emit('getPrompt', Object.keys(gameRooms[key].players)[gameRooms[key].currentPlayer], word.toUpperCase());*/
            fetch("https://random-word-api.herokuapp.com/word", {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }),
            }).then((response) => response.json())
                .then((json) => io.sockets.in(key).emit('getPrompt', Object.keys(gameRooms[key].players)[gameRooms[key].currentPlayer], json[0].toUpperCase()));
        }
    });

    socket.on('selection', function(img, id, key){
        gameRooms[key].currentSelected[id] = img;
        if(Object.keys(gameRooms[key].currentSelected).length == gameRooms[key].numPlayers-1){
            io.sockets.in(key).emit('allSelected', gameRooms[key]);
        } else {
            Object.keys(gameRooms[key].currentSelected).forEach(function(c_id){
                if(c_id == id){
                    socket.emit('updateSelected', gameRooms[key]);
                } else {
                    socket.to(gameRooms[key].players[c_id].playerId).emit('updateSelected', gameRooms[key]);
                }
            });
            socket.to(Object.keys(gameRooms[key].players)[gameRooms[key].currentPlayer]).emit('updateSelected', gameRooms[key])
        }
    });

    socket.on('reveal', function(curr_id, key){
        io.sockets.in(key).emit('revealed', gameRooms[key], curr_id);
    });

    socket.on('clickMeme',function(img, txt, key){socket.to(key).emit('showMeme', img, txt);});
    socket.on('clickOut',function(key){socket.to(key).emit('byeMeme');});

    socket.on('hasVoted', function(key, id){
        gameRooms[key].players[id].score++;
        gameRooms[key].currentSelected = {};
        Object.keys(gameRooms[key].players).forEach(function(res_id){
            gameRooms[key].players[res_id].ready = 0;
        });
        gameRooms[key].currentPlayer += 1;
        console.log('Jugadores restantes esta Ronda: ' + (gameRooms[key].numPlayers - gameRooms[key].currentPlayer));
        console.log('Rondas restantes: ' + (gameRooms[key].numRounds - gameRooms[key].currentRound));
        if(gameRooms[key].currentPlayer < gameRooms[key].numPlayers){
            console.log(gameRooms[key].currentPlayer);
            io.sockets.in(key).emit('nextTurn', gameRooms[key]);
        } else {
            gameRooms[key].currentPlayer = 0;
            gameRooms[key].currentRound += 1;
            if(gameRooms[key].currentRound < gameRooms[key].numRounds){
                console.log(gameRooms[key].currentRound);
                io.sockets.in(key).emit('nextTurn', gameRooms[key]);
            } else {
                gameRooms[key].currentRound = 0;
                var max_idx = 0;
                let max_temp;
                const endRoomInfo = Object.assign({},gameRooms[key]);
                Object.keys(gameRooms[key].players).forEach(function(end_id){
                    if(max_idx == 0){
                        max_temp = gameRooms[key].players[end_id].score;
                        max_idx = end_id;
                    } else if (max_temp < gameRooms[key].players[end_id].score) {
                        max_temp = gameRooms[key].players[end_id].score;
                        max_idx = end_id;
                    }
                    gameRooms[key].players[end_id].score = 0;
                });
                console.log('Winner: ' + gameRooms[key].players[max_idx].username)
                io.sockets.in(key).emit('endGame', endRoomInfo, gameRooms[key].players[max_idx].username);
            }
        }
    });

    socket.on('playAgain', function(key){
        gameRooms[key].currentPlayer = 0;
        gameRooms[key].currentRound = 0;
        gameRooms[key].currentSelected = {};
        socket.emit('readyAgain');
    });

    socket.on('getImages', function(){
        getAlbumsIds(imageSets).then(() => {
            socket.emit('haveImages', JSON.stringify(Object.fromEntries(imageSets)));
        });        
    });
    
}); 

function generateCode(){
    let code = '';
    let dictionary = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i<6; i++){
        code += dictionary.charAt(Math.floor(Math.random() * dictionary.length));
    }
    return code;
}

function getPrefabPromt(num){
    //query con num como id
}