import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
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

type ApiResponse = ArtTool[]; // Define the expected type of the API response

export default function HomePage() {
  const { favorites, toggleFavorite } = useFavorites();
  const [artTools, setArtTools] = useState<ArtTool[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('All Brands');
  const [brands, setBrands] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('https://6691d77a26c2a69f6e90d592.mockapi.io/arttools')
      .then((response) => response.json() as Promise<ApiResponse>)
      .then((data) => {
        setArtTools(data);
        const uniqueBrands = Array.from(new Set(data.map((tool) => tool.brand)));
        setBrands(['All Brands', ...uniqueBrands]);
      })
      .catch((error) => console.error('Error fetching art tools:', error));
  }, []);

  const filteredArtTools = selectedBrand === 'All Brands'
    ? artTools
    : artTools.filter(tool => tool.brand === selectedBrand);

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedBrand}
        onValueChange={(itemValue) => setSelectedBrand(itemValue)}
        style={styles.picker}
      >
        {brands.map(brand => (
          <Picker.Item key={brand} label={brand} value={brand} />
        ))}
      </Picker>

      <FlatList
        data={filteredArtTools}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/detail/${item.id}`)}>
            <View style={styles.artToolContainer}>
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
                  <FontAwesome
                    name={favorites.some(fav => fav.id === item.id) ? 'heart' : 'heart-o'}
                    size={24}
                    color={favorites.some(fav => fav.id === item.id) ? 'red' : 'gray'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
    marginTop: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingBottom: 16,
  },
  artToolContainer: {
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
    color: '#555',
    fontSize: 14,
  },
  dealText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 14,
  },
});