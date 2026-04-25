
import { useState, useEffect } from 'react';

export function useFavorites<T extends { id: string }>(key: string) {
  const [favorites, setFavorites] = useState<T[]>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(favorites));
  }, [favorites, key]);

  const toggleFavorite = (item: T) => {
    setFavorites(prev => {
      const isFav = prev.some(f => f.id === item.id);
      if (isFav) {
        return prev.filter(f => f.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const isFavorite = (id: string) => favorites.some(f => f.id === id);

  return { favorites, toggleFavorite, isFavorite };
}
