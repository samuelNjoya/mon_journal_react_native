import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Modal, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons, AntDesign, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, FONTS } from '../../../assets/constants';
import { useExpenses } from '../../context/ExpenseContext';
import { Category, Budget } from '../../context/ExpenseContext';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useTranslation } from '../../hooks/useTranslation';
import { useCategoryTranslation } from '../../hooks/useCategoryTranslation';

interface CustomPickerProps {
  visible: boolean;
  onClose: () => void;
  items: (Category | Budget)[];
  onSelect: (id: number) => void;
  title: string;
}

const CustomPicker: React.FC<CustomPickerProps> = ({ visible, onClose, items, onSelect, title }) => {
  const { getTranslatedCategoryName } = useCategoryTranslation();
  
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={pickerStyles.centeredView} activeOpacity={1} onPress={onClose}>
        <View style={pickerStyles.modalView} onStartShouldSetResponder={() => true}>
          <Text style={pickerStyles.modalTitle}>{title}</Text>
          <ScrollView style={{ maxHeight: 200, width: '100%' }} showsVerticalScrollIndicator={false}>
            {items.map((item) => {
              const itemId = 'IdBudget' in item ? item.IdBudget : item.id;
              const isCategoryItem = 'nom' in item;
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
                    {isCategoryItem || isAllOption ? (
                      <View style={[pickerStyles.iconCircle, { backgroundColor: item.color || COLORS.yellow_color }]}>
                        <MaterialCommunityIcons
                          name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                          size={16}
                          color="#fff"
                        />
                      </View>
                    ) : (
                      <View style={[pickerStyles.iconCircle, { backgroundColor: COLORS.yellow_color }]}>
                        <FontAwesome name="money" size={16} color="#fff" />
                      </View>
                    )}

                    <Text style={pickerStyles.pickerItemText}>
                      {'nom' in item ? getTranslatedCategoryName(item) : ('libelle' in item ? item.libelle : 'Sans nom')}
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
};

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
  const { t, locale } = useTranslation();
  const { categories, budgetsForFilter } = useExpenses();

  const today = new Date();
  const defaultStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [filters, setFilters] = useState({
    startDate: defaultStart,
    endDate: today,
    selectedBudget: 0,
    selectedCategory: 0,
    minAmountFilter: 0,
    maxAmountFilter: 1000000,
  });

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [isPickingStart, setIsPickingStart] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<'budget' | 'category' | null>(null);

  // ÉTAT POUR L'INDICATEUR DE CHARGEMENT POUR UN VISUEL
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  const budgetsWithAll = useMemo(() => [{ IdBudget: 0, libelle: t.filter_expense.all1, categories: [], icon: 'view-list', color: '#757575' }, ...budgetsForFilter], [budgetsForFilter]);
  const categoriesWithAll = useMemo(
    () => [{ id: 0, nom: t.filter_expense.all2, icon: 'view-list', color: '#757575' }, ...categories],
    [categories]
  );

  const availableCategories = useMemo(() => {
    if (filters.selectedBudget === 0) return categoriesWithAll;

    const b = budgetsForFilter.find((x) => x.id === filters.selectedBudget);
    if (!b) return categoriesWithAll;

    const budgetCategories = b.categories || [];
    const completeFilteredCategories = budgetCategories
      .map(budgetCat => categories.find(globalCat => globalCat.id === budgetCat.id))
      .filter((c): c is Category => c !== undefined);

    return [{ id: 0, nom: t.filter_expense.all2, icon: 'view-list', color: '#757575' }, ...completeFilteredCategories];
  }, [filters.selectedBudget, budgetsForFilter, categoriesWithAll, categories]);

  //  EFFET AVEC DEBOUNCE POUR LE CHARGEMENT
  useEffect(() => {
    if (onFilterChange) {
      setIsFiltering(true);
      const timer = setTimeout(() => {
        onFilterChange(filters);
        setIsFiltering(false);
      }, 700);
      
      return () => clearTimeout(timer);
    }
  }, [filters, onFilterChange]);

  const handleDatePress = (isStart: boolean) => {
    if (isFiltering) return; // Bloque pendant le filtrage
    setIsPickingStart(isStart);
    setShowDatePicker(true);
  };

  const onDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (!selectedDate) return;

    setFilters((f) => {
      let newFilters = { ...f, [isPickingStart ? 'startDate' : 'endDate']: selectedDate };
      if (newFilters.endDate < newFilters.startDate) {
        alert(t.filter_expense.alert_filter);
        return f;
      }
      return newFilters;
    });
  };

  // HANDLERS MODIFIÉS POUR BLOQUER PENDANT LE FILTRAGE
  const handleBudgetSelect = (budgetId: number) => {
    if (isFiltering) return; // Bloque pendant le filtrage
    setFilters((f) => ({ ...f, selectedBudget: budgetId, selectedCategory: 0 }));
  };

  const handleCategorySelect = (categoryId: number) => {
    if (isFiltering) return; // Bloque pendant le filtrage
    setFilters((f) => ({ ...f, selectedCategory: categoryId }));
  };

  // HANDLER POUR LE SLIDER
  const handleAmountChange = (values: number[]) => {
    if (isFiltering) return; // Bloque pendant le filtrage
    const [min, max] = values.map((v) => Math.round(v));
    setFilters((f) => ({
      ...f,
      minAmountFilter: Math.min(min, max),
      maxAmountFilter: Math.max(min, max),
    }));
  };

  const formattedDate = (date: Date) => date.toLocaleDateString(locale);

  const selectedCategoryName = categories.find((c) => c.id === filters.selectedCategory)?.nom || t.filter_expense.all2;
  const selectedBudgetName = budgetsWithAll.find((b) => b.id === filters.selectedBudget)?.libelle || t.filter_expense.all1;

  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      {/* EN-TÊTE AVEC INDICATEUR DE CHARGEMENT */}
      <View style={styles.header}>
        <Text style={styles.title}>{t.filter_expense.title}</Text>
        
        {/* INDICATEUR DE FILTRAGE */}
        {isFiltering && (
          <View style={styles.filteringIndicator}>
            <MaterialIcons name="autorenew" size={14} color={COLORS.yellow_color} />
            <Text style={styles.filteringText}>
              {t.filter_expense.filtering}
            </Text>
          </View>
        )}
      </View>

      {/* Sélection de période */}
      <View style={styles.section}>
        <Text style={styles.label}>{t.filter_expense.period}</Text>
        <View style={styles.periodGroup}>
          <TouchableOpacity 
            style={[
              styles.datePickerInput,
              isFiltering && styles.disabledInput
            ]} 
            onPress={() => handleDatePress(true)}
            disabled={isFiltering}
          >
            <Text style={styles.dateText}>{formattedDate(filters.startDate)}</Text>
            <AntDesign name="calendar" size={12} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.separator}>{t.filter_expense.to}</Text>
          <TouchableOpacity 
            style={[
              styles.datePickerInput,
              isFiltering && styles.disabledInput
            ]} 
            onPress={() => handleDatePress(false)}
            disabled={isFiltering}
          >
            <Text style={styles.dateText}>{formattedDate(filters.endDate)}</Text>
            <AntDesign name="calendar" size={12} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sélection Budget & Catégorie */}
      <View style={styles.filterRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t.expense.budget}</Text>
          <TouchableOpacity 
            style={[
              styles.dropdown,
              isFiltering && styles.disabledInput
            ]} 
            onPress={() => !isFiltering && setModalVisible('budget')}
            disabled={isFiltering}
          >
            <Text style={styles.dropdownText} numberOfLines={1}>{selectedBudgetName}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.separator_buget_categorie}></Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t.expense.category}</Text>
          <TouchableOpacity 
            style={[
              styles.dropdown,
              isFiltering && styles.disabledInput
            ]} 
            onPress={() => !isFiltering && setModalVisible('category')}
            disabled={isFiltering}
          >
            <Text style={styles.dropdownText} numberOfLines={1}>{selectedCategoryName}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filtre montant */}
      <View style={styles.section}>
        <Text style={styles.label}>{t.expense.amount}</Text>

        <View style={styles.amountRangeDisplay}>
          <Text style={styles.amountText}>
            {filters.minAmountFilter.toLocaleString(locale)} FCFA
          </Text>
          <Text style={styles.amountText}>
            {filters.maxAmountFilter.toLocaleString(locale)} FCFA
          </Text>
        </View>

        <MultiSlider
          values={[filters.minAmountFilter, filters.maxAmountFilter]}
          min={0}
          max={1000000}
          step={1000}
          sliderLength={screenWidth - 70}
          allowOverlap={false}
          snapped
          enabled={!isFiltering}
          onValuesChangeFinish={handleAmountChange}
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
            opacity: isFiltering ? 0.6 : 1,
          }}
          containerStyle={{ alignSelf: "center", marginTop: 10 }}
        />
      </View>

      {/* Modales */}
      <CustomPicker
        visible={modalVisible === 'budget'}
        onClose={() => setModalVisible(null)}
        items={budgetsWithAll}
        onSelect={handleBudgetSelect}
        title={t.expense.select_budget}
      />
      <CustomPicker
        visible={modalVisible === 'category'}
        onClose={() => setModalVisible(null)}
        items={availableCategories}
        onSelect={handleCategorySelect}
        title={t.expense.select_category}
      />

      {/* Sélecteur de date */}
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={isPickingStart ? filters.startDate : filters.endDate}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={onDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    marginBottom: 10,
    borderRadius: 8
  },
  // 🆕 STYLES POUR L'EN-TÊTE ET L'INDICATEUR
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontFamily: FONTS.Poppins_Bold,
    fontSize: 16,
    color: COLORS.black_color,
  },
  filteringIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.yellow_color,
  },
  filteringText: {
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 12,
    color: COLORS.yellow_color,
    marginLeft: 6,
  },
  disabledInput: {
    opacity: 0.6,
    backgroundColor: '#F5F5F5',
  },
  section: {
    marginBottom: 10
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 0
  },
  label: {
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 12,
    color: COLORS.textPrimary,
    marginBottom: 1
  },
  periodGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  datePickerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 6,
    flex: 1
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textPrimary
  },
  separator: {
    marginHorizontal: 4,
    color: COLORS.textSecondary,
    fontFamily: FONTS.Poppins_SemiBold,
    alignSelf: 'center',
    textAlignVertical: 'center',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    borderRadius: 6,
    height: 40
  },
  separator_buget_categorie: {
    marginHorizontal: 12,
    color: COLORS.textSecondary,
    fontFamily: FONTS.Poppins_SemiBold,
    alignSelf: 'center',
    textAlignVertical: 'center',
  },
  dropdownText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    flex: 1
  },
  amountRangeDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0
  },
  amountText: {
    fontFamily: FONTS.Poppins_Regular,
    color: COLORS.textPrimary
  },
});

const pickerStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
    width: '80%'
  },
  modalTitle: {
    fontFamily: FONTS.Poppins_SemiBold,
    marginBottom: 10,
    color: COLORS.black_color
  },
  pickerItem: {
    paddingVertical: 6,
    borderBottomColor: COLORS.background,
    width: '100%'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  pickerItemText: {
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 12,
    color: COLORS.textPrimary
  },
});