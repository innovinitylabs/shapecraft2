# 🌻 Shapes of Mind - Living NFT Flowers

A revolutionary generative NFT collection where each flower is a living entity that reflects your mood and the collective consciousness of the community. Built for Shape L2 with completely on-chain art generation and innovative gas-back rewards.

## ✨ Features

### 🌸 Living Art System
- **Dynamic Mood-Based Evolution**: Flowers change appearance based on your 1-10 mood slider
- **Pingala Sequences**: Petal distribution follows ancient mathematical patterns
- **Multi-Layered Design**: Core shapes, ring layers, and glow effects create unique combinations
- **Real-Time 3D Rendering**: Beautiful Three.js visualizations with smooth animations

### 🧠 Collective Consciousness
- **Community Mood Integration**: Flower cores reflect average community sentiment
- **On-Chain Signal Rings**: Visual ripples from Shape L2 events and interactions
- **Trading Activity Heartbeat**: Animation BPM scales with marketplace activity

### 💎 Rarity & Traits System
- **Core Shapes**: Circle, Hexagon, Star, Spiral (with rarity distribution)
- **Petal Count**: 5-15 petals with Pingala sequence variations
- **Ring Layers**: 1-5 concentric rings for visual depth
- **Glow Intensity**: 1-10 levels affecting luminosity and effects
- **Rarity Tiers**: Common to Legendary with marketplace integration

### ⚡ Gas-Back Innovation
- **50% Gas Refunds**: Automatic treasury-funded rewards for interactions
- **Mood Updates**: Get rewarded for emotional engagement
- **Naming Rights**: Gas back for personalizing your flowers
- **Sustainable Treasury**: Funded by mint proceeds and secondary royalties

### 📊 Mood History & Analytics
- **Emotional Journey Tracking**: Complete timeline of mood changes
- **Name Evolution**: Historical record of flower naming
- **Visual Storytelling**: See how your flower has grown over time

## 🛠 Tech Stack

### Smart Contracts
- **Solidity 0.8.24**: Modern, secure contract development
- **ERC-721**: Standard NFT implementation with extensions
- **EIP-2981**: Royalty enforcement for secondary sales
- **Shape L2**: Optimized for low fees and high performance

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Three.js**: 3D graphics and animations
- **Framer Motion**: Smooth UI animations
- **Tailwind CSS**: Utility-first styling

### Blockchain Integration
- **Wagmi**: React hooks for Ethereum
- **RainbowKit**: Wallet connection UI
- **Viem**: TypeScript interface for Ethereum
- **Hardhat**: Development and deployment

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or compatible wallet

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/shapes-of-mind.git
cd shapes-of-mind
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_SHAPE_L2_RPC_URL=your_shape_l2_rpc_url
PRIVATE_KEY=your_deployment_private_key
```

4. **Compile smart contracts**
```bash
npx hardhat compile
```

5. **Deploy to Shape L2**
```bash
npx hardhat run scripts/deploy.ts --network shapeL2
```

6. **Start the development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🎨 Art System Architecture

### Flower Generation Algorithm
```typescript
// Pingala sequence for petal distribution
const generatePingalaSequence = (n: number): number[] => {
  const sequence = [1, 1];
  for (let i = 2; i < n; i++) {
    sequence.push(sequence[i - 1] + sequence[i - 2]);
  }
  return sequence;
};

// Mood-based color mapping
const getMoodColor = (mood: number): string => {
  if (mood <= 2) return '#4A90E2'; // Blue - Sad
  if (mood <= 4) return '#7ED321'; // Green - Calm
  if (mood <= 6) return '#F5A623'; // Orange - Neutral
  if (mood <= 8) return '#FF6B6B'; // Red - Excited
  return '#FFD700'; // Gold - Joy
};
```

### On-Chain SVG Generation
The smart contract generates SVG art directly on-chain using:
- **Base64 Encoding**: Efficient metadata storage
- **Dynamic Parameters**: Mood, traits, and time-based variations
- **Optimized Geometry**: Minimal gas usage for complex shapes

## 📱 User Experience

### Minting Flow
1. Connect wallet to Shape L2
2. Preview flower with live 3D rendering
3. Adjust mood slider to see variations
4. Mint with one-click transaction
5. Receive gas-back reward

### Flower Management
1. View collection in personal gallery
2. Update mood with Apple Health-style slider
3. Rename flowers with on-chain storage
4. Track emotional journey over time
5. Earn rewards for engagement

### Community Features
- **Collective Mood Visualization**: See community sentiment
- **Trading Activity Integration**: Real-time marketplace pulse
- **Gas-Back Transparency**: Clear reward system
- **Rarity Discovery**: Trait-based rarity calculations

## 🔧 Smart Contract Features

### Core Functions
```solidity
// Mint new flower
function mint() external payable

// Update flower mood
function setMood(uint256 tokenId, uint8 moodValue) external

// Rename flower
function renameNFT(uint256 tokenId, string calldata newName) external

// Get mood history
function getMoodHistory(uint256 tokenId) external view returns (Mood[] memory)

// Gas back mechanism
function _issueGasBack(address user) internal
```

### Treasury Management
- **Automatic Funding**: Mint proceeds and royalties
- **Gas-Back Distribution**: 50% refund on interactions
- **Owner Controls**: Treasury management functions
- **Transparency**: Public treasury balance tracking

## 🎯 Shape L2 Integration

### Optimizations
- **Low Gas Fees**: Leverage Shape L2's cost efficiency
- **Fast Transactions**: Quick mood updates and interactions
- **Scalability**: Handle high interaction volumes
- **Event Integration**: Shape MCP events trigger visual effects

### Unique Features
- **Account Abstraction**: Enhanced user experience
- **Gas Sponsorship**: Shape L2's gas optimization
- **Cross-Chain Compatibility**: Future expansion possibilities

## 📊 Collection Statistics

- **Total Supply**: 1,111 flowers
- **Mint Price**: TBD (0.01 ETH equivalent)
- **Max Per Wallet**: 5 flowers
- **Gas Back**: 50% of interaction costs
- **Royalties**: 5% on secondary sales

## 🏆 Judging Criteria Alignment

### Innovation (30%)
- First NFT system with live generative flowers reflecting personal + collective mood
- Pingala sequence integration for mathematical beauty
- Gas-back mechanism for sustainable engagement

### AI Effectiveness (25%)
- Mood slider with AI-smoothed transitions
- Dynamic adaptation to on-chain signals
- Intelligent rarity distribution

### Technical Excellence (20%)
- Complete on-chain art generation
- Three.js real-time rendering
- Shape L2 optimization
- Gas-back treasury system

### Impact (15%)
- Emotional connection through living art
- Incentivized engagement model
- Community-driven evolution

### UX/Polish (5%)
- Apple Health-inspired mood interface
- Smooth 3D animations
- Intuitive wallet integration

### Presentation (5%)
- Beautiful landing page with live demos
- Comprehensive documentation
- Clear value proposition

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- **Shape L2 Team**: For the innovative L2 solution
- **Three.js Community**: For amazing 3D graphics tools
- **OpenZeppelin**: For secure smart contract libraries
- **Pingala**: Ancient mathematician who inspired our petal sequences

## 📞 Contact

- **Website**: [shapesofmind.art](https://shapesofmind.art)
- **Twitter**: [@ShapesOfMindNFT](https://twitter.com/ShapesOfMindNFT)
- **Discord**: [Join our community](https://discord.gg/shapesofmind)

---

*Shapes of Mind - Where emotions bloom on the blockchain* 🌻✨
