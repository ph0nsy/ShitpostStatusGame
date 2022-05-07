// Este será el servidor de nuestro juego
// 
// A continuación inicializaremos todo lo relacionado con "node.js" que vamos a necesitar
//
// Express
var express = require('express');
const PORT = process.env.PORT || 8081;
//var mysql = require('mysql');
var app = express();
//app = module.exports.app = express();
// http
var server = require('http').Server(app);
// Socket.io
var io = require('socket.io')(server);
module.exports = app;
// Recogemos todos los archivos estáticos relacionados con html que necesitaremos
app.use(express.static(__dirname + '/public'));
// Tomamos el index 
app.get('/',function(req,res){
    res.sendFile(__dirname+'/public/index.html');
});
// Apuntamos al puerto 8081
server.listen(8081,function(){ 
    console.log(`Listening on ${server.address().port}`);
});
const gameRooms = {
    // Elementos que habrá dentro de la constante
    /*[roomKey]:{
        players: {},
        numPlayers: 0,
        numRounds: 0,
        currentPlayer: 0,
    }*/
};
// Escuchamos a las conexiones y desconexiones
io.on('connection', function (socket) {
    console.log(`A socket connection has been made: ${socket.id}`);
    socket.on('disconnect', function () {
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
            console.log(`A socket has disconnected: ${socket.id}`);
            delete roomInfo.players[socket.id];
            roomInfo.numPlayers = Object.keys(roomInfo.players).length;
            io.to(roomkey).emit('disconnected',{
                playerId: socket.id,
                numPlayers: roomInfo.numPlayers,
            });
        }
    });
    
    socket.on('joinRoom', (roomKey, name) =>{
        const roomInfo = gameRooms[roomKey];
        if(roomInfo.numPlayers > 5) {
            socket.emit('roomFull');
        } else {
            socket.join(roomKey);
            roomInfo.players[socket.id] = {
                playerId: socket.id,
                username: name,
                score: 0,
                ready: 0,
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
        }
    });
    

    socket.on('isKeyValid', function(input){
        const keyArray = Object.keys(gameRooms)
        ? socket.emit('keyIsValid', input)
        : socket.emit('keyNotValid');
    });

    socket.on('createRoom', async function(rounds){
        let key = generateCode();
        Object.keys(gameRooms).includes(key) ? (key = generateCode()) : key;
        gameRooms[key] = {
            roomKey: key,
            players: {},
            numPlayers: 0,
            numRounds: rounds,
            currentPlayer: 0,
        };
        socket.emit('roomCreated', gameRooms[key]);
    });

    socket.on('ready', function(roomkey){
        const roomInfo = gameRooms[roomKey];
        roomInfo.players[socket.id].ready = 1;
        var readyGo = 0;
        Object.keys(roomInfo.players).forEach(function(id){
            if(players[id].ready == 0){
                readyGo++; 
            }
        });
        if(readyGo <= 0){
            socket.emit('readyGo');
        }
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