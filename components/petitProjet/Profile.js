import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function Profile() {
  return (
    <View style={styles.card}>
      <Image
        style={styles.avatar}
        source={{ uri: 'https://randomuser.me/api/portraits/women/4.jpg' }}
      />
      <View style={styles.details}>
        <Text style={styles.name}>Alice Martin</Text>
        <Text style={styles.job}>Ingénieure Logiciel</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText} onPress={()=> Alert.alert("SUIVRE","suivez moi")}>Suivre</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', 
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.3,
    shadowRadius: 10,
    alignItems: 'center',
    margin: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35, // Cercle pour l'image
  },
  details: {
    flex: 1, // Prend tout l'espace à côté de l'image
    marginLeft: 15,
    backgroundColor: '#1e90ff',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  job: {
    color: 'gray',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
