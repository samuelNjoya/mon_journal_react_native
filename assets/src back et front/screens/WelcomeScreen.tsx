import React, { useRef, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    useWindowDimensions,
    Platform
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'>;

const { width, height } = Dimensions.get('window');

const slides = [
    {
        key: '1',
        title: 'Bienvenue sur FinancePro',
        description: 'Gérez vos finances simplement et efficacement.',
        image: require('../../assets/carousel/budget-bg.jpg'),
    },
    {
        key: '2',
        title: 'Suivi des dépenses',
        description: 'Visualisez vos transactions en temps réel.',
        image: require('../../assets/carousel/reports-bg.jpg'),
    },
    {
        key: '3',
        title: 'Objectifs et budgets',
        description: 'Fixez des objectifs et suivez vos progrès.',
        image: require('../../assets/carousel/investment-bg.jpg'),
    },
];

export const WelcomeScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const { t, language } = useTranslation();
    const navigation = useNavigation<WelcomeScreenNavigationProp>();

    const handleScroll = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

    const handleGetStarted = () => {

        navigation.replace('Login');
    }

    const goToNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            handleGetStarted();
        }
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
        }
    };

    const renderItem = ({ item }: { item: typeof slides[0] }) => (
        <View style={{ width, height }}>
            <ImageBackground source={item.image} style={StyleSheet.absoluteFillObject} resizeMode="cover">
                <View style={styles.overlay} />
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
            </ImageBackground>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={[styles.content]}>
                    <FlatList
                        ref={flatListRef}
                        data={slides}
                        renderItem={renderItem}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        keyExtractor={(item) => item.key}
                        getItemLayout={(_, index) => ({
                            length: width,
                            offset: width * index,
                            index,
                        })}
                    />

                    {/* Pagination */}
                    <View style={[styles.pagination]}>
                        {slides.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.dot,
                                    currentIndex === i ? styles.activeDot : styles.inactiveDot,
                                ]}
                            />
                        ))}
                    </View>

                    {/* Navigation Buttons */}
                    <View style={[styles.navigationContainer]}>
                        {currentIndex === 0 ? (
                            // 👉 Slide 1 : bouton Suivant aligné à droite
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                <TouchableOpacity
                                    style={[styles.navButton,
                                    {
                                        backgroundColor: '#fcbf00',
                                    },
                                    ]}
                                    onPress={goToNext}
                                >
                                    <Text style={styles.navButtonText}>{t.common.next}</Text>
                                    <Ionicons name="chevron-forward" size={20} color="#1a171a" style={{ fontFamily: 'Poppins-Bold' }} />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            // 👉 Slides suivants : Précédent à gauche, Suivant à droite
                            <>
                                <TouchableOpacity style={[styles.navButton,
                                {
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                },
                                ]} onPress={goToPrevious}>
                                    <Ionicons name="chevron-back" size={20} color="#1a171a" style={{ fontFamily: 'Poppins-Bold' }} />
                                    <Text style={styles.navButtonText}>{t.common.previous}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.navButton,
                                        {
                                            backgroundColor: '#fcbf00',
                                        },
                                    ]}
                                    onPress={goToNext}
                                >
                                    <Text style={styles.navButtonText}>
                                        {currentIndex === slides.length - 1 ? t.welcome.getStarted : t.common.next}
                                    </Text>
                                    <Ionicons name="chevron-forward" size={20} color="#1a171a" style={{ fontFamily: 'Poppins-Bold' }} />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },

    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fcbf00',
    },
    content: {
        flex: 1,
        width: '100%',
        backgroundColor: '#ffff' // retire cette ligne si tu veux tout en #fff3c2
    },

    contentContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 120,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: Platform.OS === 'android' ? 22 : 26,
        fontFamily: 'Poppins-Bold',
        color: '#FFFFFF',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    description: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#FFFFFF',
        opacity: 0.9,
        lineHeight: Platform.OS === 'android' ? 20 : 22,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    pagination: {
        position: 'absolute',
        flexDirection: 'row',
        alignSelf: 'center',
        top: 10
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 6,
    },
    activeDot: {
        backgroundColor: '#fff3c2',
    },
    inactiveDot: {
        backgroundColor: '#888',
    },
    button: {
        position: 'absolute',
        backgroundColor: '#fcbf00',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
    },
    // buttonText: {
    //     color: '#1a171a',
    //     fontSize: 16,
    //     fontWeight: '600',
    // },
    navigationContainer: {
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fcbf00',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 30,
    },

    navButtonText: {
        color: '#1a171a',
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        marginHorizontal: 6,
    },

});
export default WelcomeScreen;