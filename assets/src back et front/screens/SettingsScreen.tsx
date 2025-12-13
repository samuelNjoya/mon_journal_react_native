import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Switch,
    Alert,
    SafeAreaView,
    StatusBar,
    Share,
    Linking,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingsStackParamList } from '../navigation/MainNavigator';
import { useAuthAuthContext } from '../context/auth/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { APP_VERSION } from '../constants/constants';


type SettingsScreenNavigationProp = StackNavigationProp<SettingsStackParamList, 'SettingsMain'>;

const SettingsScreen = () => {
    const navigation = useNavigation<SettingsScreenNavigationProp>();
    const { t, language } = useTranslation();
    const { signOut } = useAuthAuthContext();
    const [settings, setSettings] = useState({
        notifications: true,
        biometricLogin: false,
        darkMode: false,
        currency: 'XAF',
        language: 'Français'
    });
    const [shared, setShared] = useState(false);
    // Données de partage
    const shareData = {
        title: t.setting.share_msg_title,
        message: t.setting.share_msg1 +
            t.setting.share_msg2 +
            t.setting.share_msg3 +
            t.setting.share_msg4 +
            t.setting.share_msg5 +
            t.setting.share_msg6 +
            t.setting.share_msg7,
        url: 'https://play.google.com/sesampayx'
    };

    const handleSettingChange = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    // Partage système (partage natif)
    const shareSystem = async () => {
        try {
            const result = await Share.share({
                title: shareData.title,
                message: shareData.message,
                url: shareData.url
            }, {
                dialogTitle: t.setting.dialog_title,
                subject: shareData.title
            });

            if (result.action === Share.sharedAction) {
                setShared(true);
            }
        } catch (error) {
            console.error('Erreur partage système:', error);
            Alert.alert(t.alerts.error, t.setting.share_error);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            t.setting.signout,
            t.setting.signout_confirm,
            [
                {
                    text: t.common.cancel,
                    style: 'cancel'
                },
                {
                    text: t.setting.signout,
                    style: 'destructive',
                    onPress: () => {
                        // Logique de déconnexion
                        //navigation.navigate('Login');
                        signOut()
                    }
                }
            ]
        );
    };

    const handleNote = async () => {
        switch (Platform.OS) {
            case 'android':
                await Linking.openURL("https://www.play.google.com/sesampayx");
                break;
            case 'ios':
                await Linking.openURL("https://www.store.apple.com/sesampayx");
                break;
            case 'windows':
                await Linking.openURL("https://www.store.microsoft.com/sesampayx");
                break;
            case 'macos':
                await Linking.openURL("https://www.store.apple.com/sesampayx");
                break;
        }
    }

    const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionContent}>
                {children}
            </View>
        </View>
    );

    const SettingsItem = ({
        icon,
        title,
        subtitle,
        color,
        onPress,
        rightComponent
    }: {
        icon: string;
        title: string;
        color: string;
        subtitle?: string;
        onPress?: () => void;
        rightComponent?: React.ReactNode;
    }) => (
        <TouchableOpacity
            style={styles.settingsItem}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.itemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: `${color}15`, }]}>
                    <Ionicons name={icon as any} size={22} color={color} />
                </View>
                <View style={styles.itemTextContainer}>
                    <Text style={styles.itemTitle}>{title}</Text>
                    {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            <View style={styles.itemRight}>
                {rightComponent || <Ionicons name="chevron-forward" size={20} color="#ccc" />}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#fcbf00" />
            {/* Header */}

            {/* <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#1a171a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Paramètres</Text>
                <View style={styles.headerRight} />
            </View> */}

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Section Compte */}
                <SettingsSection title={t.setting.my_account}>
                    <SettingsItem
                        icon="person"
                        color="#4D96FF"
                        title={t.setting.person_title}
                        onPress={() => navigation.navigate('Profile')}
                    />
                    <SettingsItem
                        icon="lock-closed"
                        title={t.setting.security_title}
                        color="#FF6B6B"
                        onPress={() => navigation.navigate('Security')}
                    />
                    <SettingsItem
                        icon="shield-checkmark-outline"
                        title={t.migrations.benefitAccount}
                        color="#F9A826"
                        onPress={() => navigation.navigate('benefit')}
                    />
                    {/* <SettingsItem
                        icon="card"
                        title="Moyens de paiement"
                    //onPress={() => navigation.navigate('PaymentMethods')}
                    /> */}
                </SettingsSection>

                {/* Section Préférences */}
                {/* <SettingsSection title="Préférences">
                    <SettingsItem
                        icon="notifications"
                        title="Notifications"
                        subtitle="Recevoir les alertes et notifications"
                        rightComponent={
                            <Switch
                                value={settings.notifications}
                                onValueChange={(value) => handleSettingChange('notifications', value)}
                                thumbColor={settings.notifications ? "#fcbf00" : "#f4f3f4"}
                                trackColor={{ false: "#767577", true: "#fff3c2" }}
                            />
                        }
                    />
                    <SettingsItem
                        icon="moon"
                        title="Mode sombre"
                        subtitle="Activer l'apparence sombre"
                        rightComponent={
                            <Switch
                                value={settings.darkMode}
                                onValueChange={(value) => handleSettingChange('darkMode', value)}
                                thumbColor={settings.darkMode ? "#fcbf00" : "#f4f3f4"}
                                trackColor={{ false: "#767577", true: "#fff3c2" }}
                            />
                        }
                    />
                    <SettingsItem
                        icon="finger-print"
                        title="Connexion biométrique"
                        subtitle="Déverrouiller avec empreinte/visage"
                        rightComponent={
                            <Switch
                                value={settings.biometricLogin}
                                onValueChange={(value) => handleSettingChange('biometricLogin', value)}
                                thumbColor={settings.biometricLogin ? "#fcbf00" : "#f4f3f4"}
                                trackColor={{ false: "#767577", true: "#fff3c2" }}
                            />
                        }
                    />
                </SettingsSection> */}

                {/* Section Application */}
                <SettingsSection title="Application">
                    <SettingsItem
                        icon="language"
                        title={t.setting.lang_title}
                        color="#4D96FF"
                        subtitle={settings.language}
                        onPress={() => navigation.navigate('Language')}
                    />
                    {/* <SettingsItem
                        icon="cash"
                        title="Devise"
                        subtitle={settings.currency}
                    //onPress={() => navigation.navigate('Currency')}
                    /> */}
                    <SettingsItem
                        icon="help-circle"
                        title={t.setting.help_title}
                        color="#6BCB77"
                        onPress={async () => { await Linking.openURL("https://www.sesampayx.com/tutoriel"); }}
                    //onPress={() => navigation.navigate('Tuto')}
                    />
                    <SettingsItem
                        icon="document-text"
                        title={t.setting.cu_title}
                        color="#FF6B6B"
                        onPress={async () => { await Linking.openURL("https://www.sesampayx.com/terms"); }}
                    //onPress={() => navigation.navigate('Terms')}
                    />
                    <SettingsItem
                        icon="shield-checkmark"
                        title={t.setting.poli_title}
                        color="#FF6B6B"
                        onPress={async () => { await Linking.openURL("https://www.sesampayx.com/privacy"); }}
                    //onPress={() => navigation.navigate('Privacy')}
                    />
                </SettingsSection>

                {/* Section À propos */}
                <SettingsSection title={t.benacc.about}>
                    <SettingsItem
                        icon="information-circle"
                        title={t.setting.version_title}
                        color="#4ECDC4"
                        subtitle={APP_VERSION}
                        onPress={() => Alert.alert(t.setting.version, 'Sesampayx ' + APP_VERSION)}
                    />
                    <SettingsItem
                        icon="star"
                        title={t.setting.note_title}
                        color="#F9A826"
                        onPress={handleNote}
                    />
                    <SettingsItem
                        icon="share-social"
                        title={t.setting.share_title}
                        color="#4D96FF"
                        onPress={shareSystem}
                    />
                </SettingsSection>

                {/* Bouton de déconnexion */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out" size={20} color="#FF3B30" />
                    <Text style={styles.logoutText}>{t.setting.signout}</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Sesampayx © 2026</Text>
                    <Text style={styles.footerSubtext}>{t.common.copyright}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fcbf00',
        paddingBottom: 10
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 17,
        fontFamily: "Poppins-SemiBold",
        color: '#1a171a',
    },
    headerRight: {
        width: 32,
    },
    scrollView: {
        flex: 1,
    },
    section: {
        marginTop: 16,
        marginHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 13,
        fontFamily: "Poppins-Medium",
        color: '#666',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f8f8f8',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,

        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemTextContainer: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: '#1a171a',
        marginBottom: 2,
    },
    itemSubtitle: {
        fontSize: 12,
        color: '#666',
        fontFamily: "Poppins-Regular",
    },
    itemRight: {
        marginLeft: 8,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFECEB',
    },
    logoutText: {
        color: '#FF3B30',
        fontFamily: "Poppins-SemiBold",
        fontSize: 16,
        marginLeft: 8,
    },
    footer: {
        alignItems: 'center',
        padding: 24,
        paddingBottom: 32,
    },
    footerText: {
        fontSize: 14,
        color: '#666',
        fontFamily: "Poppins-Medium",
    },
    footerSubtext: {
        fontSize: 11,
        color: '#999',
        marginTop: 4,
        fontFamily: "Poppins-Regular",
    },
});

export default SettingsScreen;