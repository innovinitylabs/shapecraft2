'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Interactive flower drawing background
// Based on Three.js shader-based flower drawing system
export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Three.js setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const sceneShader = new THREE.Scene();
    const sceneBasic = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    const clock = new THREE.Clock();

    // Pointer state
    const pointer = {
      x: 0.5,
      y: 0.6,
      moved: false,
      speed: 0,
      drawingAllowed: true,
    };

    // Render targets for feedback
    const renderTargets = [
      new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight),
      new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)
    ];

    // Shader materials
    let basicMaterial: THREE.MeshBasicMaterial;
    let shaderMaterial: THREE.ShaderMaterial;

    // Vertex shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // Fragment shader for beautiful flower drawing
    const fragmentShader = `
      uniform float u_stop_time;
      uniform vec2 u_point;
      uniform float u_moving;
      uniform float u_speed;
      uniform vec2 u_stop_randomizer;
      uniform float u_clean;
      uniform float u_ratio;
      uniform sampler2D u_texture;
      
      varying vec2 vUv;
      
      #define PI 3.14159265359
      
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }
      
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
      }
      
      void main() {
        vec2 uv = vUv;
        vec4 texColor = texture2D(u_texture, uv);
        
        vec2 point = u_point;
        float dist = distance(uv, point);
        
        // Create beautiful flower with multiple layers
        float angle = atan(uv.y - point.y, uv.x - point.x);
        float radius = dist;
        
        // Multiple petal layers for depth
        float petalCount1 = 8.0 + u_stop_randomizer.x * 4.0;
        float petalCount2 = 16.0 + u_stop_randomizer.y * 8.0;
        
        // Inner petals
        float innerPetal = sin(angle * petalCount1 + u_stop_randomizer.x * PI);
        innerPetal = smoothstep(-0.3, 0.8, innerPetal);
        
        // Outer petals
        float outerPetal = sin(angle * petalCount2 + u_stop_randomizer.y * PI);
        outerPetal = smoothstep(-0.2, 0.6, outerPetal);
        
        // Petal shapes with smooth curves
        float innerRadius = 0.08 + 0.02 * sin(u_stop_time * 2.0);
        float outerRadius = 0.15 + 0.03 * sin(u_stop_time * 1.5);
        
        float innerFlower = smoothstep(innerRadius, 0.0, radius) * innerPetal;
        float outerFlower = smoothstep(outerRadius, innerRadius * 0.7, radius) * outerPetal;
        
        // Center with detail
        float centerRadius = 0.03;
        float center = smoothstep(centerRadius, 0.0, radius);
        center += 0.3 * sin(angle * 12.0 + u_stop_time * 3.0) * smoothstep(centerRadius * 1.5, 0.0, radius);
        
        // Stem effect
        float stem = 0.0;
        if (radius > outerRadius && radius < outerRadius * 2.0) {
          float stemAngle = mod(angle + PI, PI * 2.0) - PI;
          stem = smoothstep(0.1, 0.0, abs(stemAngle)) * smoothstep(outerRadius * 2.0, outerRadius, radius);
        }
        
        // Animation and timing
        float anim = u_moving * smoothstep(0.0, 0.2, u_stop_time);
        float fade = smoothstep(3.0, 0.0, u_stop_time);
        
        // Colors with mood variations
        vec3 innerColor = vec3(0.8, 0.3, 1.0); // Bright purple
        vec3 outerColor = vec3(0.6, 0.2, 0.9); // Darker purple
        vec3 centerColor = vec3(1.0, 0.8, 1.0); // Light pink
        vec3 stemColor = vec3(0.3, 0.8, 0.4); // Green
        
        // Add some color variation based on randomizer
        innerColor += 0.1 * vec3(u_stop_randomizer.x, u_stop_randomizer.y, 0.5);
        outerColor += 0.1 * vec3(u_stop_randomizer.y, 0.3, u_stop_randomizer.x);
        
        // Combine all elements
        vec3 color = texColor.rgb * u_clean;
        color += innerFlower * innerColor * u_speed * anim * fade;
        color += outerFlower * outerColor * u_speed * anim * fade * 0.7;
        color += center * centerColor * u_speed * anim * fade;
        color += stem * stemColor * u_speed * anim * fade * 0.5;
        
        // Add subtle glow
        float glow = smoothstep(outerRadius * 1.5, 0.0, radius) * 0.3 * anim * fade;
        color += glow * vec3(0.8, 0.4, 1.0);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function createPlane() {
      shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
          u_stop_time: { value: 0.0 },
          u_point: { value: new THREE.Vector2(pointer.x, pointer.y) },
          u_moving: { value: 0.0 },
          u_speed: { value: 0.0 },
          u_stop_randomizer: { value: new THREE.Vector2(Math.random(), Math.random()) },
          u_clean: { value: 0.98 },
          u_ratio: { value: window.innerWidth / window.innerHeight },
          u_texture: { value: null }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
      });
      
      basicMaterial = new THREE.MeshBasicMaterial();

      const planeGeometry = new THREE.PlaneGeometry(2, 2);
      const planeBasic = new THREE.Mesh(planeGeometry, basicMaterial);
      const planeShader = new THREE.Mesh(planeGeometry, shaderMaterial);
      sceneBasic.add(planeBasic);
      sceneShader.add(planeShader);
    }

    function render() {
      shaderMaterial.uniforms.u_point.value = new THREE.Vector2(pointer.x, 1 - pointer.y);
      shaderMaterial.uniforms.u_texture.value = renderTargets[0].texture;
      shaderMaterial.uniforms.u_ratio.value = window.innerWidth / window.innerHeight;
      
      if (pointer.moved) {
        shaderMaterial.uniforms.u_moving.value = 1.0;
        shaderMaterial.uniforms.u_stop_randomizer.value = new THREE.Vector2(Math.random(), Math.random());
        shaderMaterial.uniforms.u_stop_time.value = 0.0;
        pointer.moved = false;
      } else {
        shaderMaterial.uniforms.u_moving.value = 0.0;
      }
      
      shaderMaterial.uniforms.u_stop_time.value += clock.getDelta();
      shaderMaterial.uniforms.u_speed.value = pointer.speed;

      renderer.setRenderTarget(renderTargets[1]);
      renderer.render(sceneShader, camera);

      basicMaterial.map = renderTargets[1].texture;

      renderer.setRenderTarget(null);
      renderer.render(sceneBasic, camera);

      // Swap render targets
      const tmp = renderTargets[0];
      renderTargets[0] = renderTargets[1];
      renderTargets[1] = tmp;

      requestAnimationFrame(render);
    }

    function updateSize() {
      shaderMaterial.uniforms.u_ratio.value = window.innerWidth / window.innerHeight;
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Event listeners
    const handleMouseMove = (e: MouseEvent) => {
      if (pointer.drawingAllowed) {
        pointer.moved = true;
        const dx = 12 * (e.pageX / window.innerWidth - pointer.x);
        const dy = 12 * (e.pageY / window.innerHeight - pointer.y);
        pointer.x = e.pageX / window.innerWidth;
        pointer.y = e.pageY / window.innerHeight;
        pointer.speed = Math.min(2, Math.pow(dx, 2) + Math.pow(dy, 2));
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      pointer.moved = true;
      const dx = 5 * (e.targetTouches[0].pageX / window.innerWidth - pointer.x);
      const dy = 5 * (e.targetTouches[0].pageY / window.innerHeight - pointer.y);
      pointer.x = e.targetTouches[0].pageX / window.innerWidth;
      pointer.y = e.targetTouches[0].pageY / window.innerHeight;
      pointer.speed = Math.min(2, Math.pow(dx, 2) + Math.pow(dy, 2));
    };

    const handleResize = () => {
      updateSize();
    };

    // Initialize
    createPlane();
    updateSize();
    render();

    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("resize", handleResize);

    // Auto-draw beautiful flower patterns
    const autoDrawInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        // Create flower clusters
        const centerX = 0.3 + Math.random() * 0.4;
        const centerY = 0.3 + Math.random() * 0.4;
        
        // Draw multiple flowers in a cluster
        for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
          setTimeout(() => {
            pointer.x = centerX + (Math.random() - 0.5) * 0.2;
            pointer.y = centerY + (Math.random() - 0.5) * 0.2;
            pointer.moved = true;
            pointer.speed = 0.8 + Math.random() * 0.4;
          }, i * 200);
        }
      }
    }, 1500);

    return () => {
      // Cleanup
      clearInterval(autoDrawInterval);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      
      // Dispose of Three.js resources
      renderer.dispose();
      renderTargets.forEach(target => target.dispose());
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
}
