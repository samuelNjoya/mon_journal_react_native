import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Modal, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons, AntDesign, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { COLORS, FONTS } from '../../assets/constants';
import { useExpenses } from '../../contexts/ExpenseContext';
import { Category, Budget } from '../../contexts/ExpenseContext';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

interface CustomPickerProps {
  visible: boolean;
  onClose: () => void;
  items: (Category | Budget)[];
  onSelect: (id: number) => void;
  title: string;
}

const CustomPicker: React.FC<CustomPickerProps> = ({ visible, onClose, items, onSelect, title }) => (
  <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
    <TouchableOpacity style={pickerStyles.centeredView} activeOpacity={1} onPress={onClose}>
      <View style={pickerStyles.modalView} onStartShouldSetResponder={() => true}>
        <Text style={pickerStyles.modalTitle}>{title}</Text>
        <ScrollView style={{ maxHeight: 200, width: '100%' }} showsVerticalScrollIndicator={false}>
          {items.map((item) => {
            //  Gère les deux cas : Budget (IdBudget) ou Catégorie (id)
            const itemId = 'IdBudget' in item ? item.IdBudget : item.id;

            // Déterminer si l'item est une Catégorie (y compris l'option "Toutes Catégories")
            // Une catégorie a 'nom' et 'icon'. Un budget a 'libelle' et potentiellement 'IdBudget'.
            const isCategoryItem = 'nom' in item;

            // Déterminer si l'item est l'option "Tous" (qui doit utiliser son icône définie)
            const isAllOption = itemId === 0;

            return (
              <TouchableOpacity
                key={itemId}
                style={pickerStyles.pickerItem}
                onPress={() => {
                  onSelect(itemId);
                  onClose();
                }}
              >
                <View style={pickerStyles.row}>
                  {/* --- Icône à gauche --- IdBudget*/}
                  {isCategoryItem || isAllOption ? ( // <-- Logique clé
                    // CAS 1: Catégorie (filtrée ou non) OU l'option "Tous" (Budget ou Catégorie)
                    <View style={[pickerStyles.iconCircle, { backgroundColor: item.color || COLORS.yellow_color }]}>
                      <MaterialCommunityIcons
                        name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                        size={16}
                        color="#fff"
                      />
                    </View>
                  ) : (
                    // CAS 2: Budget Réel (qui n'est pas l'option 'Tous')
                    <View style={[pickerStyles.iconCircle, { backgroundColor: COLORS.yellow_color }]}>
                      <FontAwesome name="money" size={16} color="#fff" />
                    </View>
                  )}

                  {/* --- Nom ou Libellé --- */}
                  <Text style={pickerStyles.pickerItemText}>
                    {'nom' in item ? item.nom : ('libelle' in item ? item.libelle : 'Sans nom')}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </TouchableOpacity>
  </Modal>
);

interface ExpenseFilterProps {
  onFilterChange?: (filters: {
    startDate: Date;
    endDate: Date;
    selectedBudget: number;
    selectedCategory: number;
    minAmountFilter: number;
    maxAmountFilter: number;
  }) => void;
}

export default function ExpenseFilter({ onFilterChange }: ExpenseFilterProps) {
  const { categories, budgetsForFilter } = useExpenses();

  const today = new Date();
  const defaultStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [filters, setFilters] = useState({
    startDate: defaultStart,
    endDate: today,
    selectedBudget: 0,
    selectedCategory: 0,
    minAmountFilter: 0,           // --- AJOUT ---
    maxAmountFilter: 1000000,
  });

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [isPickingStart, setIsPickingStart] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<'budget' | 'category' | null>(null);

  // --- AJOUT --- pour inclure "Toutes les catégories" avec icône par défaut  IdBudget
  const budgetsWithAll = useMemo(() => [{ IdBudget: 0, libelle: 'Tous', categories: [], icon: 'view-list', color: '#757575' }, ...budgetsForFilter], [budgetsForFilter]);
  const categoriesWithAll = useMemo(
    () => [{ id: 0, nom: 'Toutes', icon: 'view-list', color: '#757575' }, ...categories],
    [categories]
  );


  const availableCategories = useMemo(() => {
    if (filters.selectedBudget === 0) return categoriesWithAll;

    const b = budgetsForFilter.find((x) => x.id === filters.selectedBudget); // Utiliser IdBudget si le budget a cette clé
    if (!b) return categoriesWithAll;

    // --- LOGIQUE DE JOINTURE POUR COMPLÉTER LES OBJETS CATÉGORIES ---
    //Récupérer les catégories du budget (qui peuvent être partielles)
    const budgetCategories = b.categories || [];
    //Joindre chaque catégorie du budget avec sa version complète (incluant icon et color)
    const completeFilteredCategories = budgetCategories
      .map(budgetCat => categories.find(globalCat => globalCat.id === budgetCat.id))
      .filter((c): c is Category => c !== undefined);

    // Retourner la liste complète avec l'option "Toutes"
    return [{ id: 0, nom: 'Toutes', icon: 'view-list', color: '#757575' }, ...completeFilteredCategories];
  }, [filters.selectedBudget, budgetsForFilter, categoriesWithAll, categories]); // categories doit être une dépendance


  useEffect(() => {
    if (onFilterChange) onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleDatePress = (isStart: boolean) => {
    setIsPickingStart(isStart);
    setShowDatePicker(true);
  };

  // Validation date de début/fin
  const onDateChange = (_event: any, selectedDate?: Date) => {
    // setShowDatePicker(Platform.OS === 'ios'); 
    setShowDatePicker(false); // ferme le picker systématiquement
    if (!selectedDate) return;

    setFilters((f) => {
      let newFilters = { ...f, [isPickingStart ? 'startDate' : 'endDate']: selectedDate };
      if (newFilters.endDate < newFilters.startDate) {
        alert("La date de fin ne peut pas être antérieure à la date de début");
        return f;
      }
      return newFilters;
    });
  };

  const handleBudgetSelect = (budgetId: number) => {
    setFilters((f) => ({ ...f, selectedBudget: budgetId, selectedCategory: 0 }));
  };

  const handleCategorySelect = (categoryId: number) => {
    setFilters((f) => ({ ...f, selectedCategory: categoryId }));
  };

  const formattedDate = (date: Date) => date.toLocaleDateString('fr-FR');

  const selectedCategoryName = categories.find((c) => c.id === filters.selectedCategory)?.nom || 'Toutes';
  const selectedBudgetName = budgetsWithAll.find((b) => b.id === filters.selectedBudget)?.libelle || 'Tous';

  const screenWidth = Dimensions.get("window").width

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filtres</Text>

      {/* Sélection de période */}
      <View style={styles.section}>
        <Text style={styles.label}>Période</Text>
        <View style={styles.periodGroup}>
          <TouchableOpacity style={styles.datePickerInput} onPress={() => handleDatePress(true)}>
            <Text style={styles.dateText}>{formattedDate(filters.startDate)}</Text>
            <AntDesign name="calendar" size={12} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.separator}>au</Text>
          <TouchableOpacity style={styles.datePickerInput} onPress={() => handleDatePress(false)}>
            <Text style={styles.dateText}>{formattedDate(filters.endDate)}</Text>
            <AntDesign name="calendar" size={12} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sélection Budget & Catégorie */}
      <View style={styles.filterRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Budget</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible('budget')}>
            <Text style={styles.dropdownText} numberOfLines={1}>{selectedBudgetName}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Catégorie</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible('category')}>
            <Text style={styles.dropdownText} numberOfLines={1}>{selectedCategoryName}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filtre montant */}
      {/* --- MODIFICATION : remplacement du Slider par un RangeSlider moderne --- */}
      <View style={styles.section}>
        <Text style={styles.label}>Montant</Text>

        {/* Affichage des valeurs sélectionnées */}
        <View style={styles.amountRangeDisplay}>
          <Text style={styles.amountText}>
            {filters.minAmountFilter.toLocaleString('fr-FR')} FCFA
          </Text>
          <Text style={styles.amountText}>
            {filters.maxAmountFilter.toLocaleString('fr-FR')} FCFA
          </Text>
        </View>

        <MultiSlider
          values={[filters.minAmountFilter, filters.maxAmountFilter]}
          min={0}
          max={1000000}
          step={1000}
          sliderLength={screenWidth - 70} // largeur de la piste
          allowOverlap={false} //empêche les poignées de se croiser
          snapped  // rend le mouvement fluide et precis
          // onValuesChange // fais la mise a jour a chaque pixel de deplacement
          // onValuesChangeFinish={(values) => {
          //   setFilters((f) => ({
          //     ...f,
          //     minAmountFilter: values[0],
          //     maxAmountFilter: values[1],
          //   }));
          // }}

          onValuesChangeFinish={(values) => {
            const [min, max] = values.map((v) => Math.round(v));
            setFilters((f) => ({
              ...f,
              minAmountFilter: Math.min(min, max),
              maxAmountFilter: Math.max(min, max),
            }));
          }}
          selectedStyle={{
            backgroundColor: COLORS.yellow_color,
          }}
          unselectedStyle={{
            backgroundColor: COLORS.background,
          }}
          markerStyle={{
            height: 24,
            width: 24,
            borderRadius: 12,
            backgroundColor: COLORS.yellow_color,
            elevation: 3,
          }}  //style moderne des poignets
          containerStyle={{ alignSelf: "center", marginTop: 10 }}
        />
      </View>


      {/* Modales */}
      <CustomPicker
        visible={modalVisible === 'budget'}
        onClose={() => setModalVisible(null)}
        items={budgetsWithAll}
        onSelect={handleBudgetSelect}
        title="Sélectionner un Budget"
      />
      <CustomPicker
        visible={modalVisible === 'category'}
        onClose={() => setModalVisible(null)}
        items={availableCategories}
        onSelect={handleCategorySelect}
        title="Sélectionner une Catégorie"
      />

      {/* Sélecteur de date */}
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={isPickingStart ? filters.startDate : filters.endDate}
          mode="date"
          // display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          display={Platform.OS === "ios" ? "inline" : "default"}
          // display="default"
          onChange={onDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20, paddingVertical: 10, backgroundColor: COLORS.white,
    marginBottom: 10, borderRadius: 8
  },
  title: { fontFamily: FONTS.Poppins_Bold, color: COLORS.black_color, marginBottom: 10 },
  section: { marginBottom: 10 },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  inputContainer: { flex: 1, marginHorizontal: 5 },
  label: {
    fontFamily: FONTS.Poppins_Regular, fontSize: 12, color: COLORS.textPrimary, marginBottom: 1
  },
  periodGroup: { flexDirection: 'row', justifyContent: 'space-between' },
  datePickerInput: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.background, padding: 10, borderRadius: 6, flex: 1
  },
  dateText: { fontSize: 12, color: COLORS.textPrimary },
  separator: {
    marginHorizontal: 10, color: COLORS.textSecondary, fontFamily: FONTS.Poppins_SemiBold,
    alignSelf: 'center',          //  centre verticalement le "au"
    textAlignVertical: 'center',  //  utile sur Android
  },
  dropdown: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.background, paddingHorizontal: 10, borderRadius: 8, height: 40
  },
  dropdownText: { fontSize: 12, color: COLORS.textPrimary, flex: 1 },
  amountRangeDisplay: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 0 },
  amountText: { fontFamily: FONTS.Poppins_Regular, color: COLORS.textPrimary },
  subLabel: {
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginVertical: 3,
  },
  slider: { width: '100%', height: 10 },
});

const pickerStyles = StyleSheet.create({
  centeredView: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalView: {
    margin: 20, backgroundColor: 'white', borderRadius: 20, padding: 25,
    alignItems: 'center', elevation: 5, width: '80%'
  },
  modalTitle: { fontFamily: FONTS.Poppins_SemiBold, marginBottom: 10, color: COLORS.black_color },
  pickerItem: { paddingVertical: 6, borderBottomColor: COLORS.background, width: '100%' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }, // --- AJOUT ---
  iconCircle: {
    width: 28, height: 28, borderRadius: 8, justifyContent: 'center',
    alignItems: 'center', marginRight: 10
  }, // --- AJOUT ---
  pickerItemText: { fontFamily: FONTS.Poppins_Regular, fontSize: 12, color: COLORS.textPrimary },
});
