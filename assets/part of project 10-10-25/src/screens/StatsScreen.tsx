import React, { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet,View } from 'react-native';
import { getData } from '../../services/storage';
import { COLORS, FONTS } from '../../assets/constants';
import Header from '../components/Header';
import CategoryPieChart from '../components/graphChart/CategoryPieChart';
import WeeklyBarChart from '../components/graphChart/WeeklyBarChart';
import ExpenseChartLine from '../components/graphChart/ExpenseChartLine';


export default function StatsScreen() {
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const expenses = await getData('@expenses') || [];
      const categories = await getData('@categories') || [];

      // Agréger données pour pie chart par catégorie
      const categorySums = {};
      categories.forEach(cat => {
        categorySums[cat.id] = { label: cat.name, value: 0, color: COLORS.primary };
      });

      expenses.forEach(exp => {
        if (categorySums[exp.categoryId]) {
          categorySums[exp.categoryId].value += exp.amount;
        }
      });

      // Assigner couleur différente pour chaque catégorie (cycle ici simplifié)
      const colors = ['#F2994A', '#56CCF2', '#6FCF97', '#FF6464', '#9B51E0', '#FFC107', '#8E44AD'];
      let i = 0;
      for (const key in categorySums) {
        categorySums[key].color = colors[i % colors.length];
        i++;
      }

      setPieData(Object.values(categorySums).filter(c => c.value > 0));

      // Préparer données évolution hebdomadaire (lundi à dimanche)
      // On agrège par jour de la semaine
      const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
      const barSums = days.map(day => ({ label: day, value: 0 }));

      expenses.forEach(exp => {
        const d = new Date(exp.date);
        // getDay() donne 0:dimanche, 1:lundi ... On aligne sur notre tableau
        let dayIndex = d.getDay() === 0 ? 6 : d.getDay() - 1;
        barSums[dayIndex].value += exp.amount;
      });

      setBarData(barSums);
    }

    fetchData();
  }, []);

  return (
    <View style={{ flex:1, }}>
      <Header />
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
        {/* <Text style={styles.title}>Répartition par catégorie</Text> */}
        <View>
           <CategoryPieChart />
        </View>
        
        {/* <Text style={styles.title}>Évolution hebdomadaire</Text> */}
        <View>
           <WeeklyBarChart />
        </View>

        <View>
           <ExpenseChartLine />
        </View>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily:FONTS.primary_font,
    marginVertical: 12,
    fontWeight: 'bold',
    color: COLORS.black_color,
  },
});
