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
  preload(data) {
    const imageSet = albums.get('Shitpost Status 01');
    
    for (let pic_idx = 0; pic_idx < imageSet.length; pic_idx++) {
      
      this.load.image('pic_no' + pic_idx.toString(), imageSet[pic_idx]);
      
    }
    this.load.html('SG',  'https://shitpost-status.onrender.com/assets/html/StartGame.html');
    this.load.html('WO',  'https://shitpost-status.onrender.com/assets/html/WaitOthers.html');
    this.load.html('GP', 'https://shitpost-status.onrender.com/assets/html/GeneratePrompt.html');
    this.load.html('PA', 'https://shitpost-status.onrender.com/assets/html/PlayAgain.html');
    this.load.image('bg', 'https://shitpost-status.onrender.com/assets/images/Background.jpg');
    this.load.image('vote', 'https://shitpost-status.onrender.com/assets/images/Vote.png');
    this.load.image('hidden', 'https://shitpost-status.onrender.com/assets/images/HiddenCard.png');

    this.load.atlas('flares', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/particles/flares.png', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/particles/flares.json');
  }
  // Código que se ejecuta al iniciar el juego por primera vez
  create(data){
    const gamescene = this;
    var key = data.key;
    var name = data.name || data.id.substring(0, 9).toUpperCase();
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
    var readyForm = this.add.dom(this.game.canvas.width*0.5, this.game.canvas.height*0.5).createFromCache('SG').setVisible(true).setOrigin(0.5,0.5);
    readyForm.addListener('click');
    readyForm.on('click', function(event){
      if(event.target.name === 'start'){
        readyForm.setVisible(false);
        waitPlayers.setVisible(true);
        socket.emit('ready', key, socket.id);
      }
    });
    var waitPlayers = this.add.dom(this.game.canvas.width*0.5, this.game.canvas.height*0.5).createFromCache('WO').setVisible(false).setOrigin(0.5,0.5);
    var getPrompt = this.add.dom(this.game.canvas.width*0.5, this.game.canvas.height*0.5).createFromCache('GP').setVisible(false).setOrigin(0.5,0.5);  
    getPrompt.addListener('click');
    getPrompt.on('click', function(event){
      if(event.target.name === 'sumbmitPrompt'){
        socket.emit('sendPrompt', key, this.getChildByName('prompt').value);
      }
    });

    var promptPresent = this.add.text(this.game.canvas.width*0.5, this.game.canvas.height*0.325, 'Select an image to go with:', { color: 'whitesmoke', align: 'center', fontSize: '30px', wordWrap: { width: this.game.canvas.width*0.5, useAdvancedWrap: true}}).setOrigin(0.5,0.5).setVisible(false);
    var prompt = this.add.text(this.game.canvas.width*0.5, this.game.canvas.height*0.4, '', { color: 'whitesmoke', align: 'center', fontFamily: 'Impact', fontSize: '40px', wordWrap: { width: this.game.canvas.width*0.45, useAdvancedWrap: true}}).setOrigin(0.5,0.5).setVisible(false);

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
      const {roomKey, playerId, numPlayers} = arg;
      gamescene.state.numPlayers = numPlayers;
      gamescene.allPlayers.getChildren().forEach(function (otherPlayer) {
        if(playerId === otherPlayer.playerId){
          location.reload();
        }
      });
    });

    socket.on('currentJudge', function(roominfo, judgeId){
      readyForm.setVisible(false);
      waitPlayers.setVisible(false);
      if(socket.id == judgeId){
        getPrompt.setVisible(true);
      } else {
        waitPlayers.setVisible(true);
      }
    });

    var ops = [];
    socket.on('getPrompt', function(judgeId, promptVal){  
      console.log('Current prompt: ' + promptVal);
      prompt.setText(promptVal);

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
        
        var alrd_dealed = [];        
        for (let currDealed = 0; currDealed < 5; currDealed++) {
          let curr_img = 'pic_no' + Math.floor(Math.random() * albums.get('Shitpost Status 01').length).toString();
          while(alrd_dealed.includes(curr_img) && alrd_dealed.length > 0){
            curr_img = 'pic_no' + Math.floor(Math.random() * albums.get('Shitpost Status 01').length).toString();
          }
          alrd_dealed[currDealed] = curr_img;
          if(ops[currDealed]) ops[currDealed].destroy();
          ops[currDealed] = gamescene.add.image(gamescene.game.canvas.width*0.165*(currDealed+1), gamescene.game.canvas.height*0.475, curr_img).setOrigin(0.5,0).setInteractive({cursor:'pointer'}).setScale(0.57);
          ops[currDealed].on('pointerover', function () {
            this.setTint(0xfff000);
          });
          ops[currDealed].on('pointerout', function () {
            this.clearTint();
          });
          ops[currDealed].on('pointerup', function(){
            socket.emit('selection', curr_img, socket.id, key)
          }); 
        }
      }
    });

    var selected = [];
    socket.on('updateSelected', function(roomInfo){
      Object.keys(roomInfo.currentSelected).forEach(function(curr_id){
        if(selected[curr_id]) { 
          selected[curr_id].destroy();
          delete selected[curr_id];
        };
        selected[curr_id] = gamescene.add.image(gamescene.game.canvas.width*(0.20*Object.keys(roomInfo.players).findIndex(x => x === curr_id)+0.1), gamescene.game.canvas.height*0.375, 'hidden').setScale(0.35); 
      });

      for (let currDealed = 0; currDealed < 5; currDealed++) {
        if(ops[currDealed]) ops[currDealed].destroy();
      }
      ops = [];
      prompt.setVisible(false);
      promptPresent.setVisible(false);
      
    });

    socket.on('allSelected', function(roomInfo){
      Object.keys(roomInfo.currentSelected).forEach(function(curr_id){
        if(selected[curr_id]) { 
          selected[curr_id].destroy();
          delete selected[curr_id];
        };
        selected[curr_id] = gamescene.add.image(gamescene.game.canvas.width*(0.20*Object.keys(roomInfo.players).findIndex(x => x === curr_id)+0.1), gamescene.game.canvas.height*0.375, 'hidden').setScale(0.35);
        if(Object.keys(roomInfo.players)[roomInfo.currentPlayer] == socket.id){
          selected[curr_id].setInteractive({cursor:'pointer'});
          selected[curr_id].on('pointerover', function () {
            this.setTint(0x6B9BCC);
          });
          selected[curr_id].on('pointerout', function () {
            this.clearTint();
          });
          selected[curr_id].on('pointerup', function(){
            socket.emit('reveal', curr_id, key);
          }); 
        }
      });

      for (let currDealed = 0; currDealed < 5; currDealed++) {
        if(ops[currDealed]) ops[currDealed].destroy();
      }
      ops = [];
      prompt.setVisible(false);
      promptPresent.setVisible(false);
      waitPlayers.setVisible(false);
      
    });

    var meme_out_bg = this.add.rectangle(gamescene.game.canvas.width*0.5, gamescene.game.canvas.height*0.5, 1070, 940, 0x000).setOrigin(0.5,0.5).setInteractive({cursor:'pointer'}).setVisible(false).on('pointerup', function(){
      meme_out_bg.setVisible(false);
      meme_image.setVisible(false);
      meme_txt.setVisible(false);
      vote_btn.setVisible(false);
      socket.emit("clickOut", key);
    });
    var meme_image = this.add.image(gamescene.game.canvas.width*0.5, gamescene.game.canvas.height*0.5, 'pic_no0').setOrigin(0.5,0.5).setVisible(false).setScale(2);

    var meme_txt = this.add.text(this.game.canvas.width*0.5, this.game.canvas.height*0.725, '', { color: 'whitesmoke', align: 'center', fontFamily: 'Impact', fontSize: '50px', wordWrap: { width: this.game.canvas.width*0.45, useAdvancedWrap: true}}).setOrigin(0.5,0.5).setVisible(false);
    meme_txt.setStroke('black', 4);
    
    var vote_btn = this.add.image(gamescene.game.canvas.width*0.5, gamescene.game.canvas.height*0.9, 'vote').setOrigin(0.5,0.5).setInteractive({cursor:'pointer'}).setVisible(false).setScale(0.4);
    vote_btn.id = '';
    vote_btn.on('pointerover', function () {
      vote_btn.setTint(0x663399);
    });
    vote_btn.on('pointerout', function () {
      vote_btn.clearTint();
    });
    vote_btn.on('pointerup', function(){
      meme_out_bg.setVisible(false);
      meme_image.setVisible(false);
      meme_txt.setVisible(false);
      vote_btn.setVisible(false);
      socket.emit("hasVoted", key, vote_btn.id);
    }); 

    var shown = [];
    socket.on('revealed', function(roomInfo, curr_id){
      shown[curr_id] = gamescene.add.image(gamescene.game.canvas.width*(0.20*Object.keys(roomInfo.players).findIndex(x => x === curr_id)+0.1), gamescene.game.canvas.height*0.375, roomInfo.currentSelected[curr_id]).setInteractive({cursor:'pointer'}).setScale(0.585);/*.setOrigin(0.5,0.5)*/
      if(Object.keys(roomInfo.players)[roomInfo.currentPlayer] == socket.id){
        shown[curr_id].on('pointerover', function () {
          this.setTint(0x6B9BCC);
        });
        shown[curr_id].on('pointerout', function () {
          this.clearTint();
        });
        shown[curr_id].on('pointerup', function(){
          meme_out_bg.setVisible(true);
          meme_out_bg.alpha = 0.8;
          gamescene.children.bringToTop(meme_out_bg);
          meme_image.setTexture(roomInfo.currentSelected[curr_id]);
          meme_image.setVisible(true);
          gamescene.children.bringToTop(meme_image);
          meme_txt.setText(prompt.text.valueOf());
          meme_txt.setVisible(true);
          gamescene.children.bringToTop(meme_txt);
          vote_btn.setVisible(true);
          gamescene.children.bringToTop(vote_btn);
          vote_btn.id = curr_id;
          socket.emit('clickMeme', roomInfo.currentSelected[curr_id], prompt.text.valueOf(), key);
        }); 
      }
      selected[curr_id].setVisible(false);
      selected[curr_id].destroy();
      delete selected[curr_id];
    });

    socket.on('showMeme', function(image,text){
      meme_out_bg.setVisible(true);
      gamescene.children.bringToTop(meme_out_bg);
      meme_out_bg.alpha = 0.8;
      meme_image.setTexture(image);
      meme_image.setVisible(true);
      gamescene.children.bringToTop(meme_image);
      meme_txt.setText(text);
      meme_txt.setVisible(true);
      gamescene.children.bringToTop(meme_txt);
    });

    socket.on('byeMeme', function(){
      meme_out_bg.setVisible(false);
      meme_image.setVisible(false);
      meme_txt.setVisible(false);
    });

    socket.on('nextTurn', function(roomInfo){
      meme_out_bg.setVisible(false);
      meme_image.setVisible(false);
      meme_txt.setVisible(false);
      vote_btn.setVisible(false);

      Object.keys(selected).forEach(function(idx){
        selected[idx].setVisible(false);
        selected[idx].destroy();
        delete selected[idx];
      });
      Object.keys(shown).forEach(function(idx){
        shown[idx].setVisible(false);
        shown[idx].destroy();
        delete shown[idx];
      });
      shown = [];
      selected = [];

      let update_idx_text = 0;
      Object.keys(roomInfo.players).forEach(function(update_id){
        gamescene.allPlayers.getChildren()[update_idx_text].setText(roomInfo.players[update_id].username + '\u000a' + roomInfo.players[update_id].score);
        update_idx_text += 1;
      });

      socket.emit('ready', key, socket.id);
    });

    const winner = this.add.text(this.game.canvas.width*0.5, this.game.canvas.height*0.4, '', { color: 'whitesmoke', align: 'center', fontFamily: 'Impact', fontSize: '50px', wordWrap: { width: this.game.canvas.width*0.45, useAdvancedWrap: true}}).setOrigin(0.5,0.5).setVisible(false).setStroke('black', 4);

    const playAgain = this.add.dom(this.game.canvas.width*0.5, this.game.canvas.height*0.6).createFromCache('PA').setVisible(false).setOrigin(0.5,0.5).addListener('click').on('click', function(event){
      if(event.target.name === 'playAgain'){
        waitPlayers.setVisible(true);
        winner.setVisible(false);
        playAgain.setVisible(false);
        socket.emit('ready', key, socket.id);
      }
    });

    socket.on('endGame', function(roomInfo, winner_name){
      meme_out_bg.setVisible(false);
      meme_image.setVisible(false);
      meme_txt.setVisible(false);
      vote_btn.setVisible(false);

      Object.keys(selected).forEach(function(idx){
        selected[idx].setVisible(false);
        selected[idx].destroy();
        delete selected[idx];
      });
      Object.keys(shown).forEach(function(idx){
        shown[idx].setVisible(false);
        shown[idx].destroy();
        delete shown[idx];
      });
      shown = [];
      selected = [];

      let update_idx_text = 0;
      Object.keys(roomInfo.players).forEach(function(update_id){
        gamescene.allPlayers.getChildren()[update_idx_text].setText(roomInfo.players[update_id].username + '\u000a' + roomInfo.players[update_id].score);
        update_idx_text += 1;
      });
      
      winner.setText('WINNER:\u000a' + winner_name);
      winner.setVisible(true);
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
      const player = this.add.text(this.game.canvas.width*(0.20*this.allPlayers.getLength()+0.1), this.game.canvas.height*(0.15), playerInfo.username + '\u000a' + playerInfo.score, { font: "24px Arial Black", fill: "black", align: "center" }).setOrigin(0.5,0.5);
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
      const otherP = this.add.text(this.game.canvas.width*(0.20*this.allPlayers.getLength()+0.1), this.game.canvas.height*(0.15), playerInfo.username + '\u000a' + playerInfo.score,  { font: "24px Arial Black", fill: "#fff", align: "center" }).setOrigin(0.5,0.5);
      otherP.setShadow(4, 4, '#333333', 4, true, true); // shadow
      otherP.playerId = playerInfo.playerId;
      this.allPlayers.add(otherP);
    }
  }
}
