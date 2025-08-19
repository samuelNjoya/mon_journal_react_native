import { Alert, Animated, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddMood = ({ navigation, route }) => {

  const { selectedMood } = route.params;
  const [note, setNote] = useState("");
  const [isloading, setIsloading] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  const saveMoodENtry = async () => {

    if (isloading) return;

    setIsloading(true)

    try {

      const newEntry = {
        id:Date.now().toString(),
        mood:selectedMood,
        note:note.trim(),
        date:new Date.toString()
      }

      const exitingEntries = await AsyncStorage.getItem('moodEntries');
      const entries = exitingEntries ? JSON.parse(exitingEntries):[];

      const today = new Date().toDateString();
      const existingTodayIndex = entries.findIndex(entry => new Date(entry.date).toDateString() == today);

      if(existingTodayIndex !==-1){
        entries[existingTodayIndex] = newEntry
      }else{
        entries.unshift(newEntry)
      }
      await AsyncStorage.setItem('moodEntries',JSON.stringify(entries))
      Alert.alert("Succes","Votre humeur à été enegistrer",
        [{text:"OK", onPress:()=> navigation.goBack()}]
      )

    } catch (error) {
      console.error("Erreur lors de la sauvegarde");
      Alert.alert("Erreur", "Impossible de charger votre humeur", error);
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
              <TouchableOpacity>
                <View>
                  <View>
                    <View>
                      <Text>{selectedMood.emoji}</Text>
                    </View>
                    <Text>{selectedMood.name}</Text>
                  </View>
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
                styles.inputSection,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              <TouchableOpacity
                style={[styles.saveButton, isloading && styles.saveButtonDisabled]}
                onPress={saveMoodENtry}
                disabled={isloading}
                activeOpacity={0.8}
              >
                <Text>
                  <Feather name="check" size={24} color="black" />
                  {isloading ? 'Enregistrement...' : 'Enregistrer'}
                </Text>
              </TouchableOpacity>

            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default AddMood

const styles = StyleSheet.create({})
