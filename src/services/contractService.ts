'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { SHAPE_L2_FLOWER_ABI, EMOTION_CODES, EmotionType } from '@/lib/contract';
import { useAccount } from 'wagmi';

// Get environment variables with fallbacks
const getEnvVar = (key: string, fallback: string) => {
  if (typeof window === 'undefined') return fallback;
  return process.env[key] || fallback;
};

const contractAddress = getEnvVar('NEXT_PUBLIC_CONTRACT_ADDRESS', '0x0000000000000000000000000000000000000000') as `0x${string}`;

export interface MintFlowerParams {
  emotion: EmotionType;
  confidence: number;
  probabilities: number[];
  entropy: number;
  gap: number;
}

export interface RecordMoodParams {
  tokenId: number;
  emotion: EmotionType;
  confidence: number;
  probabilities: number[];
  entropy: number;
  gap: number;
}

export function useShapeL2FlowerContract() {
  const { address } = useAccount();

  // Get current mint price
  const { data: currentMintPrice } = useReadContract({
    address: contractAddress,
    abi: SHAPE_L2_FLOWER_ABI,
    functionName: 'getCurrentMintPrice',
  });

  // Get user's mood history
  const { data: userMoodHistory, refetch: refetchMoodHistory } = useReadContract({
    address: contractAddress,
    abi: SHAPE_L2_FLOWER_ABI,
    functionName: 'getUserMoodHistory',
    args: address ? [address] : undefined,
  });

  // Get user's ranking
  const { data: userRanking, refetch: refetchUserRanking } = useReadContract({
    address: contractAddress,
    abi: SHAPE_L2_FLOWER_ABI,
    functionName: 'getUserRanking',
    args: address ? [address] : undefined,
  });

  // Get user's streak features
  const { data: streakFeatures, refetch: refetchStreakFeatures } = useReadContract({
    address: contractAddress,
    abi: SHAPE_L2_FLOWER_ABI,
    functionName: 'getStreakFeatures',
    args: address ? [address] : undefined,
  });

  // Get community stats
  const { data: communityStats, refetch: refetchCommunityStats } = useReadContract({
    address: contractAddress,
    abi: SHAPE_L2_FLOWER_ABI,
    functionName: 'getCommunityStats',
  });

  // Mint flower function
  const { writeContract: mintFlower, data: mintData, isPending: isMinting } = useWriteContract();

  // Record mood function
  const { writeContract: recordMood, data: recordData, isPending: isRecording } = useWriteContract();

  // Claim gasback function
  const { writeContract: claimGasback, data: claimData, isPending: isClaiming } = useWriteContract();

  // Wait for mint transaction
  const { isLoading: isMintConfirming, isSuccess: isMintSuccess } = useWaitForTransactionReceipt({
    hash: mintData,
  });

  // Wait for record mood transaction
  const { isLoading: isRecordConfirming, isSuccess: isRecordSuccess } = useWaitForTransactionReceipt({
    hash: recordData,
  });

  // Wait for claim gasback transaction
  const { isLoading: isClaimConfirming, isSuccess: isClaimSuccess } = useWaitForTransactionReceipt({
    hash: claimData,
  });

  const mintNewFlower = async (params: MintFlowerParams) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    try {
      mintFlower({
        address: contractAddress,
        abi: SHAPE_L2_FLOWER_ABI,
        functionName: 'mintFlowerNFT',
        args: [
          EMOTION_CODES[params.emotion],
          Math.round(params.confidence * 100),
          params.probabilities.slice(0, 5).map(p => Math.round(p * 100)) as [number, number, number, number, number],
          Math.round(params.entropy * 100),
          Math.round(params.gap * 100)
        ],
      });
    } catch (error) {
      console.error('Error minting flower:', error);
      throw error;
    }
  };

  const recordMoodForNFT = async (params: RecordMoodParams) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    try {
      recordMood({
        address: contractAddress,
        abi: SHAPE_L2_FLOWER_ABI,
        functionName: 'recordMood',
        args: [
          EMOTION_CODES[params.emotion],
          Math.round(params.confidence * 100),
          params.probabilities.slice(0, 5).map(p => Math.round(p * 100)) as [number, number, number, number, number],
          Math.round(params.entropy * 100),
          Math.round(params.gap * 100),
          params.tokenId
        ],
      });
    } catch (error) {
      console.error('Error recording mood:', error);
      throw error;
    }
  };

  const claimUserGasback = async () => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    try {
      claimGasback({
        address: contractAddress,
        abi: SHAPE_L2_FLOWER_ABI,
        functionName: 'claimGasback',
      });
    } catch (error) {
      console.error('Error claiming gasback:', error);
      throw error;
    }
  };

  // Helper function to convert mood classifier response to contract parameters
  const convertMoodClassifierToContractParams = (response: any): MintFlowerParams => {
    return {
      emotion: response.emotion as EmotionType,
      confidence: response.confidence,
      probabilities: response.probabilities,
      entropy: response.entropy,
      gap: response.gap,
    };
  };

  // Check if user can record mood (24h cooldown)
  const canRecordMood = () => {
    if (!userMoodHistory || !userMoodHistory[0] || userMoodHistory[0].length === 0) return true;
    
    const lastEntry = userMoodHistory[0][userMoodHistory[0].length - 1];
    const lastTimestamp = Number(lastEntry.ts);
    const currentTime = Math.floor(Date.now() / 1000);
    const cooldownPeriod = 24 * 60 * 60; // 24 hours in seconds
    
    return currentTime - lastTimestamp >= cooldownPeriod;
  };

  // Get time until next mood can be recorded
  const getTimeUntilNextMood = () => {
    if (!userMoodHistory || !userMoodHistory[0] || userMoodHistory[0].length === 0) return 0;
    
    const lastEntry = userMoodHistory[0][userMoodHistory[0].length - 1];
    const lastTimestamp = Number(lastEntry.ts);
    const currentTime = Math.floor(Date.now() / 1000);
    const cooldownPeriod = 24 * 60 * 60; // 24 hours in seconds
    const timeRemaining = cooldownPeriod - (currentTime - lastTimestamp);
    
    return Math.max(0, timeRemaining);
  };

  return {
    // Read data
    currentMintPrice,
    userMoodHistory,
    userRanking,
    streakFeatures,
    communityStats,
    
    // Write functions
    mintNewFlower,
    recordMoodForNFT,
    claimUserGasback,
    
    // Helper functions
    convertMoodClassifierToContractParams,
    canRecordMood,
    getTimeUntilNextMood,
    
    // Loading states
    isMinting,
    isMintConfirming,
    isMintSuccess,
    isRecording,
    isRecordConfirming,
    isRecordSuccess,
    isClaiming,
    isClaimConfirming,
    isClaimSuccess,
    
    // Refetch functions
    refetchMoodHistory,
    refetchUserRanking,
    refetchStreakFeatures,
    refetchCommunityStats,
  };
}
