// Configuramos los aspectos visuales (con respecto al canvas del juego) y algunos de los aspectos internos del mismo (como las físicas)
var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
        gravity: { y: 0 }
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    } 
  };
// Aplicamos la configuración especificada al juego
var game = new Phaser.Game(config);
// Cargar assets y otros elementos para usarlos más adelante
function preload() {}
// Código que se ejecuta al iniciar el juego por primera vez
function create() {
    this.socket = io();
}
// Código que se ejecutara cada frame (loop jugable del juego)
function update() {}