const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const collisionSound = new Audio("sonido/bts_like_notification.mp3");
collisionSound.volume = 1.0;

document.addEventListener("click", () => {
    collisionSound.play().catch(error => console.error("Error al reproducir sonido:", error));
}, { once: true });

canvas.width = 550;
canvas.height = 550;

let removedCircles = 0;
const TOTAL_CIRCLES = 10;
let level = 1;
let speedMultiplier = 1;

const backgroundImage = new Image();
backgroundImage.src = "imagen/fondo.jpg"; // Ruta de la imagen de fondo

const image = new Image();
image.src = "imagen/Medusa_stock_art_1.webp"; // Ruta de la imagen de los círculos

class Circle {
    constructor(x, y, radius, speed) {
        this.radius = radius;
        this.posX = x;
        this.posY = y;
        this.speed = speed * speedMultiplier;
        this.dy = -this.speed;
        this.removed = false;
    }

    draw(context) {
        if (image.complete) {
            context.drawImage(image, this.posX - this.radius, this.posY - this.radius, this.radius * 2, this.radius * 2);
        }
    }

    update() {
        if (!this.removed) {
            this.posY += this.dy;
            if (this.posY + this.radius < 0) {
                this.posY = canvas.height + this.radius;
                this.posX = Math.random() * (canvas.width - 2 * this.radius) + this.radius;
            }
        }
    }
}

let circles = [];

generateCircles();

canvas.addEventListener("click", (event) => {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;
    circles.forEach(circle => {
        const distance = Math.sqrt((mouseX - circle.posX) ** 2 + (mouseY - circle.posY) ** 2);
        if (distance < circle.radius && !circle.removed) {
            removedCircles++;
            circle.removed = true;
        }
    });

    if (removedCircles === TOTAL_CIRCLES) {
        level++;
        speedMultiplier += 0.5;
        removedCircles = 0;
        generateCircles();
    }
});

function generateCircles() {
    circles = [];
    for (let i = 0; i < TOTAL_CIRCLES; i++) {
        let radius = Math.floor(Math.random() * 30) + 20;
        let x = Math.random() * (canvas.width - 2 * radius) + radius;
        let y = canvas.height + radius;
        circles.push(new Circle(x, y, radius, Math.random() * 2 + 1));
    }
}

function updateStats() {
    document.getElementById("level").textContent = level;
    document.getElementById("removed").textContent = removedCircles;
    let percentage = ((removedCircles / TOTAL_CIRCLES) * 100).toFixed(2);
    document.getElementById("percentage").textContent = percentage + "%";
}

function updateCircles() {
    requestAnimationFrame(updateCircles);

    if (backgroundImage.complete) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    circles.forEach(circle => {
        if (!circle.removed) {
            circle.update();
            circle.draw(ctx);
        }
    });

    updateStats(); // 📊 Actualiza los datos en pantalla
}

updateCircles();
