// --- IMPORTS INCHANGÉS ---
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import ExpenseForm from "../components/forms/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import Toast from "../components/Toast";
import CategoryList from "../components/CategoryList";
import Spinner from "../components/Spinner";

import { COLORS, FONTS } from "../../assets/constants";
import CategoryForm1 from "../components/forms/CategoryForm1";
import Header from "../components/Header";
import CategoryPieChart from "../components/graphChart/CategoryPieChart";
import WeeklyBarChart from "../components/graphChart/WeeklyBarChart";
import ExpenseFilter from "../components/ExpenseFilter";
import BudgetOverview from "../components/budget/BudgetOverview";

import { useExpenses, Expense } from "../../contexts/ExpenseContext";

interface ToastType {
  visible: boolean;
  message: string;
  type: "success" | "warning";
}

export default function ExpenseScreen() {
  const {
    expenses,
    categories,
    budgets,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useExpenses();

  // --- ÉTATS LOCAUX ---
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<any>(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<any>(null);

  const [toast, setToast] = useState<ToastType>({ visible: false, message: "", type: "success" });
  const [loading, setLoading] = useState(false);

  // --- REFS POUR LE SCROLL ---
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollOffset = useRef(0); // pour mémoriser la position avant filtrage

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffset.current = event.nativeEvent.contentOffset.y;
  };

  // --- FILTRES ---
  const [filters, setFilters] = useState(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return { startDate: start, endDate: today, selectedBudget: 0, selectedCategory: 0, maxAmountFilter: 1000000 };
  });

  const getFilteredExpenses = () => {
    if (!expenses?.length) return [];
    const s = new Date(filters.startDate); s.setHours(0, 0, 0, 0);
    const e = new Date(filters.endDate); e.setHours(23, 59, 59, 999);

    let allowedCategoryIds: number[] | null = null;
    if (filters.selectedBudget && filters.selectedBudget !== 0) {
      const b = budgets.find((bb) => bb.id === filters.selectedBudget);
      if (b) allowedCategoryIds = b.categoryIds;
    }

    return expenses
      .filter((ex) => {
        if (!ex.date) return false;
        const d = new Date(ex.date);
        d.setHours(12, 0, 0, 0);
        if (d < s || d > e) return false;
        if (ex.amount > filters.maxAmountFilter) return false;
        if (filters.selectedCategory && filters.selectedCategory !== 0 && ex.categoryId !== filters.selectedCategory) return false;
        if (allowedCategoryIds && !allowedCategoryIds.includes(ex.categoryId)) return false;
        return true;
      })
      //tri pour afficher les nouvelles dépenses en premier
      .sort((a, b) => Number(b.id) - Number(a.id));
  };

  const filteredExpenses = getFilteredExpenses();

  // --- HANDLERS DÉPENSES ---
  const handleExpenseSubmit = (expense: Expense) => {
    setLoading(true);
    if (expenses.find((e) => e.id === expense.id)) {
      updateExpense(expense);
      setTimeout(() => {
        setLoading(false);
        setToast({ visible: true, message: "Dépense modifiée", type: "success" });
      }, 1200);
    } else {
      addExpense(expense);
      setTimeout(() => {
        setLoading(false);
        setToast({ visible: true, message: "Dépense ajoutée", type: "success" });
      }, 1200);
    }
    setShowExpenseForm(false);
    setExpenseToEdit(null);
  };

  const handleExpenseEdit = (id: number) => {
    const exp = expenses.find((e) => e.id === id) || null;
    setExpenseToEdit(exp);
    setShowExpenseForm(true);
    setTimeout(() => scrollViewRef.current?.scrollTo({ y: 0, animated: true }), 100);
  };

  const handleExpenseDelete = (id: number) => {
    setLoading(true);
    deleteExpense(id);
    setTimeout(() => {
      setToast({ visible: true, message: "Dépense supprimée", type: "warning" });
      setLoading(false);
    }, 1200);
  };

  // --- HANDLERS CATÉGORIES ---
  const handleCategorySubmit = (category: any) => {
    setLoading(true);
    if (categories.find((c) => c.id === category.id)) {
      updateCategory(category);
      setTimeout(() => {
        setLoading(false);
        setToast({ visible: true, message: "Catégorie modifiée", type: "success" });
      }, 1200);
    } else {
      addCategory(category);
      setTimeout(() => {
        setLoading(false);
        setToast({ visible: true, message: "Catégorie ajoutée", type: "success" });
      }, 1200);
    }
    setShowCategoryForm(false);
    setCategoryToEdit(null);
  };

  const handleCategoryEdit = (id: number) => {
    const cat = categories.find((c) => c.id === id) || null;
    setCategoryToEdit(cat);
    setShowCategoryForm(true);
  };

  const handleCategoryDelete = (id: number) => {
    setLoading(true);
    deleteCategory(id);
    setTimeout(() => {
      setLoading(false);
      setToast({ visible: true, message: "Catégorie supprimée", type: "warning" });
    }, 1200);
  };

  // On ne scrolle plus à chaque re-render ! Seulement quand showExpenseForm change.
  useEffect(() => {
    if (showExpenseForm && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [showExpenseForm]);

  //Restaurer position après filtrage
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: scrollOffset.current, animated: false });
    }
  }, [filteredExpenses]); //quand le filtre change, on revient à la même position

  // --- FILTRES ---
  const onFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleAddExpensePress = () => {
    setExpenseToEdit(null);
    setShowExpenseForm(true);
    setTimeout(() => scrollViewRef.current?.scrollTo({ y: 0, animated: true }), 100);
  };

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />
      <Header show_add_button={true} on_add_expense={handleAddExpensePress} />

      {/* AJOUT du onScroll */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* --- entête --- */}
        <View style={{ marginTop: 0, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 7 }}>
          <View style={{ backgroundColor: COLORS.yellow_color, borderRadius: 10, padding: 5 }}>
            <MaterialCommunityIcons name="folder-open" size={40} color="white" />
          </View>
          <View>
            <Text style={styles.title}>Dépenses</Text>
            <Text style={{ color: COLORS.textSecondary, fontFamily: 'Poppins_400Regular', fontSize: Platform.OS == 'ios' ? 14 : 13 }}>
              Gerez et suivez vos dépenses
            </Text>
          </View>
        </View>

        {/* --- FORMULAIRE --- */}
        {showExpenseForm && (
          <ExpenseForm
            onSubmit={handleExpenseSubmit}
            initialData={expenseToEdit}
            onCancel={() => { setShowExpenseForm(false); setExpenseToEdit(null); }}
          />
        )}

        {/* --- CATÉGORIES --- */}
        <View style={styles.section}>
          <CategoryForm1
            onSubmit={handleCategorySubmit}
            initialData={categoryToEdit ?? null}
          />
          <CategoryList
            categories={categories}
            onDelete={handleCategoryDelete}
            onEdit={handleCategoryEdit} />
        </View>

        {/* --- Vue d'ensemble --- */}
        <View>
          <BudgetOverview />
        </View>

        {/* --- FILTRE --- */}
        <ExpenseFilter
          onFilterChange={onFilterChange}
        />

        {/* --- GRAPHIQUES --- */}
        <CategoryPieChart
          categories={categories}
          expenses={filteredExpenses}
        />
        <WeeklyBarChart
          expenses={filteredExpenses}
          startDate={filters.startDate}
          endDate={filters.endDate}
        />

        {/* --- LISTE DES DÉPENSES --- */}
        <View style={styles.section}>
          <ExpenseList
            expenses={filteredExpenses}
            categories={categories}
            budgets={budgets}
            onDelete={handleExpenseDelete}
            onEdit={handleExpenseEdit}
          />
        </View>
      </ScrollView>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  title: { fontSize: 20, fontFamily: FONTS.Poppins_SemiBold },
  section: { marginBottom: 10 },
});
