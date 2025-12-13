/**
 * Liste des catégories avec possibilité de suppression et effet accordéon
 * Props:
 *  - categories : tableau des catégories
 *  - onDelete : fonction suppression par id
 *  - onEdit : fonction édition par id
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView, Text, View, StyleSheet, TouchableOpacity, Alert,
  Modal, TextInput, Platform, ActivityIndicator
} from 'react-native';
import { COLORS, FONTS } from '../../../assets/constants';
import { MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Category, useExpenses } from '../../context/ExpenseContext';
import { useBudget } from '../../context/BudgetsContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useCategoryTranslation } from '../../hooks/useCategoryTranslation';
import CategoryForm1 from './CategoryForm1';

interface CategoryListProps {
  setLoading: (loading: boolean) => void;
  setToast: (toast: any) => void;
  categories: Category[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

export default function CategoryList({ categories, onEdit, setLoading, setToast }: CategoryListProps) {
  const { t } = useTranslation();
  const { getTranslatedCategoryName } = useCategoryTranslation();

  const {
    chargerBudgetsFiltres,
    page,
    itemsPerPage,
    selectedStatus
  } = useBudget();

  const {
    deleteCategory,
    loadCategories,
  } = useExpenses();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasLoadingError, setHasLoadingError] = useState<boolean>(false);

  // États pour la modal de suppression
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [typedName, setTypedName] = useState('');
  const [inputError, setInputError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // NOUVEAU : État pour le loading de suppression
  // Dans les états existants, ajoute :
  const [isChecked, setIsChecked] = useState(false);

  //Modification
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [isEditing, setIsEditing] = useState(false); // Pour le loading

  const categoryFormRef = useRef<any>(null);

  // EFFET POUR CHARGER LES CATÉGORIES QUAND L'ACCORDÉON S'OUVRE
  useEffect(() => {
    if (isExpanded) {
      loadDataFromServer();
    }
  }, [isExpanded]);

  // FONCTION: Chargement des données depuis le contexte
  const loadDataFromServer = async (): Promise<void> => {
    if (!isExpanded) return;

    setIsLoading(true);
    setHasLoadingError(false);

    try {
      await loadCategories();
    } catch (error: any) {
      console.error('Erreur lors du chargement des catégories:', error.message || error);
      setHasLoadingError(true);
      Alert.alert(
        t.operation_crud_and_other.error,
        t.operation_crud_and_other.unable_to_load_data
      );
    } finally {
      setIsLoading(false);
    }
  };

  // FONCTION: Rechargement avec gestion d'erreur
  const handleRetryLoad = async () => {
    await loadDataFromServer();
  };

  // HANDLER DE SUPPRESSION (MODIFIÉ)
  const handleDeleteCategory = async (id: number) => {
    setIsDeleting(true); // Active le loading dans la modal
    // setLoading(true);

    try {
      await deleteCategory(id);
      // Ferme la modal avant d'afficher le toast
      closeDeleteModal();

      // Petit délai pour laisser la modal se fermer
      setTimeout(() => {
        setToast({
          visible: true,
          message: t.toast_expense_category.category_deleted,
          type: "success"
        });
      }, 300);

      chargerBudgetsFiltres(page, itemsPerPage, selectedStatus);

      // Recharger les catégories si l'accordéon est ouvert
      if (isExpanded) {
        await loadDataFromServer();
      }
    } catch (e: any) {
      console.error("Échec de la suppression de la catégorie:", e);
      setToast({
        visible: true,
        message: ` Échec de la suppression: ${e.message || "Erreur inconnue"}`,
        type: "warning"
      });
    } finally {
      // setLoading(false);
      setIsDeleting(false);
    }
  };

  // OUVERTURE DE LA MODAL DE CONFIRMATION
  const confirmDelete = (category: Category) => {
    setCategoryToDelete(category);
    setTypedName('');
    setInputError(false);
    setDeleteModalVisible(true);
  };

  // FERMETURE DE LA MODAL
  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
    setCategoryToDelete(null);
    setTypedName('');
    setInputError(false);
    setIsDeleting(false);

    setIsChecked(false); // Réinitialiser le checkbox
  };

  // VALIDATION DE LA SUPPRESSION
  const handleConfirmDelete = () => {
    if (!categoryToDelete || !isChecked) return;

    handleDeleteCategory(categoryToDelete.id); //si la case est cocher supprimer

    //const categoryName = getTranslatedCategoryName(categoryToDelete);
    // const categoryName = "Delete";

    // if (typedName.trim() === categoryName) {
    //   // Nom correct → suppression
    //   handleDeleteCategory(categoryToDelete.id);
    // } else {
    //   // Nom incorrect → afficher erreur
    //   setInputError(true);
    // }
  };

  // GESTION DE LA SAISIE DU NOM
  const handleTypedNameChange = (text: string) => {
    setTypedName(text);
    if (inputError) {
      setInputError(false);
    }
  };

  // VÉRIFICATION SI LE BOUTON DE CONFIRMATION EST ACTIVÉ
  const isConfirmButtonEnabled = () => {
    // if (!categoryToDelete) return false;
    // return typedName.trim() === getTranslatedCategoryName(categoryToDelete);
    return isChecked; // Activation uniquement quand la case est cochée
  };

  return (
    <View style={styles.accordionContainer}>
      {/* EN-TÊTE AVEC GESTION DU CHARGEMENT */}
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        disabled={isLoading}
      >
        <Text style={styles.accordionTitle}>{t.category.list}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {isLoading && (
            <MaterialIcons name="hourglass-empty" size={16} color={COLORS.yellow_color} style={{ marginRight: 8 }} />
          )}
          {/* <MaterialIcons
            name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={24}
            color={COLORS.textPrimary}
          /> */}
        </View>
      </TouchableOpacity>

      {/* Contenu de l'accordéon */}
      {/* {isExpanded && ( */}
      <View style={styles.accordionContent}>
        <ScrollView
          nestedScrollEnabled={true}
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* AFFICHAGE DU CHARGEMENT DANS L'ESPACE DE LA LISTE */}
          {isLoading ? (
            <View style={styles.loadingInList}>
              <MaterialIcons name="hourglass-empty" size={40} color={COLORS.yellow_color} />
              <Text style={styles.loadingText}>{t.category.loading_category}</Text>
              <Text style={styles.loadingSubText}>{t.operation_crud_and_other.please_wait}</Text>
            </View>
          ) : hasLoadingError ? (
            // AFFICHAGE D'ERREUR
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={40} color={COLORS.error} />
              <Text style={styles.errorText}>{t.operation_crud_and_other.error_loading}</Text>
              <Text style={styles.errorSubText}>{t.operation_crud_and_other.unable_to_load_data}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRetryLoad}
              >
                <Text style={styles.retryButtonText}>{t.operation_crud_and_other.retry}</Text>
              </TouchableOpacity>
            </View>
          ) : categories.length === 0 ? (
            <Text style={styles.emptyText}>{t.category.no_category_found}.</Text>
          ) : (
            categories.map((item) => {
              const isUserCategory = item.type === 1;

              return (
                <View key={item.id} style={styles.item}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={[styles.iconWrapper, { backgroundColor: item.color }]}>
                      <MaterialCommunityIcons
                        name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                        size={20}
                        color="#fff"
                      />
                    </View>
                    <Text style={styles.label}>{getTranslatedCategoryName(item)}</Text>
                  </View>

                  {/* Boutons visibles uniquement si ce n'est PAS une catégorie par défaut */}
                  {isUserCategory ? (
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      {/* <TouchableOpacity onPress={() => onEdit(item.id)}> */}
                      <TouchableOpacity onPress={() => {
                        setCategoryToEdit(item);
                        setEditModalVisible(true);
                      }}>
                        <MaterialIcons name="edit" size={20} color={COLORS.blueColor} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => confirmDelete(item)}>
                        <MaterialIcons name="delete" size={22} color={COLORS.error} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, opacity: 0.5 }}>
                      <Text style={{ fontSize: 10, color: COLORS.textSecondary, fontFamily: FONTS.Poppins_Medium }}>
                        {/* {t.category.system} */}
                      </Text>
                      <MaterialIcons name="lock" size={16} color={COLORS.textSecondary} />
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
      {/* )} */}

      {/* MODAL DE CONFIRMATION DE SUPPRESSION - CORRIGÉE */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDeleteModal}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>

            {/* En-tête simple */}
            <View style={styles.modalHeader}>
              <MaterialIcons name="warning" size={22} color={COLORS.error} />
              <Text style={styles.modalTitle}>{t.operation_crud_and_other.confirm_delete}</Text>
              {!isDeleting && ( // Cache le bouton fermer pendant le loading
                <TouchableOpacity onPress={closeDeleteModal} style={styles.closeButton}>
                  <MaterialIcons name="close" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Contenu minimaliste */}
            <View style={styles.modalContent}>
              {categoryToDelete && (
                <>
                  {isDeleting ? (
                    // LOADING PENDANT LA SUPPRESSION
                    <View style={styles.deletingContainer}>
                      <ActivityIndicator size="large" color={COLORS.yellow_color} />
                      <Text style={styles.deletingText}>
                        {t.operation_crud_and_other.deletion_in_progress}...
                      </Text>
                      <Text style={styles.deletingSubText}>
                        {t.operation_crud_and_other.please_wait}
                      </Text>
                    </View>
                  ) : (
                    // CONTENU NORMAL
                    <>
                      {/* Message principal */}
                      {/* <Text style={styles.modalMessage}> */}
                        {/* {t.operation_crud_and_other.enter_name}: */}
                        {/* Entrer le mot suivant pour confirmer: <Text style={{ fontWeight: "700" }}>Delete</Text> */}
                      {/* </Text> */}

                      {/* Nom de la catégorie en évidence */}
                      {/* <View style={styles.categoryDisplay}>
                        <View style={[styles.categoryIcon, { backgroundColor: categoryToDelete.color }]}>
                          <MaterialCommunityIcons
                            name={categoryToDelete.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                            size={16}
                            color="#fff"
                          />
                        </View>
                        <Text style={styles.categoryName}>
                          {getTranslatedCategoryName(categoryToDelete)}
                        </Text>
                      </View> */}

                      {/* Input pour taper le nom */}
                      {/* <TextInput
                        style={[
                          styles.nameInput,
                          inputError && styles.nameInputError
                        ]}
                        placeholder={`Ex: "Delete"`}
                        placeholderTextColor={COLORS.textSecondary + '80'}
                        value={typedName}
                        onChangeText={handleTypedNameChange}
                        autoFocus={true}
                        selectionColor={COLORS.blueColor}
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!isDeleting}
                      /> */}

                      {/* Section checkbox */}
                      <View style={styles.checkboxContainer}>
                        <TouchableOpacity
                          style={[styles.checkbox, isChecked && styles.checkboxChecked]}
                          onPress={() => setIsChecked(!isChecked)}
                          activeOpacity={0.7}
                        >
                          {isChecked && (
                            <MaterialIcons name="check" size={18} color={COLORS.white} />
                          )}
                        </TouchableOpacity>

                        <Text style={styles.checkboxLabel}>
                          {t.operation_crud_and_other.confirm_delete_checkbox} Cocher pour supprimer
                        </Text>
                      </View>

                      {/* Message d'erreur simple */}
                      {inputError && (
                        <View style={styles.errorMessageBox}>
                          <MaterialIcons name="error" size={14} color={COLORS.error} />
                          <Text style={styles.errorMessageText}>
                            {t.operation_crud_and_other.incorrect_name}
                          </Text>
                        </View>
                      )}

                      {/* Petit avertissement */}
                      <Text style={styles.warningText}>
                        ⚠️ {t.operation_crud_and_other.warning_text}
                      </Text>
                    </>
                  )}
                </>
              )}
            </View>

            {/* Boutons simples (cachés pendant le loading) */}
            {!isDeleting && (
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={closeDeleteModal}
                >
                  <Text style={styles.cancelButtonText}>{t.operation_crud_and_other.concel}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.confirmButton,
                      !isConfirmButtonEnabled() && styles.confirmButtonDisabled
                  ]}
                  onPress={handleConfirmDelete}
                 disabled={!isConfirmButtonEnabled()}
                >
                  <Text style={styles.confirmButtonText}>
                    {t.operation_crud_and_other.delete}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </View>
      </Modal>

      {/* MODAL D'ÉDITION - AJOUTER APRÈS LA MODAL DE SUPPRESSION */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          if (!isEditing) setEditModalVisible(false);
        }}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>

            {/* Header de la modal */}
            <View style={styles.modalHeader}>
              <MaterialIcons name="edit" size={22} color={COLORS.blueColor} />
              <Text style={[styles.modalTitle,]}>
                {t.category.update_title}
              </Text>
              {!isEditing && (
                <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.closeButton}>
                  <MaterialIcons name="close" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Contenu - le formulaire */}
            <View style={styles.modalContent}>
              {isEditing ? (
                // LOADING PENDANT LA MODIFICATION
                <View style={styles.deletingContainer}>
                  <ActivityIndicator size="large" color={COLORS.yellow_color} />
                  <Text style={styles.deletingText}>
                    {t.operation_crud_and_other.update_in_progress}...
                  </Text>
                  <Text style={styles.deletingSubText}>
                    {t.operation_crud_and_other.please_wait}
                  </Text>
                </View>
              ) : (
                // FORMULAIRE D'ÉDITION
                categoryToEdit && (
                  <CategoryForm1
                    ref={categoryFormRef} // ← AJOUTER LA REF
                    initialData={categoryToEdit}
                    inModal={true}
                    setLoading={setIsEditing} // Passe setIsEditing comme setLoading
                    setToast={setToast}
                    onSubmitSuccess={() => {
                      // Quand la modification réussit, fermer la modal
                      setEditModalVisible(false);
                      setCategoryToEdit(null);

                      // Recharger les catégories si accordéon ouvert
                      if (isExpanded) {
                        loadDataFromServer();
                      }
                    }}
                    onCancel={() => setEditModalVisible(false)}
                  />
                )
              )}
            </View>

            {/* Boutons (cachés pendant le loading) */}
            {!isEditing && categoryToEdit && (
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>
                    {t.operation_crud_and_other.concel}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButtonUpdate]}
                  onPress={() => {
                    // Ici, il faudrait déclencher handleSubmit du CategoryForm1
                    if (categoryFormRef.current) {
                      categoryFormRef.current.submitForm();
                    }
                  }}
                >
                  <Text style={[styles.confirmButtonText, styles.confirmButtonTextUpdate]}>
                    {t.category.update}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  accordionContainer: {
    borderRadius: 8,
    marginBottom: 10,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLORS.header_accordeon_bg_color,
    borderRadius: 8,
  },
  accordionTitle: {
    fontFamily: FONTS.Poppins_Medium,
    fontSize: 14,
    color: COLORS.black_color,
  },
  accordionContent: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
  list: {
    marginTop: 0,
    maxHeight: 200,
  },
  item: {
    backgroundColor: COLORS.bg_item,
    flexDirection: 'row',
    padding: 12,
    marginTop: 8,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    color: COLORS.textSecondary,
    fontFamily: FONTS.Poppins_Regular,
    fontStyle: 'italic',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingInList: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginVertical: 10,
  },
  loadingText: {
    marginTop: 15,
    fontFamily: FONTS.Poppins_Medium,
    color: COLORS.textPrimary,
    fontSize: 14,
    textAlign: 'center',
  },
  loadingSubText: {
    marginTop: 5,
    fontFamily: FONTS.Poppins_Regular,
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    marginTop: 15,
    fontFamily: FONTS.Poppins_Medium,
    color: COLORS.error,
    fontSize: 16,
    textAlign: 'center',
  },
  errorSubText: {
    marginTop: 5,
    fontFamily: FONTS.Poppins_Regular,
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 15,
    backgroundColor: COLORS.yellow_color,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    fontFamily: FONTS.Poppins_Medium,
    color: COLORS.black_color,
    fontSize: 12,
  },

  // STYLES POUR LA MODAL DE SUPPRESSION (CORRIGÉS)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    width: '100%',
    maxWidth: 340, // Réduit la largeur max
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: COLORS.yellow_color,
  },
  modalTitle: {
    flex: 1,
    fontFamily: FONTS.Poppins_SemiBold,
    fontSize: 15, // Réduit
    // color: COLORS.error,
    marginLeft: 10,
  },
  closeButton: {
    padding: 2,
  },
  modalContent: {
    padding: 12, // Réduit
  },
  modalMessage: {
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 13, // Réduit
    color: COLORS.textPrimary,
    marginBottom: 12, // Réduit
    textAlign: 'center',
    lineHeight: 18,
  },
  categoryDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12, // Réduit
    borderRadius: 8,
    marginBottom: 16, // Réduit
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryIcon: {
    width: 28, // Réduit
    height: 28, // Réduit
    borderRadius: 6, // Réduit
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  categoryName: {
    fontFamily: FONTS.Poppins_SemiBold,
    fontSize: 15, // Réduit
    color: COLORS.textPrimary,
  },
  nameInput: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 6, // Réduit
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 14, // Réduit
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
    height: 42, // Hauteur fixe réduite
  },
  nameInputError: {
    borderColor: COLORS.error,
    backgroundColor: '#FEF2F2',
  },
  errorMessageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  errorMessageText: {
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 12, // Réduit
    color: COLORS.error,
    marginLeft: 6,
  },
  warningText: {
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 11, // Réduit
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    padding: 14, // Réduit
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 10, // Réduit
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10, // Réduit
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42, // Hauteur réduite
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    fontFamily: FONTS.Poppins_Medium,
    fontSize: 13, // Réduit
   // color: COLORS.textSecondary,
  },
  confirmButton: {
    backgroundColor: COLORS.yellow_color,
  },
  confirmButtonUpdate: {
    backgroundColor: COLORS.yellow_color,
  },
  confirmButtonDisabled: {
    backgroundColor: '#a99c9c77',
    opacity: 0.6,
  },
  confirmButtonText: {
    fontFamily: FONTS.Poppins_Medium,
    fontSize: 13, // Réduit
   // color: COLORS.textSecondary,
  },
  confirmButtonTextUpdate: {
   // color: COLORS.textSecondary,
  },
  // STYLES POUR LE LOADING DE SUPPRESSION
  deletingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  deletingText: {
    fontFamily: FONTS.Poppins_Medium,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 6,
  },
  deletingSubText: {
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },

  //style pour le bouton cocher
  
checkboxContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: 20,
  padding: 15,
  backgroundColor: '#F8FAFC',
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#E2E8F0',
},
checkbox: {
  width: 24,
  height: 24,
  borderRadius: 6,
  borderWidth: 2,
  borderColor: COLORS.textSecondary,
  marginRight: 12,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: COLORS.white,
},
checkboxChecked: {
  backgroundColor: COLORS.yellow_color,
  borderColor: COLORS.yellow_color,
},
checkboxLabel: {
  fontFamily: FONTS.Poppins_Regular,
  fontSize: 14,
  color: COLORS.textPrimary,
  flex: 1,
 lineHeight: 20,
},
});