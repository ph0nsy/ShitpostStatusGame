// Clase para la escena que permite a los jugadores registrarse o iniciar sesión
export default class LogInRegister extends Phaser.Scene{
    // 
    constructor() {
        super('LogInRegister');
    }
    
    // Cargar assets y otros elementos para usarlos más adelante
    preload() {
      var image1 = Math.floor((Math.random() * (27 - 1) ) + 1);
      image1 = '../../assets/images/GameImages/' + image1.toString() + '.png';
      var image2 = Math.floor((Math.random() * (55 - 28) ) + 28);
      image2 = '../../assets/images/GameImages/' + image2.toString() + '.png';
      this.load.image('rand1', image1);
      this.load.image('rand2', image2);
      this.load.image('bg', '../../assets/images/Background.jpg');
      this.load.html('form', '../../assets/html/form.html');
    }
    // Código que se ejecuta al iniciar el juego por primera vez
    create() {
      const gamescene = this;
      var socket = io();
      socket.on("connect", () => {
        console.log(`A socket connection has been made: ${socket.id}`);
      });
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
      var text = this.add.text(this.cameras.main.worldView.x + this.cameras.main.width / 2, this.game.canvas.height*0.05, 'SHITPOST\nSTATUS', { color: 'whitesmoke', align: 'center', fontFamily: 'MyFont', fontSize: '80px'}).setOrigin(0.5,0);
      var element = this.add.dom(this.cameras.main.worldView.x + this.cameras.main.width / 2, this.cameras.main.worldView.y + this.cameras.main.height).createFromCache('form');
      element.addListener('click');
      element.on('click', function(event){
        socket.on('failUser', function(){
          var usernamereg = element.getChildByName('usernamereg');
          usernamereg.setCustomValidity('Usuario no válido');
          usernamereg.reportValidity();
        });
        
        socket.on('logUser', function(id){
          element.removeListener('click');
          //  Tween the login form out

          element.scene.tweens.add({targets: element, alpha: 0.00, scaleX: 3, scaleY: 3, duration: 1000, ease: 'Power3',
              onComplete: function ()
              {
                gamescene.scene.start('MainScene', {id: id, socket:socket});
              }
          });
        });
        if(event.target.name === 'Registrar'){
          var usernameCreate = this.getChildByName('usernamereg');
          var passwordCreate = this.getChildByName('passwordreg');
          var passwordConfirm = this.getChildByName('passwordconf');
          passwordCreate.addEventListener("invalid", function(){
            passwordCreate.setCustomValidity('La contraseña debe tener al menos:\n - 8 caracteres\n - Un número\n - Una minúscula\n - Una mayúscula\n')
            passwordCreate.reportValidity();
          });
          //  Have they entered anything?
          if (usernameCreate.value !== '' && passwordCreate.value !== '' && passwordCreate.checkValidity() && checkPaswords(passwordCreate,passwordConfirm))
          {
            socket.emit('checkUsername', usernameCreate.value, passwordCreate.value);
          }
        }
        else if(event.target.name === 'Iniciar'){
          var usernameLogin = this.getChildByName('usernamelog');
          var passwordLogin = this.getChildByName('passwordlog');
          //  Have they entered anything?
          if (usernameLogin.value !== '' && passwordLogin.value !== ''){
            socket.emit('checkLogIn', usernameLogin.value, passwordLogin.value);
          }
        }
      });
      // Animación de entrada del formulario
      // Sube hacia arriba desde la posición en la que se inicializa
      // hasta la que esta puesta en 'y'
      this.tweens.add({
        targets: element,
        y: this.game.canvas.height*0.58,
        duration: 2000,
        ease: 'Power3'
      });
      // --------------------------  FIN FORM en HTML -----------------------------|
    }
    // Código que se ejecutara cada frame (loop jugable del juego)
    update() {    }
  }


  function checkUsername(username){

  }

  // Para comprobar que las contraseñas coinciden
  function checkPaswords(pswOg, pswDb){
    // Ambas contraseñas coinciden
    if (pswOg.value == pswDb.value){
      pswDb.setCustomValidity('');
      return true;
    }
    else {
      pswDb.setCustomValidity('Las contraseñas no coinciden');
      pswDb.reportValidity();
      return false;
    }
  }

  function checkLogIn(user, pwd){
    if (true) {
      user.setCustomValidity('');
      return true;
    } else {
      user.setCustomValidity('Usuario no válido');
      user.reportValidity();
      return null;
    }
    bcrypt.hash(pwd, saltRounds, (err, hash) => {
      dbcon.connect(function(err){
        if(err) throw err;
          dbcon.query('SELECT id FROM User WHERE nombre = ? AND contraseña = ?', [pool.escape(user), pool.escape(hash)], function(err, row) {
            if(err) {
                logger.error('Error in DB');
                logger.debug(err);
                return;
            } else {
            }
        });
      });
    });
  }