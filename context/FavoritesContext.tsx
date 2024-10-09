import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ArtTool = {
    id: string;
    artName: string;
    price: number;
    image: string;
    brand: string;
    limitedTimeDeal?: number;
  };

const FavoritesContext = createContext({
  favorites: [] as ArtTool[],
  toggleFavorite: (tool: ArtTool) => {},
  loadFavorites: async () => {},
});

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<ArtTool[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const storedFavorites = await AsyncStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  };

  const toggleFavorite = async (tool: ArtTool) => {
    const isFavorite = favorites.some(fav => fav.id === tool.id);
    const updatedFavorites = isFavorite
      ? favorites.filter(fav => fav.id !== tool.id)
      : [...favorites, tool];

    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);