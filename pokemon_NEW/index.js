// Welcome to Code Seoul~
// Let's have fun building a game together!
// Gotta Catch 'Em All!

//http://tinyurl.com/bderppdx

let movement_speed = 5; 
let map_width = 90; // the tile width of the map
let blockSize = 60; // size of each block on the map
let collision_opacity = 0.0;

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const backgroundImage = document.createElement('img');
backgroundImage.src="./assets/images/map_elements/island_town_bg.png";

const bg = {
    image: backgroundImage,
    dx: -4022 + (canvas.width / 2),
    dy: -2550 + (canvas.height / 2)
};

const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

let lastKey = "";

const playerDownImage = document.createElement('img');
playerDownImage.src = "./assets/images/character/playerDown.png";
const playerUpImage = document.createElement('img');
playerUpImage.src = "./assets/images/character/playerUp.png";
const playerLeftImage = document.createElement('img');
playerLeftImage.src = "./assets/images/character/playerLeft.png";
const playerRightImage = document.createElement('img');
playerRightImage.src = "./assets/images/character/playerRight.png";

const player = {
    image: playerDownImage,
    width: 192 /4,
    height: 68,
    dx: (canvas.width / 2) - (48 / 2),
    dy: (canvas.height / 2) - (68 / 2),
    animate: false,
};

const playerFrames = {
    current: 0,
    max: 4,
    elapsed: 0,
    hold: 7
};

function handleInput() {
    if (keys.up && lastKey == "up") {
        player.animate = true;
        player.image = playerUpImage;
      if (!detectCollisions(0, movement_speed)) {
            bg.dy += movement_speed;
            boundaries.forEach(boundary => {
            boundary.y += movement_speed;
              });
        }
    } else if (keys.down && lastKey == "down"){
        player.animate = true;
        player.image = playerDownImage;
        if (!detectCollisions(0, -movement_speed)) {
                bg.dy -= movement_speed;
                boundaries.forEach(boundary => {
                     boundary.y -= movement_speed;
        });
      }
    } else if (keys.left && lastKey == "left") {
        player.animate = true;
        player.image = playerLeftImage;
        if (!detectCollisions(movement_speed, 0)) {
                bg.dx += movement_speed;
                boundaries.forEach(boundary => {
                     boundary.x += movement_speed;
        });
      }
    } else if (keys.right && lastKey == "right") {
        player.animate = true;
        player.image = playerRightImage;
        if (!detectCollisions(-movement_speed, 0)) {
             bg.dx -= movement_speed;
             boundaries.forEach(boundary => {
                  boundary.x -= movement_speed;
        });
      }
    } else {
        player.animate = false;
    }

    if (!player.animate) return;

    playerFrames.elapsed++;
    if (playerFrames.elapsed % playerFrames.hold == 0){
        if (playerFrames.current < playerFrames.max -1) {
             playerFrames.current++;
         } else {
        playerFrames.current = 0;
        }
    }
}

const collisionsMap = [];
for (let i = 0; i<collisions.length; i+= map_width) {
    collisionsMap.push(collisions.slice(i, map_width + i));
}

const boundaries = [];
collisionsMap.forEach((row, i) => {
    row.forEach((collisionValue, j) =>  {
        if (collisionValue === 1025) {
            boundaries.push({
                x: j * blockSize + bg.dx,
                y: i * blockSize + bg.dy
            })
        }
    });
});

function rectangularCollision({playerRect, collisionRect}) {
    return (
        playerRect.x + playerRect.width >= collisionRect.x &&
        playerRect.x <= collisionRect.x + collisionRect.width &&
        playerRect.y + playerRect.height >= collisionRect.y &&
        playerRect.y <= collisionRect.y + collisionRect.height
    )
}

function detectCollisions(futureX, futureY) {
    let collision = false;
    for (let boundary of boundaries) {
        collision = rectangularCollision ({
            playerRect: {
                x: player.dx,
                y: player.dy,
                width: player.width,
                height: player.height,
            },
            collisionRect: {
                x: boundary.x + futureX,
                y: boundary.y + futureY,
                width: blockSize,
                height: blockSize
            },
        });
        if (collision) {
            return true;
        }
    }
    return false;
}

function animate () {
    window.requestAnimationFrame(animate);
    // Draw the background image onto the canvas
    context.drawImage(
        bg.image,
        bg.dx,
        bg.dy
    );
    // Draw the player onto the canvas
    //image: CanvasImageSource, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
    context.drawImage(
        player.image,
        playerFrames.current * player.width,
        0,
        player.width,
        player.height,
        player.dx,
        player.dy,
        player.width,
        player.height
    );

    // draw the collision objects onto the canvas
    context.fillStyle = `rgba(255, 0, 0, ${collision_opacity})`;
    boundaries.forEach(boundary => {
        context.fillRect(
            boundary.x, 
            boundary.y, 
            blockSize, 
            blockSize,
        );
    })

    handleInput();
}

window.addEventListener('keydown', function(event) {
    if (event.key === "ArrowDown" || event.key === "s") {
        keys.down = true;
        lastKey = "down";
    }
    if (event.key === "ArrowUp" || event.key === "w") {
        keys.up = true;
        lastKey = "up";
    }
    if (event.key === "ArrowLeft" || event.key === "a") {
        keys.left = true;
        lastKey = "left";
    }
    if (event.key === "ArrowRight" || event.key === "d") {
        keys.right = true;
        lastKey = "right";
    }
});

window.addEventListener('keyup', function(event) {

if (event.key === "ArrowDown" || event.key === "s") {
        keys.down = false;
    }
    if (event.key === "ArrowUp" || event.key === "w") {
        keys.up = false;
    }
    if (event.key === "ArrowLeft" || event.key === "a") {
        keys.left = false;
    }
    if (event.key === "ArrowRight" || event.key === "d") {
        keys.right = false;
    }

});

animate();