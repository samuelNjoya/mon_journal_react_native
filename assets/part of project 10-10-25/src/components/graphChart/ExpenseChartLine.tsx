import React, { useState, useMemo } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS, FONTS } from '../../../assets/constants';
import { useExpenses } from '../../../contexts/ExpenseContext';

const screenWidth = Dimensions.get('window').width;

interface CategoryItemProps {
  name: string;
  amount: number;
  percentage: string;
  color: string;
}

const CategoryItem: React.FC<{ category: CategoryItemProps }> = ({ category }) => (
  <View style={styles.categoryItem}>
    <View style={styles.categoryDetails}>
      <Text style={styles.categoryName}>{category.name}</Text>
      <Text style={styles.categoryAmount}>{category.amount.toLocaleString('fr-FR')} FCFA</Text>
      <Text style={styles.categoryPercentage}>{category.percentage}</Text>
    </View>
  </View>
);

const ExpenseChartLine: React.FC = () => {
  const { expenses, categories } = useExpenses(); // <-- données dynamiques
  const [timeframe, setTimeframe] = useState<'Semaine' | 'Mois' | 'Année'>('Mois');

  // --- Filtrage par timeframe ---
  const filteredExpenses = useMemo(() => {
    const now = new Date();
    return expenses.filter(exp => {
      const expDate = new Date(exp.date);
      if (timeframe === 'Semaine') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return expDate >= weekAgo && expDate <= now;
      } else if (timeframe === 'Mois') {
        return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
      } else {
        return expDate.getFullYear() === now.getFullYear();
      }
    });
  }, [expenses, timeframe]);

  // --- Total des dépenses ---
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // --- Répartition par catégorie ---
  const categoryData = useMemo(() => {
    return categories.map(cat => {
      const amount = filteredExpenses
        .filter(exp => exp.categoryId === cat.id)
        .reduce((sum, exp) => sum + exp.amount, 0);
      const percentage = totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(0) + '%' : '0%';
      return { name: cat.name, amount, percentage, color: cat.color };
    }).filter(cat => cat.amount > 0); //  Ne garde que les catégories avec dépenses; 
  }, [categories, filteredExpenses, totalExpenses]);

  // --- Préparer les données pour le graphique ---
  const chartData = useMemo(() => {
    const dataMap: Record<string, number> = {};

    filteredExpenses.forEach(exp => {
      const dateKey = new Date(exp.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      const amount = Number(exp.amount);
      if (!isNaN(amount) && isFinite(amount)) {
        dataMap[dateKey] = (dataMap[dateKey] || 0) + amount;
      }
    });

    const labels = Object.keys(dataMap);
    const data = Object.values(dataMap).map(v => (isFinite(v) ? v : 0)); // on s’assure que tout est numérique

    // Si aucune donnée (ex. début d’utilisation)
    if (data.length === 0) {
      labels.push('Aucune donnée');
      data.push(0);
    }

    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => `rgba(252, 191, 0, ${opacity})`,
        },
      ],
    };
  }, [filteredExpenses]);

 // console.log('chartData', chartData);

  const renderTimeFilter = (label: 'Semaine' | 'Mois' | 'Année') => (
    <TouchableOpacity
      key={label}
      style={[styles.timeFilterButton, timeframe === label && styles.timeFilterActive]}
      onPress={() => setTimeframe(label)}
    >
      <Text style={[styles.timeFilterText, timeframe === label && styles.timeFilterTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.mainContainer} contentContainerStyle={styles.contentContainer}>
      <View style={styles.filterBar}>
        <Text style={styles.title}>Suivi des dépenses</Text>
        <View style={styles.filterButtons}>
          {renderTimeFilter('Semaine')}
          {renderTimeFilter('Mois')}
          {renderTimeFilter('Année')}
        </View>
      </View>

      <View style={styles.totalExpensesSection}>
        <View>
          <Text style={styles.totalExpensesLabel}>Dépenses totales</Text>
          <Text style={styles.totalExpensesAmount}>{totalExpenses.toLocaleString('fr-FR')} FCFA</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={180}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(252, 191, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0,${opacity * 0.5})`,
            propsForDots: { r: '0', strokeWidth: '0' },
            propsForBackgroundLines: { strokeDasharray: '0', stroke: '#f0f0f0', strokeWidth: 1 },
          }}
          fromZero
          bezier
          withVerticalLines={false}
          withDots={false}
          style={styles.lineChartStyle}
        />
      </View>

      <ScrollView style={styles.categoryList} horizontal showsHorizontalScrollIndicator={false}>
        {categoryData.map(cat => (
          <CategoryItem key={cat.name} category={cat} />
        ))}
      </ScrollView>
    </ScrollView>
  );
};

// Styles inchangés, tu peux réutiliser ton fichier existant
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, backgroundColor: '#fff',
    marginHorizontal: 15,//
    borderRadius: 6,
  },
  contentContainer: { paddingBottom: 20 },
  title: { fontSize: 14, color: '#333', fontFamily: FONTS.Poppins_Medium },
  filterBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 0 },
  filterButtons: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderRadius: 15, padding: 2 },
  timeFilterButton: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 15 },
  timeFilterActive: { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 2 },
  timeFilterText: { fontSize: 12, color: '#666' },
  timeFilterTextActive: { fontWeight: 'bold', color: '#333' },
  totalExpensesSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, marginTop: 20, marginBottom: 10 },
  totalExpensesLabel: { fontSize: 14, fontFamily: FONTS.Poppins_Regular, color: '#666' },
  totalExpensesAmount: { fontSize: 20, fontFamily: FONTS.Poppins_SemiBold, marginVertical: 4 },
  chartContainer: { alignItems: 'center' },
  lineChartStyle: { marginVertical: 8, borderRadius: 0 },
  categoryList: { flexDirection: 'row', paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 15 },
  categoryItem: {
    paddingVertical: 10,
    // marginLeft:10
    marginHorizontal: 5,
  },
  categoryDetails: {
    flexDirection: 'column', width: 130, padding: 10, borderRadius: 5,
    shadowColor: '#6b6363ff', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.25, shadowRadius: 2.84,
    elevation: 1
  },
  categoryName: { fontSize: 14, fontFamily: FONTS.Poppins_Regular, color: COLORS.textSecondary },
  categoryAmount: { fontSize: 16, color: COLORS.black_color, fontFamily: FONTS.Poppins_Medium },
  categoryPercentage: { fontSize: 12, color: COLORS.yellow_color, fontFamily: FONTS.Poppins_Medium },
});

export default ExpenseChartLine;
