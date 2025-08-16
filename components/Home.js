import { Animated, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '../src/Theme';

const Home = () => {

  const [todayMood, setTodayMood] = useState({ mood:{ emoji: '😀', name: 'Sourire', note: 'Exprime la joie et la bonne humeur.',color:COLORS.Amour }});
  const [totalEntries, setTotalEntries] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [translaleAnim] = useState(new Animated.Value(15));


  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.timing(translaleAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true
      })
    ]).start()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <ScrollView contentContainerStyle={styles.scrollContain}>
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: translaleAnim }] }
          ]}
        >
          <View>
            <Text>MoodJournal</Text>
          </View>
          <Text>Comment vous sentez vous aujourd'hui ?</Text>
        </Animated.View>
        <Text>Hello team</Text>
        {
          todayMood ? (
            <Animated.View>
              <View style={{ backgroundColor:todayMood.mood.color }}>
                <View>
                  <Text>Aujourd'hui</Text>
                  <View>
                    <Text>{todayMood.mood.emoji}</Text>
                  </View>
                </View>
                <Text>{todayMood.mood.name}</Text>
                {todayMood.mood.note && (
                  <View>
                    <Text numberOfLines={2}>{todayMood.mood.note}</Text>
                  </View>
                )}

              </View>
            </Animated.View>
          ) : (
            null
          )
        }
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  scrollContain: {
    flexGrow: 1,
    paddingTop: 15,
    paddingBottom: 30
  },
  header: {
    fontSize: 50,
  }
})