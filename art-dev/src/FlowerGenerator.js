import * as THREE from 'three';

export class FlowerGenerator {
    constructor() {
        this.materials = this.createMaterials();
    }
    
    createMaterials() {
        return {
            // Core materials
            core: new THREE.MeshPhongMaterial({ 
                color: 0xFFD700, 
                shininess: 100,
                emissive: 0x332200
            }),
            
            // Petal materials based on mood
            petals: {
                calm: new THREE.MeshPhongMaterial({ 
                    color: 0x87CEEB, 
                    shininess: 50,
                    transparent: true,
                    opacity: 0.9
                }),
                happy: new THREE.MeshPhongMaterial({ 
                    color: 0xFFD700, 
                    shininess: 80,
                    emissive: 0x332200
                }),
                excited: new THREE.MeshPhongMaterial({ 
                    color: 0xFF6B6B, 
                    shininess: 100,
                    emissive: 0x330000
                }),
                angry: new THREE.MeshPhongMaterial({ 
                    color: 0x8B0000, 
                    shininess: 30,
                    emissive: 0x220000
                }),
                sad: new THREE.MeshPhongMaterial({ 
                    color: 0x4B0082, 
                    shininess: 20,
                    transparent: true,
                    opacity: 0.7
                })
            },
            
            // Stem material
            stem: new THREE.MeshPhongMaterial({ 
                color: 0x228B22, 
                shininess: 30
            }),
            
            // Leaf material
            leaf: new THREE.MeshPhongMaterial({ 
                color: 0x32CD32, 
                shininess: 40
            })
        };
    }
    
    generateFlower(moodLevel, flowerType) {
        const flowerGroup = new THREE.Group();
        
        // Generate based on flower type
        switch (flowerType) {
            case 'sunflower':
                this.generateSunflower(flowerGroup, moodLevel);
                break;
            case 'rose':
                this.generateRose(flowerGroup, moodLevel);
                break;
            case 'lotus':
                this.generateLotus(flowerGroup, moodLevel);
                break;
            case 'tulip':
                this.generateTulip(flowerGroup, moodLevel);
                break;
            default:
                this.generateSunflower(flowerGroup, moodLevel);
        }
        
        return flowerGroup;
    }
    
    generateSunflower(flowerGroup, moodLevel) {
        // Core
        const coreGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const core = new THREE.Mesh(coreGeometry, this.materials.core);
        flowerGroup.add(core);
        
        // Petals based on mood
        const petalCount = this.getPetalCount(moodLevel);
        const petalMaterial = this.getPetalMaterial(moodLevel);
        
        for (let i = 0; i < petalCount; i++) {
            const angle = (i / petalCount) * Math.PI * 2;
            const petalGeometry = this.createPetalGeometry(moodLevel);
            const petal = new THREE.Mesh(petalGeometry, petalMaterial);
            
            petal.position.set(
                Math.cos(angle) * 0.5,
                Math.sin(angle) * 0.5,
                0
            );
            petal.rotation.z = angle;
            petal.rotation.y = Math.PI / 2;
            
            flowerGroup.add(petal);
        }
        
        // Stem
        const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
        const stem = new THREE.Mesh(stemGeometry, this.materials.stem);
        stem.position.y = -1.5;
        flowerGroup.add(stem);
        
        // Leaves
        this.addLeaves(flowerGroup, moodLevel);
    }
    
    generateRose(flowerGroup, moodLevel) {
        // Multiple layers of petals
        const layers = Math.max(3, Math.floor(moodLevel / 2));
        const petalMaterial = this.getPetalMaterial(moodLevel);
        
        for (let layer = 0; layer < layers; layer++) {
            const petalCount = 8 + layer * 4;
            const radius = 0.2 + layer * 0.15;
            const height = layer * 0.1;
            
            for (let i = 0; i < petalCount; i++) {
                const angle = (i / petalCount) * Math.PI * 2;
                const petalGeometry = this.createRosePetalGeometry(moodLevel);
                const petal = new THREE.Mesh(petalGeometry, petalMaterial);
                
                petal.position.set(
                    Math.cos(angle) * radius,
                    Math.sin(angle) * radius,
                    height
                );
                petal.rotation.z = angle;
                petal.rotation.y = Math.PI / 2;
                petal.rotation.x = Math.PI / 4;
                
                flowerGroup.add(petal);
            }
        }
        
        // Stem with thorns
        const stemGeometry = new THREE.CylinderGeometry(0.03, 0.03, 2, 8);
        const stem = new THREE.Mesh(stemGeometry, this.materials.stem);
        stem.position.y = -1.5;
        flowerGroup.add(stem);
        
        this.addThorns(flowerGroup);
    }
    
    generateLotus(flowerGroup, moodLevel) {
        // Large, flat petals in layers
        const layers = 3;
        const petalMaterial = this.getPetalMaterial(moodLevel);
        
        for (let layer = 0; layer < layers; layer++) {
            const petalCount = 8;
            const radius = 0.4 + layer * 0.2;
            const height = layer * 0.05;
            
            for (let i = 0; i < petalCount; i++) {
                const angle = (i / petalCount) * Math.PI * 2;
                const petalGeometry = this.createLotusPetalGeometry(moodLevel);
                const petal = new THREE.Mesh(petalGeometry, petalMaterial);
                
                petal.position.set(
                    Math.cos(angle) * radius,
                    Math.sin(angle) * radius,
                    height
                );
                petal.rotation.z = angle;
                petal.rotation.y = Math.PI / 2;
                
                flowerGroup.add(petal);
            }
        }
        
        // Center bud
        const budGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const bud = new THREE.Mesh(budGeometry, this.materials.core);
        bud.position.z = 0.1;
        flowerGroup.add(bud);
    }
    
    generateTulip(flowerGroup, moodLevel) {
        // Cup-shaped petals
        const petalCount = 6;
        const petalMaterial = this.getPetalMaterial(moodLevel);
        
        for (let i = 0; i < petalCount; i++) {
            const angle = (i / petalCount) * Math.PI * 2;
            const petalGeometry = this.createTulipPetalGeometry(moodLevel);
            const petal = new THREE.Mesh(petalGeometry, petalMaterial);
            
            petal.position.set(
                Math.cos(angle) * 0.3,
                Math.sin(angle) * 0.3,
                0
            );
            petal.rotation.z = angle;
            petal.rotation.y = Math.PI / 2;
            
            flowerGroup.add(petal);
        }
        
        // Stem
        const stemGeometry = new THREE.CylinderGeometry(0.04, 0.04, 2, 8);
        const stem = new THREE.Mesh(stemGeometry, this.materials.stem);
        stem.position.y = -1.5;
        flowerGroup.add(stem);
        
        // Leaves
        this.addLeaves(flowerGroup, moodLevel);
    }
    
    getPetalCount(moodLevel) {
        // More petals for higher energy moods
        return Math.max(8, Math.min(24, 8 + moodLevel * 2));
    }
    
    getPetalMaterial(moodLevel) {
        if (moodLevel <= 2) return this.materials.petals.sad;
        if (moodLevel <= 4) return this.materials.petals.calm;
        if (moodLevel <= 6) return this.materials.petals.happy;
        if (moodLevel <= 8) return this.materials.petals.excited;
        return this.materials.petals.angry;
    }
    
    createPetalGeometry(moodLevel) {
        const width = 0.1 + (moodLevel * 0.02);
        const height = 0.3 + (moodLevel * 0.05);
        const depth = 0.02;
        
        return new THREE.BoxGeometry(width, height, depth);
    }
    
    createRosePetalGeometry(moodLevel) {
        const width = 0.08 + (moodLevel * 0.01);
        const height = 0.25 + (moodLevel * 0.03);
        const depth = 0.01;
        
        return new THREE.BoxGeometry(width, height, depth);
    }
    
    createLotusPetalGeometry(moodLevel) {
        const width = 0.15 + (moodLevel * 0.02);
        const height = 0.4 + (moodLevel * 0.05);
        const depth = 0.01;
        
        return new THREE.BoxGeometry(width, height, depth);
    }
    
    createTulipPetalGeometry(moodLevel) {
        const width = 0.12 + (moodLevel * 0.015);
        const height = 0.35 + (moodLevel * 0.04);
        const depth = 0.015;
        
        return new THREE.BoxGeometry(width, height, depth);
    }
    
    addLeaves(flowerGroup, moodLevel) {
        const leafCount = Math.max(2, Math.floor(moodLevel / 3));
        
        for (let i = 0; i < leafCount; i++) {
            const angle = (i / leafCount) * Math.PI * 2;
            const leafGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.01);
            const leaf = new THREE.Mesh(leafGeometry, this.materials.leaf);
            
            leaf.position.set(
                Math.cos(angle) * 0.8,
                Math.sin(angle) * 0.8,
                -0.5
            );
            leaf.rotation.z = angle;
            leaf.rotation.y = Math.PI / 2;
            
            flowerGroup.add(leaf);
        }
    }
    
    addThorns(flowerGroup) {
        const thornCount = 8;
        
        for (let i = 0; i < thornCount; i++) {
            const angle = (i / thornCount) * Math.PI * 2;
            const thornGeometry = new THREE.ConeGeometry(0.02, 0.1, 4);
            const thorn = new THREE.Mesh(thornGeometry, this.materials.stem);
            
            thorn.position.set(
                Math.cos(angle) * 0.04,
                Math.sin(angle) * 0.04,
                -0.5 - (i * 0.2)
            );
            thorn.rotation.z = angle;
            thorn.rotation.x = Math.PI / 2;
            
            flowerGroup.add(thorn);
        }
    }
}
