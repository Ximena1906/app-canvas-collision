// Obtiene el elemento canvas del DOM
const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Sonido de colisión
const collisionSound = new Audio("sonido/bts_like_notification.mp3");
collisionSound.volume = 1.0;

document.addEventListener("click", () => {
    collisionSound.play().catch(error => console.error("Error al reproducir sonido:", error));
}, { once: true });

// Dimensiones del canvas
canvas.width = 550;
canvas.height = 550;

// Variable para almacenar el color de fondo
let backgroundColor = getRandomColor();

// Función para generar un color aleatorio
function getRandomColor() {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
}

// Clase Circle
class Circle {
    constructor(x, y, radius, speed) {
        this.radius = radius;
        this.posX = x;
        this.posY = y;
        this.color = getRandomColor();
        this.speed = speed;
        this.dx = (Math.random() > 0.5 ? 1 : -1) * this.speed;
        this.dy = (Math.random() > 0.5 ? 1 : -1) * this.speed;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        context.fill();
        context.closePath();
    }

    update() {
        this.posX += this.dx;
        this.posY += this.dy;

        if (this.posX + this.radius > canvas.width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.posY + this.radius > canvas.height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }
    }
}

let NUM_CIRCLES = parseInt(prompt("¿Cuántos círculos quieres generar?"), 10);
if (isNaN(NUM_CIRCLES) || NUM_CIRCLES < 1) {
    NUM_CIRCLES = 5;
}

let circles = [];

function generateCircles() {
    for (let i = 0; i < NUM_CIRCLES; i++) {
        let radius = Math.floor(Math.random() * 30) + 20;
        let x, y;
        let validPosition = false;

        while (!validPosition) {
            x = Math.random() * (canvas.width - 2 * radius) + radius;
            y = Math.random() * (canvas.height - 2 * radius) + radius;
            validPosition = circles.every(circle => {
                let dx = circle.posX - x;
                let dy = circle.posY - y;
                return Math.sqrt(dx * dx + dy * dy) > circle.radius + radius;
            });
        }

        circles.push(new Circle(x, y, radius, Math.random() * 2 + 1));
    }
}

function playCollisionSound() {
    let sound = new Audio("sonido/bts_like_notification.mp3");
    sound.volume = 1.0;
    sound.play().catch(error => console.error("Error al reproducir sonido:", error));
}

function resolveCollision(circle1, circle2) {
    let dx = circle2.posX - circle1.posX;
    let dy = circle2.posY - circle1.posY;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < circle1.radius + circle2.radius) {
        let angle = Math.atan2(dy, dx);
        let speed1 = Math.sqrt(circle1.dx * circle1.dx + circle1.dy * circle1.dy);
        let speed2 = Math.sqrt(circle2.dx * circle2.dx + circle2.dy * circle2.dy);
        let dir1 = Math.atan2(circle1.dy, circle1.dx);
        let dir2 = Math.atan2(circle2.dy, circle2.dx);

        circle1.dx = speed2 * Math.cos(dir2);
        circle1.dy = speed2 * Math.sin(dir2);
        circle2.dx = speed1 * Math.cos(dir1);
        circle2.dy = speed1 * Math.sin(dir1);

        let overlap = (circle1.radius + circle2.radius - distance) / 2;
        circle1.posX -= Math.cos(angle) * overlap;
        circle1.posY -= Math.sin(angle) * overlap;
        circle2.posX += Math.cos(angle) * overlap;
        circle2.posY += Math.sin(angle) * overlap;

        circle1.color = getRandomColor();
        circle2.color = getRandomColor();
        backgroundColor = getRandomColor();

        playCollisionSound();
    }
}

let collisionCount = 0;
const counterDisplay = document.createElement("div");
counterDisplay.style.position = "absolute";
counterDisplay.style.top = "10px";
counterDisplay.style.left = "10px";
counterDisplay.style.fontSize = "20px";
counterDisplay.style.color = "black";
counterDisplay.style.background = "rgba(255, 255, 255, 0.7)";
counterDisplay.style.padding = "10px";
counterDisplay.style.borderRadius = "5px";
counterDisplay.innerText = "Colisiones: 0";
document.body.appendChild(counterDisplay);

function drawBackground() {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function updateCircles() {
    requestAnimationFrame(updateCircles);
    drawBackground();

    for (let i = 0; i < circles.length; i++) {
        circles[i].update();
        circles[i].draw(ctx);
    }

    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            if (detectCollision(circles[i], circles[j])) {
                resolveCollision(circles[i], circles[j]);
                collisionCount++;
                counterDisplay.innerText = "Colisiones: " + collisionCount;
            }
        }
    }
}

function detectCollision(circle1, circle2) {
    let dx = circle2.posX - circle1.posX;
    let dy = circle2.posY - circle1.posY;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance < circle1.radius + circle2.radius;
}

generateCircles();
updateCircles();