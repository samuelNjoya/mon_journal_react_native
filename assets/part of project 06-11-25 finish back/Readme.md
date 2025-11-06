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
npm install prop-types //tres important si non ne fonctionne pas

# Pour le BottomSheet
npx expo install @gorhom/bottom-sheet

// il depends de ces deux bibiothèques et a un pb de version deconseiller
npx expo install react-native-reanimated react-native-gesture-handler


# Typage pour des valeurs optionnelles
type Props = {
  onHide?: () => void; // optionnel
};


# installe la police et ses variantes
npx expo install @expo-google-fonts/poppins or npx expo install @expo-google-fonts/poppins expo-app-loading
<AppLoading /> pour gerer le chargement pendant que la police se charge

# Pour le select Liste configurable en IOS et Android
finalement solution a adopter modal

# Pour le filtrage par plage de montant unidirectionnel
npx expo install @react-native-community/slider

# React native modals
npm install react-native-modal

# Tuto React Native : Slider de présentation avec pagination


le comportement actuel pour le filtre par montant est correcte car je ne fitre pas par categorie je 
filtre effectivement par montant ce qui veux dire que 

apres avoir tous supprimer et decider de recommencer pour que typescript puissse fonctionner 
et lever le rouge partout  Ouvre la palette de commandes : Ctrl + Shift + P

Tape : TypeScript: Restart TS server

Appuie sur Entrée

const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYjRkNjE4OTVlMzg0MzMxZTEwOWYyYzQ2Y2VkYWEwNTZhMzBhMWM1MDkyM2NkZDhkY2IyZWJhMjcxMzQyZmI0ZjUxN2U5ZGFjNWQ1ZWU2ZWQiLCJpYXQiOjE3NTYzOTQ1MzMsIm5iZiI6MTc1NjM5NDUzMywiZXhwIjoxNzg3OTMwNTMzLCJzdWIiOiIyMTI5NTEiLCJzY29wZXMiOltdfQ.AL8qjU5cr1sP5NFa4c90KCfQIIMZ3P3RuoX4w834xtKx-jzRd-36JC033cobielzT_fU8zUbeanJq3zT5mOMIp8z4vVy1lJaL1_nVyWDHQ7DmPyd9JgRjWn_WZ-AJ_zl5z86Trw4Ngf_fIYiSJhe-sB-hoWrPumZ2cf8qPAsRv7L9GqV8iLYIkIYTcNZTE57tjIt8IvzQBtJaxEgKBHKLORXLiC0m1kIV9e28hDlU1jc08gTNzq0fujH-YI914RISxRqwUJN5TltEV4luv6tDU23kgBkyF6abHvBX2BH3vO8oXtRBF-iZKg1ZBTjd4VACUZ_Y_sjiAgtFBuiQiUgTdbipChN7hfpVEbh4WKhX4SiEVJJL4oOZQ4ynxmMmAJdKkNOjOdjK90mBIsaSvpVdoQ5vjEfQOilWhG7Edgdf9ywaLx6wF8LYR6CMfF5XAGKzfaTYQoBLRJ1DPa4n_IsfkkpuNTdSN2iIyasFJn3sQerpsUPMPhmeyb7VixYTDUcme8xRr3EkYLOix0TbXrR3G80JiskGlQsiZ_wEfYs_diEEgB0Qu6vEsQnrgWFuWpqImk66RsWDZjxfseNGfnvnKD9ZTFa99wWFeJhoh7bkxc8jaSi7aDuY_nz_gfAulhF4BcjhMaGtlKJgYXtoUDkFAv3woSok8mQJ7THLojOFYs";

  headers: {
        Authorization: `Bearer ${token}`, 
        Accept: 'application/json',
      },


1. Qu’est-ce que SecureStore ?

SecureStore est un module d’Expo qui permet de stocker des données sensibles (token JWT, mot de passe, clé API…) de manière chiffrée sur le téléphone de l’utilisateur.
Contrairement à AsyncStorage, les données sont cryptées et inaccessibles à d’autres apps.
npx expo install expo-secure-store
