'use client';

import { useAccount, useContractRead, useContractWrite, useWaitForTransactionReceipt } from 'wagmi';
import { contractConfig, MOOD_VALUES, MoodType } from '@/lib/contract';
import { useState } from 'react';

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
  mood: MoodType;
  name: string;
  petalCount: number;
  colorHue: number;
  saturation: number;
  brightness: number;
  isAnimated: boolean;
}

export interface UpdateFlowerParams {
  tokenId: number;
  mood: MoodType;
  name: string;
}

export const useShapesOfMindContract = () => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user's flower tokens
  const { data: userTokens, refetch: refetchUserTokens } = useContractRead({
    ...contractConfig,
    functionName: 'getTokensByOwner',
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  // Get flower data for a specific token
  const getFlowerData = (tokenId: number) => {
    return useContractRead({
      ...contractConfig,
      functionName: 'getFlowerData',
      args: [BigInt(tokenId)],
      enabled: !!tokenId,
    });
  };

  // Mint flower function
  const { write: mintFlower, data: mintData } = useContractWrite({
    ...contractConfig,
    functionName: 'mintFlower',
  });

  // Wait for mint transaction
  const { isLoading: isMinting, isSuccess: isMintSuccess } = useWaitForTransactionReceipt({
    hash: mintData,
  });

  // Update flower function
  const { writeContract: updateFlower, data: updateData } = useContractWrite();

  // Wait for update transaction
  const { isLoading: isUpdating, isSuccess: isUpdateSuccess } = useWaitForTransactionReceipt({
    hash: updateData,
  });

  // Mint a new flower
  const mintNewFlower = async (params: MintFlowerParams) => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const moodValue = MOOD_VALUES[params.mood];
      
      mintFlower({
        args: [
          moodValue,
          params.name,
          BigInt(params.petalCount),
          BigInt(params.colorHue),
          BigInt(params.saturation),
          BigInt(params.brightness),
          params.isAnimated,
        ],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint flower');
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing flower
  const updateExistingFlower = async (params: UpdateFlowerParams) => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const moodValue = MOOD_VALUES[params.mood];
      
      updateFlower({
        args: [
          BigInt(params.tokenId),
          moodValue,
          params.name,
        ],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update flower');
    } finally {
      setIsLoading(false);
    }
  };

  // Get all flower data for user
  const getUserFlowers = async (): Promise<FlowerData[]> => {
    if (!userTokens || !address) return [];

    const flowers: FlowerData[] = [];
    
    for (const tokenId of userTokens) {
      try {
        const flowerData = await getFlowerData(Number(tokenId)).data;
        if (flowerData) {
          flowers.push({
            mood: Number(flowerData.mood),
            timestamp: flowerData.timestamp,
            name: flowerData.name,
            petalCount: flowerData.petalCount,
            colorHue: flowerData.colorHue,
            saturation: flowerData.saturation,
            brightness: flowerData.brightness,
            isAnimated: flowerData.isAnimated,
          });
        }
      } catch (err: unknown) {
        console.error(`Failed to fetch flower data for token ${tokenId}:`, err);
      }
    }

    return flowers;
  };

  return {
    // State
    isLoading: isLoading || isMinting || isUpdating,
    error,
    userTokens,
    
    // Actions
    mintNewFlower,
    updateExistingFlower,
    getUserFlowers,
    refetchUserTokens,
    
    // Transaction states
    isMintSuccess,
    isUpdateSuccess,
    
    // Utilities
    getFlowerData,
  };
};

// Hook for getting a single flower's data
export const useFlowerData = (tokenId: number) => {
  const { data: flowerData, isLoading, error } = useContractRead({
    ...contractConfig,
    functionName: 'getFlowerData',
    args: [BigInt(tokenId)],
    enabled: !!tokenId,
  });

  return {
    flowerData: flowerData ? {
      mood: Number(flowerData.mood),
      timestamp: flowerData.timestamp,
      name: flowerData.name,
      petalCount: flowerData.petalCount,
      colorHue: flowerData.colorHue,
      saturation: flowerData.saturation,
      brightness: flowerData.brightness,
      isAnimated: flowerData.isAnimated,
    } : null,
    isLoading,
    error,
  };
};

// Utility function to get mood name from value
export const getMoodName = (moodValue: number): MoodType | 'Unknown' => {
  const moodEntry = Object.entries(MOOD_VALUES).find(([, value]) => value === moodValue);
  return moodEntry ? (moodEntry[0] as MoodType) : 'Unknown';
};

// Utility function to get mood value from name
export const getMoodValue = (moodName: MoodType): number => {
  return MOOD_VALUES[moodName];
};
