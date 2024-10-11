import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
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
  const { favorites, toggleFavorite, clearFavorites } = useFavorites();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter favorites based on search query
  const filteredFavorites = favorites.filter(item =>
    item.artName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearFavorites}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search your favorites"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {filteredFavorites.length === 0 ? (
        <Text style={styles.emptyMessage}>No matching items found</Text>
      ) : (
        <FlatList
          data={filteredFavorites}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    padding: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  favoriteItemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  artImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  artDetails: {
    flex: 1,
    justifyContent: 'center',
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
    fontSize: 14,
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