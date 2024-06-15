const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 10;
const canvasSize = 350;
canvas.width = canvasSize;
canvas.height = canvasSize;

let snake = [{ x: 160, y: 160 }];
let direction = { x: gridSize, y: 0 };
let food = { x: 320, y: 320 };

function drawRect(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach(segment => drawRect(segment.x, segment.y, 'lime'));
}

function drawFood() {
    drawRect(food.x, food.y, 'red');
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Wrap around logic
    if (head.x < 0) {
        head.x = canvas.width - gridSize;
    } else if (head.x >= canvas.width) {
        head.x = 0;
    }
    if (head.y < 0) {
        head.y = canvas.height - gridSize;
    } else if (head.y >= canvas.height) {
        head.y = 0;
    }

    snake.unshift(head);

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        placeFood(); // Generate new food position
    } else {
        snake.pop(); // Remove the last segment of the snake
    }
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
    };
    // Check if new food position overlaps with the snake's body
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        placeFood(); // Recursively try again if it overlaps
    }
}

function checkCollision() {
    const head = snake[0];
    // Check collision with itself (excluding the head)
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

function gameLoop() {
    if (checkCollision()) {
        alert('Game Over');
        snake = [{ x: 160, y: 160 }];
        direction = { x: gridSize, y: 0 };
        placeFood();
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    drawSnake();
    drawFood();
}

function changeDirection(event) {
    const keyPressed = event.key;
    if (keyPressed === 'ArrowUp' && direction.y === 0) {
        direction = { x: 0, y: -gridSize };
    } else if (keyPressed === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: gridSize };
    } else if (keyPressed === 'ArrowLeft' && direction.x === 0) {
        direction = { x: -gridSize, y: 0 };
    } else if (keyPressed === 'ArrowRight' && direction.x === 0) {
        direction = { x: gridSize, y: 0 };
    }
}

function handleTouchStart(event) {
    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;
    const deltaX = touchX - snake[0].x;
    const deltaY = touchY - snake[0].y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0 && direction.x === 0) {
            direction = { x: gridSize, y: 0 }; // Right
        } else if (deltaX < 0 && direction.x === 0) {
            direction = { x: -gridSize, y: 0 }; // Left
        }
    } else {
        // Vertical swipe
        if (deltaY > 0 && direction.y === 0) {
            direction = { x: 0, y: gridSize }; // Down
        } else if (deltaY < 0 && direction.y === 0) {
            direction = { x: 0, y: -gridSize }; // Up
        }
    }
}

canvas.addEventListener('touchstart', handleTouchStart);
document.addEventListener('keydown', changeDirection);
setInterval(gameLoop, 50); // Adjust the interval for game speed
