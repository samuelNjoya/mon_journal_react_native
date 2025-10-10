/**
 * Liste des catégories avec possibilité de suppression et effet accordéon
 * Props:
 *  - categories : tableau des catégories
 *  - onDelete : fonction suppression par id
 *  - onEdit : fonction édition par id
 */
import React, { useState } from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { COLORS, FONTS } from '../../assets/constants';
import { MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

import { Category, DEFAULT_CATEGORY_IDS } from '../../contexts/ExpenseContext';

interface CategoryListProps {
  categories: Category[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

export default function CategoryList({ categories, onDelete, onEdit }: CategoryListProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Fonction pour confirmer la suppression
  const confirmDelete = (id: number) => {
    Alert.alert(
      'Supprimer la catégorie',
      'Voulez-vous vraiment supprimer cette catégorie ?',
      [
        { text: 'Annuler' },
        { text: 'Supprimer', onPress: () => onDelete(id), style: 'destructive' }
      ]
    );
  };

  return (
    <View style={styles.accordionContainer}>
      {/* En-tête de l'accordéon */}
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.accordionTitle}>Liste des catégories</Text>
        <MaterialIcons
          name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color={COLORS.textPrimary}
        />
      </TouchableOpacity>

      {/* Contenu de l'accordéon */}
      {isExpanded && (
        <View style={styles.accordionContent}>
          <ScrollView
            nestedScrollEnabled={true}
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {categories.length === 0 ? (
              <Text style={styles.emptyText}>Aucune catégorie enregistrée.</Text>
            ) : (
              categories.map((item) => {
                const isDefaultCategory = DEFAULT_CATEGORY_IDS.includes(item.id);

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
                      <Text style={styles.label}>{item.name}</Text>
                    </View>

                    {/* Boutons visibles uniquement si ce n'est PAS une catégorie par défaut */}
                    {!isDefaultCategory && (
                      <View style={{ flexDirection: 'row', gap: 12 }}>
                        <TouchableOpacity onPress={() => onEdit(item.id)}>
                          <AntDesign name="edit" size={22} color={COLORS.blueColor} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => confirmDelete(item.id)}>
                          <MaterialIcons name="delete" size={22} color={COLORS.error} />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  accordionContainer: {
    borderRadius: 8,
    marginBottom: 1,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLORS.white,
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
    backgroundColor: COLORS.background,
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
});
