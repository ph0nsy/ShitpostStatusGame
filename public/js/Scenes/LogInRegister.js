// Clase para la escena que permite a los jugadores registrarse o iniciar sesión
export default class LogInRegister extends Phaser.Scene{
    // 
    constructor() {
        super('LogInRegister');
    }
    // Cargar assets y otros elementos para usarlos más adelante
    preload() {
      const imageSet = albums.get('Shitpost Status 01');
      this.load.image('rand1', imageSet[Math.floor(Math.random() * imageSet.length)]);
      this.load.image('rand2', imageSet[Math.floor(Math.random() * imageSet.length)]);
      this.load.image('bg', 'https://shitpost-status.onrender.com/assets/images/Background.jpg');
      this.load.html('Join', 'https://shitpost-status.onrender.com/assets/html/CodigoPartida.html');
      this.load.html('Create', 'https://shitpost-status.onrender.com/assets/html/NumeroRounds.html');
      this.load.html('Error', 'https://shitpost-status.onrender.com/assets/html/ErrorCode.html');
      this.load.html('Full', 'https://shitpost-status.onrender.com/assets/html/FullRoom.html');
      
    }
    // Código que se ejecuta al iniciar el juego por primera vez
    create() {
      const gamescene = this;
      console.log(`A socket connection has been made: ${socket.id}`);
      // -------------------------- IMG de FONDO -----------------------------
      // Cargar la imagen fondo en el punto (0,0) del canvas y
      // hacer que la imagen fondo ocupe toda la pantalla
      let bg  = this.add.image(0, 0, 'bg');
      // Tomamos el tamañod de la pantalla
      bg.displayHeight = this.sys.game.config.height;
      // Modificamos las dimensiones de la imagen fondo
      bg.scaleX = bg.scaleY;
      bg.y = game.config.height/2;
      bg.x = game.config.width/2;
      // Cambiamos el centro del fondo en función a la orientación y
      // dimensiones de la pantalla
      if(bg.y>bg.x){
        // Cambiar la zona de la imagen que se muestra:
        // Cuanto más cerca del 0 más se mueve el centro hacia la derecha
        // Cuanto más cerca del 1 más se mueve el centro hacia la izquierda
        bg.x = bg.displayWidth*0.1;
      }
      // -------------------------- FIN IMG de FONDO -----------------------------|
      //
      let imgR1 = this.add.image(this.game.canvas.width*0.2, this.game.canvas.height*0.65, 'rand1');
      imgR1.rotation -= 0.45;
      let imgR2 = this.add.image(this.game.canvas.width*0.8, this.game.canvas.height*0.35, 'rand2');
      imgR2.rotation += 0.45;
      //
      // -------------------------- FORM en HTML -----------------------------
      var text = this.add.text(this.cameras.main.worldView.x + this.cameras.main.width / 2, this.game.canvas.height*0.05, 'SHITPOST\nSTATUS', { color: 'whitesmoke', align: 'center', fontFamily: 'BirldandAero', fontSize: '80px'}).setOrigin(0.5,0);
      // -------------------------- Unirse a Partida -----------------------------
    var full_r = this.add.dom(this.game.canvas.width*0.5, this.game.canvas.height*0.5).createFromCache('Full').setOrigin(0.5,0.5).setScale(1,1).setActive(false).setVisible(false);
    full_r.addListener('click');
    full_r.on('click', function(event){
      if(event.target.name === 'Room_Full'){
        full_r = full_r.setActive(false).setVisible(false);
      }
    });

    var join_G = this.add.dom(this.game.canvas.width*0.5, this.game.canvas.height*0.5).createFromCache('Join');
    join_G.addListener('click');
    join_G.on('click', function(event){
      if(event.target.name === 'Unirse'){
        const codigo = this.getChildByName('codigopartida');
        if(codigo.value.length == 6){
          socket.emit('isKeyValid', codigo.value.toUpperCase());
        }
      }
    });

    socket.on('keyNotValid', function(){
      error_cod = error_cod.setActive(false).setVisible(false);
      error_cod = error_cod.setActive(true).setVisible(true);
    });

    socket.on('keyIsValid', function(code){
        
      socket.emit('joinRoom', code);

      socket.on('roomFull', function(isfull){
        if(isfull){
          error_cod = error_cod.setActive(false).setVisible(false);
          error_cod = error_cod.setActive(true).setVisible(true);
        } else {
          console.log(code);
          gamescene.scene.start('Gameplay', {id: socket.id, socket: socket, key: code});
        }
      });
    });
    // --------------------- Fin de Unirse a Partida -------------------------
    // -------------------------- Crear Partida -----------------------------
    var create_G = this.add.dom(this.game.canvas.width*0.5, this.game.canvas.height*0.5).createFromCache('Create');     
    create_G.addListener('click');
    create_G.on('click', function(event){
      if(event.target.name === 'Iniciar'){
        var noRondas = this.getChildByName('rondas');
        if(noRondas.value>3){
          noRondas.value = 3;
        }
        else if (noRondas.value<1){
          noRondas.value = 1;
        }
        socket.emit('createRoom', noRondas.value);
      }
    });

    socket.on('roomCreated', function(gameRoomInfo){
        
      socket.emit('joinRoom', gameRoomInfo.roomKey);

      socket.on('roomFull', function(isfull){
        if(isfull){
          error_cod = error_cod.setActive(false).setVisible(false);
          error_cod = error_cod.setActive(true).setVisible(true);
        } else {
          console.log(gameRoomInfo.roomKey);
          gamescene.scene.start('Gameplay', {id: socket.id, socket: socket, key: gameRoomInfo.roomKey});
        }
      });
      
    });
    // --------------------- Fin de Crear Partida -------------------------
    // -------------------------- Error Form -----------------------------
    var error_cod = this.add.dom(this.game.canvas.width*0.5, this.game.canvas.height*0.5).createFromCache('Error').setOrigin(0.5,0.5).setScale(1,1).setActive(false).setVisible(false);
    error_cod.addListener('click');
    error_cod.on('click', function(event){
      if(event.target.name === 'Code_Error'){
        error_cod = error_cod.setActive(false).setVisible(false);
        
        gamescene.registry.destroy(); // destroy registry
        gamescene.events.off(); // disable all active events
        gamescene.scene.restart(); // restart current scene
      }
    });
    // -------------------------- Fin Error Form -----------------------------
      
      // Animación de entrada del formulario
      // Sube hacia arriba desde la posición en la que se inicializa
      // hasta la que esta puesta en 'y'
      this.tweens.add({
        targets: join_G,
        y: gamescene.game.canvas.height*0.42,
        duration: 500,
        ease: 'Power3'
      });
      this.tweens.add({
        targets: create_G,
        y: gamescene.game.canvas.height*0.72,
        duration: 500,
        ease: 'Power3'
      });
      // --------------------------  FIN FORM en HTML -----------------------------|
    }
    // Código que se ejecutara cada frame (loop jugable del juego)
    update() {    }
  }
