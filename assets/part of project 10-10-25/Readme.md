# create
npx create-expo-app@latest sesampayx_depenses_v1 --template blank-typescript

# Fonts & icônes
npx expo install @expo-google-fonts/poppins @expo/vector-icons

# AsyncStorage
npx expo install @react-native-async-storage/async-storage

# DateTime Picker
npx expo install @react-native-community/datetimepicker

# Navigation (stack + bottom-tabs + dépendances)
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated

# Expo utilitaires
npx expo install expo-image-picker expo-status-bar expo-app-loading

# Charts + SVG + Lodash
npm install react-native-chart-kit react-native-svg lodash

# React Native Web (si besoin du support web)
npm install react-native-web react-dom

# 4. Installer les devDependencies pour TypeScript
npm install -D typescript @types/react @types/react-native











# Crée un projet Expo blank avec le nom SesamPayx_depenses
npx create-expo-app SesamPayx_depenses --template blank

# Installation de React Navigation, nécessaire pour la navigation par onglets (tab bar)
npx expo install @react-navigation/native

# Installe les dépendances natives recommandées par react-navigation
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated

# Installe la stack et le bottom tabs
npx expo install @react-navigation/native-stack @react-navigation/bottom-tabs

# Installation d'AsyncStorage pour la persistance locale
npx expo install @react-native-async-storage/async-storage

# Expo vector icons pour les icônes
npx expo install @expo/vector-icons

# React Native Paper (optionnel pour composants UI élégants, mais je vais utiliser principalement React Native de base)
# npx expo install react-native-paper

# Installer les dépendances pour les graphiques SVG genere une erreur a verifier encore tres bien
npx expo install react-native-svg react-native-svg-charts d3-shape
//bonne commande
npx expo install react-native-chart-kit react-native-svg
# tres tres important
npm install lodash important pour simplifier certains calculs ex:min et max





# Pour le date picker :
npx expo install @react-native-community/datetimepicker

# Pour l’image picker :
npx expo install expo-image-picker

# installer de typescript et les types pour comprendre le typage
npm install --save-dev typescript @types/react @types/react-native

# fitre par montant bidirectionnel
npm install @ptomasroos/react-native-multi-slider


# Typage pour des valeurs optionnelles
type Props = {
  onHide?: () => void; // optionnel
};


# installe la police et ses variantes
npx expo install @expo-google-fonts/poppins or npx expo install @expo-google-fonts/poppins expo-app-loading
<AppLoading /> pour gerer le chargement pendant que la police se charge

# Pour le select Liste configurable en IOS et Android
finalement solution a adopter modal

# Pour le filtrage par plage de montant
npx expo install @react-native-community/slider

