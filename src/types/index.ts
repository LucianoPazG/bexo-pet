// Blockchain types
export type ChainId = '0x1' | '0x89' | '0x38';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: ChainId | null;
}

// Points system
export interface Points {
  balancePoints: number;
  rarePoints: number;
}

// Shop items
export type ItemTier = 1 | 2 | 3 | 4 | 5 | 6;
export type Currency = 'balance' | 'rare';
export type Category = 'skin' | 'scene' | 'decoration';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  tier: ItemTier;
  currency: Currency;
  price: number;
  image: string;
  category: Category;
}

// Inventory
export interface Inventory {
  skins: string[];
  scenes: string[];
  decorations: string[];
}

export interface EquippedItems {
  skin: string;
  scene: string;
  decorations: string[];
}

// Storage (IndexedDB)
export interface StoredBalance {
  address: string;
  chainId: string;
  balance: string; // BigInt as string
  timestamp: number;
}

export interface StoredItem {
  address: string;
  itemId: string;
  purchasedAt: number;
}

// XO Connect Provider types (from library)
export interface Eip1193Provider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
}

// Mascot
export type MascotAnimation = 'idle' | 'happy' | 'sleep';
