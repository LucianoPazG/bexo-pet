// src/hooks/useInventory.ts
import { useEffect, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { getInventory } from '../utils/storage';
import type { Currency } from '../types';

export function useInventory() {
  const address = useGameStore(state => state.address);
  const inventory = useGameStore(state => state.inventory);
  const setInventory = useGameStore(state => state.setInventory);
  const purchaseItem = useGameStore(state => state.purchaseItem);

  // Load inventory from IndexedDB when address changes
  useEffect(() => {
    if (!address) return;

    getInventory(address).then(items => {
      const skins = items.filter(id => id.startsWith('skin_'));
      const scenes = items.filter(id => id.startsWith('scene_'));
      const decorations = items.filter(id => id.startsWith('decor_'));

      setInventory({ skins, scenes, decorations });
    });
  }, [address, setInventory]);

  const equipItem = useCallback((itemId: string) => {
    if (itemId.startsWith('skin_')) {
      useGameStore.getState().equipSkin(itemId);
    } else if (itemId.startsWith('scene_')) {
      useGameStore.getState().equipScene(itemId);
    } else if (itemId.startsWith('decor_')) {
      useGameStore.getState().addDecoration(itemId);
    }
  }, []);

  const unequipDecoration = useCallback((decorationId: string) => {
    useGameStore.getState().removeDecoration(decorationId);
  }, []);

  return {
    ownedSkins: inventory.skins,
    ownedScenes: inventory.scenes,
    ownedDecorations: inventory.decorations,
    equippedSkin: useGameStore(state => state.equippedSkin),
    equippedScene: useGameStore(state => state.equippedScene),
    equippedDecorations: useGameStore(state => state.equippedDecorations),
    purchaseItem: (itemId: string, currency: Currency) =>
      address ? purchaseItem(itemId, currency, address) : Promise.resolve(false),
    equipItem,
    unequipDecoration
  };
}
