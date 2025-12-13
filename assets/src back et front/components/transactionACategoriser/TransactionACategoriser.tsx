import React, { useState, useRef, useEffect, JSX } from 'react';
import {View,Text,TouchableOpacity,Alert,Platform,ScrollView, Animated, LayoutAnimation,KeyboardAvoidingView,StyleSheet,Dimensions } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DataTable } from 'react-native-paper';
import { TransactionACategoriserType, OperationType } from '../../types/TransacACategoriserType';
import CategorizationModal from './CategorizationModal';
import OperationFilterModal from './OperationFilterModal';
import { useTransCat } from '../../context/TransacACategoriserContext';
import { ApiResponseType } from '../../types/ApiResponseType';
import { useTranslation } from '../../hooks/useTranslation';


export interface TransactionACategoriserProps {
  onCategorizeTransaction?: (transaction: TransactionACategoriserType) => void;  
}

const TransactionACategoriser: React.FC<TransactionACategoriserProps> = ({ onCategorizeTransaction }) => {

  const scrollViewRef = useRef<ScrollView>(null);

  const [isExpanded, setIsExpanded] = useState<boolean>(false); //l'accordeons reste fermer
  const [animation] = useState<Animated.Value>(new Animated.Value(0));
  const [showOperationFilterModal, setShowOperationFilterModal] = useState<boolean>(false);  //États pour le modal de filtre des opérations

  const [hasInitialLoad, setHasInitialLoad] = useState<boolean>(false); // État pour suivre le chargement initial
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {t,locale} = useTranslation();

  const { 
    listeTransacACategoriser, // Liste complète des transactions
    setlisteTransacACategoriser,
    setIsTransCatMode, // Fonction pour activer/désactiver le mode
    setTransACategoriser, // Fonction pour définir la transaction en cours
    isCategorizationModalVisible, // Visibilité du modal de catégorisation
    selectedTransaction, // Transaction sélectionnée pour catégorisation
    openCategorizationModal, // Fonction pour ouvrir le modal de catégorisation
    closeCategorizationModal, // Fonction pour fermer le modal de catégorisation
    loadTransACat,
    selectedOperation,
    setSelectedOperation,

    //Etat pagination
    page, setPage,
    itemsPerPage, setItemsPerPage,
    totalPages, setTotalPages,
    totalItems, setTotalItems,
    showItemsPerPageDropdown, setShowItemsPerPageDropdown
    
  } = useTransCat();

  // ========== EFFET POUR CHARGER LES DONNÉES QUAND LES FILTRES OU PAGINATION CHANGENT ==========
  useEffect(() => {
    if (isExpanded) {
      loadDataFromServers();
    }
  }, [page, itemsPerPage, isExpanded, selectedOperation]); 

  // ========== FONCTION DE CHARGEMENT DES DONNÉES DEPUIS LE CONTEXTE ==========
  const loadDataFromServers = async (): Promise<void> => {
    if (!isExpanded) return;
    
    setIsLoading(true);
    try {
      // console.log(`Page: ${page + 1}, Items par page: ${itemsPerPage}, Opération: ${selectedOperation?.id_sesampayx_operation || 'Toutes'}`);

      const response: ApiResponseType = await loadTransACat(page, itemsPerPage,selectedOperation?.id_sesampayx_operation || 0 );
      
      if (response.statut === true) {
        // console.log('Données valides reçues:', response.data.length + ' transactions');
        // console.log('Pagination:', response.pagination);

        setlisteTransacACategoriser(response.data);
        setTotalPages(response.pagination?.total_pages || 1);
        setTotalItems(response.pagination?.total || 0);
        setHasInitialLoad(true); // Marquons que le chargement initial est terminé
      } else {
        console.error('Erreur API:', response.message);
        Alert.alert(t.Transaction_categorization.title, t.Transaction_categorization.error_msg2 || 'Erreur lors du chargement des transactions');
        setlisteTransacACategoriser([]);
        setTotalPages(1);
        setTotalItems(0);
        setHasInitialLoad(true);
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des données:', error.message || error);
      Alert.alert(
        t.Transaction_categorization.title, 
        `${t.Transaction_categorization.error_msg2} : ${error.message || 'Erreur réseau'}`
      );
      setlisteTransacACategoriser([]);
      setTotalPages(1);
      setTotalItems(0);
      setHasInitialLoad(true);
    } finally {
      setIsLoading(false);
    }
  };


  const toggleAccordion = (): void => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    if (!isExpanded) {
      // Ouvre l'accordéon
      setIsExpanded(true);
      setHasInitialLoad(false); // Réinitialiser l'état de chargement initial
      
      Animated.timing(animation, {
        toValue: 1,         
        duration: 300,       
        useNativeDriver: false, 
      }).start();       
    } else {
      // Ferme l'accordéon
      Animated.timing(animation, {
        toValue: 0,           
        duration: 250,        
        useNativeDriver: false,
      }).start(() => setIsExpanded(false)); 
    }
  };

  // ========== GESTION DE LA SÉLECTION D'OPÉRATION ==========
  const handleOperationSelect = (operation: OperationType | null): void => {
    setSelectedOperation(operation); // Met à jour l'opération sélectionnée
    // Réinitialisons la pagination à la première page lors du changement de filtre
    setPage(1);
    
    // Fermeture du modal après sélection
    setShowOperationFilterModal(false);
  };


  /**
   * Ouvre le modal de sélection des opérations
   */
  const openOperationFilterModal = (): void => {
    setShowOperationFilterModal(true);
  };

  /**
   * Gère le clic sur le bouton d'ajout de catégorie pour une transaction
   */
  const handleAddCategory = (transaction: TransactionACategoriserType): void => {
    // console.log('Catégoriser la transaction:', transaction.id_transaction);
    
    // Ouvre le modal de catégorisation avec la transaction sélectionnée
    openCategorizationModal(transaction);
    // Active le mode de catégorisation
    setIsTransCatMode(true);
    // Stocke la transaction en cours de catégorisation
    setTransACategoriser(transaction);
  };

  /**
   * Gère le changement de page
   */
  const handlePageChange = (newPage: number): void => {
    setPage(newPage + 1);
  };

  /**
   * Gère le changement du nombre d'éléments par page
   */
  const handleItemsPerPageChange = (newItemsPerPage: number): void => {
    setItemsPerPage(newItemsPerPage);
    setPage(1); // Retour à la première page (index 0)
    setShowItemsPerPageDropdown(false);
  };

  // ========== FONCTION DE RENDU D'UNE TRANSACTION ==========
  const renderTransactionItem = (transaction: TransactionACategoriserType): JSX.Element => {
    return (
      <View style={styles.transactionListItem}>
        <View style={styles.transactionMainContainer}>

          <View style={styles.transactionIconContainer}>
            <MaterialCommunityIcons name="file-document-outline" size={20} color="#FFFFFF" />
          </View>

          {/*  NOM ET MÉTADONNÉES */}
          <View style={styles.transactionInfoContainer}>
            <Text style={styles.transactionName} numberOfLines={2}>
              {transaction.operation_name}
            </Text>
            
            {/*Date et type d'opération */}
            <View style={styles.metaDataContainer}>
              <Text style={styles.transactionDate}>
                { new Date(transaction.created_at).toLocaleDateString('fr-FR')}
              </Text>
              <Text style={styles.metaSeparator}>•</Text>
              <Text style={styles.transactionType} numberOfLines={1}>
                {transaction.operation_type_name}
              </Text>
            </View>
          </View>

          {/* ========== MONTANT ET BOUTON ========== */}
          <View style={styles.rightContentContainer}>
            <View style={styles.amountAndButtonRow}>
              {/* Conteneur du montant */}
              <View style={styles.amountContainer}>
                <Text style={styles.transactionAmount} numberOfLines={1}>
                  {transaction.amount.toLocaleString(locale)} FCFA
                </Text>
              </View>
              
              {/* Bouton + pour catégoriser */}
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => handleAddCategory(transaction)}
              >
                <MaterialIcons name="add" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // ========== FONCTION DE RENDU DE L'ÉTAT VIDE ==========
  const renderEmptyState = (iconName: string, message: string, subMessage?: string): JSX.Element => {
    return (
      <View style={styles.emptyState}>
        <MaterialIcons name={iconName as any} size={50} color="#BDC3C7" />
        <Text style={styles.emptyText}>
          {message}
        </Text>
        {subMessage && (
          <Text style={styles.emptySubtext}>
            {subMessage}
          </Text>
        )}
      </View>
    );
  };


   const contentHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Platform.OS === 'ios' ? 650 : 630], // Hauteur augmentée pour accommoder la pagination
  });


  const itemsPerPageOptions = [10, 20, 30, 50];

  // ========== FONCTION UTILITAIRE POUR LE LABEL DE PAGINATION ==========
   const getPaginationLabel = (): string => {
    const start = (page - 1) * itemsPerPage + 1;
    const end = Math.min(page * itemsPerPage, totalItems);
    return totalItems > 0 ? `${start}-${end} ${t.budget.budget_management.separator} ${totalItems}` : `0 ${t.budget.budget_management.separator} 0`;
  };

  // ========== RENDU PRINCIPAL DU COMPOSANT ==========
  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity 
        style={styles.accordionHeader} 
        onPress={toggleAccordion} // Ouvre/ferme l'accordéon au clic
      >
        {/* Titre à gauche avec plus d'espace */}
        <View style={styles.accordionTitleContainer}>
          <Text style={styles.accordionTitle} numberOfLines={1}>
            Transactions à catégoriser
          </Text>
        </View>
        
        {/* Badge au centre avec le nombre de transactions */}
        <View style={styles.badgeContainer}>
          <View style={styles.transactionCountBadge}>
            <Text style={styles.transactionCountText}>
              {totalItems}
            </Text>
          </View>
        </View>
        
        {/* Icône de flèche à droite avec animation de rotation */}
        <View style={styles.accordionIconContainer}>
          <Animated.Text style={[
            styles.accordionIcon,
            { 
                transform: [{
                // Animation de rotation de la flèche
                rotate: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'] 
                })
              }]
            }
          ]}>
            <MaterialIcons name='keyboard-arrow-down' size={22} color='#000' />
          </Animated.Text>
        </View>
      </TouchableOpacity>
        {/* ========== CONTENU DE L'ACCORDÉON ========== */}
      {isExpanded && (
      // {/* ========== CONTENU DE L'ACCORDÉON ========== */}
        <Animated.View style={[styles.accordionContent, { height: contentHeight }]}>
         
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >

              <ScrollView 
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled" 
                nestedScrollEnabled={true} 
              >
                {/* ========== SECTION FILTRES ========== */}
                <View style={styles.filtersContainer}>
                  <View style={styles.filterColumn}>
                    <Text style={styles.filterLabel}>{t.operation_depenses.filter}</Text>
                    <TouchableOpacity 
                      style={styles.filterButton}
                      onPress={openOperationFilterModal}
                    >
                      <Text style={styles.filterButtonText} numberOfLines={1}>
                        {selectedOperation ? selectedOperation.operation_name : t.operation_depenses.all_operations}
                      </Text>
        
                      <AntDesign 
                        name="down"
                        size={16} 
                        color="#FFFFFF" 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* ========== SECTION LISTE DES TRANSACTIONS ========== */}
                <View style={styles.transactionsListContainer}>
                
                  <Text style={styles.sectionTitle}>
                    {t.Transaction_categorization.title_transaction} ({totalItems})
                  </Text>
                  
                  {/* Indicateur de chargement */}
                  {isLoading && (

                    <View style={styles.loadingContainer}>
                      <MaterialIcons name="hourglass-empty" size={40}  color="#fcbf00" />
                      <Text style={styles.loadingText}>{t.Transaction_categorization.loading_transaction}</Text>
                      <Text style={styles.loadingSubText}>{t.operation_crud_and_other.please_wait}</Text>
                  </View>
                  )}
                  
                  
                  {!isLoading && hasInitialLoad && totalItems > 0 ? (

                    listeTransacACategoriser.map((transaction) => (
                      <View key={transaction.id_transaction} style={styles.transactionListItemWrapper}>
                        {renderTransactionItem(transaction)}
                      </View>
                    ))
                  ) : !isLoading && hasInitialLoad && totalItems === 0 ? (
                    renderEmptyState(
                      "info-outline", 
                      `${t.Transaction_categorization.emptyTitle}`, 
                      `${t.Transaction_categorization.emptyText}`
                    )
                  ) : null}

                  {/* ========== PAGINATION REACT-NATIVE-PAPER ========== */}
                  {!isLoading && hasInitialLoad && totalItems > 0 && (
                    <View style={styles.paginationContainer}>
                      <DataTable.Pagination
                        page={page - 1} 
                        numberOfPages={totalPages}  
                        onPageChange={handlePageChange}  
                        // numberOfItemsPerPage={itemsPerPage}
                        numberOfItemsPerPageList={itemsPerPageOptions} 
                        onItemsPerPageChange={handleItemsPerPageChange} 
                        showFastPaginationControls   
                        selectPageDropdownLabel={'Lignes par page'}   
                        style={styles.pagination}     
                        label={getPaginationLabel()}
                      />

                      {/* ========== SÉLECTEUR D'ÉLÉMENTS PAR PAGE AVEC DROPDOWN VERS LE HAUT ========== */}
                      <View style={styles.customItemsPerPageContainer}>
                        <Text style={styles.itemsPerPageLabel}>{t.budget.budget_management.item_per_page} :</Text>
                        <View style={styles.itemsPerPageSelector}>

                          <TouchableOpacity 
                            style={styles.itemsPerPageButton}
                            onPress={() => setShowItemsPerPageDropdown(!showItemsPerPageDropdown)}
                            activeOpacity={0.7}
                          >

                            <Text style={styles.itemsPerPageText}>{itemsPerPage}</Text>
                            
                            {/* INDICATEUR VISUEL D'OUVERTURE/FERMETURE */}
                            <View style={styles.itemsPerPageIconContainer}>
                              <MaterialIcons 
                                name={showItemsPerPageDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                                size={20} 
                                color="#fcbf00" 
                              />
                            </View>
                          </TouchableOpacity>
                          
                          {/* DROPDOWN VERS LE HAUT - AFFICHAGE CONDITIONNEL */}
                          {showItemsPerPageDropdown && (
                            <View style={[styles.itemsPerPageDropdown, styles.itemsPerPageDropdownUp]}>
                              
                              {/* INDICATEUR VISUEL DU DROPDOWN (FLÈCHE) */}
                              <View style={styles.dropdownArrowUp} />
                              
                              {/* LISTE DES OPTIONS DISPONIBLES */}
                              <View style={styles.itemsPerPageOptionsList}>
                                {itemsPerPageOptions.map((option) => (   
                                  <TouchableOpacity
                                    key={option}
                                    style={[
                                      styles.itemsPerPageOption, 
                                      itemsPerPage === option && styles.itemsPerPageOptionActive
                                    ]}
                                    onPress={() => handleItemsPerPageChange(option)} 
                                    activeOpacity={0.6}
                                  >
                                    
                                    {/* TEXTE DE L'OPTION */}
                                    <Text style={[
                                      styles.itemsPerPageOptionText,
                                      itemsPerPage === option && styles.itemsPerPageOptionTextActive
                                    ]}>
                                      {option} {itemsPerPage === option ? '✓' : ''}
                                    </Text>
                                    
                                    {/* INDICATEUR DE SÉLECTION (ICÔNE CHECK) */}
                                    {itemsPerPage === option && (
                                      <View style={styles.checkIconContainer}>
                                        <MaterialIcons name="check" size={16} color="#FFFFFF" />
                                      </View>
                                    )}
                                  </TouchableOpacity>
                                ))}
                              </View>
                            </View>
                          )}
                        </View>
                      </View>

                      {/* Informations de pagination supplémentaires */}
                      <View style={styles.paginationInfoContainer}>
                        <Text style={styles.paginationInfoText}>
                          {t.budget.budget_management.page} {page} {t.budget.budget_management.separator} {totalPages} • {t.budget.budget_management.total} : {totalItems} Transaction(s)
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </Animated.View>
      )}

      {/* ========== MODAL DE CATÉGORISATION ========== */}
      <CategorizationModal
        visible={isCategorizationModalVisible}
        onClose={closeCategorizationModal}
        transaction={selectedTransaction}
      />

      {/* ==========MODAL DE FILTRE DES OPÉRATIONS ========== */}
      <OperationFilterModal
        visible={showOperationFilterModal}
        onClose={() => setShowOperationFilterModal(false)}
        onOperationSelect={handleOperationSelect}
        selectedOperation={selectedOperation}
      />
    </View>
  );
};
export default TransactionACategoriser;

const styles = StyleSheet.create({
   accordionContainer: {
    backgroundColor: '#ffffff', 
    marginBottom: 6,
    borderRadius: 8, 
    // shadowColor: '#000', 
    // shadowOffset: { width: 0, height: 2 }, 
    // shadowOpacity: 0.1, 
    shadowRadius: 6, 
    // elevation: 4, 
    overflow: 'hidden', 
  },
  
  // En-tête de l'accordéon
  accordionHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 10,
    backgroundColor: '#f8f9fa', 
    height: 48, 
  },
  
  // Conteneur titre avec plus d'espace 
  accordionTitleContainer: {
    flex: 3, 
    marginRight: 8, 
  },
  
  // Style du titre de l'accordéon
  accordionTitle: {
    fontSize: Platform.OS === 'ios' ? 14 : 14, 
    fontFamily: 'Poppins-Medium',
    color: '#1a171a', 
  },
  
  //  Badge avec espace réduit (flex: 1)
  badgeContainer: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  },

  // Icône avec espace réduit
  accordionIconContainer: {
    width: 24, 
    alignItems: 'flex-end', 
  },

  // ========== STYLES DU BADGE DE COMPTE ==========
  transactionCountBadge: {
    backgroundColor: '#fcbf00', 
    borderRadius: 8, 
    paddingHorizontal: 10, 
    paddingVertical: 3, 
    minWidth: 24, 
    // height: 15,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  
  // Texte du badge
  transactionCountText: {
    color: '#FFFFFF', 
    fontSize: Platform.OS === 'ios' ? 12 : 10, 
    fontFamily: 'Poppins-Bold',
    fontWeight: '600', 
  },
  
  // Style de l'icône de l'accordéon
  accordionIcon: {
    fontSize: 16,
    color: '#EE9D00', 
  },
  
  // ========== STYLES DU CONTENU DE L'ACCORDÉON ==========
  accordionContent: {
    overflow: 'hidden', 
  },
  
  // Contenu du ScrollView
  scrollContent: {
    padding: 12, 
    paddingHorizontal: 16, 
    paddingBottom: 20, 
  },
  
  // ========== STYLES DES FILTRES ==========
  filtersContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20,
  },
  
  // Colonne de filtre individuelle
  filterColumn: {
    flex: 1, 
    marginHorizontal: 5, 
    position: 'relative', 
    zIndex: 10,
  },
  
  // Label du filtre
  filterLabel: {
    fontSize: Platform.OS === 'ios' ? 12 : 12,
    color: '#2C3E50', 
    marginBottom: 8,
    fontWeight: '600', 
    fontFamily: 'Poppins-Regular', 
  },
  
  // Bouton de filtre
  filterButton: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#fcbf00', 
    paddingHorizontal: 16,
    borderRadius: 9,
    // Ombre pour iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    // Ombre pour Android
    elevation: 2,
    minHeight: 44, 
  },
  
  // Texte du bouton de filtre
  filterButtonText: {
    color: '#FFFFFF', 
    fontSize: Platform.OS === 'ios' ? 12 : 12, 
    fontFamily: 'Poppins-Regular', 
    fontWeight: '600', 
    flex: 1, 
  },
  
  // ========== STYLES DE LA LISTE DES TRANSACTIONS ==========
  transactionsListContainer: {
    marginBottom: 20, 
  },
  
  // Titre de section
  sectionTitle: {
    fontSize: Platform.OS === 'ios' ? 13 : 13,
    fontFamily: 'Poppins-Regular', 
    fontWeight: '600', 
    color: '#2C3E50', 
    marginBottom: 16, 
  },
  
  // ========== STYLES DE CHAQUE ÉLÉMENT DE TRANSACTION ==========
  transactionListItemWrapper: {
    marginBottom: 12, 
    borderRadius: 12, 
    backgroundColor: '#F8F9FA', 

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Item de transaction
  transactionListItem: {
    padding: 16, 
  },
  
  // Conteneur principal de la transaction
  transactionMainContainer: {
    flexDirection: 'row', 
    alignItems: 'flex-start',
    justifyContent: 'space-between', 
  },
  
  // ========== STYLES DE L'ICÔNE DE TRANSACTION ==========
  transactionIconContainer: {
    width: Platform.OS === 'ios' ? 40 : 38, 
    height: Platform.OS === 'ios' ? 40 : 38,
    borderRadius: 10, 
    backgroundColor: '#fcbf00', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12, 
    flexShrink: 0, 
  },
  
  // ========== STYLES DES INFORMATIONS DE LA TRANSACTION ==========
  transactionInfoContainer: {
    flex: 1, 
    marginRight: 12,
    justifyContent: 'flex-start',
    minHeight: 50, 
  },
  
  // Nom de la transaction
  transactionName: {
    fontSize: Platform.OS === 'ios' ? 12 : 12, 
    fontFamily: 'Poppins-Bold', 
    color: '#2C3E50', 
    lineHeight: 18,
    marginBottom: 4,
  },
  
  // Conteneur des métadonnées
  metaDataContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    flexWrap: 'wrap',
  },
  
  // Date de la transaction
  transactionDate: {
    fontSize: Platform.OS === 'ios' ? 11 : 11, 
    fontFamily: 'Poppins-Regular',
    color: '#7F8C8D', 
  },
  
  // Séparateur entre date et type
  metaSeparator: {
    fontSize: Platform.OS === 'ios' ? 11 : 11, 
    color: '#7F8C8D', 
    marginHorizontal: 6, 
  },
  
  // Type de transaction
  transactionType: {
    fontSize: Platform.OS === 'ios' ? 11 : 11, 
    fontFamily: 'Poppins-Regular', 
    color: '#7F8C8D', 
    flexShrink: 1, 
  },
  
  // ========== STYLES DU CONTENU DE DROITE ==========
  rightContentContainer: {
    alignItems: 'flex-end', 
    justifyContent: 'flex-start', 
    flexShrink: 0, 
    minWidth: 100, 
  },
  
  // Ligne montant + bouton
  amountAndButtonRow: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-end',
  },
  
  // Conteneur du montant
  amountContainer: {
    marginRight: 8, 
    maxWidth: 120, 
  },
  
  // Montant de la transaction
  transactionAmount: {
    fontSize: Platform.OS === 'ios' ? 11 : 11, 
    fontFamily: 'Poppins-Bold', 
    fontWeight: '600', 
    color: '#2C3E50', 
    textAlign: 'right', 
  },
  
  // ========== STYLES DU BOUTON AJOUTER ==========
  addButton: {
    backgroundColor: '#fcbf00', 
    width: 28, 
    height: 28, 
    borderRadius: 14,
    justifyContent: 'center', 
    alignItems: 'center', 
    flexShrink: 0, 
  },
  
  // ========== STYLES DES ÉTATS VIDES ==========
  emptyState: {
    alignItems: 'center', 
    padding: 40, 
    backgroundColor: '#F8F9FA', 
    borderRadius: 12,
    marginVertical: 10,
  },
  
  // Texte principal de l'état vide
  emptyText: {
    fontSize: Platform.OS === 'ios' ? 12 : 12, 
    fontFamily: 'Poppins-Bold',
    fontWeight: '600', 
    color: '#7F8C8D',
    marginTop: 16, 
    marginBottom: 8,
    textAlign: 'center', 
  },
  
  // Texte secondaire de l'état vide
  emptySubtext: {
    fontSize: Platform.OS === 'ios' ? 12 : 12, 
    fontFamily: 'Poppins-Regular', 
    color: '#95A5A6', 
    textAlign: 'center', 
    lineHeight: 20, 
  },

  // ========== STYLES DE PAGINATION ==========
  paginationContainer: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ECF0F1',
  },

  pagination: {
    backgroundColor: 'transparent',
    minHeight: 48,
    // paddingTop: -12,
    marginTop: -12,
    marginBottom: 1,
    
  },

  paginationLabel: {
    color: '#fcbf00',
    fontFamily: 'Poppins-Regular',
  },

  // ========== STYLES POUR LE SÉLECTEUR D'ÉLÉMENTS PAR PAGE ==========
  customItemsPerPageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 1,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
    paddingTop: 12,
    position: 'relative',
    zIndex: 1000, 
  },

  itemsPerPageLabel: {
    fontSize: Platform.OS =='ios' ? 12 : 11,
    fontFamily: 'Poppins-Regular',
    color: '#2C3E50',
    fontWeight: '500',
  },

  itemsPerPageSelector: {
    position: 'relative',
    zIndex: 1001,
  },

  itemsPerPageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fcbf00',
    minWidth: 80,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  itemsPerPageText: {
    fontSize: Platform.OS =='ios' ? 12 : 11,
    fontFamily: 'Poppins-SemiBold',
    color: '#fcbf00',
    fontWeight: '600',
  },

  itemsPerPageIconContainer: {
    marginLeft: 8,
  },

  itemsPerPageDropdown: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1002,
    minWidth: 120,
    borderWidth: 2,
    borderColor: '#fcbf00',
    overflow: 'visible', 
  },

  // Style spécifique pour le dropdown vers le haut
  itemsPerPageDropdownUp: {
    bottom: '100%', 
    marginBottom: 8, 
    right: 0,
  },

  // Flèche indicative du dropdown (pointant vers le bas)
  dropdownArrowUp: {
    position: 'absolute',
    bottom: -8, 
    right: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#fcbf00',
  },

  // Liste des options dans le dropdown
  itemsPerPageOptionsList: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },

  // Option individuelle
  itemsPerPageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    minWidth: 100,
  },

  // Option active (sélectionnée)
  itemsPerPageOptionActive: {
    backgroundColor: '#fcbf00',
  },

  // Texte des options
  itemsPerPageOptionText: {
    fontSize: Platform.OS =='ios' ? 12 : 11,
    fontFamily: 'Poppins-Regular',
    color: '#2C3E50',
    fontWeight: '500',
  },

  // Texte de l'option active
  itemsPerPageOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Conteneur de l'icône de vérification
  checkIconContainer: {
    marginLeft: 2,
  },

  // ========== STYLES POUR LES INFORMATIONS DE PAGINATION ==========
  paginationInfoContainer: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
  },

  paginationInfoText: {
    fontSize: Platform.OS =='ios' ? 12 : 11,
    fontFamily: 'Poppins-Regular',
    color: '#7F8C8D',
    textAlign: 'center',
  },

  // ========== STYLES DE CHARGEMENT ==========
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginVertical: 10,
  },

  // loadingText: {
  //   fontSize: 14,
  //   color: '#fcbf00',
  //   fontFamily: 'Poppins-Regular',
  // },
  loadingText: {
    marginTop: 15,
    fontFamily: 'Poppins-Regular',
    color:'#333333',
    fontSize: 14,
    textAlign: 'center',
  },
  loadingSubText: {
    marginTop: 5,
    fontFamily: "Poppins-Regular",
    color:'#666666',
    fontSize: 12,
    textAlign: 'center',
  },
  //fin style pagination
});
