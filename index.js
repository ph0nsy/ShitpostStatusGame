'use strict';
const { Console } = require('console');
// Este será el servidor de nuestro juego
// 
// A continuación inicializaremos todo lo relacionado con "node.js" que vamos a necesitar
//
const { ImgurClient } = require('imgur');
require('dotenv').config();

const client = new ImgurClient({
    clientId: 'd117d6ff408f666',//process.env.CLIENT_ID,
    clientSecret: '1bec536045c9da839d47891b06e78817d24f17ff',//process.env.CLIENT_SECRET,
    refreshToken: '218d0c255ae3a4ef379efd20aa377a8a43018e96',//process.env.REFRESH_TOKEN,
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


const db = require('./public/js/db.js')
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
    socket.on('checkUsername', async function(username, password){
        console.log('check username');
        let conn;
        try{
            conn = await db.pool.getConnection();
            const rows = await conn.query('SELECT 1 as val FROM User WHERE nombre = "' + username + '";');
            console.log(rows);
            console.log(username);
            if (rows[Object.keys(rows)[0]].val == 1) {
                console.log('aq89oso');
                if (conn) (conn).end; 
                socket.emit('failUser');
            } else {
                console.log('hey');
                conn.query('INSERT INTO User (nombre, contraseña) VALUES ("' + username + '", "' + password + '");');
                const id = await conn.query('SELECT id as val FROM User WHERE nombre = "' + username + '";');
                console.log(id[Object.keys(id)[0]]);
                if (conn) (conn).end;
                socket.emit('logUser', id[Object.keys(id)[0]].val);
            }
        } catch (err) {
            console.log(err);
            throw err;
        } finally {
            if (conn) (conn).end;
        }
    });

    socket.on('checkLogIn', async function(username, password){
        console.log('check username');
        let conn;
        try{
            conn = await db.pool.getConnection();
            const rows = await conn.query('SELECT 1 as val FROM User WHERE nombre = "' + username + '" AND contraseña = "' + password + '";');
            console.log(rows);
            console.log(username);
            if (rows[Object.keys(rows)[0]].val != 1) {
                console.log('aq89oso');
                if (conn) (conn).end;
            } else {
                console.log('hey');
                const id = await conn.query('SELECT id as val FROM User WHERE nombre = "' + username + '";');
                console.log(id[Object.keys(id)[0]]);
                if (conn) (conn).end;
                socket.emit('logUser', id[Object.keys(id)[0]].val);
            }
        } catch (err) {
            console.log(err);
            throw err;
        } finally {
            if (conn) (conn).end;
        }
    });

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
            currentSelected: {},
        };
        socket.emit('roomCreated', gameRooms[key]);
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
            io.sockets.in(roomKey).emit('currentJudge', roomInfo, Object.keys(roomInfo.players)[0]);
        }
    });

    socket.on('sendPrompt', function(key, promptQ){
        if(promptQ){
            io.sockets.in(key).emit('getPrompt', Object.keys(gameRooms[key].players)[gameRooms[key].currentPlayer], promptQ);
        } else {

            //io.socket.in(key).emit('getPrompt', Object.keys(gameRooms[key].players)[gameRooms[key].currentPlayer], getPrefabPromt(Math.floor(Math.random() * 20 ) + 1));
        }
    });

    socket.on('selected', function(){
        //emit waitSelect

        //emit waitVote
    });

    socket.on('hasVoted', function(){
        //emit nextJudge

        //emit endGame
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