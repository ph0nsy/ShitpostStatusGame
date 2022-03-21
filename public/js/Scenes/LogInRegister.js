// Clase para la escena que permite a los jugadores registrarse o iniciar sesión
export default class LogInRegister extends Phaser.Scene{
    // 
    constructor() {
        super("LogInRegister")
    }
    // Cargar assets y otros elementos para usarlos más adelante
    preload() {
      this.load.image('bg', '../../assets/a.gif');
      this.load.html('form', '../../assets/html/form.html');
    }
    // Código que se ejecuta al iniciar el juego por primera vez
    create() {
        const scene = this;
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
      
      var text = this.add.text(10, 10, 'Please login to play', { color: 'white', fontFamily: 'Arial', fontSize: '32px '});
      var element = this.add.dom(this.cameras.main.worldView.x + this.cameras.main.width / 2, this.cameras.main.worldView.y + this.cameras.main.height / 2).createFromCache('form');
      // -------------------------- FORM en HTML -----------------------------|
  
  
    }
    // Código que se ejecutara cada frame (loop jugable del juego)
    update() {    }
    
    // Para comprobar que las contraseñas coinciden
    checkPaswords(){
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
  
  }