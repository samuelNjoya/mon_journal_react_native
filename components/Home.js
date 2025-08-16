import { Animated, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Home = () => {
  return (
    <SafeAreaView>
        <StatusBar  />
        <ScrollView>
            <Animated.View>
                 <Text>Home le monde</Text>
            </Animated.View>
              <Text>Home le monde comment allez vous</Text>
        </ScrollView>
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({})