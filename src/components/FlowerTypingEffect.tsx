'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FlowerTypingEffectProps {
  text: string;
  className?: string;
}

export default function FlowerTypingEffect({ text, className = "" }: FlowerTypingEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || !textInputRef.current) return;

    // Settings
    const fontName = 'Arial, sans-serif';
    const textureFontSize = 80;
    const fontScaleFactor = 0.08;

    // Set up hidden text input
    const textInputEl = textInputRef.current;
    textInputEl.style.fontSize = textureFontSize + 'px';
    textInputEl.style.font = '100 ' + textureFontSize + 'px ' + fontName;
    textInputEl.style.lineHeight = 1.1 * textureFontSize + 'px';
    textInputEl.innerHTML = text;

    // 3D scene related globals
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let textCanvas: HTMLCanvasElement;
    let textCtx: CanvasRenderingContext2D;
    let particleGeometry: THREE.PlaneGeometry;
    let dummy: THREE.Object3D;
    let clock: THREE.Clock;
    let cursorMesh: THREE.Mesh;
    let flowerInstancedMesh: THREE.InstancedMesh;
    let leafInstancedMesh: THREE.InstancedMesh;
    let flowerMaterial: THREE.MeshBasicMaterial;
    let leafMaterial: THREE.MeshBasicMaterial;

    // Coordinates data per 2D canvas and 3D scene
    let textureCoordinates: Array<{
      x: number;
      y: number;
      old: boolean;
      toDelete: boolean;
    }> = [];

    // 1d-array of data objects to store and change params of each instance
    let particles: Array<Flower | Leaf> = [];

    // Parameters of whole string per 2D canvas and 3D scene
    const stringBox = {
      wTexture: 0,
      wScene: 0,
      hTexture: 0,
      hScene: 0,
      caretPosScene: [] as number[]
    };

    // Typing animation variables
    let currentTextLength = 0;
    const typingSpeed = 100; // milliseconds per character
    let lastTypingTime = 0;

    // Initialize 3D scene
    function init() {
      const containerEl = containerRef.current!;
      const containerRect = containerEl.getBoundingClientRect();
      camera = new THREE.PerspectiveCamera(45, containerRect.width / containerRect.height, 0.1, 1000);
      camera.position.z = 20;

      scene = new THREE.Scene();
      sceneRef.current = scene;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
      });
      rendererRef.current = renderer;
      renderer.setPixelRatio(window.devicePixelRatio);
      
      // Use the container dimensions from init
      renderer.setSize(containerRect.width, containerRect.height);
      renderer.setClearColor(0x000000, 0);
      containerEl.appendChild(renderer.domElement);

      textCanvas = document.createElement('canvas');
      textCanvas.width = textCanvas.height = 0;
      textCtx = textCanvas.getContext('2d')!;
      particleGeometry = new THREE.PlaneGeometry(1.2, 1.2);

      // Create flower texture (simple circle for now)
      const flowerTexture = new THREE.CanvasTexture(createFlowerTexture());
      flowerMaterial = new THREE.MeshBasicMaterial({
        alphaMap: flowerTexture,
        opacity: 0.3,
        depthTest: false,
        transparent: true,
      });

      // Create leaf texture (simple oval for now)
      const leafTexture = new THREE.CanvasTexture(createLeafTexture());
      leafMaterial = new THREE.MeshBasicMaterial({
        alphaMap: leafTexture,
        opacity: 0.35,
        depthTest: false,
        transparent: true,
      });

      dummy = new THREE.Object3D();
      clock = new THREE.Clock();

      const cursorGeometry = new THREE.BoxGeometry(0.1, 4.5, 0.03);
      cursorGeometry.translate(0.2, -2.9, 0);
      const cursorMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
      });
      cursorMesh = new THREE.Mesh(cursorGeometry, cursorMaterial);
      scene.add(cursorMesh);
    }

    // Create flower texture with petals
    function createFlowerTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      
      // Clear canvas
      ctx.clearRect(0, 0, 64, 64);
      
      // Draw flower with petals
      const centerX = 32;
      const centerY = 32;
      const petalCount = 8;
      const petalLength = 20;
      const petalWidth = 8;
      
      // Draw petals
      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        const petalX = centerX + Math.cos(angle) * 8;
        const petalY = centerY + Math.sin(angle) * 8;
        
        ctx.save();
        ctx.translate(petalX, petalY);
        ctx.rotate(angle);
        
        // Create petal shape
        ctx.beginPath();
        ctx.ellipse(0, 0, petalWidth, petalLength, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        
        ctx.restore();
      }
      
      // Draw center
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
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
      
      // Clear canvas
      ctx.clearRect(0, 0, 64, 64);
      
      // Draw leaf shape
      const centerX = 32;
      const centerY = 32;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 20);
      ctx.quadraticCurveTo(centerX + 15, centerY - 10, centerX + 12, centerY);
      ctx.quadraticCurveTo(centerX + 15, centerY + 10, centerX, centerY + 20);
      ctx.quadraticCurveTo(centerX - 15, centerY + 10, centerX - 12, centerY);
      ctx.quadraticCurveTo(centerX - 15, centerY - 10, centerX, centerY - 20);
      ctx.closePath();
      
      ctx.fillStyle = 'white';
      ctx.fill();
      
      return canvas;
    }

    // Handle input and update string
    function handleInput() {
      stringBox.wTexture = textInputEl.clientWidth;
      stringBox.wScene = stringBox.wTexture * fontScaleFactor;
      stringBox.hTexture = textInputEl.clientHeight;
      stringBox.hScene = stringBox.hTexture * fontScaleFactor;
      stringBox.caretPosScene = [0, 0]; // Simplified for now
    }

    // Sample coordinates from text
    function sampleCoordinates() {
      const currentTime = Date.now();
      
      // Update typing animation
      if (currentTime - lastTypingTime > typingSpeed && currentTextLength < text.length) {
        currentTextLength++;
        lastTypingTime = currentTime;
      }
      
      const currentText = text.substring(0, currentTextLength);
      const lines = currentText.split('\n');
      const linesNumber = lines.length;
      
      // Ensure canvas is large enough for the text
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d')!;
      tempCtx.font = '100 ' + textureFontSize + 'px ' + fontName;
      
      let maxWidth = 0;
      for (let i = 0; i < linesNumber; i++) {
        const metrics = tempCtx.measureText(lines[i]);
        maxWidth = Math.max(maxWidth, metrics.width);
      }
      
      textCanvas.width = Math.max(maxWidth + 50, stringBox.wTexture);
      textCanvas.height = Math.max(textureFontSize * 1.5, stringBox.hTexture);
      
      textCtx.font = '100 ' + textureFontSize + 'px ' + fontName;
      textCtx.fillStyle = '#2a9d8f';
      textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
      
      for (let i = 0; i < linesNumber; i++) {
        textCtx.fillText(lines[i], 0, (i + 0.8) * textureFontSize);
      }

      if (stringBox.wTexture > 0) {
        const imageData = textCtx.getImageData(0, 0, textCanvas.width, textCanvas.height);
        const imageMask = Array.from(Array(textCanvas.height), () => new Array(textCanvas.width));
        
        for (let i = 0; i < textCanvas.height; i++) {
          for (let j = 0; j < textCanvas.width; j++) {
            imageMask[i][j] = imageData.data[(j + i * textCanvas.width) * 4] > 0;
          }
        }

        if (textureCoordinates.length !== 0) {
          textureCoordinates = textureCoordinates.filter(c => !c.toDelete);
          particles = particles.filter(c => !c.toDelete);

          textureCoordinates.forEach(c => {
            if (imageMask[c.y]) {
              if (imageMask[c.y][c.x]) {
                c.old = true;
                if (!c.toDelete) {
                  imageMask[c.y][c.x] = false;
                }
              } else {
                c.toDelete = true;
              }
            } else {
              c.toDelete = true;
            }
          });
        }

        for (let i = 0; i < textCanvas.height; i++) {
          for (let j = 0; j < textCanvas.width; j++) {
            if (imageMask[i][j]) {
              textureCoordinates.push({
                x: j,
                y: i,
                old: false,
                toDelete: false
              });
            }
          }
        }
      } else {
        textureCoordinates = [];
      }
    }

    // Flower particle class
    class Flower {
      type: number;
      x: number;
      y: number;
      z: number;
      color: number;
      isGrowing: boolean;
      toDelete: boolean;
      scale: number;
      maxScale: number;
      deltaScale: number;
      age: number;
      ageDelta: number;
      rotationZ: number;

      constructor([x, y]: [number, number]) {
        this.type = 0;
        this.x = x + 0.2 * (Math.random() - 0.5);
        this.y = y + 0.2 * (Math.random() - 0.5);
        this.z = 0;
        this.color = Math.random() * 60;
        this.isGrowing = true;
        this.toDelete = false;
        this.scale = 0;
        this.maxScale = 0.9 * Math.pow(Math.random(), 20);
        this.deltaScale = 0.03 + 0.1 * Math.random();
        this.age = Math.PI * Math.random();
        this.ageDelta = 0.01 + 0.02 * Math.random();
        this.rotationZ = 0.5 * Math.random() * Math.PI;
      }

      grow() {
        this.age += this.ageDelta;
        if (this.isGrowing) {
          this.deltaScale *= 0.99;
          this.scale += this.deltaScale;
          if (this.scale >= this.maxScale) {
            this.isGrowing = false;
          }
        } else if (this.toDelete) {
          this.deltaScale *= 1.1;
          this.scale -= this.deltaScale;
          if (this.scale <= 0) {
            this.scale = 0;
            this.deltaScale = 0;
          }
        } else {
          this.scale = this.maxScale + 0.2 * Math.sin(this.age);
          this.rotationZ += 0.001 * Math.cos(this.age);
        }
      }
    }

    // Leaf particle class
    class Leaf {
      type: number;
      x: number;
      y: number;
      z: number;
      rotationZ: number;
      color: number;
      isGrowing: boolean;
      toDelete: boolean;
      scale: number;
      maxScale: number;
      deltaScale: number;
      age: number;

      constructor([x, y]: [number, number]) {
        this.type = 1;
        this.x = x;
        this.y = y;
        this.z = 0;
        this.rotationZ = 0.6 * (Math.random() - 0.5) * Math.PI;
        this.color = 100 + Math.random() * 50;
        this.isGrowing = true;
        this.toDelete = false;
        this.scale = 0;
        this.maxScale = 0.1 + 0.7 * Math.pow(Math.random(), 7);
        this.deltaScale = 0.03 + 0.03 * Math.random();
        this.age = Math.PI * Math.random();
      }

      grow() {
        if (this.isGrowing) {
          this.deltaScale *= 0.99;
          this.scale += this.deltaScale;
          if (this.scale >= this.maxScale) {
            this.isGrowing = false;
          }
        }
        if (this.toDelete) {
          this.deltaScale *= 1.1;
          this.scale -= this.deltaScale;
          if (this.scale <= 0) {
            this.scale = 0;
          }
        }
      }
    }

    // Refresh text and recreate particles
    function refreshText() {
      sampleCoordinates();

      particles = textureCoordinates.map((c, cIdx) => {
        const x = c.x * fontScaleFactor;
        const y = c.y * fontScaleFactor;
        const p = (c.old && particles[cIdx]) ? particles[cIdx] : Math.random() > 0.2 ? new Flower([x, y]) : new Leaf([x, y]);
        if (c.toDelete) {
          p.toDelete = true;
          p.scale = p.maxScale;
        }
        return p;
      });

      recreateInstancedMesh();
      makeTextFitScreen();
      updateCursorPosition();
    }

    // Recreate instanced meshes
    function recreateInstancedMesh() {
      if (flowerInstancedMesh) scene.remove(flowerInstancedMesh);
      if (leafInstancedMesh) scene.remove(leafInstancedMesh);
      
      const totalNumberOfFlowers = particles.filter(v => v.type === 0).length;
      const totalNumberOfLeafs = particles.filter(v => v.type === 1).length;
      
      flowerInstancedMesh = new THREE.InstancedMesh(particleGeometry, flowerMaterial, totalNumberOfFlowers);
      leafInstancedMesh = new THREE.InstancedMesh(particleGeometry, leafMaterial, totalNumberOfLeafs);
      scene.add(flowerInstancedMesh, leafInstancedMesh);

      let flowerIdx = 0;
      let leafIdx = 0;
      particles.forEach(p => {
        if (p.type === 0) {
          flowerInstancedMesh.setColorAt(flowerIdx, new THREE.Color("hsl(" + p.color + ", 100%, 50%)"));
          flowerIdx++;
        } else {
          leafInstancedMesh.setColorAt(leafIdx, new THREE.Color("hsl(" + p.color + ", 100%, 20%)"));
          leafIdx++;
        }
      });

      leafInstancedMesh.position.x = flowerInstancedMesh.position.x = -0.5 * stringBox.wScene;
      leafInstancedMesh.position.y = flowerInstancedMesh.position.y = -0.5 * stringBox.hScene;
    }

    // Update particle matrices
    function updateParticlesMatrices() {
      let flowerIdx = 0;
      let leafIdx = 0;
      particles.forEach(p => {
        p.grow();
        dummy.quaternion.copy(camera.quaternion);
        dummy.rotation.z += p.rotationZ;
        dummy.scale.set(p.scale, p.scale, p.scale);
        dummy.position.set(p.x, stringBox.hScene - p.y, p.z);
        if (p.type === 1) {
          dummy.position.y += 0.5 * p.scale;
        }
        dummy.updateMatrix();
        if (p.type === 0) {
          flowerInstancedMesh.setMatrixAt(flowerIdx, dummy.matrix);
          flowerIdx++;
        } else {
          leafInstancedMesh.setMatrixAt(leafIdx, dummy.matrix);
          leafIdx++;
        }
      });
      flowerInstancedMesh.instanceMatrix.needsUpdate = true;
      leafInstancedMesh.instanceMatrix.needsUpdate = true;
    }

    // Make text fit screen
    function makeTextFitScreen() {
      const fov = camera.fov * (Math.PI / 180);
      const fovH = 2 * Math.atan(Math.tan(fov / 2) * camera.aspect);
      const dx = Math.abs(0.55 * stringBox.wScene / Math.tan(0.5 * fovH));
      const dy = Math.abs(0.55 * stringBox.hScene / Math.tan(0.5 * fov));
      const factor = Math.max(dx, dy) / camera.position.length();
      if (factor > 1) {
        camera.position.x *= factor;
        camera.position.y *= factor;
        camera.position.z *= factor;
      }
    }

    // Update cursor position
    function updateCursorPosition() {
      cursorMesh.position.x = -0.5 * stringBox.wScene + stringBox.caretPosScene[0];
      cursorMesh.position.y = 0.5 * stringBox.hScene - stringBox.caretPosScene[1];
    }

    // Update cursor opacity
    function updateCursorOpacity() {
      const roundPulse = (t: number) => Math.sign(Math.sin(t * Math.PI)) * Math.pow(Math.sin((t % 1) * 3.14), 0.2);
      (cursorMesh.material as THREE.MeshBasicMaterial).opacity = roundPulse(2 * clock.getElapsedTime());
    }

    // Render loop
    function render() {
      updateParticlesMatrices();
      updateCursorOpacity();
      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(render);
    }

    // Initialize everything
    init();
    handleInput();
    refreshText();
    render();

    // Handle resize
    const handleResize = () => {
      const containerEl = containerRef.current;
      if (containerEl) {
        const containerRect = containerEl.getBoundingClientRect();
        camera.aspect = containerRect.width / containerRect.height;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRect.width, containerRect.height);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      }
    };
  }, [text]);

  return (
    <div className={`relative ${className}`}>
      {/* Hidden text input for measuring */}
      <div
        ref={textInputRef}
        className="absolute opacity-0 pointer-events-none"
        contentEditable
        suppressContentEditableWarning
      />
      {/* 3D container */}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
