// src/utils/blockchain.test.ts
import { describe, it, expect } from 'vitest';
import { calculateBalancePoints } from './blockchain';

describe('Blockchain Utils', () => {
  describe('calculateBalancePoints', () => {
    it('should multiply balance by 5', () => {
      expect(calculateBalancePoints(BigInt(100))).toBe(500);
    });

    it('should return 0 for zero balance', () => {
      expect(calculateBalancePoints(BigInt(0))).toBe(0);
    });

    it('should handle large balances', () => {
      const largeBalance = BigInt('1000000000000000000'); // 1 ETH
      expect(calculateBalancePoints(largeBalance)).toBe(5000000000000000000);
    });
  });
});
