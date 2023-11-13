const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope, rope2;
var fish;
var fish_con;
var fish_con_2;
var ground;
var bg_img;

var gatinho

var eat
var sad
var move

var button,button2,button3;
var mute_btn;

var star, star2
var stardisplay

var stars
var stardisplayV // V = Vazio
var stardisplayMV // MV = Meio Vazio
var stardisplayC // C = Completo

var fr;

var bg_song;
var cut_sound;
var sad_sound;
var eating_sound;
var air

function preload()
{
  bg_img = loadImage('background_img.png');
  fish = loadImage('fish.png');
  
  bg_song = loadSound('sound1.mp3');
  sad_sound = loadSound("sad.wav")
  cut_sound = loadSound('rope_cut.mp3');
  eating_sound = loadSound('eating_sound.mp3');
  air = loadSound('air.wav');

  eat = loadAnimation("gatinho_3.png","gatinho_4.png","gatinho_1.png");
  sad = loadAnimation("gatinho_5.png","gatinho_6.png");
  move = loadAnimation("gatinho_1.png","gatinho_2.png");

  stars = loadImage("star.png")
  stardisplayV = loadAnimation("empty.png")
  stardisplayMV = loadAnimation("one_star.png")
  stardisplayC = loadAnimation("stars.png")

  move.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false; 
}

function setup() 
{
  createCanvas(500,700);
  frameRate(80);

  bg_song.play();
  bg_song.setVolume(0.5);

  engine = Engine.create();
  world = engine.world;

  //botão 1
  button = createImg('cut_btn.png');
  button.position(100,90);
  button.size(50,50);
  button.mouseClicked(drop);

  //botão 2
  button2 = createImg('cut_btn.png');
  button2.position(450,90);
  button2.size(50,50);
  button2.mouseClicked(drop2);
 
  rope = new Rope(7,{x:120,y:90});
  rope2 = new Rope(7,{x:480,y:90});


  mute_btn = createImg('mute.png');
  mute_btn.position(width-50,20);
  mute_btn.size(50,50);
  mute_btn.mouseClicked(mute);
  
  ground = new Ground(250,height,width,20);
  eat.frameDelay = 20;

  gatinho = createSprite(200,620,100,100);
  gatinho.scale = 0.2;
  gatinho.addAnimation('moving', move);
  gatinho.addAnimation('eating',eat);
  gatinho.addAnimation('crying',sad);

  blower = createImg('baloon2.png');
  blower.position(270,350);
  blower.size(120,150);
  blower.mouseClicked(airbloow);

  star = createSprite(300,50,30,30);
  star.addImage(stars)
  star.scale = 0.02

  star2 = createSprite(50,320,30,30);
  star2.addImage(stars)
  star2.scale = 0.02

  display = createSprite(50,30,30,30);
  display.addAnimation("Vazio", stardisplayV);
  display.addAnimation("MeioVazio", stardisplayMV);
  display.addAnimation("Completo", stardisplayC);
  display.changeAnimation("Vazio");
  display.scale = 0.2

  fish = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fish);

  fish_con = new Link(rope,fish);
  fish_con_2 = new Link(rope2,fish);
 
  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  
}

function draw() 
{
  background(51);
  image(bg_img,0,0,width,height);

  push();
  imageMode(CENTER);
  if(fish!=null){
    image(fish.position.x,fish.position.y,70,70);
  }
  pop();

  ground.show();
  rope.show();
  rope2.show();

  Engine.update(engine);

  drawSprites();

  if(collide(fish,gatinho,80)==true)
  {
    World.remove(engine.world,fish);
    fish = null;
    gatinho.changeAnimation('eating');
    eating_sound.play();
  }

  if(fish!=null && fish.position.y>=650)
  {
   gatinho.changeAnimation('crying');
    bg_song.stop();
    sad_sound.play();
    fish=null;
   }

   if(collide(fish,star,20)==true)
   {
     display.changeAnimation('MeioVazio');
     star.visible = false
   }
  
   if(collide(fish,star2,40)==true && display.changeAnimation('Vazio'))
   {
     display.changeAnimation('MeioVazio');
     star2.visible = false
   }
   else{
    display.changeAnimation('Completo')
   }

  }

function drop()
{
  cut_sound.play();
  rope.break();
  fish_con.dettach();
  fish_con = null; 
}

function drop2()
{
  cut_sound.play();
  rope2.break();
  fish_con_2.dettach();
  fish_con_2 = null;
}

function collide(body,sprite,x)
{
  if(body!=null)
        {
         var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
          if(d<=x)
            {
               return true; 
            }
            else{
              return false;
            }
         }
}


function mute()
{
  if(bg_song.isPlaying())
     {
      bg_song.stop();
     }
     else{
      bg_song.play();
     }
}

function airbloow(){
  Matter.Body.applyForce(fish,{x:0, y:0}, {x:0, y:-0.03});
  air.play()
}