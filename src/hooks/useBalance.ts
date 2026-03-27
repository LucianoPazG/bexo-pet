// src/hooks/useBalance.ts
import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { getWalletBalance, calculateBalancePoints } from '../utils/blockchain';
import { getXOConnectProvider } from '../lib/xo-connect';

export function useBalance() {
  const [rawBalance, setRawBalance] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState(false);

  const address = useGameStore(state => state.address);
  const updatePoints = useGameStore(state => state.updatePoints);

  const refresh = useCallback(async () => {
    if (!address) return;

    try {
      const provider = getXOConnectProvider();
      setIsLoading(true);

      const balance = await getWalletBalance(provider, address);
      setRawBalance(balance);

      const points = calculateBalancePoints(balance);
      updatePoints(points, useGameStore.getState().rarePoints);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setIsLoading(false);
    }
  }, [address, updatePoints]);

  useEffect(() => {
    refresh();

    // Auto-refresh every 30 seconds
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  const balancePoints = calculateBalancePoints(rawBalance);

  return {
    balancePoints,
    rawBalance,
    isLoading,
    refresh
  };
}
