import React, { useState, useEffect, useRef } from "react";
import type { ComponentProps } from "react";
import {
  View, Text, StyleSheet, ScrollView, Platform, NativeSyntheticEvent, NativeScrollEvent,
  TouchableOpacity, Dimensions, SafeAreaView, StatusBar
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ExpenseForm from "../components/depenses/ExpenseForm";
import ExpenseList from "../components/depenses/ExpenseList";
import Toast from "../components/Toast";
import CategoryList from "../components/categorie/CategoryList";
import Spinner from "../components/Spinner";
import { COLORS, FONTS } from "../../assets/constants";
import CategoryForm1 from "../components/categorie/CategoryForm1";
import Header from "../components/layout/Header";
import CategoryPieChart from "../components/depenses/graphChart/CategoryPieChart";
import WeeklyBarChart from "../components/depenses/graphChart/WeeklyBarChart";
import ExpenseFilter from "../components/depenses/ExpenseFilter";
import { useExpenses, Expense } from "../context/ExpenseContext";
import BudgetForm from "../components/budget/BudgetForm";
import BudgetOverview from "../components/budget/BudgetOverview";
import BudgetCategorie from "../components/budget/BudgetCategorie";
import TransactionACategoriser from "../components/transactionACategoriser/TransactionACategoriser";
import { useBudget } from "../context/BudgetsContext";
import { useTranslation } from "../hooks/useTranslation";
import Dashboard from "../components/depenses/Dashboard";
import ExpenseChartLine from "../components/depenses/graphChart/ExpenseChartLine";
import BtnPus from "../components/layout/BtnPlus";

interface ToastType {
  visible: boolean;
  message: string;
  type: "success" | "warning";
  duration?: number;
}

// Types pour les onglets de navigation
type TabType = 'dashboard' | 'expenses' | 'categories' | 'budgets';

export default function ExpenseScreen() {
  const { t, language } = useTranslation();
  const {
    expenses,
    categories,
    budgets,
    deleteExpense,
    deleteCategory,
    onStopRecurring,
    generateRecurringExpenses,
    duplicateExpense,
  } = useExpenses();

  const {
    budgetData,
    updateBudgetForm,
    addBudget,
    isEditMode,
    budgetToEdit,
    onUpdateBudget,
    handleCancelEdit,
    handleEditBudget, scrollViewRef, showBudgetForm,scrollToForm,setShowBudgetForm,
    chargerBudgetsFiltres, page, itemsPerPage, selectedStatus,
  } = useBudget();

  // --- ÉTATS LOCAUX ---
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<any>(null);
  const [toast, setToast] = useState<ToastType>({ visible: false, message: "", type: "success" });
  const [loading, setLoading] = useState(false);

  // État pour la navigation par onglets ---
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // --- REFS POUR LE SCROLL ---
  const scrollOffset = useRef(0); // pour mémoriser la position avant filtrage

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffset.current = event.nativeEvent.contentOffset.y;
  };

  // --- FILTRES ---
  const [filters, setFilters] = useState(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      startDate: start,
      endDate: today,
      selectedBudget: 0,
      selectedCategory: 0,
      minAmountFilter: 0,
      maxAmountFilter: 1000000
    };
  });

  // --- FONCTION DE FILTRAGE ---
  const getFilteredExpenses = () => {
    if (!expenses?.length) return [];
    // Normalisation des dates
    const s = new Date(filters.startDate); s.setHours(0, 0, 0, 0);
    const e = new Date(filters.endDate); e.setHours(23, 59, 59, 999);

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
        if (!ex.created_at) return false;
        const d = parseApiDate(ex.created_at);

        // Filtre par période
        if (d < s || d > e) return false;
        // Filtre par montant min & max
        if (ex.montant < filters.minAmountFilter || ex.montant > filters.maxAmountFilter) return false;
        //FILTRE PAR BUDGET
        if (filters.selectedBudget && filters.selectedBudget !== 0) {
          // dépense DOIT être explicitement liée à ce budget pour être affichée.
          if (ex.IdBudget !== filters.selectedBudget) {
            return false;
          }
        }
        // Filtre par catégorie spécifique (Si AUCUN budget sélectionné ou si l'utilisateur filtre dans un budget)
        if (filters.selectedCategory && filters.selectedCategory !== 0 && ex.id_categorie_depense !== filters.selectedCategory) return false;
        return true;
      })
      //tri pour afficher les nouvelles dépenses en premier
      .sort((a, b) => Number(b.id) - Number(a.id));
  };

  const filteredExpenses = getFilteredExpenses();

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

  // Assure que le graphique reçoit des dates "propres" à minuit.
  const chartStartDate = new Date(filters.startDate);
  chartStartDate.setHours(0, 0, 0, 0);

  const chartEndDate = new Date(filters.endDate);
  chartEndDate.setHours(0, 0, 0, 0); // OUI, 0, 0, 0, 0 pour la date de fin aussi !

  // --- FONCTIONS DE NAVIGATION ---
  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    // Réinitialiser la position de défilement lorsque l'onglet change
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  //afficher le formulaire budget
  const handleShowBudgetForm = (): void =>{
    scrollToForm();
    setShowBudgetForm(true);
  }
  // --- RENDU DU CONTENU DE CHAQUE ONGLET ---
  const renderDashboardContent = () => (
    <View style={styles.tabContent}>
      {/*  tableau de bord */}
      <Dashboard />

       {/* section stat graph suivie des depenses */}
      <View style={{ marginTop: 10 }}>
        <ExpenseChartLine 
        // categories={categories}
       // expenses={filteredExpenses}
        />
      </View>

      {/* Filtres pour le tableau de bord */}
      <ExpenseFilter onFilterChange={onFilterChange} />

      {/* Graphiques de synthèse */}
      <CategoryPieChart
        categories={categories}
        expenses={filteredExpenses}
      />

      <WeeklyBarChart
        expenses={filteredExpenses}
        startDate={chartStartDate}
        endDate={chartEndDate}
      />     

    </View>
  );

  const renderExpensesContent = () => (
    <View style={styles.tabContent}>
      {/* Formulaire d'ajout de dépense (conditionnel) */}
      {showExpenseForm && (
        <ExpenseForm
          setLoading={setLoading}
          setToast={setToast}
          initialData={expenseToEdit}
          onCancel={() => { setShowExpenseForm(false); setExpenseToEdit(null); }}
        />
      )}

      {/* Bouton d'ajout de dépense */}
      {!showExpenseForm && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddExpensePress}
        >
          <MaterialCommunityIcons name="plus-circle" size={22} color="#000" />
          <Text style={styles.addButtonText}>Nouvelle dépense</Text>
        </TouchableOpacity>
      )}
      {/* Liste complète des dépenses */}
      <ExpenseList
        expenses={expenses}
        categories={categories}
        budgets={budgets}
        setLoading={setLoading}
        setToast={setToast}
      />

      {/* Transactions à catégoriser */}
      <TransactionACategoriser />
    </View>
  );

  const renderCategoriesContent = () => (
    <View style={styles.tabContent}>
      {/* Formulaire de gestion des catégories */}
      <CategoryForm1
        setLoading={setLoading}
        setToast={setToast}
        onCancel={() => { setShowCategoryForm(false); }}

      />

      {/* Liste des catégories */}
      <CategoryList
        setLoading={setLoading}
        setToast={setToast}
        categories={categories}
        onDelete={deleteCategory}
        onEdit={(id: number) => {

        }}
      />
    </View>
  );

  const renderBudgetsContent = () => (
    <View style={styles.tabContent}>

       {/* Bouton d'ajout de dépense */}
      {!showBudgetForm && (
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleShowBudgetForm}
        >
          <MaterialCommunityIcons name="plus-circle" size={22} color="#000" />
          <Text style={styles.addButtonText}>Nouveau budget</Text>
        </TouchableOpacity>
      )}

      {/* Vue d'ensemble des budgets */}
      <BudgetOverview />

      {/* Formulaire de budget */}
      {showBudgetForm &&(
        <BudgetForm
          budgetData={budgetData}
          updateBudgetForm={updateBudgetForm}
          onAddBudget={addBudget}
          isEditMode={isEditMode}
          budgetToEdit={budgetToEdit}
          onUpdateBudget={onUpdateBudget}
          onCancelEdit={handleCancelEdit}
        />
      )}
      
      {/* Détails par catégorie */}
      <BudgetCategorie onEditBudget={handleEditBudget} />
    </View>
  );

  // --- FONCTION DE RENDU DU CONTENU ACTIF ---
  const renderActiveContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardContent();
      case 'expenses':
        return renderExpensesContent();
      case 'categories':
        return renderCategoriesContent();
      case 'budgets':
        return renderBudgetsContent();
      default:
        return renderDashboardContent();
    }
  };

  // --- DÉFINITION DES ONGLETS ---
  const tabs = [
    { id: 'dashboard', label: t.header_navbar.dashbord, icon: 'view-dashboard' },
    { id: 'expenses', label: t?.expense?.title, icon: 'cash' },
    { id: 'categories', label: t.header_navbar.category, icon: 'shape' },
    { id: 'budgets', label: t.header_navbar.budget, icon: 'chart-pie' },
  ];

  return (
    // <SafeAreaView style={styles.safeContainer}>
    <>
      <StatusBar barStyle="dark-content" backgroundColor='#F0F0F0FF' />
      <View style={styles.container}>
        <Spinner visible={loading} />

        <Header show_add_button={true} on_add_expense={handleAddExpensePress} />


        {/* Barre de navigation par onglets */}
        <View style={styles.tabBarContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabItem,
                activeTab === tab.id && styles.activeTabItem
              ]}
              onPress={() => handleTabPress(tab.id as TabType)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={tab.icon as ComponentProps<typeof MaterialCommunityIcons>['name']}
                size={Platform.OS === 'ios'? 21 : 19}
                color={activeTab === tab.id ? '#fcbf00' : '#666666'}
              />
              <Text style={[
                styles.tabLabel,
                activeTab === tab.id && styles.activeTabLabel
              ]}>
                {tab.label}
              </Text>
              {activeTab === tab.id && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
        >
          {/* En-tête avec icône et titre */}
          <View style={styles.headerContainer}>
            <View style={styles.headerIconContainer}>
              <MaterialCommunityIcons name="folder-open" size={30} color="white" />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>
                {activeTab === 'dashboard' ? t.header_navbar.dashbord :
                  activeTab === 'expenses' ? t?.expense?.title :
                    activeTab === 'categories' ? t.header_navbar.category : t.header_navbar.budget}
              </Text>
              <Text style={styles.subtitle}>
                {activeTab === 'dashboard' ? t.header_navbar.text_dashbord :
                  activeTab === 'expenses' ? t?.expense?.subtitle :
                    activeTab === 'categories' ? t.header_navbar.text_category : t.header_navbar.text_budget}
              </Text>
            </View>
            {/* <View>
               <BtnPus show_add_button={true} on_add_expense={handleAddExpensePress}/>
            </View> */}
          </View>

          {/* Contenu défilant de l'onglet actif */}

          {renderActiveContent()}

          <View style={styles.bottomSpacer} />

        </ScrollView>

        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onHide={() => setToast({ ...toast, visible: false })}
        />
      </View>
    </>
    // </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F0F0F0FF'
  },

  // Styles pour l'en-tête
  headerContainer: {
    marginTop: 0,
    paddingTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 1,
    paddingBottom: 16,
  },
  headerIconContainer: {
    backgroundColor: '#fcbf00',
    borderRadius: 12,
    padding: Platform.OS === 'ios' ? 10 : 9,
    height: Platform.OS === 'ios' ? 52 : 50,
    justifyContent: 'center',
    alignItems: 'center',
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: Platform.OS === 'ios' ? 20 : 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333333',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666666',
    fontFamily: 'Poppins-Regular',
    fontSize: Platform.OS === 'ios' ? 13 : 11,
  },

  // Styles pour la barre d'onglets
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 13,
    marginBottom: 16,
    borderRadius: 6,
    paddingVertical: 8,
    // elevation: 4,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.08,
    // shadowRadius: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  activeTabItem: {
    // backgroundColor: `${'#fcbf00'}15`, // 15% d'opacité
  },
  tabLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: Platform.OS === 'ios' ? 11 : 8.5,
    marginTop: 6,
    color: '#666666',
  },
  activeTabLabel: {
    color: '#fcbf00',
    fontFamily: 'Poppins-SemiBold',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 36,
    height: 3,
    backgroundColor: '#fcbf00',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },

  // Styles pour le contenu défilant
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  // Styles pour le contenu des onglets
  tabContent: {
    marginBottom: 20,
  },

  // Styles pour le tableau de bord
  recentExpensesSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginTop: 16,
    // elevation: 3,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.05,
    // shadowRadius: 4,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 16,
  },
  recentExpenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  expenseIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `#2196F315`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#333333',
    marginBottom: 2,
  },
  expenseDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666666',
  },
  expenseAmount: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#F44336',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  viewAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#2196F3',
    marginRight: 4,
  },

  // Styles pour le bouton d'ajout
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.yellow_color,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  addButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    // color: '#FFFFFF',
    marginLeft: 8,
  },

  // Espace en bas
  bottomSpacer: {
    height: 80,
  },
});


