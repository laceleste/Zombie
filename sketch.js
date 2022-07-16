var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombieImg
var zombie
var dead
var heart1, heart2, heart3;
var bullets = 55;
var score = 0;
var life = 3;
var placar
var zombielife=120
var rectangle1
var rectangle

var gameState = "fight"

function preload(){

  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")


  shooterImg = loadAnimation("assets/shotgun/0.png","assets/shotgun/19.png")

  bgImg = loadImage("assets/bg2.jpg")
  bulletImg = loadImage("assets/bullet1.png")
  deadImg= loadAnimation("assets/bloodsplat.png")

  zombieImg = loadAnimation("assets/zombieWalk/0.png", "assets/zombieWalk/16.png")

  lose = loadSound("assets/lose.mp3")

  explosionSound = loadSound("assets/explosion.mp3")
  morteSound = loadSound("assets/morte.mp3")


}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

//criando o sprite do jogador
  player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
  player.addAnimation("player",shooterImg)
  player.scale = 0.5
  player.frameDelay = 2
  player.debug=true
  player.setCollider("rectangle",0,0,300,300)
 
//  criar grupo de zumbie e BALAS
  bulletGroup = new Group()
  zombieGroup = new Group();
  rectGroup = new Group()
  zombieImg.frameDelay =30
// limite para o player
  bottomGround = createSprite(200,height-10,800,20);
  bottomGround.visible = false;
  topGround = createSprite(200,200,800,20);
  topGround.visible = false;
        
//criando sprites para representar vidas restantes
  heart1 = createSprite(displayWidth-150,40,20,20)
  heart1.visible = false
  heart1.addImage("heart1",heart1Img)
  heart1.scale = 0.4

  heart2 = createSprite(displayWidth-100,40,20,20)
  heart2.visible = false
  heart2.addImage("heart2",heart2Img)
  heart2.scale = 0.4

  heart3 = createSprite(displayWidth-150,40,20,20)
  heart3.addImage("heart3",heart3Img)
  heart3.scale = 0.4

}

function draw() {
  background(0); 
  // image(bgImg,0,0,width,height);
  
    player.y=mouseY
    
  
if(gameState === "fight"){

    //exibindo a imagem apropriada de acordo com as vidas restantes
  if(life===3){
    heart1.visible = false
    heart2.visible = false
    heart3.visible = true
  }
  if(life===2){
    heart1.visible = false 
    heart2.visible = true
    heart3.visible = false
  }
  if(life===1){
    heart1.visible = true
    heart2.visible = false    
    heart3.visible = false
  }

//vá para gameState "lost" quando 0 vidas estiverem restantes
    if(life===0){
      gameState = "lost"
      heart1.visible = false
    }
//vá para gameState "won" se a pontuação for 100
    if(score==100){
      gameState = "won"
      winning.play();
    }
//solte balas e mude a imagem do atirador para a posição de tiro quando 
  if(mouseWentDown("leftButton")){ 
      atirar()
    }
//condicional para limitar o player 
  if(player.y<topGround.y){
    player.y=topGround.y+100
  }
  if(player.y>bottomGround.y){
    player.y=bottomGround.y-100
  }
//vá para gameState "bullet" quando o jogador ficar sem balas
  if(bullets<0){
    gameState = "bullet" 
  }
// destrua o zumbi quando a bala atingir
  zombieGroup.overlap(bulletGroup,(zombie,bullet)=>{
    morteSound.play();
    score = score+2  
    zombielife-=1

      bulletGroup.destroyEach()
      zombie.changeAnimation("dead")
      zombie.velocityX=0
      zombie.setCollider("rectangle",1300,1300,0,0)  
      setTimeout(()=>{
      zombie.destroy()
     }, 1000) 

  })

//destrua o zumbi quando o jogador tocar
  if(zombieGroup.isTouching(player)){

    for(var i=0; i<zombieGroup.length; i++){     
      if(zombieGroup[i].isTouching(player)){
           zombieGroup[i].destroy()
          // vidas
          life=life-1
      } 
    }
  }

  gerarZumbies()
}
  drawSprites();
  //exibindo a pontuação, vidas e balas restantes
  textSize(20)
  fill("white")
  textFont("Georgia")
  text("Vidas: " + life,displayWidth-200,displayHeight/2-280)
  text("Pontuação: " + score,displayWidth-200,displayHeight/2-250)
  text("Balas: " + bullets,displayWidth-200,displayHeight/2-220)

//destrua o zumbi e o jogador e exiba uma mensagem em gameState "lost"
  if(gameState == "lost"){
    textSize(100)
    stroke("yellow")
    fill("red")
    text("Você Perdeu!!",width/2-350,height/2)
    zombieGroup.destroyEach();
    player.destroy();

  }

  //destrua o zumbi e o jogador e exiba uma mensagem em gameState "won"
  else if(gameState == "won"){
    textSize(100)
    fill("blue")
    stroke("yellow")
    text("Você Venceu",width/2-350,height/2)
    zombieGroup.destroyEach();
    player.destroy();

  }

  //destrua o zumbi, o jogador e as balas e exiba uma mensagem no gameState "bullet"
  else if(gameState == "bullet"){
      textSize(100)
    fill("red")
    stroke("yellow")
    text("Você não tem mais balas!",width/2-500,height/2)
    zombieGroup.destroyEach();
    player.destroy();
    bulletGroup.destroyEach();

  }
}

function atirar(){
  bullet = createSprite(player.x+80,player.y+30,20,10)
  bullet.velocityX = 30
  bullet.addImage(bulletImg)
  bullet.scale =0.09
  bulletGroup.add(bullet)
  explosionSound.play();
  explosionSound.setVolume(0.1)
  player.depth = bullet.depth
  player.depth = player.depth+2
  bullets = bullets-1
}

function gerarZumbies(){
  if(frameCount%80===0){
    //dando posições x e y aleatórias para o zumbi aparecer
    zombie = createSprite(width,random(500,height),40,40)
  
    zombie.addAnimation("zumbie",zombieImg)
    zombie.addAnimation("dead",deadImg)
    zombie.frameDelay=2
    zombie.velocityX = -(6+2*score/100) 
    zombie.debug=true
    zombie.setCollider("rectangle",0,0,100,100)
    zombie.lifetime = 800
    zombieGroup.add(zombie)

    
  }
}

