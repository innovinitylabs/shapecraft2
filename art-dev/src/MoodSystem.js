export class MoodSystem {
    constructor() {
        this.moodColors = this.initializeMoodColors();
        this.moodEffects = this.initializeMoodEffects();
    }
    
    initializeMoodColors() {
        return {
            1: { // Very Sad
                primary: 0x4B0082,    // Deep Purple
                secondary: 0x2E0854,   // Darker Purple
                accent: 0x8A2BE2,      // Blue Violet
                glow: 0x1a0033
            },
            2: { // Sad
                primary: 0x6A5ACD,    // Slate Blue
                secondary: 0x483D8B,   // Dark Slate Blue
                accent: 0x9370DB,      // Medium Purple
                glow: 0x2a1a4a
            },
            3: { // Melancholy
                primary: 0x4682B4,    // Steel Blue
                secondary: 0x2F4F4F,   // Dark Slate Gray
                accent: 0x87CEEB,      // Sky Blue
                glow: 0x1a2a3a
            },
            4: { // Calm
                primary: 0x87CEEB,    // Sky Blue
                secondary: 0x5F9EA0,   // Cadet Blue
                accent: 0xB0E0E6,      // Powder Blue
                glow: 0x2a4a5a
            },
            5: { // Neutral
                primary: 0x90EE90,    // Light Green
                secondary: 0x98FB98,   // Pale Green
                accent: 0x7CFC00,      // Lawn Green
                glow: 0x2a4a2a
            },
            6: { // Content
                primary: 0xFFD700,    // Gold
                secondary: 0xFFA500,   // Orange
                accent: 0xFF8C00,      // Dark Orange
                glow: 0x4a3a1a
            },
            7: { // Happy
                primary: 0xFF6B6B,    // Light Coral
                secondary: 0xFF4500,   // Orange Red
                accent: 0xFF6347,      // Tomato
                glow: 0x4a1a1a
            },
            8: { // Excited
                primary: 0xFF1493,    // Deep Pink
                secondary: 0xFF69B4,   // Hot Pink
                accent: 0xFFB6C1,      // Light Pink
                glow: 0x4a1a3a
            },
            9: { // Very Excited
                primary: 0xFF0000,    // Red
                secondary: 0xFF4500,   // Orange Red
                accent: 0xFF6347,      // Tomato
                glow: 0x4a0000
            },
            10: { // Angry
                primary: 0x8B0000,    // Dark Red
                secondary: 0xDC143C,   // Crimson
                accent: 0xFF0000,      // Red
                glow: 0x2a0000
            }
        };
    }
    
    initializeMoodEffects() {
        return {
            1: { // Very Sad
                animationSpeed: 0.3,
                glowIntensity: 0.1,
                particleCount: 5,
                rotationSpeed: 0.2
            },
            2: { // Sad
                animationSpeed: 0.4,
                glowIntensity: 0.15,
                particleCount: 8,
                rotationSpeed: 0.3
            },
            3: { // Melancholy
                animationSpeed: 0.5,
                glowIntensity: 0.2,
                particleCount: 12,
                rotationSpeed: 0.4
            },
            4: { // Calm
                animationSpeed: 0.6,
                glowIntensity: 0.25,
                particleCount: 15,
                rotationSpeed: 0.5
            },
            5: { // Neutral
                animationSpeed: 0.7,
                glowIntensity: 0.3,
                particleCount: 18,
                rotationSpeed: 0.6
            },
            6: { // Content
                animationSpeed: 0.8,
                glowIntensity: 0.35,
                particleCount: 20,
                rotationSpeed: 0.7
            },
            7: { // Happy
                animationSpeed: 0.9,
                glowIntensity: 0.4,
                particleCount: 25,
                rotationSpeed: 0.8
            },
            8: { // Excited
                animationSpeed: 1.0,
                glowIntensity: 0.45,
                particleCount: 30,
                rotationSpeed: 0.9
            },
            9: { // Very Excited
                animationSpeed: 1.2,
                glowIntensity: 0.5,
                particleCount: 35,
                rotationSpeed: 1.0
            },
            10: { // Angry
                animationSpeed: 1.5,
                glowIntensity: 0.6,
                particleCount: 40,
                rotationSpeed: 1.2
            }
        };
    }
    
    getMoodColors(moodLevel) {
        return this.moodColors[moodLevel] || this.moodColors[5];
    }
    
    getMoodEffects(moodLevel) {
        return this.moodEffects[moodLevel] || this.moodEffects[5];
    }
    
    getMoodName(moodLevel) {
        const moodNames = {
            1: "Very Sad",
            2: "Sad", 
            3: "Melancholy",
            4: "Calm",
            5: "Neutral",
            6: "Content",
            7: "Happy",
            8: "Excited",
            9: "Very Excited",
            10: "Angry"
        };
        
        return moodNames[moodLevel] || "Neutral";
    }
    
    getMoodDescription(moodLevel) {
        const descriptions = {
            1: "Deep purple tones with slow, gentle movements",
            2: "Slate blue hues with melancholic animation",
            3: "Steel blue colors with thoughtful pacing",
            4: "Sky blue palette with peaceful, calm motion",
            5: "Light green tones with balanced, neutral energy",
            6: "Golden colors with content, warm vibes",
            7: "Coral and orange with happy, bright energy",
            8: "Pink tones with excited, vibrant movement",
            9: "Bright red with very excited, dynamic animation",
            10: "Dark red with intense, powerful energy"
        };
        
        return descriptions[moodLevel] || "Balanced, neutral energy";
    }
    
    // Convert hex color to RGB array
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.toString(16).padStart(6, '0'));
        return result ? [
            parseInt(result[1], 16) / 255,
            parseInt(result[2], 16) / 255,
            parseInt(result[3], 16) / 255
        ] : [0, 0, 0];
    }
    
    // Convert hex color to HSL
    hexToHsl(hex) {
        const rgb = this.hexToRgb(hex);
        const r = rgb[0];
        const g = rgb[1];
        const b = rgb[2];
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return [h * 360, s * 100, l * 100];
    }
    
    // Generate complementary color
    getComplementaryColor(hex) {
        const hsl = this.hexToHsl(hex);
        const complementaryHue = (hsl[0] + 180) % 360;
        return this.hslToHex(complementaryHue, hsl[1], hsl[2]);
    }
    
    // Convert HSL to Hex
    hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h * 6) % 2 - 1));
        const m = l - c / 2;
        let r = 0, g = 0, b = 0;
        
        if (0 <= h && h < 1/6) {
            r = c; g = x; b = 0;
        } else if (1/6 <= h && h < 1/3) {
            r = x; g = c; b = 0;
        } else if (1/3 <= h && h < 1/2) {
            r = 0; g = c; b = x;
        } else if (1/2 <= h && h < 2/3) {
            r = 0; g = x; b = c;
        } else if (2/3 <= h && h < 5/6) {
            r = x; g = 0; b = c;
        } else if (5/6 <= h && h <= 1) {
            r = c; g = 0; b = x;
        }
        
        const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
        const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
        const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');
        
        return parseInt(rHex + gHex + bHex, 16);
    }
}
