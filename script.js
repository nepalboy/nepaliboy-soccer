const container = document.getElementById('ball-container');
const ballCount = 15;
const balls = [];

class Ball {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'soccer-ball';
        container.appendChild(this.element);

        this.size = Math.random() * 40 + 40;
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;

        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 5;

        this.update();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        if (this.x < -this.size) this.x = window.innerWidth;
        if (this.x > window.innerWidth) this.x = -this.size;
        if (this.y < -this.size) this.y = window.innerHeight;
        if (this.y > window.innerHeight) this.y = -this.size;

        this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
    }
}

for (let i = 0; i < ballCount; i++) {
    balls.push(new Ball());
}

function animate() {
    balls.forEach(ball => ball.update());
    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    // Optional: Reset positions on resize
});
