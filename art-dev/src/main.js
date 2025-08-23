import * as THREE from 'three';
import { FlowerGenerator } from './FlowerGenerator.js';
import { MoodSystem } from './MoodSystem.js';

class ArtDevelopmentApp {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.flowerGenerator = null;
        this.moodSystem = null;
        this.currentFlower = null;
        this.animationId = null;
        this.clock = new THREE.Clock();
        
        this.init();
        this.setupControls();
        this.animate();
    }
    
    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 5);
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        this.scene.add(directionalLight);
        
        // Initialize systems
        this.flowerGenerator = new FlowerGenerator();
        this.moodSystem = new MoodSystem();
        
        // Generate initial flower
        this.generateFlower();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    generateFlower() {
        // Remove existing flower
        if (this.currentFlower) {
            this.scene.remove(this.currentFlower);
        }
        
        const moodLevel = parseInt(document.getElementById('mood-slider').value);
        const flowerType = document.getElementById('flower-type').value;
        
        this.currentFlower = this.flowerGenerator.generateFlower(moodLevel, flowerType);
        this.scene.add(this.currentFlower);
        
        console.log(`Generated ${flowerType} flower with mood level ${moodLevel}`);
    }
    
    setupControls() {
        // Mood slider
        const moodSlider = document.getElementById('mood-slider');
        const moodValue = document.getElementById('mood-value');
        
        moodSlider.addEventListener('input', (e) => {
            moodValue.textContent = e.target.value;
            this.generateFlower();
        });
        
        // Flower type selector
        const flowerType = document.getElementById('flower-type');
        flowerType.addEventListener('change', () => {
            this.generateFlower();
        });
        
        // Speed slider
        const speedSlider = document.getElementById('speed-slider');
        const speedValue = document.getElementById('speed-value');
        
        speedSlider.addEventListener('input', (e) => {
            speedValue.textContent = parseFloat(e.target.value).toFixed(1);
        });
        
        // Regenerate button
        const regenerateBtn = document.getElementById('regenerate-btn');
        regenerateBtn.addEventListener('click', () => {
            this.generateFlower();
        });
        
        // Export button
        const exportBtn = document.getElementById('export-btn');
        exportBtn.addEventListener('click', () => {
            this.exportArt();
        });
    }
    
    exportArt() {
        // Create a temporary canvas for high-quality export
        const canvas = this.renderer.domElement;
        const link = document.createElement('a');
        link.download = `flower-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        console.log('Art exported successfully!');
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        const speed = parseFloat(document.getElementById('speed-slider').value);
        
        // Animate flower
        if (this.currentFlower) {
            this.currentFlower.rotation.y += 0.01 * speed;
            this.currentFlower.rotation.x += 0.005 * speed;
        }
        
        // Update FPS counter
        const fps = Math.round(1 / delta);
        document.getElementById('fps').textContent = fps;
        
        this.renderer.render(this.scene, this.camera);
    }
    
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.artApp = new ArtDevelopmentApp();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.artApp) {
        window.artApp.dispose();
    }
});
