import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    ScrollView,
    Modal,
    TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { homeService } from '../../api/services/home';
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

interface Agency {
    id: string;
    name: string;
    type: 'agence' | 'partenaire';
    address: string;
    city: string;
    phone: string;
    email: string;
    latitude: number;
    longitude: number;
    hours: string;
    services: string[];
    distance?: number;
}

const AgenciesScreen: React.FC = () => {
    const [agencies, setAgencies] = useState<Agency[]>([]);
    const [filteredAgencies, setFilteredAgencies] = useState<Agency[]>([]);
    const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
    const [selectedType, setSelectedType] = useState<'all' | 'agence' | 'partenaire'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showMap, setShowMap] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [region, setRegion] = useState({
        latitude: 48.8566,
        longitude: 2.3522,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
    });

    // Données mockées des agences
    const mockAgencies: Agency[] = [
        {
            id: '1',
            name: 'Agence Paris Centre',
            type: 'agence',
            address: '123 Avenue des Champs-Élysées',
            city: 'Paris',
            phone: '+33 1 45 67 89 10',
            email: 'paris@banque.com',
            latitude: 48.8738,
            longitude: 2.2950,
            hours: 'Lun-Ven: 9h-18h, Sam: 9h-13h',
            services: ['Comptes', 'Prêts', 'Investissements', 'Cartes'],
            distance: 1.2
        },
        {
            id: '2',
            name: 'Agence Lyon Part-Dieu',
            type: 'agence',
            address: '45 Rue de la République',
            city: 'Lyon',
            phone: '+33 4 78 90 12 34',
            email: 'lyon@banque.com',
            latitude: 45.7640,
            longitude: 4.8357,
            hours: 'Lun-Ven: 9h-17h, Sam: 9h-12h',
            services: ['Comptes', 'Prêts', 'Assurances'],
            distance: 2.5
        },
        {
            id: '3',
            name: 'Partenaire Marseille Vieux-Port',
            type: 'partenaire',
            address: '78 Quai du Port',
            city: 'Marseille',
            phone: '+33 4 91 23 45 67',
            email: 'marseille@partenaire.com',
            latitude: 43.2965,
            longitude: 5.3698,
            hours: 'Lun-Sam: 8h-20h, Dim: 10h-18h',
            services: ['Retraits', 'Dépôts', 'Informations'],
            distance: 3.8
        },
        {
            id: '4',
            name: 'Agence Toulouse Capitole',
            type: 'agence',
            address: '12 Place du Capitole',
            city: 'Toulouse',
            phone: '+33 5 67 89 01 23',
            email: 'toulouse@banque.com',
            latitude: 43.6045,
            longitude: 1.4440,
            hours: 'Lun-Ven: 9h-18h, Sam: 9h-13h',
            services: ['Comptes', 'Prêts', 'Épargne'],
            distance: 5.1
        },
        {
            id: '5',
            name: 'Partenaire Nice Promenade',
            type: 'partenaire',
            address: '56 Promenade des Anglais',
            city: 'Nice',
            phone: '+33 4 93 45 67 89',
            email: 'nice@partenaire.com',
            latitude: 43.6959,
            longitude: 7.2719,
            hours: 'Lun-Dim: 7h-22h',
            services: ['Retraits', 'Dépôts'],
            distance: 7.3
        },
        {
            id: '6',
            name: 'Agence Bordeaux Centre',
            type: 'agence',
            address: '89 Cours de l\'Intendance',
            city: 'Bordeaux',
            phone: '+33 5 56 78 90 12',
            email: 'bordeaux@banque.com',
            latitude: 44.8437,
            longitude: -0.5739,
            hours: 'Lun-Ven: 9h-17h30, Sam: 9h-12h30',
            services: ['Comptes', 'Prêts', 'Investissements', 'Conseil'],
            distance: 8.6
        }
    ];

    // Chargement des données
    useEffect(() => {
        const loadAgencies = async () => {
            try {
                // Simulation d'appel API
                // await new Promise(resolve => setTimeout(resolve, 1000));
                const result = await homeService.getAgencies()
                setAgencies(mockAgencies);
                setFilteredAgencies(mockAgencies);
            } catch (error) {
                console.error('Erreur chargement agences:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAgencies();
    }, []);

    // Filtrage des agences
    useEffect(() => {
        let filtered = agencies;

        // Filtre par type
        if (selectedType !== 'all') {
            filtered = filtered.filter(agency => agency.type === selectedType);
        }

        // Filtre par recherche
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(agency =>
                agency.name.toLowerCase().includes(query) ||
                agency.city.toLowerCase().includes(query) ||
                agency.address.toLowerCase().includes(query)
            );
        }

        setFilteredAgencies(filtered);
    }, [selectedType, searchQuery, agencies]);

    // Centrer la carte sur une agence
    const focusOnAgency = (agency: Agency) => {
        setRegion({
            latitude: agency.latitude,
            longitude: agency.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });
        setSelectedAgency(agency);
    };

    // Rendu d'une agence dans la liste
    const renderAgencyItem = ({ item }: { item: Agency }) => (
        <TouchableOpacity
            style={styles.agencyCard}
            onPress={() => setSelectedAgency(item)}
        >
            <View style={styles.agencyHeader}>
                <View style={styles.agencyInfo}>
                    <View style={styles.agencyTitleContainer}>
                        <Text style={styles.agencyName}>{item.name}</Text>
                        <View style={[
                            styles.typeBadge,
                            item.type === 'agence' ? styles.agencyBadge : styles.partnerBadge
                        ]}>
                            <Text style={styles.typeText}>
                                {item.type === 'agence' ? 'Agence' : 'Partenaire'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.agencyDetails}>
                        <Ionicons name="location" size={14} color="#718096" />
                        <Text style={styles.agencyAddress}>{item.address}, {item.city}</Text>
                    </View>
                    <View style={styles.agencyDetails}>
                        <Ionicons name="time" size={14} color="#718096" />
                        <Text style={styles.agencyHours}>{item.hours}</Text>
                    </View>
                </View>
                <View style={styles.distanceContainer}>
                    {item.distance && (
                        <Text style={styles.distanceText}>{item.distance} km</Text>
                    )}
                    <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
                </View>
            </View>

            <View style={styles.servicesContainer}>
                {item.services.slice(0, 3).map((service, index) => (
                    <View key={index} style={styles.serviceTag}>
                        <Text style={styles.serviceText}>{service}</Text>
                    </View>
                ))}
                {item.services.length > 3 && (
                    <Text style={styles.moreServices}>+{item.services.length - 3}</Text>
                )}
            </View>

            <View style={styles.contactContainer}>
                <TouchableOpacity style={styles.contactButton}>
                    <Ionicons name="call" size={16} color="#fcbf00" />
                    <Text style={styles.contactText}>Appeler</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactButton}>
                    <Ionicons name="navigate" size={16} color="#fcbf00" />
                    <Text style={styles.contactText}>Itinéraire</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactButton}>
                    <Ionicons name="share-social" size={16} color="#fcbf00" />
                    <Text style={styles.contactText}>Partager</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    // Rendu de la carte
    const renderMap = () => (
        <View style={styles.mapContainer}>
            {/* <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                region={region}
                onRegionChangeComplete={setRegion}
            >
                {filteredAgencies.map(agency => (
                    <Marker
                        key={agency.id}
                        coordinate={{
                            latitude: agency.latitude,
                            longitude: agency.longitude
                        }}
                        title={agency.name}
                        description={agency.address}
                        onPress={() => focusOnAgency(agency)}
                    >
                        <View style={[
                            styles.markerContainer,
                            agency.type === 'agence' ? styles.markerAgency : styles.markerPartner
                        ]}>
                            <Ionicons
                                name={agency.type === 'agence' ? 'business' : 'storefront'}
                                size={20}
                                color="#FFFFFF"
                            />
                        </View>
                    </Marker>
                ))}
            </MapView> */}

            {/* Liste réduite en bas de la carte */}
            <View style={styles.mapListOverlay}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {filteredAgencies.map(agency => (
                        <TouchableOpacity
                            key={agency.id}
                            style={[
                                styles.mapAgencyCard,
                                selectedAgency?.id === agency.id && styles.mapAgencyCardSelected
                            ]}
                            onPress={() => focusOnAgency(agency)}
                        >
                            <Text style={styles.mapAgencyName}>{agency.name}</Text>
                            <Text style={styles.mapAgencyAddress}>{agency.city}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );

    // Rendu de la liste
    const renderList = () => (
        <FlatList
            data={filteredAgencies}
            renderItem={renderAgencyItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
                <View style={styles.emptyState}>
                    <Ionicons name="business" size={64} color="#CBD5E0" />
                    <Text style={styles.emptyTitle}>Aucune agence trouvée</Text>
                    <Text style={styles.emptyText}>
                        {searchQuery ? 'Aucun résultat pour votre recherche' : 'Aucune agence disponible'}
                    </Text>
                </View>
            }
        />
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fcbf00" />
                <Text style={styles.loadingText}>Chargement des agences...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Agences & Partenaires</Text>
                <Text style={styles.headerSubtitle}>
                    {filteredAgencies.length} {filteredAgencies.length > 1 ? 'résultats' : 'résultat'}
                </Text>
            </View>

            {/* Barre de recherche et filtres */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#A0AEC0" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Rechercher une agence, une ville..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#A0AEC0"
                    />
                </View>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setShowFilters(!showFilters)}
                >
                    <Ionicons name="filter" size={20} color="#718096" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.mapToggleButton}
                    onPress={() => setShowMap(!showMap)}
                >
                    <Ionicons
                        name={showMap ? "list" : "map"}
                        size={20}
                        color="#FFFFFF"
                    />
                    <Text style={styles.mapToggleText}>
                        {showMap ? "Liste" : "Carte"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Filtres */}
            {showFilters && (
                <View style={styles.filtersContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity
                            style={[
                                styles.filterChip,
                                selectedType === 'all' && styles.filterChipActive
                            ]}
                            onPress={() => setSelectedType('all')}
                        >
                            <Text style={[
                                styles.filterChipText,
                                selectedType === 'all' && styles.filterChipTextActive
                            ]}>
                                Tous
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.filterChip,
                                selectedType === 'agence' && styles.filterChipActive
                            ]}
                            onPress={() => setSelectedType('agence')}
                        >
                            <Ionicons
                                name="business"
                                size={16}
                                color={selectedType === 'agence' ? '#FFFFFF' : '#fcbf00'}
                            />
                            <Text style={[
                                styles.filterChipText,
                                selectedType === 'agence' && styles.filterChipTextActive
                            ]}>
                                Agences
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.filterChip,
                                selectedType === 'partenaire' && styles.filterChipActive
                            ]}
                            onPress={() => setSelectedType('partenaire')}
                        >
                            <Ionicons
                                name="storefront"
                                size={16}
                                color={selectedType === 'partenaire' ? '#FFFFFF' : '#4ECDC4'}
                            />
                            <Text style={[
                                styles.filterChipText,
                                selectedType === 'partenaire' && styles.filterChipTextActive
                            ]}>
                                Partenaires
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            )}

            {/* Contenu principal */}
            {showMap ? renderMap() : renderList()}

            {/* Modal de détail d'agence */}
            <Modal
                visible={selectedAgency !== null}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setSelectedAgency(null)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{selectedAgency?.name}</Text>
                            <TouchableOpacity
                                onPress={() => setSelectedAgency(null)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color="#2D3748" />
                            </TouchableOpacity>
                        </View>

                        {selectedAgency && (
                            <ScrollView style={styles.modalBody}>
                                <View style={styles.modalSection}>
                                    <Text style={styles.sectionTitle}>Adresse</Text>
                                    <View style={styles.sectionContent}>
                                        <Ionicons name="location" size={16} color="#718096" />
                                        <Text style={styles.sectionText}>
                                            {selectedAgency.address}, {selectedAgency.city}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.modalSection}>
                                    <Text style={styles.sectionTitle}>Horaires</Text>
                                    <View style={styles.sectionContent}>
                                        <Ionicons name="time" size={16} color="#718096" />
                                        <Text style={styles.sectionText}>{selectedAgency.hours}</Text>
                                    </View>
                                </View>

                                <View style={styles.modalSection}>
                                    <Text style={styles.sectionTitle}>Contact</Text>
                                    <View style={styles.sectionContent}>
                                        <Ionicons name="call" size={16} color="#718096" />
                                        <Text style={styles.sectionText}>{selectedAgency.phone}</Text>
                                    </View>
                                    <View style={styles.sectionContent}>
                                        <Ionicons name="mail" size={16} color="#718096" />
                                        <Text style={styles.sectionText}>{selectedAgency.email}</Text>
                                    </View>
                                </View>

                                <View style={styles.modalSection}>
                                    <Text style={styles.sectionTitle}>Services</Text>
                                    <View style={styles.servicesGrid}>
                                        {selectedAgency.services.map((service, index) => (
                                            <View key={index} style={styles.serviceChip}>
                                                <Text style={styles.serviceChipText}>{service}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>

                                <View style={styles.modalActions}>
                                    <TouchableOpacity style={styles.actionButton}>
                                        <Ionicons name="call" size={20} color="#FFFFFF" />
                                        <Text style={styles.actionText}>Appeler</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.actionButton}>
                                        <Ionicons name="navigate" size={20} color="#FFFFFF" />
                                        <Text style={styles.actionText}>Itinéraire</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const { width, height } = Dimensions.get('window');

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
    header: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D3748',
        fontFamily: 'Poppins-Bold',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#718096',
        marginTop: 4,
        fontFamily: 'Poppins-Regular',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7FAFC',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    filterButton: {
        padding: 8,
        marginRight: 12,
    },
    mapToggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fcbf00',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    mapToggleText: {
        color: '#FFFFFF',
        marginLeft: 4,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    filtersContainer: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F7FAFC',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    filterChipActive: {
        backgroundColor: '#fcbf00',
        borderColor: '#fcbf00',
    },
    filterChipText: {
        fontSize: 14,
        color: '#718096',
        marginLeft: 4,
        fontFamily: 'Poppins-Medium',
    },
    filterChipTextActive: {
        color: '#FFFFFF',
    },
    listContent: {
        padding: 16,
        flexGrow: 1,
    },
    agencyCard: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    agencyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    agencyInfo: {
        flex: 1,
        marginRight: 12,
    },
    agencyTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        flexWrap: 'wrap',
    },
    agencyName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
        marginRight: 8,
        fontFamily: 'Poppins-SemiBold',
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    agencyBadge: {
        backgroundColor: '#FFF0F0',
    },
    partnerBadge: {
        backgroundColor: '#F0FFF4',
    },
    typeText: {
        fontSize: 10,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    agencyDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    agencyAddress: {
        fontSize: 12,
        color: '#718096',
        marginLeft: 4,
        fontFamily: 'Poppins-Regular',
    },
    agencyHours: {
        fontSize: 12,
        color: '#718096',
        marginLeft: 4,
        fontFamily: 'Poppins-Regular',
    },
    distanceContainer: {
        alignItems: 'flex-end',
    },
    distanceText: {
        fontSize: 12,
        color: '#fcbf00',
        fontWeight: '600',
        marginBottom: 4,
        fontFamily: 'Poppins-SemiBold',
    },
    servicesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    serviceTag: {
        backgroundColor: '#F7FAFC',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8,
        marginBottom: 4,
    },
    serviceText: {
        fontSize: 10,
        color: '#718096',
        fontFamily: 'Poppins-Regular',
    },
    moreServices: {
        fontSize: 10,
        color: '#CBD5E0',
        fontFamily: 'Poppins-Regular',
    },
    contactContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 12,
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    contactText: {
        fontSize: 12,
        color: '#fcbf00',
        marginLeft: 4,
        fontFamily: 'Poppins-Medium',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#A0AEC0',
        marginTop: 16,
        marginBottom: 8,
        fontFamily: 'Poppins-SemiBold',
    },
    emptyText: {
        fontSize: 14,
        color: '#CBD5E0',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
    },
    // Styles pour la carte
    mapContainer: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    mapListOverlay: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
    },
    mapAgencyCard: {
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderRadius: 8,
        marginRight: 8,
        minWidth: 150,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    mapAgencyCardSelected: {
        backgroundColor: '#fcbf00',
    },
    mapAgencyName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D3748',
        fontFamily: 'Poppins-SemiBold',
    },
    mapAgencyAddress: {
        fontSize: 12,
        color: '#718096',
        marginTop: 2,
        fontFamily: 'Poppins-Regular',
    },
    markerContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    markerAgency: {
        backgroundColor: '#fcbf00',
    },
    markerPartner: {
        backgroundColor: '#4ECDC4',
    },
    // Styles pour le modal
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
        flex: 1,
        fontFamily: 'Poppins-SemiBold',
    },
    closeButton: {
        padding: 4,
    },
    modalBody: {
        padding: 16,
    },
    modalSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 8,
        fontFamily: 'Poppins-SemiBold',
    },
    sectionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    sectionText: {
        fontSize: 14,
        color: '#718096',
        marginLeft: 8,
        fontFamily: 'Poppins-Regular',
    },
    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    serviceChip: {
        backgroundColor: '#F7FAFC',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    serviceChipText: {
        fontSize: 12,
        color: '#718096',
        fontFamily: 'Poppins-Regular',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fcbf00',
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    actionText: {
        color: '#FFFFFF',
        fontWeight: '600',
        marginLeft: 8,
        fontFamily: 'Poppins-SemiBold',
    },
});

export default AgenciesScreen;