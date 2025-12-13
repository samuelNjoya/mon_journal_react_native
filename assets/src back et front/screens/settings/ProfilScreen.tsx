import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    Modal,
    TextInput,
    Switch,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { homeService } from '../../api/services/home';
import { formatDate } from '../../utils/helpers';
import { storage } from '../../utils/storage';
import { useAuthAuthContext } from '../../context/auth/AuthContext';
import LoadingScreen from '../../components/LoadingScreen';
import ErrorModal from '../../components/Notification';
import { useTranslation } from '../../hooks/useTranslation';

interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: string;
    accountStatus: 'Active' | 'Inactive' | 'suspended';
    accountType: 'standard' | 'premium' | 'business';
    birthdate: string;
    gender: string;
    account_number: string | null;
}

interface ConnectedDevice {
    id: string;
    deviceName: string;
    deviceType: 'mobile' | 'tablet' | 'desktop' | 'web';
    os: string;
    browser?: string;
    ipAddress: string;
    location: string;
    lastActive: string;
    isCurrentDevice: boolean;
    isActive: boolean;
}

const ProfileScreen: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [devices, setDevices] = useState<ConnectedDevice[]>([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDevicesModal, setShowDevicesModal] = useState(false);
    const [editableProfile, setEditableProfile] = useState<Partial<UserProfile>>({});
    const { authState } = useAuthAuthContext();
    const [acting, setActing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { t, language } = useTranslation();

    // Données mockées des appareils
    // const mockDevices: ConnectedDevice[] = [
    //     {
    //         id: '1',
    //         deviceName: 'iPhone 13 Pro',
    //         deviceType: 'mobile',
    //         os: 'iOS 16.5',
    //         ipAddress: '192.168.1.100',
    //         location: 'Paris, France',
    //         lastActive: 'Maintenant',
    //         isCurrentDevice: true
    //     },
    //     {
    //         id: '2',
    //         deviceName: 'MacBook Pro',
    //         deviceType: 'desktop',
    //         os: 'macOS Ventura',
    //         browser: 'Chrome 114',
    //         ipAddress: '192.168.1.101',
    //         location: 'Paris, France',
    //         lastActive: 'Il y a 3 heures',
    //         isCurrentDevice: false
    //     },
    //     {
    //         id: '3',
    //         deviceName: 'Samsung Galaxy S21',
    //         deviceType: 'mobile',
    //         os: 'Android 13',
    //         ipAddress: '89.156.234.12',
    //         location: 'Lyon, France',
    //         lastActive: 'Il y a 2 jours',
    //         isCurrentDevice: false
    //     },
    //     {
    //         id: '4',
    //         deviceName: 'iPad Air',
    //         deviceType: 'tablet',
    //         os: 'iPadOS 16',
    //         browser: 'Safari',
    //         ipAddress: '192.168.1.102',
    //         location: 'Paris, France',
    //         lastActive: 'Il y a 1 semaine',
    //         isCurrentDevice: false
    //     }
    // ];

    function getDateDifference(startDateStr: string, endDateStr?: string): number {
        let startDate = new Date(startDateStr);
        let endDate = endDateStr ? new Date(endDateStr) : new Date();

        // Vérification de validité
        if (isNaN(startDate.getTime())) {
            startDate = new Date();
        }
        if (endDateStr && isNaN(endDate.getTime())) {
            endDate = new Date();
        }

        // Normalisation des heures pour éviter les décalages
        startDate.setHours(12, 0, 0, 0);
        endDate.setHours(12, 0, 0, 0);

        const diffMs = endDate.getTime() - startDate.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        return diffDays;
    }

    // Chargement des données
    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            // Simulation d'appel API
            const result = await homeService.getProfileData()
            if (result.success && result.data) {
                if (result.data.status === 1) {
                    const devices: ConnectedDevice[] = result.data.sessions.map((item: any) => {
                        return {
                            id: item.id.toString(),
                            deviceName: item.hostname,
                            deviceType: item.host_os === 'android' || item.hot_os === 'ios' ? 'mobile' : 'desktop',
                            os: item.host_os,
                            lastActive: getDateDifference(item.start_time, item.end_time),
                            isCurrentDevice: item.token === authState.user?.sessionToken,
                            isActive: item.is_session_active === "1",
                        }
                    })
                    const data = result.data.user;
                    const profile: UserProfile = {
                        id: data.customer_account.id_customer_account,
                        firstName: data.person.firstname,
                        lastName: data.person.lastname,
                        email: data.customer_account.email,
                        phone: data.customer_account.phone_number,
                        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                        accountStatus: data.customer_account.id_account_state === "2" ? 'Active' : "Inactive",
                        accountType: 'premium',
                        birthdate: data.person.birthdate,
                        gender: data.person.gender,
                        account_number: data.customer_account.account_number
                    };
                    setProfile(profile);
                    setDevices(devices);
                } else {
                    setErrorMessage(result.data.err_msg)
                }
            } else {
                setErrorMessage(result.error)
            }


        } catch (error) {
            //console.error('Erreur chargement profil:', error);
            Alert.alert(t.alerts.error, t.profil.loading_error);
        } finally {
            setLoading(false);
        }
    };

    // Changer la photo de profil
    const changeProfilePicture = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissionResult.granted) {
                Alert.alert(t.profil.permission_title, t.profil.permission_text);
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                // Ici, vous enverriez l'image à votre API
                setProfile(prev => prev ? {
                    ...prev,
                    avatar: result.assets[0].uri
                } : null);
                Alert.alert(t.common.success, t.profil.updatepp);
            }
        } catch (error) {
            Alert.alert(t.common.error, t.profil.pp_error);
        }
    };

    // Déconnecter un appareil
    const logoutDevice = (deviceId: string) => {
        Alert.alert(
            t.setting.signout,
            t.profil.signout,
            [
                { text: t.common.cancel, style: 'cancel' },
                {
                    text: t.setting.signout,
                    style: 'destructive',
                    onPress: async () => {
                        setActing(true)
                        const result = await homeService.disconnectSession({ id_session: deviceId })
                        setActing(false)
                        if (result.success && result.data) {
                            if (result.data.status === 1) {
                                setDevices(prev => prev.filter(device => device.id !== deviceId));
                                Alert.alert(t.common.success, t.profil.deconnected);
                            } else {
                                setErrorMessage(result.data.err_msg)
                            }
                        } else {
                            setErrorMessage(result.error)
                        }
                    }
                }
            ]
        );
    };


    // Obtenir la couleur du statut
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified': return '#4ECDC4';
            case 'pending': return '#F9A826';
            case 'suspended': return '#FF6B6B';
            default: return '#CBD5E0';
        }
    };

    // Obtenir le texte du statut
    const getStatusText = (status: string) => {
        switch (status) {
            case 'verified': return 'Vérifié';
            case 'pending': return 'En attente';
            case 'suspended': return 'Suspendu';
            default: return 'Inconnu';
        }
    };

    // Obtenir le type de compte
    const getAccountTypeText = (type: string) => {
        switch (type) {
            case 'standard': return 'Standard';
            case 'premium': return 'Premium';
            case 'business': return 'Professionnel';
            default: return 'Inconnu';
        }
    };

    // Rendu d'un appareil
    const renderDeviceItem = (device: ConnectedDevice) => (
        <View key={device.id} style={styles.deviceItem}>
            <View style={styles.deviceHeader}>
                <View style={styles.deviceInfo}>
                    <View style={styles.deviceIconContainer}>
                        <Ionicons
                            name={getDeviceIcon(device.deviceType)}
                            size={24}
                            color="#fcbf00"
                        />
                    </View>
                    <View style={styles.deviceDetails}>
                        <Text style={styles.deviceName} numberOfLines={2}>{device.deviceName}</Text>
                        <Text style={styles.deviceSpecs} numberOfLines={2}>
                            {device.os} {device.browser ? `• ${device.browser}` : ''}
                        </Text>
                        <View style={styles.currentDeviceBadge}>
                            <Text style={[styles.currentDeviceText, { color: device.isActive ? '#4ECDC4' : '#FF6B6B' }]}>
                                {device.isActive ? t.profil.active : t.profil.inactive}
                            </Text>
                        </View>
                        {/* <Text style={styles.deviceLocation}>{"Inconnu"}</Text> */}
                    </View>
                </View>
                {device.isCurrentDevice ? (
                    <View style={styles.currentDeviceBadge}>
                        <Text style={[styles.currentDeviceText, { color: '#4D96FF' }]}>{t.profil.current}</Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.logoutDeviceButton}
                        onPress={() => logoutDevice(device.id)}
                    >
                        <Ionicons name="log-out" size={16} color="#FF6B6B" />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.deviceFooter}>
                <Text style={styles.deviceIp}>{t.profil.since}</Text>
                <Text style={styles.deviceLastActive}>{device.lastActive} {t.benacc.day}(s)</Text>
            </View>
        </View>
    );

    // Obtenir l'icône de l'appareil
    const getDeviceIcon = (deviceType: string) => {
        switch (deviceType) {
            case 'mobile': return 'phone-portrait';
            case 'tablet': return 'tablet-portrait';
            case 'desktop': return 'desktop';
            case 'web': return 'globe';
            default: return 'help-circle';
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fcbf00" />
                <Text style={styles.loadingText}>{t.profil.loading}...</Text>
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="person-circle" size={64} color="#CBD5E0" />
                <Text style={styles.errorText}>{t.profil.loading_error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadProfileData}>
                    <Text style={styles.retryButtonText}>{t.common.retry}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header avec photo de profil */}
                <View style={[styles.profileHeader]}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: profile.avatar }}
                            style={styles.avatar}
                        />
                        <TouchableOpacity
                            style={styles.editPhotoButton}
                            onPress={changeProfilePicture}
                        >
                            <Ionicons name="camera" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <View>
                        <Text style={styles.userName}>
                            {profile.lastName}
                        </Text>
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, marginLeft: 6, color: '#2D3748' }}>
                            {profile.firstName}
                        </Text>
                        <View style={styles.statusBadge}>
                            <Ionicons name="checkmark-circle" size={16} color="#4CD964" />
                            <Text style={styles.statusText}>{profile.accountStatus}</Text>
                        </View>
                    </View>

                    {/* <View style={styles.statusContainer}>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: getStatusColor(profile.accountStatus) }
                            ]}>
                                <Text style={styles.statusText}>
                                    {getStatusText(profile.accountStatus)}
                                </Text>
                            </View>
                            <View style={styles.accountTypeBadge}>
                                <Text style={styles.accountTypeText}>
                                    {getAccountTypeText(profile.accountType)}
                                </Text>
                            </View>
                        </View> */}
                </View>

                {/* Section Informations du compte */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t.profil.account}</Text>

                    <View style={styles.infoGrid}>
                        <View style={styles.infoItem}>
                            <Ionicons name="id-card-outline" size={20} color="#718096" />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>{t.profil.account_number}</Text>
                                <Text style={styles.infoValue}>{profile.account_number}</Text>
                            </View>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="mail" size={20} color="#718096" />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>{t.auth.email}</Text>
                                <Text style={styles.infoValue}>{profile.email}</Text>
                            </View>
                        </View>

                        <View style={styles.infoItem}>
                            <Ionicons name="call" size={20} color="#718096" />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>{t.tvOrders.tel}</Text>
                                <Text style={styles.infoValue}>{profile.phone}</Text>
                            </View>
                        </View>

                        <View style={styles.infoItem}>
                            <Ionicons name="calendar" size={20} color="#718096" />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>{t.signup.birthdate}</Text>
                                <Text style={styles.infoValue}>{formatDate(profile.birthdate)}</Text>
                            </View>
                        </View>

                        <View style={styles.infoItem}>
                            <Ionicons name="time" size={20} color="#718096" />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>{t.signup.gender}</Text>
                                <Text style={styles.infoValue}>{profile.gender}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Section Sécurité */}
                {/* <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Sécurité</Text>

                        <View style={styles.securityItem}>
                            <View style={styles.securityInfo}>
                                <Ionicons name="shield-checkmark" size={24} color="#4ECDC4" />
                                <View style={styles.securityContent}>
                                    <Text style={styles.securityTitle}>Vérification 2 facteurs</Text>
                                    <Text style={styles.securityDescription}>
                                        Protégez votre compte avec une authentification supplémentaire
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={profile.twoFactorEnabled}
                                onValueChange={(value) => setProfile(prev => prev ? { ...prev, twoFactorEnabled: value } : null)}
                                trackColor={{ false: '#E2E8F0', true: '#4ECDC4' }}
                            />
                        </View>

                        <View style={styles.securityItem}>
                            <View style={styles.securityInfo}>
                                <Ionicons name="notifications" size={24} color="#fcbf00" />
                                <View style={styles.securityContent}>
                                    <Text style={styles.securityTitle}>Notifications de sécurité</Text>
                                    <Text style={styles.securityDescription}>
                                        Recevez des alertes pour les activités suspectes
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={profile.notificationsEnabled}
                                onValueChange={(value) => setProfile(prev => prev ? { ...prev, notificationsEnabled: value } : null)}
                                trackColor={{ false: '#E2E8F0', true: '#fcbf00' }}
                            />
                        </View>
                    </View> */}

                {/* Section Appareils connectés */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{t.profil.device_title}</Text>
                        <TouchableOpacity
                            style={styles.seeAllButton}
                            onPress={() => setShowDevicesModal(true)}
                        >
                            <Text style={styles.seeAllText}>{t.operations.seeAll}</Text>
                            <Ionicons name="chevron-forward" size={16} color="#fcbf00" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.devicesList}>
                        {devices.slice(0, 2).map(renderDeviceItem)}
                    </View>

                    {devices.length > 2 && (
                        <TouchableOpacity
                            style={styles.moreDevicesButton}
                            onPress={() => setShowDevicesModal(true)}
                        >
                            <Text style={styles.moreDevicesText}>
                                Voir les {devices.length - 2} autres appareils
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Modal des appareils connectés */}
                <Modal
                    visible={showDevicesModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowDevicesModal(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={[styles.modalContent, styles.devicesModalContent]}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{t.profil.device_title}</Text>
                                <TouchableOpacity
                                    onPress={() => setShowDevicesModal(false)}
                                    style={styles.closeButton}
                                >
                                    <Ionicons name="close" size={24} color="#2D3748" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView style={styles.devicesModalBody}>
                                <Text style={styles.devicesCount}>
                                    {devices.length} appareil(s) connecté(s)
                                </Text>
                                {devices.map(renderDeviceItem)}
                            </ScrollView>

                            {/* <TouchableOpacity
                                style={styles.deconnectAllButton}
                                onPress={() => Alert.alert(
                                    'Déconnexion globale',
                                    'Déconnecter tous les appareils ?',
                                    [
                                        { text: 'Annuler', style: 'cancel' },
                                        {
                                            text: 'Déconnecter tout',
                                            style: 'destructive',
                                            onPress: () => {
                                                setDevices(devices.filter(d => d.isCurrentDevice));
                                                setShowDevicesModal(false);
                                            }
                                        }
                                    ]
                                )}
                            >
                                <Ionicons name="log-out" size={20} color="#FF6B6B" />
                                <Text style={styles.deconnectAllText}>Déconnecter tous les appareils</Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </Modal>
                <ErrorModal
                    visible={errorMessage !== ''}
                    message={errorMessage}
                    onClose={() => { setErrorMessage('') }}
                    type="error"
                />

            </ScrollView>
            {
                acting && <LoadingScreen />
            }
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#718096',
        fontFamily: 'Poppins-Regular',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#F8F9FA',
    },
    errorText: {
        fontSize: 16,
        color: '#718096',
        marginTop: 16,
        fontFamily: 'Poppins-Regular',
    },
    retryButton: {
        backgroundColor: '#fcbf00',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 16,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    profileHeader: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        flexDirection: 'row'
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    editPhotoButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fcbf00',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    userName: {
        fontSize: 14,
        color: '#2D3748',
        fontFamily: 'Poppins-Bold',
    },
    statusContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3F5EF',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 32,
        marginRight: 80
    },
    statusText: {
        color: '#2CC197',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 10,
        marginLeft: 4,
    },
    accountTypeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#F0FFF4',
        borderWidth: 1,
        borderColor: '#4ECDC4',
    },
    accountTypeText: {
        color: '#4ECDC4',
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    editProfileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#fcbf00',
    },
    editProfileText: {
        color: '#fcbf00',
        marginLeft: 8,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    section: {
        backgroundColor: '#FFFFFF',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2D3748',
        fontFamily: 'Poppins-SemiBold',
    },
    seeAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    seeAllText: {
        color: '#fcbf00',
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
    },
    infoGrid: {
        gap: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoContent: {
        marginLeft: 12,
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#718096',
        fontFamily: 'Poppins-Regular',
    },
    infoValue: {
        fontSize: 14,
        color: '#2D3748',
        fontWeight: '500',
        fontFamily: 'Poppins-Medium',
    },
    securityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    securityInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    securityContent: {
        marginLeft: 12,
        flex: 1,
    },
    securityTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D3748',
        fontFamily: 'Poppins-SemiBold',
    },
    securityDescription: {
        fontSize: 12,
        color: '#718096',
        marginTop: 2,
        fontFamily: 'Poppins-Regular',
    },
    devicesList: {
        gap: 12,
    },
    deviceItem: {
        backgroundColor: '#F7FAFC',
        padding: 12,
        borderRadius: 8,
    },
    deviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    deviceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    deviceIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFBF0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    deviceDetails: {
        flex: 1,
    },
    deviceName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D3748',
        fontFamily: 'Poppins-SemiBold',
    },
    deviceSpecs: {
        fontSize: 12,
        color: '#718096',
        marginTop: 2,
        fontFamily: 'Poppins-Regular',
    },
    deviceLocation: {
        fontSize: 11,
        color: '#A0AEC0',
        marginTop: 2,
        fontFamily: 'Poppins-Regular',
    },
    currentDeviceBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    currentDeviceText: {
        fontSize: 10,

        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    logoutDeviceButton: {
        padding: 4,
    },
    deviceFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    deviceIp: {
        fontSize: 10,
        color: '#A0AEC0',
        fontFamily: 'Poppins-Regular',
    },
    deviceLastActive: {
        fontSize: 10,
        color: '#A0AEC0',
        fontFamily: 'Poppins-Regular',
    },
    moreDevicesButton: {
        alignItems: 'center',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        marginTop: 8,
    },
    moreDevicesText: {
        color: '#fcbf00',
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    devicesModalContent: {
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2D3748',
        fontFamily: 'Poppins-SemiBold',
    },
    closeButton: {
        padding: 4,
    },
    modalBody: {
        padding: 16,
    },
    devicesModalBody: {
        padding: 16,
        maxHeight: 400,
    },
    devicesCount: {
        fontSize: 14,
        color: '#718096',
        marginBottom: 16,
        fontFamily: 'Poppins-Regular',
    },
    formGroup: {
        marginBottom: 16,
    },
    formLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 8,
        fontFamily: 'Poppins-SemiBold',
    },
    formInput: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    modalActions: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    cancelButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#F7FAFC',
        alignItems: 'center',
        marginRight: 8,
    },
    cancelButtonText: {
        color: '#718096',
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    saveButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#fcbf00',
        alignItems: 'center',
        marginLeft: 8,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    deconnectAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    deconnectAllText: {
        color: '#FF6B6B',
        fontWeight: '600',
        marginLeft: 8,
        fontFamily: 'Poppins-SemiBold',
    },
});

export default ProfileScreen;