import React, { useState, useMemo } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS, FONTS } from '../../../../assets/constants';
import { useExpenses } from '../../../context/ExpenseContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { useCategoryTranslation } from '../../../hooks/useCategoryTranslation';

const screenWidth = Dimensions.get('window').width;

interface CategoryItemProps {
  nom: string;
  montant: number;
  percentage: string;
  color: string;
}

// Interface pour recevoir les dépenses filtrées
interface ExpenseChartLineProps {
  // Les dépenses filtrées passées depuis ExpenseScreen
  expenses?: {
    montant: number | string;
    created_at: string;
    id_categorie_depense: number;
    libelle?: string;
  }[];
}

const CategoryItem: React.FC<{ category: CategoryItemProps }> = ({ category }) => {
  const { t, locale } = useTranslation();
  const { getTranslatedCategoryName } = useCategoryTranslation();
  return (
    <View style={styles.categoryItem}>
      <View style={styles.categoryDetails}>
        <Text style={styles.categoryName}>{category.nom}</Text>
        <Text style={styles.categoryAmount}>{category.montant.toLocaleString(locale)} FCFA</Text>
        <Text style={styles.categoryPercentage}>{category.percentage}</Text>
      </View>
    </View>
  );
};

const ExpenseChartLine: React.FC<ExpenseChartLineProps> = ({
  expenses: propExpenses  // ← prop optionnelle
}) => {
  const { t, locale } = useTranslation();
  const { getTranslatedCategoryName } = useCategoryTranslation();
  
  // Utilise le contexte pour avoir TOUTES les données
  const { expenses: contextExpenses, categories } = useExpenses();
  
  // Utilise les expenses en prop si fournies, sinon celles du contexte
  const sourceExpenses = propExpenses || contextExpenses;
  
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  // Détermine la date du Lundi précédent ou actuel
  function getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    let day = d.getDay();
    day = day === 0 ? 7 : day;
    d.setDate(d.getDate() - day + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // --- Filtrage par timeframe (période)---
  const filteredExpenses = useMemo(() => {
    const now = new Date();

    return sourceExpenses.filter(exp => {  // ← MODIF : sourceExpenses au lieu de expenses
      let expDate;
      if (typeof exp.created_at === 'string' && exp.created_at.includes('/')) {
        const [day, month, year] = exp.created_at.split('/');
        expDate = new Date(`${year}-${month}-${day}`);
      } else {
        expDate = new Date(exp.created_at || 0);
      }

      if (isNaN(expDate.getTime())) return false;

      if (timeframe === 'week') {
        const currentWeekStart = getStartOfWeek(now);
        const currentWeekEnd = new Date(currentWeekStart);
        currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);
        const effectiveEnd = now < currentWeekEnd ? now : currentWeekEnd;
        return expDate >= currentWeekStart && expDate <= effectiveEnd;
      } else if (timeframe === 'month') {
        return (
          expDate.getMonth() === now.getMonth() &&
          expDate.getFullYear() === now.getFullYear()
        );
      } else {
        return expDate.getFullYear() === now.getFullYear();
      }
    });
  }, [sourceExpenses, timeframe]);  // ← MODIF : sourceExpenses au lieu de expenses

  // --- Total des dépenses ---
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.montant as any || 0), 0);

  // comparaison des dépenses en fonction du timeframe choisi
  const comparisonData = useMemo(() => {
    let previousPeriodTotal = 0;
    let previousPeriodLabel = '';
    const now = new Date();

    const getPreviousPeriodRange = (date: Date) => {
      const start = new Date(date);
      const end = new Date(date);

      if (timeframe === 'week') {
        const currentWeekStart = getStartOfWeek(date);
        end.setTime(currentWeekStart.getTime());
        end.setDate(end.getDate() - 1);
        end.setHours(23, 59, 59, 999);
        start.setTime(end.getTime());
        start.setDate(start.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        previousPeriodLabel = t.information_of_graph.vs_next_week;
      } else if (timeframe === 'month') {
        start.setMonth(date.getMonth() - 1, 1);
        end.setDate(0);
        end.setDate(end.getDate());
        const monthName = new Date(start).toLocaleDateString(locale, { month: 'short' });
        previousPeriodLabel = `vs ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`;
      } else {
        start.setFullYear(date.getFullYear() - 1, 0, 1);
        end.setFullYear(date.getFullYear() - 1, 11, 31);
        previousPeriodLabel = `vs ${date.getFullYear() - 1}`;
      }
      return { start, end };
    };

    const { start: prevStart, end: prevEnd } = getPreviousPeriodRange(now);

    // --- Filtrage et total de la période précédente ---
    // MODIF IMPORTANTE : Utiliser sourceExpenses ici aussi
    const previousExpenses = sourceExpenses.filter(exp => {
      let expDate;
      if (typeof exp.created_at === 'string' && exp.created_at.includes('/')) {
        const [day, month, year] = exp.created_at.split('/');
        expDate = new Date(`${year}-${month}-${day}`);
      } else {
        expDate = new Date(exp.created_at || 0);
      }
      if (isNaN(expDate.getTime())) return false;
      return expDate >= prevStart && expDate <= prevEnd;
    });

    previousPeriodTotal = previousExpenses.reduce((sum, exp) => sum + parseFloat(exp.montant as any || 0), 0);

    // --- Calcul du pourcentage de changement ---
    let percentageChange: number | 'NO_PREV_DATA' = 0;

    if (previousPeriodTotal > 0) {
      percentageChange = ((totalExpenses - previousPeriodTotal) / previousPeriodTotal) * 100;
    } else if (totalExpenses > 0) {
      percentageChange = 'NO_PREV_DATA';
    } else {
      percentageChange = 0;
    }

    // --- Préparation des valeurs de retour ---
    let percentageString = '';
    let color = COLORS.yellow_color;

    if (percentageChange === 'NO_PREV_DATA') {
      percentageString = t.information_of_graph.new_expense;
      previousPeriodLabel = previousPeriodLabel.replace('vs ', t.information_of_graph.since);
      color = COLORS.yellow_color;
    } else {
      const change = percentageChange as number;
      percentageString = `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
      color = change >= 0 ? COLORS.yellow_color : COLORS.error;
    }

    return { percentageString, previousPeriodLabel, color };
  }, [sourceExpenses, timeframe, totalExpenses, locale, t]);  // ← MODIF : sourceExpenses au lieu de expenses

  // --- Répartition par catégorie ---
  const categoryData = useMemo(() => {
    return categories.map(cat => {
      const montant = filteredExpenses
        .filter(exp => Number(exp.id_categorie_depense) === Number(cat.id))
        .reduce((sum, exp) => sum + parseFloat(exp.montant as any || 0), 0);

      const percentage =
        totalExpenses > 0 ? ((montant / totalExpenses) * 100).toFixed(0) + '%' : '0%';

      return {
        nom: getTranslatedCategoryName(cat),
        montant,
        percentage,
        color: cat.color
      };
    }).filter(cat => cat.montant > 0);
  }, [categories, filteredExpenses, totalExpenses, getTranslatedCategoryName]);

  // --- Préparer les données pour le graphique ---
  const chartData = useMemo(() => {
    const dataMap: Record<string, number> = {};

    filteredExpenses.forEach(exp => {
      let expDate;
      if (typeof exp.created_at === 'string' && exp.created_at.includes('/')) {
        const [day, month, year] = exp.created_at.split('/');
        expDate = new Date(`${year}-${month}-${day}`);
      } else {
        expDate = new Date(exp.created_at || 0);
      }

      if (isNaN(expDate.getTime())) return;

      const dateKey = expDate.toLocaleDateString(locale, { day: '2-digit', month: 'short' });
      const montant = Number(exp.montant);
      if (!isNaN(montant) && isFinite(montant)) {
        dataMap[dateKey] = (dataMap[dateKey] || 0) + montant;
      }
    });

    const labels = Object.keys(dataMap);
    const data = Object.values(dataMap).map(v => (isFinite(v) ? v : 0));

    if (data.length === 0) {
      labels.push(t.information_of_graph.no_data);
      data.push(0);
    }

    return {
      labels,
      datasets: [{
        data,
        color: (opacity = 1) => `rgba(252, 191, 0, ${opacity})`,
      }],
    };
  }, [filteredExpenses, locale, t]);

  const renderTimeFilter = (label: 'week' | 'month' | 'year') => (
    <TouchableOpacity
      key={label}
      style={[styles.timeFilterButton, timeframe === label && styles.timeFilterActive]}
      onPress={() => setTimeframe(label)}
    >
      <Text style={[styles.timeFilterText, timeframe === label && styles.timeFilterTextActive]}>
        {t.information_of_graph[label]}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.mainContainer} contentContainerStyle={styles.contentContainer}>
      <View style={styles.filterBar}>
        <Text style={styles.title}>{t.information_of_graph.expense_tracking}</Text>
        <View style={styles.filterButtons}>
          {renderTimeFilter('week')}
          {renderTimeFilter('month')}
          {renderTimeFilter('year')}
        </View>
      </View>
      <View style={{
        backgroundColor: COLORS.white,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}>
        <View style={styles.totalExpensesSection}>
          <View>
            <Text style={styles.totalExpensesLabel}>{t.information_of_graph.total_expense}</Text>
            <Text style={styles.totalExpensesAmount}>{totalExpenses.toLocaleString(locale)} FCFA</Text>
          </View>
          {totalExpenses > 0 && (
            <View style={{ backgroundColor: COLORS.font_color, padding: 5, borderRadius: 25 }}>
              <Text style={{ fontSize: 10, fontFamily: FONTS.Poppins_SemiBold, color: COLORS.yellow_color }}>
                {comparisonData.percentageString} {comparisonData.previousPeriodLabel}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={180}
            chartConfig={{
              backgroundColor: COLORS.white,
              backgroundGradientFrom: COLORS.white,
              backgroundGradientTo: COLORS.white,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(252, 191, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0,0,0,${opacity * 0.5})`,
              propsForDots: { r: '0', strokeWidth: '0' },
              propsForBackgroundLines: { strokeDasharray: '0', stroke: COLORS.black_color, strokeWidth: 1 },
            }}
            fromZero
            bezier
            withVerticalLines={false}
            withDots={false}
            style={styles.lineChartStyle}
            formatXLabel={(value) => {
              const labels = chartData.labels;
              const index = labels.indexOf(value);

              if (timeframe === 'week') {
                return value;
              }

              if (timeframe === 'month') {
                return (index % 7 === 0) ? value : '';
              }
              if (timeframe === 'year') {
                return (index % 10 === 0) ? value : '';
              }
              return value;
            }}
          />
        </View>

        <ScrollView style={styles.categoryList} horizontal showsHorizontalScrollIndicator={false}>
          {categoryData.map(cat => (
            <CategoryItem key={cat.nom} category={cat} />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginHorizontal: 9,
    borderRadius: 8,
  },
  contentContainer: { paddingBottom: 20 },
  title: { fontSize: 14, color: '#333', fontFamily: FONTS.Poppins_SemiBold },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    backgroundColor: '#DDD',
    borderRadius: 8,
    padding: 4,
  },
  timeFilterButton: { paddingHorizontal: 4, paddingVertical: 4, borderRadius: 8 },
  timeFilterActive: {
    backgroundColor: COLORS.yellow_color,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2
  },
  timeFilterText: { fontSize: 11, color: '#666' },
  timeFilterTextActive: { fontWeight: 'bold', color: '#333' },
  totalExpensesSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 10
  },
  totalExpensesLabel: { fontSize: 12, fontFamily: FONTS.Poppins_Regular, color: COLORS.textSecondary },
  totalExpensesAmount: { fontSize: 20, fontFamily: FONTS.Poppins_SemiBold, },
  chartContainer: { alignItems: 'center' },
  lineChartStyle: { marginVertical: 8, borderRadius: 0 },
  categoryList: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15
  },
  categoryItem: {
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  categoryDetails: {
    flexDirection: 'column',
    width: 145,
    minHeight: Platform.OS === "ios" ? 100 : 120,
    borderWidth: Platform.OS === "ios" ? 1 : 0,
    borderColor: Platform.OS === "ios" ? COLORS.lightGray : "",
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    padding: 10
  },
  categoryName: {
    fontSize: 14,
    fontFamily: FONTS.Poppins_Regular,
    color: COLORS.textSecondary
  },
  categoryAmount: {
    fontSize: 16,
    color: COLORS.black_color,
    fontFamily: FONTS.Poppins_Medium
  },
  categoryPercentage: {
    fontSize: 12,
    color: COLORS.yellow_color,
    fontFamily: FONTS.Poppins_Medium
  },
});

export default ExpenseChartLine;