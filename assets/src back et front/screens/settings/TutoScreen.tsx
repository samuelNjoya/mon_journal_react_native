import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Animated,
    Image,
} from 'react-native';

const { width } = Dimensions.get('window');

const TutoScreen = ({ navigation }: any) => {
    const [currentStep, setCurrentStep] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const steps = [
        {
            title: "Bienvenue dans votre application",
            description: "Gérez facilement votre compte et vos abonnements en un seul endroit",
            image: "👋",
            color: "#6366f1"
        },
        {
            title: "Vue d'ensemble du compte",
            description: "Consultez en un clin d'œil le statut de votre compte, le type d'abonnement et la date d'expiration",
            image: "📊",
            color: "#10b981"
        },
        {
            title: "Gestion des souscriptions",
            description: "Accédez à la liste complète de vos abonnements avec leurs dates et statuts détaillés",
            image: "📋",
            color: "#f59e0b"
        },
        {
            title: "Informations détaillées",
            description: "Retrouvez toutes les informations importantes dans la section 'À propos' de votre compte",
            image: "ℹ️",
            color: "#ef4444"
        },
        {
            title: "Prêt à commencer ?",
            description: "Votre application est maintenant prête à utiliser. Profitez de toutes ses fonctionnalités !",
            image: "🎉",
            color: "#8b5cf6"
        }
    ];

    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            fadeOut();
            setTimeout(() => {
                setCurrentStep(currentStep + 1);
                scrollViewRef.current?.scrollTo({ x: width * (currentStep + 1), animated: true });
                fadeIn();
            }, 300);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            fadeOut();
            setTimeout(() => {
                setCurrentStep(currentStep - 1);
                scrollViewRef.current?.scrollTo({ x: width * (currentStep - 1), animated: true });
                fadeIn();
            }, 300);
        }
    };

    const startApp = () => {
        navigation.navigate('AccountScreen');
    };

    React.useEffect(() => {
        fadeIn();
    }, [currentStep]);

    return (
        <View style={styles.container}>
            {/* En-tête avec indicateur de progression */}
            <View style={styles.header}>
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${((currentStep + 1) / steps.length) * 100}%` }
                            ]}
                        />
                    </View>
                    <Text style={styles.stepCounter}>
                        {currentStep + 1}/{steps.length}
                    </Text>
                </View>
            </View>

            {/* Carousel des étapes */}
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                style={styles.carousel}
            >
                {steps.map((step, index) => (
                    <View key={index} style={[styles.slide, { width }]}>
                        <Animated.View
                            style={[
                                styles.slideContent,
                                { opacity: fadeAnim }
                            ]}
                        >
                            <View style={[styles.imageContainer, { backgroundColor: step.color }]}>
                                <Text style={styles.emoji}>{step.image}</Text>
                            </View>

                            <Text style={styles.title}>{step.title}</Text>
                            <Text style={styles.description}>{step.description}</Text>

                            {/* Démos visuelles pour les étapes importantes */}
                            {index === 1 && (
                                <View style={styles.demoCard}>
                                    <View style={styles.demoHeader}>
                                        <Text style={styles.demoTitle}>Votre Compte</Text>
                                        <View style={styles.demoBadge}>
                                            <Text style={styles.demoBadgeText}>Actif</Text>
                                        </View>
                                    </View>
                                    <View style={styles.demoInfo}>
                                        <Text style={styles.demoLabel}>Type: Premium</Text>
                                        <Text style={styles.demoLabel}>Expiration: 15/12/2024</Text>
                                    </View>
                                </View>
                            )}

                            {index === 2 && (
                                <View style={styles.subscriptionDemo}>
                                    <View style={styles.subCardDemo}>
                                        <Text style={styles.subTitle}>Abonnement Premium</Text>
                                        <Text style={styles.subStatus}>✓ Actif</Text>
                                    </View>
                                    <View style={styles.subCardDemo}>
                                        <Text style={styles.subTitle}>Abonnement Basique</Text>
                                        <Text style={styles.subStatusInactive}>✗ Expiré</Text>
                                    </View>
                                </View>
                            )}
                        </Animated.View>
                    </View>
                ))}
            </ScrollView>

            {/* Navigation */}
            <View style={styles.navigation}>
                {currentStep > 0 ? (
                    <TouchableOpacity style={styles.secondaryButton} onPress={prevStep}>
                        <Text style={styles.secondaryButtonText}>Précédent</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.placeholder} />
                )}

                <View style={styles.dotsContainer}>
                    {steps.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentStep ? styles.activeDot : styles.inactiveDot
                            ]}
                        />
                    ))}
                </View>

                {currentStep < steps.length - 1 ? (
                    <TouchableOpacity style={styles.primaryButton} onPress={nextStep}>
                        <Text style={styles.primaryButtonText}>Suivant</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.startButton} onPress={startApp}>
                        <Text style={styles.startButtonText}>Commencer</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Bouton sauter */}
            {currentStep < steps.length - 1 && (
                <TouchableOpacity style={styles.skipButton} onPress={startApp}>
                    <Text style={styles.skipButtonText}>Passer</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    progressBar: {
        flex: 1,
        height: 6,
        backgroundColor: '#e2e8f0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#6366f1',
        borderRadius: 3,
    },
    stepCounter: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: '#64748b',
        minWidth: 40,
    },
    carousel: {
        flex: 1,
    },
    slide: {
        width: width,
        paddingHorizontal: 30,
        justifyContent: 'center',
    },
    slideContent: {
        alignItems: 'center',
    },
    imageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    emoji: {
        fontSize: 50,
    },
    title: {
        fontFamily: 'Poppins-Bold',
        fontSize: 28,
        textAlign: 'center',
        color: '#1a365d',
        marginBottom: 16,
        lineHeight: 34,
    },
    description: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        textAlign: 'center',
        color: '#64748b',
        lineHeight: 24,
        marginBottom: 30,
    },
    demoCard: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        marginTop: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    demoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    demoTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#1e293b',
    },
    demoBadge: {
        backgroundColor: '#dcfce7',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    demoBadgeText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        color: '#166534',
    },
    demoInfo: {
        gap: 8,
    },
    demoLabel: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#475569',
    },
    subscriptionDemo: {
        width: '100%',
        marginTop: 20,
        gap: 12,
    },
    subCardDemo: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    subTitle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: '#1e293b',
    },
    subStatus: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        color: '#166534',
        backgroundColor: '#dcfce7',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    subStatusInactive: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        color: '#991b1b',
        backgroundColor: '#fee2e2',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingBottom: 40,
        paddingTop: 20,
    },
    primaryButton: {
        backgroundColor: '#6366f1',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        minWidth: 100,
    },
    primaryButtonText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
    },
    secondaryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        minWidth: 100,
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    secondaryButtonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
    },
    startButton: {
        backgroundColor: '#10b981',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 12,
        minWidth: 120,
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    startButtonText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    activeDot: {
        backgroundColor: '#6366f1',
        width: 24,
    },
    inactiveDot: {
        backgroundColor: '#cbd5e1',
    },
    placeholder: {
        minWidth: 100,
    },
    skipButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        padding: 10,
    },
    skipButtonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: '#64748b',
    },
});

export default TutoScreen;