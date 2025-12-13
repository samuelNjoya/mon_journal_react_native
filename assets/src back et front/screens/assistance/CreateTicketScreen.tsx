import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    Modal,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { homeService } from '../../api/services/home';
import ErrorModal from '../../components/Notification';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '../../hooks/useTranslation';

interface Category {
    id: string;
    title: string;
    description?: string;
    icon?: string;
}

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    tags?: string[];
}

interface NewTicket {
    id_category: string;
    title: string;
    description: string;
    category: string;
    priority?: 'low' | 'medium' | 'high';
    faqSelected?: boolean;
    selectedFaq?: FAQ | null;
}

const CreateTicketScreen: React.FC = ({ navigation }: any) => {
    const [formData, setFormData] = useState<NewTicket>({
        id_category: '',
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        faqSelected: false,
        selectedFaq: null
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showFaqModal, setShowFaqModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [characterCount, setCharacterCount] = useState(0);
    const [attachments, setAttachments] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const insets = useSafeAreaInsets();
    const { t, language } = useTranslation();

    // Catégories par défaut
    // const defaultCategories: Category[] = [
    //     { id: '1', name: 'Problème Technique', description: 'Problèmes liés à l\'application ou au site web', icon: 'bug' },
    //     { id: '2', name: 'Question Facturation', description: 'Questions sur les paiements et factures', icon: 'card' },
    //     { id: '3', name: 'Support Compte', description: 'Problèmes de connexion ou de compte', icon: 'person' },
    //     { id: '4', name: 'Demande Fonctionnalité', description: 'Suggestion de nouvelles fonctionnalités', icon: 'bulb' },
    //     { id: '5', name: 'Problème Transaction', description: 'Problèmes avec les transactions', icon: 'swap-horizontal' },
    //     { id: '6', name: 'Autre', description: 'Autre type de demande', icon: 'help-circle' }
    // ];

    // FAQs par défaut
    const defaultFaqs: FAQ[] = [
        {
            id: '1',
            question: 'Problème de connexion à mon compte',
            answer: 'Je n\'arrive pas à me connecter à mon compte. J\'ai oublié mon mot de passe ou mon identifiant.',
            category: 'Support Compte',
            tags: ['connexion', 'mot de passe', 'identifiant']
        },
        {
            id: '2',
            question: 'Transaction en attente depuis longtemps',
            answer: 'Ma transaction est en attente depuis plus de 24 heures et je ne reçois pas de confirmation.',
            category: 'Problème Transaction',
            tags: ['transaction', 'attente', 'confirmation']
        },
        {
            id: '3',
            question: 'Facturation incorrecte',
            answer: 'J\'ai été facturé un montant incorrect ou j\'ai reçu une facture en double.',
            category: 'Question Facturation',
            tags: ['facturation', 'montant', 'double']
        },
        {
            id: '4',
            question: 'Application qui plante',
            answer: 'L\'application se ferme subitement ou ne répond pas lorsque j\'essaie de l\'utiliser.',
            category: 'Problème Technique',
            tags: ['application', 'plantage', 'bug']
        },
        {
            id: '5',
            question: 'Demande de nouvelle fonctionnalité',
            answer: 'Je souhaiterais proposer une nouvelle fonctionnalité pour améliorer l\'application.',
            category: 'Demande Fonctionnalité',
            tags: ['fonctionnalité', 'suggestion', 'amélioration']
        }
    ];

    // const priorities = [
    //     { value: 'low', label: 'Basse', color: '#4ECDC4', icon: 'arrow-down' },
    //     { value: 'medium', label: 'Moyenne', color: '#F9A826', icon: 'remove' },
    //     { value: 'high', label: 'Élevée', color: '#FF6B6B', icon: 'arrow-up' }
    // ];

    const fetchData = async () => {
        try {
            setLoading(true);

            const result = await homeService.getCategories();
            // console.log(result.data.datas[3])
            if (result.success && result.data.status) {
                const categoriesData = result.data.datas.map((item: any) => {
                    return {
                        id: item.id_category,
                        title: item.title,
                        description: item.description
                    }
                })
                await loadCategories(categoriesData)
                //setTickets(processedTickets);

            } else {
                setErrorMessage(result.data?.err_msg || result.error);
            }
        } catch (err: any) {
            console.error('Erreur API:', err);
            Alert.alert(t.alerts.error, t.ticket.loadTicketError);
        } finally {
            setLoading(false);
        }
    }

    // Charger les catégories et FAQs
    useEffect(() => {
        fetchData()
    }, []);

    const loadCategories = async (categories: Category[]) => {
        try {
            setCategories(categories);
        } catch (error) {
            setCategories([]);
        }
    };

    const loadFaqs = async () => {
        try {
            setFaqs([]);
        } catch (error) {
            setFaqs([]);
        }
    };

    // Filtrer les FAQs selon la recherche
    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Gestion des changements de formulaire
    const handleInputChange = (field: keyof NewTicket, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (field === 'description') {
            setCharacterCount(value.length);
        }
    };

    // Sélectionner une FAQ
    const handleSelectFaq = (faq: FAQ) => {
        setFormData(prev => ({
            ...prev,
            faqSelected: true,
            selectedFaq: faq,
            title: faq.question,
            description: faq.answer,
            category: faq.category
        }));
        setShowFaqModal(false);
        setSearchQuery('');
    };

    // Désélectionner la FAQ
    const handleDeselectFaq = () => {
        setFormData(prev => ({
            ...prev,
            faqSelected: false,
            selectedFaq: null,
            title: '',
            description: '',
            category: ''
        }));
    };

    // Sélectionner une catégorie
    const handleSelectCategory = (category: Category) => {
        console.log(category.id)
        setFormData(prev => ({
            ...prev,
            id_category: category.id,
            category: category.title
        }));
        setShowCategoryModal(false);
    };

    // Sélectionner une priorité
    const handleSelectPriority = (priority: 'low' | 'medium' | 'high') => {
        setFormData(prev => ({
            ...prev,
            priority
        }));
    };

    // Valider le formulaire
    const validateForm = (): boolean => {
        if (!formData.id_category) {
            setErrorMessage(t.ticket.invalidCategory);
            return false;
        }
        if (formData.faqSelected) {
            // Validation avec FAQ sélectionnée
            if (!formData.selectedFaq) {
                setErrorMessage(t.ticket.invalidFaq);
                return false;
            }
        } else {
            // Validation avec saisie manuelle
            if (!formData.title.trim()) {
                setErrorMessage(t.ticket.invalidTitle);
                return false;
            }
            if (formData.title.length < 5) {
                setErrorMessage(t.ticket.minTitle);
                return false;
            }
            if (!formData.description.trim()) {
                setErrorMessage(t.ticket.invalidDescription);
                return false;
            }
            if (formData.description.length < 10) {
                setErrorMessage(t.ticket.minDescription);
                return false;
            }
        }
        return true;
    };

    // Soumettre le formulaire
    const handleSubmit = async () => {
        if (!validateForm()) return;
        try {
            setLoading(true);
            setErrorMessage('');

            // Utiliser les données de la FAQ ou les données manuelles
            const ticketData = formData.faqSelected && formData.selectedFaq ? {
                id_category: formData.id_category,
                title: formData.selectedFaq.question,
                description: formData.selectedFaq.answer,
                faq_id: formData.selectedFaq.id
            } : {
                id_category: formData.id_category,
                title: formData.title,
                description: formData.description,
            };

            const result = await homeService.createTicket(ticketData as any);

            if (result.success) {
                Alert.alert(
                    t.ticket.success,
                    t.ticket.create_success,
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                navigation.goBack();
                            }
                        }
                    ]
                );
            } else {
                setErrorMessage(result.data?.err_msg || t.ticket.create_error);
            }
        } catch (error: any) {
            //console.error('Erreur:', error);
            setErrorMessage(error.message || t.ticket.create_error);
        } finally {
            setLoading(false);
        }
    };

    // Rendu d'une FAQ dans la modal
    const renderFaqItem = ({ item }: { item: FAQ }) => (
        <TouchableOpacity
            style={styles.faqItem}
            onPress={() => handleSelectFaq(item)}
        >
            <View style={styles.faqIconContainer}>
                <Ionicons name="help-circle" size={20} color="#fcbf00" />
            </View>
            <View style={styles.faqInfo}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Text style={styles.faqAnswer} numberOfLines={2}>{item.answer}</Text>
                <View style={styles.faqCategory}>
                    <Ionicons name="pricetag" size={12} color="#718096" />
                    <Text style={styles.faqCategoryText}>{item.category}</Text>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#CBD5E0" />
        </TouchableOpacity>
    );

    // Rendu d'une catégorie dans la modal
    const renderCategoryItem = ({ item }: { item: Category }) => (
        <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => handleSelectCategory(item)}
        >
            <View style={styles.categoryIconContainer}>
                <Ionicons
                    name={item.icon as any || 'help-circle'}
                    size={20}
                    color="#fcbf00"
                />
            </View>
            <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{item.title}</Text>
                <Text style={styles.categoryDescription}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#CBD5E0" />
        </TouchableOpacity>
    );

    // Rendu d'un bouton de priorité
    // const renderPriorityButton = (priority: typeof priorities[0]) => (
    //     <TouchableOpacity
    //         style={[
    //             styles.priorityButton,
    //             formData.priority === priority.value && styles.priorityButtonSelected,
    //             { borderColor: priority.color }
    //         ]}
    //         onPress={() => handleSelectPriority(priority.value as any)}
    //     >
    //         <Ionicons
    //             name={priority.icon as any}
    //             size={16}
    //             color={formData.priority === priority.value ? '#FFFFFF' : priority.color}
    //         />
    //         <Text style={[
    //             styles.priorityButtonText,
    //             formData.priority === priority.value && styles.priorityButtonTextSelected,
    //             { color: formData.priority === priority.value ? '#FFFFFF' : priority.color }
    //         ]}>
    //             {priority.label}
    //         </Text>
    //     </TouchableOpacity>
    // );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ErrorModal
                visible={errorMessage !== ''}
                type='error'
                onClose={() => setErrorMessage('')}
                message={errorMessage}
            />

            {/* Modal de sélection des FAQs */}
            {/* <Modal
                visible={showFaqModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowFaqModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Questions Fréquentes (FAQ)</Text>
                            <TouchableOpacity
                                onPress={() => setShowFaqModal(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color="#2D3748" />
                            </TouchableOpacity>
                        </View>

                        {/* Barre de recherche 
                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={20} color="#A0AEC0" />
                            <TextInput
                                style={styles.searchInput}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder="Rechercher dans les FAQs..."
                                placeholderTextColor="#A0AEC0"
                            />
                        </View>

                        <FlatList
                            data={filteredFaqs}
                            renderItem={renderFaqItem}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={styles.emptyFaq}>
                                    <Ionicons name="search" size={48} color="#CBD5E0" />
                                    <Text style={styles.emptyFaqText}>Aucune FAQ trouvée</Text>
                                </View>
                            }
                        />
                    </View>
                </View>
            </Modal> */}

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
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 5 }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#2D3748" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t.ticket.new}</Text>
                <View style={styles.headerPlaceholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Section FAQ
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Question Fréquente (FAQ)</Text>
                    <Text style={styles.sectionSubtitle}>
                        Sélectionnez une question fréquente pour remplir automatiquement le ticket
                    </Text>

                    {formData.faqSelected && formData.selectedFaq ? (
                        <View style={styles.selectedFaqContainer}>
                            <View style={styles.selectedFaqHeader}>
                                <View style={styles.faqIconSelected}>
                                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                                </View>
                                <Text style={styles.selectedFaqTitle}>FAQ sélectionnée</Text>
                                <TouchableOpacity
                                    onPress={handleDeselectFaq}
                                    style={styles.deselectFaqButton}
                                >
                                    <Ionicons name="close" size={16} color="#FF6B6B" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.selectedFaqContent}>
                                <Text style={styles.selectedFaqQuestion}>{formData.selectedFaq.question}</Text>
                                <Text style={styles.selectedFaqAnswer}>{formData.selectedFaq.answer}</Text>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.faqSelector}
                            onPress={() => setShowFaqModal(true)}
                        >
                            <View style={styles.faqSelectorContent}>
                                <Ionicons name="help-circle" size={24} color="#fcbf00" />
                                <View style={styles.faqSelectorText}>
                                    <Text style={styles.faqSelectorTitle}>Parcourir les FAQs</Text>
                                    <Text style={styles.faqSelectorSubtitle}>
                                        Gagnez du temps en sélectionnant une question similaire
                                    </Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
                        </TouchableOpacity>
                    )}
                </View> */}

                {/* Section Catégorie */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t.ticket.category_title}</Text>
                    <Text style={styles.sectionSubtitle}>{t.ticket.category_subtitle}</Text>

                    <TouchableOpacity
                        style={styles.categorySelector}
                        onPress={() => setShowCategoryModal(true)}
                    >
                        {formData.id_category ? (
                            <View style={styles.selectedCategory}>
                                <Ionicons
                                    name={categories.find(c => c.title === formData.category)?.icon as any || 'help-circle'}
                                    size={20}
                                    color="#fcbf00"
                                />
                                <Text style={styles.selectedCategoryText}>{formData.category}</Text>
                            </View>
                        ) : (
                            <Text style={styles.categoryPlaceholder}>{t.ticket.select_category}</Text>
                        )}
                        <Ionicons name="chevron-down" size={20} color="#CBD5E0" />
                    </TouchableOpacity>
                </View>

                {/* Section Priorité */}
                {/* <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Priorité</Text>
                    <Text style={styles.sectionSubtitle}>Indiquez l'urgence de votre demande</Text>

                    <View style={styles.priorityContainer}>
                        {priorities.map(renderPriorityButton)}
                    </View>
                </View> */}

                {/* Champs titre et description seulement si aucune FAQ sélectionnée */}
                {!formData.faqSelected && (
                    <>
                        {/* Section Titre */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t.ticket.subject}</Text>
                            <Text style={styles.sectionSubtitle}>
                                {t.ticket.subject_subtitle}
                            </Text>

                            <TextInput
                                style={styles.textInput}
                                value={formData.title}
                                onChangeText={(text) => handleInputChange('title', text)}
                                placeholder={t.ticket.subject_placeholder}
                                placeholderTextColor="#A0AEC0"
                                maxLength={100}
                            />
                            <Text style={styles.charCount}>
                                {formData.title.length}{t.ticket.on100caracters}
                            </Text>
                        </View>

                        {/* Section Description */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t.ticket.description}</Text>
                            <Text style={styles.sectionSubtitle}>
                                {t.ticket.description_subtitle}
                            </Text>

                            <TextInput
                                style={[styles.textInput, styles.textArea]}
                                value={formData.description}
                                onChangeText={(text) => handleInputChange('description', text)}
                                placeholder={t.ticket.description_placeholder}
                                placeholderTextColor="#A0AEC0"
                                multiline
                                numberOfLines={6}
                                textAlignVertical="top"
                                maxLength={1000}
                            />
                            <Text style={styles.charCount}>
                                {characterCount}{t.ticket.on1000caracters}
                            </Text>
                        </View>
                    </>
                )}

                {/* Section Pièces jointes (optionnelle) */}
                {/* <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Pièces jointes (optionnel)</Text>
                    <Text style={styles.sectionSubtitle}>
                        Ajoutez des captures d'écran ou documents utiles
                    </Text>

                    <TouchableOpacity style={styles.attachmentButton}>
                        <Ionicons name="attach" size={20} color="#fcbf00" />
                        <Text style={styles.attachmentButtonText}>Ajouter une pièce jointe</Text>
                    </TouchableOpacity>
                </View> */}

                {/* Conseils */}
                {/* <View style={styles.tipsContainer}>
                    <Text style={styles.tipsTitle}>💡 Conseils pour une réponse rapide</Text>
                    <View style={styles.tipItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
                        <Text style={styles.tipText}>Sélectionnez une FAQ si votre problème correspond</Text>
                    </View>
                    <View style={styles.tipItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
                        <Text style={styles.tipText}>Choisissez la bonne catégorie et priorité</Text>
                    </View>
                    <View style={styles.tipItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
                        <Text style={styles.tipText}>Ajoutez des captures d'écran si nécessaire</Text>
                    </View>
                </View> */}
            </ScrollView>

            {/* Bouton de soumission */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        (!formData.id_category || (!formData.faqSelected && (!formData.title || !formData.description))) && styles.submitButtonDisabled
                    ]}
                    onPress={handleSubmit}
                    disabled={!formData.id_category || (!formData.faqSelected && (!formData.title || !formData.description)) || loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <>
                            <Ionicons name="ticket" size={20} color="#FFFFFF" />
                            <Text style={styles.submitButtonText}>
                                {formData.faqSelected ? t.ticket.create_with_faq : t.ticket.create}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fcbf00',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2D3748',
        fontFamily: 'Poppins-SemiBold',
    },
    headerPlaceholder: {
        width: 32,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    section: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 4,
        fontFamily: 'Poppins-SemiBold',
    },
    sectionSubtitle: {
        fontSize: 12,
        color: '#718096',
        marginBottom: 12,
        fontFamily: 'Poppins-Regular',
        lineHeight: 16,
    },
    // Styles pour la sélection FAQ
    faqSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 2,
        borderColor: '#fcbf00',
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 16,
        backgroundColor: '#FFFBF0',
    },
    faqSelectorContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    faqSelectorText: {
        marginLeft: 12,
        flex: 1,
    },
    faqSelectorTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D3748',
        fontFamily: 'Poppins-SemiBold',
    },
    faqSelectorSubtitle: {
        fontSize: 12,
        color: '#718096',
        marginTop: 2,
        fontFamily: 'Poppins-Regular',
    },
    selectedFaqContainer: {
        borderWidth: 2,
        borderColor: '#4ECDC4',
        borderRadius: 12,
        backgroundColor: '#F0FFF4',
        overflow: 'hidden',
    },
    selectedFaqHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4ECDC4',
        padding: 12,
    },
    faqIconSelected: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    selectedFaqTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        flex: 1,
        fontFamily: 'Poppins-SemiBold',
    },
    deselectFaqButton: {
        padding: 4,
    },
    selectedFaqContent: {
        padding: 16,
    },
    selectedFaqQuestion: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 8,
        fontFamily: 'Poppins-SemiBold',
    },
    selectedFaqAnswer: {
        fontSize: 12,
        color: '#718096',
        lineHeight: 16,
        fontFamily: 'Poppins-Regular',
    },
    // Styles pour la modal FAQ
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
    closeButton: {
        padding: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    faqItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F7FAFC',
    },
    faqIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFBF0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    faqInfo: {
        flex: 1,
    },
    faqQuestion: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D3748',
        fontFamily: 'Poppins-SemiBold',
    },
    faqAnswer: {
        fontSize: 12,
        color: '#718096',
        marginTop: 4,
        fontFamily: 'Poppins-Regular',
    },
    faqCategory: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    faqCategoryText: {
        fontSize: 10,
        color: '#718096',
        marginLeft: 4,
        fontFamily: 'Poppins-Regular',
    },
    emptyFaq: {
        alignItems: 'center',
        padding: 40,
    },
    emptyFaqText: {
        fontSize: 14,
        color: '#CBD5E0',
        marginTop: 8,
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
        padding: 12,
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
    priorityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    priorityButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 2,
        backgroundColor: 'transparent',
    },
    priorityButtonSelected: {
        backgroundColor: '#FF6B6B',
    },
    priorityButtonText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
        fontFamily: 'Poppins-SemiBold',
    },
    priorityButtonTextSelected: {
        color: '#FFFFFF',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        backgroundColor: '#F7FAFC',
        fontFamily: 'Poppins-Regular',
    },
    textArea: {
        minHeight: 120,
        textAlignVertical: 'top',
    },
    charCount: {
        fontSize: 12,
        color: '#A0AEC0',
        textAlign: 'right',
        marginTop: 4,
        fontFamily: 'Poppins-Regular',
    },
    attachmentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#fcbf00',
        borderStyle: 'dashed',
        borderRadius: 8,
        padding: 16,
        backgroundColor: '#FFFBF0',
    },
    attachmentButtonText: {
        fontSize: 14,
        color: '#fcbf00',
        marginLeft: 8,
        fontFamily: 'Poppins-Medium',
    },
    tipsContainer: {
        backgroundColor: '#F0FFF4',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#4ECDC4',
    },
    tipsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 8,
        fontFamily: 'Poppins-SemiBold',
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    tipText: {
        fontSize: 12,
        color: '#718096',
        marginLeft: 8,
        fontFamily: 'Poppins-Regular',
    },
    footer: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fcbf00',
        padding: 16,
        borderRadius: 8,
    },
    submitButtonDisabled: {
        backgroundColor: '#CBD5E0',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginLeft: 8,
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
});

export default CreateTicketScreen;