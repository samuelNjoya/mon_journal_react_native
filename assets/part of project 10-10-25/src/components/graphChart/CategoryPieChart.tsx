// src/components/graphChart/CategoryPieChart.tsx
import React, { useMemo } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { FONTS, COLORS } from "../../../assets/constants";

const screenWidth = Dimensions.get("window").width;

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 65%, 55%)`;
}

interface CategoryPieChartProps {
  expenses: { amount: number; categoryId: number }[]; // --- on attend les expenses filtrées
  categories: { id: number; name: string }[];
}

export default function CategoryPieChart({ expenses, categories }: CategoryPieChartProps) {
  const data = useMemo(() => {
    if (!categories || !expenses) return [];

    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

    return categories
      .map((cat) => {
        const total = expenses.filter((e) => e.categoryId === cat.id).reduce((sum, e) => sum + e.amount, 0);
        const percentage = totalAmount > 0 ? ((total / totalAmount) * 100).toFixed(1) : "0";
        return {
          name: cat.name,
          amount: total,
          color: stringToColor(cat.name),
          legendFontColor: "#333",
          legendFontSize: 12,
          legendLabel: `${cat.name} : ${percentage}%`,
        };
      })
      .filter((d) => d.amount > 0);
  }, [expenses, categories]);

  if (data.length === 0) {
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
          accessor={"amount"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          hasLegend={false}
        />
      </View>

      <View style={styles.legendContainer}>
        {data.map((d, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: d.color }]} />
            <Text style={styles.legendText}>
              {d.name} : {d.amount} ({((d.amount / data.reduce((sum, x) => sum + x.amount, 0)) * 100).toFixed(1)}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.white, paddingVertical: 10, marginBottom: 10, paddingHorizontal: 15, borderRadius: 8 },
  title: { fontSize: 16, fontFamily: FONTS.Poppins_Medium, marginBottom: 10 },
  legendContainer: { marginTop: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  legendColor: { width: 16, height: 16, marginRight: 8, borderRadius: 4 },
  legendText: { fontSize: 12, fontFamily: FONTS.Poppins_Regular, color: COLORS.textPrimary },
});
