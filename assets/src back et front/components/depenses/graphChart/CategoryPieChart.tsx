// src/components/graphChart/CategoryPieChart.tsx
import React, { useMemo } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { FONTS, COLORS } from "../../../../assets/constants";
import { Category } from "../../../context/ExpenseContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "../../../hooks/useTranslation";
import { useCategoryTranslation } from "../../../hooks/useCategoryTranslation";

const screenWidth = Dimensions.get("window").width;

function stringToColor(str: string | undefined | null): string {
  const safeStr = str ?? "default"
  let hash = 0;
  for (let i = 0; i < safeStr.length; i++) {
    hash = safeStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 65%, 55%)`;
}

interface CategoryPieChartProps {
  // expenses: { montant: number; categories:Category }[]; // --- on attend les expenses filtrées
  expenses: { montant: number; id_categorie_depense: number }[];
  categories: { id: number ; nom: string }[];
}

export default function CategoryPieChart({ expenses = [], categories = [] }: CategoryPieChartProps) {

    const { t,locale } = useTranslation();
const { getTranslatedCategoryName } = useCategoryTranslation(); 
  // console.log("Expenses:", expenses);
  // console.log("Categories:", categories);

  const data = useMemo(() => {
    // if (!categories || !expenses) return [];
    if (!Array.isArray(categories) || !Array.isArray(expenses)) return [];

    // const totalmontant = expenses.reduce((sum, e) => sum + e.montant, 0);
    const totalmontant = expenses.reduce((sum, e) => sum + (e.montant || 0), 0);

    return categories
      .map((cat) => {
  
        //On filtre les dépenses qui appartiennent à cette catégorie
        const total = expenses
          .filter((e) => Number(e.id_categorie_depense) === Number(cat.id))
          .reduce((sum, e) => sum + parseFloat(e.montant as any || 0), 0);


        const percentage = totalmontant > 0 ? ((total / totalmontant) * 100).toFixed(1) : "0";

        return {
         // nom: cat.nom,
          nom:getTranslatedCategoryName(cat),
          montant: total,
          color: stringToColor(cat.nom),
          legendFontColor: "#333",
          legendFontSize: 12,
          legendLabel: `${cat.nom} : ${percentage}%`,
        };
      })
      .filter((d) => d.montant > 0);
  }, [expenses, categories]);

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t.information_of_graph.repartition_by_category}</Text>
        <View style={styles.emptyState}>
          <MaterialIcons name="info-outline" size={50} color="#BDC3C7" />
          <Text style={styles.emptyText}>
            {t.expense.no_expenses_found}.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.information_of_graph.repartition_by_category}</Text>
      <View style={{ alignItems: "center" }}>
        <PieChart
          data={data}
          width={screenWidth - 20}
          height={220}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor={"montant"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute // affiche les montants au lieu des pourcentages
          hasLegend={false}
        />
      </View>

      <View style={styles.legendContainer}>
        {data.map((d, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: d.color }]} />
            <View style={styles.rowLegendText}>
              <Text style={[styles.legendText, { color: COLORS.black_color }]}>{d.nom} </Text>
              <Text style={[styles.legendText, { color: COLORS.textPrimary, fontWeight:"700" }]}>: {(d.montant).toLocaleString(locale)}</Text>
              <Text style={[styles.legendText, { color: COLORS.textSecondary }]}>({((d.montant / data.reduce((sum, x) => sum + x.montant, 0)) * 100).toFixed(1)}%)</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white, paddingVertical: 10, marginBottom: 10,
    paddingHorizontal: 15, borderRadius: 8
  },
  title:{
    fontFamily:FONTS.Poppins_SemiBold
  },
 emptyState: {
    alignItems: 'center',
    padding: 50,
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
  },
  legendContainer: { marginTop: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  legendColor: { width: 16, height: 16, marginRight: 8, borderRadius: 4 },
  rowLegendText: {
    flexDirection: 'row'
  },
  legendText: {
    fontSize: 12, fontFamily: FONTS.Poppins_Regular,
    //color: COLORS.textSecondary
  },
});
