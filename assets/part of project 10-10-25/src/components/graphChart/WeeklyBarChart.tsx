import React, { useMemo } from "react";
import { View, Text, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { FONTS } from "../../../assets/constants";
import { Expense } from "../../../contexts/ExpenseContext";

const screenWidth = Dimensions.get("window").width;

interface WeeklyBarChartProps {
  expenses: Expense[];
  startDate?: Date;
  endDate?: Date;
}

function daysBetween(a: Date, b: Date) {
  const diff = Math.ceil((+b - +a) / (1000 * 60 * 60 * 24));
  return diff + 1;
}

export default function WeeklyBarChart({ expenses, startDate, endDate }: WeeklyBarChartProps) {
  const sDate = startDate ? new Date(startDate) : (() => { const d = new Date(); d.setDate(d.getDate() - 6); return d; })();
  const eDate = endDate ? new Date(endDate) : new Date();

  const dataForChart = useMemo(() => {
    if (!expenses) return { labels: [], data: [] };

    const totalDays = daysBetween(new Date(sDate.setHours(0,0,0,0)), new Date(eDate.setHours(0,0,0,0)));
    const startYear = sDate.getFullYear();
    const endYear = eDate.getFullYear();
    const startMonth = sDate.getMonth();
    const endMonth = eDate.getMonth();

    // --- Affichage quotidien ---
    if (totalDays <= 7) {
      const labels: string[] = [];
      const values: number[] = [];
      for (let i = 0; i < totalDays; i++) {
        const d = new Date(sDate);
        d.setDate(sDate.getDate() + i);
        const label = d.toLocaleDateString("fr-FR", { weekday: "short" });
        labels.push(label);
        const daySum = expenses.reduce((sum, e) => {
          if (!e.date) return sum;
          const ed = new Date(e.date); ed.setHours(0,0,0,0);
          if (ed.getTime() === d.getTime()) return sum + e.amount;
          return sum;
        }, 0);
        values.push(daySum);
      }
      return { labels, data: values };
    }

    // --- Affichage par semaine si <= 30 jours ---
    if (totalDays <= 30) {
      const weekSums: number[] = [];
      const labels: string[] = [];
      let weekIndex = 0;
      let cursor = new Date(sDate);
      cursor.setHours(0,0,0,0);
      while (cursor <= eDate) {
        const weekStart = new Date(cursor);
        const weekEnd = new Date(cursor);
        weekEnd.setDate(weekEnd.getDate() + 6);
        if (weekEnd > eDate) weekEnd.setTime(eDate.getTime());

        const sum = expenses.reduce((acc, ex) => {
          if (!ex.date) return acc;
          const d = new Date(ex.date); d.setHours(0,0,0,0);
          if (d >= weekStart && d <= weekEnd) return acc + ex.amount;
          return acc;
        }, 0);

        weekSums.push(sum);
        labels.push(`S${weekIndex + 1}`);
        weekIndex++;
        cursor.setDate(cursor.getDate() + 7);
      }
      return { labels, data: weekSums };
    }

    // --- Affichage par mois si intervalle sur <= 12 mois ---
    if (startYear === endYear || (endYear - startYear === 1 && endMonth < startMonth)) {
      const monthSums: number[] = [];
      const labels: string[] = [];
      let cursor = new Date(sDate.getFullYear(), sDate.getMonth(), 1);

      while (cursor <= eDate) {
        const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
        const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
        if (monthEnd > eDate) monthEnd.setTime(eDate.getTime());

        const sum = expenses.reduce((acc, ex) => {
          if (!ex.date) return acc;
          const d = new Date(ex.date); d.setHours(0,0,0,0);
          if (d >= monthStart && d <= monthEnd) return acc + ex.amount;
          return acc;
        }, 0);

        monthSums.push(sum);
        // Abbréviation du mois seulement
        labels.push(monthStart.toLocaleDateString("fr-FR", { month: "short" }));
        cursor.setMonth(cursor.getMonth() + 1);
      }

      return { labels, data: monthSums };
    }

    // --- Affichage par année si intervalle > 1 an ---
    const yearSums: number[] = [];
    const labels: string[] = [];
    for (let y = startYear; y <= endYear; y++) {
      const yearStart = new Date(y, 0, 1);
      const yearEnd = new Date(y, 11, 31);
      if (yearEnd > eDate) yearEnd.setTime(eDate.getTime());

      const sum = expenses.reduce((acc, ex) => {
        if (!ex.date) return acc;
        const d = new Date(ex.date); d.setHours(0,0,0,0);
        if (d >= yearStart && d <= yearEnd) return acc + ex.amount;
        return acc;
      }, 0);

      yearSums.push(sum);
      labels.push(`${y}`);
    }

    return { labels, data: yearSums };

  }, [expenses, startDate, endDate]);

  const chartData = {
    labels: dataForChart.labels,
    datasets: [{ data: dataForChart.data }],
  };

  const chartConfig = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(252, 191, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 25, ${opacity})`,
    style: { borderRadius: 12 },
    barPercentage: 0.6,
  };

  return (
    <View style={{ backgroundColor: "white", paddingVertical: 10, marginBottom: 10 }}>
      <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 10, fontFamily: FONTS.Poppins_Medium, padding: 15 }}>
        Évolution
      </Text>
      <BarChart
        data={chartData}
        width={screenWidth - 35}
        height={220}
        yAxisLabel=""
        chartConfig={chartConfig as any}
        verticalLabelRotation={0}
        fromZero
        showValuesOnTopOfBars
      />
    </View>
  );
}
