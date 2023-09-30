// Configuramos los aspectos visuales (con respecto al canvas del juego)
// y algunos de los aspectos internos del mismo (como las físicas)
export default {
    // La longitud de la pantalla es ocupada por un canvas
    width: (window.innerWidth<1100) ? window.innerWidth-30 : 1070,
    height: (window.innerHeight<970) ? window.innerHeight-30 : 940,
    // TIpo de renderizado automático (intenta usar WebGL o,
    // si no puede, Canvas)
    type: Phaser.AUTO,
    // Elemento de HTML al que se adherirá el canvas
    parent: "game",
    // Sistema de físicas a utilizar
    physics: {
      default: "arcade",
      arcade: {
        // Para que las físicas no corran en debug
        debug: false,
        // Gravedad sobre el eje y
        gravity: { y: 0 }
      }
    },
    // Para crear elementos de html e inputs en el canvas
    dom: {
        createContainer: true,
    },
    scene: [],
  };