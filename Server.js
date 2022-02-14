// Este será el servidor de nuestro juego
// 
// A continuación inicializaremos todo lo relacionado con "node.js" que vamos a necesitar
//
// Express
var express = require('express');
var app = express();
//app = module.exports.app = express();
// http
var server = require('http').Server(app).createServer(app);
// Socket.io
var io = require('socket.io').listen(server);
// Recogemos todos los archivos estáticos relacionados con html que necesitaremos
app.use('/css',express.static(__dirname + '/public'));
// Tomamos el index
app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});
// Escuchamos a las conexiones y desconexiones
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function (  ) {
        console.log('user disconnected');
    });
});
// Apuntamos al puerto 8081
server.listen(8081,function(){ 
    console.log(`Listening on ${server.address().port}`);
});