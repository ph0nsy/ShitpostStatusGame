/** @type {import("../typings/phaser")} */
import config from "./scenes/config.js";
import LogInRegister from "./scenes/LogInRegister.js";
//import MainScene from "./scenes/MainScene";
//import Gameplay from "./scenes/Gameplay";

/**
 * Constructor del juego que gestiona las escenas
 */
class Game extends Phaser.Game {
  constructor() {
    // Añadir la configuración
    super(config);
    // Añadir todas las escenas
    this.scene.add("LogInRegister", LogInRegister);
    //this.scene.add("MainScene", MainScene);
    //this.scene.add("Gameplay", Gameplay);
    // Escena inicial del juego
    this.scene.start("LogInRegister");
  }
}
// Create new instance of game
window.onload = function () {
  window.game = new Game();
};
