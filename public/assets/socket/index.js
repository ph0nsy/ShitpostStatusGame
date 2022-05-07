
const gameRooms = {
    // Elementos que habrá dentro de la constante
    /*[roomKey]:{
        players: {},
        numPlayers: 0,
        numRounds: 0,
        currentPlayer: 0,

    }*/
};

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`A socket connection has been made: ${socket.id}`);

        socket.on('joinRoom', (roomKey, name) =>{
            socket.join(roomKey);
            const roomInfo = gameRooms[roomKey];
            console.log('roomInfo ', roomInfo);
            roomInfo.players[socket.id] = {
                playerId: socket.id,
                username: name,
                score: 0,
                ready: 0,
            };

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

        socket.on('isKeyValid', function    (input){
            const keyArray = Object.keys(gameRooms)
            ? socket.emit('keyIsValid', input)
            : socket.emit('keyNotValid');
        });

        socket.on('createRoom', async function(){
            let key = generateCode();
            Object.keys(gameRooms).includes(key) ? (key = generateCode()) : key;
            gameRooms[key] = {
                roomKey: key,
                players: {},
                numPlayers: 0,
                numRounds: 0,
                currentPlayer: 0,
            };
            socket.emit('roomCreated', gameRooms[key]);
        });
    });
};

function generateCode(){
    let code = '';
    let dictionary = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i<5; i++){
        code += dictionary.charAt(Math.floor(Math.random() * dictionary.length));
    }

    return code;
}