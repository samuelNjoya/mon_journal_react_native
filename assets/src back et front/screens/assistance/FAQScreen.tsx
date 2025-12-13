import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ScrollView,
    Modal,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../hooks/useTranslation';
import { homeService } from '../../api/services/home';
import ErrorModal from '../../components/Notification';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: string;
}

interface Category {
    id_category: number;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    faqs: FAQItem[];
}

const FAQScreen: React.FC = ({ navigation }: any) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const { t, language } = useTranslation();
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const insets = useSafeAreaInsets();

    // Données simulées selon votre modèle
    const mockCategories: Category[] = [
        {
            id_category: 1,
            title: "Technique",
            description: "test",
            created_at: "2020-01-20 10:26:12",
            updated_at: "2020-01-20 10:26:12",
            deleted_at: null,
            faqs: [
                {
                    id: '1',
                    question: 'Comment créer un compte ?',
                    answer: 'Pour créer un compte, téléchargez l\'application et suivez le processus d\'inscription.',
                    category: 'Technique'
                },
                {
                    id: '2',
                    question: 'Problème de connexion à l\'application',
                    answer: 'Vérifiez votre connexion internet et réessayez. Si le problème persiste, réinstallez l\'application.',
                    category: 'Technique'
                }
            ]
        },
        {
            id_category: 2,
            title: "Assistance",
            description: "Cette catégorie traite de l'assistance",
            created_at: "2020-02-01 15:14:29",
            updated_at: "2020-02-01 15:14:29",
            deleted_at: null,
            faqs: [
                {
                    id: '3',
                    question: 'Quels sont les frais de transaction ?',
                    answer: 'Les frais varient entre 1% et 2% selon le type de transaction.',
                    category: 'Assistance'
                },
                {
                    id: '4',
                    question: 'Comment contacter le support ?',
                    answer: 'Vous pouvez nous contacter via le formulaire de contact dans l\'application ou par email à support@example.com.',
                    category: 'Assistance'
                },
                {
                    id: '5',
                    question: 'Délai de traitement des tickets',
                    answer: 'Nous traitons les tickets sous 24 à 48 heures ouvrées.',
                    category: 'Assistance'
                }
            ]
        },
        {
            id_category: 3,
            title: "Facturation",
            description: "Questions relatives à la facturation",
            created_at: "2020-03-15 09:30:00",
            updated_at: "2020-03-15 09:30:00",
            deleted_at: null,
            faqs: [
                {
                    id: '6',
                    question: 'Comment obtenir une facture ?',
                    answer: 'Vous pouvez télécharger vos factures depuis la section "Facturation" de votre compte.',
                    category: 'Facturation'
                }
            ]
        }
    ];

    const fetchData = async (isRefreshing: boolean = false) => {
        try {
            if (isRefreshing) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);

            const result = await homeService.getCategories();
            // console.log(result.data.datas[3])
            if (result.success && result.data.status) {
                setCategories(result.data.datas)
                //setTickets(processedTickets);
            } else {
                setErrorMessage(result.data?.err_msg || result.error);
            }
        } catch (err: any) {
            console.error('Erreur API:', err);
            Alert.alert(t.alerts.error, t.faq.loading_error);
        } finally {
            setLoading(false);
        }
    }

    // Charger les catégories (simulation d'appel API)
    useEffect(() => {
        // Ici vous pouvez faire un appel API pour récupérer les vraies données
        fetchData()
    }, []);

    // Obtenir toutes les FAQs (si aucune catégorie sélectionnée) ou les FAQs de la catégorie sélectionnée
    const getFAQsToDisplay = (): FAQItem[] => {
        if (selectedCategory === null) {
            // Afficher toutes les FAQs de toutes les catégories
            return categories.flatMap(category => category.faqs);
        }

        // Afficher seulement les FAQs de la catégorie sélectionnée
        const selectedCat = categories.find(cat => cat.id_category === selectedCategory.id_category);
        return selectedCat ? selectedCat.faqs : [];
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // Sélectionner une catégorie
    const handleSelectCategory = (category: Category) => {
        setSelectedCategory(category)
        setShowCategoryModal(false)
    };

    // Fonction pour rafraîchir manuellement
    const onRefresh = () => {
        fetchData(true);
    };

    // Écran de chargement
    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fcbf00" />
                <Text style={styles.loadingText}>{t.ticket.loading}...</Text>
            </View>
        );
    }

    // Écran d'erreur
    if (error && categories.length === 0) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="warning" size={64} color="#FF6B6B" />
                <Text style={styles.errorTitle}>{t.faq.loading_error}</Text>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => fetchData()}>
                    <Text style={styles.retryButtonText}>{t.common.retry}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Rendu d'une catégorie dans la modal
    const renderCategoryItem = ({ item }: { item: Category }) => (
        <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => handleSelectCategory(item)}
        >
            <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{item.title}</Text>
                <Text style={styles.categoryDescription}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#CBD5E0" />
        </TouchableOpacity>
    );

    const renderFAQItem = ({ item }: { item: FAQItem }) => (
        <TouchableOpacity
            style={styles.faqItem}
            onPress={() => toggleExpand(item.id)}
            activeOpacity={0.7}
        >
            <View style={styles.faqHeader}>
                <View style={styles.faqQuestionContainer}>
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                    <View style={styles.faqCategoryBadge}>
                        <Text style={styles.faqCategoryText}>{item.category}</Text>
                    </View>
                </View>
                <Ionicons
                    name={expandedId === item.id ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#CBD5E0"
                />
            </View>
            {expandedId === item.id && (
                <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswer}>{item.answer}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    const faqsToDisplay = getFAQsToDisplay();

    return (
        <View style={styles.container}>
            <ErrorModal visible={errorMessage !== ''} type='error' onClose={() => { setErrorMessage('') }} message={errorMessage} />
            {/* En-tête avec titre */}
            <View style={[styles.header, { paddingTop: insets.top + 5 }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#2D3748" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t.faq.header_title}</Text>
                <Text style={styles.headerSubtitle}>
                    {selectedCategory === null
                        ? `Toutes les catégories (${faqsToDisplay.length} questions)`
                        : `${categories.find(cat => cat.id_category === selectedCategory.id_category)?.title} (${faqsToDisplay.length} questions)`
                    }
                </Text>
            </View>

            {/* Filtres par catégorie */}
            <TouchableOpacity
                style={styles.categorySelector}
                onPress={() => setShowCategoryModal(true)}
            >
                {selectedCategory ? (
                    <View style={styles.selectedCategory}>
                        <Ionicons
                            name={'help-circle'}
                            size={20}
                            color="#fcbf00"
                        />
                        <Text style={styles.selectedCategoryText}>{selectedCategory.title}</Text>
                    </View>
                ) : (
                    <Text style={styles.categoryPlaceholder}>{t.ticket.select_category}</Text>
                )}
                <Ionicons name="chevron-down" size={20} color="#CBD5E0" />
            </TouchableOpacity>
            {/* {renderCategoryFilter()} */}

            {/* Liste des FAQs */}
            <FlatList
                data={faqsToDisplay}
                renderItem={renderFAQItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="help-circle" size={64} color="#CBD5E0" />
                        <Text style={styles.emptyTitle}>{t.faq.empty_title}</Text>
                        <Text style={styles.emptyText}>
                            {selectedCategory === null
                                ? t.faq.empty_text1
                                : t.faq.empty_text2
                            }
                        </Text>
                    </View>
                }
                showsVerticalScrollIndicator={false}
            />
            {/* Modal de sélection des catégories */}
            <Modal
                visible={showCategoryModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowCategoryModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t.ticket.choose_category}</Text>
                            <TouchableOpacity
                                onPress={() => setShowCategoryModal(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color="#2D3748" />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={categories}
                            renderItem={renderCategoryItem}
                            keyExtractor={(item) => item.id_category + ''}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        backgroundColor: '#fcbf00',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 4,
        fontFamily: 'Poppins-Bold',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#708090',
        fontFamily: 'Poppins-Regular',
    },
    categoriesContainer: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        maxHeight: 60,
    },
    categoryButtonTextSelected: {
        color: '#FFFFFF',
    },
    listContent: {
        padding: 16,
        flexGrow: 1,
    },
    faqItem: {
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
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    faqQuestionContainer: {
        flex: 1,
        marginRight: 12,
    },
    faqQuestion: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
        lineHeight: 22,
        marginBottom: 8,
        fontFamily: 'Poppins-SemiBold',
    },
    faqCategoryBadge: {
        backgroundColor: '#F0FFF4',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    faqCategoryText: {
        fontSize: 10,
        color: '#4ECDC4',
        fontWeight: '500',
        fontFamily: 'Poppins-Medium',
    },
    faqAnswerContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    faqAnswer: {
        fontSize: 14,
        color: '#718096',
        lineHeight: 20,
        fontFamily: 'Poppins-Regular',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        flex: 1,
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
    // Autres styles existants
    categorySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F7FAFC',
    },
    selectedCategory: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedCategoryText: {
        fontSize: 14,
        color: '#2D3748',
        marginLeft: 8,
        fontFamily: 'Poppins-Medium',
    },
    categoryPlaceholder: {
        fontSize: 14,
        color: '#A0AEC0',
        fontFamily: 'Poppins-Regular',
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
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F7FAFC',
    },
    categoryIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFBF0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    categoryInfo: {
        flex: 1,
    },
    categoryName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D3748',
        fontFamily: 'Poppins-SemiBold',
    },
    categoryDescription: {
        fontSize: 12,
        color: '#718096',
        marginTop: 2,
        fontFamily: 'Poppins-Regular',
    },
    closeButton: {
        padding: 4,
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
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#F8F9FA',
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D3748',
        marginTop: 16,
        marginBottom: 8,
    },
    errorText: {
        fontSize: 16,
        color: '#718096',
        textAlign: 'center',
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: '#fcbf00',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    },
    backButton: {
        padding: 4,
    },
});

export default FAQScreen;