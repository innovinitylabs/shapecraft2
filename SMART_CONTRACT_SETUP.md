# Smart Contract Setup Guide

This guide covers the complete setup of the Shapes of Mind smart contract system, including deployment, testing, and frontend integration.

## 🏗️ Project Overview

The Shapes of Mind project consists of:
- **Smart Contracts**: ERC-721 NFT collection with mood-based flower generation
- **Frontend**: Next.js application with Web3 integration
- **Backend**: Mood classification service

## 📁 Project Structure

```
Shapes of Mind/
├── contracts/                    # Smart contract development
│   ├── contracts/
│   │   └── ShapesOfMind.sol     # Main NFT contract
│   ├── scripts/
│   │   └── deploy.ts            # Deployment script
│   ├── test/
│   │   └── ShapesOfMind.test.ts # Contract tests
│   ├── hardhat.config.ts        # Hardhat configuration
│   └── package.json             # Contract dependencies
├── src/
│   ├── lib/
│   │   ├── config.ts            # Web3 configuration
│   │   ├── web3.ts              # Wagmi configuration
│   │   └── contract.ts          # Contract ABI and types
│   └── services/
│       └── contractService.ts   # Contract interaction service
├── builder-kit/                 # Shape Network builder kit (reference)
└── package.json                 # Frontend dependencies
```

## 🚀 Quick Start

### 1. Smart Contract Setup

```bash
# Navigate to contracts directory
cd contracts

# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests (optional - may have module issues)
npm test

# Deploy to local network
npm run node  # In one terminal
npm run deploy:local  # In another terminal
```

### 2. Frontend Integration

```bash
# Navigate to main project directory
cd ..

# Install additional dependencies (if needed)
npm install

# Set up environment variables
cp env.example .env.local
```

Fill in your `.env.local`:
```env
NEXT_PUBLIC_CHAIN_ID=11011
NEXT_PUBLIC_ALCHEMY_KEY=your-alchemy-api-key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-walletconnect-project-id
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed-contract-address
```

### 3. Start Development

```bash
# Start the frontend
npm run dev
```

## 🔧 Smart Contract Features

### ShapesOfMind Contract

The main contract implements an ERC-721 NFT collection with:

#### Core Functions
- `mintFlower()` - Mint a new flower NFT with mood data
- `updateFlower()` - Update an existing flower's mood and name
- `getFlowerData()` - Get complete flower data for a token
- `getTokensByOwner()` - Get all tokens owned by an address

#### Mood Categories
- Joy (0)
- Calm (1)
- Melancholy (2)
- Energy (3)
- Serenity (4)
- Passion (5)
- Contemplation (6)
- Wonder (7)

#### Flower Properties
- **Petal Count**: 5-10 petals
- **Color Hue**: 0-360 degrees
- **Saturation**: 0-100%
- **Brightness**: 0-100%
- **Animation**: Boolean flag

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

## 🔗 Frontend Integration

### Web3 Configuration

The frontend uses:
- **Wagmi v2**: React hooks for Ethereum
- **RainbowKit**: Wallet connection UI
- **Viem**: TypeScript interface for Ethereum

### Contract Integration

1. **Contract ABI**: Located in `src/lib/contract.ts`
2. **Web3 Config**: Located in `src/lib/web3.ts`
3. **Contract Service**: Located in `src/services/contractService.ts`

### Usage Example

```typescript
import { useShapesOfMindContract } from '@/services/contractService';

function MyComponent() {
  const { mintNewFlower, userTokens, isLoading } = useShapesOfMindContract();

  const handleMint = async () => {
    await mintNewFlower({
      mood: 'Joy',
      name: 'Sunshine',
      petalCount: 6,
      colorHue: 45,
      saturation: 80,
      brightness: 90,
      isAnimated: true,
    });
  };

  return (
    <button onClick={handleMint} disabled={isLoading}>
      Mint Flower
    </button>
  );
}
```

## 🧪 Testing

### Smart Contract Tests

```bash
cd contracts
npm test
```

Tests cover:
- Contract deployment
- Flower minting with valid/invalid parameters
- Flower data retrieval
- Flower updates
- Token ownership
- Multiple user scenarios
- Error handling

### Frontend Testing

```bash
npm test
```

## 🚀 Deployment

### 1. Deploy Smart Contract

```bash
cd contracts

# Deploy to Sepolia testnet
npm run deploy:sepolia

# Deploy to mainnet
npm run deploy:mainnet
```

### 2. Verify Contract

```bash
# Verify on Sepolia
npm run verify:sepolia

# Verify on mainnet
npm run verify:mainnet
```

### 3. Update Frontend

After deployment, update your `.env.local` with the deployed contract address:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Deployed contract address
```

## 🔒 Security Considerations

- **Input Validation**: All parameters are validated before processing
- **Access Control**: Only flower owners can update their flowers
- **OpenZeppelin**: Uses battle-tested OpenZeppelin contracts
- **Gas Optimization**: Optimized for efficient gas usage

## 🛠️ Development Commands

### Smart Contracts
```bash
cd contracts
npm run compile          # Compile contracts
npm test                 # Run tests
npm run deploy:local     # Deploy to local network
npm run deploy:sepolia   # Deploy to Sepolia
npm run node             # Start local Hardhat node
npm run clean            # Clean build artifacts
```

### Frontend
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

## 📝 Environment Variables

### Smart Contract (.env in contracts/)
```env
SHAPE_SEPOLIA_RPC_URL=https://shape-sepolia.g.alchemy.com/v2/your-api-key
SHAPE_MAINNET_RPC_URL=https://shape-mainnet.g.alchemy.com/v2/your-api-key
PRIVATE_KEY=your-private-key-here
ETHERSCAN_API_KEY=your-etherscan-api-key
REPORT_GAS=true
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_CHAIN_ID=11011
NEXT_PUBLIC_ALCHEMY_KEY=your-alchemy-api-key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-walletconnect-project-id
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed-contract-address
```

## 🔍 Troubleshooting

### Common Issues

1. **Module Import Errors**: Ensure `"type": "commonjs"` is set in contracts/package.json
2. **Node.js Version**: Hardhat works best with Node.js 18.x or 20.x
3. **Gas Issues**: Use `viaIR: true` in hardhat.config.ts for complex contracts
4. **Network Issues**: Ensure RPC URLs are correct and API keys are valid

### Getting Help

- Check the [contracts/README.md](contracts/README.md) for detailed smart contract documentation
- Review the [builder-kit](builder-kit/) for reference implementation
- Check Hardhat and Wagmi documentation for specific issues

## 📚 Additional Resources

- [Shape Network Documentation](https://docs.shape.network)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Wagmi Documentation](https://wagmi.sh)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Viem Documentation](https://viem.sh)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

---

This setup provides a complete foundation for the Shapes of Mind NFT project with smart contract integration, Web3 functionality, and a modern frontend architecture.
