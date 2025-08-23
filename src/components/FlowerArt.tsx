'use client';

import { useEffect, useRef } from 'react';
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
  const animationIdRef = useRef<number | null>(null);

  // Beautiful mood-based color palettes
  const getMoodColors = (mood: number) => {
    const palettes = [
      // 1 - Deep sadness (dark purples/blues)
      { 
        primary: '#4A148C', 
        secondary: '#7B1FA2', 
        accent: '#9C27B0',
        petal: '#6A1B9A',
        center: '#3F1B5B'
      },
      // 2 - Sadness (blues)
      { 
        primary: '#1565C0', 
        secondary: '#1976D2', 
        accent: '#2196F3',
        petal: '#0D47A1',
        center: '#0D47A1'
      },
      // 3 - Melancholy (gray-blues)
      { 
        primary: '#546E7A', 
        secondary: '#607D8B', 
        accent: '#78909C',
        petal: '#455A64',
        center: '#37474F'
      },
      // 4 - Disappointment (muted colors)
      { 
        primary: '#8D6E63', 
        secondary: '#A1887F', 
        accent: '#BCAAA4',
        petal: '#6D4C41',
        center: '#5D4037'
      },
      // 5 - Neutral (soft greens)
      { 
        primary: '#66BB6A', 
        secondary: '#81C784', 
        accent: '#A5D6A7',
        petal: '#4CAF50',
        center: '#388E3C'
      },
      // 6 - Content (warm yellows)
      { 
        primary: '#FFB300', 
        secondary: '#FFC107', 
        accent: '#FFD54F',
        petal: '#FF8F00',
        center: '#F57C00'
      },
      // 7 - Happy (bright oranges)
      { 
        primary: '#FF7043', 
        secondary: '#FF8A65', 
        accent: '#FFAB91',
        petal: '#FF5722',
        center: '#E64A19'
      },
      // 8 - Excited (vibrant pinks)
      { 
        primary: '#E91E63', 
        secondary: '#F06292', 
        accent: '#F8BBD9',
        petal: '#C2185B',
        center: '#AD1457'
      },
      // 9 - Elated (bright reds)
      { 
        primary: '#F44336', 
        secondary: '#EF5350', 
        accent: '#E57373',
        petal: '#D32F2F',
        center: '#C62828'
      },
      // 10 - Euphoric (rainbow colors)
      { 
        primary: '#FF1744', 
        secondary: '#FF4081', 
        accent: '#FF80AB',
        petal: '#D50000',
        center: '#B71C1C'
      }
    ];
    
    const index = Math.floor(mood) - 1;
    return palettes[Math.max(0, Math.min(index, palettes.length - 1))];
  };

  // Create beautiful petal geometry
  const createPetalGeometry = (shape: string) => {
    const geometry = new THREE.BufferGeometry();
    const points = [];
    
    switch (shape) {
      case 'sharp':
        // Sharp, energetic petals (happy/excited mood)
        points.push(
          0, 0, 0,
          0.3, 0.2, 0,
          0.6, 0.5, 0,
          0.8, 1.0, 0,
          0.9, 1.5, 0,
          0.8, 2.0, 0,
          0.6, 2.3, 0,
          0.4, 2.4, 0,
          0, 2.5, 0,
          -0.4, 2.4, 0,
          -0.6, 2.3, 0,
          -0.8, 2.0, 0,
          -0.9, 1.5, 0,
          -0.8, 1.0, 0,
          -0.6, 0.5, 0,
          -0.3, 0.2, 0
        );
        break;
      case 'drooping':
        // Drooping, sad petals
        points.push(
          0, 0, 0,
          0.2, -0.1, 0,
          0.4, -0.2, 0,
          0.6, -0.1, 0,
          0.7, 0.3, 0,
          0.6, 0.8, 0,
          0.4, 1.2, 0,
          0.2, 1.4, 0,
          0, 1.5, 0,
          -0.2, 1.4, 0,
          -0.4, 1.2, 0,
          -0.6, 0.8, 0,
          -0.7, 0.3, 0,
          -0.6, -0.1, 0,
          -0.4, -0.2, 0,
          -0.2, -0.1, 0
        );
        break;
      default:
        // Rounded, peaceful petals
        points.push(
          0, 0, 0,
          0.4, 0.3, 0,
          0.7, 0.8, 0,
          0.9, 1.4, 0,
          0.8, 2.0, 0,
          0.6, 2.4, 0,
          0.3, 2.6, 0,
          0, 2.7, 0,
          -0.3, 2.6, 0,
          -0.6, 2.4, 0,
          -0.8, 2.0, 0,
          -0.9, 1.4, 0,
          -0.7, 0.8, 0,
          -0.4, 0.3, 0
        );
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    geometry.computeVertexNormals();
    return geometry;
  };

  // Create flower center geometry
  const createCenterGeometry = (shape: string) => {
    switch (shape) {
      case 'hexagon':
        return new THREE.CircleGeometry(0.8, 6);
      case 'star':
        const starGeometry = new THREE.BufferGeometry();
        const starPoints = [];
        const spikes = 5;
        for (let i = 0; i < spikes * 2; i++) {
          const angle = (i / (spikes * 2)) * Math.PI * 2;
          const r = i % 2 === 0 ? 0.8 : 0.4;
          starPoints.push(
            Math.cos(angle) * r,
            Math.sin(angle) * r,
            0
          );
        }
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPoints, 3));
        starGeometry.computeVertexNormals();
        return starGeometry;
      case 'spiral':
        const spiralGeometry = new THREE.BufferGeometry();
        const spiralPoints = [];
        const segments = 64;
        for (let i = 0; i < segments; i++) {
          const angle = (i / segments) * Math.PI * 8;
          const r = (i / segments) * 0.8;
          spiralPoints.push(
            Math.cos(angle) * r,
            Math.sin(angle) * r,
            0
          );
        }
        spiralGeometry.setAttribute('position', new THREE.Float32BufferAttribute(spiralPoints, 3));
        spiralGeometry.computeVertexNormals();
        return spiralGeometry;
      default:
        return new THREE.CircleGeometry(0.8, 32);
    }
  };

  // Cleanup function
  const cleanup = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
    
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = null;
    }
    
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
    
    sceneRef.current = null;
    flowerGroupRef.current = null;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up any existing renderer
    cleanup();

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

    // Beautiful lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 10);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    // Create flower group
    const flowerGroup = new THREE.Group();
    flowerGroupRef.current = flowerGroup;

    // Get beautiful colors based on mood
    const colors = getMoodColors(traits.mood);

    // Create flower center with beautiful material
    const centerGeometry = createCenterGeometry(traits.coreShape);
    const centerMaterial = new THREE.MeshPhongMaterial({
      color: colors.center,
      emissive: colors.primary,
      emissiveIntensity: traits.glowIntensity * 0.2,
      shininess: 100,
      transparent: true,
      opacity: 0.9
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    flowerGroup.add(center);

    // Create beautiful petals
    for (let i = 0; i < traits.petalCount; i++) {
      const petalGeometry = createPetalGeometry(traits.petalShape);
      const petalMaterial = new THREE.MeshPhongMaterial({
        color: colors.petal,
        emissive: colors.secondary,
        emissiveIntensity: traits.glowIntensity * 0.1,
        transparent: true,
        opacity: 0.95,
        shininess: 50
      });
      const petal = new THREE.Mesh(petalGeometry, petalMaterial);
      
      const angle = (i / traits.petalCount) * Math.PI * 2;
      const radius = 1.2 + (i % 2) * 0.2;
      petal.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      );
      petal.rotation.z = angle;
      petal.scale.setScalar(0.8 + (traits.mood / 10) * 0.3);
      flowerGroup.add(petal);
    }

    // Create beautiful ring layers
    for (let i = 0; i < traits.ringCount; i++) {
      const ringGeometry = new THREE.RingGeometry(1.8 + i * 0.2, 2.0 + i * 0.2, 32);
      const ringMaterial = new THREE.MeshPhongMaterial({
        color: colors.accent,
        transparent: true,
        opacity: 0.4 - (i * 0.1),
        emissive: colors.accent,
        emissiveIntensity: traits.glowIntensity * (0.3 - i * 0.05)
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.z = (i * Math.PI) / traits.ringCount;
      flowerGroup.add(ring);
    }

    // Create collective mood aura
    const auraColors = getMoodColors(traits.collectiveMood);
    const auraGeometry = new THREE.SphereGeometry(2.8, 32, 32);
    const auraMaterial = new THREE.MeshPhongMaterial({
      color: auraColors.primary,
      transparent: true,
      opacity: 0.15,
      emissive: auraColors.primary,
      emissiveIntensity: traits.glowIntensity * 0.05
    });
    const aura = new THREE.Mesh(auraGeometry, auraMaterial);
    flowerGroup.add(aura);

    scene.add(flowerGroup);

    // Add to container
    containerRef.current.appendChild(renderer.domElement);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Rotate flower slowly
      if (flowerGroup) {
        flowerGroup.rotation.z += 0.003;
        
        // Breathing animation based on trading activity
        const breathingScale = 1 + Math.sin(Date.now() * 0.001 * (1 + traits.tradingActivity)) * 0.05;
        flowerGroup.scale.setScalar(breathingScale);
        
        // Mood-based pulsing
        flowerGroup.children.forEach((child, index) => {
          if (child instanceof THREE.Mesh) {
            const pulse = Math.sin(Date.now() * 0.002 + index * 0.3) * 0.05;
            child.material.emissiveIntensity = traits.glowIntensity * (0.2 + pulse);
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
          // Gentle rotation on hover
          flowerGroup.rotation.x = y * 0.1;
          flowerGroup.rotation.y = x * 0.1;
          
          // Add glow effect on hover
          flowerGroup.children.forEach((child, index) => {
            if (child instanceof THREE.Mesh) {
              // Calculate distance from center for glow intensity
              const distanceFromCenter = Math.sqrt(x * x + y * y);
              const glowIntensity = Math.max(0.1, 1 - distanceFromCenter) * 0.5;
              
              // Increase emissive intensity for glow effect
              child.material.emissiveIntensity = traits.glowIntensity * (0.3 + glowIntensity);
              
              // Add subtle scale effect for petals
              if (index > 0) { // Skip center, only petals
                const scale = 1 + glowIntensity * 0.1;
                child.scale.setScalar(scale);
              }
            }
          });
        }
      };

      const handleMouseLeave = () => {
        if (flowerGroup) {
          // Reset rotation and glow when mouse leaves
          flowerGroup.rotation.x = 0;
          flowerGroup.rotation.y = 0;
          
          // Reset emissive intensity to normal
          flowerGroup.children.forEach((child) => {
            if (child instanceof THREE.Mesh) {
              child.material.emissiveIntensity = traits.glowIntensity * 0.2;
              
              // Reset scale for petals
              if (child !== flowerGroup.children[0]) { // Skip center
                child.scale.setScalar(0.8 + (traits.mood / 10) * 0.3);
              }
            }
          });
        }
      };

      const handleClick = () => {
        if (onMoodChange) {
          const newMood = Math.floor(Math.random() * 10) + 1;
          onMoodChange(newMood);
        }
      };

      renderer.domElement.addEventListener('mousemove', handleMouseMove);
      renderer.domElement.addEventListener('mouseleave', handleMouseLeave);
      renderer.domElement.addEventListener('click', handleClick);

      return () => {
        renderer.domElement.removeEventListener('mousemove', handleMouseMove);
        renderer.domElement.removeEventListener('mouseleave', handleMouseLeave);
        renderer.domElement.removeEventListener('click', handleClick);
        cleanup();
      };
    }

    return cleanup;
  }, [traits, size, interactive, onMoodChange]);

  return (
    <div 
      ref={containerRef} 
      className="relative cursor-pointer"
      style={{ width: size, height: size }}
    >
      {interactive && (
        <div className="absolute bottom-2 left-2 text-xs text-gray-400">
          Click to change mood • Hover to glow
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