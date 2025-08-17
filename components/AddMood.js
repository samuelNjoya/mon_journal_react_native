// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const AddMood = () => {
//   return (
//     <View>
//       <Text>AddMood</Text>
//     </View>
//   )
// }

// export default AddMood

// const styles = StyleSheet.create({})

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
  Platform,
} from 'react-native';

export default function BlockBreaker() {
  const [score, setScore] = useState(0);

  const blocks = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    value: Math.floor(Math.random() * 100) + 1,
    color: i % 2 === 0 ? '#FF4C4C' : '#FF8C42',
  }));

  const onBlockPress = (value) => {
    setScore(score + value);
    Alert.alert('Bravo !', `Vous avez gagné ${value} points 🎉`, [{ text: 'OK' }]);
  };

  return (
    // SafeAreaView avec flex:1 pour prendre toute la fenêtre
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Jeu Casser les Blocs 💰</Text>
        <Text style={styles.score}>Score : {score} €</Text>
      </View>

      {/* Wrapper général pour forcer la hauteur sur web */}
      <View
        style={[
          styles.scrollWrapper,
          Platform.OS === 'web' && { height: window.innerHeight },
        ]}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {blocks.map((block) => (
            <TouchableOpacity
              key={block.id}
              style={[styles.block, { backgroundColor: block.color }]}
              activeOpacity={0.7}
              onPress={() => onBlockPress(block.value)}
            >
              <Text style={styles.blockText}>{block.value} €</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#0d47a1',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
  },
  score: {
    fontSize: 18,
    marginTop: 8,
    color: '#ffeb3b',
    fontWeight: '600',
  },
  scrollWrapper: {
    flex: 1,
    // Pas de hauteur fixe sur mobile mais forcée sur web par window.innerHeight
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  block: {
    width: '28%',
    aspectRatio: 1,
    margin: 8,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#333',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  blockText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
});
