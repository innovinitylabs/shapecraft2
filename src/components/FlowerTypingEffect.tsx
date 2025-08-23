'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FlowerTypingEffectProps {
  text: string;
  className?: string;
}

export default function FlowerTypingEffect({ text, className = "" }: FlowerTypingEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Settings
    const fontName = 'Arial, sans-serif';
    const fontSize = 60;
    const fontScaleFactor = 0.1;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create flower and leaf textures
    const flowerTexture = createFlowerTexture();
    const leafTexture = createLeafTexture();

    // Materials
    const flowerMaterial = new THREE.MeshBasicMaterial({
      alphaMap: new THREE.CanvasTexture(flowerTexture),
      transparent: true,
      opacity: 0.8
    });

    const leafMaterial = new THREE.MeshBasicMaterial({
      alphaMap: new THREE.CanvasTexture(leafTexture),
      transparent: true,
      opacity: 0.8
    });

    // Geometry
    const flowerGeometry = new THREE.PlaneGeometry(1, 1);
    const leafGeometry = new THREE.PlaneGeometry(0.8, 1.2);

    // Text rendering setup
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Animation variables
    let currentTextLength = 0;
    let particles: Array<{
      mesh: THREE.Mesh;
      targetX: number;
      targetY: number;
      currentX: number;
      currentY: number;
      scale: number;
      targetScale: number;
      type: 'flower' | 'leaf';
      color: THREE.Color;
    }> = [];

    // Create flower texture
    function createFlowerTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      
      ctx.clearRect(0, 0, 64, 64);
      
      // Draw flower with petals
      const centerX = 32;
      const centerY = 32;
      const petalCount = 6;
      const petalLength = 18;
      const petalWidth = 6;
      
      // Draw petals
      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        const petalX = centerX + Math.cos(angle) * 6;
        const petalY = centerY + Math.sin(angle) * 6;
        
        ctx.save();
        ctx.translate(petalX, petalY);
        ctx.rotate(angle);
        
        ctx.beginPath();
        ctx.ellipse(0, 0, petalWidth, petalLength, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        
        ctx.restore();
      }
      
      // Draw center
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      
      return canvas;
    }

    // Create leaf texture
    function createLeafTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      
      ctx.clearRect(0, 0, 64, 64);
      
      // Draw leaf shape
      const centerX = 32;
      const centerY = 32;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 15);
      ctx.quadraticCurveTo(centerX + 12, centerY - 8, centerX + 10, centerY);
      ctx.quadraticCurveTo(centerX + 12, centerY + 8, centerX, centerY + 15);
      ctx.quadraticCurveTo(centerX - 12, centerY + 8, centerX - 10, centerY);
      ctx.quadraticCurveTo(centerX - 12, centerY - 8, centerX, centerY - 15);
      ctx.closePath();
      
      ctx.fillStyle = 'white';
      ctx.fill();
      
      return canvas;
    }

    // Sample text coordinates
    function sampleTextCoordinates() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `bold ${fontSize}px ${fontName}`;
      ctx.fillStyle = '#2a9d8f';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const currentText = text.substring(0, currentTextLength);
      ctx.fillText(currentText, canvas.width / 2, canvas.height / 2);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const coordinates: Array<{x: number, y: number}> = [];

      for (let y = 0; y < canvas.height; y += 4) {
        for (let x = 0; x < canvas.width; x += 4) {
          const index = (y * canvas.width + x) * 4;
          if (imageData.data[index] > 0) {
            coordinates.push({
              x: (x - canvas.width / 2) * fontScaleFactor,
              y: (canvas.height / 2 - y) * fontScaleFactor
            });
          }
        }
      }

      return coordinates;
    }

    // Create particles
    function createParticles(coordinates: Array<{x: number, y: number}>) {
      // Remove old particles
      particles.forEach(p => scene.remove(p.mesh));
      particles = [];

      coordinates.forEach((coord, index) => {
        const isFlower = Math.random() > 0.3;
        const geometry = isFlower ? flowerGeometry : leafGeometry;
        const material = isFlower ? flowerMaterial.clone() : leafMaterial.clone();
        
        // Set color
        if (isFlower) {
          const hue = Math.random() * 60 + 200; // Blue to purple range
          material.color = new THREE.Color().setHSL(hue / 360, 0.8, 0.6);
        } else {
          const hue = Math.random() * 40 + 100; // Green range
          material.color = new THREE.Color().setHSL(hue / 360, 0.8, 0.4);
        }

        const mesh = new THREE.Mesh(geometry, material);
        
        // Random starting position
        const startX = (Math.random() - 0.5) * 20;
        const startY = (Math.random() - 0.5) * 20;
        
        mesh.position.set(startX, startY, 0);
        mesh.scale.setScalar(0);

        scene.add(mesh);

        particles.push({
          mesh,
          targetX: coord.x,
          targetY: coord.y,
          currentX: startX,
          currentY: startY,
          scale: 0,
          targetScale: 0.8 + Math.random() * 0.4,
          type: isFlower ? 'flower' : 'leaf',
          color: material.color
        });
      });
    }

    // Animation loop
    function animate() {
      // Update typing animation
      if (currentTextLength < text.length) {
        currentTextLength++;
        const coordinates = sampleTextCoordinates();
        createParticles(coordinates);
      }

      // Animate particles
      particles.forEach(particle => {
        // Move towards target
        particle.currentX += (particle.targetX - particle.currentX) * 0.1;
        particle.currentY += (particle.targetY - particle.currentY) * 0.1;
        
        // Scale up
        particle.scale += (particle.targetScale - particle.scale) * 0.1;
        
        // Apply transformations
        particle.mesh.position.set(particle.currentX, particle.currentY, 0);
        particle.mesh.scale.setScalar(particle.scale);
        
        // Add some rotation for flowers
        if (particle.type === 'flower') {
          particle.mesh.rotation.z += 0.01;
        }
      });

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Handle resize
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      renderer.setSize(rect.width, rect.height);
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      renderer.dispose();
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [text]);

  return (
    <div ref={containerRef} className={`w-full h-full ${className}`} />
  );
}
