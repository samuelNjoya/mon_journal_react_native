//import React, { useState, useEffect } from 'react';
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS } from '../../../assets/constants';
import { Category } from '../../context/ExpenseContext';
import { validateCategoryName } from '../../utils/validationCategory';
import { useExpenses } from '../../context/ExpenseContext';
import { useBudget } from '../../context/BudgetsContext';
import { useTranslation } from '../../hooks/useTranslation';
//Props du composant
interface CategoryForm1Props {
  // onSubmit: (category: Category) => void; plus besoin de ça 
  onCancel: () => void; // AJOUTER si vous voulez pouvoir fermer le formulaire
  initialData?: Category | null;
  expand?: boolean; // permet d’ouvrir l’accordéon depuis l’extérieur
  setLoading: (loading: boolean) => void;
  setToast: (toast: any) => void; // Vous devrez définir le type Toast, mais 'any' est OK pour l'exemple

  inModal?: boolean; // ← pour la modification depuis le modal a l'exterieur
  onSubmitSuccess?: () => void; // ← 
  ref?: React.Ref<any>; // ← AJOUTER CETTE LIGNE
}


//fonction pour generer la couleur de l'icone en fonction du nom de la categorie
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Générer R, G, B à partir du hash
  const r = (hash >> 0) & 0xff;
  const g = (hash >> 8) & 0xff;
  const b = (hash >> 16) & 0xff;

  // Retourner en format hex
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)}`;
}



//export default function CategoryForm1({ initialData = null, expand = false, onCancel, setLoading, setToast,inModal,onSubmitSuccess }: CategoryForm1Props) {
const CategoryForm1 = forwardRef(({ initialData = null, expand = false, onCancel, setLoading, setToast, inModal = false, onSubmitSuccess }: CategoryForm1Props, ref) => {

  const { t, } = useTranslation();

  const { categories, addCategory, updateCategory } = useExpenses(); // <-- récupèration
  //  Déstructurer les fonctions nécessaires pour le rechargement
  const { chargerBudgetsFiltres, page, itemsPerPage, selectedStatus } = useBudget();

  const [name, setName] = useState<string>('');
  const [icon, setIcon] = useState('account-group'); // icône par défaut tag,
  const [isExpanded, setIsExpanded] = useState<boolean>(expand);


  useEffect(() => {
    if (initialData) {
      setName(initialData.nom);
      setIcon(initialData.icon); //pour l'icone
      setIsExpanded(true); // ouvre automatiquement l’accordéon pour modification car par defaut fermer
    }
  }, [initialData]);

  // EXPOSER handleSubmit AU PARENT (la modal)
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      handleSubmit();
    }
  }));


  // NOUVELLE LOGIQUE ASYNCHRONE DANS handleSubmit
  const handleSubmit = async () => { // Rendre la fonction ASYNCHRONE

    // Préparation des données
    const color = stringToColor(name);
    const categoryData: Category = {
      id: initialData?.id ?? undefined, // Utiliser undefined si c'est une création
      nom: name.trim(),
      icon,
      color,
      type: initialData?.type ?? 1 // Conserver le type ou mettre 1 par défaut
    };

    // 2. Validation
    const error = validateCategoryName(name, categories, t.toast_validation_category, initialData?.id);
    if (error) {
      Alert.alert(t.operation_crud_and_other.validation_error, error);
      return;
    }

    setLoading(true); // Démarrer le spinner

    try {
      if (initialData) {
        // MODIFICATION
        await updateCategory(categoryData);
        setToast({ visible: true, message: t.toast_expense_category.category_updated, type: "success" });
      } else {
        // CRÉATION
        await addCategory(categoryData);
        setToast({ visible: true, message: t.toast_expense_category.category_added, type: "success" });
      }
      chargerBudgetsFiltres(page, itemsPerPage, selectedStatus);

      // En cas de succès, réinitialiser le formulaire et le fermer (si désiré)
      // setName('');
      // onCancel(); // Fermer l'accordéon ou le modal si onCancel ferme l'UI.

      setName('');
      if (inModal && onSubmitSuccess) {
        onSubmitSuccess(); // ← Fermer la modal
      } else {
        onCancel(); // ← Fermer l'accordéon
      }

    } catch (e) {
      // Le Service a déjà affiché l'Alerte native. On ne fait rien de plus ici.
      console.error("Échec de la soumission de la catégorie:", e);
    } finally {
      setLoading(false); // Arrêter le spinner (que ce soit succès ou échec)
    }
  };

  // return (
  //   <View style={styles.accordionContainer}>
  //     {/* En-tête de l'accordéon */}
  //     <TouchableOpacity
  //       style={styles.accordionHeader}
  //       onPress={() => setIsExpanded(!isExpanded)}
  //     >
  //       <Text style={styles.accordionTitle}>
  //         {initialData ? t.category.update_title : t.category.new_title}
  //       </Text>
  //       {/* <MaterialIcons
  //         name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
  //         size={22}
  //         color={COLORS.textPrimary}
  //       /> */}
  //     </TouchableOpacity>

  //     {/* Contenu du formulaire */}
  //     {/* {isExpanded && ( */}
  //     <View style={styles.accordionContent}>
  //       <View style={{ flexDirection: 'row', gap: 5, }}>
  //         <TextInput
  //           placeholder={t.category.new_title}
  //           value={name}
  //           onChangeText={setName}
  //           style={styles.input}
  //         />
  //         <TouchableOpacity style={styles.btnWrapper} onPress={handleSubmit}>
  //           <Text style={styles.btnText}>{initialData ? t.category.update : t.category.create}</Text>
  //         </TouchableOpacity>
  //       </View>

  //       {/* Aperçu de la catégorie */}

  //       {/* {name.trim().length > 0 && (
  //           <View style={styles.previewContainer}>
  //             <View style={[styles.iconWrapper, { backgroundColor: stringToColor(name) }]}>
  //               <MaterialCommunityIcons name={icon} size={14} color="white" />
  //             </View>
  //             <Text style={styles.previewText}>{name}</Text>
  //           </View>
  //         )} */}
  //     </View>
  //     {/* )} */}
  //   </View>
  // )
  return (
    <View style={styles.accordionContainer}>
      {/* MODIFIER CE BLOC : Afficher l'accordéon header SEULEMENT si pas dans modal */}
      {!inModal && (
        <TouchableOpacity
          style={styles.accordionHeader}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Text style={styles.accordionTitle}>
            {initialData ? t.category.update_title : t.category.new_title}
          </Text>
          {/* <MaterialIcons
            name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={22}
            color={COLORS.textPrimary}
          /> */}
        </TouchableOpacity>
      )}

      {/* MODIFIER CE BLOC : Toujours afficher le contenu si dans modal */}
      {/* {isExpanded && ( */}
      <View style={styles.accordionContent}>
        <View style={{ flexDirection: 'row', gap: 5, }}>
          <TextInput
            placeholder={t.category.new_title}
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          {/* MODIFIER : Afficher le bouton SEULEMENT si pas dans modal */}
          {!inModal && (
            <TouchableOpacity style={styles.btnWrapper} onPress={handleSubmit}>
              <Text style={styles.btnText}>
                {initialData ? t.category.update : t.category.create}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* )}  */}
    </View>
  );
});

export default CategoryForm1;

const styles = StyleSheet.create({
  accordionContainer: {
    borderRadius: 8,
    marginBottom: 10,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.header_accordeon_bg_color,
    borderRadius: 8,
  },
  accordionTitle: {
    fontFamily: FONTS.Poppins_Medium,
    fontSize: 14,
    // fontWeight: '600',
    color: COLORS.textPrimary,
  },
  accordionContent: {
    // marginTop: 10,
    backgroundColor: COLORS.white,
    padding: 12,
    //  borderRadius: 8,
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
