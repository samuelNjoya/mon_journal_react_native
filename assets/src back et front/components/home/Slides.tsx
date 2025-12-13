import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    FlatList,
    Animated,
    Image
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { ListRenderItem } from 'react-native'

const { width } = Dimensions.get('window');

interface Slide {
    id_slide: number
    title_slide: string
    description?: string
    url_slide?: any
    start_date: string
    end_date: string
}


export default function SlideComponent({ slides }: any) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef<FlatList<Slide>>(null);

    // Configuration pour le slider automatique
    useEffect(() => {
        const interval = setInterval(() => {
            if (slidesRef.current) {
                const nextSlide = (currentSlide + 1) % slides.length;
                slidesRef.current.scrollToOffset({
                    offset: nextSlide * width,
                    animated: true,
                });
                setCurrentSlide(nextSlide);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [currentSlide]);
    // Données pour le slider
    // const promoSlides = [
    //     { id: 1, title: "Offre exclusive", description: "Bénéficiez de 0% de frais sur tous vos virements", image: require('../../../assets/carousel/budget-bg.jpg') },
    //     { id: 2, title: "Nouveau!", description: "Épargnez facilement avec notre compte à terme", image: require('../../../assets/carousel/budget-bg.jpg') },
    //     { id: 3, title: "Cashback", description: "Jusqu'à 5% de cashback sur vos achats", image: require('../../../assets/carousel/budget-bg.jpg') },
    // ];

    // // const formatBalance = (amount: number) => {
    // //     return new Intl.NumberFormat('fr-FR', {
    // //         style: 'currency',
    // //         currency: 'XAF'
    // //     }).format(amount);'' + item.image
    // // };
    const renderSlide: ListRenderItem<Slide> = ({ item }) => (
        <View style={styles.slide}>
            <Image source={{ uri: 'http://devop.myfronttieres.com/' + item.url_slide }} style={styles.slideImage} />
            <View>
                <Text style={styles.slideTitle}>{item.title_slide}</Text>
                <Text style={styles.slideDesc}></Text>
            </View>
        </View>
    );

    return (
        <View style={styles.sliderContainer}>
            <FlatList
                ref={slidesRef}
                data={slides}
                renderItem={renderSlide}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id_slide.toString()}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onMomentumScrollEnd={(event) => {
                    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
                    setCurrentSlide(slideIndex);
                }}
            />
            <View style={styles.pagination}>
                {slides.map((_: any, index: number) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            currentSlide === index ? styles.paginationDotActive : null
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    sliderContainer: {
        height: 170,
        marginTop: 10,
    },
    slide: {
        width: width - 30,
        height: 150,
        marginHorizontal: 15,
        borderRadius: 15,
        overflow: 'hidden',
        position: 'relative',
    },
    slideImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    slideOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 15,
    },
    slideTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    slideDesc: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.4)',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#fff',
        width: 20,
    },
    section: {
        marginTop: 10,
        paddingHorizontal: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingTop: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Poppins-Bold',
        color: '#333',
    },
});