// src/stores/shopStore.ts
import { create } from 'zustand';
import type { ShopItem, ItemTier } from '../types';

// Pricing configuration
export const ITEM_TIERS: Record<ItemTier, { name: string; price: number }> = {
  1: { name: 'Básico', price: 100 },
  2: { name: 'Común', price: 2000 },
  3: { name: 'Raro', price: 5000 },
  4: { name: 'Épico', price: 20000 },
  5: { name: 'Legendario', price: 100000 },
  6: { name: 'Exclusivo', price: 500000 }
};

// Shop items catalog
const SHOP_ITEMS: Record<string, ShopItem> = {
  'skin_basic_dog': {
    id: 'skin_basic_dog',
    name: 'Perrito Clásico',
    description: 'Tu compañero fiel pixelado',
    tier: 1,
    currency: 'rare',
    price: ITEM_TIERS[1].price,
    image: '/assets/skins/dog_basic.svg',
    category: 'skin'
  },
  'skin_cyber_cat': {
    id: 'skin_cyber_cat',
    name: 'Gato Cyberpunk',
    description: 'Felino del futuro con implantes',
    tier: 3,
    currency: 'rare',
    price: ITEM_TIERS[3].price,
    image: '/assets/skins/cat_cyber.svg',
    category: 'skin'
  },
  'skin_dragon_mythic': {
    id: 'skin_dragon_mythic',
    name: 'Dragón Mítico',
    description: 'Criatura legendaria de pixels dorados',
    tier: 6,
    currency: 'rare',
    price: ITEM_TIERS[6].price,
    image: '/assets/skins/dragon.svg',
    category: 'skin'
  },
  'scene_basic_room': {
    id: 'scene_basic_room',
    name: 'Habitación Básica',
    description: 'Un cuarto simple y acogedor',
    tier: 1,
    currency: 'balance',
    price: ITEM_TIERS[1].price,
    image: '/assets/scenes/room_basic.svg',
    category: 'scene'
  },
  'scene_cyber_city': {
    id: 'scene_cyber_city',
    name: 'Ciudad Cyberpunk',
    description: 'Skyline neón del año 2077',
    tier: 4,
    currency: 'balance',
    price: ITEM_TIERS[4].price,
    image: '/assets/scenes/city_cyber.svg',
    category: 'scene'
  },
  'decor_basic_lamp': {
    id: 'decor_basic_lamp',
    name: 'Lámpara Básica',
    description: 'Iluminación simple',
    tier: 1,
    currency: 'balance',
    price: ITEM_TIERS[1].price,
    image: '/assets/decor/lamp_basic.svg',
    category: 'decoration'
  },
  'decor_comfy_sofa': {
    id: 'decor_comfy_sofa',
    name: 'Sofá Confort',
    description: 'Asiento acogedor para tu mascota',
    tier: 2,
    currency: 'balance',
    price: ITEM_TIERS[2].price,
    image: '/assets/decor/sofa_comfy.svg',
    category: 'decoration'
  },
  'decor_disco_ball': {
    id: 'decor_disco_ball',
    name: 'Discothèque Ball',
    description: 'Luces de discoteca para fiestas',
    tier: 4,
    currency: 'balance',
    price: ITEM_TIERS[4].price,
    image: '/assets/decor/disco_ball.svg',
    category: 'decoration'
  }
};

interface ShopStore {
  items: typeof SHOP_ITEMS;
  getItem: (itemId: string) => ShopItem | undefined;
  getItemsByTier: (tier: ItemTier) => ShopItem[];
  getItemsByCategory: (category: 'skin' | 'scene' | 'decoration') => ShopItem[];
  getItemsByCurrency: (currency: 'balance' | 'rare') => ShopItem[];
}

export const useShopStore = create<ShopStore>(() => ({
  items: SHOP_ITEMS,

  getItem: (itemId) => {
    return SHOP_ITEMS[itemId];
  },

  getItemsByTier: (tier) => {
    return Object.values(SHOP_ITEMS).filter(item => item.tier === tier);
  },

  getItemsByCategory: (category) => {
    return Object.values(SHOP_ITEMS).filter(item => item.category === category);
  },

  getItemsByCurrency: (currency) => {
    return Object.values(SHOP_ITEMS).filter(item => item.currency === currency);
  }
}));
