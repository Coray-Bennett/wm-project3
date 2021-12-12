const WAIT = 0;
const RIGHT = 1;
const WRONG = 2;


var gameArea1 = { //creates the canvas and update timer
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 500;
        this.canvas.height = 400;
        this.key = false;
        this.context = this.canvas.getContext("2d");
        this.div = document.getElementById("game");
        this.div.appendChild(this.canvas);
        this.interval = setInterval(updateGameArea1, 20);
        window.addEventListener('keydown', function(e) {
            gameArea1.key = e.code;
        })
        window.addEventListener('keyup', function (e) {
            gameArea1.key = false;
          })
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    end: function() {
        clearInterval(this.interval);
    }
}


function component(x, y, key, keyCode) { // a key input displayed on screen
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = this.width;
    this.key = key;
    this.keyCode = keyCode;
    this.correct = WAIT;
    this.update = function() {
        ctx = gameArea1.context;
        ctx.fillStyle = "grey";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.font = '60px sans-serif';
        ctx.fillStyle = "black";
        ctx.fillText(this.key, this.x+20, this.y+66);
        if(this.correct == WAIT){
            ctx.strokeStyle = "yellow";
            ctx.rect(this.x-2, this.y-2, this.width+4, this.height+4)
            ctx.stroke();
        }
        if(this.correct == RIGHT){
            ctx.strokeStyle = "lightgreen";
            ctx.rect(this.x-2, this.y-2, this.width+4, this.height+4)
            ctx.stroke();
        }
        if(this.correct == WRONG){
            ctx.strokeStyle = "red";
            ctx.rect(this.x-2, this.y-2, this.width+4, this.height+4)
            ctx.stroke();
        }
    }
    this.wrong = function() {
        this.correct = WRONG;
    }
    this.right = function() {
        this.correct = RIGHT;
    }
}

var keys = [];
var noInput;
var gameOver;
var currentKey;

function startGame1() {
    gameArea1.end();
    try{
        clearTimeout(noInput); // when the game starts, it clears the timer that determines whether you inputted successfully
    }
    catch(e) {
        if(e instanceof TypeError) {}
            else {
                console.error(e);
            }
    }
    gameArea1.start();
    keys = [];
    gameOver = false;
    currentKey = 0;
    var keyset = { //all the keys used in the game, the key letter paired with it's code
        "W": "KeyW",
        "A": "KeyA",
        "S": "KeyS",
        "D": "KeyD",
        "E": "KeyE",
        "F": "KeyF",
        "1": "Digit1",
        "2": "Digit2",
        "3": "Digit3",
        "4": "Digit4"
    }
    keyArray = Object.keys(keyset);
    valueArray = Object.values(keyset);
    for(var i = 0; i < 6; i++) {
        index = Math.floor(keyArray.length * Math.random())
        if(i < 3) {
            x = i*150 + 40;
            y = 40;
        }
        else {
            x = (i-3)*150 + 40;
            y = 160;
        }
        keys.push(new component(x, y, keyArray[index], valueArray[index]))
    }
    noInput = setTimeout(setWrong, 2000);
}


var correctKey, keyPressed;
var waitForNext = true;

function updateGameArea1() { //this function is called in 20ms intervals when the game area is active
    gameArea1.clear();
    correctKey = keys[currentKey].keyCode;

    keyPressed = gameArea1.key;

    if(keyPressed == false){ // waitForNext allows me to check if each key is being pressed in the correct order
        waitForNext = true;
    }

    if(waitForNext && !(gameOver)) {
        if(keyPressed == correctKey){
            keys[currentKey].right();
            waitForNext = false;
            if(currentKey < 5) {currentKey += 1;}
        }
        else if(keyPressed != false){
            keys[currentKey].wrong();
            waitForNext = false;
            if(currentKey < 5) {currentKey += 1;}
        }
    }

    for(const e of keys) {
        e.update()
    }

    if(gameOver){
        var ctx = gameArea1.context;
        ctx.font = '40px sans-serif';
        if(keys[5].correct == RIGHT){
            ctx.fillText("SUCCESS", 150, 370);
        }
        else{
            ctx.fillText("FAILURE", 150, 370);
        }
        gameArea1.end();
    }
}

function setWrong() {
    for(const e of keys) {
        if (e.correct != RIGHT) {
            e.wrong()
        }
    }
    gameOver = true;
}

