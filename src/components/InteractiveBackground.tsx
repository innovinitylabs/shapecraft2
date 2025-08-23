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

    // Fragment shader for flower drawing
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
      
      void main() {
        vec2 uv = vUv;
        vec4 texColor = texture2D(u_texture, uv);
        
        // Calculate distance from current point
        vec2 point = u_point;
        float dist = distance(uv, point);
        
        // Flower parameters
        float petalCount = 8.0;
        float petalLength = 0.1;
        float petalWidth = 0.02;
        
        // Create flower shape
        float angle = atan(uv.y - point.y, uv.x - point.x);
        float radius = dist;
        
        // Petal effect
        float petal = sin(angle * petalCount + u_stop_randomizer.x * 10.0);
        petal = smoothstep(0.0, 0.5, petal);
        
        // Flower shape
        float flower = smoothstep(petalLength, 0.0, radius) * petal;
        flower *= smoothstep(petalWidth, 0.0, abs(radius - petalLength * 0.5));
        
        // Center of flower
        float center = smoothstep(0.05, 0.0, radius);
        
        // Color based on mood (purple theme for Shapes of Mind)
        vec3 flowerColor = vec3(0.5, 0.2, 0.8); // Purple
        vec3 centerColor = vec3(0.8, 0.4, 1.0); // Light purple
        
        // Animation
        float anim = u_moving * smoothstep(0.0, 0.1, u_stop_time);
        flower *= anim;
        center *= anim;
        
        // Combine with existing texture
        vec3 color = texColor.rgb * u_clean;
        color += flower * flowerColor * u_speed;
        color += center * centerColor * u_speed;
        
        // Fade out over time
        float fade = smoothstep(2.0, 0.0, u_stop_time);
        color *= fade;
        
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

    // Auto-draw some flowers
    const autoDrawInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        pointer.x = Math.random();
        pointer.y = Math.random();
        pointer.moved = true;
        pointer.speed = 0.5 + Math.random() * 0.5;
      }
    }, 2000);

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
