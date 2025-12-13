import React, { JSX, use } from 'react';
import { View, Text, Modal, TouchableOpacity, Platform, StyleSheet, Dimensions, ScrollView, StatusBar } from 'react-native';
import { MaterialIcons, FontAwesome, Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BudgetType, CategorieType, CycleType } from '../../types/BudgetType';
import { useTranslation } from '../../hooks/useTranslation';
import { Translations } from '../../types';
import { useCategoryTranslation } from '../../hooks/useCategoryTranslation';

interface BudgetDetailsModalProps {
  visible: boolean; // Contrôle affichage du modal
  onClose: () => void; // Fonction appelée lors de la fermeture
  selectedBudget: BudgetType | null; // Budget sélectionné à afficher
}

const BudgetDetailsModal: React.FC<BudgetDetailsModalProps> = ({
  visible,onClose,selectedBudget}) => {
    
    const {t,locale} = useTranslation();
    const {getTranslatedCategoryName} = useCategoryTranslation();

  // ========== FONCTION DE RENDU DE LA BARRE DE PROGRESSION ==========
  const renderBudgetProgressBar = (budget: BudgetType): JSX.Element => {

    return (
      <View style={modalStyles.progressBarContainer}>
        <View style={modalStyles.progressBarBackground}>
          <View
            style={[
              modalStyles.progressBarFill,
              {
                width: `${budget.pourcentage_utilisation ?? 0}%`, 
                backgroundColor: (budget.pourcentage_utilisation ?? 0) > 80 ? '#E74C3C' : 
                  (budget.pourcentage_utilisation ?? 0) > 60 ? '#F39C12' : 
                    '#2ECC71' 
              }
            ]}
          />
        </View>
        <Text style={modalStyles.progressPercentage}>
          {(budget.pourcentage_utilisation ?? 0).toFixed(1)}%
        </Text>
      </View>
    );
  };

  // ========== FONCTION DE RENDU DE L'ICÔNE POUR LES CATÉGORIES ==========
  const renderCategoryIcon = (category: CategorieType): JSX.Element => {
    const iconProps = {
      size: Platform.OS === 'ios' ? 18 : 17,
      color: '#FFFFFF',
    };

    // Retourne l'icône appropriée selon l'iconSet de la catégorie
    switch (category.iconSet) {
      case 'MaterialIcons':
        return <MaterialIcons name={category.icon as any} {...iconProps} />;
      case 'FontAwesome':
        return <FontAwesome name={category.icon as any} {...iconProps} />;
      case 'Feather':
        return <Feather name={category.icon as any} {...iconProps} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={category.icon as any} {...iconProps} />;
      case 'Ionicons':
        return <Ionicons name={category.icon as any} {...iconProps} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={category.icon as any} {...iconProps} />;
      default:
        // Icône par défaut si le type n'est pas reconnu
        return <MaterialIcons name="category" {...iconProps} />;
    }
  };

  // ========== FONCTION DE RENDU D'UNE CATÉGORIE ==========
  const renderCategoryItem = (category: CategorieType): JSX.Element => {

    // Calcule le pourcentage d'utilisation de la catégorie
    const progressPercentage = Math.min(((category.depenses ?? 0) / (category.montantAffecter ?? 1)) * 100, 100);
    // Vérifie si le budget est dépassé pour cette catégorie
    const isOverBudget = (category.depenses ?? 0) > (category.montantAffecter ?? 0);

    return (
      <View style={modalStyles.categoryCard}>
        <View style={modalStyles.categoryHeader}>
          <View style={modalStyles.categoryNameContainer}>
            <View style={[modalStyles.categoryIconContainer, { backgroundColor: category.color }]}>
              <MaterialCommunityIcons name={category.icon as any} color='#FFFFFF' size={Platform.OS === 'ios' ? 18 : 17} />
            </View>
            <View style={modalStyles.categoryTextContainer}>
              <Text style={modalStyles.categoryName} numberOfLines={2}>
                {/* {category.nom} */} {getTranslatedCategoryName(category)}
              </Text>
              {/* Pourcentage d'utilisation */}
              <Text style={modalStyles.categoryProgressText}>
                {(category.pourcentage_utilisation ?? 0).toFixed(1)}% {t.budget.detail_budget.used}
              </Text>
            </View>
          </View>
          {/* Conteneur des montants */}
          <View style={modalStyles.categoryAmountContainer}>
            {/* Montant dépensé (rouge si dépassement) */}
            <Text style={[modalStyles.categorySpent, isOverBudget && modalStyles.overBudgetText]}>
              {(category.depenses ?? 0).toLocaleString(locale)} FCFA
            </Text>
            <Text style={modalStyles.categoryBudget}>
             / {(category.montantAffecter ?? 0).toLocaleString(locale)} FCFA
            </Text>
          </View>
        </View>

        {/* Barre de progression de la catégorie */}
        <View style={modalStyles.categoryProgressContainer}>
          <View style={modalStyles.categoryProgressBackground}>
            <View
              style={[
                modalStyles.categoryProgressFill,
                {
                  width: `${progressPercentage}%`,
                  backgroundColor: isOverBudget ? '#E74C3C' : category.color
                }
              ]}
            />
          </View>
        </View>
      </View>
    );
  };

  // ========== FONCTION DE RENDU DE L'ÉTAT VIDE POUR LES CATÉGORIES ==========
  const renderEmptyCategoriesState = (): JSX.Element => {
    return (
      <View style={modalStyles.emptyState}>

        <MaterialIcons name="category" size={45} color="#BDC3C7" />
        <Text style={modalStyles.emptyText}>
          {t.budget.detail_budget.empty_title}
        </Text>
        <Text style={modalStyles.emptySubtext}>
          {t.budget.detail_budget.empty_text}
        </Text>
      </View>
    );
  };

  // LIBELLÉS POUR LES TYPES DE CYCLE
  const getCycleLabel = (type: CycleType, t: Translations) => {
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
  // ========== A- RENDU PRINCIPAL DU MODAL ==========

  // aucun contenu affiche si budget nin selectionne
  if (!selectedBudget) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      {/* Overlay semi-transparent avec fermeture au tap */}
      <View style={modalStyles.modalOverlay}>
        <TouchableOpacity
          style={modalStyles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Contenu du modal en bottom sheet */}
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.dragIndicator} />

          {/* ========== EN-TÊTE DU MODAL ========== */}
          <View style={modalStyles.modalHeader}>
            <Text style={modalStyles.modalTitle}>{t.budget.detail_budget.title_accordeons}</Text>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
              <MaterialIcons name="close" size={21} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={modalStyles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* ========== SECTION INFORMATIONS DU BUDGET ========== */}
            <View style={modalStyles.budgetInfoSection}>
              <View style={modalStyles.budgetHeader}>
                <View style={modalStyles.budgetIconContainer}>
                  <FontAwesome name="money" size={20} color="#FFFFFF" />
                </View>
                <View style={modalStyles.budgetTextContainer}>

                  <Text style={modalStyles.budgetName} numberOfLines={2}>
                    {selectedBudget.libelle}
                  </Text>
                  <View style={modalStyles.budgetStatusContainer}>
                    <View style={[
                      modalStyles.statusBadge,
                      { backgroundColor: selectedBudget.statutBudget == 0 ? '#27AE60' : '#E74C3C' }
                    ]}>
                      <Text style={modalStyles.statusText}>
                        {selectedBudget.statutBudget == 0 ? t.budget.detail_budget.in_Progress : t.budget.detail_budget.completed}
                      </Text>
                    </View>
                    {/* Badge de cycle si le budget est cyclique */}
                    {selectedBudget.isCyclique == 1 && selectedBudget.typeCycle && (
                      <View style={[modalStyles.statusBadge, modalStyles.cycleBadge]}>
                        <Text style={modalStyles.statusText}>
                          {t.budget.detail_budget.recurring} • {getCycleLabel(selectedBudget.typeCycle, t)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* ========== INFORMATIONS FINANCIÈRES ========== */}
              <View style={modalStyles.financialInfoContainer}>
                {/* Première ligne : Budget total et Total alloué */}
                <View style={modalStyles.financialRow}>
                  <View style={modalStyles.financialItem}>
                    <Text style={modalStyles.financialLabel}>{t.budget.detail_budget.total_budget}</Text>
                    <Text style={modalStyles.financialValue}>
                      {selectedBudget.montantBudget.toLocaleString(locale)} FCFA
                    </Text>
                  </View>
                  <View style={modalStyles.financialItem}>
                    <Text style={modalStyles.financialLabel}>{t.budget.detail_budget.total_allocated}</Text>
                    <Text style={modalStyles.financialValue}>
                      {(selectedBudget.montant_total_affecte ?? 0).toLocaleString(locale)} FCFA
                    </Text>
                  </View>
                </View>
                {/* Deuxième ligne : Dépensé et Reste */}
                <View style={modalStyles.financialRow}>
                  <View style={modalStyles.financialItem}>
                    <Text style={modalStyles.financialLabel}>{t.budget.detail_budget.spent}</Text>
                    <Text style={[modalStyles.financialValue, { color: '#E74C3C' }]}>
                       {(selectedBudget.total_depense ?? 0).toLocaleString(locale)} FCFA
                    </Text>
                  </View>
                  <View style={modalStyles.financialItem}>
                    <Text style={modalStyles.financialLabel}>{t.budget.detail_budget.remaining}</Text>
                    <Text style={[modalStyles.financialValue, { color: '#27AE60' }]}>
                      {((selectedBudget.montantBudget - (selectedBudget.total_depense ?? 0)) > 0
                      ? (selectedBudget.montantBudget - (selectedBudget.total_depense ?? 0)).toLocaleString(locale)
                      : '0')} FCFA
                    </Text>
                  </View>
                </View>
                {/* Troisième ligne : Dates de début et fin */}
                <View style={modalStyles.financialRow}>
                  <View style={modalStyles.financialItem}>
                    <Text style={modalStyles.financialLabel}>{t.budget.start_date}</Text>
                    <Text style={modalStyles.financialValue}>
                      {new Date(selectedBudget.dateDebut).toLocaleDateString(locale)}
                    </Text>
                  </View>
                  <View style={modalStyles.financialItem}>
                    <Text style={modalStyles.financialLabel}>{t.budget.end_date}</Text>
                    <Text style={modalStyles.financialValue}>
                      {new Date(selectedBudget.dateFin).toLocaleDateString(locale)}
                    </Text>
                  </View>
                </View>
                {/* Quatrième ligne : Informations du cycle  */}
                {selectedBudget.isCyclique == 1 && (
                  <View style={modalStyles.financialRow}>
                    <View style={modalStyles.financialItem}>
                      <Text style={modalStyles.financialLabel}>{t.budget.detail_budget.cycle_status}</Text>
                      <Text style={modalStyles.financialValue}>
                        {selectedBudget.cycleStatus == 1 ? 'actif' : 'arrêté'}
                      </Text>
                    </View>
                    <View style={modalStyles.financialItem}>
                      <Text style={modalStyles.financialLabel}>{t.budget.detail_budget.next_cycle}</Text>
                      <Text style={modalStyles.financialValue}>
                        {selectedBudget.cycleStatus == 1 ? new Date(selectedBudget?.dateProchainCycle ?? '').toLocaleDateString('fr-FR') : 'N/A'}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* ========== BARRE DE PROGRESSION PRINCIPALE ========== */}
              {renderBudgetProgressBar(selectedBudget)}
            </View>

            {/* ========== SECTION CATÉGORIES ========== */}
            <View style={modalStyles.categoriesSection}>
              <Text style={modalStyles.sectionTitle}>
                {t.budget.detail_budget.categories} ({selectedBudget.categories?.length})
              </Text>
              {/* Affiche les catégories si elles existent, sinon l'état vide */}
              {selectedBudget.categories?.length ?? 0 > 0 ? (
                selectedBudget.categories?.map((category) => (
                  <View key={category.id}>
                    {renderCategoryItem(category)}
                  </View>
                ))
              ) : (
                renderEmptyCategoriesState()
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default BudgetDetailsModal;

const { width, height } = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight || 0;
const modalStyles = StyleSheet.create({

  // Overlay semi-transparent qui couvre tout l'écran
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    marginTop: -statusBarHeight,
    paddingTop: statusBarHeight,
  },
  // Zone cliquable pour fermer le modal en tapant à l'extérieur
  overlayTouchable: {
    flex: 1,
    width: '100%',
  },
  // Conteneur principal du modal en bottom sheet
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.85,
    minHeight: height * 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  // Petite barre indicative pour le drag (typique des bottom sheets)
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  // En-tête du modal avec titre et bouton fermer
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 9,
    paddingTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  // Titre du modal
  modalTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  // Bouton de fermeture
  closeButton: {
    padding: 4,
  },
  // Contenu défilable du modal
  modalContent: {
    flex: 1,
    padding: 20,
  },
  // Section des informations du budget
  budgetInfoSection: {
    marginBottom: 24,
  },
  // Section des catégories
  categoriesSection: {
    marginBottom: 20,
  },
  // Titre des sections
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#374151',
    marginBottom: 10,
  },
  // En-tête du budget avec icône et nom
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  // Conteneur de l'icône du budget
  budgetIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fcbf00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Conteneur du texte du budget
  budgetTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  // Nom du budget
  budgetName: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#000000',
    marginBottom: 8,
    lineHeight: 20,
  },
  // Conteneur des badges de statut
  budgetStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  // Badge de statut (carré coloré avec texte)
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 4,
  },

  cycleBadge: {
    backgroundColor: '#3498DB',
  },
  // Texte des badges
  statusText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
  },
  // Conteneur des informations financières
  financialInfoContainer: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  // Ligne d'informations financières
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  // Élément financier individuel
  financialItem: {
    flex: 1,
    alignItems: 'center',
  },
  // Label des informations financières
  financialLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#7F8C8D',
    marginBottom: 4,
    textAlign: 'center',
  },
  // Valeur des informations financières
  financialValue: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
  // Conteneur de la barre de progression
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  // Fond de la barre de progression
  progressBarBackground: {
    flex: 1,
    height: 11,
    backgroundColor: '#ECF0F1',
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 12,
  },
  // Partie remplie de la barre de progression
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  // Texte du pourcentage de progression
  progressPercentage: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    fontWeight: '600',
    color: '#2C3E50',
    minWidth: 50,
    textAlign: 'right',
  },
  // Conteneur des actions du budget
  budgetActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
  },


  // Carte d'une catégorie
  categoryCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  // En-tête de la catégorie
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  // Conteneur du nom et icône de la catégorie
  categoryNameContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
  },
  // Conteneur de l'icône de la catégorie
  categoryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  // Conteneur du texte de la catégorie
  categoryTextContainer: {
    flex: 1,
  },
  // Nom de la catégorie
  categoryName: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    fontWeight: '600',
    color: '#2C3E50',
    lineHeight: 20,
    marginBottom: 2,
  },
  // Texte du pourcentage de progression de la catégorie
  categoryProgressText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#7F8C8D',
  },
  // Conteneur des montants de la catégorie
  categoryAmountContainer: {
    alignItems: 'flex-end',
  },
  // Montant dépensé de la catégorie
  categorySpent: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    fontWeight: '600',
    color: '#2C3E50',
  },
  // Texte en rouge quand le budget est dépassé
  overBudgetText: {
    color: '#E74C3C',
  },
  // Budget total de la catégorie
  categoryBudget: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#7F8C8D',
    marginTop: 2,
  },
  // Conteneur de la barre de progression de la catégorie
  categoryProgressContainer: {
    marginTop: 8,
  },
  // Fond de la barre de progression de la catégorie
  categoryProgressBackground: {
    height: 6,
    backgroundColor: '#ECF0F1',
    borderRadius: 3,
    overflow: 'hidden',
  },
  // Partie remplie de la barre de progression de la catégorie
  categoryProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  // État vide 
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginVertical: 10,
  },
  // Texte principal de l'état vide
  emptyText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#7F8C8D',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  // Texte secondaire de l'état vide
  emptySubtext: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#95A5A6',
    textAlign: 'center',
    lineHeight: 20,
  },
});