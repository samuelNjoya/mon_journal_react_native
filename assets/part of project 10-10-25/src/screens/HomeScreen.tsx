import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { MaterialCommunityIcons, Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import PrivilegesSection from '../components/PrivilegesSection';
import Header from '../components/Header';
import { COLORS, FONTS } from '../../assets/constants';
import ExpenseChartLine from '../components/graphChart/ExpenseChartLine';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getData, saveData } from "../../services/storage";

// Définition de la largeur de l'écran pour les styles
const screenWidth = Dimensions.get('window').width;

 

const OperationsList = [
  { name: 'Transfert compte', icon: 'swap-horizontal', color: '#00B8D4'  }, // Violet
  { name: 'Transfert direct',icon: 'send-outline', color: '#6A1B9A' }, // Cyan
  { name: 'Recharger', icon: 'credit-card-refresh-outline', color: '#FF7043' }, // Orange
  { name: 'Carte Visa', icon: 'credit-card-outline', color: '#4CAF50' }, // Vert
  { name: 'Factures', icon: 'receipt-text-outline', color: '#C62828' }, // Rouge
  { name: 'Transactions', icon: 'format-list-bulleted', color: '#388E3C' }, // Vert foncé
  { name: 'Scanner', icon: 'qrcode-scan', color: '#0288D1' }, // Bleu
  { name: 'Plus', icon: 'dots-horizontal', color: '#757575' }, // Gris
];

const VisaCard = () => (
  <View style={styles.cardContainer}>
    <View style={styles.cardHeader}>
      <Text style={styles.card_solde_titulaire}>Carte Visa</Text>
      <FontAwesome name="cc-visa" size={24} color="black" />
    </View>
    <Text style={styles.cardType}>Visa Premium</Text>
    <Text style={styles.card_solde_titulaire}>Solde disponible</Text>
    <View style={styles.balanceRow}>
      <Text style={styles.cardBalance}>2,811,500 FCFA</Text>
    </View>
    <View style={styles.cardFooter}>
      <View>
        <Text style={styles.card_solde_titulaire}>Titulaire</Text>
        <Text style={styles.cardHolderName}>SOPHIE MARCEAU</Text>
      </View>
      <View style={{ flexDirection:'row', gap:2,}}>
         <AntDesign style={{ backgroundColor:COLORS.font_color,borderRadius:10,padding:2 }} name="eye-invisible" size={22} color="black" />
         <AntDesign style={{ backgroundColor:COLORS.font_color,borderRadius:10,padding:2 }} name="more" size={22} color="black" />
      </View>
    </View>
  </View>
);

const OperationItem = ({ name, icon, color }: { name: string, icon: string, color: string }) => (
  <TouchableOpacity style={styles.operationItem}>
    <View style={[styles.operationIconContainer, { backgroundColor: color + '20' }]}>
      <MaterialCommunityIcons name={icon as any} size={24} color={color} />
    </View>
    <Text style={styles.operationName}>{name}</Text>
  </TouchableOpacity>
);

export default function HomeScreen ()  {

 

  return (
    <View style={styles.fullScreen}>
        <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>

        {/* Carte Visa */}
        <VisaCard />

        {/* Offres Spéciales */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Offres spéciales</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>Toutes les offres</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.offerContainer}>
          <Text style={styles.offerTitle}>Programme Premium</Text>
          <Text style={styles.offerText}>Obtenez 5% de cashback sur tous vos achats</Text>
          <TouchableOpacity style={styles.offerButton}>
            <Text style={styles.offerButtonText}>En savoir plus</Text>
          </TouchableOpacity>
        </View>

        {/* Opérations */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Opérations</Text>
        </View>
        <View style={styles.operationsGrid}>
          {OperationsList.map((op) => (
            <OperationItem key={op.name} {...op} />
          ))}
        </View>
        {/* section stat graph */}
        <View>
           <ExpenseChartLine />
        </View>
        {/* section mes privillèges */}
        <View>
            <PrivilegesSection />
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    paddingBottom: 10,
    paddingTop:10,
    //padding:10,
  },
  
  // Carte Visa
  cardContainer: {
    width: screenWidth - 40,
    height: 200,
    marginHorizontal: 20,
    backgroundColor: COLORS.yellow_color, 
    borderRadius: 12,
    padding: 20,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card_solde_titulaire: {
    fontSize:12,
    fontFamily:FONTS.Poppins_Regular,
    color:COLORS.textSecondary,
  },
  cardType: {
    fontFamily:FONTS.Poppins_SemiBold,
    color:COLORS.black_color,
    marginBottom: 5,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  cardBalance: {
    fontFamily:FONTS.Poppins_Bold,
    fontSize:24,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardHolderName: {
   fontFamily:FONTS.Poppins_Medium,
    fontSize:16,
  },

  // Offres spéciales
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 10,
    
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily:FONTS.Poppins_SemiBold,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.yellow_color,
    fontFamily:FONTS.Poppins_Regular,
  },
  offerContainer: {
    width: screenWidth - 40,
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: COLORS.black_color,
    borderRadius: 10,
  },
  offerTitle: {
    fontFamily:FONTS.Poppins_SemiBold,
    color: COLORS.yellow_color,
  },
  offerText: {
   fontFamily:FONTS.Poppins_Regular,
   color:'white',
    marginVertical: 5,
  },
  offerButton: {
    backgroundColor: COLORS.yellow_color,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  offerButtonText: {
    fontFamily:FONTS.Poppins_SemiBold,
   // fontWeight: 'bold',
    fontSize: 14,
  },
  
  // Opérations
  operationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    marginBottom:20,
  },
  operationItem: {
    width: (screenWidth - (5 * 2 * 4) - 20) / 4,
     margin: 5,
    //width: (screenWidth - 20) / 4, // 4 items par ligne
    alignItems: 'center',
    paddingVertical: 10,
    //marginBottom: 10,
   // margin:10,
  // marginVertical:10,
    backgroundColor:'white',
    borderRadius:5,
  },
  operationIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  operationName: {
    fontSize: 11,
    textAlign: 'center',
    color: '#666',
    fontWeight: '500',
  },
});

