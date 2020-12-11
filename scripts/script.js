/*-----------------------------------------------------------------------------------------*/
/*                                        VARIABLES                                        */
/*-----------------------------------------------------------------------------------------*/

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

/*-------------------------------- Media : Images-----------------------------------*/

const ground = new Image();
ground.src = "media/images/ground.png";
const foodImg = new Image();
foodImg.src = "media/images/food.png";

/*-------------------------------- Media : Audios-----------------------------------*/

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();
dead.src = "media/audios/dead.mp3";
eat.src = "media/audios/eat.mp3";
up.src = "media/audios/up.mp3";
right.src = "media/audios/right.mp3";
left.src = "media/audios/left.mp3";
down.src = "media/audios/down.mp3";

/*----------------------------------- OTHER --------------------------------------*/

const box=32;
let snake=[
    {x:7*box,y:8*box},
    {x:6*box,y:8*box},
    {x:5*box,y:8*box}
];
let food ={
    x:Math.floor(Math.random()*17+1)*box,
    y:Math.floor(Math.random()*15+3)*box
}
let score=0;
let lives=3;
let dir="r";
let canRestartGame=false;
let speed=400;


/*-----------------------------------------------------------------------------------------*/
/*                                        ONGOING GAME                                     */
/*-----------------------------------------------------------------------------------------*/


function playingMode(){    
    displayPlayground();
    displayLives();
    displayScore();
    getfood();
    getSnake();
    updateSnake();
}
let playGame = setInterval(playingMode,speed);


/*-----------------------------------------------------------------------------------------*/
/*                                     DIRECTOION HANDLER                                  */
/*-----------------------------------------------------------------------------------------*/


document.addEventListener("keydown",setDirection);

function setDirection(event){
    let key = event.keyCode;
    if(key==37 && dir!="r"){
        left.play();
        dir="l"
    }
    else if(key==38 && dir!="d"){
        up.play();
        dir="u"
    }
    else if(key==39 && dir!="l"){
        right.play();
        dir="r"
    }
    else if(key==40 && dir!="u"){
        down.play();
        dir="d"
    }
    else if(key==13 & canRestartGame){
        location.reload();
    }
    updateSnake();
}


/*-----------------------------------------------------------------------------------------*/
/*                                        MOVING SNAKE                                     */
/*-----------------------------------------------------------------------------------------*/


/*----------------------------- Updated on the basis of direction -------------------------*/

function updateSnake(){
    let currX=snake[0].x;
    let currY=snake[0].y;
    if(dir=="l"){
        currX-=box;
    }
    else if(dir=="r"){
        currX+=box;
    }
    else if(dir=="u"){
        currY-=box;
    }
    else if(dir=="d"){
        currY+=box;
    }
    if(detectCollision(currX,currY)){

    }else{
        snake.unshift({x:currX,y:currY});
        if(!eatenApple()){
            snake.pop();
        }
    }    
}

/*-------------------------------- To see if apple is eaten -----------------------------------*/

function eatenApple(){
    if(snake[0].x==food.x && snake[0].y==food.y){
        eat.play();
        score++;
        speed-=50;
        food ={
            x:Math.floor(Math.random()*17+1)*box,
            y:Math.floor(Math.random()*15+3)*box
        }
        return true;
    }
    return false;
}


/*-----------------------------------------------------------------------------------------*/
/*                                   COLLISION DETECTOR                                    */
/*-----------------------------------------------------------------------------------------*/


function detectCollision(currX,currY){
    if(selfCollision(currX,currY) || wallCollision(currX,currY)){
        dead.play();
        lives--;
        if(lives<=0){
            clearInterval(playGame);
            displayGameOver();
        }else{
            snake=[
                {x:7*box,y:8*box},
                {x:6*box,y:8*box},
                {x:5*box,y:8*box}
            ];
            dir="r";
            currX=snake[0].x;
            currY=snake[0].y;
        }
        return true;
    }
    return false;
}

/*-------------------------------- Collision with Self -----------------------------------*/

function selfCollision(currX,currY){
    for(let i=0;i<snake.length;i++){
        if(currX==snake[i].x && currY==snake[i].y){
            return true;
        }
    }
    return false;
}

/*-------------------------------- Collision with Wall -----------------------------------*/

function wallCollision(currX,currY){
    if(currX < box || currX > 17 * box || currY < 3*box || currY > 17*box){
        return true;
    }
    return false;
}


/*-----------------------------------------------------------------------------------------*/
/*                                      DISPLAY FUNTIONS                                   */
/*-----------------------------------------------------------------------------------------*/


/*---------------------------------- Message on game over -----------------------------------*/

function displayGameOver(){
    displayLives();
    context.fillStyle="red";
    context.fillRect(4.5*box,8*box,10*box,5*box);
    context.strokeStyle = "black";
    context.strokeRect(4.5*box,8*box,10*box,5*box);
    displayText("Game over!!",5.5*box,10*box,50);
    displayText("Score : "+score,6.5*box,12*box,50);
}

/*-------------------------------- Displaying playground ---------------------------------*/

function displayPlayground(){
    context.drawImage(ground,0,0);
}

/*----------------------------------- Displaying Food -----------------------------------*/

function getfood(){
    context.drawImage(foodImg,food.x,food.y);
}

/*----------------------------------- Displaying Snake ------------------------------------*/

function getSnake(){
    for(let i =0;i<snake.length;i++){
        context.fillStyle=(i==0)?"black":"white";
        context.fillRect(snake[i].x,snake[i].y,box,box);
        context.strokeStyle = "black";
        context.strokeRect(snake[i].x,snake[i].y,box,box);
    }
}

/*-------------------------------- Showing Lives status -----------------------------------*/

function displayLives(){
    for(let i=0;i<lives;i++){
        context.drawImage(foodImg,(17-i)*box,0.7*box);
    }
}

/*-------------------------------- Showing score status -----------------------------------*/

function displayScore(){
    displayText(score,2.4*box,1.6*box,40);
}

/*-------------------------------- Generic Texy display -----------------------------------*/

function displayText(text,x,y,size){
    context.fillStyle = "white";
    context.font = size+"px Changa one";
    context.fillText(text,x,y);
}
