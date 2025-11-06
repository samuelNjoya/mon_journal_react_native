import React, { useMemo } from "react";
import { View, Text, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { FONTS, COLORS } from "../../../assets/constants";
import { Expense } from "../../../contexts/ExpenseContext";

const screenWidth = Dimensions.get("window").width;

interface WeeklyBarChartProps {
  expenses: Expense[];
  startDate?: Date;
  endDate?: Date;
}

// Convertit "24/10/2025" → Date valide
function parseFrenchDate(str: string): Date | null {
  if (!str) return null;
  const parts = str.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts.map(Number);
    return new Date(year, month - 1, day);
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function isSameDayUTC(a: Date, b: Date) {
  return (
    a.getUTCDate() === b.getUTCDate() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCFullYear() === b.getUTCFullYear()
  );
}

export default function WeeklyBarChart({
  expenses,
  startDate,
  endDate,
}: WeeklyBarChartProps) {
  const sDate =
    startDate ??
    (() => {
      const d = new Date();
      d.setDate(d.getDate() - 6);
      return d;
    })();
  const eDate = endDate ?? new Date();

  const dataForChart = useMemo(() => {
    if (!Array.isArray(expenses) || expenses.length === 0)
      return { labels: [], data: [] };

    const totalDays =
      Math.ceil((+eDate - +sDate) / (1000 * 60 * 60 * 24)) + 1;

    // 🔹 Vue quotidienne si ≤ 7 jours
    if (totalDays <= 7) {
      const labels: string[] = [];
      const values: number[] = [];

      for (let i = 0; i < totalDays; i++) {
        const d = new Date(sDate);
        d.setDate(sDate.getDate() + i);
        labels.push(d.toLocaleDateString("fr-FR", { weekday: "short" }));

        const daySum = expenses.reduce((sum, e) => {
          const ed = parseFrenchDate(e.created_at as any);
          if (ed && isSameDayUTC(ed, d))
            return sum + parseFloat(e.montant as any || 0);
          return sum;
        }, 0);

        values.push(daySum);
      }

      return { labels, data: values };
    }

    //  Vue hebdo si ≤ 30 jours
    if (totalDays <= 30) {
      const labels: string[] = [];
      const values: number[] = [];
      let weekIndex = 0;
      let cursor = new Date(sDate);

      while (cursor <= eDate) {
        const weekStart = new Date(cursor);
        const weekEnd = new Date(cursor);
        weekEnd.setDate(weekEnd.getDate() + 6);
        if (weekEnd > eDate) weekEnd.setTime(eDate.getTime());

        const sum = expenses.reduce((acc, e) => {
          const d = parseFrenchDate(e.created_at as any);
          if (d && d >= weekStart && d <= weekEnd)
            return acc + parseFloat(e.montant as any || 0);
          return acc;
        }, 0);

        labels.push(`S${weekIndex + 1}`);
        values.push(sum);

        weekIndex++;
        cursor.setDate(cursor.getDate() + 7);
      }

      return { labels, data: values };
    }

    // Vue annuelle si > 365 jours
    if (totalDays > 365) {
      const labels: string[] = [];
      const values: number[] = [];
      let cursor = new Date(sDate.getFullYear(), 0, 1); // Début de l'année de sDate

      while (cursor.getFullYear() <= eDate.getFullYear()) {
        const yearStart = new Date(cursor.getFullYear(), 0, 1); // 1er janv. de l'année
        const yearEnd = new Date(cursor.getFullYear(), 11, 31); // 31 déc. de l'année

        // Ajuster yearEnd si elle dépasse eDate (seulement pour la dernière année)
        const effectiveYearEnd = yearEnd > eDate ? eDate : yearEnd;

        const sum = expenses.reduce((acc, e) => {
          const d = parseFrenchDate(e.created_at as any);
          // d >= yearStart ET d <= effectiveYearEnd
          if (d && d >= yearStart && d <= effectiveYearEnd) {
            return acc + parseFloat(e.montant as any || 0);
          }
          return acc;
        }, 0);

        labels.push(cursor.getFullYear().toString()); // Le label est l'année (ex: "2020")
        values.push(sum);

        cursor.setFullYear(cursor.getFullYear() + 1); // Passer à l'année suivante
      }

      return { labels, data: values };
    }

    // Vue mensuelle sinon périodes > 30 jours ET ≤ 365 jours
    const labels: string[] = [];
    const values: number[] = [];
    let cursor = new Date(sDate.getFullYear(), sDate.getMonth(), 1);

    while (cursor <= eDate) {
      const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
      const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
      if (monthEnd > eDate) monthEnd.setTime(eDate.getTime());

      const sum = expenses.reduce((acc, e) => {
        const d = parseFrenchDate(e.created_at as any);
        if (d && d >= monthStart && d <= monthEnd)
          return acc + parseFloat(e.montant as any || 0);
        return acc;
      }, 0);

      labels.push(
        monthStart.toLocaleDateString("fr-FR", { month: "short" })
      );
      values.push(sum);

      cursor.setMonth(cursor.getMonth() + 1);
    }

    return { labels, data: values };
  }, [expenses, sDate, eDate]);

  //  Log de debug utile
  //console.log("📊 Graph data:", dataForChart);

  if (!dataForChart || dataForChart.data.length === 0) {
    return (
      <View style={{ padding: 20, backgroundColor: COLORS.white }}>
        <Text style={{ fontFamily: FONTS.Poppins_Medium }}>
          Pas de dépenses pour la période sélectionnée
        </Text>
      </View>
    );
  }

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
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 12 },
    barPercentage: 0.6,
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        paddingVertical: 10,
        marginBottom: 10,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "500",
          marginBottom: 10,
          fontFamily: FONTS.Poppins_Medium,
          padding: 15,
        }}
      >
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
