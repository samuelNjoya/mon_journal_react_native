// src/components/graphChart/CategoryPieChart.tsx
import React, { useMemo } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { FONTS, COLORS } from "../../../assets/constants";
import { Category } from "../../../contexts/ExpenseContext";

const screenWidth = Dimensions.get("window").width;

function stringToColor(str: string  | undefined | null):string {
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
  expenses: { montant: number; id_categorie_depense:number }[];
  categories: { id: number; nom: string }[];
}

export default function CategoryPieChart({ expenses = [], categories = []  }: CategoryPieChartProps) {
// console.log("Expenses:", expenses);
// console.log("Categories:", categories);

  const data = useMemo(() => {
   // if (!categories || !expenses) return [];
    if (!Array.isArray(categories) || !Array.isArray(expenses)) return [];

   // const totalmontant = expenses.reduce((sum, e) => sum + e.montant, 0);
   const totalmontant = expenses.reduce((sum, e) => sum + (e.montant || 0), 0);

    return categories
      .map((cat) => {
       // const total = expenses.filter((e) => e.categoryId === cat.id).reduce((sum, e) => sum + e.montant, 0);
          //  const total = expenses
          // .filter((e) => e.categories && e.id_categorie_depense.id === cat.id)
          // .reduce((sum, e) => sum + (e.montant || 0), 0);

           // 👉 On filtre les dépenses qui appartiennent à cette catégorie
      const total = expenses
        .filter((e) => Number(e.id_categorie_depense) === Number(cat.id))
        .reduce((sum, e) => sum + parseFloat(e.montant || 0), 0);
        

        const percentage = totalmontant > 0 ? ((total / totalmontant) * 100).toFixed(1) : "0";
        
        return {
          nom: cat.nom,
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
        <Text style={styles.title}>Pas de dépenses pour le moment</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Répartition par catégorie</Text>
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
              <Text style={[styles.legendText, { color: COLORS.textPrimary }]}>: {d.montant}</Text>
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
  title: { fontSize: 16, fontFamily: FONTS.Poppins_Medium, marginBottom: 10 },
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
