// Clase para la escena que permite a los jugadores crear una partida
export default class MainScene extends Phaser.Scene{
  constructor() {
    super('MainScene');
  }
  init(data){
    this.userID = data.name;
  }
  // Cargar assets y otros elementos para usarlos más adelante
  preload() {
    this.load.image('tint', '../../assets/images/tintable.png');
    this.load.image('GH', '../../assets/images/GitHubLogo.png');
    this.load.image('UFV', '../../assets/images/LogoUFV.jpg');
    this.load.image('Pf', '../../assets/images/Pfp.png');
    this.load.html('RGB', '../../assets/html/RGB.html');
    this.load.html('Vol', '../../assets/html/Volumen.html');
    this.load.html('Join', '../../assets/html/CodigoPartida.html');
    this.load.html('Create', '../../assets/html/NumeroRounds.html');
  }
  // Código que se ejecuta al iniciar el juego por primera vez
  create(){ 
    var sidebar = this.add.image(this.game.canvas.width*0, this.game.canvas.height*0, 'tint').setScale(20,20).setTint('0xD7FAFE');
    var sidebar = this.add.image(this.game.canvas.width*0.35, this.game.canvas.height*0, 'tint').setOrigin(1,0).setScale(10,10).setTint(rgb2Hex(255, 255, 255));
    var profile = this.add.image(this.game.canvas.width*0.18, this.game.canvas.height*0.15, 'Pf').setScale(0.1,0.1);
    var username = this.add.text(this.game.canvas.width*0.18, this.game.canvas.height*0.23, this.userID.value, { color: 'black', align: 'center', fontFamily: 'Arial', fontSize: '32px'}).setOrigin(0.5,0);
    var rgb = this.add.dom(this.game.canvas.width*0.18, this.game.canvas.height*0.4).createFromCache('RGB').setScale(1.25,1.25);
    var username = this.add.text(this.game.canvas.width*0.18, this.game.canvas.height*0.625, 'Volumen', { color: 'black', align: 'center', fontFamily: 'Arial', fontSize: '32px'}).setOrigin(0.5,0);
    var volume = this.add.dom(this.game.canvas.width*0.18, this.game.canvas.height*0.70).createFromCache('Vol').setScale(2,2);
    var join_G = this.add.dom(this.game.canvas.width*0.65, this.game.canvas.height*0.30).createFromCache('Join');
    var create_G = this.add.dom(this.game.canvas.width*0.65, this.game.canvas.height*0.55).createFromCache('Create');
    // -------------------------- Footer -----------------------------
    var footbar = this.add.image(this.game.canvas.width*0, this.game.canvas.height*0.95, 'tint').setScale(20,1).setTint('0xA9A9A9');
    var GitHub = this.add.image(this.game.canvas.width*0.45, this.game.canvas.height*0.92, 'GH').setScale(0.03,0.03).setInteractive({cursor: 'pointer'});
    var uniFV = this.add.image(this.game.canvas.width*0.55, this.game.canvas.height*0.92, 'UFV').setScale(0.05,0.05).setInteractive({cursor: 'pointer'});
    GitHub.on('pointerup', linkGH , this);
    uniFV.on('pointerup', linkUFV, this);
    // ---------------------- Fin de Footer --------------------------
  }
  // Código que se ejecutara cada frame (gameplay loop del juego)
  update() {  }
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

function single2Hex(single_color) {
  var hex = single_color.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgb2Hex(r, g, b){
  return '0x' + single2Hex(r) + single2Hex(g) + single2Hex(b);
}