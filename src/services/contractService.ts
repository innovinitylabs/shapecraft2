'use client';

import { useAccount, useContractRead, useContractWrite, useWaitForTransaction, useBalance } from 'wagmi';
import { 
  contractConfig, 
  EMOTION_CODES, 
  EmotionType,
  MoodClassifierResponse,
  UserMoodHistory,
  UserRanking,
  StreakFeatures,
  CommunityStats
} from '@/lib/contract';
import { useState } from 'react';

export interface MintFlowerParams {
  emotion: EmotionType;
  confidence: number;
  probabilities: number[];
  entropy: number;
  gap: number;
}

export interface RecordMoodParams {
  emotion: EmotionType;
  confidence: number;
  probabilities: number[];
  entropy: number;
  gap: number;
  nftId: number;
}

export const useShapeL2FlowerContract = () => {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user's balance
  const { data: balance } = useBalance({
    address,
  });

  // Get current mint price
  const { data: currentMintPrice } = useContractRead({
    ...contractConfig,
    functionName: 'getCurrentMintPrice',
  });

  // Get user's mood history
  const { data: userMoodHistory, refetch: refetchMoodHistory } = useContractRead({
    ...contractConfig,
    functionName: 'getUserMoodHistory',
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  // Get user's ranking
  const { data: userRanking, refetch: refetchUserRanking } = useContractRead({
    ...contractConfig,
    functionName: 'getUserRanking',
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  // Get user's streak features
  const { data: streakFeatures, refetch: refetchStreakFeatures } = useContractRead({
    ...contractConfig,
    functionName: 'getStreakFeatures',
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  // Get community stats
  const { data: communityStats, refetch: refetchCommunityStats } = useContractRead({
    ...contractConfig,
    functionName: 'getCommunityStats',
  });

  // Mint flower function
  const { write: mintFlower, data: mintData } = useContractWrite({
    ...contractConfig,
    functionName: 'mintFlowerNFT',
  });

  // Wait for mint transaction
  const { isLoading: isMinting, isSuccess: isMintSuccess } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  // Record mood function
  const { write: recordMood, data: recordData } = useContractWrite({
    ...contractConfig,
    functionName: 'recordMood',
  });

  // Wait for record mood transaction
  const { isLoading: isRecording, isSuccess: isRecordSuccess } = useWaitForTransaction({
    hash: recordData?.hash,
  });

  // Claim gasback function
  const { write: claimGasback, data: claimData } = useContractWrite({
    ...contractConfig,
    functionName: 'claimGasback',
  });

  // Wait for claim transaction
  const { isLoading: isClaiming, isSuccess: isClaimSuccess } = useWaitForTransaction({
    hash: claimData?.hash,
  });

  // Mint a new flower NFT
  const mintNewFlower = async (params: MintFlowerParams) => {
    if (!address || !isConnected) {
      setError('Wallet not connected');
      return;
    }

    if (!currentMintPrice) {
      setError('Unable to get mint price');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const emotionCode = EMOTION_CODES[params.emotion];
      const confidenceValue = Math.round(params.confidence * 100); // Convert to 0-10000 range
      const probabilitiesArray = params.probabilities.slice(0, 5).map(p => Math.round(p * 100)); // Convert to 0-100 range
      
      // Pad probabilities array to 5 elements
      while (probabilitiesArray.length < 5) {
        probabilitiesArray.push(0);
      }

      mintFlower({
        args: [
          emotionCode,
          confidenceValue,
          probabilitiesArray as [number, number, number, number, number],
          Math.round(params.entropy),
          Math.round(params.gap)
        ],
        value: currentMintPrice,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint flower');
    } finally {
      setIsLoading(false);
    }
  };

  // Record mood for existing NFT
  const recordMoodForNFT = async (params: RecordMoodParams) => {
    if (!address || !isConnected) {
      setError('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const emotionCode = EMOTION_CODES[params.emotion];
      const confidenceValue = Math.round(params.confidence * 100); // Convert to 0-10000 range
      const probabilitiesArray = params.probabilities.slice(0, 5).map(p => Math.round(p * 100)); // Convert to 0-100 range
      
      // Pad probabilities array to 5 elements
      while (probabilitiesArray.length < 5) {
        probabilitiesArray.push(0);
      }

      recordMood({
        args: [
          emotionCode,
          confidenceValue,
          probabilitiesArray as [number, number, number, number, number],
          Math.round(params.entropy),
          Math.round(params.gap),
          params.nftId
        ],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record mood');
    } finally {
      setIsLoading(false);
    }
  };

  // Claim gasback
  const claimUserGasback = async () => {
    if (!address || !isConnected) {
      setError('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      claimGasback();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim gasback');
    } finally {
      setIsLoading(false);
    }
  };

  // Convert mood classifier response to contract params
  const convertMoodClassifierToContractParams = (response: MoodClassifierResponse): MintFlowerParams => {
    return {
      emotion: response.emotion.toLowerCase() as EmotionType,
      confidence: response.confidence,
      probabilities: response.probabilities,
      entropy: response.entropy,
      gap: response.gap,
    };
  };

  // Check if user can record mood (24h limit)
  const canRecordMood = (): boolean => {
    if (!userMoodHistory) return true;
    
    const lastEntry = userMoodHistory.entries[userMoodHistory.entries.length - 1];
    if (!lastEntry) return true;

    const lastEntryTime = Number(lastEntry.ts);
    const currentTime = Math.floor(Date.now() / 1000);
    const timeDiff = currentTime - lastEntryTime;
    const oneDay = 24 * 60 * 60; // 24 hours in seconds

    return timeDiff >= oneDay;
  };

  // Get time until next mood recording
  const getTimeUntilNextMood = (): string => {
    if (!userMoodHistory) return '0 hours';

    const lastEntry = userMoodHistory.entries[userMoodHistory.entries.length - 1];
    if (!lastEntry) return '0 hours';

    const lastEntryTime = Number(lastEntry.ts);
    const currentTime = Math.floor(Date.now() / 1000);
    const timeDiff = lastEntryTime + (24 * 60 * 60) - currentTime;

    if (timeDiff <= 0) return '0 hours';

    const hours = Math.floor(timeDiff / 3600);
    const minutes = Math.floor((timeDiff % 3600) / 60);

    return `${hours}h ${minutes}m`;
  };

  return {
    // State
    address,
    isConnected,
    isLoading,
    error,
    balance,
    currentMintPrice,

    // Data
    userMoodHistory,
    userRanking,
    streakFeatures,
    communityStats,

    // Transaction states
    isMinting,
    isMintSuccess,
    isRecording,
    isRecordSuccess,
    isClaiming,
    isClaimSuccess,

    // Functions
    mintNewFlower,
    recordMoodForNFT,
    claimUserGasback,
    convertMoodClassifierToContractParams,
    canRecordMood,
    getTimeUntilNextMood,

    // Refetch functions
    refetchMoodHistory,
    refetchUserRanking,
    refetchStreakFeatures,
    refetchCommunityStats,
  };
};
