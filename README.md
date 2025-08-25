# 🌻 Shapes of Mind - Living NFT Flowers

A revolutionary generative NFT collection where each flower is a living entity that reflects your mood and the collective consciousness of the community. Built for Shape L2 with completely on-chain art generation and innovative gas-back rewards.


 ### 🌸 [Demo Site](shapes-of-mind.vercel.app) 🌸

## ✨ **Latest Project Vision**

[✨ **Initial Project Vision**](https://github.com/innovinitylabs/shapecraft2/blob/main/MoodRingFlower_Project.md)

### 🌸 **Living Art Revolution**
Shapes of Mind represents a paradigm shift in NFT art - where each flower is not just a static image, but a living, breathing entity that evolves with your emotions and the collective mood of our community. Our flowers are powered by AI mood analysis and rendered in stunning 3D using Three.js, creating a truly unique and personal art experience.

### 🧠 **AI-Powered Emotional Intelligence**
- **Real-time Mood Analysis**: Advanced AI classifier that understands your emotional state from text
- **Dynamic Visual Evolution**: Flowers change color, shape, and animation based on your mood
- **Community Consciousness**: Flowers respond to collective community sentiment
- **Streak-Based Features**: Bee animations unlock with consistent positive moods

### 💎 **Innovative NFT Economics**
- **Gas-Back Rewards**: 80% gas refunds on Shape L2 for user engagement, which will be used to subsidise mood updating, so there's less friction in using this as mood tracker
- **Dynamic Rarity**: A community-driven uniqueness system based on mood scores. There is no traditional rarity, since rarity often creates unnecessary stress among collectors. Instead, every artwork is unique, just as every human being is unique in their own way. Rarity is replaced by user streaks, which act as a leaderboard — rewarding users for maintaining a positive mindset.
- **Living Metadata**: On-chain art that reads contract data for real-time updates (WIP)
- **Single Art Storage**: Efficient on-chain HTML art with versioning capabilities (or stored in transaction to reduce smartcontract bulk Considering using ZK in the future for privacy, have to do feasibility check)
- **Mood Journal**: Post mood update the user will get an image with what they wrote, their score and their flower snapshot which they can store as their mood journal. no data stored (except values on chain for streaks and animation) for privacy. (still brainstorming)

### 🐝 Bee mechanics in adherence with Ayurveda

1. Why Days Matter in Ayurveda and Mind Cycles
	-	Ayurveda often talks about “dinacharya” (daily rhythm) and “rutucharya” (seasonal rhythm).
	-	Transformation in body and mind is usually discussed in multiples of 3, 7, 14, and 21 days:
	-	3 days: First shift in manas (mind) is felt. Mood, sleep, and digestion show noticeable changes. Ayurveda says agni (digestive fire) can be influenced within this span.
	-	7 days (saptaha): A full cycle for subtle changes in the body’s tissues (dhatus) and mind. Often considered the minimum time to notice mental clarity or stability in positive habits.
	-	14 days (paksha): Half a lunar cycle. Mood and mental health in Ayurveda are deeply tied to the moon’s influence (chandra governs the mind). Two weeks of steadiness often mark deeper balance.
	-	21 days: Traditionally seen as a threshold for rewiring tendencies (modern psychology mirrors this with “habit formation” cycles). After this, a mental habit is considered stable.

⸻

2. Mapping That Onto Your Bee

The bee wont appear too easily (otherwise the act loses meaning) but also not be locked away behind impossible discipline.

	-	Minimum days for bee to appear (hover near flower): 3–7 days
	-	3 days: acknowledges immediate effort; encourages continuation.
	-	7 days: honors a saptaha cycle, deeper than a “just tried a little.”
	-   14 days: symbolizes balance across a lunar phase. The mind stabilizes across waxing and waning energies. Bee Hovers a bit closer too center
	-	21 days: completion of a full transformation cycle, a truly strong mental victory. Bee sits on center of the flower.

(Optional idea)
	-	14 days = bee lands at the petal edges. (write mesh detection code)
	-	21 days = bee rests right at the center (bindu) of the flower, merging with the soul/essence.

## 🚀 **Current Implementation Status**

### ✅ **Completed Features**

#### **Smart Contract (100% Complete)** (Redoing web3 ideas now to implement all the feasible ideas)
- **ShapeL2FlowerMoodJournal.sol**: 623 lines of optimized Solidity code 
- **Gas Optimization**: 31.4% of block limit (3,763,106 gas)
- **Storage Efficiency**: 60-97% savings with packed structs
- **25/25 Tests Passing**: Comprehensive test coverage
- **Ready for Deployment**: Fully tested and optimized for Shape L2
- https://sepolia.shapescan.xyz/address/0x5Fb9310C998cC608226316F521D6d25E97E4B78A

#### **Frontend (90% Complete)**
- **Beautiful 3D Art**: Working Three.js flower rendering with OrbitControls
- **Mood Classifier Integration**: AI-powered emotion analysis
- **Web3 Integration**: Wagmi v2 + RainbowKit wallet connection (this works in local)
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Dynamic flower evolution based on mood
- **Beetifull bee**: spent hours building this bugger with code 🥰


- **On-chain HTML Art**: 84KB optimized art file stored on-chain
- **Dynamic Content**: Art reads contract data for animations
- **Bee Animations**: Streak-based bee appearance (3+ happy days)
- **Community Influence**: Art affected by collective mood (Community mood up = longer stalk)
- **Trading activity**: Shows the liveliness of the project, the core of the flower reacts with trading activity (trading activity + gas back = treasury funds to sponsor mood updates)
- **Future-Proof**: Dummy storage states for upcoming features

### 🔧 **Technical Architecture**
I would ignore reading this
#### **Smart Contract Features**
```solidity
// Core NFT functionality with mood journal
contract ShapeL2FlowerMoodJournal is ERC721, Ownable, Pausable {
    // Optimized data structures for gas efficiency
    struct MoodEntry {
        uint32 ts;           // timestamp
        uint16 conf;         // confidence
        uint8 emotion;       // emotion code
        uint8 entropy;       // complexity entropy
        uint8 gap;           // confidence gap
        uint8[5] probs;      // emotion probabilities
    }
    
    // Dynamic pricing and gasback system
    // Streak tracking and community stats
    // Art versioning and feature management
}
```

#### **Frontend Stack**
- **Next.js 15.5.0**: React framework with App Router
- **TypeScript**: Type-safe development
- **Three.js**: 3D graphics and animations
- **Wagmi v2**: Modern Ethereum hooks
- **RainbowKit**: Beautiful wallet connection UI
- **Framer Motion**: Smooth animations
- **Tailwind CSS**: Utility-first styling

#### **AI Integration**
- **Mood Classifier API**: Python backend with ML model (Deployed with Railway via repo [here](https://github.com/innovinitylabs/shapes-of-mood-classifier.git)
- **Real-time Analysis**: Instant emotion detection
- **Parameter Mapping**: Converts emotions to visual parameters
- **Community Aggregation**: Collective mood calculation

## 🎯 **Shape L2 Advantages**

### **Technical Benefits**
- **80% Gasback**: Users get 80% of gas costs back, which can be used to fund a project treasury to subsidise mood updates with wallet abstraction 
- **Higher Contract Limits**: No 24KB restriction (100KB+ available) - _Not sure, GPT told me_
- **Lower Gas Costs**: 10-100x cheaper than mainnet
- **Fast Transactions**: 2-5 second finality
- **Account Abstraction**: Enhanced user experience

### **Economic Model**
- **Introductory Price**: 0.0042 ETH for early adopters
- **Base Price**: 0.0069 ETH for regular minting
- **Mood Journal**: 3 free entries subsidies with funds from gasback, then 0.001 ETH per entry
- **Gasback Distribution**: 80% of interaction costs returned
- **Royalties**: 5% on secondary sales

## 📊 **Collection Statistics**

- **Total Supply**: 1,111 flowers (limited edition)
- **Max Per Wallet**: 5 flowers per address
- **Mint Price**: Dynamic pricing (0.0042 - 0.0069 ETH)
- **Gas Back**: 80% of interaction costs
- **Royalties**: 5% on secondary sales
- **Network**: Shape L2 (Ethereum L2 solution)

# 🏆 **Innovation Highlights**

### **First-of-its-Kind Features**
1. **Living NFT Art**: Flowers that evolve with emotions
2. **AI-Powered Generation**: Real-time mood analysis
3. **Community Consciousness**: Collective mood influence
4. **Streak-Based Animations**: Bee unlocks with positive streaks
5. **Dynamic Rarity**: Community-driven rarity system
6. **Gas-Back Economics**: 80% gas refunds for engagement

### **Technical Excellence**
- **Gas Optimization**: 31.4% block limit usage
- **Storage Efficiency**: 60-97% savings achieved
- **On-chain Art**: Complete HTML art stored on-chain
- **Real-time Updates**: Dynamic content based on contract data
- **Comprehensive Testing**: 25/25 tests passing

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+
- MetaMask or compatible wallet
- Shape L2 network configured

### **Frontend Development**

1. **Clone the repository**
```bash
git clone https://github.com/innovinitylabs/shapecraft2.git
cd shapecraft2
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp env.example .env.local
```
Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_CHAIN_ID=11011
NEXT_PUBLIC_ALCHEMY_KEY=your_alchemy_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_id
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### **Smart Contract Development**

1. **Navigate to contract directory**
```bash
cd contract
```

2. **Install dependencies**
```bash
npm install
```

3. **Compile contracts**
```bash
npm run compile
```

4. **Run tests**
```bash
npm test
```

5. **Deploy to Shape L2**
```bash
npm run deploy:testnet
```

## 🎨 **Art System Architecture**

### **Dynamic Flower Generation**
```typescript
// Mood-based color mapping
const getMoodColor = (mood: number): string => {
  if (mood <= 2) return '#4A90E2'; // Blue - Sad
  if (mood <= 4) return '#7ED321'; // Green - Calm
  if (mood <= 6) return '#F5A623'; // Orange - Neutral
  if (mood <= 8) return '#FF6B6B'; // Red - Excited
  return '#FFD700'; // Gold - Joy
};

// Streak-based bee animation
const shouldShowBee = (streak: number): boolean => {
  return streak >= 3; // Show bee after 3+ happy days
};
```

### **On-Chain Art Features**
- **Single HTML File**: 84KB optimized art stored on-chain
- **Dynamic Content**: Reads contract data for real-time updates
- **Bee Animations**: Wing flapping, movement, and positioning
- **Community Influence**: Colors and effects based on collective mood
- **Trading Activity**: Visual effects from marketplace activity

## 📱 **User Experience**

### **Minting Flow**
1. Connect wallet to Shape L2
2. Describe your mood or use mood slider
3. Preview flower with live 3D rendering
4. Mint with one-click transaction
5. Receive gas-back reward

### **Flower Management**
1. View collection in personal gallery
2. Update mood with AI analysis
3. Track emotional journey over time
4. Earn rewards for engagement
5. Watch bee animations unlock

### **Community Features**
- **Collective Mood Visualization**: See community sentiment
- **Dynamic Rarity Leaderboard**: Compete for rarity scores
- **Gas-Back Transparency**: Clear reward system
- **Streak Tracking**: Monitor positive mood streaks

## 🔧 **Smart Contract Features**

### **Core Functions**
```solidity
// Mint new flower
function mintFlowerNFT() external payable

// Record mood entry
function recordMood(uint8 emotion, uint16 confidence) external payable

// Update art version
function updateArtVersion(string calldata newVersion) external onlyOwner

// Claim gasback
function claimGasback() external

// Get user ranking
function getUserRanking(address user) external view returns (UserRanking memory)
```

### **Advanced Features**
- **Dynamic Pricing**: Introductory and base pricing tiers
- **Streak System**: Happy emotion tracking with rewards
- **Community Stats**: Collective mood and participation tracking
- **Art Management**: Version control and feature toggles
- **Emergency Functions**: Pause and recovery mechanisms

## 🎯 **Shape L2 Integration**

### **Optimizations**
- **Low Gas Fees**: Leverage Shape L2's cost efficiency
- **Fast Transactions**: Quick mood updates and interactions
- **Scalability**: Handle high interaction volumes
- **Event Integration**: Shape MCP events trigger visual effects

### **Unique Features**
- **Account Abstraction**: Enhanced user experience
- **Gas Sponsorship**: Shape L2's gas optimization
- **Cross-Chain Compatibility**: Future expansion possibilities

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 **Acknowledgments**

- **Shape L2 Team**: For the innovative L2 solution
- **Three.js Community**: For amazing 3D graphics tools
- **OpenZeppelin**: For secure smart contract libraries
- **[Pingala](https://en.wikipedia.org/wiki/Pingala)**: Ancient mathematician from the 3rd century BCE who inspired our petal sequences (the one behind the Fibonacci sequence, 1202CE)
- Internet, **Cursor**, and open source sources (full credit citation pending)

## 📞 **Contact**

- **Website**: [shapesofmind.art](https://shapesofmind.art)
- **Twitter**: [@ShapesOfMind](https://twitter.com/ShapesOfMind) 
- **Discord**: [Join our community](https://discord.gg/shapesofmind) - Not Ready Yet 

---

*Shapes of Mind - Where emotions bloom on the blockchain* 🌻✨

---

## 💭 **Developer Notes**

> **Integration Status**: Our web3 integration is currently experiencing some compatibility issues with Wagmi v2 API changes, but the core functionality is working. The beautiful 3D art system is fully functional and the smart contract is complete and tested. Despite the integration challenges, I'm incredibly proud of what we've built - this represents a revolutionary approach to NFT art with living, breathing flowers that respond to emotions and community sentiment. The hackathon has been an amazing experience and I feel like I've already won by creating something truly innovative. The project will be shipped soon with full functionality! 🚀

#### Thanks 🙏🏽
This project is fully vibe-coded, with just a tiny bit of manual code for the bees, crafted by ex-Civil Engineer turned artist VALIPOKKANN ( [X](https://x.com/VALIPOKKANN), [Site](valipokkann.in) ), who’s been in the NFT space since 2021. (The website design & demo slap, though 😎). from coming up with idea to an demo in less than 48 hours (started late because of wrong time zone conversion i did, then sidetracked to my main website project and then spent hours perfecting bee lol) enjoyed this whole process, the most alive i felt in 2025.
