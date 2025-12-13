import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    Animated,
    Dimensions,
    PanResponder,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../hooks/useTranslation';
import { showBenaccPrice } from '../../utils/helpers';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.85;
const BOTTOM_SHEET_MIN_HEIGHT = 100;

// Types
interface Bouquet {
    id_tv_package: string;
    denomination: string;
    price: number;
}

interface SubscriptionFormData {
    title: string;
    phone_number: string;
    subscriber_number: string;
    id_tv_package: string;
}

interface SubscriptionFormBottomSheetProps {
    onSave: (data: SubscriptionFormData) => void;
    onClose?: () => void;
    initialData?: SubscriptionFormData;
    bouquets: Bouquet[];
    visible?: boolean;
}

export interface SubscriptionFormBottomSheetRef {
    open: () => void;
    close: () => void;
}

const AddUpdateTvSubscription = forwardRef<
    SubscriptionFormBottomSheetRef,
    SubscriptionFormBottomSheetProps
>(({ onSave, onClose, initialData, bouquets, visible = false }, ref) => {
    const [isVisible, setIsVisible] = useState(visible);
    const [formData, setFormData] = useState<SubscriptionFormData>(
        initialData || {
            title: '',
            phone_number: '',
            subscriber_number: '',
            id_tv_package: '',
        }
    );

    const [errors, setErrors] = useState<Partial<SubscriptionFormData>>({});
    const [isBouquetDropdownOpen, setIsBouquetDropdownOpen] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const { t } = useTranslation();

    // 🔁 Synchronise formData avec initialData à chaque changement
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    // Animations
    const animatedValue = useRef(new Animated.Value(0)).current;
    const panY = useRef(new Animated.Value(0)).current;
    const translateY = panY.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [0, 0, 1],
    });

    // Configuration de la hauteur du bottom sheet
    const bottomSheetHeight = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [BOTTOM_SHEET_MIN_HEIGHT, BOTTOM_SHEET_MAX_HEIGHT],
    });

    const backdropOpacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
    });

    // PanResponder pour glisser pour fermer
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return gestureState.dy > 5 || gestureState.dy < -5;
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    panY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 100) {
                    closeBottomSheet();
                } else {
                    Animated.spring(panY, {
                        toValue: 0,
                        useNativeDriver: true,
                        damping: 15,
                    }).start();
                }
            },
        })
    ).current;

    // Gestion du clavier
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (event) => {
                setKeyboardHeight(event.endCoordinates.height);
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardHeight(0);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    // Animation d'ouverture/fermeture
    useEffect(() => {
        if (isVisible) {
            openBottomSheet();
        } else {
            closeBottomSheet();
        }
    }, [isVisible]);

    const openBottomSheet = () => {
        Animated.spring(animatedValue, {
            toValue: 1,
            useNativeDriver: false,
            damping: 15,
            stiffness: 100,
        }).start();
    };

    const closeBottomSheet = () => {
        Keyboard.dismiss();
        Animated.spring(animatedValue, {
            toValue: 0,
            useNativeDriver: false,
            damping: 15,
            stiffness: 100,
        }).start(() => {
            setIsVisible(false);
            setIsBouquetDropdownOpen(false);
            setErrors({});
            onClose?.();
        });
    };

    // Exposer les méthodes au parent
    useImperativeHandle(ref, () => ({
        open: () => {
            setIsVisible(true);
            if (initialData) {
                setFormData(initialData);
            }
        },
        close: closeBottomSheet,
    }));

    const handleInputChange = (field: keyof SubscriptionFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<SubscriptionFormData> = {};

        if (!formData.title.trim()) {
            newErrors.title = "L'intitulé est requis";
        }
        if (!formData.phone_number.trim()) {
            newErrors.phone_number = 'Le numéro de téléphone est requis';
        } else if (!/^[\+]?[0-9]{8,15}$/.test(formData.phone_number)) {
            newErrors.phone_number = 'Numéro de téléphone invalide';
        }
        if (!formData.subscriber_number.trim()) {
            newErrors.subscriber_number = "Le numéro d'abonnement est requis";
        }
        if (!formData.id_tv_package) {
            newErrors.id_tv_package = 'Veuillez sélectionner un bouquet';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            onSave(formData);
            //closeBottomSheet();
        }
    };

    const selectedBouquet = bouquets.find(b => b.id_tv_package === formData.id_tv_package);

    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop */}
            <TouchableWithoutFeedback onPress={closeBottomSheet}>
                <Animated.View
                    style={[
                        styles.backdrop,
                        { opacity: backdropOpacity }
                    ]}
                />
            </TouchableWithoutFeedback>

            {/* Bottom Sheet */}
            <Animated.View
                style={[
                    styles.bottomSheet,
                    {
                        transform: [{ translateY }],
                        paddingBottom: 20,
                    }
                ]}
                {...panResponder.panHandlers}
            >
                {/* Poignée de drag */}
                <View style={styles.dragHandleContainer}>
                    <View style={styles.dragHandle} />
                </View>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {initialData ? t.tvOrders.setSubscription : t.tvOrders.newSubscription}
                    </Text>
                    <TouchableOpacity onPress={closeBottomSheet} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#666" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Champ Intitulé avec icône intégrée */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Intitulé</Text>
                        <View style={[styles.inputWithIcon, errors.title && styles.inputError]}>
                            <Ionicons name="pricetag" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: Abonnement Principal"
                                value={formData.title}
                                onChangeText={(value) => handleInputChange('title', value)}
                                placeholderTextColor="#999"
                            />
                        </View>
                        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                    </View>

                    {/* Champ Numéro de Téléphone avec icône intégrée */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t.auth.phoneNumber}</Text>
                        <View style={[styles.inputWithIcon, errors.phone_number && styles.inputError]}>
                            <Ionicons name="call" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: +237 6XX XXX XXX"
                                value={formData.phone_number}
                                onChangeText={(value) => handleInputChange('phone_number', value)}
                                keyboardType="phone-pad"
                                placeholderTextColor="#999"
                            />
                        </View>
                        {errors.phone_number && (
                            <Text style={styles.errorText}>{errors.phone_number}</Text>
                        )}
                    </View>

                    {/* Champ Numéro d'Abonnement avec icône intégrée */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Numéro d'Abonnement</Text>
                        <View style={[styles.inputWithIcon, errors.subscriber_number && styles.inputError]}>
                            <Ionicons name="card" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: ABO123456789"
                                value={formData.subscriber_number}
                                onChangeText={(value) => handleInputChange('subscriber_number', value)}
                                placeholderTextColor="#999"
                            />
                        </View>
                        {errors.subscriber_number && (
                            <Text style={styles.errorText}>{errors.subscriber_number}</Text>
                        )}
                    </View>

                    {/* Sélecteur de Bouquet avec icône intégrée */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t.tvOrders.package}</Text>

                        <TouchableOpacity
                            style={[styles.selectInputWithIcon, errors.id_tv_package && styles.inputError]}
                            onPress={() => setIsBouquetDropdownOpen(!isBouquetDropdownOpen)}
                        >
                            <Ionicons name="tv" size={20} color="#666" style={styles.inputIcon} />
                            <Text style={selectedBouquet ? styles.selectText : styles.placeholderText}>
                                {selectedBouquet ? selectedBouquet.denomination : t.tvOrders.selectPackage}
                            </Text>
                            <Ionicons
                                name={isBouquetDropdownOpen ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>

                        {errors.id_tv_package && <Text style={styles.errorText}>{errors.id_tv_package}</Text>}

                        {isBouquetDropdownOpen && (
                            <View style={styles.dropdown}>
                                {bouquets.map((bouquet) => (
                                    <TouchableOpacity
                                        key={bouquet.id_tv_package}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            handleInputChange('id_tv_package', bouquet.id_tv_package);
                                            setIsBouquetDropdownOpen(false);
                                        }}
                                    >
                                        <View style={styles.dropdownItemContent}>
                                            <Ionicons name="tv-outline" size={18} color="#007AFF" />
                                            <View style={styles.dropdownTextContainer}>
                                                <Text style={styles.dropdownText}>{bouquet.denomination}</Text>
                                                <Text style={styles.dropdownPrice}>{showBenaccPrice(bouquet.price, 1)}/{t.benacc.month}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </ScrollView>

                {/* Bouton Enregistrer */}
                <View style={[
                    styles.footer
                ]}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Ionicons name="checkmark" size={20} color="#FFF" />
                        <Text style={styles.saveButtonText}>
                            {initialData ? t.common.update : t.common.save}
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </>
    );
});

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000000',
        zIndex: 999,
    },
    bottomSheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        zIndex: 1000,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    dragHandleContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#E0E0E0',
        borderRadius: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3436',
    },
    closeButton: {
        padding: 4,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D3436',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#E9ECEF',
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    selectInputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#E9ECEF',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#2D3436',
        paddingVertical: 16,
    },
    inputError: {
        borderColor: '#FF3B30',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    selectText: {
        flex: 1,
        fontSize: 16,
        color: '#2D3436',
    },
    placeholderText: {
        flex: 1,
        fontSize: 16,
        color: '#6C757D',
    },
    dropdown: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E9ECEF',
        borderRadius: 12,
        marginTop: 8,
        maxHeight: 500,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    dropdownItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F8F9FA',
    },
    dropdownItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    dropdownText: {
        fontSize: 16,
        color: '#2D3436',
        marginBottom: 2,
    },
    dropdownPrice: {
        fontSize: 14,
        color: '#6C757D',
    },
    footer: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AddUpdateTvSubscription;