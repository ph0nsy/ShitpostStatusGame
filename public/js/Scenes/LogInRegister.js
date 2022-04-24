// Clase para la escena que permite a los jugadores registrarse o iniciar sesión
export default class LogInRegister extends Phaser.Scene{
    // 
    constructor() {
        super('LogInRegister');
    }
    
    // Cargar assets y otros elementos para usarlos más adelante
    preload() {
      this.load.image('bg', '../../assets/images/Background.jpg');
      this.load.html('form', '../../assets/html/form.html');
    }
    // Código que se ejecuta al iniciar el juego por primera vez
    create() {
      const gamescene = this;
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
      var text = this.add.text(this.cameras.main.worldView.x + this.cameras.main.width / 2, this.game.canvas.height*0.05, 'SHITPOST\nSTATUS', { color: 'whitesmoke', align: 'center', fontFamily: 'MyFont', fontSize: '80px'}).setOrigin(0.5,0);
      var element = this.add.dom(this.cameras.main.worldView.x + this.cameras.main.width / 2, this.cameras.main.worldView.y + this.cameras.main.height).createFromCache('form');
      element.addListener('click');
      element.on('click', function(event){
        if(event.target.name === 'Registrar'){
          var usernameCreate = this.getChildByName('usernamereg');
          var passwordCreate = this.getChildByName('passwordreg');
          var passwordConfirm = this.getChildByName('passwordconf');

          //  Have they entered anything?
          if (usernameCreate.value !== '' && passwordCreate.value !== '' && checkValidity(passwordCreate) && checkPaswords(passwordCreate,passwordConfirm))
          {
            if (checkUsername(usernameCreate)){
              
              //
              // CREATE ACCOUNT
              //

              //  Turn off the click events
              this.removeListener('click');
              //  Tween the login form out
              this.scene.tweens.add({targets: element, alpha: 0.00, scaleX: 3, scaleY: 3, duration: 1000, ease: 'Power3',
                  onComplete: function ()
                  {
                    gamescene.scene.start('MainScene', {name: usernameLogin});
                  }
              }); 
            }
          }
        }
        else if(event.target.name === 'Iniciar'){
          var usernameLogin = this.getChildByName('usernamelog');
          var passwordLogin = this.getChildByName('passwordlog');
          //  Have they entered anything?
          if (usernameLogin.value !== '' && passwordLogin.value !== '' && checkLogIn(usernameLogin, passwordLogin)){
            //  Turn off the click events
            this.removeListener('click');
            //  Tween the login form out
            this.scene.tweens.add({targets: element, alpha: 0.00, scaleX: 3, scaleY: 3, duration: 1000, ease: 'Power3',
                onComplete: function ()
                {
                  gamescene.scene.start('MainScene', {name: usernameLogin});
                }
            });            
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
    
    //
    // COMPROBAR SI EL USUARIO YA EXISTE EN LA BDD
    //

    if(true){
      username.setCustomValidity('');
      return true;
    }
    else{
      username.setCustomValidity('Usuario no válido');
      username.reportValidity();
      return false;
    }
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

  function checkValidity(pwd){
    const isValid = pwd.checkValidity();
    pwd.setAttribute('aria-invalid', !isValid);
    if (!isValid) {
      pwd.setCustomValidity('La contraseña debe tener al menos:\n - 8 caracteres\n - Un número\n - Una minúscula\n - Una mayúscula\n')
      pwd.reportValidity();
      return false;
    }
    else {
      return true;
    }
  }

  function checkLogIn(user, pwd){
    //
    // COMPROBAR SI USUARIO Y CONTRASEÑA COINCIDEN EN LA BDD
    //
    if(true){
      user.setCustomValidity('');
      return true;
    }
    else{
      user.setCustomValidity('El usuario y la contraseña no coinciden');
      user.reportValidity();
      return false;
    }
  }