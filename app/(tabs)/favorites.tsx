import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useFavorites } from '@/context/FavoritesContext';
import { useRouter } from 'expo-router';

type ArtTool = {
  id: string;
  artName: string;
  price: number;
  image: string;
  brand: string;
  limitedTimeDeal?: number;
};

const FavoritesPage = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const router = useRouter();

  const renderFavoriteItem = ({ item }: { item: ArtTool }) => (
    <TouchableOpacity onPress={() => router.push(`/detail/${item.id}`)}>
      <View style={styles.favoriteItemContainer}>
        <Image source={{ uri: item.image }} style={styles.artImage} />
        <View style={styles.artDetails}>
          <Text style={styles.artName}>{item.artName}</Text>
          <Text style={styles.price}>${item.price}</Text>
          {item.limitedTimeDeal !== undefined && item.limitedTimeDeal > 0 && (
            <Text style={styles.dealText}>
              {Math.round(item.limitedTimeDeal * 100)}% OFF
            </Text>
          )}
          <TouchableOpacity onPress={() => toggleFavorite(item)}>
            <FontAwesome name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.emptyMessage}>Let's start browsing</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id}
          renderItem={renderFavoriteItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 50,
  },
  favoriteItemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  artImage: {
    width: 100,
    height: 100,
    marginRight: 16,
  },
  artDetails: {
    flex: 1,
  },
  artName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  price: {
    fontSize: 14,
    color: 'green',
  },
  dealText: {
    color: 'red',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 16,
  },
  emptyMessage: {
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
    marginTop: 350,
  },
});

export default FavoritesPage;