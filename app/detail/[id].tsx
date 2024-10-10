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
    backgroundColor: '#f7f7f7',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 16,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
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
  feedbackContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  picker: {
    flex: 1,
    height: 40,
  },
  feedback: {
    marginBottom: 16,
  },
  comment: {
    fontStyle: 'italic',
    marginBottom: 4,
  },
  author: {
    fontWeight: 'bold',
    marginBottom: 2,
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