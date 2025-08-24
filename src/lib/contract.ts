// ShapeL2FlowerMoodJournal Contract ABI
export const SHAPE_L2_FLOWER_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "version",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "ArtVersionUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "FlowerMinted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "GasbackDistributed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "emotion",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint16",
        "name": "conf",
        "type": "uint16"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "ts",
        "type": "uint32"
      }
    ],
    "name": "MoodRecorded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Paused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Unpaused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rank",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "averageScore",
        "type": "uint256"
      }
    ],
    "name": "UserRankingUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimGasback",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "emergencyPause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getArtHTML",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getArtVersion",
    "outputs": [
      {
        "internalType": "string",
        "name": "version",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCommunityAverageMood",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCommunityStats",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "totalParticipants",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "averageCommunityMood",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalMoodEntries",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "averageStreakLength",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "highestStreak",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCurrentMintPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "emotion",
        "type": "string"
      }
    ],
    "name": "getEmotionCode",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "emotionCode",
        "type": "uint8"
      }
    ],
    "name": "getEmotionString",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "numDays",
        "type": "uint256"
      }
    ],
    "name": "getMoodTrend",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getStreakFeatures",
    "outputs": [
      {
        "internalType": "bool",
        "name": "beeAppearance",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "beeRangeControl",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "stalkGrowth",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "glowIntensity",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "rotationSpeed",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "count",
        "type": "uint256"
      }
    ],
    "name": "getTopUsers",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "users",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "ranks",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "scores",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserMoodHistory",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint32",
            "name": "ts",
            "type": "uint32"
          },
          {
            "internalType": "uint16",
            "name": "conf",
            "type": "uint16"
          },
          {
            "internalType": "uint8",
            "name": "emotion",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "entropy",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "gap",
            "type": "uint8"
          },
          {
            "internalType": "uint8[5]",
            "name": "probs",
            "type": "uint8[5]"
          }
        ],
        "internalType": "struct ShapeL2FlowerMoodJournal.MoodEntry[]",
        "name": "entries",
        "type": "tuple[]"
      },
      {
        "internalType": "uint16",
        "name": "currentStreak",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "maxStreak",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "totalEntries",
        "type": "uint16"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserRanking",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "rank",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalMoodScore",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "averageMoodScore",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "streakCount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxStreak",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalEntries",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "emotion",
        "type": "uint8"
      },
      {
        "internalType": "uint16",
        "name": "conf",
        "type": "uint16"
      },
      {
        "internalType": "uint8[5]",
        "name": "probs",
        "type": "uint8[5]"
      },
      {
        "internalType": "uint8",
        "name": "entropy",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "gap",
        "type": "uint8"
      }
    ],
    "name": "mintFlowerNFT",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "emotion",
        "type": "uint8"
      },
      {
        "internalType": "uint16",
        "name": "conf",
        "type": "uint16"
      },
      {
        "internalType": "uint8[5]",
        "name": "probs",
        "type": "uint8[5]"
      },
      {
        "internalType": "uint8",
        "name": "entropy",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "gap",
        "type": "uint8"
      },
      {
        "internalType": "uint16",
        "name": "nftId",
        "type": "uint16"
      }
    ],
    "name": "recordMood",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "beeEnabled",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "soundEnabled",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "particleEffects",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "advancedLighting",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "weatherEffects",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "timeOfDay",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "communityInfluence",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "tradingActivity",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "artComplexity",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "animationSpeed",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "colorPalette",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "specialEffects",
        "type": "uint256"
      }
    ],
    "name": "updateArtFeatures",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "version",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "htmlArt",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "artAssets",
        "type": "string"
      }
    ],
    "name": "updateArtVersion",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// Contract configuration
export const contractConfig = {
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
  abi: SHAPE_L2_FLOWER_ABI,
} as const;

// Emotion mapping for the new contract
export const EMOTION_CODES = {
  happy: 0,
  joy: 1,
  sad: 2,
  fear: 3,
  anger: 4,
  disgust: 5,
  shame: 6,
  surprise: 7,
  neutral: 8,
} as const;

export type EmotionType = keyof typeof EMOTION_CODES;

// Mood classifier response interface
export interface MoodClassifierResponse {
  emotion: string;
  confidence: number;
  probabilities: number[];
  entropy: number;
  gap: number;
  mlParams?: {
    emotion: string;
    confidence: number;
    probabilities: number[];
    entropy: number;
    gap: number;
  };
}

// Contract data interfaces
export interface MoodEntry {
  ts: bigint;
  conf: number;
  emotion: number;
  entropy: number;
  gap: number;
  probs: number[];
}

export interface UserMoodHistory {
  entries: MoodEntry[];
  currentStreak: number;
  maxStreak: number;
  totalEntries: number;
}

export interface UserRanking {
  rank: bigint;
  totalMoodScore: bigint;
  averageMoodScore: bigint;
  streakCount: bigint;
  maxStreak: bigint;
  totalEntries: bigint;
}

export interface StreakFeatures {
  beeAppearance: boolean;
  beeRangeControl: boolean;
  stalkGrowth: boolean;
  glowIntensity: boolean;
  rotationSpeed: boolean;
}

export interface CommunityStats {
  totalParticipants: bigint;
  averageCommunityMood: bigint;
  totalMoodEntries: bigint;
  averageStreakLength: bigint;
  highestStreak: bigint;
}
