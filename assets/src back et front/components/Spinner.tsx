/**
 * Composant affichant un loader simple
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../../assets/constants';

 type SpinnerProps = {
  visible:boolean;
 }

export default function Spinner({ visible }:SpinnerProps) {
   if (!visible) return null;
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.yellow_color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,//Le composant prend toute la taille de son parent 
    backgroundColor:'rgba(0,0,0,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  }
});
