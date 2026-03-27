// src/hooks/useInterests.ts
import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import {
  getLastBalance,
  saveLastBalance
} from '../utils/storage';
import { getStakingBalance } from '../utils/blockchain';
import { getXOConnectProvider } from '../lib/xo-connect';

// Staking contract addresses (replace with actual)
const STAKING_CONTRACTS: Record<string, string> = {
  '0x1': '0x', // Ethereum - Replace with actual
  '0x89': '0x', // Polygon - Replace with actual
  '0x38': '0x'  // BSC - Replace with actual
};

export function useInterests() {
  const [interestsEarned, setInterestsEarned] = useState<bigint>(BigInt(0));
  const [lastSavedBalance, setLastSavedBalance] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState(false);

  const address = useGameStore(state => state.address);
  const chainId = useGameStore(state => state.chainId);
  const updatePoints = useGameStore(state => state.updatePoints);

  const calculateInterests = useCallback(async () => {
    if (!address || !chainId) return;

    setIsLoading(true);
    try {
      const provider = getXOConnectProvider();
      const contractAddress = STAKING_CONTRACTS[chainId];

      if (!contractAddress || contractAddress === '0x') {
        console.warn('No staking contract configured for chain:', chainId);
        // Use mock for demo
        setInterestsEarned(BigInt(0));
        return;
      }

      const currentBalance = await getStakingBalance(
        provider,
        contractAddress,
        address
      );

      const lastBalance = await getLastBalance(address, chainId);

      if (lastBalance === null) {
        await saveLastBalance(address, chainId, currentBalance);
        setLastSavedBalance(currentBalance);
        setInterestsEarned(BigInt(0));
        return;
      }

      // Calculate differential (no negative interests)
      const interests = currentBalance > lastBalance
        ? currentBalance - lastBalance
        : BigInt(0);

      setInterestsEarned(interests);
      setLastSavedBalance(currentBalance);

      // Update rare points
      const currentRarePoints = useGameStore.getState().rarePoints;
      updatePoints(
        useGameStore.getState().balancePoints,
        currentRarePoints + Number(interests)
      );

      // Save new baseline
      await saveLastBalance(address, chainId, currentBalance);

    } catch (error) {
      console.error('Error calculating interests:', error);
    } finally {
      setIsLoading(false);
    }
  }, [address, chainId, updatePoints]);

  const saveCurrentBalance = useCallback(async () => {
    if (!address || !chainId) return;

    try {
      const provider = getXOConnectProvider();
      const contractAddress = STAKING_CONTRACTS[chainId];

      if (!contractAddress || contractAddress === '0x') return;

      const currentBalance = await getStakingBalance(
        provider,
        contractAddress,
        address
      );

      await saveLastBalance(address, chainId, currentBalance);
      setLastSavedBalance(currentBalance);
    } catch (error) {
      console.error('Error saving balance:', error);
    }
  }, [address, chainId]);

  useEffect(() => {
    calculateInterests();
  }, [calculateInterests]);

  return {
    rarePoints: Number(interestsEarned),
    interestsEarned,
    lastSavedBalance,
    isLoading,
    saveCurrentBalance
  };
}
