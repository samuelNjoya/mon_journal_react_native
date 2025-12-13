/**
 * Composant BtnPus : entête commun de l'application
 * Affiche logo, nom, bouton +, notifications et photo profil
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { COLORS, FONTS } from "../../../assets/constants";

interface BtnPusProps {
  show_add_button?: boolean; // optionnel (par défaut false)
  on_add_expense?: () => void; // fonction optionnelle
}

export default function BtnPus({ show_add_button = false, on_add_expense }: BtnPusProps) {
  return (
    <View >
        {/* Bouton + fonction affichage conditionner en fonction de l'ecran*/}
        {show_add_button && (
          <TouchableOpacity style={styles.plusButton} onPress={on_add_expense}>
            <Text style={styles.plusButtonText}>+</Text>
          </TouchableOpacity>
        )}

    </View>
  );
}

const styles = StyleSheet.create({

 
  plusButton: {
    backgroundColor: COLORS.yellow_color,
    width: 40,
    height: 40,
    borderRadius: 6,
     justifyContent: "center",
     alignItems: "center",
    //padding:8,
  },
  plusButtonText: {
    color: COLORS.black_color,
    fontSize: 20,
    fontFamily: FONTS.Poppins_Medium,
  },
 
  
});
