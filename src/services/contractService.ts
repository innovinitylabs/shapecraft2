'use client';

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { SHAPES_OF_MIND_ABI } from '@/lib/contract';
import { config } from '@/lib/config';
import { useState } from 'react';
import { parseEther } from 'viem';

export interface FlowerData {
  mood: number;
  timestamp: bigint;
  name: string;
  petalCount: bigint;
  colorHue: bigint;
  saturation: bigint;
  brightness: bigint;
  isAnimated: boolean;
}

export interface MintFlowerParams {
  mood: number;
  name: string;
  petalCount: number;
  colorHue: number;
  saturation: number;
  brightness: number;
  isAnimated: boolean;
}

export interface UpdateFlowerParams {
  tokenId: number;
  mood: number;
  name: string;
}

// Mood type mapping
export const MOOD_VALUES = {
  happy: 0,
  joy: 1,
  sad: 2,
  fear: 3,
  anger: 4,
  disgust: 5,
  shame: 6,
  surprise: 7,
  neutral: 8
} as const;

export type MoodType = keyof typeof MOOD_VALUES;

export const useShapesOfMindContract = () => {
  const { address } = useAccount();
  const [error, setError] = useState<string | null>(null);

  // Write contract hook
  const { writeContract, data: writeData, isPending: isWritePending } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // Get user's flower tokens
  const { data: userTokens, refetch: refetchUserTokens } = useReadContract({
    abi: SHAPES_OF_MIND_ABI,
    address: config.contractAddress as `0x${string}`,
    functionName: 'getTokensByOwner',
    args: address ? [address] : undefined,
  });

  // Get flower data for a specific token
  const useFlowerData = (tokenId: number) => {
    return useReadContract({
      abi: SHAPES_OF_MIND_ABI,
      address: config.contractAddress as `0x${string}`,
      functionName: 'getFlowerData',
      args: [BigInt(tokenId)],
    });
  };

  // Get user ranking
  const { data: userRanking } = useReadContract({
    abi: SHAPES_OF_MIND_ABI,
    address: config.contractAddress as `0x${string}`,
    functionName: 'getUserRanking',
    args: address ? [address] : undefined,
  });

  // Get gasback balance
  const { data: gasbackBalance } = useReadContract({
    abi: SHAPES_OF_MIND_ABI,
    address: config.contractAddress as `0x${string}`,
    functionName: 'userGasbackBalance',
    args: address ? [address] : undefined,
  });

  // Mint a new flower
  const mintNewFlower = async (params: MintFlowerParams) => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    setError(null);

    try {
      // Get current price first
      const currentPrice = await useReadContract({
        abi: SHAPES_OF_MIND_ABI,
        address: config.contractAddress as `0x${string}`,
        functionName: 'getCurrentPrice',
      });

      writeContract({
        abi: SHAPES_OF_MIND_ABI,
        address: config.contractAddress as `0x${string}`,
        functionName: 'mintFlowerNFT',
        value: currentPrice?.result as bigint || parseEther('0.0042'), // Fallback to intro price
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint flower');
    }
  };

  // Record mood entry
  const recordMood = async (emotion: MoodType, confidence: number) => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    setError(null);

    try {
      const moodValue = MOOD_VALUES[emotion];
      const confidenceValue = Math.floor(confidence * 10000); // Convert to basis points

      writeContract({
        abi: SHAPES_OF_MIND_ABI,
        address: config.contractAddress as `0x${string}`,
        functionName: 'recordMood',
        args: [moodValue, confidenceValue],
        value: parseEther('0.001'), // Mood recording fee
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record mood');
    }
  };

  // Claim gasback
  const claimGasback = async () => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    setError(null);

    try {
      writeContract({
        abi: SHAPES_OF_MIND_ABI,
        address: config.contractAddress as `0x${string}`,
        functionName: 'claimGasback',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim gasback');
    }
  };

  // Utility function to get mood name from value
  const getMoodName = (moodValue: number): string => {
    const entry = Object.entries(MOOD_VALUES).find(([, value]) => value === moodValue);
    return entry ? entry[0] : 'unknown';
  };

  return {
    // State
    address,
    isLoading: isWritePending || isTransactionLoading,
    isSuccess: isTransactionSuccess,
    error,
    
    // Data
    userTokens: userTokens as bigint[] | undefined,
    userRanking,
    gasbackBalance: gasbackBalance as bigint | undefined,
    
    // Functions
    mintNewFlower,
    recordMood,
    claimGasback,
    useFlowerData,
    getMoodName,
    refetchUserTokens,
    
    // Raw write function for advanced use
    writeContract,
  };
};