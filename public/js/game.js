import config from 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js/config.js';
import LogInRegister from 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js/Scenes/LogInRegister.js';
import MainScene from 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js/Scenes/MainScene.js';
import Gameplay from "https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js/Scenes/Gameplay.js";

/**
 * Constructor del juego que gestiona las escenas
 */
class Game extends Phaser.Game {
  constructor() {
    // Añadir la configuración
    super(config);
    // Añadir todas las escenas
    this.scene.add('LogInRegister', LogInRegister);
    this.scene.add('MainScene', MainScene);
    this.scene.add('Gameplay', Gameplay);
    // Escena inicial del juego
    this.scene.start('LogInRegister');
  }
}
// Create new instance of game
window.onload = function () {
  setTimeout(function(){
    document.getElementById("progress").remove();
    document.getElementById("loadingBar").remove();
    window.game = new Game();}, 5000);
};