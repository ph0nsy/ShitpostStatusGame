//import { text } from "express";

// Clase para la escena que permite jugar la partida
export default class Gameplay extends Phaser.Scene{
  constructor() {
    super('Gameplay');
    this.state = {};
  }
  init(data){
    var socket = data.socket;
  }
  // Cargar assets y otros elementos para usarlos más adelante
  preload() {
    this.load.image('1', '../../assets/images/GameImages/1.png');
    this.load.image('2', '../../assets/images/GameImages/2.png');
    this.load.image('3', '../../assets/images/GameImages/3.png');
    this.load.image('4', '../../assets/images/GameImages/4.png');
    this.load.image('5', '../../assets/images/GameImages/5.png');
    this.load.image('6', '../../assets/images/GameImages/6.png');
    this.load.image('7', '../../assets/images/GameImages/7.png');
    this.load.image('8', '../../assets/images/GameImages/8.png');
    this.load.image('9', '../../assets/images/GameImages/9.png');
    this.load.image('10', '../../assets/images/GameImages/10.png');
    this.load.image('11', '../../assets/images/GameImages/11.png');
    this.load.image('12', '../../assets/images/GameImages/12.png');
    this.load.image('13', '../../assets/images/GameImages/13.png');
    this.load.image('14', '../../assets/images/GameImages/14.png');
    this.load.image('15', '../../assets/images/GameImages/15.png');
    this.load.image('16', '../../assets/images/GameImages/16.png');
    this.load.image('17', '../../assets/images/GameImages/17.png');
    this.load.image('18', '../../assets/images/GameImages/18.png');
    this.load.image('19', '../../assets/images/GameImages/19.png');
    this.load.image('20', '../../assets/images/GameImages/20.png');
    this.load.image('21', '../../assets/images/GameImages/21.png');
    this.load.image('22', '../../assets/images/GameImages/22.png');
    this.load.image('23', '../../assets/images/GameImages/23.png');
    this.load.image('24', '../../assets/images/GameImages/24.png');
    this.load.image('25', '../../assets/images/GameImages/25.png');
    this.load.image('26', '../../assets/images/GameImages/26.png');
    this.load.image('27', '../../assets/images/GameImages/27.png');
    this.load.image('28', '../../assets/images/GameImages/28.png');
    this.load.image('29', '../../assets/images/GameImages/29.png');
    this.load.image('30', '../../assets/images/GameImages/30.png');
    this.load.image('31', '../../assets/images/GameImages/31.png');
    this.load.image('32', '../../assets/images/GameImages/32.png');
    this.load.image('33', '../../assets/images/GameImages/33.png');
    this.load.image('34', '../../assets/images/GameImages/34.png');
    this.load.image('35', '../../assets/images/GameImages/35.png');
    this.load.image('36', '../../assets/images/GameImages/36.png');
    this.load.image('37', '../../assets/images/GameImages/37.png');
    this.load.image('38', '../../assets/images/GameImages/38.png');
    this.load.image('39', '../../assets/images/GameImages/39.png');
    this.load.image('40', '../../assets/images/GameImages/40.png');
    this.load.image('41', '../../assets/images/GameImages/41.png');
    this.load.image('42', '../../assets/images/GameImages/42.png');
    this.load.image('43', '../../assets/images/GameImages/43.png');
    this.load.image('44', '../../assets/images/GameImages/44.png');
    this.load.image('45', '../../assets/images/GameImages/45.png');
    this.load.image('46', '../../assets/images/GameImages/46.png');
    this.load.image('47', '../../assets/images/GameImages/47.png');
    this.load.image('48', '../../assets/images/GameImages/48.png');
    this.load.image('49', '../../assets/images/GameImages/49.png');
    this.load.image('50', '../../assets/images/GameImages/50.png');
    this.load.image('51', '../../assets/images/GameImages/51.png');
    this.load.image('52', '../../assets/images/GameImages/52.png');
    this.load.image('53', '../../assets/images/GameImages/53.png');
    this.load.image('54', '../../assets/images/GameImages/54.png');
    this.load.image('55', '../../assets/images/GameImages/55.png');
    this.load.html('SG',  '../../assets/html/StartGame.html');
    this.load.html('WO',  '../../assets/html/WaitOthers.html');
    this.load.html('GP', '../../assets/html/GeneratePrompt.html');
    this.load.html('PA', '../../assets/html/PlayAgain.html');
    this.load.image('tint', '../../assets/images/tintable.png');
    this.load.image('GH', '../../assets/images/GitHubLogo.png');
    this.load.image('UFV', '../../assets/images/LogoUFV.jpg');
    this.load.image('Pf', '../../assets/images/Pfp.png');
  }
  // Código que se ejecuta al iniciar el juego por primera vez
  create(data){
    console.log(data);
    const gamescene = this;
    var key = data.key;
    var name = data.id;
    var bg = gamescene.add.image(this.game.canvas.width*0, this.game.canvas.height*0, 'tint').setScale(20,20).setTint('0xD7FAFE');
    this.allPlayers = this.add.group();
    var readyForm = this.add.dom(this.game.canvas.width*0.6, this.game.canvas.height*0.35).createFromCache('SG').setActive(true).setVisible(true);
    readyForm.addListener('click');
    readyForm.on('click', function(event){
      if(event.target.name === 'start'){
        readyForm.setVisible(false);
        waitPlayers.setVisible(true);
        socket.emit('ready', key, socket.id);
      }
    });
    var waitPlayers = this.add.dom(this.game.canvas.width*0.6, this.game.canvas.height*0.35).createFromCache('WO').setActive(false).setVisible(false);
    var getPrompt = this.add.dom(this.game.canvas.width*0.6, this.game.canvas.height*0.35).createFromCache('GP').setActive(false).setVisible(false);  
    getPrompt.addListener('click');
    getPrompt.on('click', function(event){
      if(event.target.name === 'sumbmitPrompt'){
        socket.emit('sendPrompt', key, this.getChildByName('prompt').value);
      }
    });

    var prompt = this.add.text(this.game.canvas.width*0.65, this.game.canvas.height*0.15, '', { color: 'whitesmoke', align: 'center', fontFamily: 'Arial', fontSize: '80px'}).setOrigin(0.5,0).setVisible(false);

    var playAgain = this.add.dom(this.game.canvas.width*0.6, this.game.canvas.height*0.35).createFromCache('PA').setActive(false).setVisible(false);

    socket.emit('isOnRoom', key, name);
    
    socket.on('setState', function(state){
      const {roomKey, players, numPlayers} = state;
      gamescene.state.roomKey = roomKey;
      gamescene.state.players = players;
      gamescene.state.numPlayers = numPlayers;
    });

    socket.on('currentPlayers', function(arg){
      const {players, numPlayers} = arg;
      gamescene.state.numPlayers = numPlayers;
      Object.keys(players).forEach(function(id){
        console.log(players[id]);
        if(players[id].playerId === socket.id){
          gamescene.addPlayer(gamescene, players[id]);
        } else {
          gamescene.addOtherPlayers(gamescene, players[id]);
        }
      });
    });

    socket.on('newPlayer', function(arg){
      const {playerInfo, numPlayers} = arg;
      gamescene.addOtherPlayers(gamescene, playerInfo);
      gamescene.state.numPlayers = numPlayers;
    });

    socket.on('disconnected', function(arg){
      const {playerId, numPlayers} = arg;
      gamescene.state.numPlayers = numPlayers;
      gamescene.allPlayers.getChildren().forEach(function (otherPlayer) {
        if(playerId === otherPlayer.playerId){
          otherPlayer.destroy();
        }
      });
    });

    socket.on('currentJudge', function(judgeId){
      console.log('judgegggg');
      readyForm.setVisible(false);
      waitPlayers.setVisible(false);
      if(socket.id == judgeId){
        getPrompt.setVisible(true);
      } else {
        waitPlayers.setVisible(true);
      }
    });

    socket.on('getPrompt', function(judgeId, promptVal){  
      text.setText(promptVal);

      if(socket.id === judgeId){
        getPrompt.setVisible(false);
        waitPlayers.setVisible(true);
      } else {
        getPrompt.setVisible(false);
        waitPlayers.setVisible(false);
       
        op1img = (Math.floor(Math.random() * 55 ) + 1).toString();
        var op1 = this.add.sprite(this.game.canvas.width*0.65, this.game.canvas.height*0.3, op1img).setOrigin(0.5,0).setInteractive({cursor:'pointer'});
        op1.on('pointerover', function (event) {
            this.setTint(0xfff000);
        });
        op1.on('pointerout', function (event) {
            this.clearTint();
        });
        op1.on('pointerup', function(){
    
        });
    
        op2img = (Math.floor(Math.random() * 55 ) + 1).toString();
        var op2 = this.add.sprite(this.game.canvas.width*0.5, this.game.canvas.height*0.45, op2img).setOrigin(0.5,0).setInteractive({cursor:'pointer'});
        op2.on('pointerover', function (event) {
            this.setTint(0xfff000);
        });
        op2.on('pointerout', function (event) {
            this.clearTint();
        });
        op2.on('pointerup', function(){
    
        });
        
        op3img = (Math.floor(Math.random() * 55 ) + 1).toString();
        var op3 = this.add.sprite(this.game.canvas.width*0.8, this.game.canvas.height*0.45, op3img).setOrigin(0.5,0).setInteractive({cursor:'pointer'});
        op3.on('pointerover', function (event) {
            this.setTint(0xfff000);
        });
        op3.on('pointerout', function (event) {
            this.clearTint();
        });
        op3.on('pointerup', function(){
    
        });
        
        op4img = (Math.floor(Math.random() * 55 ) + 1).toString();
        var op4 = this.add.sprite(this.game.canvas.width*0.65, this.game.canvas.height*0.7, op4img).setOrigin(0.5,0).setInteractive({cursor:'pointer'});
        op4.on('pointerover', function (event) {
            this.setTint(0xfff000);
        });
        op4.on('pointerout', function (event) {
            this.clearTint();
        });
        op4.on('pointerup', function(){
          op1.destroy();
          op2.destroy();
          op3.destroy();
          op4.destroy();
          //socket.emit(,op4img);
        });
      }
    });

    socket.on('waitSelects', function(){
      waitPlayers.setVisible(false);
      waitPlayers.setVisible(true);
    });

    socket.on('waitVotes', function(judgeId, selected){
      if(socket.id === judgeId){
        // Vote >>  emit hasVoted
        waitPlayers.setVisible(false);
      } else {
        waitPlayers.setVisible(false);
        // Show votes (disableInteractive())
      }
    });

    socket.on('nextJudge', function(){

    });

    socket.on('endGame', function(){
      // setVisible(false) all
      playAgain.setVisible(true);
    });

    // -------------------------- Footer -----------------------------
    var footbar = this.add.image(this.game.canvas.width*0, this.game.canvas.height*0.80, 'tint').setOrigin(0,0).setScale(20,3).setTint('0x333333');
    var GitHub = this.add.image(this.game.canvas.width*0.15, this.game.canvas.height*0.9, 'GH').setOrigin(0.5,0.5).setScale(0.05,0.05).setInteractive({cursor: 'pointer'});
    var uniFV = this.add.image(this.game.canvas.width*0.88, this.game.canvas.height*0.9, 'UFV').setOrigin(0.75,0.5).setScale(0.08,0.08).setInteractive({cursor: 'pointer'});
    GitHub.on('pointerup', linkGH , this);
    uniFV.on('pointerup', linkUFV, this);

    var textCode = this.add.text(this.game.canvas.width*0.5, this.game.canvas.height*0.82, 'Clave de la sala:', { color: 'whitesmoke', align: 'center', fontFamily: 'Arial', fontSize: '32px'}).setOrigin(0.5,0);
    var roomKeyText = this.add.text(this.game.canvas.width*0.5, this.game.canvas.height*0.86, key.toUpperCase(), { color: 'whitesmoke', align: 'center', fontFamily: 'MyFont', fontSize: '80px'}).setOrigin(0.5,0);
    // ---------------------- Fin de Footer --------------------------
  }
  // Código que se ejecutara cada frame (loop jugable del juego)
  update() {}
  
  addPlayer(scene, playerInfo){
    const player = this.add.text(this.game.canvas.width*0.15, this.game.canvas.height*(0.10*(this.allPlayers.getLength()+1)), playerInfo.username + ' - ' + playerInfo.score, { font: "24px Arial", fill: "#000000", align: "center" }).setOrigin(0,0.5);
    player.playerId = playerInfo.playerId;
    this.allPlayers.add(player);
    console.log('AddP ' + player);
  }
  
  addOtherPlayers(scene, playerInfo){
    const otherP = this.add.text(this.game.canvas.width*0.15, this.game.canvas.height*(0.10*(this.allPlayers.getLength()+1)), playerInfo.username + ' - ' + playerInfo.score,  { font: "24px Arial", fill: "#000000", align: "center" }).setOrigin(0,0.5);
    otherP.playerId = playerInfo.playerId;
    this.allPlayers.add(otherP);
    console.log('AddOtherP ' + otherP);
  }
}

function linkGH(){
  var s = window.open('https://github.com/ph0nsy/ShitpostStatusGame', '_blank');
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
