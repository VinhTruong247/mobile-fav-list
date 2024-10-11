import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
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

type Feedback = {
  rating: number;
  comment: string;
  author: string;
  date: string;
};

export default function ToolDetailPage() {
  const { id } = useLocalSearchParams();
  const [tool, setTool] = useState<ArtTool | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
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

      setFeedbacks([
        {
          rating: 5,
          comment: "Imagine all the watches, living in conFusion!",
          author: "John Lemon",
          date: "2023-10-16T17:57:28.556094Z",
        },
        {
          rating: 4,
          comment:
            "Sends anyone to heaven, I wish I could get my mother-in-law to use it!",
          author: "Paul McVites",
          date: "2023-09-05T17:57:28.556094Z",
        },
        {
          rating: 3,
          comment: "Buy it, just buy it!",
          author: "Michael Jaikishan",
          date: "2024-02-13T17:57:28.556094Z",
        },
        {
          rating: 4,
          comment: "Ultimate, Reaching for the stars!",
          author: "Ringo Starry",
          date: "2023-12-02T17:57:28.556094Z",
        },
        {
          rating: 2,
          comment: "It's your birthday, we're gonna party!",
          author: "25 Cent",
          date: "2023-12-02T17:57:28.556094Z",
        },
        {
          rating: 1,
          comment: "Don't buy it!",
          author: "Michael Shala",
          date: "2023-12-11T17:57:28.556094Z",
        },
        {
          rating: 2,
          comment: "Poor stars!",
          author: "Ringo Starry",
          date: "2023-10-02T17:57:28.556094Z",
        },
        {
          rating: 3,
          comment: "Normal watch",
          author: "25 Cent",
          date: "2023-12-02T17:57:28.556094Z",
        },
      ]);
    }
  }, [id, navigation]);

  if (!tool) {
    return <Text>Loading...</Text>;
  }

  const isFavorite = favorites.some((fav) => fav.id === tool.id);
  const filteredFeedbacks = selectedRating
    ? feedbacks.filter((feedback) => feedback.rating === selectedRating)
    : feedbacks;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: tool.image }} style={styles.image} />
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

      <View style={styles.detailsContainer}>
        <Text style={styles.artName}>{tool.artName}</Text>
        <Text style={styles.price}>${tool.price}</Text>
        {tool.limitedTimeDeal !== undefined && tool.limitedTimeDeal > 0 && (
          <Text style={styles.dealText}>{Math.round(tool.limitedTimeDeal * 100)}% OFF</Text>
        )}
        <Text style={styles.brand}>Brand: {tool.brand}</Text>
      </View>

      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackTitle}>User Feedback</Text>

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Filter by rating:</Text>
          <Picker
            selectedValue={selectedRating}
            style={styles.picker}
            onValueChange={(itemValue) => {
              setSelectedRating(itemValue === 'all' ? null : Number(itemValue));
            }}
          >
            <Picker.Item label="All ratings" value="all" />
            <Picker.Item label="5 Stars" value={5} />
            <Picker.Item label="4 Stars" value={4} />
            <Picker.Item label="3 Stars" value={3} />
            <Picker.Item label="2 Stars" value={2} />
            <Picker.Item label="1 Star" value={1} />
          </Picker>
        </View>

        {filteredFeedbacks.length > 0 ? (
          filteredFeedbacks.map((feedback, index) => (
            <View key={index} style={styles.feedback}>
              <View style={styles.ratingContainer}>
                {Array.from({ length: 5 }, (_, i) => (
                  <FontAwesome
                    key={i}
                    name={i < feedback.rating ? 'star' : 'star-o'}
                    size={18}
                    color={i < feedback.rating ? 'gold' : 'gray'}
                  />
                ))}
              </View>
              <Text style={styles.comment}>"{feedback.comment}"</Text>
              <Text style={styles.author}>- {feedback.author}</Text>
              <Text style={styles.date}>
                {new Date(feedback.date).toLocaleDateString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noFeedbackText}>No feedback available for this rating.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    marginBottom: 16,
    backgroundColor: '#eaeaea',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  artName: {
    fontWeight: '600',
    fontSize: 24,
    marginBottom: 8,
    color: '#333',
  },
  price: {
    fontSize: 22,
    color: '#0a8747',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  dealText: {
    fontSize: 18,
    color: '#ff4d4f',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  brand: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  feedbackContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  feedbackTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 40,
  },
  feedback: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  comment: {
    fontStyle: 'italic',
    marginBottom: 4,
    color: '#555',
  },
  author: {
    fontWeight: '600',
    marginBottom: 2,
    color: '#333',
  },
  date: {
    color: '#999',
    fontSize: 12,
  },
  noFeedbackText: {
    textAlign: 'center',
    color: '#999',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
});