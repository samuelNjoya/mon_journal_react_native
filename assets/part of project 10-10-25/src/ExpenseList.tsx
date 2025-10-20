import React, { useState, useMemo } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { COLORS, FONTS } from "../../assets/constants";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Expense, Category, Budget } from "../../contexts/ExpenseContext";
import ExpenseDetailModal from "./modals/ExpenseDetailModal";
import { DataTable } from "react-native-paper";

interface ExpenseListProps {
  categories: Category[];
  budgets: Budget[];
  expenses: Expense[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onStopRecurring?: (id: number) => void;
}

export default function ExpenseList({
  categories,
  budgets,
  expenses,
  onDelete,
  onEdit,
  onStopRecurring,
}: ExpenseListProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // pour pagination 
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const pageOptions = [5, 10, 20, 30, 50];


  const filteredExpenses = useMemo(() => {
    if (!searchQuery.trim()) return expenses;
    return expenses.filter((e) =>
      e.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, expenses]);

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const paginatedExpenses = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return filteredExpenses.slice(start, start + itemsPerPage);
  }, [currentPage, filteredExpenses, itemsPerPage]);

  const startIndex = currentPage * itemsPerPage + 1; // premier élément de la page
  const endIndex = Math.min(startIndex + paginatedExpenses.length - 1, filteredExpenses.length); // dernier élément
  const totalItems = filteredExpenses.length; // total d'éléments filtrés


  const confirmDelete = (id: number) => {
    Alert.alert("Supprimer la dépense", "Voulez-vous vraiment supprimer cette dépense ?", [
      { text: "Annuler" },
      { text: "Supprimer", onPress: () => onDelete(id), style: "destructive" },
    ]);
  };

  const confirmStopRecurring = (id: number) => {
    const item = expenses.find((e) => e.id === id);
    if (!item || !item.isRecurringActive) return;
    Alert.alert(
      "Arrêter la répétition",
      `Voulez-vous vraiment stopper le cycle de "${item.label}" ?`,
      [
        { text: "Annuler" },
        { text: "Oui", style: "destructive", onPress: () => onStopRecurring?.(id) },
      ]
    );
  };

  const handleSelectValue = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(0);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity style={styles.accordionHeader} onPress={() => setIsExpanded(!isExpanded)}>
        <Text style={styles.accordionTitle}>Historique des dépenses</Text>
        <MaterialIcons
          name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color={COLORS.textPrimary}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.accordionContent}>
          {/* Barre de recherche */}
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une dépense..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textSecondary}
          />

          {/* Sélecteur du nombre d'éléments */}

          <View style={styles.paginationSelectorContainer}>

            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', gap: 3 }}>
              <MaterialCommunityIcons name="table-large" size={20} color={COLORS.textSecondary} />
              <Text style={styles.selectorLabel}>Element : {startIndex} – {endIndex} sur {totalItems} </Text>
            </View>

            <View>
              <TouchableOpacity
                style={styles.customSelect}
                onPress={() => setDropdownVisible(!dropdownVisible)}
              >
                <Text style={styles.customSelectText}>{itemsPerPage}</Text>
                <MaterialIcons name="arrow-drop-down" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>

              {dropdownVisible && (
                <View style={styles.dropdownOptions}>
                  {pageOptions.map((value) => (
                    <TouchableOpacity
                      key={value}
                      style={styles.dropdownOption}
                      onPress={() => handleSelectValue(value)}
                    >
                      <Text style={styles.dropdownOptionText}>{value}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>


          {/* Liste des dépenses */}
          <ScrollView nestedScrollEnabled style={styles.list} showsVerticalScrollIndicator={false}>
            {paginatedExpenses.length === 0 ? (
              <Text style={styles.emptyText}>
                {searchQuery ? "Aucune dépense trouvée." : "Aucune dépense enregistrée."}
              </Text>
            ) : (
              paginatedExpenses.map((item) => {
                const cat = categories.find((c) => c.id === item.categoryId);
                const budget = budgets.find((b) => b.id === item.budgetId);

                return (
                  <TouchableOpacity key={item.id} onPress={() => setSelectedExpense(item)} activeOpacity={0.9}>
                    <View style={[styles.item, item.isRecurring && styles.recurringItem]}>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                          {/* Gauche */}
                          <View style={styles.left}>
                            <View
                              style={[
                                styles.catIconWrapper,
                                { backgroundColor: cat?.color ?? COLORS.lightGray },
                              ]}
                            >
                              <MaterialCommunityIcons
                                name={(cat?.icon ?? "tag") as any}
                                size={26}
                                color="#fff"
                              />
                            </View>
                            <View style={{ flex: 1, justifyContent: "center", gap: 3 }}>
                              <Text style={styles.label}>{item.label}</Text>
                              <Text style={styles.infoLine}>
                                {item.date} • {cat?.name ?? "Inconnue"}
                              </Text>
                            </View>
                          </View>

                          {/* Droite */}
                          <View style={styles.right}>
                            <Text style={styles.amount}>
                              - {item.amount.toLocaleString()} FCFA
                            </Text>
                            <View style={styles.actions}>
                              {item.isRecurring && (
                                <TouchableOpacity
                                  onPress={() => confirmStopRecurring(item.id)}
                                  disabled={!item.isRecurringActive}
                                  style={[
                                    styles.actionButton,
                                    {
                                      backgroundColor: item.isRecurringActive
                                        ? "#E6FCE6"
                                        : "#F8E6E6",
                                    },
                                  ]}
                                >
                                  <MaterialCommunityIcons
                                    name="autorenew"
                                    size={22}
                                    color={
                                      item.isRecurringActive
                                        ? COLORS.greenColor
                                        : COLORS.error
                                    }
                                  />
                                </TouchableOpacity>
                              )}

                              {/* <TouchableOpacity onPress={() => onEdit(item.id)}>
                                <MaterialIcons name="edit" size={20} color={COLORS.blueColor} />
                              </TouchableOpacity> */}

                              <TouchableOpacity onPress={() => confirmDelete(item.id)}>
                                <MaterialIcons name="delete" size={20} color={COLORS.error} />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                        <View >
                          {/* {budget && (
                            <Text style={styles.infoLine}>
                              💼 Budget : <Text style={styles.infoValue}>{budget.name}</Text>
                            </Text>
                          )} */}


                          {/* {item.isRecurring && (
                            <Text style={styles.infoLine}>
                              🔁 Période : <Text style={styles.infoValue}>{item.startDate} → {item.endDate}</Text>{" "}
                              <Text style={{
                                color: item.isRecurringActive ? COLORS.greenColor : COLORS.error,
                                fontWeight: "600"
                              }}>
                                {item.isRecurringActive ? "(actif)" : "(stoppé)"}
                              </Text>
                            </Text>
                          )} */}

                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          {/* Pagination */}

          <DataTable.Pagination
            page={currentPage}
            numberOfPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            label={`Page ${currentPage + 1} sur ${totalPages}`}
            showFastPaginationControls
            style={styles.pagination}
          />


          {/* Modal des détails */}
          <ExpenseDetailModal
            visible={!!selectedExpense}
            expense={selectedExpense}
            category={categories.find((c) => c.id === selectedExpense?.categoryId) ?? null}
            budget={budgets.find((b) => b.id === selectedExpense?.budgetId) ?? null}
            onClose={() => setSelectedExpense(null)}
          />
        </View>
      )}
    </View>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  accordionContainer: { borderRadius: 8, marginBottom: 10 },
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
  accordionContent: { backgroundColor: COLORS.white, paddingHorizontal: 8, paddingBottom: 10 },
  searchInput: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    color: COLORS.black_color,
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 12,
  },
  paginationSelectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
    gap: 8,
  },
  selectorLabel: {
    // fontFamily: FONTS.Poppins_Regular,
    fontSize: 11,
    color: COLORS.textPrimary,
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

  dropdownOptions: { position: "absolute", top: 35, width: 55, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.lightGray, borderRadius: 6, zIndex: 1000 },
  dropdownOption: { paddingVertical: 6, alignItems: "center" },
  dropdownOptionText: { fontSize: 12, color: COLORS.textPrimary },


  pagination: {
    borderTopWidth: 1,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
    paddingVertical: 3,
    justifyContent: "space-between",
    alignItems: "center",
  },
  list: { maxHeight: 420 },
  item: {
    backgroundColor: COLORS.bg_item,
    flexDirection: "row",
    marginTop: 8,
    padding: 12,
    borderRadius: 10,
  },
  recurringItem: {},
  left: { flex: 2, flexDirection: "row", alignItems: "center", gap: 8 },
  right: { flex: 1, alignItems: "flex-end" },
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
  actions: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionButton: {
    borderRadius: 6,
    padding: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    color: COLORS.textSecondary,
    fontStyle: "italic",
  },
});
