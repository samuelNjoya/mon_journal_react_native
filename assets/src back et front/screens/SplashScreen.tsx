import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Easing,
    Animated,
    Dimensions,
    Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useTranslation } from '../hooks/useTranslation';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from '../navigation/AppNavigator';

const { width, height } = Dimensions.get('window');

interface OptimizedSplashScreenProps {
    onFinish?: () => void;
}

const OptimizedSplashScreen: React.FC<OptimizedSplashScreenProps> = ({ onFinish }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.85)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const insets = useSafeAreaInsets();
    const [displayProgress, setDisplayProgress] = React.useState(0);

    useEffect(() => {
        // Animation d'entrée
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 1000,
                easing: Easing.out(Easing.back(1.2)),
                useNativeDriver: false,
            }),
            Animated.timing(progressAnim, {
                toValue: 1,
                duration: 2800,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            }),
        ]).start();

        // Mise à jour de l'affichage en valeurs entières
        const progressListener = progressAnim.addListener(({ value }) => {
            const intValue = Math.floor(value);
            setDisplayProgress(intValue);
        });

        // Appeler onFinish après l'animation si fourni
        if (onFinish) {
            const timer = setTimeout(() => {
                onFinish();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [onFinish]);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });


    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={[styles.content]}>
                    {/* Arrière-plan */}
                    <View style={styles.background}>
                        <View style={styles.gradientOverlay} />
                    </View>

                    <Animated.View
                        style={[
                            styles.content,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: scaleAnim }],
                            }
                        ]}
                    >
                        {/* // Dans le composant :*/}

                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../../assets/logo_payx.png')} // Chemin vers votre image
                                style={styles.logoImage}
                                resizeMode="contain"
                            />
                        </View>

                        {/* Texte */}
                        <Animated.View style={{ opacity: fadeAnim }}>
                            {/* <Text style={styles.title}>Sesampayx</Text> */}
                            <Text style={styles.subtitle}>Le monde de privilège pensé juste pour vous</Text>
                        </Animated.View>

                        {/* Indicateur de progression */}
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBackground}>
                                <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
                            </View>
                            <Animated.Text
                                style={[styles.progressText, { opacity: fadeAnim }]}
                            >
                                {progressAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0%', '100%'],
                                })}
                            </Animated.Text>
                        </View>
                    </Animated.View>

                    {/* Version de l'app */}
                    <Text style={[styles.version]}>Version 1.0.0</Text>
                </View>
            </View>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fcbf00',
    },
    // content: {
    //     flex: 1,
    //     width: '100%',
    //     paddingHorizontal: 20,
    //     //backgroundColor: '#ffff' // retire cette ligne si tu veux tout en #fff3c2
    // },
    logo: {
        width: 180,
        height: 100,
        marginBottom: 50,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#003366', // Bleu foncé pour contraste
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
    },
    optionsContainer: {
        width: '100%',
        maxWidth: 350,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingLeft: 15,
        borderRadius: 12,
        marginVertical: 10,
        width: 200,
        height: 50
    },
    flag: {
        width: 32,
        height: 20,
        marginRight: 15,
    },
    label: {
        fontSize: 18,
        color: '#003366',
        fontWeight: '600',
    },
    // container: {
    //     ...StyleSheet.absoluteFillObject,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     backgroundColor: '#fcbf00',
    //     zIndex: 1000,
    // },
    content: {
        alignItems: 'center',
        padding: 20,
        justifyContent: 'center',
        flex: 1,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fcbf00',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fcbf00',
    },

    logoContainer: {
        marginBottom: 0,
    },
    titleSplash: {
        fontSize: 36,
        fontWeight: '800',
        color: '#1a171a',
        marginBottom: 6,
        textAlign: 'center',
        letterSpacing: 1.5,
    },
    subtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '300',
        marginBottom: 20,
        textAlign: 'center',
    },
    progressContainer: {
        width: 250,
        alignItems: 'center',
    },
    progressBackground: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 10,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#1a171a',
        borderRadius: 3,
    },
    progressText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
        fontWeight: '500',
    },
    version: {
        position: 'absolute',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 12,
        bottom: 0
    },
    // Ajoutez ce style :
    logoImage: {
        width: 220,
        height: 100,
    },
});


export default OptimizedSplashScreen;