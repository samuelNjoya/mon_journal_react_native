/**
 * Composant Header : entête commun de l'application
 * Affiche logo, nom, bouton +, notifications et photo profil
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { COLORS, FONTS } from "../../assets/constants";

interface HeaderProps {
  show_add_button?: boolean; // optionnel (par défaut false)
  on_add_expense?: () => void; // fonction optionnelle
}

export default function Header({ show_add_button = false, on_add_expense }:HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>S</Text>
        </View>

        <Text style={styles.appName}>SesamPayx</Text>
      </View>

      <View style={styles.rightIcons}> 
        {/* Bouton + fonction affichage conditionner en fonction de l'ecran*/}
        {show_add_button && (
          <TouchableOpacity style={styles.plusButton} onPress={on_add_expense}>
            <Text style={styles.plusButtonText}>+</Text>
          </TouchableOpacity>
        )}

        {/* Cloche notifications */}
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={COLORS.textPrimary}
          />
        </TouchableOpacity>

        {/* Photo profil ronde */}
        <TouchableOpacity>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/46.jpg" }}
            style={styles.profilePic}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily:FONTS.Poppins_Regular,
    //height: 56,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
    //shadowColor: "#000",
 //   shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 2,
   // marginTop:Platform.OS == 'ios'? 30:15,
    paddingTop:Platform.OS == 'ios'? 35:35,
    paddingBottom:10,
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.yellow_color,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
   // fontWeight: "bold",
    color: COLORS.black_color,
    fontSize: 18,
    fontFamily:FONTS.Poppins_Bold,
  },
  appName: {
   // fontWeight: "bold",
    fontSize: 20,
    color: COLORS.textPrimary,
    fontFamily:FONTS.Poppins_SemiBold
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  plusButton: {
    backgroundColor: COLORS.yellow_color,
    width: 30,
    height: 30,
    borderRadius: 6,
    //paddingVertical:1,
    //display:'flex',
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  plusButtonText: {
    color: COLORS.black_color,
   // fontWeight: "bold",
    fontSize: 20,
  //  lineHeight: 22,
    fontFamily:FONTS.Poppins_Regular,
  },
  iconButton: {
    marginRight: 12,
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
