// src/hooks/useXOConnect.ts
import { useState, useCallback, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { getXOConnectProvider, initializeXOConnect } from '../lib/xo-connect';

export function useXOConnect() {
  const [error, setError] = useState<Error | null>(null);
  const { setWallet, disconnectWallet } = useGameStore();

  const connect = useCallback(async () => {
    try {
      setError(null);

      // Initialize XO Connect provider
      const provider = initializeXOConnect();

      // Request account access using eth_requestAccounts
      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No se obtuvieron cuentas de XO Connect');
      }

      // Get chain ID using eth_chainId
      const chainId = await provider.request({
        method: 'eth_chainId'
      });

      setWallet(accounts[0], chainId);

    } catch (err: any) {
      console.error('Error connecting wallet:', err);

      // Handle specific error codes
      if (err.code === 4001) {
        setError(new Error('Conexión rechazada por el usuario'));
      } else if (err.code === -32002) {
        setError(new Error('Ya hay una petición pendiente en Bexo Wallet'));
      } else {
        setError(err);
      }
    }
  }, [setWallet]);

  const disconnect = useCallback(() => {
    disconnectWallet();
    setError(null);
  }, [disconnectWallet]);

  // Listen for account/chain changes using XO Connect events
  useEffect(() => {
    let provider: any;

    try {
      provider = getXOConnectProvider();
    } catch {
      // Provider not initialized yet
      return;
    }

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected wallet
        disconnect();
      } else if (accounts[0] !== useGameStore.getState().address) {
        // User switched accounts
        setWallet(accounts[0], useGameStore.getState().chainId!);
      }
    };

    const handleChainChanged = (chainId: string) => {
      // User switched networks
      setWallet(useGameStore.getState().address!, chainId);
    };

    const handleDisconnect = (error: { code: number; message: string }) => {
      console.log('XO Connect disconnect:', error);
      disconnect();
    };

    // Subscribe to XO Connect events
    provider.on?.('accountsChanged', handleAccountsChanged);
    provider.on?.('chainChanged', handleChainChanged);
    provider.on?.('disconnect', handleDisconnect);

    // Cleanup on unmount
    return () => {
      provider.removeListener?.('accountsChanged', handleAccountsChanged);
      provider.removeListener?.('chainChanged', handleChainChanged);
      provider.removeListener?.('disconnect', handleDisconnect);
    };
  }, [setWallet, disconnect]);

  return {
    isConnected: useGameStore(state => state.isConnected),
    address: useGameStore(state => state.address),
    chainId: useGameStore(state => state.chainId),
    connect,
    disconnect,
    error
  };
}
