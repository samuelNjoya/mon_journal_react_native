import React, { useState, useEffect, JSX, useMemo } from "react";
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Image, Platform, FlatList, Modal, TouchableWithoutFeedback, Switch, Alert, } from "react-native";
import { COLORS, FONTS } from "../../../assets/constants";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Category } from "../../context/ExpenseContext";
import { Expense, } from "../../context/ExpenseContext";
import { useBudget } from "../../context/BudgetsContext"; // Pour recharger les budgets après ajout
import { useExpenses } from "../../context/ExpenseContext";
import { validateExpenseForm } from "../../utils/validationExpense";
import { useTranslation } from "../../hooks/useTranslation";
import { useCategoryTranslation } from "../../hooks/useCategoryTranslation";

// Définir le type Toast ici s'il n'est pas exporté
interface ToastType {
  visible: boolean;
  message: string;
  type: "success" | "warning";
  duration?: number;
}

interface ExpenseFormProps {
  // onSubmit: (expense: Expense) => void; // callback quand on valide
  onCancel: () => void;                 // callback quand on ferme
  // categories: Category[];               // liste des catégories dispo je ne passe plus les categories en props je les recupere une fois depuis le contexte
  initialData?: Expense | null;         // pour l’édition
  // AJOUTER
  setLoading: (loading: boolean) => void;
  setToast: (toast: ToastType) => void;
}

// -------- Début du composant ExpenseForm --------
export default function ExpenseForm({ initialData = null, setLoading, setToast, onCancel }: ExpenseFormProps) {
  const { t, language } = useTranslation();
  const { getTranslatedCategoryName } = useCategoryTranslation(); 
  // --- HOOKS À AJOUTER ---
  const {
    expenses, // pour vérifier l'édition
    addExpense,
    updateExpense
  } = useExpenses();

  const {
    chargerBudgetsFiltres,
    page,
    itemsPerPage,
    selectedStatus
  } = useBudget();

  const { categories, budgets } = useExpenses() // recuperer les categories et budget depuis le contexte

  const [amount, setAmount] = useState<number>(0);
  const [label, setLabel] = useState<string>("");
  const [category, setCategory] = useState<number | null>(null); //number car j'utilise categoryId dans expense qui est un number

  // Champs date début et fin
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState<boolean>(false);
  const [showEndPicker, setShowEndPicker] = useState<boolean>(false);

  // Image de pièce jointe
  const [image, setImage] = useState<string | null>(null);

  // Toggle dépense répétitive
  //const [isRecurring, setIsRecurring] = useState<number>(0);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  // Sélection budget
  const [budget, setBudget] = useState<number | null>(null); // IdBudget


  const [budgetModalVisible, setBudgetModalVisible] = useState<boolean>(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState<boolean>(false);




  // --- Filtrage dynamique des catégories selon le budget choisi ---
  const availableCategoriesBudget = useMemo(() => {
    const currentBudget = budgets.find((b) => b.id === budget);

    if (currentBudget && currentBudget.id !== 0) {
      // Ne garder que les catégories liées à ce budget
      // ===> on map maintenant sur currentBudget.categories qui est un tableau d'objets Category
      const budgetCategoryIds = currentBudget.categories?.map((cat: Category) => cat.id) || [];
      return categories.filter((c) => budgetCategoryIds.includes(c.id));
    }

    // Sinon afficher toutes les catégories
    return categories;
  }, [budget, budgets, categories]);


  //modal pour faire apparaitre le formulaire d'ajout d'une depense
  const renderModalDropdown = (
    visible: boolean,                           // si le modal est affiché
    setVisible: React.Dispatch<React.SetStateAction<boolean>>, // setter du state
    data: any[],              // peut être BudgetItem[] OU Category[]
    selectedValue: string | number | null,      // valeur sélectionnée
    onSelect: (value: string | number) => void  // callback de sélection
  ) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setVisible(false)}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <FlatList
                data={data}
                // UPDATED keyExtractor to be robust for both shapes
                keyExtractor={(item) => (item.value?.toString?.() || item.id?.toString?.() || item.name || Math.random().toString())}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      // item.value === selectedValue && styles.optionSelected,
                      // item.value for dropdown-items, item.id for categories
                      ((item.value !== undefined ? item.value : item.id) === selectedValue) && styles.optionSelected,
                    ]}
                    onPress={() => {
                      // onSelect(item.value);
                      // setVisible(false);
                      // select value depending on shape
                      const value = item.value !== undefined ? item.value : item.id;
                      onSelect(value);
                      setVisible(false);
                    }}
                  >
                    {/* <Text>{item.label}</Text> */}

                    {/* NEW: si l'item est une Category (a des champs icon & color) on affiche icone + texte */}
                    {/* {item.icon && item.color ? ( */}
                    {(item.type === 0 || item.type === 1) ? (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <View style={[styles.optionIconWrapper, { backgroundColor: item.color }]}>
                          <MaterialCommunityIcons name={item.icon} size={16} color="#fff" />
                        </View>
                        {/* <Text style={styles.optionLabel}>{item.nom}</Text> */}
                        <Text style={styles.optionLabel}>{getTranslatedCategoryName(item)}</Text>
                      </View>
                    ) : (
                      // Sinon (budget, etc.) on affiche le label simple
                      //  Cas budget : une seule icône pour tous les budgets
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <View style={[styles.optionIconWrapper, { backgroundColor: COLORS.yellow_color }]}>
                          {/* <MaterialCommunityIcons name="wallet-outline" size={16} color="#fff" /> */}
                          <FontAwesome name="money" size={16} color="#fff" />
                        </View>
                        <Text style={styles.optionLabel}>{item.libelle}</Text>
                        {/* <Text style={styles.optionLabel}>{item.label}</Text> */}
                      </View>

                    )}

                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );



  const selectorButton = (label: string, open: boolean, onPress: () => void) => (
    <TouchableOpacity style={styles.selectorButton} onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {/* {icon && icon} */}
        <Text
          style={{
            fontFamily: FONTS.Poppins_Regular,
            fontSize: 10,
            color: COLORS.textSecondary,
          }}
        >
          {label}

        </Text>
      </View>
      <Text style={{ fontSize: 12, transform: [{ rotate: open ? "180deg" : "0deg" }] }}>
        {"\u25BC"}   {/* flèche ▼ */}
      </Text>
    </TouchableOpacity>
  );

  const [categoryItems, setCategoryItems] = useState(
    categories.map((cat) => ({ label: cat.nom, value: cat.id }))
  );

  // UPDATED: keep categoryItems in sync if categories prop changes
  useEffect(() => {
    setCategoryItems(categories.map((cat) => ({ label: cat.nom, value: cat.id })));
  }, [categories]);

  // Pré-remplir le formulaire si on édite une dépense existante
  // useEffect(() => {
  //   if (initialData) {
  //     setAmount(Number(initialData.amount));
  //     setLabel(initialData.label);
  //     setCategory(initialData.categoryId);
  //     if (initialData.startDate) setStartDate(new Date(initialData.startDate));
  //     if (initialData.endDate) setEndDate(new Date(initialData.endDate));
  //     if (initialData.budgetId) setBudget(initialData.budgetId);
  //     if (initialData.image) setImage(initialData.image);
  //     if (initialData.isRecurring) setIsRecurring(initialData.isRecurring);
  //   }
  // }, [initialData]);

  useEffect(() => {
    if (initialData) {
      setAmount(Number(initialData.montant));
      setLabel(initialData.libelle);
      setCategory(initialData.id_categorie_depense);
      if (initialData.IdBudget) setBudget(initialData.IdBudget);
      // Dates pour dépense récurrente
      if (initialData.date_debut) setStartDate(new Date(initialData.date_debut));
      if (initialData.date_fin) setEndDate(new Date(initialData.date_fin));
      // Image / pièce jointe
      if (initialData.piece_jointe) setImage(initialData.piece_jointe);
      // Récurrence
      if (initialData.is_repetitive) setIsRecurring(initialData.is_repetitive === 1);
      //if (initialData.status_is_repetitive) setIsRecurringActive(initialData.status_is_repetitive === 1 || initialData.status_is_repetitive === true);
    }
  }, [initialData]);


  // Fonction pour sélectionner une image
  const pickImage = async () => {
    let res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!res.canceled) {
      setImage(res.assets?.[0]?.uri || null);
    }
  };



  // --- HANDLERS DÉPENSES ---
  const handleExpenseSubmit = async () => {
    // ... (construction de expenseData et validation)
    const expenseData: Expense = {
      id: initialData?.id || 0,
      libelle: label.trim(),
      montant: amount,
      id_categorie_depense: category!,
      IdBudget: budget ?? null,
      piece_jointe: image ?? null,
      is_repetitive: isRecurring ? 1 : 0,
      status_is_repetitive: isRecurring ? 0 : undefined,
      date_debut: isRecurring ? startDate.toISOString().split("T")[0] : null,
      date_fin: isRecurring ? endDate.toISOString().split("T")[0] : null,
      created_at: initialData?.created_at || new Date().toISOString().split("T")[0],
    };

    // Validation avant enregistrement
    const error = validateExpenseForm(expenseData,t.toast_validation_messages);
    if (error) {
      Alert.alert(t.operation_crud_and_other.validation_error, error);
      return;
    }
    // --- LOGIQUE DE SOUMISSION CORRIGÉE ET SIMPLIFIÉE ---
    setLoading(true);

    // Logique d'édition (Peut-être simplifiée, mais on la garde asynchrone pour la cohérence)
    if (expenses.find((e) => e.id === expenseData.id)) {
      try {
        // Pas de setTimeout ! On attend simplement la fin de l'opération
        await updateExpense(expenseData);
        setToast({ visible: true, message: "Dépense modifiée", type: "success" });
      } catch (error) {
        // L'erreur est gérée par le service, on ne fait rien de spécial ici
        console.error("Erreur modification:", error);
      } finally { 
        setLoading(false);
      }

    }
    // 2. Logique d'ajout (La plus critique)
    else {
      try {
        const result = await addExpense(expenseData); // Arrête ici en cas d'erreur API/réseau

        // SI on arrive ici, C'EST UN SUCCÈS (ou succès avec alerte)

        if (result.alerts && result.alerts.length > 0) {
          const combinedAlerts = result.alerts
            .map((alert: any) => `- ${alert.message}`)
            .join('\n');

          setToast({
            visible: true,
           // message: `Dépense ajoutée avec alerte :\n${combinedAlerts}`,
             message: t.toast_expense_category.expense_added_with_overrun,
            type: "success",
            duration: 1500
          });
        } else {
          // Succès simple
          setToast({ visible: true, message:  t.toast_expense_category.expense_added, type: "success" });
        }
        // Seulement en cas de succès, on recharge les budgets et on ferme le formulaire
        chargerBudgetsFiltres(page, itemsPerPage, selectedStatus);

      } catch (e) {
        // SI on arrive ici, c'est une ERREUR (l'alerte native a déjà été affichée par createExpenseApi)
        // L'affichage du Toast de succès est SKIPPÉ !
        console.error("Échec de la soumission de la dépense:", e);
        // Optionnel : Afficher un Toast d'échec si vous voulez doubler l'alerte native.
         setToast({ visible: true, message: "Erreur d'ajout.", type: "warning" }); 
      } finally {
        // Le spinner s'arrête quoi qu'il arrive
        setLoading(false);
      }
    }
    // Fermeture du formulaire (seulement après le succès ou l'échec géré)
    onCancel();
  };


  return (
    <View style={styles.container}>
      {/* Header avec titre et fermeture */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 13 }}>
        <Text style={{ fontFamily: FONTS.Poppins_SemiBold }}>{t.expense.add_expense}</Text>
        <EvilIcons name="close" size={22} color={COLORS.black_color} onPress={onCancel} />
      </View>

     

      {/* Montant et Libellé */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>{t.expense.amount}</Text>
          <TextInput
            keyboardType="numeric"
            value={amount.toString()} // pour convertir le nombre en texte avant d'afficher
            // onChangeText={setAmount}
            onChangeText={(val) => setAmount(Number(val) || 0)} // conversion string -> number
            style={styles.input}
            placeholder="0"
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.label}>{t.expense.wording}</Text>
          <TextInput
            value={label}
            onChangeText={setLabel}
            style={styles.input}
            placeholder={t.expense.wording_placeholder}
          />
        </View>
      </View>

      {/* Budget */}
      <Text style={styles.label}>{t.expense.budget}</Text>
      {selectorButton(
        budgets.find((b) => b.id === budget)?.libelle || t.expense.select_budget, //conversion pourId Budget Number(budget))
        budgetModalVisible,
        () => setBudgetModalVisible(!budgetModalVisible)
      )}
      {/* reuse renderModalDropdown for budget (data shape : {label,value}) */}
      {renderModalDropdown(
        budgetModalVisible,
        setBudgetModalVisible,
        // budgetItems,
        budgets as any[],
        budget,
        (value) => setBudget(value as number)
      )}

      {/* Catégorie */}
      <Text style={styles.label}>{t.expense.category}</Text>
      {selectorButton(
        //  categories.find((c) => c.id === category)?.name ?? "Choisir une catégorie",
        availableCategoriesBudget.find((c) => c.id === category)?.nom ?? t.expense.select_category,
        categoryModalVisible,
        () => setCategoryModalVisible(!categoryModalVisible),
        // categoryIcon // <-- ici l’icône passe en argument
      )}

      {/* IMPORTANT: pass `categories` (with icon+color) directly so renderModalDropdown can show icons */}
      {renderModalDropdown(
        categoryModalVisible,
        setCategoryModalVisible,
        availableCategoriesBudget as any[],
        category,
        (value) => setCategory(value as number))
      }

       {/* Toggle dépense répétitive */}
      <View style={styles.recurringContainer}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Ionicons name="sync" size={20} color={COLORS.textPrimary} />
          <Text style={{ fontFamily: FONTS.Poppins_Regular, fontSize: 14 }}>
            {t.expense.recurring}
          </Text>
        </View>
        <Switch
          value={isRecurring}
          onValueChange={setIsRecurring}
          trackColor={{ false: "gray", true: COLORS.yellow_color }}
          thumbColor={"#fff"}
        />
      </View>

      {/* Date début / fin uniquement si isRecurring */}
      {isRecurring && (
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 5 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{t.expense.start_date}</Text>
            <TouchableOpacity onPress={() => setShowStartPicker(true)}>
              <View style={styles.dateInputWrapper}>
                <TextInput
                  value={startDate.toISOString().split("T")[0]}
                  editable={false}
                  style={styles.dateInput}
                  pointerEvents="none"
                />
                <FontAwesome name="calendar" size={11} color={COLORS.textSecondary} />
              </View>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                onChange={(_, date) => {
                  setShowStartPicker(false);
                  if (date) setStartDate(date);
                }}
              />
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{t.expense.end_date}</Text>
            <TouchableOpacity onPress={() => setShowEndPicker(true)}>
              <View style={styles.dateInputWrapper}>
                <TextInput
                  value={endDate.toISOString().split("T")[0]}
                  editable={false}
                  style={styles.dateInput}
                  pointerEvents="none"
                />
                <FontAwesome name="calendar" size={11} color={COLORS.textSecondary} />
              </View>
            </TouchableOpacity>


            {showEndPicker && (
              <View
                style={
                  Platform.OS === 'ios'
                    ? { position: 'absolute', top: 70, right: 0, minWidth: 350, zIndex: 10, backgroundColor: 'white' }
                    : {} // ou style spécifique pour Android si besoin, ou vide
                }
              >
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={(_, date) => {
                    setShowEndPicker(false);
                    if (date) setEndDate(date);
                  }}
                />
              </View>
            )}
          </View>
        </View>
      )}

      {/* Image et bouton Ajouter */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity style={styles.imgPicker} onPress={pickImage}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Entypo name="camera" size={16} color={COLORS.black_color} style={{ marginRight: 8 }} />
            <Text style={{ color: COLORS.black_color }}>
              {image ? t.expense.picture_choose : t.expense.picture}
            </Text>
          </View>

        </TouchableOpacity>
        <TouchableOpacity style={styles.btnWrapper} onPress={handleExpenseSubmit}>
          <Text style={styles.btnText}>{initialData ? "Modifier" : t.expense.add}</Text>
        </TouchableOpacity>
      </View>

      {image && (
        <Image source={{ uri: image }} style={{ width: 80, height: 80, marginTop: 8, borderRadius: 8 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily: FONTS.Poppins_Regular,
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  label: {
    fontFamily: FONTS.Poppins_Regular,
    marginBottom: 5,
    color: COLORS.textPrimary,
  },
  input: {
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 10,
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    //color:COLORS.textSecondary
  },
  dateInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  dateInput: {
    flex: 1,
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 10,
    paddingVertical: 10,
    //padding:10,
    color: COLORS.textSecondary
  },
  imgPicker: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.black_color,
    borderRadius: 6,
  },
  btnWrapper: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: COLORS.yellow_color,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  btnText: {
    padding: 2,
    color: COLORS.black_color,
    fontWeight: "600",
  },
  selectorButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginBottom: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    maxHeight: 300,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  optionSelected: {
    backgroundColor: COLORS.font_color,
  },
  optionText: {
    fontSize: 12,
  },
  recurringContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  //style pour les icones dans le modal categorie
  optionIconWrapper: {
    borderRadius: 8,
    padding: 6
  },
  optionLabel: { fontSize: 13 },
});
