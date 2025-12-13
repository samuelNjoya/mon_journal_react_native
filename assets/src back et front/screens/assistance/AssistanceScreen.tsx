import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '../../hooks/useTranslation';
import { CALL_CENTER_EMAIL, CALL_CENTER_PHONE } from '../../constants/constants';

type AssistanceMenuItem = {
    id: string;
    title: string;
    description: string;
    icon: string;
    screen?: string;
    url?: string;
    color: string;
};

const AssistanceScreen: React.FC = () => {
    const navigation = useNavigation();
    const { t, language } = useTranslation();

    const menuItems: AssistanceMenuItem[] = [
        {
            id: 'tickets',
            title: t.assistance.menuItem1Title,
            description: t.assistance.menuItem1Text,
            icon: 'ticket',
            screen: 'TicketList',
            color: '#FF6B6B'
        },
        {
            id: 'announcements',
            title: t.assistance.menuItem2Title,
            description: t.assistance.menuItem2Text,
            icon: 'megaphone',
            screen: 'Announcements',
            color: '#4ECDC4'
        },
        {
            id: 'faq',
            title: 'FAQ',
            description: t.assistance.menuItem3Text,
            icon: 'help-circle',
            screen: 'FAQ',
            color: '#45B7D1'
        },
        {
            id: 'sales-points',
            title: 'Points de vente',
            description: t.assistance.menuItem4Text,
            icon: 'location',
            url: 'https://sesampayx.com/points-de-vente',
            color: '#F9A826',
            //screen: 'pointsOfSales',
        }
    ];

    const handleMenuItemPress = (item: AssistanceMenuItem) => {
        if (item.screen) {
            navigation.navigate(item.screen as never);
        } else if (item.url) {
            Linking.openURL(item.url);
        }
    };

    const MenuCard = ({ item }: { item: AssistanceMenuItem }) => (
        <TouchableOpacity
            style={styles.menuCard}
            onPress={() => handleMenuItemPress(item)}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon as any} size={28} color={item.color} />
            </View>

            <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header avec image vectorielle */}
            {/* <View style={styles.header}>
                <View style={styles.vectorContainer}>
                    <Image source={require('../../../assets/assistance.png')} style={{ width: 260, height: 180 }} />
                </View>
                <Text style={styles.title}>{t.assistance.title}</Text>
                <Text style={styles.subtitle}>
                    {t.assistance.subtitle}
                </Text>
            </View> */}

            {/* Message de contact */}
            <View style={styles.contactCard}>
                <Ionicons name="chatbubble-ellipses" size={24} color="#fcbf00" />
                <View style={styles.contactText}>
                    <Text style={styles.contactTitle}>{t.assistance.contactus}</Text>
                    <Text style={styles.contactDescription}>
                        {t.assistance.contactusSubtitle}
                    </Text>
                </View>
            </View>

            {/* Informations de contact directes */}
            <View style={styles.contactInfo}>
                <TouchableOpacity
                    style={styles.contactItem}
                    onPress={() => Linking.openURL(`tel:${CALL_CENTER_PHONE}`)}
                >
                    <Ionicons name="call" size={20} color="#4ECDC4" />
                    <Text style={styles.contactItemText}>{CALL_CENTER_PHONE}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.contactItem}
                    onPress={() => Linking.openURL(`mailto:${CALL_CENTER_EMAIL}`)}
                >
                    <Ionicons name="mail" size={20} color="#FF6B6B" />
                    <Text style={styles.contactItemText}>{CALL_CENTER_EMAIL}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.contactItem}
                    onPress={() => Linking.openURL('https://wa.me/' + CALL_CENTER_PHONE)}
                >
                    <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                    <Text style={styles.contactItemText}>{t.assistance.whatsapp}</Text>
                </TouchableOpacity>
            </View>

            {/* Menu d'assistance */}
            <View style={styles.menuSection}>
                <Text style={styles.menuTitle}>{t.assistance.menuTitle}</Text>
                {menuItems.map((item) => (
                    <MenuCard key={item.id} item={item} />
                ))}
            </View>

            {/* Section urgence */}
            <View style={styles.emergencyCard}>
                <Ionicons name="warning" size={24} color="#FF6B6B" />
                <View style={styles.emergencyContent}>
                    <Text style={styles.emergencyTitle}>{t.assistance.emergencyTitle}</Text>
                    <Text style={styles.emergencyText}>
                        {t.assistance.emergencyText}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    vectorContainer: {
        width: 280,
        height: 180,
        borderRadius: 60,
        // backgroundColor: '#FFF9E6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 26,
        fontFamily: 'Poppins-Bold',
        color: '#2D3748',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#718096',
        textAlign: 'center',
        lineHeight: 22,
        fontFamily: 'Poppins-Regular'
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        margin: 16,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    contactText: {
        flex: 1,
        marginLeft: 12,
    },
    contactTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2D3748',
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 4,
    },
    contactDescription: {
        fontSize: 12,
        color: '#718096',
        lineHeight: 16,
        fontFamily: 'Poppins-Regular'
    },
    contactInfo: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    contactItemText: {
        fontSize: 12,
        color: '#2D3748',
        marginLeft: 12,
        fontWeight: '500',
        fontFamily: 'Poppins-SemiBold'
    },
    menuSection: {
        padding: 16,
    },
    menuTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#2D3748',
        marginBottom: 10,
        marginLeft: 8,
    },
    menuCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuContent: {
        flex: 1,
    },
    //   menuTitle: {
    //     fontSize: 16,
    //     fontWeight: '600',
    //     color: '#2D3748',
    //     marginBottom: 4,
    //   },
    menuDescription: {
        fontSize: 11,
        color: '#718096',
        lineHeight: 14,
        fontFamily: 'Poppins-Regular',
    },
    emergencyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5F5',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#FF6B6B',
    },
    emergencyContent: {
        flex: 1,
        marginLeft: 12,
    },
    emergencyTitle: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: '#2D3748',
        marginBottom: 4,
    },
    emergencyText: {
        fontSize: 11,
        color: '#718096',
        lineHeight: 16,
        fontFamily: 'Poppins-Regular',
    },
});

export default AssistanceScreen;