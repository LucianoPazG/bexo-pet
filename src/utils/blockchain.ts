// src/utils/blockchain.ts
import type { Eip1193Provider } from '../types';

export function calculateBalancePoints(rawBalance: bigint): number {
  return Number(rawBalance) * 5;
}

/**
 * Get wallet balance using XO Connect provider
 * Uses eth_getBalance JSON-RPC method
 */
export async function getWalletBalance(
  provider: Eip1193Provider,
  address: string
): Promise<bigint> {
  const result = await provider.request({
    method: 'eth_getBalance',
    params: [address, 'latest']
  });
  return BigInt(result);
}

/**
 * Get staking balance from contract
 * Encodes balanceOf(address) call
 */
export async function getStakingBalance(
  provider: Eip1193Provider,
  contractAddress: string,
  userAddress: string
): Promise<bigint> {
  // Encode balanceOf(address) call
  const balanceOfSelector = '0x70a08231'; // balanceOf(address)
  const paddedAddress = userAddress.slice(2).padStart(64, '0');
  const callData = balanceOfSelector + paddedAddress;

  const result = await provider.request({
    method: 'eth_call',
    params: [{
      to: contractAddress,
      data: callData
    }, 'latest']
  });
  return BigInt(result);
}

/**
 * Safe RPC call with error handling
 */
export async function safeRPCCall<T>(
  provider: Eip1193Provider,
  method: string,
  params: any[]
): Promise<{ data?: T; error?: string }> {
  try {
    const result = await provider.request({ method, params });
    return { data: result };
  } catch (error: any) {
    if (error.code === -32603) {
      return { error: 'Error interno del nodo RPC' };
    } else if (error.code === -32000) {
      return { error: 'Límite de rate alcanzado' };
    } else {
      return { error: 'Error de red: ' + error.message };
    }
  }
}

/**
 * Shorten Ethereum address for display
 */
export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
