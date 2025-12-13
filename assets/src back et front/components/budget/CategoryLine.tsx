import React, { useState, useRef, JSX } from 'react';
import {View, Text, TextInput, TouchableOpacity, Modal,FlatList, Dimensions, Platform, StyleSheet} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, Feather, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { CategorieType, LigneCategorieType } from '../../types/BudgetType';
import { useBudget } from '../../context/BudgetsContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useCategoryTranslation } from '../../hooks/useCategoryTranslation';

interface CategoryLineProps {
  lineCategorie: LigneCategorieType
  index: number;
  onUpdateCategorieLine: (id: number, field: string, value: string | number, idCategorie?: number) => void;
  onRemoveCategorieLine: (id: number) => void;
  isRemovable: boolean;
  showCategoryOnly?: boolean; // afficher uniquement le sélecteur de catégorie lors de la categorisation d'une depense
}


const CategoryLine: React.FC<CategoryLineProps> = ({ 
  lineCategorie,index, onUpdateCategorieLine, onRemoveCategorieLine, isRemovable, 
showCategoryOnly = false }) => {
  
  // ETATS LOCAUX
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { height: screenHeight } = Dimensions.get('window');

  const{listeCategorie}=useBudget();
  const { t } = useTranslation();
  const{getTranslatedCategoryName} = useCategoryTranslation();
 
  //ouverture du modal categorie
  const openCategoryModal = (): void => {
    setModalVisible(true);
  };

  //fermeture du modal
  const closeModal = (): void => {
    setModalVisible(false);
  };


  const selectCategory = (category: CategorieType): void => {
    onUpdateCategorieLine(lineCategorie.idLigneCat ?? 0, 'nomCategorie', getTranslatedCategoryName(category), category.id);
    closeModal();
  };

  /**
   * FONCTION POUR TRONQUER LE TEXTE LONG AVEC DES POINTS DE SUSPENSION
   */
  const truncateText = (text: string, maxLength: number = 20): string => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  // ========== FONCTION DE RENDU DE L'ICÔNE POUR LES CATÉGORIES ==========
  const renderCategoryIcon = (category: CategorieType): JSX.Element => {
    const iconProps = {
      size: Platform.OS === 'ios' ? 18 : 17,
      color: category.color, 
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
        return <MaterialIcons name="category" {...iconProps} />;
    }
  };


  /**
   * RENDU D'UN ÉLÉMENT DE CATÉGORIE DANS LA LISTE
   */
  const renderCategoryItem = ({ item }: { item: CategorieType }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => selectCategory(item)}
      activeOpacity={0.7}
    >
      {/* ICONE ET NOM DE LA CATÉGORIE */}
      <View style={styles.categoryItemContent}>
        <View style={styles.categoryIconContainer}>
          {/* {renderCategoryIcon(item)} */}
          <MaterialCommunityIcons name={item.icon as any} size={Platform.OS === 'ios' ? 18 : 17} color={item.color} />
        </View>
        <Text style={styles.categoryItemText}>
          {getTranslatedCategoryName(item)}
          {/* {item.nom} */}
        </Text>
      </View>
    </TouchableOpacity>
  );
 

  // TROUVER L'ICONE DE LA CATÉGORIE SELECTIONNÉE a partir de son ID
  const selectedCategory = listeCategorie.find(cat => cat.id === lineCategorie.idCategorie);


  //Vérifions si une catégorie est sélectionnée avant de passer l'id
  
  const handleAmountChange = (text: string): void => {
    const numericValue = text === '' ? 0 : parseFloat(text) || 0;

    //si selectedIconCategory existe avant d'accéder à son id
    const categoryId = selectedCategory ? selectedCategory.id : undefined;

    onUpdateCategorieLine(lineCategorie.idLigneCat ?? 0, 'montantAffecter', numericValue, categoryId);
  };

  return (
    <View style={styles.categoryLine}>

      {/* SELECTEUR DE CATÉGORIE */}
      <View style={styles.categoryInputGroup}>

        {/*Masquer le label "Catégorie X" lors de la categorisation d'une transaction */}
        {!showCategoryOnly && (
          <Text style={styles.label}> {t.budget.category} {index + 1}</Text>
        )}

        <TouchableOpacity
          style={styles.categorySelector}
          onPress={openCategoryModal}
          activeOpacity={0.7}
        >
          {/*AFFICHAGE DE LA CATÉGORIE SELECTIONNÉE AVEC ICONE */}
          <View style={styles.selectedCategoryContent}>
            {/*Afficher l'icône seulement si une catégorie est sélectionnée ET si l'idCat est défini */}
            {selectedCategory &&
              <View style={styles.selectedCategoryIcon}>
                {/* {renderCategoryIcon(selectedIconCategory)} */}
                <MaterialCommunityIcons name={selectedCategory.icon as any} size={Platform.OS === 'ios' ? 18 : 17} color={selectedCategory.color} />
              </View>
            }
            <Text
              style={lineCategorie.nomCategorie ? styles.categoryText : styles.categoryPlaceholder}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {selectedCategory ?

                truncateText(getTranslatedCategoryName(selectedCategory)) : t.budget.title_category
              }
            </Text>

          </View>
          <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>

        {/* MODAL POUR LA SELECTION DES CATÉGORIES */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeModal}
          statusBarTranslucent={true}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={closeModal}
          >
            <View style={[
              styles.categoryModal,
              {
                marginTop: screenHeight * 0.2,
                marginBottom: screenHeight * 0.2,
                maxHeight: screenHeight * 0.6
              }
            ]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t.budget.title_category}</Text>
              </View>

              {/* LISTE DES CATÉGORIES AVEC ICONES */}
              <FlatList
                data={listeCategorie}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => (item.id ?? 0).toString()}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      {/* Masquons le champs montant lorsqu'il faut categoriser un transaction */}
      {!showCategoryOnly && (
        <View style={styles.amountInputGroup}>
          <Text style={styles.label}>{t.budget.amount}</Text>
          <TextInput
            style={styles.amountInput}
            value={lineCategorie.montantAffecter === 0 ? '' : lineCategorie.montantAffecter.toString()}
            onChangeText={handleAmountChange} // CORRECTION: Utiliser la nouvelle fonction
            placeholder="0"
            placeholderTextColor="#9e9e9e"
            keyboardType="numeric"
          />
        </View>
      )}

      {/* BOUTON DE SUPPRESSION */}
      {isRemovable && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemoveCategorieLine(lineCategorie.idLigneCat ?? 0)}
          activeOpacity={0.7}
        >
          <Text style={styles.removeIcon}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
export default CategoryLine;

const styles = StyleSheet.create({

  categoryLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },

  // GROUPE DE CHAMP POUR LA SELECTION DE CATEGORIE
  categoryInputGroup: {
    flex: 2,
    zIndex: 1000,
  },

  // GROUPE DE CHAMP POUR LE MONTANT
  amountInputGroup: {
    flex: 1,
  },

  // STYLE DES LABELS AU-DESSUS DES CHAMPS
  label: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Poppins' : 'Poppins-Regular',
    color: '#1a171a',
    marginBottom: 4,
    opacity: 0.8,
  },

  // SELECTEUR DE CATEGORIE - BOUTON POUR OUVIR LE MODAL
  categorySelector: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 11 : 10,
    backgroundColor: '#fafafa',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Platform.OS === 'ios' ? 43 : 40,
    overflow: 'hidden',
  },

  // CONTENEUR POUR LE CONTENU DE LA CATEGORIE SELECTIONNÉE
  selectedCategoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    overflow: 'hidden',
    paddingVertical: -4,
  },

  // CONTENEUR POUR L'ICONE DE LA CATEGORIE SELECTIONNÉE
  selectedCategoryIcon: {
    marginRight: 8,
    flexShrink: 0,
  },

  // TEXTE DE LA CATEGORIE QUAND UNE CATEGORIE EST SELECTIONNÉE
  categoryText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
    color: '#1a171a',
    flex: 1,
    flexShrink: 1,
    overflow: 'hidden',
    lineHeight: 18,
  },

  // TEXTE DU PLACEHOLDER QUAND AUCUNE CATEGORIE N'EST SELECTIONNÉE
  categoryPlaceholder: {
    fontSize: 12,
    color: '#9e9e9e',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
    flex: 1,
    flexShrink: 1,
    overflow: 'hidden',
    lineHeight: 18,
  },

  // ICONE DE DÉROULEMENT 
  dropdownIcon: {
    fontSize: 10,
    color: '#9e9e9e',
    flexShrink: 0,
    marginLeft: 4,
  },

  // CHAMP DE SAISIE POUR LE MONTANT
  amountInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 11 : 10,
    fontSize: 12,
    backgroundColor: '#fafafa',

    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
    height: Platform.OS === 'ios' ? 43 : 40,
    color: '#1a171a',
    lineHeight: Platform.OS === 'ios' ? 20 : 18,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  // BOUTON POUR SUPPRIMER LA LIGNE DE CATEGORIE
  removeButton: {
    padding: 6,
    marginTop: 22,
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ICONE DE SUPPRESSION (CROIX)
  removeIcon: {
    fontSize: 16,
    color: '#ff4444',
  },

  // OVERLAY SEMI-TRANSPARENT POUR LE MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
  },

  // CONTENEUR PRINCIPAL DU MODAL
  categoryModal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // EN-TÊTE DU MODAL AVEC LE TITRE
  modalHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  // TITRE DU MODAL
  modalTitle: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
    color: '#1a171a',
  },

  // ÉLÉMENT INDIVIDUEL DE LA LISTE DES CATEGORIES
  categoryItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  // CONTENEUR POUR LE CONTENU DE CHAQUE ÉLÉMENT DE CATEGORIE
  categoryItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // CONTENEUR POUR L'ICONE DANS LA LISTE DES CATEGORIES
  categoryIconContainer: {
    marginRight: 12,
    width: 24,
    alignItems: 'center',
  },

  // TEXTE DE L'ÉLÉMENT DANS LA LISTE DES CATEGORIES
  categoryItemText: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
    color: '#1a171a',
    flex: 1,
    flexShrink: 1,
  },
});