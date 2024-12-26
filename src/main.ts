import './style.css';

class cords {
    xx: number;
    yy: number;
    
    constructor(xx: number, yy: number) {
        this.xx = xx;
        this.yy = yy;
    }

    xVal(): number {
        return this.xx;
    }

    yVal(): number {
        return this.yy;
    }

}

//init canvas
let canvas : any = document.getElementById('gameScreen');
let context : any = canvas.getContext('2d');

//20 x 20 grid, where each square is 32 pixels 
let gridConst: number = 32;

//draw first block AKA SNAKE CORDS
let blockCords: cords[] = [new cords(10, 10)];
drawBlock(blockCords[0]);

let allSpaces: cords[] = [];
for (let xx : number = 0; xx < 20; ++xx) {
    for (let yy : number = 0; yy < 20; ++yy) {
        allSpaces.push(new cords(xx, yy));
    }
}

/**
 * checks the current coordinates of the snake and returns
 * a array with all coordinates besides that.
 * 
 * @returns possible spaces for a apple to be in
 */
function possibleApple() : cords[] {
    let possibleSpaces : cords[] = allSpaces;
    for (let snakeBlock : number = 0; snakeBlock < blockCords.length; ++snakeBlock) {
        let snakeCords : cords = blockCords[snakeBlock];
        for (let possibleBlock : number = 0; possibleBlock < possibleSpaces.length; ++possibleBlock) {
            let posCords : cords = possibleSpaces[possibleBlock];
            if (snakeCords.xVal() == posCords.xVal()) {
                if (snakeCords.yVal() == posCords.yVal()) {
                    //if a match was found, remove it and move over to make sure all elements get hit
                    possibleSpaces.splice(possibleBlock, 1);
                    possibleBlock = possibleBlock - 1;
                } 
            }

        }
    }
    return possibleSpaces;
}


let currentApple : cords = new cords(-1, -1);
/**
 * draws the apple at coords the snake isnt at 
 * 
 * @param snake 
 */
function drawApple() {
    let posAppleCords : cords[] = possibleApple();
    let apple : cords = posAppleCords[Math.floor(Math.random() * posAppleCords.length)];
    currentApple = apple;
    context.fillStyle = "#ff0000";
    context.fillRect(apple.xVal() * gridConst, apple.yVal() * gridConst, gridConst, gridConst);
}

/**
 * draws a block of the snake.
 * 
 * @param xy cords of the block to draw
 */
function drawBlock(xy: cords): void {
    context.fillStyle = "#000000"
    context.fillRect(xy.xVal() * gridConst, xy.yVal() * gridConst, gridConst, gridConst);
}

/**
 * deletes the back most blockk of the snake 
 *
 * @param snake cords of snake
 */
function deleteBack(snake: cords[]): void {
    let lastBlock : cords = snake[0];
    snake.shift();
    context.fillStyle = "#646cff";
    context.fillRect(lastBlock.xVal() * gridConst, lastBlock.yVal() * gridConst, gridConst, gridConst);
}

/**
 * checks if head of snake cords equals apple cords
 * 
 * @return boolean
 */
function colletedApple() : boolean {
    let snakeHead : cords = blockCords[blockCords.length - 1];
    return snakeHead.xVal() == currentApple.xVal() && snakeHead.yVal() == currentApple.yVal();
}

//listen for key press and does certain things based on it
let direction : string = "right";
let change : boolean = false;

/**
 * does certain thing based on inputted key.
 * 
 * @param keyEvent the key that was clicked
 */
function keyPresses(keyEvent : KeyboardEvent) : void {
    let key : string = keyEvent["key"];
    console.log(key);

    let lastIndex: number = blockCords.length - 1;
    if (key == "ArrowUp") {
        if (direction != "up" && direction != "down") {
            direction = "up";
            change = true; 
            if (blockCords[lastIndex].yVal() != 0) {
                blockCords.push(new cords(blockCords[lastIndex].xVal(), blockCords[lastIndex].yVal() - 1));
                drawBlock(blockCords[blockCords.length - 1]);
                if (colletedApple()) { 
                    drawApple();
                    ++score;
                } else {
                    deleteBack(blockCords);
                }

            }
        }
    }

    if (key == "ArrowDown") {
        if (direction != "down" && direction != "up") {
            direction = "down";
            change = true;
            if (blockCords[lastIndex].yVal() != 19) {
                blockCords.push(new cords(blockCords[lastIndex].xVal(), blockCords[lastIndex].yVal() + 1));
                drawBlock(blockCords[blockCords.length - 1]);
                if (colletedApple()) { 
                    drawApple();
                    ++score;
                } else {
                    deleteBack(blockCords);
                }
            }
        }
    }

    if (key == "ArrowLeft") {
        if (direction != "left" && direction != "right") {
            direction = "left";
            change = true;
            if (blockCords[lastIndex].xVal() != 0) {
                blockCords.push(new cords(blockCords[lastIndex].xVal() - 1, blockCords[lastIndex].yVal()));
                drawBlock(blockCords[blockCords.length - 1]);
                if (colletedApple()) { 
                    drawApple();
                    ++score;
                } else {
                    deleteBack(blockCords);
                }
            }
        }
    }

    if (key == "ArrowRight") {
        if (direction != "right" && direction != "left") {
            direction = "right";
            change = true; 
            if (blockCords[lastIndex].xVal() != 19) {
                blockCords.push(new cords(blockCords[lastIndex].xVal() + 1, blockCords[lastIndex].yVal()));
                drawBlock(blockCords[blockCords.length - 1]);
                if (colletedApple()) { 
                    drawApple();
                } else {
                    deleteBack(blockCords);
                }
            }
        }
    }
}

document.addEventListener("keydown", keyPresses);

/**
 * checks to see if you hit a wall.
 * 
 * @return boolean if touching wall
 */
function hitWall() : boolean {
    let snakeHead : cords = blockCords[blockCords.length - 1];
    if (snakeHead.xVal() == -1 || snakeHead.xVal() == 20) {
        return true
    }
    if (snakeHead.yVal() == -1 || snakeHead.yVal() == 20) {
        return true
    }
    return false;
}

/**
 * checks to see if you hit yourself
 * 
 * @return boolan if touching self
 */
function hitSelf() : boolean {
    let snakeHead : cords = blockCords[blockCords.length - 1];
    for (let blockIndex : number = 0; blockIndex < blockCords.length - 1; ++blockIndex) {
        if (snakeHead.xVal() == blockCords[blockIndex].xVal()) {
            if (snakeHead.yVal() == blockCords[blockIndex].yVal()) {
                return true;
            }
        }
    }
    return false;
}

let score: number = 0;
/**
 * adds html to the code for a game over screen.
 * 
 * @returns html string
 */
function gameOverScreen() : string {
    return `
    <div id = "gameOver">
      <p id = "overText">Game Over</p>
      <p id = "text">Score: ${score}</p>
      <a id = "link" href = "./index.html">Play Again?</a>
    </div>
    `
}

//draw first apple
drawApple();


let main: any = setInterval(() => {
    let lastIndex: number = blockCords.length - 1;
    if (change == true) { ;
        change = false;
    } else {
        if (direction == "up") {
            blockCords.push(new cords(blockCords[lastIndex].xVal(), blockCords[lastIndex].yVal() - 1));
        }
        
        if (direction == "down") {
            blockCords.push(new cords(blockCords[lastIndex].xVal(), blockCords[lastIndex].yVal() + 1));
        }
        
        if (direction == "left") {
            blockCords.push(new cords(blockCords[lastIndex].xVal() - 1, blockCords[lastIndex].yVal()));
        }
        
        if (direction == "right") {
            blockCords.push(new cords(blockCords[lastIndex].xVal() + 1, blockCords[lastIndex].yVal()));
        }
        
        drawBlock(blockCords[blockCords.length - 1]);
        if (colletedApple()) {
            drawApple();
            ++score;
        } else {
            deleteBack(blockCords);
        }
    }

    if (hitWall() || hitSelf()) {
        clearInterval(main);
        let html : string = gameOverScreen();
        document.body.innerHTML += html;
    }

}, 200);