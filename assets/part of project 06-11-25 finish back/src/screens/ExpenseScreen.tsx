// --- IMPORTS INCHANGÉS ---
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, NativeSyntheticEvent, NativeScrollEvent, Button } from "react-native";
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
  duration?: number;
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
    onStopRecurring,
    generateRecurringExpenses,
    duplicateExpense,
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
    return { startDate: start, endDate: today, selectedBudget: 0, selectedCategory: 0, minAmountFilter: 0, maxAmountFilter: 1000000 };
  });



  // --- FONCTION DE FILTRAGE ---
  const getFilteredExpenses = () => {
    
    if (!expenses?.length) return [];
    // Normalisation des dates
    const s = new Date(filters.startDate); s.setHours(0, 0, 0, 0);
    const e = new Date(filters.endDate); e.setHours(23, 59, 59, 999);

    // Pas besoin de calculer les IDs de catégorie, on filtre directement sur l'ID du budget de la dépense.

    // fonction pour convertir la date en format 24/10/2025 [day, month, year]
    function parseApiDate(dateStr: string): Date {
      if (typeof dateStr === "string" && dateStr.includes("/")) {
        const [day, month, year] = dateStr.split("/");
        return new Date(Number(year), Number(month) - 1, Number(day));
      }
      return new Date(dateStr);
    }


    return expenses
      .filter((ex) => {
//         console.log('Filtres:', filters.selectedBudget, filters.selectedCategory);
// console.log('Dépense test:', ex.libelle, 'Budget:', ex.IdBudget, 'Cat:', ex.id_categorie_depense);
        if (!ex.created_at) return false;

        const d = parseApiDate(ex.created_at);

        // 1. Filtre par période
        if (d < s || d > e) return false;
        // 2. Filtre par montant min & max
        if (ex.montant < filters.minAmountFilter || ex.montant > filters.maxAmountFilter) return false;

        // 3. FILTRE PAR BUDGET (LOGIQUE STRICTE)
        if (filters.selectedBudget && filters.selectedBudget !== 0) {
          // La dépense DOIT être explicitement liée à ce budget pour être affichée.
          if (ex.IdBudget !== filters.selectedBudget) {
            return false;
          }
        }


        // 4. Filtre par catégorie spécifique (Si AUCUN budget sélectionné ou si l'utilisateur filtre dans un budget)
        if (filters.selectedCategory && filters.selectedCategory !== 0 && ex.id_categorie_depense !== filters.selectedCategory) return false;

        return true;
      })
      //tri pour afficher les nouvelles dépenses en premier
      .sort((a, b) => Number(b.id) - Number(a.id));
  };

  const filteredExpenses = getFilteredExpenses();

  // --- HANDLERS DÉPENSES ---
  const handleExpenseSubmit = async (expense: Expense) => { //rendre asyn pour les promises
    setLoading(true);
    if (expenses.find((e) => e.id === expense.id)) {
      setTimeout(() => {
        setLoading(false);
        updateExpense(expense);
        setToast({ visible: true, message: "Dépense modifiée", type: "success" });
      }, 1200);
    } else {
      // setTimeout(() => {
      //   setLoading(false);
      //   addExpense(expense);
      //   setToast({ visible: true, message: "Dépense ajoutée", type: "success" });
      // }, 1200);
      try {
        const result = await addExpense(expense); // await car la fonction est declarer async

        if (result.alerts && result.alerts.length > 0) {
          // Combiner les messages d'alerte
          const combinedAlerts = result.alerts
            .map((alert: any) => `- ${alert.message}`)
            .join('\n');

          // Afficher le Toast pour le dépassement
          setTimeout(() => {
            setLoading(false);
            setToast({
              visible: true,
              message: `:\n${combinedAlerts}`, //message pour stimuler le depassement de budget ou categorie
              type: "warning",
              duration: 10000 // Le Toast restera visible 8 secondes pour que l'utilisateur puisse lire
            });
          }, 1200);
        } else {
          // Ajout simple sans Alerte
          setTimeout(() => {
            setLoading(false);
            setToast({ visible: true, message: "Dépense ajoutée", type: "success" });
          }, 1200);
        }
      } catch (e) {
        // En cas d'erreur bloquante (qui a été relancée par l'API), l'alerte native 
        // a déjà été affichée par createExpenseApi, donc on peut ignorer ou log ici.
      }
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
    setTimeout(() => {
      setLoading(false);
      deleteExpense(id);
      setToast({ visible: true, message: "Dépense supprimée", type: "warning" });
    }, 1200);
  };

  // --- STOPPER UN CYCLE RÉPÉTITIF ---
  const handleStopRecurring = (id: number) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onStopRecurring(id); // Désactive la récurrence via le contexte
      setToast({ visible: true, message: "Cycle de dépense arrêté", type: "warning", });
    }, 1200);
  };


  // --- HANDLERS CATÉGORIES ---
  const handleCategorySubmit = (category: any) => {
    setLoading(true);
    if (categories.find((c) => c.id === category.id)) {
      // updateCategory(category);
      setTimeout(() => {
        setLoading(false);
        updateCategory(category); // c'est quand le loading s'arrête que la categorie est mise a jour
        setToast({ visible: true, message: "Catégorie modifiée", type: "success" });
      }, 1200);
    } else {
      //  addCategory(category);
      setTimeout(() => {
        setLoading(false);
        addCategory(category);
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
    setTimeout(() => {
      setLoading(false);
      deleteCategory(id);
      setToast({ visible: true, message: "Catégorie supprimée", type: "warning" });
    }, 1200);
  };

  // --- DUPLIQUER UNE DÉPENSE ---
  const handleExpenseDuplicate = (id: number) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      duplicateExpense(id);
      setToast({ visible: true, message: "Dépense dupliquer", type: "success" });
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

  // Pour les depenses repetitives
  useEffect(() => {
    const checkRecurringExpenses = async () => {
      const result = await generateRecurringExpenses();
      console.log("Résultat généré :", result); //debug 
      if (result.success && result.count && result.count > 0) {
        setToast({
          visible: true,
          message: `${result.count} dépense${result.count > 1 ? "s" : ""} récurrente${result.count > 1 ? "s ont" : " a"} été générée${result.count > 1 ? "s" : ""}.`,
          type: "success",
        });
      }
    };

    checkRecurringExpenses();
  }, []); // <-- S'exécute une seule fois au montage

  //test manuel dps-repetitive
  // const handleTestRecurringExpenses = async () => {
  //   try {
  //     // Appelle la fonction du contexte pour générer les dépenses récurrentes
  //     const result = await generateRecurringExpenses();

  //     // Affichage du toast
  //     if (result?.generated?.length > 0) {
  //       setToast({
  //         visible: true,
  //         message: `${result.generated.length} dépense${result.generated.length > 1 ? "s" : ""} récurrente${result.generated.length > 1 ? "s ont" : " a"} été générée${result.generated.length > 1 ? "s" : ""}.`,
  //         type: "success",
  //       });
  //     } else {
  //       setToast({
  //         visible: true,
  //         message: "Aucune dépense récurrente à générer",
  //         type: "warning",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Erreur lors du test des dépenses récurrentes :", error);
  //   }
  // };

  //ajout frontend test dps-repetitive
  // const [mockExpenses, setMockExpenses] = useState<Expense[]>([]);
  // const addTestRecurringExpenseLocal = () => {
  //   const testExpense: Expense = {
  //     id: Date.now(),
  //     libelle: "Dépense récurrente test (mock)",
  //     montant: 500,
  //     is_repetitive: 1,
  //     status_is_repetitive: 0,
  //     date_debut: new Date().toISOString(),
  //     date_fin: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
  //     id_categorie_depense: categories[0]?.id || 1,
  //     IdBudget: budgets[0]?.IdBudget || 1,
  //   };
  //   setMockExpenses((prev) => [testExpense, ...prev]);
  //   setToast({ visible: true, message: "Dépense récurrente test générée (mock)", type: "success" });
  // };


  return (
    <View style={styles.container}>
      <Spinner visible={loading} />
      <Header show_add_button={true} on_add_expense={handleAddExpensePress} />
      {/* <Button
        title="Tester dépenses récurrentes"
        onPress={handleTestRecurringExpenses}
      /> */}
      {/* <Button
        title="Ajouter dépense récurrente test"
        onPress={addTestRecurringExpenseLocal}
      /> */}

      {/* AJOUT du onScroll */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ padding: 10 }} 
      >
        {/* --- entête --- */}
        <View style={{ marginTop: 0, paddingTop: 8, flexDirection: "row", alignItems: "center", gap: 7, paddingBottom: 20, }}>
          <View style={{ backgroundColor: COLORS.yellow_color, borderRadius: 10, padding: Platform.OS == 'ios' ? 8 : 9, height: Platform.OS == 'ios' ? 50 : 49, }}>
            <MaterialCommunityIcons name="folder-open" size={30} color="white" />
          </View>
          <View>
            <Text style={styles.title}>Dépenses</Text>
            <Text style={{ color: COLORS.textSecondary, fontFamily: FONTS.Poppins_Regular, fontSize: Platform.OS == 'ios' ? 14 : 12, }}>
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
        <View >
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
        {/* <ExpenseList
          // expenses={filteredExpenses}
          categories={categories}
          budgets={budgets}
          onDelete={handleExpenseDelete}
          onEdit={handleExpenseEdit}
          onStopRecurring={handleStopRecurring}
        /> */}

        <ExpenseList
          // expenses={[...mockExpenses, ...filteredExpenses]} test manuel dps repetitive
          expenses={filteredExpenses}
          categories={categories}
          budgets={budgets}
          onDelete={handleExpenseDelete}
          onEdit={handleExpenseEdit}
          onStopRecurring={handleStopRecurring}
          onDuplicate={handleExpenseDuplicate} // nouvelle prop
        />
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
  title: {
    fontSize: Platform.OS == 'ios' ? 23 : 22,
    fontFamily: FONTS.Poppins_SemiBold
  },

});
