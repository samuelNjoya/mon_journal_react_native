import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

// Jeu avec 8 paires = 16 cartes
const CARDS = [
  '🐶', '🐶',
  '🐱', '🐱',
  '🐭', '🐭',
  '🐹', '🐹',
  '🐰', '🐰',
  '🦊', '🦊',
  '🐻', '🐻',
  '🐼', '🐼',
];

// Mélange des cartes (Fisher-Yates)
function shuffle(array) {
  let a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MemoryGame() {
  const [deck, setDeck] = useState(shuffle(CARDS));
  const [flipped, setFlipped] = useState([]); // indices des cartes retournées temporairement
  const [matched, setMatched] = useState([]); // indices des cartes déjà appariées
  const [disabled, setDisabled] = useState(false);

  const handleCardPress = index => {
    if (disabled || flipped.includes(index) || matched.includes(index)) return;

    if (flipped.length === 1) {
      setFlipped([...flipped, index]);
      setDisabled(true);
    } else {
      setFlipped([index]);
    }
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (deck[first] === deck[second]) {
        setMatched([...matched, first, second]);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  }, [flipped]);

  const numColumns = 4;
  const windowWidth = Dimensions.get('window').width;
  const cardSize = (windowWidth - 40) / numColumns;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jeu du Memory</Text>
      <View style={styles.grid}>
        {deck.map((item, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          return (
            <TouchableOpacity
              key={index}
              style={[styles.card, { width: cardSize, height: cardSize }, isFlipped && styles.cardFlipped]}
              onPress={() => handleCardPress(index)}
              activeOpacity={0.8}
            >
              <Text style={isFlipped ? styles.emoji : styles.cardBack}>?</Text>
              {isFlipped && <Text style={styles.emoji}>{item}</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#f0f4f7',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    margin: 5,
    backgroundColor: '#4a90e2',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cardFlipped: {
    backgroundColor: '#fff',
  },
  cardBack: {
    fontSize: 32,
    color: '#fff',
    position: 'absolute',
    top: '35%',
    left: '40%',
  },
  emoji: {
    fontSize: 40,
  },
});
