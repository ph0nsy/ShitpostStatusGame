// Clase para la escena que permite a los jugadores registrarse o iniciar sesión
var LOGREGISTER = Phaser.Class({
  
  Extends: Phaser.Scene,

  initialize: 

  // Carga la clase LOGREGISTER como una escena de Phaser
  function LOGREGISTER(){
    Phaser.Scene.call(this, { key: 'logreg', active: true });
  },
  // Cargar assets y otros elementos para usarlos más adelante
  preload: function () {
    this.load.image('bg', '../assets/a.gif');
    this.load.html('form', '../assets/html/form.html');
  },
  // Código que se ejecuta al iniciar el juego por primera vez
  create: function () {
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
    //
    // -------------------------- FORM en HTML -----------------------------
    
    // link: https://phaser.io/examples/v3/view/game-objects/dom-element/form-input
    //var element = this.add.dom(400, 600).createFromCache('form');
    
    // -------------------------- FORM en HTML -----------------------------|


  },
  // Código que se ejecutara cada frame (loop jugable del juego)
  update: function(time, delta) {

  },
  
  // Para comprobar que las contraseñas coinciden
  checkPaswords: function(){
    // Tomamos las contraseñas para ver si coinciden
    pswOg = document.f1.paswordreg.value
    pswDb = document.f1.paswordconf.value

    // Ambas contraseñas coinciden
    if (pswOg == pswDb){
      alert("SI");
    } else {
      alert("Paswords don't match!");
    }
  }

});

// Clase para la escena que permite a los jugadores registrarse o iniciar sesión
var MAINMENU = Phaser.Class({
  
  Extends: Phaser.Scene,

  initialize: 

  // Carga la clase LOGREGISTER como una escena de Phaser
  function LOGREGISTER(){
    Phaser.Scene.call(this, { key: 'logreg', active: true });
  },
  // Cargar assets y otros elementos para usarlos más adelante
  preload: function () {
    this.load.image('sky', '../assets/a.gif');
  },
  // Código que se ejecuta al iniciar el juego por primera vez
  create: function () {
    this.add.image(400, 300, 'sky');
  },
  // Código que se ejecutara cada frame (loop jugable del juego)
  update: function(time, delta) {

  }
});

// Configuramos los aspectos visuales (con respecto al canvas del juego) y algunos de los aspectos internos del mismo (como las físicas)
var config = {
  // La longitud de la pantalla es ocupada por un canvas
  width: window.innerWidth,
  height: window.innerHeight,
  // TIpo de renderizado automático
  type: Phaser.AUTO,
  // Elemento de HTML al que se adherirá el canvas
  parent: document.getElementById('game'),
  // Sistema de físicas a utilizar
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  // Escenas a utilizar en el juego
  scene: [
    LOGREGISTER,
    //MAINMENU,
    //GAMEPLAY
  ]
};
// Aplicamos la configuración especificada al juego
var game = new Phaser.Game(config);
