import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';

const { width } = Dimensions.get('window');

const PrivilegeList = ({ badges }: any) => {
    const { t } = useTranslation();
    // Données des privilèges
    const benefits = [
        { id: 1, icon: "swap-horiz", color: "#2A4D8E" },
        { id: 2, icon: "payment", color: "#4CD964" },
        { id: 3, icon: "smartphone", color: "#FF9500" },
        { id: 4, icon: "savings", color: "#5856D6" },
        { id: 5, icon: "trending-up", color: "#FF3B30" },
        { id: 6, icon: "shield", color: "#AF52DE" },
        { id: 7, icon: "attach-money", color: "#34C759" },
        { id: 8, icon: "description", color: "#FFCC00" },
        { id: 9, icon: "trending-up", color: "#FF3B30" },
        { id: 10, icon: "shield", color: "#AF52DE" },
        { id: 11, icon: "attach-money", color: "#34C759" },
        { id: 12, icon: "description", color: "#FFCC00" },
        { id: 13, icon: "attach-money", color: "#34C759" },
        { id: 14, icon: "description", color: "#FFCC00" },
    ];
    const privileges = [
        {
            id: 1,
            title: 'Accès Premium',
            icon: '⭐',
            active: true
        },
        {
            id: 2,
            title: 'Support Prioritaire',
            icon: '🚀',
            active: true
        },
        {
            id: 3,
            title: 'Contenu Exclusif',
            icon: '🔒',
            active: false
        },
        {
            id: 4,
            title: 'Remises Spéciales',
            icon: '💰',
            active: true
        },
        {
            id: 5,
            title: 'Événements VIP',
            icon: '🎉',
            active: false
        },
        {
            id: 6,
            title: 'Accès Anticipé',
            icon: '🔍',
            active: true
        }
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t.migrations.myBenefits}</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {badges.map((badge: any, index: number) => (
                    <View style={styles.benefitItem} key={badge.id_badge}>
                        <View style={[styles.benefitIcon, { backgroundColor: badge.badge_color }]}>
                            <MaterialIcons name={benefits[index].icon} size={20} color='white' />
                        </View>
                        <Text style={styles.operationTitle}>{badge.title}</Text>
                        <Text style={styles.operationDesc}>{badge.description}</Text>
                    </View>
                    // <View
                    //     key={privilege.id}
                    //     style={[
                    //         styles.privilegeItem,
                    //         index === 0 && styles.firstItem,
                    //         index === privileges.length - 1 && styles.lastItem
                    //     ]}
                    // >
                    //     <Text style={[
                    //         styles.privilegeIcon,
                    //         !privilege.active && styles.inactiveIcon
                    //     ]}>
                    //         {privilege.icon}
                    //     </Text>
                    //     <Text style={[
                    //         styles.privilegeTitle,
                    //         !privilege.active && styles.inactiveText
                    //     ]}>
                    //         {privilege.title}
                    //     </Text>
                    //     {!privilege.active && (
                    //         <View style={styles.lockIndicator}>
                    //             <Text style={styles.lockText}>🔒</Text>
                    //         </View>
                    //     )}
                    // </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    title: {
        fontSize: 15,
        fontFamily: 'Poppins-Bold',
        marginHorizontal: 16,
        marginBottom: 10,
        color: '#2D3436',
    },
    scrollContent: {
        paddingHorizontal: 8,
    },
    privilegeItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginHorizontal: 6,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E9ECEF',
        minWidth: 100,
        position: 'relative',
    },
    firstItem: {
        marginLeft: 10,
    },
    lastItem: {
        marginRight: 10,
    },
    privilegeIcon: {
        fontSize: 24,
        marginBottom: 6,
    },
    privilegeTitle: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
        color: '#495057',
    },
    inactiveIcon: {
        opacity: 0.4,
    },
    inactiveText: {
        opacity: 0.6,
        color: '#6C757D',
    },
    lockIndicator: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 8,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockText: {
        fontSize: 10,
        color: 'white',
    },
    benefitItem: {
        flex: 1,
        alignItems: 'center',
        margin: 8,
        width: 180,
    },
    benefitIcon: {
        width: 35,
        height: 35,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    operationTitle: {
        fontSize: 8,
        fontFamily: 'Poppins-SemiBold',
        color: '#1a171a',
        // marginBottom: 2,
        textAlign: 'center',
    },
    operationDesc: {
        fontSize: 8,
        fontFamily: 'Poppins-Regular',
        color: '#666',
        textAlign: 'center',
    },
});

export default PrivilegeList;