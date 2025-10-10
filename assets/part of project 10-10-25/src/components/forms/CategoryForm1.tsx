/**
 * Formulaire pour ajouter ou modifier une catégorie avec effet accordéon
 * Props :
 *  - onSubmit : fonction appelée avec la nouvelle catégorie (objet)
 *  - initialData : données initiales pour modification (optionnel)
 */

import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS } from '../../../assets/constants';
import { Category } from '../../../contexts/ExpenseContext';
import { validateCategoryName } from '../../../utils/validationCategory';
import { useExpenses } from '../../../contexts/ExpenseContext';
//Props du composant
interface CategoryForm1Props {
  onSubmit: (category: Category) => void;
  initialData?: Category | null;
  expand?: boolean; // permet d’ouvrir l’accordéon depuis l’extérieur
}


//fonction pour generer la couleur de l'icone en fonction du nom de la categorie
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 70%, 50%)`;
}


export default function CategoryForm1({ onSubmit, initialData = null, expand = false }: CategoryForm1Props) {

  const { categories } = useExpenses(); // <-- récupèration

  const [name, setName] = useState<string>('');
  const [icon, setIcon] = useState('account-group'); // icône par défaut tag,
  const [isExpanded, setIsExpanded] = useState<boolean>(expand);


  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setIcon(initialData.icon); //pour l'icone
      setIsExpanded(true); // ouvre automatiquement l’accordéon pour modification car par defaut fermer
    }
  }, [initialData]);

  //  Si prop expand change
  // useEffect(() => {
  //   if (expand) setIsExpanded(true);
  // }, [expand]);

  const handleSubmit = () => {
    // if (name.trim().length === 0) return; // validation simple
    //appel de la fonctions favilder
    const error = validateCategoryName(name, categories);

    if (error) {
      Alert.alert('Erreur', error);
      return;
    }

    const color = stringToColor(name); //génère la couleur en fonction du nom

    onSubmit({ id: initialData?.id || Date.now(), name: name.trim(), icon, color });
    setName('');
  };

  return (
    <View style={styles.accordionContainer}>
      {/* En-tête de l'accordéon */}
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.accordionTitle}>
          {initialData ? "Modifier une catégorie" : "Nouvelle catégorie"}
        </Text>
        <MaterialIcons
          name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={22}
          color={COLORS.textPrimary}
        />
      </TouchableOpacity>

      {/* Contenu du formulaire */}
      {isExpanded && (
        <View style={styles.accordionContent}>
          <View style={{ flexDirection: 'row', gap: 5, }}>
            <TextInput
              placeholder="Nouvelle catégorie"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TouchableOpacity style={styles.btnWrapper} onPress={handleSubmit}>
              <Text style={styles.btnText}>{initialData ? "Modifier" : "Créer"}</Text>
            </TouchableOpacity>
          </View>

          {/* Aperçu de la catégorie */}

          {/* {name.trim().length > 0 && (
            <View style={styles.previewContainer}>
              <View style={[styles.iconWrapper, { backgroundColor: stringToColor(name) }]}>
                <MaterialCommunityIcons name={icon} size={14} color="white" />
              </View>
              <Text style={styles.previewText}>{name}</Text>
            </View>
          )} */}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  accordionContainer: {
    borderRadius: 8,
    marginBottom: 7,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.white,
    borderRadius: 8,
  },
  accordionTitle: {
    fontFamily: FONTS.Poppins_Medium,
    fontSize: 14,
    // fontWeight: '600',
    color: COLORS.textPrimary,
  },
  accordionContent: {
    marginTop: 10,
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    // marginVertical:10,
  },
  input: {
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 12,
    flex: 1,
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
  },
  btnWrapper: {
    borderRadius: 6,
    backgroundColor: COLORS.yellow_color,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  btnText: {
    padding: 2,
    color: COLORS.black_color,
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 12,
  },


  // style pour previsualiser l'icone
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewText: {
    fontFamily: FONTS.Poppins_Regular,
    color: COLORS.textPrimary,
  },
});
