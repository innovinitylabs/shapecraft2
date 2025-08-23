# Shapes of Mind - Art Development Environment

A dedicated environment for developing and testing the generative flower art system for the Shapes of Mind NFT project.

## 🎨 Features

- **4 Flower Types**: Sunflower, Rose, Lotus, Tulip
- **Mood-Based Generation**: 10 different mood levels (1-10)
- **Real-time Controls**: Adjust mood, flower type, and animation speed
- **Export Functionality**: Save generated art as PNG
- **Performance Monitoring**: FPS counter and status display

## 🚀 Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Browser**:
   Navigate to `http://localhost:5173`

## 🎛️ Controls

### Mood Slider (1-10)
- **1-2**: Sad/Melancholy (Purple/Blue tones)
- **3-4**: Calm (Sky Blue)
- **5**: Neutral (Light Green)
- **6-7**: Happy/Content (Gold/Orange)
- **8-9**: Excited (Pink/Red)
- **10**: Angry (Dark Red)

### Flower Types
- **Sunflower**: Classic sunflower with many petals
- **Rose**: Multi-layered rose with thorns
- **Lotus**: Large, flat petals in layers
- **Tulip**: Cup-shaped petals

### Animation Speed
- Adjust the rotation and animation speed (0.1x - 2.0x)

## 🏗️ Architecture

### Core Classes

#### `ArtDevelopmentApp`
- Main application class
- Handles Three.js scene, camera, renderer
- Manages controls and animation loop

#### `FlowerGenerator`
- Generates different flower types
- Creates mood-based materials and geometries
- Handles petal count, colors, and effects

#### `MoodSystem`
- Manages mood-based color schemes
- Provides mood names and descriptions
- Handles color conversions and effects

### File Structure
```
art-dev/
├── index.html          # Main HTML file
├── package.json        # Dependencies
├── README.md          # This file
└── src/
    ├── main.js        # Main application
    ├── FlowerGenerator.js  # Flower generation logic
    └── MoodSystem.js  # Mood-based systems
```

## 🎯 Development Goals

### Phase 1: Basic Flower Generation ✅
- [x] Multiple flower types
- [x] Mood-based colors
- [x] Basic animations
- [x] Export functionality

### Phase 2: Advanced Features 🚧
- [ ] Particle effects
- [ ] Glow effects
- [ ] More complex geometries
- [ ] Texture mapping

### Phase 3: Integration 🚧
- [ ] Export to main project
- [ ] React component conversion
- [ ] Performance optimization
- [ ] Mobile responsiveness

## 🔧 Technical Details

### Dependencies
- **Three.js**: 3D graphics and rendering
- **Vite**: Fast development server and build tool

### Performance
- Target: 60 FPS
- Optimized for real-time generation
- Memory-efficient flower creation

### Export Quality
- High-resolution PNG export
- Maintains 3D quality in 2D format
- Suitable for NFT metadata

## 🚀 Next Steps

1. **Test different flower types** with various moods
2. **Experiment with geometries** and materials
3. **Add particle effects** for enhanced visuals
4. **Optimize performance** for mobile devices
5. **Integrate with main project** when ready

## 📝 Notes

- This is a development environment - changes here will be integrated into the main project
- All art generation is deterministic based on mood and flower type
- Export functionality creates high-quality images suitable for NFT metadata
- Performance monitoring helps identify optimization opportunities

---

**Happy Flower Generation! 🌸✨**
