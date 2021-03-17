var PLAY = 1;
var END = 0;
var gameState = PLAY;

var hobbit, hobbit_running, hobbit_collided;
var goblin, gobling_running, goblin_jumping
var ground, invisibleGround, groundImage;


var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

var bg = "background.png"
var backgroundImg

localStorage["HighestScore"] = 0;

function preload(){

  hobbit_running =   loadAnimation("0_Warrior_Run_000.png","0_Warrior_Run_002.png","0_Warrior_Run_003.png","0_Warrior_Run_004.png","0_Warrior_Run_005.png","0_Warrior_Run_006.png","0_Warrior_Run_007.png","0_Warrior_Run_008.png","0_Warrior_Run_009.png","0_Warrior_Run_010.png","0_Warrior_Run_011.png","0_Warrior_Run_012.png","0_Warrior_Run_013.png","0_Warrior_Run_014.png");
  hobbit_collided = loadAnimation("hobbit_caught.png");

  gobling_running = loadAnimation("0_Goblin_Running_000.png", "0_Goblin_Running_001.png","0_Goblin_Running_002.png","0_Goblin_Running_003.png","0_Goblin_Running_004.png","0_Goblin_Running_005.png","0_Goblin_Running_006.png","0_Goblin_Running_007.png","0_Goblin_Running_008.png","0_Goblin_Running_009.png","0_Goblin_Running_010.png","0_Goblin_Running_011.png")
  goblin_jumping = loadAnimation("0_Goblin_Jump Start_000.png","0_Goblin_Jump Start_001.png","0_Goblin_Jump Start_002.png","0_Goblin_Jump Start_004.png","0_Goblin_Jump Start_005.png")

  groundImage = loadImage("ground.png");
  
  obstacle1 = loadImage("rock.png");
  obstacle2 = loadImage("rock2.png");
  obstacle3 = loadImage("rock3.png");
  obstacle4 = loadImage("rock4.png");
  obstacle5 = loadImage("rock5.png");
  obstacle6 = loadImage("rock6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  backgroundImg = loadImage(bg);
}

function setup() {
  createCanvas(600,200);
  
  hobbit = createSprite(70,180,50,70);
  
  goblin = createSprite(40,180,50,70)

  hobbit.addAnimation("running", hobbit_running);
  hobbit.addAnimation("collided", hobbit_collided);
  hobbit.scale = 0.5;
  
  goblin.addAnimation("running", gobling_running)
  goblin.addAnimation("jumping",goblin_jumping)
  goblin.scale = 0.5

  goblin.setCollider("rectangle",0,0,200,goblin.height);

  ground = createSprite(200,225,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /20;
  ground.velocityX = -(6 + 3*score/100);
  ground.scale = 2.5
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;

  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
//hobbit.debug = true;
  background(backgroundImg);
  text("Score: "+ score, 500,50);
  


  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  

    if(goblin.isTouching(obstaclesGroup)){
      goblin.velocityY = -12
    }
   

    if(keyDown("space") && hobbit.y >= 159) {
      hobbit.velocityY = -12;
    }

    
  
    hobbit.velocityY = hobbit.velocityY + 0.8
    goblin.velocityY = goblin.velocityY + 0.8
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    hobbit.collide(invisibleGround);
    goblin.collide(invisibleGround)
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(hobbit)){
        gameState = END;
        
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    goblin.visible = false;
    //set vel0city of each game object to 0
    ground.velocityX = 0;
    hobbit.velocityY = 0;
    goblin.velocityY = 0;



    obstaclesGroup.setVelocityXEach(0);

    
    //change the hobbit animation
    hobbit.changeAnimation("collided",hobbit_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);

    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}



function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,180,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  
  
  hobbit.changeAnimation("running",hobbit_running);
  goblin.changeAnimation("running",gobling_running)
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}

