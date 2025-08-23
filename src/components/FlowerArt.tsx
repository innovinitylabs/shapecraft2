'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

interface FlowerTraits {
  // Core shape rarity
  coreShape: 'circle' | 'hexagon' | 'star' | 'spiral';
  // Mood-based traits
  mood: number; // 1-10 scale
  petalCount: number;
  petalShape: 'rounded' | 'sharp' | 'drooping';
  // Rarity traits
  ringCount: number;
  petalThickness: number;
  glowIntensity: number;
  // Collective traits
  collectiveMood: number;
  tradingActivity: number;
}

interface FlowerArtProps {
  traits: FlowerTraits;
  size?: number;
  interactive?: boolean;
  onMoodChange?: (mood: number) => void;
}

export default function FlowerArt({ 
  traits, 
  size = 300, 
  interactive = false,
  onMoodChange 
}: FlowerArtProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const flowerGroupRef = useRef<THREE.Group | null>(null);

  // Memoize flower geometry based on traits
  const flowerGeometry = useMemo(() => {
    const group = new THREE.Group();
    
    // Core shape based on rarity
    const coreGeometry = createCoreGeometry(traits.coreShape);
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: getMoodColor(traits.mood),
      emissive: getMoodColor(traits.mood),
      emissiveIntensity: traits.glowIntensity * 0.3,
      shininess: 100
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    // Mood rings (Layer 1)
    for (let i = 0; i < traits.ringCount; i++) {
      const ringGeometry = createRingGeometry(i + 1, traits.petalCount);
      const ringMaterial = new THREE.MeshPhongMaterial({
        color: getMoodColor(traits.mood),
        transparent: true,
        opacity: 0.7 - (i * 0.1),
        emissive: getMoodColor(traits.mood),
        emissiveIntensity: traits.glowIntensity * (0.5 - i * 0.1)
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.z = (i * Math.PI) / traits.ringCount;
      group.add(ring);
    }

    // Petals based on mood
    for (let i = 0; i < traits.petalCount; i++) {
      const petalGeometry = createPetalGeometry(traits.petalShape, traits.petalThickness);
      const petalMaterial = new THREE.MeshPhongMaterial({
        color: getMoodColor(traits.mood),
        transparent: true,
        opacity: 0.8,
        emissive: getMoodColor(traits.mood),
        emissiveIntensity: traits.glowIntensity * 0.2
      });
      const petal = new THREE.Mesh(petalGeometry, petalMaterial);
      
      const angle = (i / traits.petalCount) * Math.PI * 2;
      const radius = 1.5 + (i % 2) * 0.3;
      petal.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      );
      petal.rotation.z = angle;
      petal.scale.setScalar(0.8 + (traits.mood / 10) * 0.4);
      group.add(petal);
    }

    // Collective mood aura
    const auraGeometry = new THREE.SphereGeometry(2.5, 32, 32);
    const auraMaterial = new THREE.MeshPhongMaterial({
      color: getMoodColor(traits.collectiveMood),
      transparent: true,
      opacity: 0.1,
      emissive: getMoodColor(traits.collectiveMood),
      emissiveIntensity: traits.glowIntensity * 0.1
    });
    const aura = new THREE.Mesh(auraGeometry, auraMaterial);
    group.add(aura);

    return group;
  }, [traits]);

  // Helper functions
  function createCoreGeometry(shape: string): THREE.BufferGeometry {
    switch (shape) {
      case 'hexagon':
        return new THREE.CircleGeometry(0.8, 6);
      case 'star':
        return createStarGeometry(0.8);
      case 'spiral':
        return createSpiralGeometry(0.8);
      default:
        return new THREE.CircleGeometry(0.8, 32);
    }
  }

  function createStarGeometry(radius: number): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    const points = [];
    const spikes = 5;
    
    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i / (spikes * 2)) * Math.PI * 2;
      const r = i % 2 === 0 ? radius : radius * 0.5;
      points.push(
        Math.cos(angle) * r,
        Math.sin(angle) * r,
        0
      );
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    geometry.computeVertexNormals();
    return geometry;
  }

  function createSpiralGeometry(radius: number): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    const points = [];
    const segments = 64;
    
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 8;
      const r = (i / segments) * radius;
      points.push(
        Math.cos(angle) * r,
        Math.sin(angle) * r,
        0
      );
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    geometry.computeVertexNormals();
    return geometry;
  }

  function createRingGeometry(ringIndex: number, petalCount: number): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    const points = [];
    const segments = 64;
    const radius = 1 + ringIndex * 0.3;
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const wave = Math.sin(angle * petalCount) * 0.1;
      points.push(
        Math.cos(angle) * (radius + wave),
        Math.sin(angle) * (radius + wave),
        0
      );
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    geometry.computeVertexNormals();
    return geometry;
  }

  function createPetalGeometry(shape: string, thickness: number): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    const points = [];
    
    switch (shape) {
      case 'sharp':
        // Sharp, spiky petals
        points.push(
          0, 0, 0,
          0.3, 0.1, 0,
          0.6, 0.3, 0,
          0.8, 0.8, 0,
          0.6, 1.2, 0,
          0.3, 1.4, 0,
          0, 1.5, 0,
          -0.3, 1.4, 0,
          -0.6, 1.2, 0,
          -0.8, 0.8, 0,
          -0.6, 0.3, 0,
          -0.3, 0.1, 0
        );
        break;
      case 'drooping':
        // Drooping, sad petals
        points.push(
          0, 0, 0,
          0.2, -0.1, 0,
          0.4, -0.2, 0,
          0.6, -0.1, 0,
          0.8, 0.2, 0,
          0.7, 0.6, 0,
          0.5, 0.8, 0,
          0.2, 0.9, 0,
          0, 0.8, 0,
          -0.2, 0.9, 0,
          -0.5, 0.8, 0,
          -0.7, 0.6, 0,
          -0.8, 0.2, 0,
          -0.6, -0.1, 0,
          -0.4, -0.2, 0,
          -0.2, -0.1, 0
        );
        break;
      default:
        // Rounded, calm petals
        points.push(
          0, 0, 0,
          0.3, 0.2, 0,
          0.6, 0.5, 0,
          0.8, 0.9, 0,
          0.7, 1.3, 0,
          0.4, 1.5, 0,
          0, 1.6, 0,
          -0.4, 1.5, 0,
          -0.7, 1.3, 0,
          -0.8, 0.9, 0,
          -0.6, 0.5, 0,
          -0.3, 0.2, 0
        );
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    geometry.computeVertexNormals();
    return geometry;
  }

  function getMoodColor(mood: number): THREE.Color {
    const colors = [
      new THREE.Color(0x2c3e50), // 1 - Dark blue (sad)
      new THREE.Color(0x34495e), // 2 - Gray blue
      new THREE.Color(0x7f8c8d), // 3 - Gray
      new THREE.Color(0x95a5a6), // 4 - Light gray
      new THREE.Color(0xbdc3c7), // 5 - Neutral
      new THREE.Color(0xf39c12), // 6 - Orange
      new THREE.Color(0xe67e22), // 7 - Dark orange
      new THREE.Color(0xe74c3c), // 8 - Red
      new THREE.Color(0xc0392b), // 9 - Dark red
      new THREE.Color(0xff6b6b)  // 10 - Bright red (angry)
    ];
    
    const index = Math.floor(mood) - 1;
    return colors[Math.max(0, Math.min(index, colors.length - 1))];
  }

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      size / size,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(getMoodColor(traits.mood), 1, 10);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    // Add flower
    const flowerGroup = flowerGeometry.clone();
    flowerGroupRef.current = flowerGroup;
    scene.add(flowerGroup);

    // Add to container
    containerRef.current.appendChild(renderer.domElement);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate flower slowly
      if (flowerGroup) {
        flowerGroup.rotation.z += 0.005;
        
        // Breathing animation based on trading activity
        const breathingScale = 1 + Math.sin(Date.now() * 0.001 * (1 + traits.tradingActivity)) * 0.1;
        flowerGroup.scale.setScalar(breathingScale);
        
        // Mood-based pulsing
        flowerGroup.children.forEach((child, index) => {
          if (child instanceof THREE.Mesh) {
            const pulse = Math.sin(Date.now() * 0.002 + index * 0.5) * 0.1;
            child.material.emissiveIntensity = traits.glowIntensity * (0.3 + pulse);
          }
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    // Interactive mouse events
    if (interactive) {
      const handleMouseMove = (event: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        if (flowerGroup) {
          flowerGroup.rotation.x = y * 0.3;
          flowerGroup.rotation.y = x * 0.3;
        }
      };

      const handleClick = () => {
        if (onMoodChange) {
          const newMood = Math.floor(Math.random() * 10) + 1;
          onMoodChange(newMood);
        }
      };

      renderer.domElement.addEventListener('mousemove', handleMouseMove);
      renderer.domElement.addEventListener('click', handleClick);

      return () => {
        renderer.domElement.removeEventListener('mousemove', handleMouseMove);
        renderer.domElement.removeEventListener('click', handleClick);
        cancelAnimationFrame(animationId);
        renderer.dispose();
      };
    }

    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
    };
  }, [traits, size, interactive, onMoodChange]);

  return (
    <div 
      ref={containerRef} 
      className="relative"
      style={{ width: size, height: size }}
    >
      {interactive && (
        <div className="absolute bottom-2 left-2 text-xs text-gray-400">
          Click to change mood • Hover to rotate
        </div>
      )}
    </div>
  );
}

// Utility function to generate random flower traits
export function generateFlowerTraits(tokenId: number): FlowerTraits {
  const seed = tokenId;
  const random = (min: number, max: number) => {
    const x = Math.sin(seed + min + max) * 10000;
    return min + (x - Math.floor(x)) * (max - min);
  };

  const coreShapes: Array<'circle' | 'hexagon' | 'star' | 'spiral'> = ['circle', 'hexagon', 'star', 'spiral'];
  const petalShapes: Array<'rounded' | 'sharp' | 'drooping'> = ['rounded', 'sharp', 'drooping'];

  return {
    coreShape: coreShapes[Math.floor(random(0, 4))],
    mood: Math.floor(random(1, 11)),
    petalCount: Math.floor(random(5, 13)),
    petalShape: petalShapes[Math.floor(random(0, 3))],
    ringCount: Math.floor(random(2, 6)),
    petalThickness: random(0.5, 1.5),
    glowIntensity: random(0.3, 1.0),
    collectiveMood: random(1, 11),
    tradingActivity: random(0, 1)
  };
}
