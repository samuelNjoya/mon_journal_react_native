import React from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const DATA = [
  { id: '1', label: 'Premier item' },
  { id: '2', label: 'Deuxième item' },
  { id: '3', label: 'Troisième item' },
];

export default function InteractiveList() {
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={() => Alert.alert(`Appuyé sur ${item.label}`)}>
      <Text style={styles.text}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList 
      data={DATA} 
      renderItem={renderItem} 
      keyExtractor={item => item.id} 
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 20,
  },
  item: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 18,
  },
});
