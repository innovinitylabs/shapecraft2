import * as THREE from 'three';

// Shader for flat, outlined style matching the image
const flatVertexShader = `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    
    void main() {
        vNormal = normalize(normalMatrix * normal);
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const flatFragmentShader = `
    uniform vec3 uColor;
    uniform vec3 uOutlineColor;
    uniform float uOutlineWidth;
    
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    
    void main() {
        vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
        float fresnel = dot(viewDirection, vNormal);
        
        // Create sharp black outline
        float outline = step(0.4, 1.0 - fresnel);
        
        vec3 finalColor = mix(uColor, uOutlineColor, outline);
        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

class StylizedFlower {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.createFlower();
        scene.add(this.group);
    }
    
    createFlower() {
        // Create flower bloom (orange multi-petaled)
        this.createBloom();
        
        // Create stem (yellow-green)
        this.createStem();
        
        // Create leaves (5 leaves positioned as in image)
        this.createLeaves();
    }
    
    createBloom() {
        const bloomGroup = new THREE.Group();
        
        // Create petals in layers - outer petals first, then inner
        // Outer layer - larger petals
        const outerPetalCount = 8;
        for (let i = 0; i < outerPetalCount; i++) {
            const angle = (i / outerPetalCount) * Math.PI * 2;
            const petal = this.createPetal(0.5, 0.35, false);
            
            // Position petals in a circle, slightly overlapping
            const radius = 0.45;
            petal.position.x = Math.cos(angle) * radius;
            petal.position.z = Math.sin(angle) * radius * 0.3; // Flatten for 2D look
            petal.rotation.y = angle;
            petal.rotation.x = -Math.PI / 2; // Face camera
            
            bloomGroup.add(petal);
        }
        
        // Middle layer - medium petals
        const middlePetalCount = 6;
        for (let i = 0; i < middlePetalCount; i++) {
            const angle = (i / middlePetalCount) * Math.PI * 2 + Math.PI / middlePetalCount;
            const petal = this.createPetal(0.4, 0.3, false);
            
            const radius = 0.3;
            petal.position.x = Math.cos(angle) * radius;
            petal.position.z = Math.sin(angle) * radius * 0.2;
            petal.rotation.y = angle;
            petal.rotation.x = -Math.PI / 2;
            
            bloomGroup.add(petal);
        }
        
        // Inner layer - smaller, darker petals
        const innerPetalCount = 4;
        for (let i = 0; i < innerPetalCount; i++) {
            const angle = (i / innerPetalCount) * Math.PI * 2;
            const petal = this.createPetal(0.3, 0.25, true);
            
            const radius = 0.15;
            petal.position.x = Math.cos(angle) * radius;
            petal.position.z = Math.sin(angle) * radius * 0.1;
            petal.rotation.y = angle;
            petal.rotation.x = -Math.PI / 2;
            
            bloomGroup.add(petal);
        }
        
        bloomGroup.position.y = 2.2;
        bloomGroup.rotation.x = Math.PI / 2; // Rotate to face forward
        this.group.add(bloomGroup);
    }
    
    createPetal(width, height, isInner) {
        const shape = new THREE.Shape();
        
        // Create petal shape - oval/teardrop
        shape.moveTo(0, -height / 2);
        shape.quadraticCurveTo(width / 2, -height / 4, width / 2, 0);
        shape.quadraticCurveTo(width / 2, height / 4, 0, height / 2);
        shape.quadraticCurveTo(-width / 2, height / 4, -width / 2, 0);
        shape.quadraticCurveTo(-width / 2, -height / 4, 0, -height / 2);
        
        const extrudeSettings = {
            depth: 0.001, // Very thin for flat look
            bevelEnabled: false
        };
        
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        
        // Orange colors - darker for inner petals
        const outerColor = new THREE.Color(0xffa366); // Lighter orange
        const innerColor = new THREE.Color(0xff8c42); // Darker orange
        const color = isInner ? innerColor : outerColor;
        
        const material = new THREE.ShaderMaterial({
            vertexShader: flatVertexShader,
            fragmentShader: flatFragmentShader,
            uniforms: {
                uColor: { value: color },
                uOutlineColor: { value: new THREE.Color(0x000000) },
                uOutlineWidth: { value: 0.1 },
                cameraPosition: { value: new THREE.Vector3() }
            },
            side: THREE.DoubleSide
        });
        
        const petal = new THREE.Mesh(geometry, material);
        return petal;
    }
    
    createStem() {
        // Main stem - very thin cylinder
        const stemGeometry = new THREE.CylinderGeometry(0.025, 0.03, 2.2, 8);
        const stemMaterial = new THREE.ShaderMaterial({
            vertexShader: flatVertexShader,
            fragmentShader: flatFragmentShader,
            uniforms: {
                uColor: { value: new THREE.Color(0xd4e8a0) }, // Pale yellow-green
                uOutlineColor: { value: new THREE.Color(0x000000) },
                uOutlineWidth: { value: 0.1 },
                cameraPosition: { value: new THREE.Vector3() }
            },
            side: THREE.DoubleSide
        });
        
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = 1.1;
        this.group.add(stem);
    }
    
    createLeaves() {
        // Five leaves positioned as in the image
        const leafPositions = [
            { y: 1.95, x: -0.12, rotationZ: -0.4, rotationY: 0.2 }, // Upper left
            { y: 1.85, x: 0.12, rotationZ: 0.5, rotationY: -0.2 },  // Upper right
            { y: 1.25, x: -0.1, rotationZ: -0.3, rotationY: 0.15 }, // Middle left
            { y: 1.15, x: 0.1, rotationZ: 0.4, rotationY: -0.15 },  // Middle right
            { y: 0.25, x: -0.08, rotationZ: -0.25, rotationY: 0.1 } // Lower left
        ];
        
        leafPositions.forEach((pos) => {
            const leaf = this.createLeaf();
            leaf.position.y = pos.y;
            leaf.position.x = pos.x;
            leaf.rotation.z = pos.rotationZ;
            leaf.rotation.y = pos.rotationY;
            this.group.add(leaf);
        });
    }
    
    createLeaf() {
        const shape = new THREE.Shape();
        const width = 0.2;
        const height = 0.35;
        
        // Create leaf shape - oval with pointed tip
        shape.moveTo(0, -height / 2);
        shape.quadraticCurveTo(width / 2, -height / 4, width / 2, 0);
        shape.quadraticCurveTo(width / 2, height / 4, 0, height / 2);
        shape.quadraticCurveTo(-width / 2, height / 4, -width / 2, 0);
        shape.quadraticCurveTo(-width / 2, -height / 4, 0, -height / 2);
        
        const extrudeSettings = {
            depth: 0.001,
            bevelEnabled: false
        };
        
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        
        const material = new THREE.ShaderMaterial({
            vertexShader: flatVertexShader,
            fragmentShader: flatFragmentShader,
            uniforms: {
                uColor: { value: new THREE.Color(0xd4e8a0) }, // Same as stem
                uOutlineColor: { value: new THREE.Color(0x000000) },
                uOutlineWidth: { value: 0.1 },
                cameraPosition: { value: new THREE.Vector3() }
            },
            side: THREE.DoubleSide
        });
        
        const leaf = new THREE.Mesh(geometry, material);
        
        // Add leaf vein - simple black line
        const veinGeometry = new THREE.PlaneGeometry(0.008, height * 0.7);
        const veinMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x000000,
            transparent: true,
            opacity: 0.4
        });
        const vein = new THREE.Mesh(veinGeometry, veinMaterial);
        vein.rotation.x = Math.PI / 2;
        vein.position.z = 0.001;
        leaf.add(vein);
        
        return leaf;
    }
}

// Background shader for textured look
const backgroundVertexShader = `
    varying vec2 vUv;
    
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const backgroundFragmentShader = `
    uniform vec3 uColor;
    uniform float uTime;
    
    varying vec2 vUv;
    
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    
    float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    
    void main() {
        vec2 st = vUv * 300.0;
        float n = noise(st);
        
        // Subtle grainy texture
        float grain = random(vUv + uTime * 0.1) * 0.015;
        
        vec3 color = uColor + vec3(n * 0.02 + grain);
        gl_FragColor = vec4(color, 1.0);
    }
`;

// Initialize scene
const scene = new THREE.Scene();

// Create textured background plane
const backgroundGeometry = new THREE.PlaneGeometry(20, 20);
const backgroundMaterial = new THREE.ShaderMaterial({
    vertexShader: backgroundVertexShader,
    fragmentShader: backgroundFragmentShader,
    uniforms: {
        uColor: { value: new THREE.Color(0xe8f4f8) }, // Light blue
        uTime: { value: 0 }
    },
    side: THREE.DoubleSide
});

const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
background.position.z = -8;
scene.add(background);

// Use orthographic camera for flat, 2D look
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(
    -aspect * 3, aspect * 3, 3, -3, 0.1, 100
);
camera.position.set(0, 1.5, 5);
camera.lookAt(0, 1.5, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Flat lighting - no shadows, just ambient
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

// Create flower
const flower = new StylizedFlower(scene);

// Update camera position in shaders
function updateCameraPosition() {
    scene.traverse((child) => {
        if (child.isMesh && child.material.uniforms && child.material.uniforms.cameraPosition) {
            child.material.uniforms.cameraPosition.value.copy(camera.position);
        }
    });
}

// Animation loop
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.01;
    
    // Update background shader
    backgroundMaterial.uniforms.uTime.value = time;
    
    updateCameraPosition();
    
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight;
    camera.left = -aspect * 3;
    camera.right = aspect * 3;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
