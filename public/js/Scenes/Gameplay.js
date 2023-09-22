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
    const imageSet = albums.get('Shitpost Status 01');
    for (let pic_idx = 0; pic_idx < imageSet.length; pic_idx++) {
      
      this.load.image('pic_no' + pic_idx.toString(), imageSet[pic_idx]);
      console.log('pic_no' + pic_idx.toString());
      
    }
    this.load.html('SG',  './assets/html/StartGame.html');
    this.load.html('WO',  './assets/html/WaitOthers.html');
    this.load.html('GP', './assets/html/GeneratePrompt.html');
    this.load.html('PA', './assets/html/PlayAgain.html');
    this.load.image('bg', './assets/images/Background.jpg');
  }
  // Código que se ejecuta al iniciar el juego por primera vez
  create(data){
    console.log(data);
    const gamescene = this;
    var key = data.key;
    var name = data.id;
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
      bg.setAlpha(0.75);
    this.allPlayers = this.add.group();
    var readyForm = this.add.dom(this.game.canvas.width*0.6, this.game.canvas.height*0.35).createFromCache('SG').setActive(true).setVisible(true);
    readyForm.addListener('click');
    readyForm.on('click', function(event){
      if(event.target.name === 'start'){
        readyForm.setVisible(false);
        waitPlayers.setVisible(true);
        console.log(gamescene.allPlayers.getChildren().length);
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

    var promptPresent = this.add.text(this.game.canvas.width*0.5, this.game.canvas.height*0.4, 'Select an image to go with this:', { color: 'whitesmoke', align: 'center', fontSize: '30px', wordWrap: { width: this.game.canvas.width*0.5, useAdvancedWrap: true}}).setOrigin(0.5,0.5).setVisible(false);
    var prompt = this.add.text(this.game.canvas.width*0.5, this.game.canvas.height*0.5, '', { color: 'whitesmoke', align: 'center', fontFamily: 'Impact', fontSize: '40px', wordWrap: { width: this.game.canvas.width*0.45, useAdvancedWrap: true}}).setOrigin(0.5,0.5).setVisible(false);

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
          gamescene.scene.restart();
        }
      });
    });

    socket.on('currentJudge', function(roominfo, judgeId){
      console.log('judgegggg');
      console.log(roominfo);
      readyForm.setVisible(false);
      waitPlayers.setVisible(false);
      if(socket.id == judgeId){
        getPrompt.setVisible(true);
      } else {
        waitPlayers.setVisible(true);
      }
    });

    socket.on('getPrompt', function(judgeId, promptVal){  
      console.log(promptVal);
      prompt.setText(promptVal.toUpperCase());

      prompt.setStroke('black', 2);
      prompt.setShadow(4, 4, '#333333', 4, true, true);

      if(socket.id === judgeId){
        getPrompt.setVisible(false);
        waitPlayers.setVisible(true);
      } else {
        getPrompt.setVisible(false);
        waitPlayers.setVisible(false);
        promptPresent.setVisible(true);
        prompt.setVisible(true);
       
        var ops = [];
        for (let currDealed = 0; currDealed < 5; currDealed++) {
          let curr_img = 'pic_no' + Math.floor(Math.random() * albums.get('Shitpost Status 01').length).toString();
          ops[currDealed] = gamescene.add.image(gamescene.game.canvas.width*0.165*(currDealed+1), gamescene.game.canvas.height*0.6, curr_img).setOrigin(0.5,0).setInteractive({cursor:'pointer'}).setScale(0.57);
          ops[currDealed].on('pointerover', function () {
            this.setTint(0xfff000);
          });
          ops[currDealed].on('pointerout', function () {
            this.clearTint();
          });
          ops[currDealed].on('pointerup', function(){
            //socket.emit('selectiion', curr_img, socket.id)
          }); 
        }
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

    socket.on('preview', function(roomSelected){
      if(roomSelected[socket.id] == ''){
        console.log(stillSelecting);
      } else {
        // Display preview (to see who is left)
      }
    });



    socket.on('nextJudge', function(){

    });

    socket.on('endGame', function(){
      // setVisible(false) all
      playAgain.setVisible(true);
    });

    // -------------------------- Footer -----------------------------
    var textCode = this.add.text(this.game.canvas.width*0.5, this.game.canvas.height*0.82, 'Room Key:', { color: 'whitesmoke', align: 'center', fontFamily: 'Arial', fontSize: '32px'}).setOrigin(0.5,0);
    var roomKeyText = this.add.text(this.game.canvas.width*0.5, this.game.canvas.height*0.86, key.toUpperCase(), { color: 'whitesmoke', align: 'center', fontFamily: 'Impact', fontSize: '80px'}).setOrigin(0.5,0);
    // ---------------------- Fin de Footer --------------------------
  }
  // Código que se ejecutara cada frame (loop jugable del juego)
  update() {}
  
  addPlayer(scene, playerInfo){
    var exists = false;
    this.allPlayers.getChildren().forEach(function (currplayer) {
      if(currplayer.playerId === playerInfo.playerId){
        exists = true;
      }
    });
    
    if(!exists){
      const player = this.add.text(this.game.canvas.width*0.05, this.game.canvas.height*(0.10*(this.allPlayers.getLength()+1)), playerInfo.username + '  \u000a  ' + playerInfo.score, { font: "24px Arial Black", fill: "grey", align: "center" }).setOrigin(0,0.5);
      player.setStroke('white', 4); // border
      player.setShadow(2, 2, '#333333', 6, true, false); // shadow
      player.playerId = playerInfo.playerId;
      this.allPlayers.add(player);
    }
  }
  
  addOtherPlayers(scene, playerInfo){
    var exists = false;
    this.allPlayers.getChildren().forEach(function (currplayer) {
      if(currplayer.playerId === playerInfo.playerId){
        exists = true;
      }
    });
    if(!exists){
      const otherP = this.add.text(this.game.canvas.width*0.05, this.game.canvas.height*(0.10*(this.allPlayers.getLength()+1)), playerInfo.username + ' \u000a ' + playerInfo.score,  { font: "24px Arial Black", fill: "#fff", align: "center" }).setOrigin(0,0.5);
      otherP.setShadow(4, 4, '#333333', 4, true, true); // shadow
      otherP.playerId = playerInfo.playerId;
      this.allPlayers.add(otherP);
    }
  }
}
