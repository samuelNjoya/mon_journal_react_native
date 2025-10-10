/**
 * Service pour gérer la persistance locale des données avec AsyncStorage mini base de donnée uniquement lire / écrire / supprimer dans AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Erreur sauvegarde AsyncStorage:', error);
  }
};

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Erreur lecture AsyncStorage:', error);
    return null;
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Erreur suppression AsyncStorage:', error);
  }
};
