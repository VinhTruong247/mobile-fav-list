import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ArtTool = {
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
  clearFavorites: () => {},
  loadFavorites: async () => {},
});

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<ArtTool[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async (tool: ArtTool) => {
    try {
      const isFavorite = favorites.some(fav => fav.id === tool.id);
      const updatedFavorites = isFavorite
        ? favorites.filter(fav => fav.id !== tool.id)
        : [...favorites, tool];

      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const clearFavorites = async () => {
    try {
      setFavorites([]);
      await AsyncStorage.removeItem('favorites');
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, loadFavorites, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);