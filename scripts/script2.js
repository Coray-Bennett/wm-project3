const START_GAME_SPEED = 1000;
const START_CIRCLE_SPEED = 0.5;


var gameSpeed = START_GAME_SPEED;
var circleSpeed = START_CIRCLE_SPEED;
var targets = [];
var deadTargets = [];
var gameOver2 = false;
var score = 0;
var nextScore = 10;

var gameArea2 = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 800;
        this.canvas.height = 800;
        this.x = -1;
        this.y = -1;
        this.context = this.canvas.getContext("2d");
        this.div = document.getElementById("aim");
        this.div.appendChild(this.canvas);
        this.interval = setInterval(updateGameArea2, 20);
        window.addEventListener('click', function(e) {
            gameArea2.x = event.offsetX;
            gameArea2.y = event.offsetY;
        })
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    end: function() {
        clearInterval(this.interval);
    }
}

function target(x, y) {
    this.x = x;
    this.y = y;
    this.exists = true;
    this.clicked = false;
    this.radius = 50;
    this.missCounted = false;
    this.update = function() {

        if(this.exists && distance(this.x, this.y, gameArea2.x, gameArea2.y) <= this.radius) {
            this.click();
            gameArea2.x, gameArea2.y = -800, -800;
        }

        if(this.radius <= 0 && this.exists){
            this.exists = false;
        }
        else {
            this.radius -= circleSpeed;
        }

        if(this.exists && this.radius > 0){
            ctx = gameArea2.context;
            ctx.strokeStyle = "red";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.stroke();
        }

    }
    this.click = function() {
        this.exists = false;
        this.clicked = true;
        score += 1;
    }
}


function randomTarget() {
    var rX = Math.floor((gameArea2.canvas.width-100) * Math.random()) + 50;
    var rY = Math.floor((gameArea2.canvas.height-100) * Math.random()) + 50;
    targets.push(new target(rX, rY));
}

var createTarget;
function startGame2(){
    gameArea2.end();
    gameSpeed = START_GAME_SPEED;
    circleSpeed = START_CIRCLE_SPEED;
    targets = [];
    deadTargets = [];
    gameOver2 = false;
    score = 0;
    nextScore = 10;
    gameArea2.start();
    targets.push(new target(400, 400));
    updateGameSpeed();
}

function updateGameSpeed() {
    clearInterval(createTarget);
    createTarget = setInterval(randomTarget, gameSpeed);
}

function updateGameArea2() {
    gameArea2.clear();

    var ctx = gameArea2.context;
    ctx.font = '25px sans-serif';
    ctx.fillText("Score: " + String(score), 20, 30, 300);
    ctx.fillText("Misses: " + String(deadTargets.length) + "/3", 20, 60, 300);

    if(score > nextScore) {
        gameSpeed *= 0.95;
        circleSpeed *= 1.1;
        nextScore += 10;
        updateGameSpeed();
    }

    for(const t of targets){
        try{
            t.update();
            if(!(t.exists) && !(t.clicked) && !(t.missCounted)) {
                deadTargets.push(t);
                t.missCounted = true;
            }
        }
        catch(e) {
            if(e instanceof TypeError){}
            else {
                console.error(e);
            }
        }
    }

    if(deadTargets.length >= 3) {
        gameIsOver();
    }
}

function gameIsOver() {
    gameArea2.clear();
    var ctx = gameArea2.context;
    ctx.font = '50px sans-serif';
    ctx.fillStyle = "red";
    ctx.fillText("GAME OVER", 250, 400, 400);
    ctx.font = '30px sans-serif';
    ctx.fillStyle = "black";
    ctx.fillText("Your Score: " + String(score), 300, 450, 400)
    clearInterval(createTarget);
    gameArea2.end();
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt( ((x2-x1)**2 + (y2-y1)**2) )
}
