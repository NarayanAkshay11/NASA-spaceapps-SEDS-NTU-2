// Function to get planet data (fake data for 3 planets)
const planetStarMaps = {
    planet1: [
        { x: 100, y: 150, radius: 3 },
        { x: 200, y: 300, radius: 4 },
        { x: 350, y: 400, radius: 5 },
    ],
    planet2: [
        { x: 50, y: 100, radius: 2 },
        { x: 250, y: 350, radius: 6 },
        { x: 400, y: 450, radius: 3 },
    ],
    planet3: [
        { x: 150, y: 200, radius: 4 },
        { x: 300, y: 350, radius: 5 },
        { x: 450, y: 50, radius: 6 },
    ]
};

// Function to clear the canvas
function clearCanvas(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// Function to draw stars on the canvas
function drawStars(planet, ctx) {
    clearCanvas(ctx);
    const starData = planetStarMaps[planet];
    starData.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
    });
}

// Initializing the star map canvas
const canvas = document.getElementById('starMapCanvas');
const ctx = canvas.getContext('2d');

// Event listeners for planet buttons
document.getElementById('planet1').addEventListener('click', () => {
    drawStars('planet1', ctx);
});

document.getElementById('planet2').addEventListener('click', () => {
    drawStars('planet2', ctx);
});

document.getElementById('planet3').addEventListener('click', () => {
    drawStars('planet3', ctx);
});
