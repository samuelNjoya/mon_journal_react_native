import React, { useState, useMemo } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import { COLORS, FONTS } from "../../assets/constants";
import { MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Expense } from "../../contexts/ExpenseContext";
import { Category ,Budget} from "../../contexts/ExpenseContext";

// interface Budget {
//   id: number;
//   name: string;
// }

interface ExpenseListProps {
  categories: Category[];
  budgets: Budget[];
  expenses: Expense[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

export default function ExpenseList({ categories, budgets, expenses, onDelete, onEdit }: ExpenseListProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filtrer les dépenses selon la recherche
  const filteredExpenses = useMemo(() => {
    if (!searchQuery.trim()) return expenses;
    return expenses.filter((e) =>
      e.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, expenses]);

  const confirmDelete = (id: number) => {
    Alert.alert(
      "Supprimer la dépense",
      "Voulez-vous vraiment supprimer cette dépense ?",
      [
        { text: "Annuler" },
        { text: "Supprimer", onPress: () => onDelete(id), style: "destructive" },
      ]
    );
  };

  return (
    <View style={styles.accordionContainer}>
      {/* En-tête accordéon */}
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.accordionTitle}>Historique des dépenses</Text>
        <MaterialIcons
          name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color={COLORS.textPrimary}
        />
      </TouchableOpacity>

      {/* Contenu accordéon */}
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

          {/* ScrollView interne pour les items */}
          <ScrollView nestedScrollEnabled={true} style={[styles.list]} showsVerticalScrollIndicator={false}>
            {filteredExpenses.length === 0 ? (
              <Text style={styles.emptyText}>{searchQuery ? "Aucune dépense trouvée." : "Aucune dépense enregistrée."}</Text>
            ) : (
              filteredExpenses.map((item) => {
                const cat = categories.find(c => c.id === item.categoryId);
                const budget = budgets.find(b => b.id === item.budgetId);

                return (
                  <View key={item.id} style={styles.item}>
                    {/* LEFT: icône + texte */}
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}>
                      <View style={[styles.catIconWrapper, { backgroundColor: cat?.color ?? COLORS.lightGray }]}>
                        <MaterialCommunityIcons name={(cat?.icon ?? "tag") as any} size={16} color="#fff" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.label}>{item.label}</Text>

                        {/* Ligne info complète */}
                        <Text style={[styles.categoryText, item.isRecurring && { fontStyle: "italic" }]}>
                          {item.date} • {cat?.name ?? "Inconnue"}
                          {budget ? ` • ${budget.name}` : ""}
                          {item.isRecurring ? ` • ${item.startDate} → ${item.endDate}` : ""}
                        </Text>
                      </View>
                    </View>

                    {/* RIGHT: montant + actions */}
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.amount}>- {item.amount.toLocaleString()} FCFA</Text>
                      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 }}>
                        <TouchableOpacity onPress={() => onEdit(item.id)}>
                          <AntDesign name="edit" size={22} color={COLORS.blueColor} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => confirmDelete(item.id)}>
                          <MaterialIcons name="delete" size={22} color={COLORS.error} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  accordionContainer: {
    borderRadius: 8,
    marginBottom: 1,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: COLORS.white,
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
    fontFamily: FONTS.Poppins_Regular,
    paddingBottom: 10,
  },
  searchInput: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    color: COLORS.black_color,
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 12,
  },
  list: {
    marginTop: 0,
    maxHeight: 400,
  },
  item: {
    backgroundColor: COLORS.background,
    flexDirection: "row",
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  label: {
    fontFamily: FONTS.Poppins_Medium,
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  amount: {
    fontFamily: FONTS.Poppins_Medium,
    fontSize: 12,
    color: COLORS.error,
    marginBottom: 4,
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    color: COLORS.textSecondary,
    fontStyle: "italic",
  },
  catIconWrapper: {
    width: 36, height: 36,
    borderRadius: 8,
    alignItems: "center", justifyContent: "center"
  },
});
