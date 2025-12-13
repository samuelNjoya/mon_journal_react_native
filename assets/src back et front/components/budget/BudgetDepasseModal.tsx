import React, { JSX } from 'react';
import {View,Text,Modal,TouchableOpacity,StyleSheet,Dimensions,StatusBar,ScrollView,} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BudgetDepasse, BudgetType, CategorieType } from '../../types/BudgetType';
import { useTranslation } from '../../hooks/useTranslation';
import { Translations } from '../../types';
import { useCategoryTranslation } from '../../hooks/useCategoryTranslation';


interface BudgetDepasseModalProps {
  visible: boolean; // Contrôle l'affichage du modal
  onClose: () => void; // Fonction appelée pour fermer le modal
  budgetsDepasses?: BudgetDepasse[]; // Liste des budgets dépassés à afficher
}

const BudgetDepasseModal: React.FC<BudgetDepasseModalProps> = ({
  visible, onClose, budgetsDepasses }) => {
    
    const {t,locale} = useTranslation();
    const {getTranslatedCategoryName} = useCategoryTranslation();

  // ========== COMPOSANT POUR UNE CATÉGORIE DÉPASSÉE ==========
  const CategorieItem: React.FC<{ item: CategorieType; index: number; t: Translations }> = ({ item, index, t }) => {

    return (
      <View style={styles.categorieItem} key={`categorie-${index}`}>

        <View style={styles.categorieIconContainer}>
          <MaterialIcons
            name="warning"
            size={16}
            color="#FFFFFF"
          />
        </View>

        {/* ========== INFORMATIONS DE LA CATÉGORIE ========== */}
        <View style={styles.categorieInfo}>
          <Text style={styles.categorieName} numberOfLines={1}>
            {/* {item.nom} */} {getTranslatedCategoryName(item)}

          </Text>

          <View style={styles.categorieDetails}>
            <View style={styles.montantRow}>
              <Text style={styles.montantLabel}>{t.budget.over_budgets.amount_spent}:</Text>
              <Text style={styles.montantAffecte}>
                {(item.montantAffecter ?? 0).toLocaleString(locale)} FCFA
              </Text>
            </View>

            <View style={styles.montantRow}>
              <Text style={styles.montantLabel}>{t.budget.over_budgets.expense}:</Text>
              <Text style={styles.montantDepense}>
                {(item.depenses ?? 0).toLocaleString(locale)} FCFA
              </Text>
            </View>
          </View>
        </View>

        {/* ========== INDICATEUR DE DÉPASSEMENT ==========
        <View style={styles.depassementContainer}>
          <Text style={styles.depassementMontant}>
            +{item.depassement.toLocaleString('fr-FR')} FCFA
          </Text>
          <Text style={styles.depassementPourcentage}>
            {item.pourcentage_depassement.toFixed(1)}%
          </Text>
        </View> */}

      </View>
    );
  };

  // ========== COMPOSANT POUR UN BUDGET DÉPASSÉ ==========
  const BudgetItem: React.FC<{ item: BudgetDepasse; index: number; t: Translations }> = ({ item, index, t }) => {
  
    return (
      <View style={styles.budgetItem} key={`budget-${item.budget_id?.toString() || index}`}>
        {/* ========== EN-TÊTE DU BUDGET ========== */}
        <View style={styles.budgetHeader}>
          <View style={styles.budgetTitleContainer}>
            <MaterialIcons name="account-balance-wallet" size={20} color="#e74c3c" />
            <Text style={styles.budgetTitle} numberOfLines={2}>
              {item.budget_libelle}
            </Text>
          </View>

          <View style={styles.budgetStats}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>{t.budget.over_budgets.total_budget}:</Text>
              <Text style={styles.budgetMontant}>
                {item.budget_montant_total.toLocaleString(locale)} FCFA
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>{t.budget.over_budgets.budget_spent}:</Text>
              <Text style={styles.totalDepense}>
                {item.total_depenses.toLocaleString(locale)} FCFA
              </Text>
            </View>
            <View style={styles.depassementGlobalContainer}>
              <MaterialIcons name="trending-up" size={16} color="#e74c3c" />
              <Text style={styles.depassementGlobal}>
                {t.budget.over_budgets.over_spending}: +{item.montant_depassement_global.toLocaleString(locale)} FCFA
              </Text>
              <Text style={styles.depassementGlobalPourcentage}>
                ({item.pourcentage_depassement_global.toFixed(1)}%)
              </Text>
            </View>
          </View>
        </View>

        {/* ========== LISTE DES CATÉGORIES DÉPASSÉES ========== */}
        <View style={styles.categoriesSection}>
          <Text style={styles.categoriesTitle}>
            {t.budget.over_budgets.category_title} ({item.nombre_categories_depassees})
          </Text>

          <View style={styles.categoriesListContent}>
            {item.categories_depassees.map((categorie, catIndex) => (
              <CategorieItem
                key={`categorie-${item.budget_id}-${catIndex}`}
                item={categorie}
                index={catIndex}
                t={t}
              />
            ))}
          </View>
        </View>

        {/* ========== PÉRIODE DU BUDGET ========== */}
        <View style={styles.budgetPeriod}>
          <View style={styles.periodContainer}>
            <MaterialIcons name="calendar-today" size={14} color="#6B7280" />
            <Text style={styles.periodText}>
              Du {new Date(item.date_debut).toLocaleDateString('fr-FR')} au {new Date(item.date_fin).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // ========== COMPOSANT D'EN-TÊTE POUR LA LISTE ==========
  const ListHeader: React.FC<{ t: Translations; }> = ({ t, }) => {
    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryCount}>
          {budgetsDepasses?.length || 0} {t?.budget?.over_budgets?.title2}
        </Text>
        <Text style={styles.summaryText}>
          {t.budget.over_budgets.message2}
        </Text>
      </View>
    );
  };

  // ========== RENDU PRINCIPAL DU MODAL ==========
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      {/* ========== OVERLAY SEMI-TRANSPARENT ========== */}
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* ========== CONTENU DU MODAL ========== */}

        <View style={styles.modalContainer}>
          {/* Indicateur de drag */}
          <View style={styles.dragIndicator} />

          {/* ========== EN-TÊTE DU MODAL ========== */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleContainer}>
              <MaterialIcons name="warning" size={24} color="#e74c3c" />
              <View>
                <Text style={styles.modalTitle}>{t.budget.over_budgets.title}</Text>
                <Text style={styles.modalSubtitle}>
                  {t.budget.over_budgets.message}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* ========== LISTE DES BUDGETS DÉPASSÉS ========== */}
          {budgetsDepasses && budgetsDepasses.length > 0 ? (   
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.budgetsList}
              contentContainerStyle={styles.budgetsListContent}
            >
              <ListHeader
                t={t}
              />
              {budgetsDepasses.map((budget, index) => (
                <BudgetItem
                  key={budget.budget_id?.toString() || `budget-${index}`}
                  item={budget}
                  index={index}
                  t={t}
                />
              ))}
            </ScrollView>
          ) : (
            // ========== AUCUN BUDGET DÉPASSÉ ==========
            <View style={styles.emptyContainer}>
              <MaterialIcons name="check-circle" size={48} color="#10B981" />
              <Text style={styles.emptyTitle}>{t.budget.over_budgets.emptyTitle}</Text>
              <Text style={styles.emptyText}>
                {t.budget.over_budgets.emptyText}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default BudgetDepasseModal;

// ========== FEUILLE DE STYLES ==========
const { width, height } = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight || 0;

const styles = StyleSheet.create({
  // ========== STYLES POUR LE MODAL ==========
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginTop: -statusBarHeight,
    paddingTop: statusBarHeight,
  },

  overlayTouchable: {
    flex: 1,
    width: '100%',
  },

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

  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
  },

  // ========== EN-TÊTE DU MODAL ==========
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },

  modalTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
  },

  modalSubtitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    marginLeft: 8,
    marginTop: 2,
  },

  closeButton: {
    padding: 4,
    marginTop: 4,
  },

  // ========== RÉSUMÉ DES BUDGETS DÉPASSÉS ==========
  summaryContainer: {
    backgroundColor: '#FFF3CD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },

  summaryCount: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#856404',
    marginBottom: 4,
  },

  summaryText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#856404',
    lineHeight: 20,
  },

  // ========== STYLES POUR LA LISTE DES BUDGETS ==========
  budgetsList: {
    flex: 1,
  },

  budgetsListContent: {
    padding: 16,
    paddingTop: 8,
  },

  // ========== STYLES POUR CHAQUE BUDGET DÉPASSÉ ==========
  budgetItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  budgetHeader: {
    marginBottom: 16,
  },

  budgetTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  budgetTitle: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },

  budgetStats: {
    gap: 8,
    paddingLeft: 28,
  },

  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },

  budgetMontant: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#059669',
  },

  totalDepense: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#DC2626',
  },

  depassementGlobalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDEDED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },

  depassementGlobal: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: '#e74c3c',
    marginLeft: 4,
    marginRight: 4,
  },

  depassementGlobalPourcentage: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#e74c3c',
  },

  // ========== STYLES POUR LA SECTION DES CATÉGORIES ==========
  categoriesSection: {
    marginBottom: 12,
  },

  categoriesTitle: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#374151',
    marginBottom: 12,
    lineHeight: 20,
  },

  categoriesListContent: {
    gap: 8,
  },

  // ========== STYLES POUR CHAQUE CATÉGORIE DÉPASSÉE ==========
  categorieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDEDED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  categorieIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  categorieInfo: {
    flex: 1,
  },

  categorieName: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 3,
  },

  categorieDetails: {
    gap: 2,
  },

  montantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  montantLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },

  montantAffecte: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#059669',
  },

  montantDepense: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#DC2626',
  },

  // ========== STYLES POUR L'INDICATEUR DE DÉPASSEMENT ==========
  depassementContainer: {
    alignItems: 'flex-end',
    marginLeft: 8,
    minWidth: 80,
  },

  depassementMontant: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#e74c3c',
    marginBottom: 2,
    textAlign: 'right',
  },

  depassementPourcentage: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#e74c3c',
    textAlign: 'right',
  },

  // ========== STYLES POUR LA PÉRIODE DU BUDGET ==========
  budgetPeriod: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },

  periodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  periodText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },

  // ========== STYLES POUR AUCUN BUDGET DÉPASSÉ ==========
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },

  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#059669',
    marginTop: 16,
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
