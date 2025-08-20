import { Alert, Animated, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddMood = ({ navigation, route }) => {

  const { selectedMood } = route.params;
  const [note, setNote] = useState("");
  const [isloading, setIsloading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  const saveMoodENtry = async () => {

    if (isloading) return; //on ne resoumet pas s'il y'a le chargement

    setIsloading(true)

    try {

      const newEntry = {
        id: Date.now().toString(),
        mood: selectedMood,
        note: note.trim(),
        date: new Date().toISOString()
      }

      const exitingEntries = await AsyncStorage.getItem('moodEntries');
      const entries = exitingEntries ? JSON.parse(exitingEntries) : [];

      const today = new Date().toDateString();
      const existingTodayIndex = entries.findIndex(entry => new Date(entry.date).toDateString() == today);

      if (existingTodayIndex !== -1) {
        entries[existingTodayIndex] = newEntry
      } else {
        entries.unshift(newEntry)
      }
      await AsyncStorage.setItem('moodEntries', JSON.stringify(entries))
      Alert.alert("Succes", "Votre humeur à été enegistrer",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      )

    } catch (error) {
      console.error("Erreur lors de la sauvegarde", error);
      Alert.alert("Erreur", "Impossible de charger votre humeur");
    } finally {
      setIsloading(false)
    }
  }

  // Animation d'apparition du header et texte, sur le montage du composant
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? 'padding' : 'height'}
          style={styles.KeyboardView}
        >

          <View style={styles.content}>
            <Animated.View
              style={[
                styles.header,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              <TouchableOpacity
                style={styles.buttonBack}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <AntDesign name="arrowleft" size={24} color="black" />
                <Text>Retour</Text>
              </TouchableOpacity>
            </Animated.View>


            <Animated.View
              style={[
                styles.moodSection,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              <TouchableOpacity activeOpacity={0.95}>
                <View style={{ alignItems: 'center', justifyContent: "center" }}>
                  <View>
                    <Text style={styles.moodEmoji}>{selectedMood.emoji}</Text>
                  </View>
                  <Text style={styles.moodName}>{selectedMood.name}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>


            <Animated.View
              style={[
                styles.inputSection,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              <Text style={styles.textQuestion}>
                <Feather name="edit-3" size={24} color="black" />
                Que s'est il passé ?
              </Text>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.inputText}
                  placeholder='Entrer votre humeur...'
                  multiline
                  value={note}
                  onChangeText={setNote}
                  numberOfLines={5}
                  textAlignVertical='top'
                >

                </TextInput>
              </View>
            </Animated.View>



            <Animated.View
              style={[
                styles.sectionButton,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              <TouchableOpacity
                style={[styles.saveButton, isloading && styles.saveButtonDisabled]}
                onPress={saveMoodENtry}
                disabled={isloading}
                activeOpacity={0.8}
              >
                <View>
                  <Feather name="check" size={24} color="black" />
                  <Text>
                    {isloading ? 'Enregistrement...' : 'Enregistrer'}
                  </Text>
                </View>
              </TouchableOpacity>

            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default AddMood

const PRIMARY = '#4A90E2';             // Bleu principal
const LIGHT = '#F9FAFB';               // Fond très clair
const CARD = '#FFFFFF';                // Cards et intermédiaires
const SHADOW = '#000000';              // Ombrage

const styles = StyleSheet.create({
  KeyboardView: {
    flex: 1,
    backgroundColor: LIGHT,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
  },
  // --- Header design ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 18,
  },
  buttonBack: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 4,
    elevation: 2,
    height: 100,

  },
  // --- Mood section ---
  moodSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    paddingBottom: 60,
    paddingTop: 20,
    backgroundColor: CARD,
    borderRadius: 24,
    shadowColor: SHADOW,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 3,
    minWidth: 210,
    minHeight: 110,
  },
  // Centrage emoji+nom
  moodEmoji: {
    paddingTop: 10,
    paddinBottom: 6,
    fontSize: 50,
    //marginBottom: 5,
  },
  moodName: {
    fontSize: 20,
    fontWeight: '700',
    color: PRIMARY,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 2,
  },
  // --- Input section ---
  inputSection: {
    flexDirection: 'columns',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    //backgroundColor: "red",
    borderRadius: 20,
    padding: 18,
    height: 200,
    borderRadius: 24,
    shadowColor: SHADOW,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 3,
  },
  textQuestion: {
    fontSize: 18,
    fontWeight: '600',
    color: PRIMARY,
    textAlign: 'center',
  },
  inputGroup: {
    borderRadius: 12,
    backgroundColor: LIGHT,
    borderWidth: 1,
    borderColor: '#e4e8ed',
    padding: 8,
    width: '100%',
  },
  inputText: {
    fontSize: 16,
    color: '#222',
    backgroundColor: 'transparent',
    minHeight: 70,
    maxHeight: 140,
    textAlignVertical: 'top',
    padding: 0,
  },
  // --- Save button ---
  saveButton: {
    backgroundColor: PRIMARY,
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  saveButtonDisabled: {
    backgroundColor: '#aacdf0',
  },
});
