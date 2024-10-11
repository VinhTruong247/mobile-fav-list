import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
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

type ApiResponse = ArtTool[];

export default function HomePage() {
  const { favorites, toggleFavorite } = useFavorites();
  const [artTools, setArtTools] = useState<ArtTool[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('All Brands');
  const [brands, setBrands] = useState<string[]>([]);
  const [currentToolIndex, setCurrentToolIndex] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    fetch('https://6691d77a26c2a69f6e90d592.mockapi.io/arttools')
      .then((response) => response.json() as Promise<ApiResponse>)
      .then((data) => {
        setArtTools(data);
        const uniqueBrands = Array.from(new Set(data.map((tool) => tool.brand)));
        setBrands(['All Brands', ...uniqueBrands]);

        const interval = setInterval(() => {
          setCurrentToolIndex((prevIndex) => (prevIndex + 1) % data.length);
        }, 3000);

        return () => clearInterval(interval);
      })
      .catch((error) => console.error('Error fetching art tools:', error));
  }, []);

  const filteredArtTools = selectedBrand === 'All Brands'
    ? artTools
    : artTools.filter(tool => tool.brand === selectedBrand);

  const listData = [
    {
      type: 'featured',
      artTool: artTools[currentToolIndex],
    },
    ...filteredArtTools.map(tool => ({ type: 'artTool', artTool: tool })),
  ];

  const renderItem = ({ item }: { item: { type: string; artTool: ArtTool } }) => {
    if (item.type === 'featured') {
      return (
        <View style={styles.featuredContainer}>
          {item.artTool && (
            <>
              <Image source={{ uri: item.artTool.image }} style={styles.featuredImage} />
              <Text style={styles.featuredArtName}>{item.artTool.artName}</Text>
              <Text style={styles.featuredPrice}>${item.artTool.price}</Text>
            </>
          )}
        </View>
      );
    } else {
      const { artTool } = item;
      return (
        <TouchableOpacity onPress={() => router.push(`/detail/${artTool.id}`)}>
          <View style={styles.artToolContainer}>           
            <Image source={{ uri: artTool.image }} style={styles.artImage} />
            <View style={styles.artDetails}>
              <Text style={styles.artName}>{artTool.artName}</Text>
              <Text style={styles.price}>${artTool.price}</Text>
              {artTool.limitedTimeDeal !== undefined && artTool.limitedTimeDeal > 0 && (
                <Text style={styles.dealText}>
                  {Math.round(artTool.limitedTimeDeal * 100)}% OFF
                </Text>
              )}
              <TouchableOpacity onPress={() => toggleFavorite(artTool)}>
                <FontAwesome
                  name={favorites.some(fav => fav.id === artTool.id) ? 'heart' : 'heart-o'}
                  size={24}
                  color={favorites.some(fav => fav.id === artTool.id) ? 'red' : 'gray'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.container_intro}>
        <Text style={styles.intro_text_1}>EXPLORE</Text>
        <Text style={styles.intro_text_2}>The Best Art Tools</Text>
      </View>

      <View style={{ marginTop: 8 }}>
        <FlatList
          horizontal
          data={brands}
          keyExtractor={(brand) => brand}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.brandButton, selectedBrand === item && styles.selectedBrandButton]}
              onPress={() => setSelectedBrand(item)}
            >
              <Text style={[styles.brandButtonText, selectedBrand === item && styles.selectedBrandButtonText]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.brandSelector}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <FlatList
        data={listData}
        keyExtractor={(item, index) => item.type === 'featured' ? 'featured' : item.artTool.id}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  container_intro: {
    marginTop: 50,
    marginHorizontal: 30,
  },
  intro_text_1: {
    fontSize: 40,
    letterSpacing: -2,
    fontWeight: "300",
  },
  intro_text_2: {
    fontSize: 35,
    fontWeight: "700",
    letterSpacing: -2,
  },
  featuredContainer: {
    marginHorizontal: 24,
    marginBottom: 14,
    padding: 20,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    alignItems: 'center',
  },
  featuredImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  featuredArtName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  featuredPrice: {
    color: '#555',
    fontSize: 16,
  },
  brandSelector: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  brandButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedBrandButton: {
    backgroundColor: '#000',
  },
  brandButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  selectedBrandButtonText: {
    color: '#fff',
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
  flatListContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
});