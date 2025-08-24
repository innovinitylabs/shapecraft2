# Shapes of Mind Smart Contracts

This directory contains the smart contracts for the Shapes of Mind NFT project, which generates unique flower art based on emotional states.

## 🏗️ Project Structure

```
contracts/
├── contracts/
│   └── ShapesOfMind.sol          # Main NFT contract
├── scripts/
│   └── deploy.ts                 # Deployment script
├── test/
│   └── ShapesOfMind.test.ts      # Contract tests
├── hardhat.config.ts             # Hardhat configuration
├── package.json                  # Dependencies and scripts
└── env.example                   # Environment variables template
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd contracts
npm install
```

### 2. Set Up Environment Variables

```bash
cp env.example .env
```

Fill in your environment variables:

```env
# Network RPC URLs
SHAPE_SEPOLIA_RPC_URL=https://shape-sepolia.g.alchemy.com/v2/your-alchemy-api-key
SHAPE_MAINNET_RPC_URL=https://shape-mainnet.g.alchemy.com/v2/your-alchemy-api-key

# Private key for deployment (without 0x prefix)
PRIVATE_KEY=your-private-key-here

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your-etherscan-api-key

# Gas reporting
REPORT_GAS=true
```

### 3. Compile Contracts

```bash
npm run compile
```

### 4. Run Tests

```bash
npm test
```

### 5. Deploy to Local Network

```bash
# Start local Hardhat node
npm run node

# In another terminal, deploy to local network
npm run deploy:local
```

### 6. Deploy to Shape Sepolia Testnet

```bash
npm run deploy:sepolia
```

### 7. Deploy to Shape Mainnet

```bash
npm run deploy:mainnet
```

## 📋 Available Scripts

- `npm run compile` - Compile smart contracts
- `npm test` - Run test suite
- `npm run deploy:local` - Deploy to local Hardhat network
- `npm run deploy:sepolia` - Deploy to Shape Sepolia testnet
- `npm run deploy:mainnet` - Deploy to Shape mainnet
- `npm run node` - Start local Hardhat node
- `npm run clean` - Clean build artifacts
- `npm run verify:sepolia` - Verify contract on Shape Sepolia explorer
- `npm run verify:mainnet` - Verify contract on Shape mainnet explorer
- `npm run coverage` - Run test coverage
- `npm run lint` - Run Solidity linter
- `npm run lint:fix` - Fix linting issues

## 🎨 Smart Contract Features

### ShapesOfMind Contract

The main contract implements an ERC-721 NFT collection with the following features:

#### Mood-Based Flower Generation
- **8 Mood Categories**: Joy, Calm, Melancholy, Energy, Serenity, Passion, Contemplation, Wonder
- **Dynamic Flower Properties**: Petal count (5-10), color hue (0-360), saturation (0-100), brightness (0-100)
- **On-Chain SVG Generation**: Flowers are rendered as SVG directly on the blockchain

#### Core Functions

1. **mintFlower()** - Mint a new flower NFT with mood data
   ```solidity
   function mintFlower(
       Mood mood,
       string memory name,
       uint256 petalCount,
       uint256 colorHue,
       uint256 saturation,
       uint256 brightness,
       bool isAnimated
   ) external returns (uint256)
   ```

2. **updateFlower()** - Update an existing flower's mood and name
   ```solidity
   function updateFlower(
       uint256 tokenId,
       Mood newMood,
       string memory newName
   ) external
   ```

3. **getFlowerData()** - Get complete flower data for a token
   ```solidity
   function getFlowerData(uint256 tokenId) external view returns (FlowerData memory)
   ```

4. **getTokensByOwner()** - Get all tokens owned by an address
   ```solidity
   function getTokensByOwner(address owner) external view returns (uint256[] memory)
   ```

#### Data Structures

```solidity
struct FlowerData {
    Mood mood;
    uint256 timestamp;
    string name;
    uint256 petalCount;
    uint256 colorHue;
    uint256 saturation;
    uint256 brightness;
    bool isAnimated;
}

enum Mood {
    Joy,
    Calm,
    Melancholy,
    Energy,
    Serenity,
    Passion,
    Contemplation,
    Wonder
}
```

## 🔗 Integration with Frontend

The smart contract integrates with the Next.js frontend through:

1. **Contract ABI**: Located in `src/lib/contract.ts`
2. **Web3 Configuration**: Located in `src/lib/web3.ts`
3. **Contract Service**: Located in `src/services/contractService.ts`

### Environment Variables for Frontend

Add these to your main project's `.env.local`:

```env
NEXT_PUBLIC_CHAIN_ID=11011
NEXT_PUBLIC_ALCHEMY_KEY=your-alchemy-api-key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-walletconnect-project-id
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed-contract-address
```

## 🧪 Testing

The test suite covers:

- Contract deployment
- Flower minting with valid/invalid parameters
- Flower data retrieval
- Flower updates
- Token ownership
- Multiple user scenarios
- Error handling

Run tests with:
```bash
npm test
```

## 🔒 Security Features

- **Input Validation**: All parameters are validated before processing
- **Access Control**: Only flower owners can update their flowers
- **OpenZeppelin**: Uses battle-tested OpenZeppelin contracts
- **Gas Optimization**: Optimized for efficient gas usage

## 🌐 Network Configuration

### Shape Network

- **Sepolia Testnet**: Chain ID 11011
- **Mainnet**: Chain ID 360

### RPC Endpoints

- **Sepolia**: `https://shape-sepolia.g.alchemy.com/v2/{api-key}`
- **Mainnet**: `https://shape-mainnet.g.alchemy.com/v2/{api-key}`

### Block Explorers

- **Sepolia**: `https://sepolia.explorer.shape.network`
- **Mainnet**: `https://explorer.shape.network`

## 📝 Deployment Checklist

Before deploying to production:

- [ ] Run full test suite
- [ ] Verify gas optimization
- [ ] Test on Sepolia testnet
- [ ] Verify contract on block explorer
- [ ] Update frontend environment variables
- [ ] Test frontend integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
