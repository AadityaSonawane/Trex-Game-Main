var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloud_image, clouds_group, score;

var PLAY = 1;
var END = 0;
var game_state = PLAY;

function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadImage("trex_collided.png");
  cloud_image = loadImage("cloud.png");
  game_over_img = loadImage("gameOver.png");
  restart_img = loadImage("restart.png");
  fontRegular = loadFont("game_over.ttf");

  die = loadSound("die.mp3");
  checkPoint = loadSound("checkpoint.mp3");
  jump = loadSound("jump.mp3");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  groundImage = loadImage("ground2.png");
}

function setup() {

  createCanvas(600,200)
  
  var message = "This is a message";

  //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addImage("trex has collided", trex_collided);
  trex.debug = false;
  trex.scale = 0.5;
  
  trex.setCollider("circle", 0,0,50);
  
  trex.debug=false; 

  console.log("Hello" + 3);
  //create a ground sprite
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;

    game_over = createSprite(300,100);
    game_over.addImage(game_over_img);
    game_over.visible = false;

    restart = createSprite(300, 140);
    restart.addImage(restart_img);
    restart.scale = 0.5;
    restart.visible = false;
  
  //creating invisible ground
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;

  obstacles_group = new Group();
  clouds_group = new Group();

  score = 0;
 
}

function draw() {
  //set background color
  background(180);
  
  
  
  if(game_state == PLAY){
    // jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 160) {
      trex.velocityY = -11;
      jump.play();
    }
    text("Score: " + score,500, 50);
    trex.velocityY = trex.velocityY + 0.8
    score = score + Math.round(getFrameRate() / 60);
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    spawn_clouds(); 
    spawn_obstacles();

    if(obstacles_group.isTouching(trex)){
      game_state = END;
      die.play();
      // trex.velocityY = -10;
      // jump.play();
    }

    if(score % 100 == 0 && score > 0){
      checkPoint.play()
    }
  }
  else if(game_state == END){
    ground.velocityX = 0;
    trex.velocityY = 0;
    
    obstacles_group.setVelocityXEach(0);
    clouds_group.setVelocityXEach(0);

    obstacles_group.setLifetimeEach(-1);
    clouds_group.setLifetimeEach(-1);

    trex.changeImage("trex has collided", trex_collided);
    
    game_over.visible = true;
    restart.visible = true;
    textSize(70);
    textFont(fontRegular);
    textStyle(BOLD);
    text("Score: "+score, 250, 50)
    
  }
  //stop trex from falling down
  trex.collide(invisibleGround);
  if(mousePressedOver(restart)){
    console.log("Restart the game");
    reset();
  }
  drawSprites();
  
}

function spawn_clouds(){
  if(frameCount % 100 == 0){
    cloud = createSprite(600, 100, 40, 10);
    cloud.y = Math.round(random(50, 100));
    cloud.addImage(cloud_image);
    cloud.scale = 0.5;

    cloud.velocityX =-3;

    cloud.depth = 1;
    trex.depth = 2;
   
    cloud.lifetime = 200;

    clouds_group.add(cloud);
  }
  
  
}

function spawn_obstacles(){
  if(frameCount % 60 == 0){
    obstacle = createSprite(600, 165, 10, 40);

    obstacle.velocityX = -(6 + 2 * (score/100));
    obstacle.scale = 0.4;

    var rand = Math.round(random(1,6));
    switch(rand){
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

      default:break;
    }

    obstacle.lifetime = 300 ;

    obstacles_group.add(obstacle);

    obstacle.debug = true;


  }
}

function reset(){
  score = 0;
  game_state = PLAY;
  trex.changeAnimation("running",trex_running);
  obstacles_group.destroyEach();
  clouds_group.destroyEach();
  game_over.visible = false;
  restart.visible = false;
}