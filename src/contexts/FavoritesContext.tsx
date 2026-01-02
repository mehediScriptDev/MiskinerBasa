import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Room } from '@/types/room';
import { mockRooms } from '@/data/mockRooms';

interface FavoritesContextType {
  favorites: string[];
  favoriteRooms: Room[];
  addFavorite: (roomId: string) => void;
  removeFavorite: (roomId: string) => void;
  toggleFavorite: (roomId: string) => void;
  isFavorite: (roomId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = 'miskinerbasha_favorites';

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
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

  const addFavorite = (roomId: string) => {
    setFavorites((prev) => (prev.includes(roomId) ? prev : [...prev, roomId]));
  };

  const removeFavorite = (roomId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== roomId));
  };

  const toggleFavorite = (roomId: string) => {
    setFavorites((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    );
  };

  const isFavorite = (roomId: string) => favorites.includes(roomId);

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
