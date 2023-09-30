import config from './config.js';
import Lobby from './Scenes/Lobby.js';
import Gameplay from "./Scenes/Gameplay.js";

/**
 * Constructor del juego que gestiona las escenas
 */
class Game extends Phaser.Game {
  constructor() {
    // Añadir la configuración
    super(config);
    // Añadir todas las escenas
    this.scene.add('Lobby', Lobby);
    this.scene.add('Gameplay', Gameplay);
    // Escena inicial del juego
    this.scene.start('Lobby');
  }
}
// Create new instance of game
window.onload = function () {
  setTimeout(function(){
    document.getElementById("progress").remove();
    document.getElementById("loadingBar").remove();
    window.game = new Game();}, 5000);
};