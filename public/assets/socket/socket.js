
const gameRooms = {
    // Elementos que habrá dentro de la constante
    /*[roomKey]:{
        users: [],

    }*/
};

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`A socket connection has been made: ${socket.id}`);

        socket.on('isKeyValid', function (input){
            const keyArray = Object.keys(gameRooms)
            ? socket.emit('keyIsValid', input)
            : socket.emit('keyNotValid');
        });
    });
};