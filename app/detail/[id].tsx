import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useFavorites } from '@/context/FavoritesContext';

type ArtTool = {
  id: string;
  artName: string;
  price: number;
  image: string;
  brand: string;
  limitedTimeDeal?: number;
};

export default function ToolDetailPage() {
  const { id } = useLocalSearchParams();
  const [tool, setTool] = useState<ArtTool | null>(null);
  const { favorites, toggleFavorite } = useFavorites();
  const navigation = useNavigation();

  useEffect(() => {
    if (id) {
      fetch(`https://6691d77a26c2a69f6e90d592.mockapi.io/arttools/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setTool(data);
          navigation.setOptions({ title: data.artName });
        })
        .catch((error) => console.error('Error fetching tool details:', error));
    }
  }, [id, navigation]);

  if (!tool) {
    return <Text>Loading...</Text>;
  }

  const isFavorite = favorites.some((fav) => fav.id === tool.id);

  return (
    <View style={styles.container}>
      <Image source={{ uri: tool.image }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.artName}>{tool.artName}</Text>
        <Text style={styles.price}>${tool.price}</Text>
        <Text style={styles.brand}>Brand: {tool.brand}</Text>

        {tool.limitedTimeDeal !== undefined && tool.limitedTimeDeal > 0 && (
          <Text style={styles.dealText}>{Math.round(tool.limitedTimeDeal * 100)}% OFF</Text>
        )}

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(tool)}
        >
          <FontAwesome
            name={isFavorite ? 'heart' : 'heart-o'}
            size={28}
            color={isFavorite ? 'red' : 'gray'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 16,
  },
  detailsContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  artName: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: 'green',
    marginBottom: 8,
  },
  brand: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  dealText: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  favoriteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});