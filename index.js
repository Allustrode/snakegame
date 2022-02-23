// Game constant and variables
let inputDir = { x: 0, y: 0 };
let lastPaintTime = 0;
let collide = false;
var myspeed;
let speed = 3;
let score = 0;
let snakeArr = [{ x: 13, y: 22 }];
let food = { x: 7, y: 10 };

const eat = new Audio("./sound/eat.wav");
const hit = new Audio("./sound/hit.wav");
const click = new Audio("./sound/click.wav");
const startclick = new Audio("./sound/startclick.wav");
const speedsound = new Audio("./sound/speedsound.wav");
const bgmusic = new Audio("./sound/bgmusic.mp3");
click.playbackRate = 3;
speedsound.playbackRate = .5;
startclick.playbackRate = 2;


// Game functions// 
function speedup() {
    if (speed < 10) {
        speed += 1;
        speedsound.play();
        if(speed == 10){
            document.getElementById("popup_box").innerText = "yeah! MAX LEVEL";
            document.getElementById("popup_box").style.opacity = "1";
        }
        else{    
            document.getElementById("popup_box").style.opacity = "1";
        }
        setTimeout(() => {
            document.getElementById("popup_box").style.opacity = "0";
        }, 1500);
    }
}

function main(cTime) {
    if (collide === false) {
        window.requestAnimationFrame(main);
        if ((cTime - lastPaintTime) / 1000 < 1 / speed) {
            return;
        }
        lastPaintTime = cTime;
        gameEngine();
    }
};

function isCollide(snake) {
    //if snake is eat own body
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    //if snake hit the wall
    if (snake[0].x > 30 || snake[0].x <= 0 || snake[0].y > 30 || snake[0].y <= 0) {
        return true;
    }
}

function gameEngine() {

    //if the snake eaten the food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        let a = 1;
        let b = 30;
        eat.play();
        for (let i = 0; i < snakeArr.length; i++) {
            let foodx = Math.round(a + (b - a) * Math.random());
            let foody = Math.round(a + (b - a) * Math.random());
            if (foodx === snakeArr[i].x && foody === snakeArr[i].y) {
                i = 0;
                continue;
            }
            else {
                food = { x: foodx, y: foody };
            }
        }
        score += 1;
        scorebox.innerHTML = "score = " + score;

        //add a body part of snake
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
    }


    //update the snake array
    //moving the sanake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    if (isCollide(snakeArr)) {
        collide = true;
        hit.play();
        bgmusic.pause();
        clearInterval(myspeed);
        inputDir = { x: 0, y: 0 };
        document.getElementById('start_btn').innerHTML = 'Start again';
        document.getElementById('start_btn').style.backgroundColor = 'rgb(153,0,0)';
        document.getElementById('start_btn').style.opacity = '1';
        setTimeout(() => {
            document.getElementById("start_btn").style.display = "";
        }, 400);
        speed = 3;
        snakeArr = [{ x: 13, y: 22 }];
        return;
    }

    //display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('head');
        }
        if (inputDir.x === 0 && inputDir.y === 1 && index === 0) {
            snakeElement.classList.add('down');
        }
        if (inputDir.x === 1 && inputDir.y === 0 && index === 0) {
            snakeElement.classList.add('right');
        }
        if (inputDir.x === -1 && inputDir.y === 0 && index === 0) {
            snakeElement.classList.add('left');
        }
        else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    //display the food
    foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);

    if (score > hiscoreval) {
        hiscoreval = score;
        localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
        hiscorebox.innerHTML = "Hi score = " + hiscoreval;
    }
}

//main logic is here
//to update the screen for animation
// window.requestAnimationFrame(main);

function start() {
    collide = false;

    startclick.play();

    score = 0;
    scorebox.innerHTML = "score = " + score;

    myspeed = setInterval(speedup, 20000);

    document.getElementById('start_btn').style.opacity = '0';
    setTimeout(() => {
        document.getElementById("start_btn").style.display = "none";
    }, 400);
    window.requestAnimationFrame(main);

    inputDir = { x: 0, y: -1 };

    window.addEventListener('keydown', e => {
        //start the game
        if (e.key === 'ArrowUp') {
            if (inputDir.y === 1) {
                return;
            }
            inputDir.x = 0;
            inputDir.y = -1;
            click.play();
        }
        if (e.key === 'ArrowRight') {
            if (inputDir.x === -1) {
                return;
            }
            inputDir.x = 1;
            inputDir.y = 0;
            click.play();
        }
        if (e.key === 'ArrowDown') {
            if (inputDir.y === -1) {
                return;
            }
            inputDir.x = 0;
            inputDir.y = 1;
            click.play();
        }
        if (e.key === 'ArrowLeft') {
            if (inputDir.x === 1) {
                return;
            }
            inputDir.x = -1;
            inputDir.y = 0;
            click.play();
        }
    });
}


let hiscore = localStorage.getItem('hiscore');
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
}
else {
    hiscoreval = JSON.parse(hiscore);
    hiscorebox.innerHTML = "Hi score = " + hiscore;
}

function fun(x) {
    if (x === 'u') {
        if (inputDir.y === 1) {
            return;
        }
        inputDir.x = 0;
        inputDir.y = -1;
        click.play();
    }
    else if (x === 'r') {
        if (inputDir.x === -1) {
            return;
        }
        inputDir.x = 1;
        inputDir.y = 0;
        click.play();
    }
    else if (x === 'd') {
        if (inputDir.y === -1) {
            return;
        }
        inputDir.x = 0;
        inputDir.y = 1;
        click.play();
    }
    else if (x === 'l') {
        if (inputDir.x === 1) {
            return;
        }
        inputDir.x = -1;
        inputDir.y = 0;
        click.play();
    }
}
