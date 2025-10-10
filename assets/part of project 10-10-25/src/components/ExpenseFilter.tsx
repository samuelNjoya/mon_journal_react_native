import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Modal, ScrollView } from 'react-native';
import { MaterialIcons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'; // --- AJOUT --- Import des icônes
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { COLORS, FONTS } from '../../assets/constants';
import { useExpenses } from '../../contexts/ExpenseContext';
import { Category, Budget } from '../../contexts/ExpenseContext';

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
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={pickerStyles.pickerItem}
              onPress={() => {
                onSelect(item.id);
                onClose();
              }}
            >
              <View style={pickerStyles.row}>
                {/* --- AJOUT --- Affichage des icônes pour les catégories */}
                {"icon" in item && item.icon && (
                  <View style={[pickerStyles.iconCircle, { backgroundColor: item.color || COLORS.yellow_color }]}>
                    <MaterialCommunityIcons
                      name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                      size={18}
                      color="#fff"
                    />
                  </View>
                )}
                <Text style={pickerStyles.pickerItemText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
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
    maxAmountFilter: number;
  }) => void;
}

export default function ExpenseFilter({ onFilterChange }: ExpenseFilterProps) {
  const { categories, budgets } = useExpenses();

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

  // --- AJOUT --- pour inclure "Toutes les catégories" avec icône par défaut
  const budgetsWithAll = useMemo(() => [{ id: 0, name: 'Tous', categoryIds: [] }, ...budgets], [budgets]);
  const categoriesWithAll = useMemo(
    () => [{ id: 0, name: 'Toutes', icon: 'view-list', color: '#757575' }, ...categories],
    [categories]
  );

  const availableCategories = useMemo(() => {
    if (filters.selectedBudget === 0) return categoriesWithAll;
    const b = budgets.find((x) => x.id === filters.selectedBudget);
    if (!b) return categoriesWithAll;
    const filtered = categories.filter((c) => b.categoryIds.includes(c.id));
    return [{ id: 0, name: 'Toutes', icon: 'view-list', color: '#757575' }, ...filtered];
  }, [filters.selectedBudget, budgets, categories, categoriesWithAll]);

  useEffect(() => {
    if (onFilterChange) onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleDatePress = (isStart: boolean) => {
    setIsPickingStart(isStart);
    setShowDatePicker(true);
  };

  // Validation date de début/fin
  const onDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
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

  const handleSliderChange = (value: number) => {
    setFilters((f) => ({ ...f, maxAmountFilter: value }));
  };

  const formattedDate = (date: Date) => date.toLocaleDateString('fr-FR');

  const selectedCategoryName = categories.find((c) => c.id === filters.selectedCategory)?.name || 'Toutes';
  const selectedBudgetName = budgetsWithAll.find((b) => b.id === filters.selectedBudget)?.name || 'Tous';

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
            <Text style={styles.dropdownText}>{selectedBudgetName}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Catégorie</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible('category')}>
            <Text style={styles.dropdownText}>{selectedCategoryName}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filtre montant */}
      <View style={styles.section}>
        <Text style={styles.label}>Montant</Text>
        <View style={styles.amountRangeDisplay}>
          <Text style={styles.amountText}>0 FCFA</Text>
          <Text style={styles.amountText}>{filters.maxAmountFilter.toLocaleString('fr-FR')} FCFA</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1000000}
          value={filters.maxAmountFilter}
          onSlidingComplete={handleSliderChange}
          minimumTrackTintColor={COLORS.yellow_color}
          maximumTrackTintColor={COLORS.black_color}
          thumbTintColor={COLORS.yellow_color}
          step={1000}
        />
      </View>

      {/* Modales */}
      <CustomPicker visible={modalVisible === 'budget'} onClose={() => setModalVisible(null)} items={budgetsWithAll} onSelect={handleBudgetSelect} title="Sélectionner un Budget" />
      <CustomPicker visible={modalVisible === 'category'} onClose={() => setModalVisible(null)} items={availableCategories} onSelect={handleCategorySelect} title="Sélectionner une Catégorie" />

      {/* Sélecteur de date */}
      {showDatePicker && (
        <DateTimePicker testID="dateTimePicker" value={isPickingStart ? filters.startDate : filters.endDate} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onDateChange} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: COLORS.white, marginBottom: 10, borderRadius: 8 },
  title: { fontFamily: FONTS.Poppins_Bold, color: COLORS.black_color, marginBottom: 10 },
  section: { marginBottom: 10 },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  inputContainer: { flex: 1, marginHorizontal: 5 },
  label: { fontFamily: FONTS.Poppins_Regular, fontSize: 12, color: COLORS.textPrimary, marginBottom: 1 },
  periodGroup: { flexDirection: 'row', justifyContent: 'space-between' },
  datePickerInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.background, padding: 10, borderRadius: 6, flex: 1 },
  dateText: { fontSize: 14, color: COLORS.textPrimary },
  separator: {
    marginHorizontal: 10, color: COLORS.textSecondary, fontFamily: FONTS.Poppins_SemiBold,
    alignSelf: 'center',          //  centre verticalement le "au"
    textAlignVertical: 'center',  //  utile sur Android
  },
  dropdown: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.background, paddingHorizontal: 10, borderRadius: 8, height: 40 },
  dropdownText: { fontSize: 14, color: COLORS.textPrimary, flex: 1 },
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
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { margin: 20, backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 5, width: '80%' },
  modalTitle: { fontFamily: FONTS.Poppins_SemiBold, marginBottom: 10, color: COLORS.black_color },
  pickerItem: { paddingVertical: 10, borderBottomColor: COLORS.background, width: '100%' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }, // --- AJOUT ---
  iconCircle: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 10 }, // --- AJOUT ---
  pickerItemText: { fontFamily: FONTS.Poppins_Regular, fontSize: 12, color: COLORS.textPrimary },
});
