import React, { useState, useMemo, useEffect } from "react";
import {
  ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput, Alert, Modal,
  Platform, Dimensions, ActivityIndicator
} from "react-native";
import { COLORS, FONTS } from "../../../assets/constants";
import { MaterialIcons, MaterialCommunityIcons, AntDesign, FontAwesome } from "@expo/vector-icons";
import { Expense, Category, Budget, useExpenses } from "../../context/ExpenseContext";
import ExpenseDetailModal from "./ExpenseDetailModal";
import { DataTable } from "react-native-paper";
import { useBudget } from "../../context/BudgetsContext";
import { useTranslation } from "../../hooks/useTranslation";
import { useCategoryTranslation } from "../../hooks/useCategoryTranslation";
import DateTimePicker from '@react-native-community/datetimepicker';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

// Composant CustomPicker réutilisé
const CustomPicker: React.FC<{
  visible: boolean;
  onClose: () => void;
  items: (Category | Budget)[];
  onSelect: (id: number) => void;
  title: string;
}> = ({ visible, onClose, items, onSelect, title }) => {
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

interface ExpenseListProps {
  categories: Category[];
  budgets: Budget[];
  expenses: Expense[];
  setLoading: (loading: boolean) => void;
  setToast: (toast: any) => void;
}

export default function ExpenseList({
  categories,
  budgets,
  expenses,
  setLoading,
  setToast,
}: ExpenseListProps) {
  const { t, locale } = useTranslation();
  const { getTranslatedCategoryName } = useCategoryTranslation();
  const { chargerBudgetsFiltres, page, itemsPerPage, selectedStatus } = useBudget();
  const { deleteExpense, onStopRecurring, duplicateExpense, loadExpenses, budgetsForFilter } = useExpenses();

  // États accordéon et recherche
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // États pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPageDps, setItemsPerPageDps] = useState<number>(25);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const pageOptions = [10, 25, 50, 100];

  // États chargement
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPaginationLoading, setIsPaginationLoading] = useState<boolean>(false);
  const [isFilterLoading, setIsFilterLoading] = useState<boolean>(false); // NOUVEAU : Chargement filtrage
  const [hasLoadingError, setHasLoadingError] = useState<boolean>(false);

  // États filtrage
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
    selectedBudget: 0,
    selectedCategory: 0,
    minAmountFilter: 0,
    maxAmountFilter: 1000000,
  });
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [isPickingStart, setIsPickingStart] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<'budget' | 'category' | null>(null);

  // Référence pour le timer de filtrage
  const filterTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // EFFET POUR CHARGER LES DÉPENSES QUAND L'ACCORDÉON S'OUVRE
  useEffect(() => {
    if (isExpanded) {
      loadDataFromServer();
    }
  }, [isExpanded, currentPage, itemsPerPageDps]);

  // EFFET POUR LE CHARGEMENT DE FILTRAGE
  useEffect(() => {
    // Nettoyer le timeout précédent
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }

    // Si l'accordéon est ouvert et qu'on a des filtres actifs
    if (isExpanded && (
      filters.selectedBudget !== 0 || 
      filters.selectedCategory !== 0 || 
      filters.minAmountFilter !== 0 || 
      filters.maxAmountFilter !== 1000000 ||
      searchQuery.trim() !== '' ||
      filters.startDate.getDate() !== new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDate() ||
      filters.endDate.getDate() !== new Date().getDate()
    )) {
      setIsFilterLoading(true);
      
      // Délai de 400ms pour l'effet de chargement
      filterTimeoutRef.current = setTimeout(() => {
        setIsFilterLoading(false);
      }, 400);
    }

    // Nettoyage
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [filters, searchQuery, isExpanded]);

  // FONCTION: Chargement des données
  const loadDataFromServer = async (): Promise<void> => {
    if (!isExpanded) return;

    setIsLoading(true);
    setHasLoadingError(false);

    try {
      await loadExpenses();
    } catch (error: any) {
      console.error('Erreur lors du chargement des dépenses:', error.message || error);
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

  // FONCTION: Conversion date API
  const parseApiDate = (dateStr: string): Date => {
    if (typeof dateStr === "string" && dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
    return new Date(dateStr);
  };

  // FONCTION: Filtrage complet (recherche + filtres)
  const getFilteredExpenses = () => {
    if (!expenses?.length) return [];

    // Normalisation des dates
    const s = new Date(filters.startDate); s.setHours(0, 0, 0, 0);
    const e = new Date(filters.endDate); e.setHours(23, 59, 59, 999);

    return expenses
      .filter((ex) => {
        if (!ex.created_at) return false;

        const d = parseApiDate(ex.created_at);

        // Filtre par période
        if (d < s || d > e) return false;
        // Filtre par montant min & max
        if (ex.montant < filters.minAmountFilter || ex.montant > filters.maxAmountFilter) return false;
        // Filtre par budget
        if (filters.selectedBudget && filters.selectedBudget !== 0) {
          if (ex.IdBudget !== filters.selectedBudget) return false;
        }
        // Filtre par catégorie
        if (filters.selectedCategory && filters.selectedCategory !== 0 && ex.id_categorie_depense !== filters.selectedCategory) return false;
        // Filtre par recherche texte
        if (searchQuery.trim() && !ex.libelle.toLowerCase().includes(searchQuery.toLowerCase())) return false;

        return true;
      })
      .sort((a, b) => Number(b.id) - Number(a.id));
  };

  // Mémorisation des données filtrées
  const filteredExpenses = useMemo(() => getFilteredExpenses(), [
    expenses,
    filters.startDate,
    filters.endDate,
    filters.selectedBudget,
    filters.selectedCategory,
    filters.minAmountFilter,
    filters.maxAmountFilter,
    searchQuery
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPageDps);
  const paginatedExpenses = useMemo(() => {
    const start = currentPage * itemsPerPageDps;
    return filteredExpenses.slice(start, start + itemsPerPageDps);
  }, [currentPage, filteredExpenses, itemsPerPageDps]);

  const startIndex = currentPage * itemsPerPageDps + 1;
  const endIndex = Math.min(startIndex + paginatedExpenses.length - 1, filteredExpenses.length);
  const totalItems = filteredExpenses.length;

  // Gestion pagination
  const handlePageChange = async (page: number) => {
    setIsPaginationLoading(true);
    setCurrentPage(page);
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsPaginationLoading(false);
  };

  const handleSelectValue = async (value: number) => {
    setIsPaginationLoading(true);
    setItemsPerPageDps(value);
    setCurrentPage(0);
    setDropdownVisible(false);
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsPaginationLoading(false);
  };

  // HANDLERS Filtrage
  const handleDatePress = (isStart: boolean) => {
    if (isFilterLoading) return;
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

  const handleBudgetSelect = (budgetId: number) => {
    setFilters((f) => ({ ...f, selectedBudget: budgetId, selectedCategory: 0 }));
  };

  const handleCategorySelect = (categoryId: number) => {
    setFilters((f) => ({ ...f, selectedCategory: categoryId }));
  };

  const handleAmountChange = (values: number[]) => {
    const [min, max] = values.map((v) => Math.round(v));
    setFilters((f) => ({
      ...f,
      minAmountFilter: Math.min(min, max),
      maxAmountFilter: Math.max(min, max),
    }));
  };

  // HANDLER Recherche avec délai
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  // Préparation des données pour les sélecteurs
  const budgetsWithAll = useMemo(() => [
    { IdBudget: 0, libelle: t.filter_expense.all1, categories: [], icon: 'view-list', color: '#757575' },
    ...budgetsForFilter
  ], [budgetsForFilter, t.filter_expense.all1]);

  const categoriesWithAll = useMemo(() => [
    { id: 0, nom: t.filter_expense.all2, icon: 'view-list', color: '#757575' },
    ...categories
  ], [categories, t.filter_expense.all2]);

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

  const formattedDate = (date: Date) => date.toLocaleDateString(locale);
  const selectedCategoryName = availableCategories.find((c) => c.id === filters.selectedCategory)?.nom || t.filter_expense.all2;
  const selectedBudgetName = budgetsWithAll.find((b) => b.id === filters.selectedBudget)?.libelle || t.filter_expense.all1;
  const screenWidth = Dimensions.get("window").width;

  // HANDLERS Dépenses (inchangés)
  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await deleteExpense(id);
      setToast({ visible: true, message: t.toast_expense_category.expense_deleted, type: "success" });
      chargerBudgetsFiltres(page, itemsPerPage, selectedStatus);
    } catch (e) {
      console.error("Échec de la suppression de la dépense:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleStopRecurring = async (id: number) => {
    setLoading(true);
    try {
      await onStopRecurring(id);
      setToast({ visible: true, message: t.toast_expense_category.expense_cycle_stopped, type: "warning" });
      chargerBudgetsFiltres(page, itemsPerPage, selectedStatus);
    } catch (e) {
      console.error("Échec de l'arrêt de la récurrence:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (id: number) => {
    setLoading(true);
    try {
      await duplicateExpense(id);
      setToast({ visible: true, message: t.toast_expense_category.expense_duplicate, type: "success" });
      chargerBudgetsFiltres(page, itemsPerPage, selectedStatus);
    } catch (e) {
      console.error("Échec de la duplication de la dépense:", e);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: number) => {
    Alert.alert(t.expense.delete, t.expense.delete_confirmation, [
      { text: t.operation_crud_and_other.concel },
      { text: t.operation_crud_and_other.yes, onPress: () => handleDelete(id), style: "destructive" },
    ]);
  };

  const confirmStopRecurring = (id: number) => {
    const item = expenses.find((e) => e.id === id);
    if (!item) return;
    Alert.alert(
      t.expense.stop_recurring,
      t.expense.stop_recurring_confirmation,
      [
        { text: t.operation_crud_and_other.concel },
        { text: t.operation_crud_and_other.yes, style: "destructive", onPress: () => handleStopRecurring(id) },
      ]
    );
  };

  const confirmDuplicate = (id: number) => {
    const item = expenses.find((e) => e.id === id);
    if (!item) return;
    Alert.alert(
      t.expense.duplicate,
      t.expense.duplicate_confirmation,
      [
        { text: t.operation_crud_and_other.concel },
        { text: t.operation_crud_and_other.yes, onPress: () => handleDuplicate(id) },
      ]
    );
  };

  return (
    <View style={styles.accordionContainer}>
      {/* EN-TÊTE */}
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        disabled={isLoading || isFilterLoading}
      >
        <Text style={styles.accordionTitle}>{t.expense.expense_history}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {isLoading && (
            <MaterialIcons name="hourglass-empty" size={16} color={COLORS.yellow_color} />
          )}
          {isFilterLoading && !isLoading && (
            <MaterialIcons name="autorenew" size={16} color={COLORS.yellow_color} />
          )}
          {/* <MaterialIcons
            name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={24}
            color={COLORS.textPrimary}
          /> */}
        </View>
      </TouchableOpacity>

      {/* {isExpanded && ( */}
        <View style={styles.accordionContent}>
          {/* BARRE DE RECHERCHE ET BOUTON FILTRES */}
          <View style={styles.searchFilterRow}>
            <TextInput
              style={[styles.searchInput, isFilterLoading && styles.disabledInput]}
              placeholder={t.expense.search_placeholder}
              value={searchQuery}
              onChangeText={handleSearchChange}
              placeholderTextColor={COLORS.textSecondary}
              editable={!isFilterLoading}
            />
            <View style={styles.filterToggleButtonContain}>
              <TouchableOpacity
                style={[
                  styles.filterToggleButton, 
                  showFilters && styles.filterToggleButtonActive,
                  isFilterLoading && styles.disabledInput
                ]}
                onPress={() => !isFilterLoading && setShowFilters(!showFilters)}
                disabled={isFilterLoading}
              >
                <MaterialIcons
                  name="filter-list"
                  size={20}
                  color={showFilters ? COLORS.yellow_color : COLORS.textSecondary}
                />
                {Object.values(filters).some(val =>
                  (typeof val === 'number' && val !== 0) ||
                  (val instanceof Date && val.getDate() !== new Date().getDate())
                ) && (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>{t.filter_expense.title}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* FILTRES (AFFICHAGE CONDITIONNEL) */}
          {showFilters && (
            <View style={[styles.filtersContainer, isFilterLoading && styles.disabledInput]}>
              {/* Période */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>{t.filter_expense.period}</Text>
                <View style={styles.periodGroup}>
                  <TouchableOpacity
                    style={[styles.datePickerInput, isFilterLoading && styles.disabledInput]}
                    onPress={() => handleDatePress(true)}
                    disabled={isFilterLoading}
                  >
                    <Text style={[styles.dateText, isFilterLoading && { color: COLORS.textSecondary }]}>
                      {formattedDate(filters.startDate)}
                    </Text>
                    <AntDesign name="calendar" size={12} color={isFilterLoading ? COLORS.textSecondary : COLORS.textPrimary} />
                  </TouchableOpacity>
                  <Text style={styles.separator}>{t.filter_expense.to}</Text>
                  <TouchableOpacity
                    style={[styles.datePickerInput, isFilterLoading && styles.disabledInput]}
                    onPress={() => handleDatePress(false)}
                    disabled={isFilterLoading}
                  >
                    <Text style={[styles.dateText, isFilterLoading && { color: COLORS.textSecondary }]}>
                      {formattedDate(filters.endDate)}
                    </Text>
                    <AntDesign name="calendar" size={12} color={isFilterLoading ? COLORS.textSecondary : COLORS.textPrimary} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Budget & Catégorie */}
              <View style={styles.filterRow}>
                <View style={styles.filterInputContainer}>
                  <Text style={styles.filterLabel}>{t.expense.budget}</Text>
                  <TouchableOpacity
                    style={[styles.filterDropdown, isFilterLoading && styles.disabledInput]}
                    onPress={() => !isFilterLoading && setModalVisible('budget')}
                    disabled={isFilterLoading}
                  >
                    <Text style={[styles.filterDropdownText, isFilterLoading && { color: COLORS.textSecondary }]} numberOfLines={1}>
                      {selectedBudgetName}
                    </Text>
                    <MaterialIcons 
                      name="keyboard-arrow-down" 
                      size={20} 
                      color={isFilterLoading ? COLORS.textSecondary : COLORS.textPrimary} 
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.filterInputContainer}>
                  <Text style={styles.filterLabel}>{t.expense.category}</Text>
                  <TouchableOpacity
                    style={[styles.filterDropdown, isFilterLoading && styles.disabledInput]}
                    onPress={() => !isFilterLoading && setModalVisible('category')}
                    disabled={isFilterLoading}
                  >
                    <Text style={[styles.filterDropdownText, isFilterLoading && { color: COLORS.textSecondary }]} numberOfLines={1}>
                      {selectedCategoryName}
                    </Text>
                    <MaterialIcons 
                      name="keyboard-arrow-down" 
                      size={20} 
                      color={isFilterLoading ? COLORS.textSecondary : COLORS.textPrimary} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Montant */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>{t.expense.amount}</Text>
                <View style={styles.amountRangeDisplay}>
                  <Text style={[styles.amountText, isFilterLoading && { color: COLORS.textSecondary }]}>
                    {filters.minAmountFilter.toLocaleString(locale)} FCFA
                  </Text>
                  <Text style={[styles.amountText, isFilterLoading && { color: COLORS.textSecondary }]}>
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
                  enabled={!isFilterLoading}
                  onValuesChangeFinish={handleAmountChange}
                  selectedStyle={{ 
                    backgroundColor: isFilterLoading ? '#D1D5DB' : COLORS.yellow_color 
                  }}
                  unselectedStyle={{ backgroundColor: COLORS.background }}
                  markerStyle={{
                    height: 15,
                    width: 20,
                    borderRadius: 10,
                    backgroundColor: isFilterLoading ? '#D1D5DB' : COLORS.yellow_color,
                    elevation: 2,
                  }}
                  containerStyle={{ alignSelf: "center", marginTop: 0 }}
                />
              </View>
            </View>
          )}

          {/* RÉSUMÉ DES FILTRES ACTIFS */}
          {/* {(filters.selectedBudget !== 0 || filters.selectedCategory !== 0 ||
            filters.minAmountFilter !== 0 || filters.maxAmountFilter !== 1000000) && (
            <View style={styles.activeFiltersContainer}>
              <Text style={styles.activeFiltersTitle}>
                <MaterialIcons name="filter-alt" size={14} /> Filtres actifs:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activeFiltersScroll}>
                <View style={styles.activeFiltersRow}>
                  {filters.selectedBudget !== 0 && (
                    <View style={styles.activeFilterTag}>
                      <Text style={styles.activeFilterText}>
                        Budget: {selectedBudgetName}
                      </Text>
                    </View>
                  )}
                  {filters.selectedCategory !== 0 && (
                    <View style={styles.activeFilterTag}>
                      <Text style={styles.activeFilterText}>
                        Catégorie: {selectedCategoryName}
                      </Text>
                    </View>
                  )}
                  {(filters.minAmountFilter !== 0 || filters.maxAmountFilter !== 1000000) && (
                    <View style={styles.activeFilterTag}>
                      <Text style={styles.activeFilterText}>
                        Montant: {filters.minAmountFilter.toLocaleString(locale)} - {filters.maxAmountFilter.toLocaleString(locale)} FCFA
                      </Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>
          )} */}

          {/* PAGINATION SELECTOR */}
          <View style={styles.paginationSelectorContainer}>
            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', gap: 3 }}>
              <MaterialCommunityIcons name="table-large" size={20} color={COLORS.textSecondary} />
              <Text style={styles.selectorLabel}>
                {t.expense.title} : {String(startIndex)} – {String(endIndex)} {t.operation_crud_and_other.on} {String(totalItems)}
              </Text>
            </View>

            <View>
              <TouchableOpacity
                style={[styles.customSelect, isFilterLoading && styles.disabledInput]}
                onPress={() => !isFilterLoading && setDropdownVisible(!dropdownVisible)}
                disabled={isPaginationLoading || isLoading || isFilterLoading}
              >
                <Text style={[styles.customSelectText, isFilterLoading && { color: COLORS.textSecondary }]}>
                  {itemsPerPageDps}
                </Text>
                <MaterialIcons 
                  name="arrow-drop-down" 
                  size={20} 
                  color={isFilterLoading ? COLORS.textSecondary : COLORS.textPrimary} 
                />
              </TouchableOpacity>

              {dropdownVisible && (
                <View style={styles.dropdownOptions}>
                  {pageOptions.map((value) => (
                    <TouchableOpacity
                      key={value}
                      style={styles.dropdownOption}
                      onPress={() => handleSelectValue(value)}
                      disabled={isFilterLoading}
                    >
                      <Text style={styles.dropdownOptionText}>{String(value)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* CONTENU PRINCIPAL */}
          <View style={[
            styles.listContainer,
            (isLoading || isPaginationLoading || isFilterLoading) && styles.contentBlurred
          ]}>
            <ScrollView nestedScrollEnabled style={styles.list} showsVerticalScrollIndicator={false}>
              {isLoading ? (
                <View style={styles.loadingInList}>
                  <MaterialIcons name="hourglass-empty" size={40} color={COLORS.yellow_color} />
                  <Text style={styles.loadingText}>{t.expense.loading_expenses}</Text>
                  <Text style={styles.loadingSubText}>{t.operation_crud_and_other.please_wait}</Text>
                </View>
              ) : isFilterLoading ? (
                // CHARGEMENT PENDANT LE FILTRAGE
                <View style={styles.loadingInList}>
                  <MaterialIcons name="hourglass-empty" size={40} color={COLORS.yellow_color} />
                  <Text style={styles.loadingText}>{t.expense.loading_expenses}</Text>
                  <Text style={styles.loadingSubText}>{t.operation_crud_and_other.please_wait}</Text>
                </View>
              ) : hasLoadingError ? (
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
              ) : paginatedExpenses.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialIcons name="info-outline" size={50} color="#BDC3C7" />
                  <Text style={styles.emptyText}>
                    {searchQuery || Object.values(filters).some(val =>
                      (typeof val === 'number' && val !== 0) ||
                      (val instanceof Date && val.getDate() !== new Date().getDate())
                    ) ? t.expense.no_expenses_found : t.expense.no_expenses_save}
                  </Text>
                  {(searchQuery || Object.values(filters).some(val => val !== 0)) && (
                    <TouchableOpacity
                      style={styles.clearFiltersButton}
                      onPress={() => {
                        setSearchQuery('');
                        setFilters({
                          startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                          endDate: new Date(),
                          selectedBudget: 0,
                          selectedCategory: 0,
                          minAmountFilter: 0,
                          maxAmountFilter: 1000000,
                        });
                      }}
                    >
                      <Text style={styles.clearFiltersText}>
                        {/* <MaterialIcons name="clear" size={14} />  */}
                        {t.filter_expense.reset_filter}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View pointerEvents={(isPaginationLoading || isFilterLoading) ? "none" : "auto"}>
                  {paginatedExpenses.map((item) => {
                    const cat = categories.find((c) => c.id === item.id_categorie_depense);
                    const budget = budgets.find((b) => b.id === item.IdBudget);
                    const isRecurringActive = item.status_is_repetitive === 0;

                    return (
                      <TouchableOpacity key={item.id} onPress={() => setSelectedExpense(item)} activeOpacity={0.9}>
                        <View style={[styles.item, !!item.is_repetitive && styles.recurringItem]}>
                          <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                              <View style={styles.left}>
                                <View
                                  style={[
                                    styles.catIconWrapper,
                                    { backgroundColor: cat?.color ?? COLORS.lightGray },
                                  ]}
                                >
                                  <MaterialCommunityIcons
                                    name={(cat?.icon ?? "account-group") as any}
                                    size={26}
                                    color="#fff"
                                  />
                                </View>

                                <View style={{ flex: 1, justifyContent: "center", gap: 3 }}>
                                  <Text style={styles.label}>{item.libelle || "Sans libellé"}</Text>
                                  <Text style={styles.infoLine}>
                                    {String(item.created_at || "")} • {String(cat ? getTranslatedCategoryName(cat) : "Inconnue")}
                                  </Text>
                                </View>
                              </View>

                              <View style={styles.right}>
                                <Text style={styles.amount}>
                                  - {Number(item.montant ?? 0).toLocaleString(locale)} FCFA
                                </Text>

                                <View style={styles.actions}>
                                  {!!item.is_repetitive && item.status_is_repetitive !== 2 && (
                                    <TouchableOpacity
                                      onPress={() => confirmStopRecurring(item.id)}
                                      disabled={!isRecurringActive || item.status_is_repetitive === 2 || isFilterLoading}
                                      style={[
                                        styles.actionButton,
                                        {
                                          backgroundColor: isRecurringActive ? "#E6FCE6" : "#F8E6E6",
                                        },
                                      ]}
                                    >
                                      <MaterialCommunityIcons
                                        name="autorenew"
                                        size={18}
                                        color={
                                          isRecurringActive ? COLORS.greenColor : COLORS.error
                                        }
                                      />
                                    </TouchableOpacity>
                                  )}

                                  <TouchableOpacity 
                                    onPress={() => confirmDuplicate(item.id)}
                                    disabled={isFilterLoading}
                                  >
                                    <MaterialCommunityIcons 
                                      name="content-copy" 
                                      size={18} 
                                      color={isFilterLoading ? COLORS.textSecondary : COLORS.black_color} 
                                    />
                                  </TouchableOpacity>

                                  <TouchableOpacity 
                                    onPress={() => confirmDelete(item.id)}
                                    disabled={isFilterLoading}
                                  >
                                    <MaterialIcons 
                                      name="delete" 
                                      size={18} 
                                      color={isFilterLoading ? COLORS.textSecondary : COLORS.error} 
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </ScrollView>
          </View>

          {/* PAGINATION */}
          <DataTable.Pagination
            page={currentPage}
            numberOfPages={totalPages}
            onPageChange={handlePageChange}
            label={`${t.operation_crud_and_other.page} ${currentPage + 1} ${t.operation_crud_and_other.on} ${totalPages}`}
            showFastPaginationControls
            style={[styles.pagination, isFilterLoading && { opacity: 0.6 }]}
            disabled={isFilterLoading}
          />

          {/* MODALS */}
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

          {/* DATETIME PICKER */}
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={isPickingStart ? filters.startDate : filters.endDate}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={onDateChange}
            />
          )}

          {/* MODAL DÉTAILS DÉPENSE */}
          <ExpenseDetailModal
            visible={!!selectedExpense}
            expense={selectedExpense}
            category={categories.find((c) => c.id === selectedExpense?.id_categorie_depense) ?? null}
            budget={budgets.find((b) => b.id === selectedExpense?.IdBudget) ?? null}
            onClose={() => setSelectedExpense(null)}
          />
        </View>
      {/* )} */}
    </View>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  accordionContainer: { borderRadius: 8, marginBottom: 10, marginTop: 10 },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    paddingTop: 8,
  },

  // Barre recherche et bouton filtre
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    color: COLORS.black_color,
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 13,
  },
  filterToggleButtonContain: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterToggleButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterToggleButtonActive: {
    borderColor: COLORS.yellow_color,
    backgroundColor: '#FFF9E6',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.yellow_color,
    width: 38,
    height: 18,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: COLORS.white,
    fontSize: 8,
    fontFamily: FONTS.Poppins_Bold,
  },
  disabledInput: {
    opacity: 0.6,
    backgroundColor: '#F5F5F5',
  },

  // Conteneur filtres
  filtersContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterSection: {
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
  },
  filterInputContainer: {
    flex: 1,
  },
  filterLabel: {
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 11,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  periodGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePickerInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontFamily: FONTS.Poppins_Regular,
  },
  separator: {
    marginHorizontal: 6,
    color: COLORS.textSecondary,
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 12,
  },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    height: 38,
  },
  filterDropdownText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontFamily: FONTS.Poppins_Regular,
    flex: 1,
  },
  amountRangeDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  amountText: {
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 11,
    color: COLORS.textPrimary,
  },

  // Filtres actifs
  activeFiltersContainer: {
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.blueColor,
  },
  activeFiltersTitle: {
    fontFamily: FONTS.Poppins_SemiBold,
    fontSize: 11,
    color: COLORS.blueColor,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeFiltersScroll: {
    flexGrow: 0,
  },
  activeFiltersRow: {
    flexDirection: 'row',
    gap: 6,
  },
  activeFilterTag: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  activeFilterText: {
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 10,
    color: COLORS.textSecondary,
  },

  // Pagination selector
  paginationSelectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 8,
  },
  selectorLabel: {
    fontSize: 11,
    color: COLORS.textPrimary,
    fontFamily: FONTS.Poppins_Regular,
  },
  customSelect: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  customSelectText: {
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 12,
    color: COLORS.black_color,
  },
  dropdownOptions: {
    position: "absolute",
    top: 35,
    width: 55,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 6,
    zIndex: 1000
  },
  dropdownOption: {
    paddingVertical: 6,
    alignItems: "center"
  },
  dropdownOptionText: {
    fontSize: 12,
    color: COLORS.textPrimary
  },

  // Contenu principal
  listContainer: {
    flex: 1,
  },
  contentBlurred: {
    opacity: 0.6,
  },
  list: {
    maxHeight: 420
  },
  pagination: {
    borderTopWidth: 1,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
    paddingVertical: 3,
    justifyContent: "space-between",
    alignItems: "center",
  },

  // Items dépenses
  item: {
    backgroundColor: COLORS.bg_item,
    flexDirection: "row",
    marginTop: 8,
    padding: 12,
    borderRadius: 10,
  },
  recurringItem: {},
  left: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  right: {
    flex: 1,
    alignItems: "flex-end"
  },
  catIconWrapper: {
    width: 48,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: FONTS.Poppins_Medium,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  infoLine: {
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 12,
    color: COLORS.black_color,
  },
  amount: {
    fontFamily: FONTS.Poppins_SemiBold,
    fontSize: 12,
    color: COLORS.error,
    marginBottom: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  actionButton: {
    borderRadius: 6,
    padding: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // État vide
  emptyState: {
    alignItems: 'center',
    padding: 55,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginVertical: 10,
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    paddingHorizontal: 20,
    color: COLORS.textSecondary,
    fontStyle: "italic",
    fontSize: 13,
  },
  clearFiltersButton: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.yellow_color,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clearFiltersText: {
    fontFamily: FONTS.Poppins_Medium,
    fontSize: 12,
    color: COLORS.black_color,
  },

  // Chargement normal
  loadingInList: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginVertical: 10,
  },
  // Chargement filtrage
  filterLoadingInList: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
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

  // Erreurs
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
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
    color: COLORS.black_color,
    fontSize: 16,
  },
  pickerItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
    fontSize: 13,
    color: COLORS.textPrimary
  },
});