import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { AntDesign, Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../assets/constants';


const screenWidth = Dimensions.get('window').width;

const privileges = [
  { name: 'Premium Support',   detail: 'Assistance 24/7',           icon: 'headset',     color: COLORS.yellow_color }, 
  { name: 'Cashback Elite',    detail: 'Jusqu\'à 5% retour',       icon: 'tag',         color: COLORS.yellow_color }, 
  { name: 'Accès VIP',         detail: 'Salons d\'aéroport',       icon: 'star',        color: COLORS.yellow_color }, 
  { name: 'Protection Achat',  detail: 'Garantie 90 jours',        icon: 'shield-check', color: COLORS.yellow_color }, 
  { name: 'Voyages Premiums',  detail: 'Miles bonus x2',           icon: 'airplane',    color: COLORS.yellow_color }, 
  { name: 'Conciergerie',      detail: 'Service personnel',        icon: 'briefcase',   color: COLORS.yellow_color }, 
  { name: 'Assurance Plus',    detail: 'Couverture globale',       icon: 'heart-pulse', color: COLORS.yellow_color}, 
  { name: 'Événements Exclusifs', detail: 'Accès prioritaire',   icon: 'calendar-star', color: COLORS.yellow_color }, 
  { name: 'Rewards Plus',      detail: 'Points x3',                 icon: 'trophy',      color: COLORS.yellow_color }, 
  { name: 'Zero Frais',        detail: 'International',            icon: 'earth',       color: COLORS.yellow_color }, 
];



const PrivilegeItem = ({ item }: { item: typeof privileges[0] }) => {
    // Choisir l'icône appropriée en fonction du nom pour avoir les icônes de l'image
    const IconComponent = (
        <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
    );

    return (
        <TouchableOpacity style={stylesPriv.privilegeItem}>
            <View style={[stylesPriv.iconBackground, { backgroundColor: item.color + '15' }]}>
                {IconComponent}
            </View>
            <View style={stylesPriv.textContainer}>
                <Text style={stylesPriv.privilegeName}>{item.name}</Text>
                <Text style={stylesPriv.privilegeDetail}>{item.detail}</Text>
            </View>
        </TouchableOpacity>
    );
};



export default function PrivilegesSection ()  {
    return (
        <View style={stylesPriv.container}>
            {/* Titre Mes privilèges et Niveau Gold */}
            <View style={stylesPriv.titleRow}>
                <Text style={stylesPriv.mainTitle}>Mes privilèges</Text>
                <View style={stylesPriv.goldIndicator}>
                    <Text style={stylesPriv.goldText}>Niveau Gold</Text>
                </View>
            </View>

            {/* Grille des Privilèges */}
            <View style={stylesPriv.privilegesGrid}>
                {privileges.map((item) => (
                    <PrivilegeItem key={item.name} item={item} />
                ))}
            </View>
        </View>
    );
};


const stylesPriv = StyleSheet.create({
    container: {
        flex: 1,
       // backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    // Titre et Niveau Gold
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop:15,
        marginBottom: 15,
    },
    mainTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    goldIndicator: {
        backgroundColor: COLORS.font_color,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.yellow_color,
    },
    goldText: {
       fontSize: 12,
       fontFamily:FONTS.Poppins_Regular,
        color: COLORS.yellow_color,
    },

    // Grille des Privilèges
    privilegesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        backgroundColor:'white',
    },
    privilegeItem: {
        width: (screenWidth - 60) / 3, // 3 colonnes avec marges
        alignItems: 'center',
        marginBottom: 20,
        padding:10,
    },
    iconBackground: {
        width: 55,
        height: 55,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    textContainer: {
        alignItems: 'center',
        height: 40, // Pour uniformiser l'alignement de la grille
    },
    privilegeName: {
        fontFamily:FONTS.Poppins_SemiBold,
        fontSize:11,
        textAlign: 'center',
        color: '#333',
    },
    privilegeDetail: {
        fontFamily:FONTS.Poppins_Regular,
        fontSize:10,
        textAlign: 'center',
        color: '#666',
        marginTop: 2,
    },
});

