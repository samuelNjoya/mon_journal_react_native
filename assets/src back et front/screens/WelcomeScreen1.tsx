import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    FlatList,
    Image,
    Animated,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { useAuthAuthContext } from '../context/auth/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Données du carousel
const carouselData = [
    {
        id: '1',
        title: 'Gestion Budgétaire Intelligente',
        description: 'Suivez vos dépenses et optimisez votre budget avec nos outils avancés',
        image: require('../../assets/carousel/budget.png'), // Remplacez par vos images
        color: '#4cd964'
    },
    {
        id: '2',
        title: 'Investissements Performants',
        description: 'Analysez et gérez vos investissements pour maximiser vos rendements',
        image: require('../../assets/carousel/investment.png'),
        color: '#007AFF'
    },
    {
        id: '3',
        title: 'Rapports Détaillés',
        description: 'Visualisez vos finances avec des graphiques et statistiques complètes',
        image: require('../../assets/carousel/reports.png'),
        color: '#FF9500'
    },
    {
        id: '4',
        title: 'Sécurité Avancée',
        description: 'Vos données sont chiffrées et protégées par les meilleures technologies',
        image: require('../../assets/carousel/security.png'),
        color: '#FF3B30'
    }
];

const WelcomeScreen: React.FC = () => {
    const { completeOnboarding } = useAuthAuthContext();
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);

    const handleGetStarted = async () => {
        await completeOnboarding();
    };

    const renderItem = ({ item, index }: { item: any; index: number }) => {
        const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width
        ];

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp'
        });

        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp'
        });

        return (
            <Animated.View style={[styles.carouselItem, { transform: [{ scale }], opacity }]}>
                <LinearGradient
                    colors={[item.color, `${item.color}80`]}
                    style={styles.imageContainer}
                >
                    <Image
                        source={item.image}
                        style={styles.carouselImage}
                        resizeMode="contain"
                    />
                </LinearGradient>

                <View style={styles.textContainer}>
                    <Text style={styles.carouselTitle}>{item.title}</Text>
                    <Text style={styles.carouselDescription}>{item.description}</Text>
                </View>
            </Animated.View>
        );
    };

    const renderPagination = () => {
        return (
            <View style={styles.pagination}>
                {carouselData.map((_, index) => {
                    const backgroundColor = scrollX.interpolate({
                        inputRange: [
                            (index - 1) * width,
                            index * width,
                            (index + 1) * width
                        ],
                        outputRange: ['#ccc', carouselData[currentIndex].color, '#ccc'],
                        extrapolate: 'clamp'
                    });

                    return (
                        <Animated.View
                            key={index}
                            style={[styles.paginationDot, { backgroundColor }]}
                        />
                    );
                })}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <LinearGradient
                    colors={['#1a2b47', '#2c3e50']}
                    style={styles.logoContainer}
                >
                    <Ionicons name="cash" size={40} color="#fff" />
                </LinearGradient>
                <Text style={styles.appName}>FinancePro</Text>
                <Text style={styles.appTagline}>Votre succès financier commence ici</Text>
            </View>

            {/* Carousel */}
            <View style={styles.carouselContainer}>
                <FlatList
                    ref={flatListRef}
                    data={carouselData}
                    renderItem={renderItem}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    onMomentumScrollEnd={(event) => {
                        const newIndex = Math.floor(
                            event.nativeEvent.contentOffset.x / width
                        );
                        setCurrentIndex(newIndex);
                    }}
                    keyExtractor={(item) => item.id}
                />

                {renderPagination()}
            </View>

            {/* Navigation Arrows */}
            <View style={styles.navigation}>
                <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => {
                        if (currentIndex > 0) {
                            flatListRef.current?.scrollToIndex({
                                index: currentIndex - 1,
                                animated: true
                            });
                        }
                    }}
                    disabled={currentIndex === 0}
                >
                    <Ionicons
                        name="chevron-back"
                        size={30}
                        color={currentIndex === 0 ? '#ccc' : '#1a2b47'}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => {
                        if (currentIndex < carouselData.length - 1) {
                            flatListRef.current?.scrollToIndex({
                                index: currentIndex + 1,
                                animated: true
                            });
                        }
                    }}
                    disabled={currentIndex === carouselData.length - 1}
                >
                    <Ionicons
                        name="chevron-forward"
                        size={30}
                        color={currentIndex === carouselData.length - 1 ? '#ccc' : '#1a2b47'}
                    />
                </TouchableOpacity>
            </View>

            {/* Get Started Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.getStartedButton}
                    onPress={handleGetStarted}
                >
                    <LinearGradient
                        colors={['#4cd964', '#34e89e']}
                        style={styles.getStartedGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.getStartedText}>
                            {t.welcome.getStarted}
                        </Text>
                        <Ionicons name="arrow-forward" size={22} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>

                <Text style={styles.skipText}>
                    Déjà un compte ?{' '}
                    <Text style={styles.loginLink}>Se connecter</Text>
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 20,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    appName: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1a2b47',
        marginBottom: 5,
    },
    appTagline: {
        fontSize: 16,
        color: '#7f8c8d',
        fontWeight: '500',
    },
    carouselContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    carouselItem: {
        width: width - 40,
        marginHorizontal: 20,
        alignItems: 'center',
    },
    imageContainer: {
        width: width - 80,
        height: 200,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    carouselImage: {
        width: '70%',
        height: '70%',
    },
    textContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    carouselTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: 10,
    },
    carouselDescription: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
        lineHeight: 22,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        marginBottom: 30,
    },
    arrowButton: {
        padding: 10,
        borderRadius: 25,
        backgroundColor: '#f8f9fa',
    },
    footer: {
        padding: 20,
        alignItems: 'center',
    },
    getStartedButton: {
        width: '100%',
        borderRadius: 30,
        overflow: 'hidden',
        marginBottom: 20,
        shadowColor: '#4cd964',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 12,
    },
    getStartedGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    getStartedText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginRight: 10,
    },
    skipText: {
        color: '#7f8c8d',
        fontSize: 14,
    },
    loginLink: {
        color: '#007AFF',
        fontWeight: '600',
    },
});

export default WelcomeScreen;