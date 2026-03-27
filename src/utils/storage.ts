// src/utils/storage.ts
import Dexie, { Table } from 'dexie';
import type { StoredBalance, StoredItem } from '../types';

class BexoPetDB extends Dexie {
  balances!: Table<StoredBalance>;
  inventory!: Table<StoredItem>;

  constructor() {
    super('BexoPetDB');
    this.version(1).stores({
      balances: 'address, chainId, timestamp',
      inventory: 'address, itemId'
    });
  }
}

export const db = new BexoPetDB();

export async function saveLastBalance(
  address: string,
  chainId: string,
  balance: bigint
): Promise<void> {
  await db.balances.put({
    address,
    chainId,
    balance: balance.toString(),
    timestamp: Date.now()
  });
}

export async function getLastBalance(
  address: string,
  chainId: string
): Promise<bigint | null> {
  const record = await db.balances.where({ address, chainId }).last();
  return record ? BigInt(record.balance) : null;
}

export async function getInventory(address: string): Promise<string[]> {
  const items = await db.inventory.where('address').equals(address).toArray();
  return items.map(item => item.itemId);
}

export async function addItemToInventory(
  address: string,
  itemId: string
): Promise<void> {
  await db.inventory.add({
    address,
    itemId,
    purchasedAt: Date.now()
  });
}

export async function isItemOwned(
  address: string,
  itemId: string
): Promise<boolean> {
  const count = await db.inventory.where({ address, itemId }).count();
  return count > 0;
}
