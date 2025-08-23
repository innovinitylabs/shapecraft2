'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

interface FlowerArtProps {
  size?: number;
  className?: string;
}

export default function FlowerArt({ 
  size = 800,
  className = ''
}: FlowerArtProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationIdRef = useRef<number | null>(null);
  
  // Flower state (from simple-test.html)
  const flowerStateRef = useRef({
    petalRotation: 0.05,
    petalCount: 6,
    layerCount: 2,
    layerRotations: [0, 0],
    layerOffsets: [0, 0],
    stalkLength: 10,
    beePosition: { x: 0, y: 2.1, z: 0 },
    beeRotation: 0,
    wingSpeed: 18,
    currentEmotion: 'neutral',
    moodRotationSpeed: 0.2,
    moodRotationDirection: 1,
    heartbeatBPM: 72,
    heartbeatIntensity: 0.4
  });

  // References for flower parts
  const petalLayersRef = useRef<THREE.Mesh[][]>([]);
  const stalkMeshRef = useRef<THREE.Mesh | null>(null);
  const connectorMeshRef = useRef<THREE.Mesh | null>(null);
  const beeRef = useRef<THREE.Group | null>(null);

  // Emotion-based colors
  const emotionColors = {
    "happy": "#FFD700",    // Golden yellow
    "joy": "#FF69B4",      // Hot pink
    "sad": "#4169E1",      // Royal blue
    "fear": "#800080",     // Purple
    "anger": "#FF4500",    // Orange red
    "disgust": "#228B22",  // Forest green
    "shame": "#FFB6C1",    // Light pink
    "surprise": "#FF1493", // Deep pink
    "neutral": "#C0C0C0"   // Silver
  };

  // Get emotion color
  const getEmotionColor = (emotion: string, layer: number) => {
    const baseColor = emotionColors[emotion as keyof typeof emotionColors] || emotionColors["neutral"];
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const darkenFactor = 1 - (layer * 0.1);
    const darkenedR = Math.floor(r * darkenFactor);
    const darkenedG = Math.floor(g * darkenFactor);
    const darkenedB = Math.floor(b * darkenFactor);
    
    const darkenedHex = (darkenedR << 16) | (darkenedG << 8) | darkenedB;
    return darkenedHex;
  };

  // Generate flower
  const generateFlower = () => {
    const state = flowerStateRef.current;
    
    console.log('Generating flower with state:', state);
    
    // Clear existing petal layers
    petalLayersRef.current.forEach(layer => {
      layer.forEach(mesh => {
        sceneRef.current?.remove(mesh);
      });
    });
    petalLayersRef.current = [];
    
    // Initialize layer rotations and offsets arrays
    state.layerRotations = new Array(state.layerCount).fill(0);
    state.layerOffsets = new Array(state.layerCount).fill(0);
    
    // Set default offsets for natural staggering
    for (let i = 0; i < state.layerCount; i++) {
      state.layerOffsets[i] = (1 / state.layerCount) * i;
    }
    
    // Generate layers
    for (let layer = 0; layer < state.layerCount; layer++) {
      let layerRadius = 12 - (layer * 2);
      let layerColor = getEmotionColor(state.currentEmotion, layer);
      
      let petalMat = new THREE.MeshPhongMaterial({color: layerColor, side: THREE.DoubleSide});
      let petalGeom = new THREE.SphereGeometry(layerRadius, 20, 20, Math.PI / 3, Math.PI / 3, 0, Math.PI);
      petalGeom.translate(0, -layerRadius, 0);
      petalGeom.rotateX(Math.PI / 2);
      let petalMesh = new THREE.Mesh(petalGeom, petalMat);

      let layerMeshes = [];
      for (let i = 0; i < state.petalCount; i++) {
        layerMeshes[i] = petalMesh.clone();
        sceneRef.current?.add(layerMeshes[i]);
      }
      petalLayersRef.current.push(layerMeshes);
      
      console.log(`Created layer ${layer} with ${state.petalCount} petals`);
    }
    
    createConnector();
    createStalk();
    createBee();
  };

  // Create connector
  const createConnector = () => {
    if (connectorMeshRef.current) {
      sceneRef.current?.remove(connectorMeshRef.current);
      connectorMeshRef.current = null;
    }
    
    const connectorGeometry = new THREE.CylinderGeometry(2, 1.2, 1, 16);
    const connectorMaterial = new THREE.MeshPhongMaterial({
      color: 0x2d5a27,
      shininess: 10,
      flatShading: false
    });
    connectorMeshRef.current = new THREE.Mesh(connectorGeometry, connectorMaterial);
    connectorMeshRef.current.position.y = -5.2;
    connectorMeshRef.current.userData.isConnector = true;
    sceneRef.current?.add(connectorMeshRef.current);
  };

  // Create stalk
  const createStalk = () => {
    if (stalkMeshRef.current) {
      sceneRef.current?.remove(stalkMeshRef.current);
      stalkMeshRef.current = null;
    }
    
    const state = flowerStateRef.current;
    if (state.stalkLength > 0) {
      const pos = [];
      const col = [];
      const ind = [];
      let offset = 0;
      
      const y0 = -4.2;
      const l0 = state.stalkLength * 0.3;
      const l1 = state.stalkLength * 0.7;
      const theta = -0.3;
      const R0 = 1.2;
      const R = 1.5;
      const nt = 20;
      const nfi = 16;
      
      const lx = l1 * Math.sin(theta);
      const ly = l0 + l1 * Math.cos(theta);
      
      const stn = 1 / (nt - 1);
      const stFi = 2 * Math.PI / (nfi - 1);
      
      for (let t = 0; t < 1.001; t += stn) {
        const x = t * t * lx;
        const y = y0 - (2 * t * (1 - t) * l0 + t * t * ly);
        
        const dx = t * lx;
        const dy = -(1 - t - t) * l0 - t * ly;
        const dlen = Math.sqrt(dx * dx + dy * dy);
        const dxNorm = dx / dlen;
        const dyNorm = dy / dlen;
        
        const r = R0 + t * (R - R0);
        
        for (let fi = 0; fi < 6.3; fi += stFi) {
          const len = r * Math.cos(fi);
          pos.push(x + dyNorm * len, y - dxNorm * len, r * Math.sin(fi));
          col.push(0, 0.5, 0);
        }
      }
      
      let t = offset;
      let tn = offset + nfi;
      for (let i = 0; i < nt - 1; i++) {
        for (let j = 0; j < nfi - 1; j++) {
          ind.push(t, tn, t + 1, tn, tn + 1, t + 1);
          t++;
          tn++;
        }
        t++;
        tn++;
      }
      offset += nt * nfi;
      
      const stalkGeometry = new THREE.BufferGeometry();
      stalkGeometry.setIndex(ind);
      stalkGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      stalkGeometry.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
      stalkGeometry.computeVertexNormals();
      
      const stalkMaterial = new THREE.MeshPhongMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        shininess: 10,
        flatShading: false
      });
      
      stalkMeshRef.current = new THREE.Mesh(stalkGeometry, stalkMaterial);
      sceneRef.current?.add(stalkMeshRef.current);
    }
  };

  // Create bee
  const createBee = () => {
    if (beeRef.current) {
      sceneRef.current?.remove(beeRef.current);
      beeRef.current = null;
    }
    
    const state = flowerStateRef.current;
    
    beeRef.current = new THREE.Group();
    sceneRef.current?.add(beeRef.current);
    
    // Body
    const bodyGeom = new THREE.SphereGeometry(0.3, 16, 12);
    bodyGeom.scale(1, 1, 1.8);
    const bodyMat = new THREE.MeshStandardMaterial({color: 0xffd66b, roughness: 0.3, metalness: 0.1});
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.castShadow = true;
    beeRef.current.add(body);
    
    // Stripes
    const stripeMat = new THREE.MeshStandardMaterial({color: 0x0a0a0a, roughness: 0.7});
    for (let i = -1.0; i <= 1.0; i += 0.5) {
      let bodyRadiusAtPosition;
      if (i === 0) {
        bodyRadiusAtPosition = 0.32;
      } else if (Math.abs(i) === 1.0) {
        bodyRadiusAtPosition = 0.26;
      } else {
        bodyRadiusAtPosition = 0.30;
      }
      
      const stripe = new THREE.Mesh(new THREE.CylinderGeometry(bodyRadiusAtPosition, bodyRadiusAtPosition, 0.02, 16), stripeMat);
      stripe.rotation.x = Math.PI / 2;
      stripe.position.z = i * 0.3;
      stripe.scale.set(1, 1.8, 1);
      body.add(stripe);
    }
    
    // Head
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 12, 10), 
      new THREE.MeshStandardMaterial({color: 0x222222, roughness: 0.6})
    );
    head.position.set(0, 0.0, 0.7);
    head.castShadow = true;
    beeRef.current.add(head);
    
    // Eyes
    const eyeGeom = new THREE.SphereGeometry(0.05, 8, 6);
    const eyeMat = new THREE.MeshStandardMaterial({color: 0x111111});
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(-0.08, 0.08, 0.85);
    const rightEye = leftEye.clone();
    rightEye.position.x = 0.08;
    beeRef.current.add(leftEye, rightEye);
    
    // Antennae
    function makeAntenna(side = 1) {
      const geom = new THREE.CylinderGeometry(0.008, 0.008, 0.3, 6);
      const mat = new THREE.MeshStandardMaterial({color: 0x111111});
      const mesh = new THREE.Mesh(geom, mat);
      mesh.rotation.z = side * 0.4;
      mesh.rotation.x = 0.3;
      mesh.position.set(side * -0.05, 0.2, 0.8);
      return mesh;
    }
    beeRef.current.add(makeAntenna(1), makeAntenna(-1));
    
    // Wings
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0xeef6ff, 
      opacity: 0.6, 
      transparent: true, 
      side: THREE.DoubleSide, 
      metalness: 0.0, 
      roughness: 0.1
    });
    
    function createWingGeometry() {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.quadraticCurveTo(0.3, 0.1, 0.5, 0.2);
      shape.quadraticCurveTo(0.6, 0.4, 0.5, 0.6);
      shape.quadraticCurveTo(0.3, 0.7, 0, 0.6);
      shape.quadraticCurveTo(-0.3, 0.7, -0.5, 0.6);
      shape.quadraticCurveTo(-0.6, 0.4, -0.5, 0.2);
      shape.quadraticCurveTo(-0.3, 0.1, 0, 0);
      
      const geometry = new THREE.ShapeGeometry(shape);
      geometry.scale(0.4, 0.6, 1);
      return geometry;
    }
    
    function makeWing(side = 1, wingSet = 1) {
      const wingGeom = createWingGeometry();
      const mesh = new THREE.Mesh(wingGeom, wingMat);
      
      const xOffset = side * (0.4 + (wingSet - 1) * 0.15);
      const yOffset = 0.15 + (wingSet - 1) * 0.2;
      const zOffset = 0.5;
      
      mesh.position.set(xOffset, yOffset, zOffset);
      mesh.rotation.set(-.69, side * 0.4, 0.3);
      
      return mesh;
    }
    
    const leftWing = makeWing(-.8, 1);
    const rightWing = makeWing(.8, 1);
    const leftWing2 = makeWing(-.9, 2);
    const rightWing2 = makeWing(.9, 2);
    
    beeRef.current.add(leftWing, rightWing, leftWing2, rightWing2);
    beeRef.current.userData.wings = [leftWing, rightWing, leftWing2, rightWing2];
    
    // Stinger
    const stinger = new THREE.Mesh(
      new THREE.ConeGeometry(0.04, 0.13, 8), 
      new THREE.MeshStandardMaterial({color: 0x111111})
    );
    stinger.position.set(0, -0.15, -0.5);
    stinger.rotation.x = Math.PI;
    beeRef.current.add(stinger);
    
    // Set initial position
    updateBeeTransform();
  };

  // Update bee transform
  const updateBeeTransform = () => {
    if (beeRef.current) {
      const state = flowerStateRef.current;
      beeRef.current.position.set(state.beePosition.x, state.beePosition.y, state.beePosition.z);
      beeRef.current.scale.setScalar(1.11);
      beeRef.current.rotation.y = (state.beeRotation * Math.PI) / 180;
    }
  };

  // Update function
  const update = () => {
    const state = flowerStateRef.current;
    
    // Debug: Log update calls (only every 60 frames to avoid spam)
    if (Math.random() < 0.016) {
      console.log('Update called, petalLayers:', petalLayersRef.current.length);
    }
    
    // Update mood-based rotation
    if (state.moodRotationSpeed > 0) {
      petalLayersRef.current.forEach((layer, layerIndex) => {
        const layerDirection = layerIndex % 2 === 0 ? state.moodRotationDirection : -state.moodRotationDirection;
        state.layerOffsets[layerIndex] += state.moodRotationSpeed * layerDirection * 0.02;
        state.layerOffsets[layerIndex] = state.layerOffsets[layerIndex] % 1;
        if (state.layerOffsets[layerIndex] < 0) state.layerOffsets[layerIndex] += 1;
      });
    }
    
    // Update heartbeat glow effect
    const t = Date.now() * 0.001;
    const heartbeatPeriod = 60 / state.heartbeatBPM;
    const heartbeatPhase = (t % heartbeatPeriod) / heartbeatPeriod;
    
    const pulse1 = Math.sin(heartbeatPhase * Math.PI * 2);
    const pulse2 = Math.sin(heartbeatPhase * Math.PI * 4) * 0.3;
    const heartbeatPulse = (pulse1 + pulse2) * 0.5 + 0.5;
    
    petalLayersRef.current.forEach((layer, layerIndex) => {
      layer.forEach(petal => {
        const baseColor = emotionColors[state.currentEmotion as keyof typeof emotionColors] || emotionColors["neutral"];
        const hex = baseColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        const glowFactor = 1 + (heartbeatPulse * state.heartbeatIntensity);
        const glowR = Math.min(255, Math.floor(r * glowFactor));
        const glowG = Math.min(255, Math.floor(g * glowFactor));
        const glowB = Math.min(255, Math.floor(b * glowFactor));
        
                 const glowColor = (glowR << 16) | (glowG << 8) | glowB;
         (petal.material as THREE.MeshPhongMaterial).color.setHex(glowColor);
         (petal.material as THREE.MeshPhongMaterial).emissive = new THREE.Color(glowColor);
         (petal.material as THREE.MeshPhongMaterial).emissiveIntensity = heartbeatPulse * state.heartbeatIntensity * 0.3;
      });
    });
    
    // Update all petal layers with rotations
    const rotationStep = Math.PI * 2 / state.petalCount;
    
    petalLayersRef.current.forEach((layer, layerIndex) => {
      for (var i = 0; i < state.petalCount; i++) {
        layer[i].rotation.set(0, 0, 0);
        layer[i].rotateY((rotationStep * i) + (state.layerOffsets[layerIndex] * Math.PI * 2));
        layer[i].rotateX((Math.PI / 2) * (state.petalRotation + state.layerRotations[layerIndex]));
      }
    });
    
    // Update bee animation
    if (beeRef.current && beeRef.current.userData.wings) {
      // Flight movement
      beeRef.current.position.y = state.beePosition.y + Math.sin(t * 1.2) * 0.08;
      
      const manualRotation = (state.beeRotation * Math.PI) / 180;
      const animationRotation = Math.sin(t * 0.3) * 0.08;
      beeRef.current.rotation.y = manualRotation + animationRotation;
      
      // Wing flapping
      const wingAngle = Math.sin(t * state.wingSpeed) * 0.9 + 0.5;
      const wings = beeRef.current.userData.wings;
      
      wings[0].rotation.z = -wingAngle * 0.6 + 0.4;
      wings[1].rotation.z = wingAngle * 0.6 - 0.4;
      
      const backWingAngle = Math.sin(t * state.wingSpeed + 0.2) * 0.9 + 0.5;
      wings[2].rotation.z = -backWingAngle * 0.6 + 0.4;
      wings[3].rotation.z = backWingAngle * 0.6 - 0.4;
    }
  };

  // Initialize scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, size / size, 0.1, 1000);
    camera.position.set(0, 50, 120);

    // Lights
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(20, 10, 30);
    dirLight.castShadow = true;
    const hemLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 2);
    scene.add(dirLight, hemLight);

    // Renderer
    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.autoUpdate = false;
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableRotate = true;
    controls.minDistance = 50;
    controls.maxDistance = 300;
    controls.update();
    
    // Store controls reference for updates
    controlsRef.current = controls;
    
    // Debug: Log controls setup
    console.log('OrbitControls created:', {
      enabled: controls.enabled,
      enableZoom: controls.enableZoom,
      enablePan: controls.enablePan,
      enableRotate: controls.enableRotate,
      target: controls.target
    });

    // Initialize flower
    generateFlower();
    
    // Debug: Check if flower was created
    console.log('Flower generated:', {
      petalLayers: petalLayersRef.current.length,
      sceneChildren: scene.children.length,
      state: flowerStateRef.current
    });

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      update();
      controlsRef.current?.update();
      renderer.render(scene, camera);
    };
    
    // Debug: Log animation start
    console.log('Starting animation loop');
    animate();

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      if (renderer) {
        renderer.dispose();
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      }
    };
  }, [size]);

  return (
    <div 
      ref={containerRef} 
      className={`${className}`}
      style={{ width: size, height: size }}
    />
  );
}