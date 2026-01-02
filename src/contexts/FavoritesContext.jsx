import { createContext, useContext, useState, useEffect } from 'react';
import { mockRooms } from '@/data/mockRooms';

// Interface removed

const FavoritesContext = createContext(undefined);

const STORAGE_KEY = 'miskinerbasha_favorites';

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const favoriteRooms = mockRooms.filter((room) => favorites.includes(room.id));

  const addFavorite = (roomId) => {
    setFavorites((prev) => (prev.includes(roomId) ? prev : [...prev, roomId]));
  };

  const removeFavorite = (roomId) => {
    setFavorites((prev) => prev.filter((id) => id !== roomId));
  };

  const toggleFavorite = (roomId) => {
    setFavorites((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    );
  };

  const isFavorite = (roomId) => favorites.includes(roomId);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteRooms,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
