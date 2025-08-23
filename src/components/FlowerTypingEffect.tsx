'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

interface FlowerTypingEffectProps {
  text: string;
  className?: string;
}

export default function FlowerTypingEffect({ text, className = "" }: FlowerTypingEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || !textInputRef.current) return;

    // Settings
    const fontName = 'Verdana';
    const textureFontSize = 70; // Same as test file
    const fontScaleFactor = 0.075; // Same as test file

    // Set up text input
    const textInputEl = textInputRef.current;
    textInputEl.style.fontSize = textureFontSize + 'px';
    textInputEl.style.font = '100 ' + textureFontSize + 'px ' + fontName;
    textInputEl.style.lineHeight = 1.1 * textureFontSize + 'px';

    // 3D scene related globals
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let textCanvas: HTMLCanvasElement;
    let textCtx: CanvasRenderingContext2D;
    let particleGeometry: THREE.PlaneGeometry;
    let dummy: THREE.Object3D;
    let clock: THREE.Clock; // eslint-disable-line @typescript-eslint/no-unused-vars
    let cursorMesh: THREE.Mesh;
    let flowerInstancedMesh: THREE.InstancedMesh;
    let leafInstancedMesh: THREE.InstancedMesh;
    let flowerMaterial: THREE.MeshBasicMaterial;
    let leafMaterial: THREE.MeshBasicMaterial;

    // String to show
    let string = text;

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

    // Set initial text and focus
    textInputEl.innerHTML = string;
    textInputEl.focus();

    function init() {
      const container = containerRef.current!;
      const rect = container.getBoundingClientRect();
      
      camera = new THREE.PerspectiveCamera(45, rect.width / rect.height, 0.1, 1000);
      camera.position.z = 18; // Same as test file

      scene = new THREE.Scene();

      renderer = new THREE.WebGLRenderer({
        alpha: true
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(rect.width, rect.height);
      container.appendChild(renderer.domElement);
      
      // Make canvas fill the full width
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';

      // Add OrbitControls like the test file
      const orbit = new OrbitControls(camera, renderer.domElement);
      orbit.enablePan = false;

      textCanvas = document.createElement('canvas');
      textCanvas.width = textCanvas.height = 0;
      textCtx = textCanvas.getContext('2d')!;
      particleGeometry = new THREE.PlaneGeometry(1.2, 1.2);

      // Use external textures like the original
      const flowerTexture = new THREE.TextureLoader().load('https://ksenia-k.com/img/threejs/flower.png');
      flowerMaterial = new THREE.MeshBasicMaterial({
        alphaMap: flowerTexture,
        opacity: 0.3,
        depthTest: false,
        transparent: true,
      });

      const leafTexture = new THREE.TextureLoader().load('https://ksenia-k.com/img/threejs/leaf.png');
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
        color: 0x000000,
        transparent: true,
      });
      cursorMesh = new THREE.Mesh(cursorGeometry, cursorMaterial);
      scene.add(cursorMesh);
    }

    function setCaretToEndOfInput() {
      document.execCommand('selectAll', false, undefined);
      document.getSelection()?.collapseToEnd();
    }

    function handleInput() {
      if (isNewLine(textInputEl.firstChild)) {
        textInputEl.firstChild?.remove();
      }
      if (isNewLine(textInputEl.lastChild)) {
        if (isNewLine(textInputEl.lastChild?.previousSibling || null)) {
          textInputEl.lastChild?.remove();
        }
      }

      string = textInputEl.innerHTML
        .replaceAll("<p>", "\n")
        .replaceAll("</p>", "")
        .replaceAll("<div>", "\n")
        .replaceAll("</div>", "")
        .replaceAll("<br>", "")
        .replaceAll("<br/>", "")
        .replaceAll("&nbsp;", " ");

      stringBox.wTexture = textInputEl.clientWidth;
      stringBox.wScene = stringBox.wTexture * fontScaleFactor;
      stringBox.hTexture = textInputEl.clientHeight;
      stringBox.hScene = stringBox.hTexture * fontScaleFactor;
      stringBox.caretPosScene = getCaretCoordinates().map(c => c * fontScaleFactor);

      function isNewLine(el: ChildNode | null) {
        if (el && 'tagName' in el && typeof el.tagName === 'string' && 'innerHTML' in el) {
          if (el.tagName.toUpperCase() === 'DIV' || el.tagName.toUpperCase() === 'P') {
            if (el.innerHTML === '<br>' || el.innerHTML === '</br>') {
              return true;
            }
          }
        }
        return false;
      }

      function getCaretCoordinates() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return [0, 0];
        
        const range = selection.getRangeAt(0);
        const needsToWorkAroundNewlineBug =
          range.startContainer.nodeName.toLowerCase() === "div" &&
          range.startOffset === 0;
        if (needsToWorkAroundNewlineBug) {
                  return [
          (range.startContainer as HTMLElement).offsetLeft,
          (range.startContainer as HTMLElement).offsetTop
        ];
        } else {
          const rects = range.getClientRects();
          if (rects[0]) {
            return [rects[0].left, rects[0].top];
                     } else {
             document.execCommand("selectAll", false, undefined);
             return [0, 0];
           }
        }
      }
    }

    function sampleCoordinates() {
      // Draw text
      const lines = string.split('\n');
      const linesNumber = lines.length;
      textCanvas.width = stringBox.wTexture;
      textCanvas.height = stringBox.hTexture;
      textCtx.font = '100 ' + textureFontSize + 'px ' + fontName;
      textCtx.fillStyle = '#2a9d8f';
      textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
      for (let i = 0; i < linesNumber; i++) {
        textCtx.fillText(lines[i], 0, (i + 0.8) * stringBox.hTexture / linesNumber);
      }

      // Sample coordinates
      if (stringBox.wTexture > 0) {
        // Image data to 2d array
        const imageData = textCtx.getImageData(0, 0, textCanvas.width, textCanvas.height);
        const imageMask = Array.from(Array(textCanvas.height), () => new Array(textCanvas.width));
        for (let i = 0; i < textCanvas.height; i++) {
          for (let j = 0; j < textCanvas.width; j++) {
            imageMask[i][j] = imageData.data[(j + i * textCanvas.width) * 4] > 0;
          }
        }

        if (textureCoordinates.length !== 0) {
          // Clean up: delete coordinates and particles which disappeared on the prev step
          // We need to keep same indexes for coordinates and particles to reuse old particles properly
          textureCoordinates = textureCoordinates.filter(c => !c.toDelete);
          particles = particles.filter(c => !c.toDelete);

          // Go through existing coordinates (old to keep, toDelete for fade-out animation)
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

        // Add new coordinates
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

    function updateCursorPosition() {
      cursorMesh.position.x = -0.5 * stringBox.wScene + stringBox.caretPosScene[0];
      cursorMesh.position.y = 0.5 * stringBox.hScene - stringBox.caretPosScene[1];
    }

    function updateCursorOpacity() {
      (cursorMesh.material as THREE.MeshBasicMaterial).opacity = 0; // Always hidden for our use case
    }

    function render() {
      updateParticlesMatrices();
      updateCursorOpacity();
      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(render);
    }

    // Initialize everything exactly like the original
    init();
    setCaretToEndOfInput();
    handleInput();
    refreshText();
    render();

    // Handle resize
    const handleResize = () => {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
        renderer.setSize(rect.width, rect.height);
        
        // Ensure canvas maintains full width
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
      }
    };

    window.addEventListener('resize', handleResize);

    // Store ref value for cleanup
    const container = containerRef.current;

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (renderer) {
        renderer.dispose();
        if (container) {
          container.innerHTML = '';
        }
      }
    };
  }, [text]);

  return (
    <div className={`relative w-full ${className}`}>
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
