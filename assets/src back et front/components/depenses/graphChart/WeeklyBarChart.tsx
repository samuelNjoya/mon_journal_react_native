import React, { useMemo } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { FONTS, COLORS } from "../../../../assets/constants";
import { Expense } from "../../../context/ExpenseContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "../../../hooks/useTranslation";

const screenWidth = Dimensions.get("window").width;

interface WeeklyBarChartProps {
  expenses: Expense[];
  startDate?: Date;
  endDate?: Date;
}


// Convertit "24/10/2025" → Date UTC valide
function parseFrenchDate(str: string): Date | null {
  if (!str) return null;
  const parts = str.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts.map(Number);
    // CORRECTIF : Crée la date en UTC
    return new Date(Date.UTC(year, month - 1, day));
  }

  // Gérer les autres formats (ex: ISO string)
  const d = new Date(str);
  if (isNaN(d.getTime())) return null;

  // CORRECTIF : Normaliser les autres formats en "jour" UTC
  // On utilise les getters LOCAUX pour construire un jour UTC
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
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

  const { t, locale } = useTranslation(); //ajout de locale

  const sDate =
    startDate ??
    (() => {
      const d = new Date();
      d.setDate(d.getDate() - 6);
      return d;
    })();
  const eDate = endDate ?? new Date();

  // 

  const dataForChart = useMemo(() => {
    if (!Array.isArray(expenses) || expenses.length === 0)
      return { labels: [], data: [] };

    // --- Calcul initial en UTC (c'est correct) ---
    const sDateUTC = new Date(
      Date.UTC(sDate.getFullYear(), sDate.getMonth(), sDate.getDate())
    );
    const eDateUTC = new Date(
      Date.UTC(eDate.getFullYear(), eDate.getMonth(), eDate.getDate())
    );

    const totalDays =
      Math.round((eDateUTC.getTime() - sDateUTC.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // --- Vue quotidienne ≤ 7 jours (c'est correct) ---
    if (totalDays <= 7) {
      const labels: string[] = [];
      const values: number[] = [];

      const loopStartDateUTC = new Date(
        Date.UTC(sDate.getFullYear(), sDate.getMonth(), sDate.getDate())
      );

      for (let i = 0; i < totalDays; i++) {
        const d_utc = new Date(loopStartDateUTC);
        d_utc.setUTCDate(loopStartDateUTC.getUTCDate() + i);

        labels.push(
          // d_utc.toLocaleDateString("fr-FR", {// coder en dur français 
          d_utc.toLocaleDateString(locale, { // Utilise la locale dynamique
            weekday: "short",
            timeZone: "UTC",
          })
        );

        const daySum = expenses.reduce((sum, e) => {
          const ed = parseFrenchDate(e.created_at as any); // Renvoie UTC
          if (ed && isSameDayUTC(ed, d_utc)) // Compare UTC vs UTC
            return sum + parseFloat((e.montant as any) || 0);
          return sum;
        }, 0);

        values.push(daySum);
      }

      return { labels, data: values };
    }


    // --- 🔽 Vue hebdo ≤ 30 jours (corrigée en UTC) ---
    if (totalDays <= 30) {
      const labels: string[] = [];
      const values: number[] = [];
      let weekIndex = 0;
      // Utiliser le sDateUTC normalisé
      let cursor = new Date(sDateUTC.getTime());

      while (cursor <= eDateUTC) {
        const weekStart = new Date(cursor.getTime()); // Déjà UTC
        const weekEnd = new Date(cursor.getTime());   // Déjà UTC
        weekEnd.setUTCDate(weekEnd.getUTCDate() + 6); // Incrémenter en UTC

        const effectiveEnd = weekEnd > eDateUTC ? eDateUTC : weekEnd;

        const sum = expenses.reduce((acc, e) => {
          const d = parseFrenchDate(e.created_at as any); // UTC
          // Comparaison UTC vs UTC
          if (d && d >= weekStart && d <= effectiveEnd)
            return acc + parseFloat(e.montant as any || 0);
          return acc;
        }, 0);

        //labels.push(`S${weekIndex + 1}`); //toujours en français
        // INTERNATIONALISATION DES SEMAINES
        if (locale === 'fr-FR') {
          labels.push(`Sem ${weekIndex + 1}`); //Français
        } else {
          labels.push(`Week ${weekIndex + 1}`); //Anglais
        }
        values.push(sum);

        weekIndex++;
        cursor.setUTCDate(cursor.getUTCDate() + 7); // Incrémenter en UTC
      }

      return { labels, data: values };
    }

    // --- 🔽 Vue annuelle > 365 jours (corrigée en UTC) ---
    if (totalDays > 365) {
      const labels: string[] = [];
      const values: number[] = [];
      // Début de l'année en UTC
      let cursor = new Date(Date.UTC(sDateUTC.getUTCFullYear(), 0, 1));

      while (cursor.getUTCFullYear() <= eDateUTC.getUTCFullYear()) {
        const yearStart = new Date(Date.UTC(cursor.getUTCFullYear(), 0, 1));
        const yearEnd = new Date(Date.UTC(cursor.getUTCFullYear(), 11, 31));

        const effectiveYearEnd = yearEnd > eDateUTC ? eDateUTC : yearEnd;

        const sum = expenses.reduce((acc, e) => {
          const d = parseFrenchDate(e.created_at as any); // UTC
          // Comparaison UTC vs UTC
          if (d && d >= yearStart && d <= effectiveYearEnd) {
            return acc + parseFloat(e.montant as any || 0);
          }
          return acc;
        }, 0);

        labels.push(cursor.getUTCFullYear().toString());
        values.push(sum);

        cursor.setUTCFullYear(cursor.getUTCFullYear() + 1);
      }

      return { labels, data: values };
    }

    // --- 🔽 Vue mensuelle (corrigée en UTC) ---
    const labels: string[] = [];
    const values: number[] = [];
    // Début du mois en UTC
    let cursor = new Date(Date.UTC(sDateUTC.getUTCFullYear(), sDateUTC.getUTCMonth(), 1));

    while (cursor <= eDateUTC) {
      const monthStart = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), 1));
      // Fin du mois en UTC
      const monthEnd = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 0));

      const effectiveMonthEnd = monthEnd > eDateUTC ? eDateUTC : monthEnd;

      const sum = expenses.reduce((acc, e) => {
        const d = parseFrenchDate(e.created_at as any); // UTC
        // Comparaison UTC vs UTC
        if (d && d >= monthStart && d <= effectiveMonthEnd)
          return acc + parseFloat(e.montant as any || 0);
        return acc;
      }, 0);

      labels.push(
      //  monthStart.toLocaleDateString("fr-FR", { //coder en dur
       monthStart.toLocaleDateString(locale, { // Utilise la locale dynamique
          month: "short",
          timeZone: "UTC" // Important
        })
      );
      values.push(sum);

      cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    }

    return { labels, data: values };
  }, [expenses, sDate, eDate, locale]); //ajouter local
  //  Log de debug utile
  //console.log("📊 Graph data:", dataForChart);

  if (!dataForChart || dataForChart.data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t.information_of_graph.evolution}</Text>
        <View style={styles.emptyState}>
          <MaterialIcons name="info-outline" size={50} color="#BDC3C7" />
          <Text style={styles.emptyText}>
            {t.expense.no_expenses_found}.
          </Text>
        </View>
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
        //  marginBottom: 10,
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
        {t.information_of_graph.evolution}
      </Text>
      <BarChart
        data={chartData}
        width={screenWidth - 35}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={chartConfig as any}
        verticalLabelRotation={0}
        fromZero
        showValuesOnTopOfBars
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white, paddingVertical: 10, marginBottom: 10,
    paddingHorizontal: 15, borderRadius: 8
  },
  title: {
    fontFamily: FONTS.Poppins_SemiBold
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
})

