'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FlowerArtParameters } from '@/services/moodClassifierService';

interface FlowerArtProps {
  // Mood classifier parameters
  emotion?: string;
  petalCount?: number;
  layerCount?: number;
  heartbeatBPM?: number;
  heartbeatIntensity?: number;
  rotationSpeed?: number;
  rotationDirection?: number;
  
  // Legacy props for backward compatibility
  traits?: any;
  size?: number;
  interactive?: boolean;
  onMoodChange?: (mood: number) => void;
  className?: string;
}

// Generate flower traits for gallery display
export function generateFlowerTraits(index: number) {
  const emotions = ['happy', 'joy', 'sad', 'fear', 'anger', 'disgust', 'shame', 'surprise', 'neutral'];
  const emotion = emotions[index % emotions.length];
  
  return {
    emotion,
    petalCount: 6 + (index % 4),
    layerCount: 2 + (index % 3),
    heartbeatBPM: 60 + (index % 40),
    heartbeatIntensity: 0.3 + (index % 7) * 0.1,
    rotationSpeed: 0.1 + (index % 9) * 0.1,
    rotationDirection: index % 2 === 0 ? 1 : -1
  };
}

export default function FlowerArt({ 
  emotion = 'neutral',
  petalCount = 6,
  layerCount = 2,
  heartbeatBPM = 72,
  heartbeatIntensity = 0.4,
  rotationSpeed = 0.2,
  rotationDirection = 1,
  size = 300,
  interactive = false,
  onMoodChange,
  className = ''
}: FlowerArtProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);
  
  // Flower state
  const flowerStateRef = useRef({
    petalRotation: 0.1,
    petalCount: petalCount,
    layerCount: layerCount,
    layerRotations: new Array(layerCount).fill(0),
    layerOffsets: new Array(layerCount).fill(0),
    stalkLength: 10,
    beePosition: { x: 0, y: 2.1, z: 0 },
    beeRotation: 0,
    wingSpeed: 18,
    currentEmotion: emotion,
    moodRotationSpeed: rotationSpeed,
    moodRotationDirection: rotationDirection,
    heartbeatBPM: heartbeatBPM,
    heartbeatIntensity: heartbeatIntensity
  });

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

  // Flower meshes
  const petalLayersRef = useRef<THREE.Mesh[][]>([]);
  const stalkMeshRef = useRef<THREE.Mesh | null>(null);
  const connectorMeshRef = useRef<THREE.Mesh | null>(null);
  const beeRef = useRef<THREE.Group | null>(null);

  // Get emotion color with layer darkening
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

  // Calculate mood rotation
  const calculateMoodRotation = () => {
    const moodSettings = {
      "happy": { intensity: 0.8, direction: 1 },
      "joy": { intensity: 1.0, direction: 1 },
      "sad": { intensity: 0.01, direction: -1 },
      "fear": { intensity: 0.6, direction: -1 },
      "anger": { intensity: 0.9, direction: -1 },
      "disgust": { intensity: 0.4, direction: -1 },
      "shame": { intensity: 0.3, direction: -1 },
      "surprise": { intensity: 0.7, direction: 1 },
      "neutral": { intensity: 0.2, direction: 1 }
    };
    
    const mood = moodSettings[emotion as keyof typeof moodSettings] || moodSettings["neutral"];
    flowerStateRef.current.moodRotationSpeed = mood.intensity;
    flowerStateRef.current.moodRotationDirection = mood.direction;
  };

  // Update mood rotation
  const updateMoodRotation = () => {
    const state = flowerStateRef.current;
    if (state.moodRotationSpeed > 0) {
      petalLayersRef.current.forEach((layer, layerIndex) => {
        const layerDirection = layerIndex % 2 === 0 ? state.moodRotationDirection : -state.moodRotationDirection;
        state.layerOffsets[layerIndex] += state.moodRotationSpeed * layerDirection * 0.02;
        state.layerOffsets[layerIndex] = state.layerOffsets[layerIndex] % 1;
        if (state.layerOffsets[layerIndex] < 0) state.layerOffsets[layerIndex] += 1;
      });
    }
  };

  // Update heartbeat glow
  const updateHeartbeatGlow = () => {
    const state = flowerStateRef.current;
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
  };

  // Create bee
  const createBee = () => {
    if (beeRef.current) {
      sceneRef.current?.remove(beeRef.current);
      beeRef.current = null;
    }
    
    const bee = new THREE.Group();
    sceneRef.current?.add(bee);
    beeRef.current = bee;
    
    // Body
    const bodyGeom = new THREE.SphereGeometry(0.3, 16, 12);
    bodyGeom.scale(1, 1, 1.8);
    const bodyMat = new THREE.MeshStandardMaterial({color: 0xffd66b, roughness: 0.3, metalness: 0.1});
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.castShadow = true;
    bee.add(body);
    
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
    bee.add(head);
    
    // Eyes
    const eyeGeom = new THREE.SphereGeometry(0.05, 8, 6);
    const eyeMat = new THREE.MeshStandardMaterial({color: 0x111111});
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(-0.08, 0.08, 0.85);
    const rightEye = leftEye.clone();
    rightEye.position.x = 0.08;
    bee.add(leftEye, rightEye);
    
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
    bee.add(makeAntenna(1), makeAntenna(-1));
    
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
    
    bee.add(leftWing, rightWing, leftWing2, rightWing2);
    bee.userData.wings = [leftWing, rightWing, leftWing2, rightWing2];
    
    // Stinger
    const stinger = new THREE.Mesh(
      new THREE.ConeGeometry(0.04, 0.13, 8), 
      new THREE.MeshStandardMaterial({color: 0x111111})
    );
    stinger.position.set(0, -0.15, -0.5);
    stinger.rotation.x = Math.PI;
    bee.add(stinger);
    
    // Legs
    function createLegSet(legPosition = 0) {
      const legSetGroup = new THREE.Group();
      
      function createCurvedLeg(side = 1, legPosition = 0) {
        const legMat = new THREE.MeshStandardMaterial({color: 0x8B4513, roughness: 0.8});
        
        let curve;
        if (legPosition === 2) {
          curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(side * 0.13, -0.06, 0),
            new THREE.Vector3(side * 0.1, -0.15, 0),
            new THREE.Vector3(side * 0.1, -0.18, 0)
          );
        } else {
          curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(side * 0.1, -0.05, 0),
            new THREE.Vector3(side * 0.1, -0.12, 0),
            new THREE.Vector3(side * 0.1, -0.15, 0)
          );
        }
        
        const legGeom = new THREE.TubeGeometry(curve, 8, 0.013, 6, false);
        const legMesh = new THREE.Mesh(legGeom, legMat);
        
        const tipGeom = new THREE.ConeGeometry(0.015, 0.03, 6);
        const tipMesh = new THREE.Mesh(tipGeom, legMat);
        
        const endPoint = curve.getPointAt(1);
        tipMesh.position.copy(endPoint);
        tipMesh.rotation.x = Math.PI;
        
        const legGroup = new THREE.Group();
        legGroup.add(legMesh);
        legGroup.add(tipMesh);
        
        return legGroup;
      }
      
      const leftLeg = createCurvedLeg(-1, legPosition);
      const rightLeg = createCurvedLeg(1, legPosition);
      legSetGroup.add(leftLeg, rightLeg);
      
      return legSetGroup;
    }
    
    const frontLegSet = createLegSet(0);
    frontLegSet.position.set(0, -0.28, -0.05);
    bee.add(frontLegSet);
    
    const middleLegSet = createLegSet(1);
    middleLegSet.position.set(0, -0.23, 0.15);
    bee.add(middleLegSet);
    
    const rearLegSet = createLegSet(2);
    rearLegSet.position.set(0, -0.18, 0.35);
    bee.add(rearLegSet);
    
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

  // Create connector
  const createConnector = () => {
    if (connectorMeshRef.current) {
      sceneRef.current?.remove(connectorMeshRef.current);
      connectorMeshRef.current = null;
    }
    updateConnectorLength();
  };

  // Update connector length
  const updateConnectorLength = () => {
    if (connectorMeshRef.current) {
      sceneRef.current?.remove(connectorMeshRef.current);
      connectorMeshRef.current = null;
    }
    
    const petalCollisionY = calculatePetalCollisionY();
    const connectorLength = Math.max(0.5, (-4.2) - petalCollisionY - 1);
    
    const connectorGeometry = new THREE.CylinderGeometry(2, 1.2, connectorLength, 16);
    const connectorMaterial = new THREE.MeshPhongMaterial({
      color: 0x2d5a27,
      shininess: 10,
      flatShading: false
    });
    connectorMeshRef.current = new THREE.Mesh(connectorGeometry, connectorMaterial);
    connectorMeshRef.current.position.y = -5.2 + (connectorLength / 2);
    connectorMeshRef.current.userData.isConnector = true;
    sceneRef.current?.add(connectorMeshRef.current);
  };

  // Calculate petal collision Y
  const calculatePetalCollisionY = () => {
    let lowestY = -12;
    
    petalLayersRef.current.forEach((layer, layerIndex) => {
      layer.forEach((petal) => {
        const geometry = petal.geometry;
        if (geometry.boundingBox === null) {
          geometry.computeBoundingBox();
        }
        
        const worldPosition = new THREE.Vector3();
        petal.getWorldPosition(worldPosition);
        
        const petalRadius = 12 - (layerIndex * 2);
        const petalLowestY = worldPosition.y - petalRadius;
        
        if (petalLowestY < lowestY) {
          lowestY = petalLowestY;
        }
      });
    });
    
    return lowestY;
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
          ind.push(t, tn, t + 1);
          ind.push(tn, tn + 1, t + 1);
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

  // Generate flower
  const generateFlower = () => {
    const state = flowerStateRef.current;
    
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
    }
    
    createConnector();
    createStalk();
    createBee();
  };

  // Update function
  const update = () => {
    const state = flowerStateRef.current;
    
    // Update mood-based rotation
    updateMoodRotation();
    
    // Update heartbeat glow effect
    updateHeartbeatGlow();
    
    // Update all petal layers with individual rotations and offsets
    const rotationStep = Math.PI * 2 / state.petalCount;
    petalLayersRef.current.forEach((layer, layerIndex) => {
      for (var i = 0; i < state.petalCount; i++) {
        layer[i].rotation.set(0, 0, 0);
        layer[i].rotateY((rotationStep * i) + (state.layerOffsets[layerIndex] * Math.PI * 2));
        layer[i].rotateX((Math.PI / 2) * (state.petalRotation + state.layerRotations[layerIndex]));
      }
    });
    
    // Update connector length based on petal positions
    updateConnectorLength();
    
    // Update bee animation
    if (beeRef.current && beeRef.current.userData.wings) {
      const t = Date.now() * 0.001;
      
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

    // Update state with new props
    flowerStateRef.current = {
      ...flowerStateRef.current,
      petalCount,
      layerCount,
      currentEmotion: emotion,
      moodRotationSpeed: rotationSpeed,
      moodRotationDirection: rotationDirection,
      heartbeatBPM,
      heartbeatIntensity
    };

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, size / size, 0.1, 1000);
    camera.position.set(0, 70, 140);

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
    // renderer.physicallyCorrectLights = true; // Removed for compatibility
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.autoUpdate = false;
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);

    // Initialize flower
    calculateMoodRotation();
    generateFlower();

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (renderer) {
        renderer.dispose();
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      }
    };
  }, [emotion, petalCount, layerCount, heartbeatBPM, heartbeatIntensity, rotationSpeed, rotationDirection, size]);

  return (
    <div 
      ref={containerRef} 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    />
  );
}