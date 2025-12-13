import React, { useState, useRef, JSX, useEffect } from 'react';
import {View,Text,TouchableOpacity,Alert,Platform,ScrollView, Animated, LayoutAnimation,KeyboardAvoidingView,StyleSheet} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DataTable } from 'react-native-paper';

import {BudgetType, CycleType } from '../../types/BudgetType';

import BudgetDetailsModal from './BudgetDetailsModal';
import { useBudget } from '../../context/BudgetsContext';
import { BudgetService } from '../../services/BudgetService';
import { ApiResponseType } from '../../types/ApiResponseType';
import { Translations } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';


export interface BudgetCategorieProps {
  onEditBudget :(budget: BudgetType) => void;  
}

const BudgetCategorie: React.FC<BudgetCategorieProps> = ({ onEditBudget }) => {
  
  const scrollViewRef = useRef<ScrollView>(null);
 
  const [isExpanded, setIsExpanded] = useState<boolean>(true); //accordeons toujours ouvert
  const [animation] = useState<Animated.Value>(new Animated.Value(1)); // Commence à 1 pour être ouvert
  const [selectedBudget, setSelectedBudget] = useState<BudgetType | null>(null);
  const [showStatusFilter, setShowStatusFilter] = useState<boolean>(false);
  const [showBudgetModal, setShowBudgetModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {t,locale} = useTranslation();

  // ========== CONTEXTE ==========
  const { 
    onDeleteBudget, 
    onStopBudgetCyclique, 
    getCollectionBudget, // Récupérer getCollectionBudget du contexte
    listebudgets, // Récupérer la liste des budgets du contexte
    setListebudgets,
    selectedStatus,
    setSelectedStatus,

    //Etat pagination
    page, setPage,
    itemsPerPage, setItemsPerPage,
    totalPages, setTotalPages,
    totalItems, setTotalItems,
    showItemsPerPageDropdown, setShowItemsPerPageDropdown
   } = useBudget();


  // ========== EFFET POUR CHARGER LES BUDGETS QUAND LES FILTRES CHANGENT ==========
  //Execution du hook à chaque fois qu'une des dépendances change : page, itemsPerPage, selectedStatus, ou isExpanded
  useEffect(() => {
    if (isExpanded) {
      loadDataFromServer();
    }
  }, [page, itemsPerPage, selectedStatus, isExpanded]);

  // ========== FONCTION DE CHARGEMENT DES DONNÉES DEPUIS LE CONTEXTE ==========
  const loadDataFromServer = async (): Promise<void> => {
    if (!isExpanded) return;
    
    setIsLoading(true);
    try {
      
      const response: ApiResponseType = await getCollectionBudget(page, itemsPerPage, selectedStatus);
      
      if (response.statut === true) {
        // console.log('Données valides reçues:', response.data.length + ' budgets');
        // console.log('Pagination:', response.pagination);

        setListebudgets(response.data);
        setTotalPages(response.pagination?.total_pages || 1);
        setTotalItems(response.pagination?.total || 0);
      } else {
        console.error('Erreur API:', response.message);
        Alert.alert('Erreur', response.message || 'Erreur lors du chargement des budgets');
        // setPaginatedBudgets([]);
        setListebudgets([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des données:', error.message || error);
      Alert.alert(
        'Erreur', 
        `Impossible de charger les données des budgets: ${error.message || 'Erreur réseau'}`
      );

      setListebudgets([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  // ========== FONCTIONS DE PAGINATION ==========
  /**
   * Gère le changement de page 
   */
  const handlePageChange = (newPage: number): void => {
    setPage(newPage + 1); // Conversion de l'index (0-based) vers Laravel (1-based)
  };

  /**
   * Gère le changement du nombre d'éléments par page
   */
  const handleItemsPerPageChange = (newItemsPerPage: number): void => {
    setItemsPerPage(newItemsPerPage);
    setPage(1); // Retour à la première page
    setShowItemsPerPageDropdown(false);
  };

  // ========== FONCTION D'ANIMATION DE L'ACCORDÉON ==========
  const toggleAccordion = (): void => {

    /*
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    if (!isExpanded) {
      setIsExpanded(true);
      Animated.timing(animation, {
        toValue: 1,          
        duration: 300,       
        useNativeDriver: false,
      }).start(() => {
        // Charger les données après l'ouverture de l'accordéon
        loadDataFromServer();
      });       
    } else {
      Animated.timing(animation, {
        toValue: 0,           
        duration: 250,        
        useNativeDriver: false,
      }).start(() => setIsExpanded(false)); 
    }
    */
  };

  // ========== FONCTION DE GESTION DE LA SÉLECTION DU BUDGET ==========
  const handleBudgetSelect = async (budget: BudgetType | null) => {
    if (!budget) return;

    try {
      const budgetSelectionne = await BudgetService.getBudgetCategorieByIdBudget(budget?.id || 0);
      setSelectedBudget(budgetSelectionne);
      setShowBudgetModal(true);
    } catch (error) {
      console.error('Erreur lors du chargement des détails du budget:', error);
      Alert.alert('Erreur', 'Impossible de charger les détails du budget');
    }
  };

  // ========== FONCTION DE GESTION DE LA SÉLECTION DU STATUT ==========
  const handleStatusSelect = (status: string): void => {
    setSelectedStatus(status);
    setPage(1); 
    setShowStatusFilter(false);
  };

  // ========== FERMETURE DU MODAL ==========
  const handleCloseModal = (): void => {
    setShowBudgetModal(false);
  };

  // ========== FONCTION DE GESTION DE LA MODIFICATION D'UN BUDGET ==========
  const handleEditBudget = (budget: BudgetType): void => {
    // console.log('Modification du budget:', budget.id);
    
    if (onEditBudget) {
      onEditBudget(budget);
    } else {
      Alert.alert(
        `${t.budget.handleEdit.title1}`, 
        `${t.budget.handleEdit.message1} "${budget.libelle}"`,
        [{ text: "OK" }]
      );
    }
  };

  // ========== FONCTION DE GESTION DE LA SUPPRESSION D'UN BUDGET ==========
  const handleDeleteBudget = (budget: BudgetType, t: Translations): void => {
    Alert.alert(
      `${t.budget.handleDelete.title1}`,
      `${t.budget.handleDelete.message1} "${budget.libelle}" ?`,
      [
        {
          text: `${t.budget.handleDelete.text1}`,    
          style: "cancel"      
        },
        { 
          text: `${t.budget.handleDelete.text2}`,   
          style: "destructive", 
          onPress: async () => {     
            try {
              // console.log(`Budget ${budget.id} supprimé`);
              await onDeleteBudget(budget?.id || 0, t);
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
              Alert.alert(`${t.budget.handleDelete.title2}`, `${t.budget.handleDelete.error_msg}`);
            }
          }
        }
      ]
    );
  };

  // ========== FONCTION DE GESTION DE L'ARRÊT DU CYCLE D'UN BUDGET ==========
  const handleStopBudgetCycle = (budget: BudgetType, t: Translations): void => {
    Alert.alert(
      `${t.budget.handleStopCycle.title1}`,
      `${t.budget.handleStopCycle.message1} "${budget.libelle}" ?`,
      [
        {
          text: `${t.budget.handleStopCycle.text1}`, 
          style: "cancel"
        },
        { 
          text: `${t.budget.handleStopCycle.text2}`,  
          onPress: async () => {
            try {
              await onStopBudgetCyclique(budget?.id || 0, t);
            } catch (error) {
              console.error('Erreur lors de l\'arrêt du cycle:', error);
              Alert.alert(`${t.budget.handleStopCycle.title2}`, `${t.budget.handleStopCycle.error_msg}`);
            }
          }
        }
      ]
    );
  };

  // LIBELLÉS POUR LES TYPES DE CYCLE
      const getCycleLabel = (type: CycleType | '', t: Translations) => {
        switch (type) {
          case 'hebdomadaire':
            return t.budget.weekly_type;
          case 'mensuel':
            return t.budget.monthly_type;
          case 'annuel':
            return t.budget.annual_type;
          default:
            return t.budget.seach_cycle;
        }
      };
  // ========== FONCTION DE RENDU DE CHAQUE BUDGET ==========
  const renderBudgetListItem = (budget: BudgetType): JSX.Element => {
    
    const libelle = budget.libelle || 'Budget sans nom';
    const statutBudget = budget.statutBudget ?? 0;
    const isCyclique = budget.isCyclique ?? 0;
    const typeCycle = budget.typeCycle || '';
    const pourcentage_utilisation = budget.pourcentage_utilisation || 0;
    const total_depense = budget.total_depense || 0;
    const montantBudget = budget.montantBudget || 0;
    const cycleStatus = budget.cycleStatus ?? 0;

    return (
      <TouchableOpacity onPress={() => handleBudgetSelect(budget)}>
        <View style={styles.budgetListItem}>

          <View style={styles.budgetListHeader}>
            <View style={styles.budgetListInfo}>
              <View style={styles.budgetIconContainer}>
                <FontAwesome name="money" size={18} color="#FFFFFF" />
              </View>
              <View style={styles.budgetTextContainer}>
                <Text style={styles.budgetListName} numberOfLines={2}>
                  {libelle}
                </Text>
                <View style={styles.budgetStatusRow}>
                  <View style={styles.statusContainer}>
                    <View style={styles.statusIndicatorContainer}>
                      <Text 
                        style={[
                          styles.statusIndicator,
                          { backgroundColor: statutBudget == 0 ? '#27AE60' : '#E74C3C' }
                        ]}
                      />
                    </View>
                    <View style={styles.statusTextContainer}>
                      <Text style={styles.budgetStatusText}>
                        {statutBudget == 0 ? `${t.budget.detail_budget.in_Progress}` : `${t.budget.detail_budget.completed}`}
                        {isCyclique == 1 && ` • ${t.budget.detail_budget.recurring} • ${getCycleLabel(typeCycle, t)}`}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            
            {/* ACTIONS RAPIDES */}
            <View style={styles.budgetListActions}>
             
                <>
                 {statutBudget == 0 && (
                   <>
                    <TouchableOpacity 
                      style={styles.budgetActionIcon}
                      onPress={() => handleEditBudget(budget)} 
                    >
                      <MaterialIcons name="edit" size={18} color="#3498DB" />
                    </TouchableOpacity>
                      </>
                    )}

                    {isCyclique == 1 && cycleStatus == 1 &&  (
                      <TouchableOpacity 
                        style={styles.budgetActionIcon}
                        onPress={() => handleStopBudgetCycle(budget, t)}
                      >
                        <MaterialIcons name="pause-circle-outline" size={18} color="#E67E22" />
                      </TouchableOpacity>
                    )}
                 
              
                  <TouchableOpacity 
                    style={styles.budgetActionIcon}
                    onPress={() => handleDeleteBudget(budget, t)}
                  >
                    <MaterialIcons name="delete" size={18} color="#E74C3C" />
                  </TouchableOpacity>
                </>
            </View>
          </View>
          
          {/* BARRE DE PROGRESSION */}
          <View style={styles.budgetListProgressContainer}>
            <View style={styles.budgetListProgressBackground}>
              <View 
                style={[
                  styles.budgetListProgressFill,
                  { 
                    width: `${Math.min(pourcentage_utilisation, 100)}%`,
                    backgroundColor: pourcentage_utilisation > 80 ? '#E74C3C' : pourcentage_utilisation > 60 ? '#F39C12' : '#2ECC71'
                  }
                ]} 
              />
            </View>
            <Text style={styles.budgetListProgressText}>
              {pourcentage_utilisation.toFixed(1)}%
            </Text>
          </View>
          
          {/* INFORMATIONS FINANCIÈRES */}
          <View style={styles.budgetListFinancial}>
            <Text style={styles.budgetListAmount}>
              {total_depense.toLocaleString(locale)} / {montantBudget.toLocaleString(locale)} FCFA
            </Text>
          </View>
        </View>
       </TouchableOpacity>
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

  // ========== CONFIGURATION DE L'ANIMATION DE HAUTEUR - ==========
  const contentHeight = animation.interpolate({
    inputRange: [0, 1],
    //l'accordéon est toujours ouvert à sa hauteur complète
    outputRange: [Platform.OS === 'ios' ? 800 : 780, Platform.OS === 'ios' ? 800 : 780],
  });

  // ========== OPTIONS POUR LES ÉLÉMENTS PAR PAGE ==========
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
      {/* EN-TÊTE DE L'ACCORDÉON */}
      <View 
        style={styles.accordionHeader} 
      >
        <View style={styles.accordionTitleContainer}>
          <Text style={styles.accordionTitle}> {t.budget.budget_management.title_accordeons}</Text>
        </View>
      </View>

      {/* CONTENU DE L'ACCORDÉON  */}
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
            {/* SECTION FILTRES */}
            <View style={styles.filtersContainer}>
              <View style={styles.filterColumn}>
                <Text style={styles.filterLabel}>{t.budget.budget_management.status}</Text>
                <TouchableOpacity 
                  style={styles.filterButton}
                  onPress={() => setShowStatusFilter(!showStatusFilter)}
                >
                  <Text style={styles.filterButtonText}>
                    {selectedStatus === 'tous' ? `${t.budget.budget_management.all_status}` : 
                     selectedStatus === 'En cours' ? `${t.budget.detail_budget.in_Progress}` : `${t.budget.detail_budget.completed}`}
                  </Text>
                  <AntDesign 
                    name={showStatusFilter ? "up" : "down"} 
                    size={16} 
                    color="#FFFFFF" 
                  />
                </TouchableOpacity>

                {showStatusFilter && (
                  <View style={styles.filterDropdown}>
                    <TouchableOpacity 
                      style={styles.filterOption}
                      onPress={() => handleStatusSelect('tous')}
                    >
                      <Text style={styles.filterOptionText}>{t.budget.budget_management.all_status}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.filterOption}
                      onPress={() => handleStatusSelect('En cours')}
                    >
                      <Text style={styles.filterOptionText}>{t.budget.detail_budget.in_Progress}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.filterOption}
                      onPress={() => handleStatusSelect('Terminé')}
                    >
                      <Text style={styles.filterOptionText}>{t.budget.detail_budget.completed}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            {/* SECTION LISTE DES BUDGETS */}
            <View style={styles.budgetsListContainer}>
                <Text style={styles.sectionTitle}>
                  {t.budget.budget_management.title_budgets} ({totalItems})
                </Text>
                
                {/* Indicateur de chargement */}
                {isLoading && (
                  <View style={styles.loadingContainer}>
                      <MaterialIcons name="hourglass-empty" size={40}  color="#fcbf00" />
                      <Text style={styles.loadingText}>{t.budget.budget_management.loading_budget}</Text>
                      <Text style={styles.loadingSubText}>{t.operation_crud_and_other.please_wait}</Text>
                  </View>
                  
                )}
                
                {/* AFFICHAGE DES BUDGETS */}
                {!isLoading && listebudgets.length > 0 ? (
                  listebudgets.map((budget) => (
                    <View key={budget.id} style={styles.budgetListItemWrapper}>
                      {renderBudgetListItem(budget)}
                    </View>
                  ))
                ) : (
                  !isLoading && renderEmptyState(
                    "info-outline", 
                    `${t.budget.budget_management.emptyTitle}`, 
                    `${t.budget.budget_management.emptyText}`
                  )
                )}

              {/* ========== PAGINATION REACT-NATIVE-PAPER  ========== */}
              {!isLoading && totalItems > 0 && (
                <View style={styles.paginationContainer}>
                  {/* Contrôles de pagination principaux */}
                  <DataTable.Pagination
                    page={page - 1} 
                    numberOfPages={totalPages}  
                    onPageChange={handlePageChange}
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
                      
                      {/* BOUTON PRINCIPAL POUR OUVRIRE LE DROPDOWN */}
                      <TouchableOpacity 
                        style={styles.itemsPerPageButton}
                        onPress={() => setShowItemsPerPageDropdown(!showItemsPerPageDropdown)}
                        activeOpacity={0.7}
                      >
                        {/* AFFICHAGE DE LA VALEUR ACTUELLE */}
                        <Text style={styles.itemsPerPageText}>{itemsPerPage}</Text>
                        
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
                      {t.budget.budget_management.page} {page} {t.budget.budget_management.separator} {totalPages} • {t.budget.budget_management.total} : {totalItems} {t.budget.budget_management.title_pagination}(s)
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>

      {/* MODAL DE DÉTAILS DU BUDGET */}
      <BudgetDetailsModal
        visible={showBudgetModal}
        onClose={handleCloseModal}
        selectedBudget={selectedBudget}
      />
    </View>
  );
};
export default BudgetCategorie;

const styles = StyleSheet.create({
  accordionContainer: {
    backgroundColor: '#ffffff', 
    marginBottom: 10,
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
  accordionTitleContainer: {
    flex: 1,
  },
  accordionTitle: {
    fontSize: Platform.OS === 'ios' ? 14 : 14,
   fontFamily: 'Poppins-Medium', 
  color: '#1a171a', 
  },
  accordionSubtitle: {
    fontSize: Platform.OS === 'ios' ? 14 : 14,
    color: '#7F8C8D',
  },
  accordionIcon: {
    fontSize: 16,
    color: '#EE9D00',
  },

  // ========== STYLES DU CONTENU DE L'ACCORDÉON ==========
  accordionContent: {
    overflow: 'hidden',
  },
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
    //  zIndex: -100000,
  },
  filterColumn: {
    flex: 1,
    marginHorizontal: 5,
    position: 'relative',
    // zIndex: -10000,
  },
  filterLabel: {
    fontSize: Platform.OS === 'ios' ? 12 : 12,
    color: '#2C3E50',
    marginBottom: 8,
    fontWeight: '600',
    fontFamily: 'Poppins-Regular',
  },
  filterButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fcbf00',
    paddingHorizontal: 16,
    borderRadius: 9,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius:6,
    elevation: 2,
    minHeight: 44,
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'ios' ? 12 : 12,
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
    flex: 1,
    // marginRight: 8,
  },
  //style pour afficher le fitre
  filterDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
    maxHeight: 150,
  },
  filterDropdownScroll: {
    maxHeight: 150,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  filterOptionText: {
    fontSize: Platform.OS === 'ios' ? 12 : 12,
    fontFamily: 'Poppins-Regular',
    color: '#2C3E50',
    lineHeight: 18,
  },

  // ========== STYLES DE LA SECTION BUDGET SÉLECTIONNÉ ==========
  selectedBudgetSection: {
    marginBottom: 20,
  },
  selectedBudgetContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  selectedBudgetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  selectedBudgetTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  selectedBudgetName: {
    fontSize: Platform.OS === 'ios' ? 13 : 13,
    fontFamily: 'Poppins-Bold',
    color: '#000000ff',
    marginBottom: 8,
    lineHeight: 24,
  },
  budgetStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  cycleBadge: {
    backgroundColor: '#3498DB',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'ios' ? 9 : 9
    
    ,
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
  },

  // ========== STYLES DES INFORMATIONS FINANCIÈRES ==========
  financialInfoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  financialItem: {
    flex: 1,
    alignItems: 'center',
  },
  financialLabel: {
    fontSize: Platform.OS === 'ios' ? 12 : 12,
    fontFamily: 'Poppins-Regular',
    color: '#7F8C8D',
    marginBottom: 4,
    textAlign: 'center',
  },
  financialValue: {
    fontSize: Platform.OS === 'ios' ? 12 : 12,
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },

  // ========== STYLES DE LA BARRE DE PROGRESSION ==========
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBarBackground: {
    flex: 1,
    height: 11,
    backgroundColor: '#ECF0F1',
    borderRadius: 6,
    // marginRight: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressPercentage: {
    fontSize: Platform.OS === 'ios' ? 12 : 12,
    fontFamily: 'Poppins-Bold',
    fontWeight: '600',
    color: '#2C3E50',
    minWidth: 50,
    textAlign: 'right',
  },

  // ========== STYLES DES ACTIONS DU BUDGET ==========
  budgetActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  budgetActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 12,
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: '#3498DB',
  },
  stopCycleButton: {
    backgroundColor: '#fcbf00',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
  },
  budgetActionText: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'ios' ? 14 : 13,
    fontWeight: '600',
    marginLeft: 6,
  },

  // ========== STYLES DE LA LISTE DES BUDGETS ==========
  budgetsListContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: Platform.OS === 'ios' ? 13 : 13,
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
  },

  // ========== STYLES DES chaque BUDGET de la liste des budget==========
  budgetListItemWrapper: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  budgetListItem: {
    padding: 16,
  },
  budgetListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  budgetListInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  budgetTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  budgetListName: {
    fontSize: Platform.OS === 'ios' ? 12 : 12,
    fontFamily: 'Poppins-Bold',
    color: '#2C3E50',
    lineHeight: 22,
    marginBottom: 4,
  },
  budgetStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // CONTENEUR FLEX POUR ALIGNER LE POINT ET LE TEXTE
  statusContainer: {
      flexDirection: 'row',
  },

  statusIndicatorContainer: {
    marginTop: 3, 
  },

  statusTextContainer: {
    // flex: 1, // Prend tout l'espace disponible
    // flexShrink: 1, // Permet au texte de se rétrécir 
  },

  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  budgetStatusText: {
    fontSize: Platform.OS === 'ios' ? 11 : 11,
    fontFamily: 'Poppins-Regular',
    color: '#7F8C8D',
  },
  budgetIconContainer: {
    width: Platform.OS === 'ios' ? 40 : 38,
    height: Platform.OS === 'ios' ? 40 : 38,
    borderRadius: 10,
    backgroundColor: '#fcbf00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  budgetListActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetActionIcon: {
    padding: 6,
    marginLeft: 8,
  },
  budgetListProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetListProgressBackground: {
    flex: 1,
    height: 7,
    backgroundColor: '#ECF0F1',
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  budgetListProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetListProgressText: {
    fontSize: Platform.OS === 'ios' ? 12 : 12,
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
    color: '#2C3E50',
    minWidth: 45,
    textAlign: 'right',
  },
  budgetListFinancial: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetListAmount: {
    fontSize: Platform.OS === 'ios' ? 12 : 12,
    fontFamily: 'Poppins-Bold',
    fontWeight: '600',
    color: '#34495E',
  },

  // ========== STYLES DES CATÉGORIES ==========
  categoriesSection: {
    marginBottom: 20,
  },
  categoryCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },

  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  categoryNameContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
  },
  categoryIconContainer: {
    width: Platform.OS === 'ios' ? 36 : 34,
    height: Platform.OS === 'ios' ? 36 : 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: Platform.OS === 'ios' ? 12 : 12,
    fontFamily: 'Poppins-Bold',
    fontWeight: '600',
    color: '#2C3E50',
    lineHeight: 20,
    marginBottom: 2,
  },
  categoryProgressText: {
    fontSize: Platform.OS === 'ios' ? 12 : 12,
    fontFamily: 'Poppins-Regular',
    color: '#7F8C8D',
  },
  categoryAmountContainer: {
    alignItems: 'flex-end',
  },
  categorySpent: {
    fontSize: Platform.OS === 'ios' ? 12 : 12,
    fontFamily: 'Poppins-Bold',
    fontWeight: '600',
    color: '#2C3E50',
  },
  overBudgetText: {
    color: '#E74C3C',
  },
  categoryBudget: {
    fontSize: Platform.OS === 'ios' ? 12 : 12,
    fontFamily: 'Poppins-Regular',
    color: '#7F8C8D',
    marginTop: 2,
  },
  categoryProgressContainer: {
    marginTop: 8,
  },
  categoryProgressBackground: {
    height: 6,
    backgroundColor: '#ECF0F1',
    borderRadius: 3,
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    borderRadius: 3,
  },

  // ========== STYLES DES ÉTATS VIDES ==========
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginVertical: 10,
  },
  emptyText: {
    fontSize: Platform.OS === 'ios' ? 12 : 12,
    fontFamily: 'Poppins-Bold',
    fontWeight: '600',
    color: '#7F8C8D',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: Platform.OS === 'ios' ? 12 : 12,
    fontFamily: 'Poppins-Regular',
    color: '#95A5A6',
    textAlign: 'center',
    lineHeight: 20,
  },

    // ==========STYLES POUR LE BOTTOM SHEET ==========
  bottomSheetBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomSheetHandle: {
    backgroundColor: '#E5E5E5',
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
    marginBottom: 16,
  },
  bottomSheetTitle: {
    fontSize: Platform.OS === 'ios' ? 18 : 16,
    fontFamily: 'Poppins-Bold',
    color: '#2C3E50',
  },
  closeButton: {
    padding: 4,
  },
  bottomSheetScrollView: {
    flex: 1,
  },
  bottomSpacer: {
    height: 30,
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
    zIndex: 1000, // Élévation importante pour s'assurer que le dropdown s'affiche au-dessus
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
  // du style pour l'indicateur de chargement
  loadingIndicator: {
    fontSize: 12,
    color: '#3498DB',
    marginTop: 4,
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