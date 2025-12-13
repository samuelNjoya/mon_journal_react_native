import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    TextInput,
    Dimensions,
    Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Intersection {
    id: string;
    name: string;
    neighborhood: string;
    city: string;
    hasTrafficJam: boolean;
    trafficLevel: 'low' | 'medium' | 'high';
    lastUpdate: string;
    averageSpeed: number;
    alternativeRoutes: string[];
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

const TrafficIntersectionsScreen: React.FC = () => {
    const [intersections, setIntersections] = useState<Intersection[]>([]);
    const [filteredIntersections, setFilteredIntersections] = useState<Intersection[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCity, setSelectedCity] = useState<string>('all');
    const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
    const [showTrafficOnly, setShowTrafficOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [cities, setCities] = useState<string[]>([]);
    const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    // Données mockées des carrefours
    const mockIntersections: Intersection[] = [
        {
            id: '1',
            name: 'Carrefour Végas',
            neighborhood: 'Akwa',
            city: 'Douala',
            hasTrafficJam: true,
            trafficLevel: 'high',
            lastUpdate: 'Il y a 5 min',
            averageSpeed: 8,
            alternativeRoutes: ['Boulevard de la Liberté', 'Rue Joss'],
            coordinates: { latitude: 4.0511, longitude: 9.7679 }
        },
        {
            id: '2',
            name: 'Rond-Point Deïdo',
            neighborhood: 'Deïdo',
            city: 'Douala',
            hasTrafficJam: true,
            trafficLevel: 'medium',
            lastUpdate: 'Il y a 10 min',
            averageSpeed: 15,
            alternativeRoutes: ['Avenue des Cocotiers'],
            coordinates: { latitude: 4.0486, longitude: 9.7080 }
        },
        {
            id: '3',
            name: 'Carrefour ARNO',
            neighborhood: 'Bonapriso',
            city: 'Douala',
            hasTrafficJam: false,
            trafficLevel: 'low',
            lastUpdate: 'Il y a 15 min',
            averageSpeed: 45,
            alternativeRoutes: ['Rue Franqueville'],
            coordinates: { latitude: 4.0350, longitude: 9.6900 }
        },
        {
            id: '4',
            name: 'Rond-Point Nlongkak',
            neighborhood: 'Nlongkak',
            city: 'Yaoundé',
            hasTrafficJam: true,
            trafficLevel: 'high',
            lastUpdate: 'Il y a 3 min',
            averageSpeed: 5,
            alternativeRoutes: ['Avenue Kennedy', 'Rue Manguiers'],
            coordinates: { latitude: 3.8480, longitude: 11.5021 }
        },
        {
            id: '5',
            name: 'Carrefour Warda',
            neighborhood: 'Warda',
            city: 'Yaoundé',
            hasTrafficJam: false,
            trafficLevel: 'low',
            lastUpdate: 'Il y a 20 min',
            averageSpeed: 50,
            alternativeRoutes: ['Boulevard du 20 Mai'],
            coordinates: { latitude: 3.8686, longitude: 11.5215 }
        },
        {
            id: '6',
            name: 'Rond-Point Express',
            neighborhood: 'Mendong',
            city: 'Yaoundé',
            hasTrafficJam: true,
            trafficLevel: 'medium',
            lastUpdate: 'Il y a 8 min',
            averageSpeed: 20,
            alternativeRoutes: ['Route de Nsimalen'],
            coordinates: { latitude: 3.8550, longitude: 11.4800 }
        },
        {
            id: '7',
            name: 'Carrefour Total',
            neighborhood: 'Bonanjo',
            city: 'Douala',
            hasTrafficJam: true,
            trafficLevel: 'high',
            lastUpdate: 'Il y a 2 min',
            averageSpeed: 3,
            alternativeRoutes: ['Avenue du Général de Gaulle'],
            coordinates: { latitude: 4.0450, longitude: 9.6900 }
        },
        {
            id: '8',
            name: 'Rond-Point Marché Central',
            neighborhood: 'Centre Ville',
            city: 'Bafoussam',
            hasTrafficJam: false,
            trafficLevel: 'low',
            lastUpdate: 'Il y a 30 min',
            averageSpeed: 40,
            alternativeRoutes: ['Avenue des Mouvements'],
            coordinates: { latitude: 5.4770, longitude: 10.4246 }
        }
    ];

    // Chargement des données
    useEffect(() => {
        loadIntersections();
    }, []);

    const loadIntersections = async () => {
        try {
            setLoading(true);
            // Simulation d'appel API
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIntersections(mockIntersections);
            setFilteredIntersections(mockIntersections);

            // Extraire les villes et quartiers uniques
            const uniqueCities = Array.from(new Set(mockIntersections.map(item => item.city)));
            const uniqueNeighborhoods = Array.from(new Set(mockIntersections.map(item => item.neighborhood)));
            setCities(['all', ...uniqueCities]);
            setNeighborhoods(['all', ...uniqueNeighborhoods]);
        } catch (error) {
            console.error('Erreur chargement carrefours:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Filtrage des carrefours
    useEffect(() => {
        let filtered = intersections;

        // Filtre par ville
        if (selectedCity !== 'all') {
            filtered = filtered.filter(item => item.city === selectedCity);
        }

        // Filtre par quartier
        if (selectedNeighborhood !== 'all') {
            filtered = filtered.filter(item => item.neighborhood === selectedNeighborhood);
        }

        // Filtre embouteillages uniquement
        if (showTrafficOnly) {
            filtered = filtered.filter(item => item.hasTrafficJam);
        }

        // Filtre par recherche
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.neighborhood.toLowerCase().includes(query) ||
                item.city.toLowerCase().includes(query)
            );
        }

        setFilteredIntersections(filtered);
    }, [selectedCity, selectedNeighborhood, showTrafficOnly, searchQuery, intersections]);

    const onRefresh = () => {
        setRefreshing(true);
        loadIntersections();
    };

    const getTrafficColor = (level: string) => {
        switch (level) {
            case 'high': return '#FF6B6B';
            case 'medium': return '#F9A826';
            case 'low': return '#4ECDC4';
            default: return '#CBD5E0';
        }
    };

    const getTrafficIcon = (level: string) => {
        switch (level) {
            case 'high': return 'alert-circle';
            case 'medium': return 'warning';
            case 'low': return 'checkmark-circle';
            default: return 'help-circle';
        }
    };

    const getTrafficLabel = (level: string) => {
        switch (level) {
            case 'high': return 'Embouteillage sévère';
            case 'medium': return 'Circulation dense';
            case 'low': return 'Circulation fluide';
            default: return 'État inconnu';
        }
    };

    const renderIntersectionItem = ({ item }: { item: Intersection }) => (
        <TouchableOpacity style={styles.intersectionCard}>
            <View style={styles.cardHeader}>
                <View style={styles.nameContainer}>
                    <Text style={styles.intersectionName}>{item.name}</Text>
                    <View style={[
                        styles.trafficIndicator,
                        { backgroundColor: getTrafficColor(item.trafficLevel) }
                    ]}>
                        <Ionicons
                            name={getTrafficIcon(item.trafficLevel)}
                            size={16}
                            color="#FFFFFF"
                        />
                        <Text style={styles.trafficIndicatorText}>
                            {getTrafficLabel(item.trafficLevel)}
                        </Text>
                    </View>
                </View>
                <View style={styles.speedContainer}>
                    <Text style={styles.speedText}>{item.averageSpeed} km/h</Text>
                    <Text style={styles.speedLabel}>Vitesse moyenne</Text>
                </View>
            </View>

            <View style={styles.locationContainer}>
                <Ionicons name="location" size={14} color="#718096" />
                <Text style={styles.locationText}>
                    {item.neighborhood}, {item.city}
                </Text>
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                    <Ionicons name="time" size={14} color="#718096" />
                    <Text style={styles.detailText}>Mise à jour: {item.lastUpdate}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Ionicons name="car" size={14} color="#718096" />
                    <Text style={styles.detailText}>
                        {item.hasTrafficJam ? 'Embouteillage' : 'Circulation normale'}
                    </Text>
                </View>
            </View>

            {item.alternativeRoutes.length > 0 && (
                <View style={styles.routesContainer}>
                    <Text style={styles.routesTitle}>Itinéraires alternatifs:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {item.alternativeRoutes.map((route, index) => (
                            <View key={index} style={styles.routeTag}>
                                <Text style={styles.routeText}>{route}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}

            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="navigate" size={16} color="#fcbf00" />
                    <Text style={styles.actionText}>Itinéraire</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="share-social" size={16} color="#fcbf00" />
                    <Text style={styles.actionText}>Partager</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="alert" size={16} color="#fcbf00" />
                    <Text style={styles.actionText}>Signaler</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const renderFilterSection = () => (
        <View style={styles.filtersContainer}>
            {/* Barre de recherche */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#A0AEC0" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher un carrefour, quartier..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#A0AEC0"
                />
            </View>

            {/* Filtres rapides */}
            <View style={styles.quickFilters}>
                <View style={styles.filterRow}>
                    <Text style={styles.filterLabel}>Filtrer par:</Text>
                    <View style={styles.toggleContainer}>
                        <Text style={styles.toggleLabel}>Embouteillages uniquement</Text>
                        <Switch
                            value={showTrafficOnly}
                            onValueChange={setShowTrafficOnly}
                            trackColor={{ false: '#E2E8F0', true: '#fcbf00' }}
                            thumbColor={showTrafficOnly ? '#FFFFFF' : '#FFFFFF'}
                        />
                    </View>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
                    {/* Filtre Ville */}
                    <View style={styles.chipGroup}>
                        <Text style={styles.chipLabel}>Ville:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {cities.map(city => (
                                <TouchableOpacity
                                    key={city}
                                    style={[
                                        styles.filterChip,
                                        selectedCity === city && styles.filterChipActive
                                    ]}
                                    onPress={() => setSelectedCity(city)}
                                >
                                    <Text style={[
                                        styles.filterChipText,
                                        selectedCity === city && styles.filterChipTextActive
                                    ]}>
                                        {city === 'all' ? 'Toutes' : city}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Filtre Quartier */}
                    <View style={styles.chipGroup}>
                        <Text style={styles.chipLabel}>Quartier:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {neighborhoods.map(neighborhood => (
                                <TouchableOpacity
                                    key={neighborhood}
                                    style={[
                                        styles.filterChip,
                                        selectedNeighborhood === neighborhood && styles.filterChipActive
                                    ]}
                                    onPress={() => setSelectedNeighborhood(neighborhood)}
                                >
                                    <Text style={[
                                        styles.filterChipText,
                                        selectedNeighborhood === neighborhood && styles.filterChipTextActive
                                    ]}>
                                        {neighborhood === 'all' ? 'Tous' : neighborhood}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fcbf00" />
                <Text style={styles.loadingText}>Chargement des carrefours...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>État du Trafic</Text>
                <Text style={styles.headerSubtitle}>
                    {filteredIntersections.length} carrefour(s) surveillé(s)
                </Text>
            </View>

            {/* Filtres */}
            {renderFilterSection()}

            {/* Statistiques rapides */}
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <View style={[styles.statDot, { backgroundColor: '#FF6B6B' }]} />
                    <Text style={styles.statText}>
                        {intersections.filter(i => i.trafficLevel === 'high').length} Embouteillages
                    </Text>
                </View>
                <View style={styles.statItem}>
                    <View style={[styles.statDot, { backgroundColor: '#F9A826' }]} />
                    <Text style={styles.statText}>
                        {intersections.filter(i => i.trafficLevel === 'medium').length} Circulation dense
                    </Text>
                </View>
                <View style={styles.statItem}>
                    <View style={[styles.statDot, { backgroundColor: '#4ECDC4' }]} />
                    <Text style={styles.statText}>
                        {intersections.filter(i => i.trafficLevel === 'low').length} Fluide
                    </Text>
                </View>
            </View>

            {/* Liste des carrefours */}
            <FlatList
                data={filteredIntersections}
                renderItem={renderIntersectionItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="map" size={64} color="#CBD5E0" />
                        <Text style={styles.emptyTitle}>Aucun carrefour trouvé</Text>
                        <Text style={styles.emptyText}>
                            {searchQuery || selectedCity !== 'all' || selectedNeighborhood !== 'all' || showTrafficOnly
                                ? 'Aucun résultat pour les filtres sélectionnés'
                                : 'Aucun carrefour surveillé pour le moment'
                            }
                        </Text>
                    </View>
                }
            />
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
    filtersContainer: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7FAFC',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    quickFilters: {
        gap: 12,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D3748',
        fontFamily: 'Poppins-SemiBold',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleLabel: {
        fontSize: 12,
        color: '#718096',
        marginRight: 8,
        fontFamily: 'Poppins-Regular',
    },
    chipsContainer: {
        maxHeight: 80,
    },
    chipGroup: {
        marginRight: 16,
    },
    chipLabel: {
        fontSize: 12,
        color: '#718096',
        marginBottom: 4,
        fontFamily: 'Poppins-Regular',
    },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
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
        fontSize: 12,
        color: '#718096',
        fontFamily: 'Poppins-Medium',
    },
    filterChipTextActive: {
        color: '#FFFFFF',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FFFFFF',
        padding: 12,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statText: {
        fontSize: 10,
        color: '#718096',
        fontWeight: '500',
        fontFamily: 'Poppins-Medium',
    },
    listContent: {
        padding: 16,
        flexGrow: 1,
    },
    intersectionCard: {
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
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    nameContainer: {
        flex: 1,
        marginRight: 12,
    },
    intersectionName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 8,
        fontFamily: 'Poppins-SemiBold',
    },
    trafficIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    trafficIndicatorText: {
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: '600',
        marginLeft: 4,
        fontFamily: 'Poppins-SemiBold',
    },
    speedContainer: {
        alignItems: 'center',
    },
    speedText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fcbf00',
        fontFamily: 'Poppins-Bold',
    },
    speedLabel: {
        fontSize: 10,
        color: '#718096',
        fontFamily: 'Poppins-Regular',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationText: {
        fontSize: 12,
        color: '#718096',
        marginLeft: 4,
        fontFamily: 'Poppins-Regular',
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        fontSize: 12,
        color: '#718096',
        marginLeft: 4,
        fontFamily: 'Poppins-Regular',
    },
    routesContainer: {
        marginBottom: 12,
    },
    routesTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 4,
        fontFamily: 'Poppins-SemiBold',
    },
    routeTag: {
        backgroundColor: '#F0FFF4',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8,
    },
    routeText: {
        fontSize: 10,
        color: '#4ECDC4',
        fontFamily: 'Poppins-Regular',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    actionText: {
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
});

export default TrafficIntersectionsScreen;