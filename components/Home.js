// import { Animated, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
// import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// import React, { useEffect, useState } from 'react'
// import { COLORS, MOOD } from '../src/Theme';

// const Home = ({ navigation }) => {

//   const [todayMood, setTodayMood] = useState({ mood: { emoji: '🤔', name: 'Réflexion', note: 'Exprime la pensée ou l’interrogation.',color:COLORS.Reflexion } });
//   const [totalEntries, setTotalEntries] = useState(0);
//   const [fadeAnim] = useState(new Animated.Value(0));
//   const [translaleAnim] = useState(new Animated.Value(15));


//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true
//       }),
//       Animated.timing(translaleAnim, {
//         toValue: 1,
//         duration: 450,
//         useNativeDriver: true
//       })
//     ]).start()
//   }, [])

//   const selectMood = (mood) => {
//     navigation.navigate("AddMood", { selectedMood: mood })
//   }

//   return (
//     <SafeAreaView style={[styles.container]}>
//       <StatusBar />
//       <ScrollView contentContainerStyle={styles.scrollContain}>
//         <Animated.View
//           style={[
//             styles.header,
//             { opacity: fadeAnim, transform: [{ translateY: translaleAnim }] }
//           ]}
//         >
//           <View>
//             <Text>MoodJournal</Text>
//           </View>
//           <Text>Comment vous sentez vous aujourd'hui ?</Text>
//         </Animated.View>

//         {
//           todayMood ? (
//             <Animated.View>
//               <View style={{ backgroundColor: todayMood.mood.color }}>
//                 <View>
//                   <Text>Aujourd'hui</Text>
//                   <View>
//                     <Text>{todayMood.mood.emoji}</Text>
//                   </View>
//                 </View>
//                 <Text>{todayMood.mood.name}</Text>

//                 <View>
//                   <Text numberOfLines={2}>{todayMood.mood.note}</Text>
//                 </View>


//               </View>
//             </Animated.View>
//           ) : (
//             null
//           )
//         }


//         <Text>Selectionner votre Humeur</Text>
//         <View>
//           {
//             MOOD?.map((mood, index) => {
//               const delayedFadeAnim = new Animated.Value(0);
//               const delayedTranslateAnim = new Animated.Value(20)

//               Animated.parallel([
//                 Animated.timing(delayedFadeAnim, {
//                   toValue: 1,
//                   duration: 400,
//                   delay: index * 70,
//                   useNativeDriver: true
//                 }),
//                 Animated.timing(delayedTranslateAnim, {
//                   toValue: 0,
//                   duration: 400,
//                   delay: index * 70,
//                   useNativeDriver: true
//                 }),
//               ]).start()

//               return (
//                 <Animated.View
//                   key={index}
//                   style={{
//                     opacity: delayedFadeAnim,
//                     transform: [{ translateX: delayedTranslateAnim }]
//                   }}
//                 >
//                   <TouchableOpacity
//                     style={styles.mmoodCard}
//                     onPress={() => selectMood(mood)}
//                     activeOpacity={0.7}
//                   >
//                     <View>
//                       <View>
//                         <Text>{mood.emoji}</Text>
//                       </View>
//                       <Text>{mood.name}</Text>
//                     </View>

//                   </TouchableOpacity>
//                 </Animated.View>
//               )
//             })
//           }
//         </View>

//         <View style={styles.BottomSection}>
//           <View style={styles.statCard}>
//                <FontAwesome5 name="history" size={24} color="black" />
//                <View>{totalEntries}</View>
//                <View>Total des entrées</View>
//           </View>
//         </View>

//         <TouchableOpacity
//           onPress={()=> navigation.navigate("Historique")}
//           style={styles.buttonHistorique}
//         >
//           <View>
//               <MaterialIcons name="details" size={24} color="black" />
//               <Text>Voir historique</Text>
//           </View>
           
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   )
// }

// export default Home

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white"
//   },
//   scrollContain: {
//     flexGrow: 1,
//     paddingTop: 15,
//     paddingBottom: 30
//   },
//   header: {
//     //fontSize: 50,
//     padding:80,
//      margin:80,
//   },
//   buttonHistorique:{
//      padding:70,
//      margin:70,
//   }
// })

import React, { useEffect, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { COLORS, MOOD } from '../src/Theme';

const Home = ({ navigation }) => {
  // Etat de l'humeur du jour avec info emoji, nom, note et couleur
  const [todayMood, setTodayMood] = useState({
    mood: {
      emoji: '🤔',
      name: 'Réflexion',
      note: 'Exprime la pensée ou l’interrogation.',
      color: COLORS.Reflexion,
    },
  });

  // Etat pour total des entrées, paramètre d'exemple
  const [totalEntries, setTotalEntries] = useState(10);

  // Animations globales pour l'apparition du header
  const [fadeAnim] = useState(new Animated.Value(0));
  const [translateAnim] = useState(new Animated.Value(30));

  // Animation d'apparition du header et texte, sur le montage du composant
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Fonction appelée lors du choix d'une humeur
  const selectMood = (mood) => {
    navigation.navigate('AddMood', { selectedMood: mood });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView  contentContainerStyle={styles.scrollContain} showsVerticalScrollIndicator={true} >
        {/* Header animé avec opacité et translation verticale */}
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: translateAnim }] },
          ]}
        >
          <Text style={styles.title}>MoodJournal</Text>
          <Text style={styles.subtitle}>Comment vous sentez-vous aujourd'hui ?</Text>
        </Animated.View>

        {/* Section humeur du jour avec fond coloré et animation légère */}
        {todayMood && (
          <Animated.View style={[styles.todayMoodContainer, { backgroundColor: todayMood.mood.color }]}>
            <Text style={styles.todayLabel}>Aujourd'hui</Text>
            <Text style={styles.todayEmoji}>{todayMood.mood.emoji}</Text>
            <Text style={styles.todayName}>{todayMood.mood.name}</Text>
            <Text style={styles.todayNote} numberOfLines={2}>
              {todayMood.mood.note}
            </Text>
          </Animated.View>
        )}

        {/* Titre de la sélection d'humeur */}
        <Text style={styles.sectionTitle}>Sélectionnez votre humeur</Text>

        {/* Liste des humeurs avec animation d'apparition en cascade */}
        <View style={styles.moodList}>
          {MOOD?.map((mood, index) => {
            // Animation individuelle pour chaque carte mood
            const itemFadeAnim = new Animated.Value(0);
            const itemTranslateAnim = new Animated.Value(30);

            // Démarre l'animation en cascade avec un délai basé sur l'index
            useEffect(() => {
              Animated.parallel([
                Animated.timing(itemFadeAnim, {
                  toValue: 1,
                  duration: 400,
                  delay: index * 100,
                  useNativeDriver: true,
                }),
                Animated.timing(itemTranslateAnim, {
                  toValue: 0,
                  duration: 400,
                  delay: index * 100,
                  useNativeDriver: true,
                }),
              ]).start();
            }, []);

            return (
              <Animated.View
                key={mood.name}
                style={{
                  opacity: itemFadeAnim,
                  transform: [{ translateX: itemTranslateAnim }],
                }}
              >
                <TouchableOpacity
                  style={[styles.moodCard, { backgroundColor: mood.color + '33' }]} // Couleur claire en fond
                  onPress={() => selectMood(mood)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodName}>{mood.name}</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
        

        {/* Section stats avec icône et nombre */}
        <View style={styles.bottomSection}>
          <View style={styles.statCard}>
            <FontAwesome5 name="history" size={24} color={COLORS.dark} />
            <Text style={styles.statCount}>{totalEntries}</Text>
            <Text style={styles.statLabel}>Total des entrées</Text>
          </View>
        </View>

        {/* Bouton naviguant vers l'historique */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Historique')}
          style={styles.buttonHistorique}
          activeOpacity={0.8}
        >
          <MaterialIcons name="details" size={24} color="Black" />
          <Text style={styles.buttonText}>Voir historique</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles améliorés avec spacing, couleurs cohérentes, et effets visuels
const styles = StyleSheet.create({
  container: {
    flex: 1,
   // backgroundColor: COLORS.lightGray || '#F7F7F7', // Couleur douce pour le fond
  
  },
  scrollContain: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
     backgroundColor: 'green',
  },
  header: {
    marginBottom: 25,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.darkGray,
    marginTop: 6,
  },
  todayMoodContainer: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 8,
  },
  todayLabel: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  todayEmoji: {
    fontSize: 72,
    marginBottom: 10,
  },
  todayName: {
    fontSize: 26,
    fontWeight: '600',
    color: COLORS.primaryDark,
    marginBottom: 6,
  },
  todayNote: {
    color: COLORS.darkGray,
    fontSize: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: COLORS.primaryDark,
  },
  moodList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  moodCard: {
    width: '48%',
    paddingVertical: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 6,
  },
  moodEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  moodName: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.primaryDark,
  },
  bottomSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 15,
    elevation: 7,
    width: '70%',
  },
  statCount: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 4,
    color: COLORS.primaryDark,
  },
  statLabel: {
    color: COLORS.darkGray,
    fontSize: 16,
  },
  buttonHistorique: {
    //backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 60,
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default Home;
