import { Dimensions } from "react-native";
const {width, height} = Dimensions.get('window');

export const COLORS = {
  Sourire: '#FFD700',       // jaune doré
  Tristesse: '#1E90FF',     // bleu dodger
  Amour: '#FF1493',         // rose vif
  Colere: '#FF4500',        // orange rouge
  Peur: '#8A2BE2',          // bleu violet
  Reflexion: '#20B2AA',     // vert turquoise clair
  PouceLeve: '#32CD32',  // vert lime
  Priere: '#FF69B4',        // rose chaud
  Fete: '#FFA500',          // orange
  Sommeil: '#708090',       // gris acier
};

export const MOOD = [
  { emoji: '😀', name: 'Sourire', note: 'Exprime la joie et la bonne humeur.',color:COLORS.Sourire },
  { emoji: '😢', name: 'Tristesse', note: 'Exprime la tristesse ou la déception.',color:COLORS.Tristesse },
  { emoji: '😍', name: 'Amour', note: 'Exprime l’affection ou l’admiration.',color:COLORS.Amour},
  { emoji: '😡', name: 'Colère', note: 'Exprime la colère ou la frustration.',color:COLORS.Colere },
  { emoji: '😱', name: 'Peur', note: 'Exprime la surprise ou la peur.',color:COLORS.Peur },
  { emoji: '🤔', name: 'Réflexion', note: 'Exprime la pensée ou l’interrogation.',color:COLORS.Reflexion },
  { emoji: '👍', name: 'Pouce levé', note: 'Exprime l’accord ou l’approbation.',color:COLORS.PouceLeve },
  { emoji: '🙏', name: 'Prière', note: 'Exprime la gratitude ou une requête.',color:COLORS.Priere },
  { emoji: '🎉', name: 'Fête', note: 'Exprime la célébration ou la joie.',color:COLORS.Fete },
  { emoji: '💤', name: 'Sommeil', note: 'Exprime la fatigue ou le besoin de repos.',color:COLORS.Sommeil },
];

export default { COLORS, MOOD };