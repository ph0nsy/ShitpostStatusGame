// Clase para la escena que permite jugar la partida
export default class MainScene extends Phaser.Scene{
    // Cargar assets y otros elementos para usarlos más adelante
    preload() {
      this.load.image('sky', '../assets/a.gif');
    }
    // Código que se ejecuta al iniciar el juego por primera vez
    create(){
      this.add.image(400, 300, 'sky');
    }
    // Código que se ejecutara cada frame (loop jugable del juego)
    update() {}
}