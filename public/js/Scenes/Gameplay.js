// Clase para la escena que permite jugar la partida
export default class Gameplay extends Phaser.Scene{
  constructor() {
    super('Gameplay');
  }
  init(data){
  }
  // Cargar assets y otros elementos para usarlos más adelante
  preload() {
    this.load.image('tint', '../../assets/images/tintable.png');
    this.load.image('GH', '../../assets/images/GitHubLogo.png');
    this.load.image('UFV', '../../assets/images/LogoUFV.jpg');
    this.load.image('Pf', '../../assets/images/Pfp.png');
  }
  // Código que se ejecuta al iniciar el juego por primera vez
  create(){
    // -------------------------- Footer -----------------------------
    var footbar = this.add.image(this.game.canvas.width*0, this.game.canvas.height*0.80, 'tint').setOrigin(0,0).setScale(20,3).setTint('0x333333');
    var GitHub = this.add.image(this.game.canvas.width*0.12, this.game.canvas.height*0.9, 'GH').setScale(0.05,0.05).setInteractive({cursor: 'pointer'});
    var uniFV = this.add.image(this.game.canvas.width*0.88, this.game.canvas.height*0.9, 'UFV').setOrigin(0.75,0.5).setScale(0.08,0.08).setInteractive({cursor: 'pointer'});
    GitHub.on('pointerup', linkGH , this);
    uniFV.on('pointerup', linkUFV, this);
    // ---------------------- Fin de Footer --------------------------
  }
  // Código que se ejecutara cada frame (loop jugable del juego)
  update() {}
}

function linkGH(){
  var s = window.open('https://github.com/ph0nsy/Proyectos_2-UFV', '_blank');
  if (s && s.focus)
  {
      s.focus();
  }
  else if (!s)
  {
      window.location.href = url;
  }
}

function linkUFV(){
  var s = window.open('https://www.ufv.es/estudiar/grado-informatica-madrid/plan-de-estudios/', '_blank');
  if (s && s.focus)
  {
      s.focus();
  }
  else if (!s)
  {
      window.location.href = url;
  }
}