import React from 'react';
import { View, Image, StyleSheet, Animated, Easing } from 'react-native';

const Preloader = ({ visible = true }) => {
    const spinValue = new Animated.Value(0);

    // Animation de rotation
    Animated.loop(
        Animated.timing(spinValue, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
        })
    ).start();

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    if (!visible) return null;

    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                {/* Logo principal */}
                <Image
                    source={require('../../assets/logo_sesampayx.png')} // Remplacez par votre logo
                    style={styles.logo}
                    resizeMode="contain"
                />

                {/* Animation de rotation autour du logo */}
                <Animated.View style={[styles.rotatingCircle, { transform: [{ rotate: spin }] }]}>
                    <View style={styles.circle} />
                </Animated.View>

                {/* Points animés supplémentaires */}
                <View style={styles.dotsContainer}>
                    <Animated.View style={[styles.dot, styles.dot1]} />
                    <Animated.View style={[styles.dot, styles.dot2]} />
                    <Animated.View style={[styles.dot, styles.dot3]} />
                </View>
            </View>
        </View>
    );
};

// Version alternative avec des props personnalisables
const CustomPreloader = ({
    visible = true,
    logoSource = null,
    size = 110,
    backgroundColor = 'rgba(255, 255, 255, 0.9)',
    primaryColor = '#fcbf00',
    secondaryColor = '#1a171a'
}) => {
    const spinValue = new Animated.Value(0);
    const scaleValue = new Animated.Value(1);

    React.useEffect(() => {
        if (visible) {
            // Animation de rotation
            Animated.loop(
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 1800,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();

            // Animation de pulsation pour les points
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleValue, {
                        toValue: 1.2,
                        duration: 500,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleValue, {
                        toValue: 1,
                        duration: 500,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [visible]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const scale = scaleValue;

    if (!visible) return null;

    return (
        <View style={[styles.overlay, { backgroundColor }]}>
            <View style={[styles.container, { width: size * 1.5, height: size * 1.5 }]}>
                {/* Logo principal */}
                <Image
                    source={logoSource || require('../../assets/logo_sesampayx.png')}
                    style={[styles.logo, { width: size * 0.6, height: size * 0.6 }]}
                    resizeMode="contain"
                />

                {/* Cercle rotatif */}
                <Animated.View
                    style={[
                        styles.rotatingCircle,
                        {
                            transform: [{ rotate: spin }],
                            borderColor: primaryColor,
                            width: size,
                            height: size
                        }
                    ]}
                />

                {/* Points animés */}
                <View style={styles.dotsContainer}>
                    <Animated.View
                        style={[
                            styles.dot,
                            {
                                backgroundColor: primaryColor,
                                transform: [{ scale }]
                            }
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.dot,
                            {
                                backgroundColor: primaryColor,
                                transform: [{
                                    scale: scaleValue.interpolate({
                                        inputRange: [1, 1.2],
                                        outputRange: [1, 1.1]
                                    })
                                }]
                            }
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.dot,
                            {
                                backgroundColor: primaryColor,
                                transform: [{
                                    scale: scaleValue.interpolate({
                                        inputRange: [1, 1.2],
                                        outputRange: [1, 0.9]
                                    })
                                }]
                            }
                        ]}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    container: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    logo: {
        width: 50,
        height: 50,
        zIndex: 2,
    },
    rotatingCircle: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 75,
        borderWidth: 5,
        borderColor: '#fcbf00',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#fcbf00',
        position: 'absolute',
        top: -5,
        left: '50%',
        marginLeft: -5,
    },
    dotsContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: -30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#fcbf00',
        marginHorizontal: 4,
    },
    dot1: {
        opacity: 0.6,
    },
    dot2: {
        opacity: 0.8,
    },
    dot3: {
        opacity: 1,
    },
});

export { Preloader, CustomPreloader };