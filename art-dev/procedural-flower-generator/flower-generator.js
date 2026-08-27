let flowers = [];
let generateMultipleMode = false;

// Flower configuration parameters
class FlowerConfig {
    constructor() {
        this.petalCount = Math.floor(random(4, 12));
        this.petalLength = random(30, 80);
        this.petalWidth = random(15, 40);
        this.centerSize = random(8, 20);
        this.rotation = random(0, TWO_PI);
        
        // Color palette - can be customized
        const palettes = [
            { primary: [255, 100, 150], secondary: [255, 200, 220], center: [255, 220, 100] },
            { primary: [150, 200, 255], secondary: [200, 230, 255], center: [255, 255, 150] },
            { primary: [200, 255, 150], secondary: [230, 255, 200], center: [255, 200, 100] },
            { primary: [255, 180, 100], secondary: [255, 220, 180], center: [255, 240, 200] },
            { primary: [200, 150, 255], secondary: [230, 200, 255], center: [255, 220, 150] },
            { primary: [255, 150, 200], secondary: [255, 200, 230], center: [255, 255, 180] },
        ];
        
        const palette = random(palettes);
        this.primaryColor = palette.primary;
        this.secondaryColor = palette.secondary;
        this.centerColor = palette.center;
        
        // Petal shape variation
        this.petalCurve = random(0.3, 0.8);
        this.petalPointiness = random(0.1, 0.5);
    }
}

class Flower {
    constructor(x, y, config) {
        this.x = x;
        this.y = y;
        this.config = config;
        this.scale = random(0.7, 1.3);
        this.rotationSpeed = random(-0.02, 0.02);
        this.currentRotation = config.rotation;
    }
    
    draw() {
        push();
        translate(this.x, this.y);
        rotate(this.currentRotation);
        scale(this.scale);
        
        // Draw petals
        for (let i = 0; i < this.config.petalCount; i++) {
            const angle = (TWO_PI / this.config.petalCount) * i;
            this.drawPetal(angle);
        }
        
        // Draw center
        this.drawCenter();
        
        pop();
        
        // Update rotation for animation
        this.currentRotation += this.rotationSpeed;
    }
    
    drawPetal(angle) {
        push();
        rotate(angle);
        
        // Create petal shape using bezier curves
        const len = this.config.petalLength;
        const width = this.config.petalWidth;
        const curve = this.config.petalCurve;
        const pointiness = this.config.petalPointiness;
        
        // Gradient effect - darker at base, lighter at tip
        const colorVariation = random(-30, 30);
        fill(
            constrain(this.config.primaryColor[0] + colorVariation, 0, 255),
            constrain(this.config.primaryColor[1] + colorVariation, 0, 255),
            constrain(this.config.primaryColor[2] + colorVariation, 0, 255),
            200
        );
        
        stroke(0, 0, 0, 30);
        strokeWeight(1);
        
        beginShape();
        vertex(0, 0);
        
        // Create petal shape with bezier curves
        const cp1x = width * curve;
        const cp1y = len * 0.3;
        const cp2x = width * (1 - pointiness);
        const cp2y = len * 0.7;
        const cp3x = width * pointiness;
        const cp3y = len;
        
        bezierVertex(cp1x, cp1y, cp2x, cp2y, cp3x, cp3y);
        bezierVertex(cp2x, cp2y, cp1x, cp1y, 0, 0);
        
        endShape(CLOSE);
        
        // Add inner petal detail
        fill(
            constrain(this.config.secondaryColor[0] + colorVariation, 0, 255),
            constrain(this.config.secondaryColor[1] + colorVariation, 0, 255),
            constrain(this.config.secondaryColor[2] + colorVariation, 0, 255),
            150
        );
        
        beginShape();
        vertex(0, 0);
        bezierVertex(cp1x * 0.6, cp1y * 0.8, cp2x * 0.7, cp2y * 0.8, cp3x * 0.5, cp3y * 0.7);
        bezierVertex(cp2x * 0.7, cp2y * 0.8, cp1x * 0.6, cp1y * 0.8, 0, 0);
        endShape(CLOSE);
        
        pop();
    }
    
    drawCenter() {
        // Draw center with multiple layers for depth
        const centerSize = this.config.centerSize;
        
        // Outer ring
        fill(
            this.config.centerColor[0],
            this.config.centerColor[1],
            this.config.centerColor[2],
            200
        );
        noStroke();
        ellipse(0, 0, centerSize * 1.2);
        
        // Middle ring
        fill(
            this.config.centerColor[0] + 20,
            this.config.centerColor[1] + 20,
            this.config.centerColor[2] + 20,
            180
        );
        ellipse(0, 0, centerSize * 0.8);
        
        // Inner dot
        fill(
            this.config.centerColor[0] - 30,
            this.config.centerColor[1] - 30,
            this.config.centerColor[2] - 30,
            255
        );
        ellipse(0, 0, centerSize * 0.4);
        
        // Add texture dots
        fill(255, 255, 255, 100);
        for (let i = 0; i < 5; i++) {
            const angle = random(0, TWO_PI);
            const radius = random(0, centerSize * 0.3);
            ellipse(cos(angle) * radius, sin(angle) * radius, random(1, 3));
        }
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(245, 247, 250);
    
    // Setup button handlers
    document.getElementById('generateBtn').addEventListener('click', () => {
        generateMultipleMode = false;
        generateFlowerAtCenter();
    });
    
    document.getElementById('generateMultipleBtn').addEventListener('click', () => {
        generateMultipleMode = !generateMultipleMode;
        const btn = document.getElementById('generateMultipleBtn');
        btn.textContent = generateMultipleMode ? 'Stop Multiple Mode' : 'Generate Multiple';
        btn.style.background = generateMultipleMode ? '#ff6b6b' : '#fff';
    });
    
    document.getElementById('clearBtn').addEventListener('click', () => {
        flowers = [];
        background(245, 247, 250);
    });
    
    // Generate initial flower
    generateFlowerAtCenter();
}

function draw() {
    // Clear and redraw background
    background(245, 247, 250);
    
    // Draw all flowers
    for (let flower of flowers) {
        flower.draw();
    }
    
    // Auto-generate flowers in multiple mode
    if (generateMultipleMode && frameCount % 60 === 0) {
        generateRandomFlower();
    }
}

function mousePressed() {
    if (mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height) {
        // Check if clicking on controls
        const container = document.querySelector('.container');
        const rect = container.getBoundingClientRect();
        if (mouseX < rect.right && mouseY < rect.bottom && mouseX > rect.left && mouseY > rect.top) {
            return;
        }
        
        generateFlowerAt(mouseX, mouseY);
    }
}

function generateFlowerAt(x, y) {
    const config = new FlowerConfig();
    const flower = new Flower(x, y, config);
    flowers.push(flower);
}

function generateFlowerAtCenter() {
    generateFlowerAt(width / 2, height / 2);
}

function generateRandomFlower() {
    const margin = 100;
    const x = random(margin, width - margin);
    const y = random(margin, height - margin);
    generateFlowerAt(x, y);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(245, 247, 250);
}
