import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
// import { AntDesign, Ionicons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../assets/constants';

type ToastProps = {
  type?: 'success' | 'warning'; // limité à deux valeurs possibles
  message: string;
  visible: boolean;
  onHide?: () => void; // fonction optionnelle
  icon?: React.ReactNode; // une icône personnalisée
  duration?: number; // Optionnelle pour augmenter la durée d'affichage lorsqu'il y'a depassement du budget
};

export default function Toast({ type = 'success', message, visible, onHide, icon, duration = 2500 }: ToastProps) {
  const translateY = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    let timer: NodeJS.Timeout; // variable du timer
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      //sauvegarder la reference du Timer
      timer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide && onHide();
        });
      }, duration); //utilisation de duration
    }
    
    //Nettoyage : s'exécute à la destruction du composant ou avant chaque nouvelle exécution de useEffect
    return () => {
      if (timer) {
        clearTimeout(timer); // Annule l'ancien timer
      }
    };
  }, [visible, duration]); //duration doit être une dependance

  if (!visible) return null;

  // Icône par défaut selon le type
  const defaultIcon = type === 'success'
    ? <Ionicons name="checkmark-circle-sharp" size={22} color="white" />
    : <Ionicons name="close-circle" size={22} color="white" />;

  const displayedIcon = icon || defaultIcon;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: type === 'success' ? COLORS.greenColor : COLORS.error,
          transform: [{ translateY }]
        }
      ]}
    >
      <View style={styles.iconWrapper}>
        {displayedIcon}
      </View>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    top: 40,
    left: 40,
    right: 40,
    zIndex: 100,
    padding: 10,
    borderRadius: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  iconWrapper: {
    // marginRight: 8,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  message: {
    flex: 1, //pour occuper toute l'espace dispo pour les long msg
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
