import React, { useState } from 'react';
import {View,Text,Modal,TouchableOpacity,Alert,Platform,StyleSheet,Dimensions,ScrollView,StatusBar} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TransactionACategoriserType } from '../../types/TransacACategoriserType';
import { useTransCat } from '../../context/TransacACategoriserContext';
import CategoryLine from '../budget/CategoryLine';
import { LigneCategorieType } from '../../types/BudgetType';
import { useExpenses } from '../../context/ExpenseContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useCategoryTranslation } from '../../hooks/useCategoryTranslation';


interface CategorizationModalProps {
  visible: boolean;
  onClose: () => void;
  transaction: TransactionACategoriserType | null; // transaction a categoriser
}

const CategorizationModal: React.FC<CategorizationModalProps> = ({visible,onClose,transaction}) => {
    
  // ========== CONTEXTE ==========
  const { onAddTransCat, isCategorizing } = useTransCat();
  const { loadExpenses } = useExpenses();
  const {t,locale} = useTranslation();

  // ========== ÉTATS LOCAUX ==========
  const [selectedCategory, setSelectedCategory] = useState<LigneCategorieType>({
    idLigneCat: Date.now(),
    idCategorie: 0,
    nomCategorie: '',
    montantAffecter: transaction?.amount || 0
  });



  
  // Fonction pour mettre à jour la catégorie sélectionnée
  const handleCategoryUpdate = (id: number, field: string, value: string | number, idCategorie?: number): void => {
    setSelectedCategory(prev => ({
      ...prev,
      [field]: value, 
      idCategorie: idCategorie ?? prev.idCategorie 
    }));
  };

  // Fonction pour gérer la catégorisation
  const handleCategorize = async (): Promise<void> => {

    if (!selectedCategory.nomCategorie) {
      Alert.alert(t.budget.handleAdd.title1, t.Transaction_categorization.message2);
      return;
    }

    if (!transaction) {
      Alert.alert(t.budget.handleAdd.title1, t.Transaction_categorization.message3);
      return;
    }
    try {
      // Appel de la fonction de catégorisation du contexte
      await onAddTransCat(
        selectedCategory.idCategorie,
        transaction.id_transaction,
        selectedCategory.nomCategorie,
        t
      );
      loadExpenses(); // Recharger les dépenses après catégorisation
      setSelectedCategory({
        idLigneCat: Date.now(),idCategorie:0, nomCategorie: '', montantAffecter: 0 
      });

    } catch (error) {
      console.error('Erreur lors de la catégorisation:', error);
      Alert.alert(t.Transaction_categorization.title, t.Transaction_categorization.error_msg);
    }
  };

  // ========== RENDU DU MODAL ==========
  return (
    <>
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
        statusBarTranslucent={true}
    >

      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />

        {isCategorizing && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContent}>
              <Text style={styles.loadingText}>{t.Transaction_categorization.loading_categorization}</Text>
            </View>
          </View>
        )}
        
        <View style={[
          styles.modalContainer, 
          isCategorizing && styles.modalDisabled 
        ]}>
          <View style={styles.dragIndicator} />
          <View style={styles.modalHeader}>
            
            <Text style={styles.modalTitle}>{t.Transaction_categorization.title_header}</Text>

            <TouchableOpacity 
              onPress={isCategorizing ? undefined : onClose} 
              style={styles.closeButton}
              disabled={isCategorizing}
            >
              <MaterialIcons 
                name="close" 
                size={21} 
                color={isCategorizing ? "#9CA3AF" : "#6B7280"} 
              />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >

            {/* ========== INFORMATIONS DE LA TRANSACTION ========== */}
            {transaction && (
              <View style={styles.transactionInfoSection}>
                <Text style={styles.sectionTitle}>{t.Transaction_categorization.title_modal}</Text>
                
                {/* Carte d'information de la transaction */}
                <View style={styles.transactionCard}>
                  <View style={styles.transactionRow}>
                    <Text style={styles.transactionLabel}>{t.Transaction_categorization.operation} :</Text>
                    <Text style={styles.transactionValue} numberOfLines={2}>
                      {transaction.operation_name}
                    </Text>
                  </View>
                  
                  <View style={styles.transactionRow}>
                    <Text style={styles.transactionLabel}>{t.Transaction_categorization.amount} :</Text>
                    <Text style={styles.amountValue}>
                      {transaction.amount.toLocaleString(locale) } FCFA
                    </Text>
                  </View>
                  
                  <View style={styles.transactionRow}>
                    <Text style={styles.transactionLabel}>{t.Transaction_categorization.date} :</Text>
                    <Text style={styles.transactionValue}>
                        { new Date(transaction.created_at).toLocaleDateString(locale)}
                    </Text>
                  </View>
                  
                  <View style={styles.transactionRow}>
                    <Text style={styles.transactionLabel}>{t.Transaction_categorization.type} :</Text>
                    <Text style={styles.transactionValue}>
                      {transaction.operation_type_name}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* ========== SECTION CATÉGORISATION ========== */}
            <View style={styles.categorizationSection}>
            
              <Text style={styles.sectionTitle}>{t.Transaction_categorization.choose_category}</Text>
              
             
              <View style={styles.categorySelectorContainer}>
                <CategoryLine
                  lineCategorie={selectedCategory}
                  index={0}
                  onUpdateCategorieLine={handleCategoryUpdate}
                  onRemoveCategorieLine={() => {}}
                  isRemovable={false}
                  showCategoryOnly={true} 
                />
              </View>
              <View style={styles.amountDisplayContainer}>
                <Text style={styles.label}>{t.Transaction_categorization.amount_categorize}</Text>
                <View style={styles.amountDisplay}>
                  <Text style={styles.amountDisplayText}>
                    {transaction?.amount.toLocaleString(locale)} FCFA
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* ========== PIED DU MODAL AVEC BOUTONS ========== */}
          <View style={styles.modalFooter}>

            <TouchableOpacity 
              style={[
                styles.cancelButton,
                isCategorizing && styles.disabledButton
              ]}
              onPress={isCategorizing ? undefined : onClose}
              disabled={isCategorizing}
            >
              <Text style={[
                styles.cancelButtonText,
                isCategorizing && styles.disabledButtonText
              ]}>
                {t.Transaction_categorization.btn_cancel}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.categorizeButton,
                isCategorizing && styles.disabledButton
              ]}
              onPress={isCategorizing ? undefined : handleCategorize}
              disabled={isCategorizing}
            >
              <Text style={[
                styles.categorizeButtonText,
                isCategorizing && styles.disabledButtonText
              ]}>
                {isCategorizing ? `${t.Transaction_categorization.btn_categorize_loading}` : `${t.Transaction_categorization.btn_categorize}`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    </>
  );
};

export default CategorizationModal;


const { width, height } = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight || 0;

const styles = StyleSheet.create({
  // Overlay transparent sans fond noir
  modalOverlay: {
    flex: 1,
    zIndex: 0,
    // backgroundColor: 'transparent',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    marginTop: -statusBarHeight,
    paddingTop: statusBarHeight,
  },
  
  // TouchableOpacity pour overlay clickable - étendu pour toute la zone
  overlayTouchable: {
    flex: 1,
    width: '100%',
  },

  
  // Style pour modal désactivé
  modalDisabled: {
    opacity: 0.9,
  },
  
  // Conteneur du modal en bottom sheet
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.85, //hauteur max
    minHeight: height * 0.60, //  la hauteur minimale
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: -2 
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
    zIndex: -90000,
  },
  
  // Indicateur de drag (la petite barre en haut des bottom sheets)
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  
  // En-tête du modal
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
  
  modalTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  
  closeButton: {
    padding: 4,
  },
  
  
  // Contenu du modal
  modalContent: {
    flex: 1,
  },

  // Contenu du scroll pour un meilleur espacement
  scrollContent: {
    padding: 20,
    paddingBottom: 10,
  },
  
  // Sections
  transactionInfoSection: {
    marginBottom: 24,
  },
  
  categorizationSection: {
    marginBottom: 20,
  },
  
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#374151',
    marginBottom: 16,
  },
  
  // Carte d'information de transaction
  transactionCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  
  transactionLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#6B7280',
    flex: 1,
  },
  
  transactionValue: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#1F2937',
    flex: 1.5,
    textAlign: 'right',
  },
  
  amountValue: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#059669',
    flex: 1.5,
    textAlign: 'right',
  },
  
  // Conteneur pour CategoryLine 
  categoryLineContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  
  //Conteneur pour la catégorie seulement (sans montant)
  categoryOnlyContainer: {
    marginBottom: 16,
  },
  
  //Conteneur pour l'affichage du montant
  amountDisplayContainer: {
    
  },
  
  //Style pour l'affichage du montant
  amountDisplay: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  
  amountDisplayText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#059669',
    textAlign: 'center',
  },

  label: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#374151',
    marginBottom: 8,
  },

  //Conteneur spécifique pour le sélecteur de catégorie uniquement
  categorySelectorContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  
  // Pied du modal avec boutons
  modalFooter: {
    flexDirection: 'row',
    padding: Platform.OS ==='ios'? 20: 15,
    marginBottom: Platform.OS ==='ios'? 14: 0,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  
  cancelButton: {
     flex: 1,
    paddingVertical: 15,
    padding: 12,
    height: 50,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    alignItems: 'center',
  },
  
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#374151',
  },
  
  categorizeButton: {
    flex: 1,
    paddingVertical: 14,
    padding: 12,
    height: 50,
    backgroundColor: '#fcbf00',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  categorizeButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  
  //Styles pour les boutons désactivés
  disabledButton: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  
  disabledButtonText: {
    color: '#9CA3AF',
  },

  //Overlay de chargement pendant la catégorisation
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(61, 61, 61, 0.57)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  
  loadingContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  
  loadingText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#fcbf00',
  },

});

