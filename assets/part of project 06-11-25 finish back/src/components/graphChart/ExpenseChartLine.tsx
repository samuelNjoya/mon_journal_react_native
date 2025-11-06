import React, { useState, useMemo } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS, FONTS } from '../../../assets/constants';
import { useExpenses } from '../../../contexts/ExpenseContext';


const screenWidth = Dimensions.get('window').width;

interface CategoryItemProps {
  nom: string;
  montant: number;
  percentage: string;
  color: string;
}

const CategoryItem: React.FC<{ category: CategoryItemProps }> = ({ category }) => (
  <View style={styles.categoryItem}>
    <View style={styles.categoryDetails}>
      <Text style={styles.categoryName}>{category.nom}</Text>
      <Text style={styles.categoryAmount}>{category.montant.toLocaleString('fr-FR')} FCFA</Text>
      <Text style={styles.categoryPercentage}>{category.percentage}</Text>
    </View>
  </View>
);

const ExpenseChartLine: React.FC = () => {
  const { expenses, categories } = useExpenses(); // <-- données dynamiques
  const [timeframe, setTimeframe] = useState<'Semaine' | 'Mois' | 'Année'>('Mois');

  // Détermine la date du Lundi précédent ou actuel
  function getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi
    let day = d.getDay();
    // Ajuster Dimanche (0) à 7 pour le calcul
    day = day === 0 ? 7 : day;

    // Reculer jusqu'au Lundi (day - 1 jours)
    // Utiliser setDate pour réinitialiser le temps à minuit (00:00:00)
    d.setDate(d.getDate() - day + 1);
    d.setHours(0, 0, 0, 0); // Réinitialiser l'heure à minuit pour le début de semaine
    return d;
  }

  // --- Filtrage par timeframe (peride)---
  const filteredExpenses = useMemo(() => {
    const now = new Date();

    return expenses.filter(exp => {
      // 🔹 Convertir "24/10/2025" en objet Date valide
      let expDate;
      if (typeof exp.created_at === 'string' && exp.created_at.includes('/')) {
        const [day, month, year] = exp.created_at.split('/');
        expDate = new Date(`${year}-${month}-${day}`);
      } else {
        expDate = new Date(exp.created_at);
      }

      if (isNaN(expDate.getTime())) return false; // Si la date est invalide

      if (timeframe === 'Semaine') {
        // const weekAgo = new Date(now);
        // weekAgo.setDate(now.getDate() - 7);
        // return expDate >= weekAgo && expDate <= now;
        // Début de la semaine (Lundi 00:00:00)


        //pour les semaines normales lundi a dimanche
        const currentWeekStart = getStartOfWeek(now);
        // Fin de la semaine actuelle (Dimanche 23:59:59) OU maintenant si la semaine n'est pas terminée
        const currentWeekEnd = new Date(currentWeekStart);
        currentWeekEnd.setDate(currentWeekEnd.getDate() + 6); // Aller au Dimanche
        // Si 'now' est plus tôt que le Dimanche, utiliser 'now' comme fin de période
        const effectiveEnd = now < currentWeekEnd ? now : currentWeekEnd;
        // Le filtrage se fait entre le Lundi à 00h00 et la fin effective
        return expDate >= currentWeekStart && expDate <= effectiveEnd;
      } else if (timeframe === 'Mois') {
        return (
          expDate.getMonth() === now.getMonth() &&
          expDate.getFullYear() === now.getFullYear()
        );
      } else {
        return expDate.getFullYear() === now.getFullYear();
      }
    });
  }, [expenses, timeframe]);


  // --- Total des dépenses ---
  // const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.montant, 0); 
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.montant || 0), 0);

  // comparaison des depenses en fonction du timeframe choisi
  const comparisonData = useMemo(() => {
    let previousPeriodTotal = 0;
    let previousPeriodLabel = '';
    const now = new Date();

    // --- Fonction de détermination des dates (Reste inchangée) ---
    const getPreviousPeriodRange = (date: Date) => {
      const start = new Date(date);
      const end = new Date(date);

      if (timeframe === 'Semaine') {
        //semaine 7 dernier jours 
        // start.setDate(date.getDate() - 14);
        // end.setDate(date.getDate() - 7);
        // previousPeriodLabel = 'vs Sem. préc.';


        // Début de la semaine actuelle pour la semaine normale
        const currentWeekStart = getStartOfWeek(date);
        // Fin de la semaine précédente (Dimanche de la semaine passée)  // On recule le début de la semaine actuelle d'un jour pour obtenir le Dimanche précédent
        end.setTime(currentWeekStart.getTime()); // Copier l'heure du lundi
        end.setDate(end.getDate() - 1); // Passer au Dimanche précédent (23:59:59)
        end.setHours(23, 59, 59, 999);
        // Début de la semaine précédente (Lundi de la semaine passée)
        // On recule encore de 6 jours (ou on utilise getStartOfWeek sur la fin de semaine précédente)
        start.setTime(end.getTime());
        start.setDate(start.getDate() - 6); // Lundi de la semaine passée
        start.setHours(0, 0, 0, 0);
        previousPeriodLabel = 'vs Sem. préc.';
      } else if (timeframe === 'Mois') {
        start.setMonth(date.getMonth() - 1, 1);
        end.setDate(0);
        end.setDate(end.getDate());

        const monthName = new Date(start).toLocaleDateString('fr-FR', { month: 'short' });
        // Le label sera utilisé uniquement s'il y a des données de comparaison
        previousPeriodLabel = `vs ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`;
      } else { // Année
        start.setFullYear(date.getFullYear() - 1, 0, 1);
        end.setFullYear(date.getFullYear() - 1, 11, 31);
        previousPeriodLabel = `vs ${date.getFullYear() - 1}`;
      }
      return { start, end };
    };

    const { start: prevStart, end: prevEnd } = getPreviousPeriodRange(now);

    // --- Filtrage et total de la période précédente (Reste inchangé) ---
    const previousExpenses = expenses.filter(exp => {
      let expDate;
      if (typeof exp.created_at === 'string' && exp.created_at.includes('/')) {
        const [day, month, year] = exp.created_at.split('/');
        expDate = new Date(`${year}-${month}-${day}`);
      } else {
        expDate = new Date(exp.created_at);
      }
      if (isNaN(expDate.getTime())) return false;
      return expDate >= prevStart && expDate <= prevEnd;
    });

    previousPeriodTotal = previousExpenses.reduce((sum, exp) => sum + parseFloat(exp.montant || 0), 0);

    // --- Calcul du pourcentage de changement (Partie corrigée) ---
    let percentageChange: number | 'NO_PREV_DATA' = 0;

    if (previousPeriodTotal > 0) {
      // Calcul normal, y compris si le changement est > 100%
      percentageChange = ((totalExpenses - previousPeriodTotal) / previousPeriodTotal) * 100;
    } else if (totalExpenses > 0) {
      // NOUVEAU: Si la période précédente est à 0 et l'actuelle est > 0
      percentageChange = 'NO_PREV_DATA';
    } else {
      // Les deux périodes sont à 0
      percentageChange = 0;
    }

    // --- Préparation des valeurs de retour ---
    let percentageString = '';
    let color = COLORS.yellow_color; // Couleur par défaut

    if (percentageChange === 'NO_PREV_DATA') {
      // Cas 1: Aucune donnée précédente
      percentageString = 'Nouv. Dépenses';
      // Le label est ajusté pour être concis
      previousPeriodLabel = previousPeriodLabel.replace('vs ', 'depuis '); // Ex: 'depuis Mai'
      color = COLORS.yellow_color;
    } else {
      // Cas 2: Calcul normal (0 ou un nombre)
      const change = percentageChange as number; // Assurer que c'est un nombre
      percentageString = `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
      color = change >= 0 ? COLORS.yellow_color : COLORS.error;
    }


    return { percentageString, previousPeriodLabel, color };

  }, [expenses, timeframe, totalExpenses]);

  // --- Répartition par catégorie (calcul du montant par categorie)---
  const categoryData = useMemo(() => {
    return categories.map(cat => {
      const montant = filteredExpenses
        .filter(exp => Number(exp.id_categorie_depense) === Number(cat.id))
        .reduce((sum, exp) => sum + parseFloat(exp.montant || 0), 0);

      const percentage =
        totalExpenses > 0 ? ((montant / totalExpenses) * 100).toFixed(0) + '%' : '0%';

      return { nom: cat.nom, montant, percentage, color: cat.color };
    }).filter(cat => cat.montant > 0);
  }, [categories, filteredExpenses, totalExpenses]);


  // --- Préparer les données pour le graphique ---
  const chartData = useMemo(() => { //useMemo pour optimiser les calculs
    const dataMap: Record<string, number> = {};

    filteredExpenses.forEach(exp => {
      // Conversion correcte
      let expDate;
      if (typeof exp.created_at === 'string' && exp.created_at.includes('/')) {
        const [day, month, year] = exp.created_at.split('/');
        expDate = new Date(`${year}-${month}-${day}`);
      } else {
        expDate = new Date(exp.created_at);
      }

      if (isNaN(expDate.getTime())) return; // ignorer si invalide

      const dateKey = expDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      const montant = Number(exp.montant);
      if (!isNaN(montant) && isFinite(montant)) {
        dataMap[dateKey] = (dataMap[dateKey] || 0) + montant;
      }
    });

    const labels = Object.keys(dataMap);
    const data = Object.values(dataMap).map(v => (isFinite(v) ? v : 0));

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
      <View style={{ backgroundColor: COLORS.white, borderRadius: 8, }}>
        <View style={styles.totalExpensesSection}>
          <View>
            <Text style={styles.totalExpensesLabel}>Dépenses totales</Text>
            <Text style={styles.totalExpensesAmount}>{totalExpenses.toLocaleString('fr-FR')} FCFA</Text>
          </View>
          {totalExpenses > 0 && (
            <View style={{ backgroundColor: COLORS.font_color, padding: 5, borderRadius: 25 }}>
              <Text style={{ fontSize: 10, fontFamily: FONTS.Poppins_SemiBold, color: COLORS.yellow_color }}>{comparisonData.percentageString} {comparisonData.previousPeriodLabel}</Text>
            </View>)}
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
              decimalPlaces: 1,
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
    //backgroundColor: '#fff',
    marginHorizontal: 15,//
    borderRadius: 8,
  },
  contentContainer: { paddingBottom: 20 },
  title: { fontSize: 14, color: '#333', fontFamily: FONTS.Poppins_SemiBold },
  filterBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  filterButtons: {
    flexDirection: 'row', backgroundColor: '#DDD', borderRadius: 8, padding: 4,
  },
  timeFilterButton: { paddingHorizontal: 4, paddingVertical: 4, borderRadius: 8 },
  timeFilterActive: {
    backgroundColor: COLORS.yellow_color, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 2
  },
  timeFilterText: { fontSize: 12, color: '#666' },
  timeFilterTextActive: { fontWeight: 'bold', color: '#333' },
  totalExpensesSection: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 10, marginTop: 20, marginBottom: 10
  },
  totalExpensesLabel: { fontSize: 12, fontFamily: FONTS.Poppins_Regular, color: COLORS.textSecondary },
  totalExpensesAmount: { fontSize: 20, fontFamily: FONTS.Poppins_SemiBold, },
  chartContainer: { alignItems: 'center' },
  lineChartStyle: { marginVertical: 8, borderRadius: 0 },
  categoryList: {
    flexDirection: 'row', paddingHorizontal: 20, borderTopWidth: 1,
    borderTopColor: '#f0f0f0', paddingTop: 15
  },
  categoryItem: {
    paddingVertical: 10,
    // marginLeft:10
    marginHorizontal: 5,
  },
  categoryDetails: {
    flexDirection: 'column',
    width: 140,
    minHeight: Platform.OS === "ios" ? 100 : 120,
    padding: 10, borderRadius: 5,
    shadowColor: '#6b6363ff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2.84,
    elevation: 1,
    borderWidth: Platform.OS === "ios" ? 1 : 0,
    borderColor: Platform.OS === "ios" ? COLORS.lightGray : "",
  },
  categoryName: {
    fontSize: 14, fontFamily: FONTS.Poppins_Regular, color: COLORS.textSecondary
  },
  categoryAmount: {
    fontSize: 16, color: COLORS.black_color, fontFamily: FONTS.Poppins_Medium
  },
  categoryPercentage: {
    fontSize: 12, color: COLORS.yellow_color, fontFamily: FONTS.Poppins_Medium
  },
});

export default ExpenseChartLine;
