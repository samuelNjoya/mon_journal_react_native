import React from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet,StyleProp, ViewStyle, TextStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import des icônes Material
import { COLORS, FONTS } from '../../../assets/constants';


// INTERFACES TYPEES POUR LES DONNEES
interface CategoryLine {
  id: number;
  category: string;
  amount: string;
}

interface BudgetData {
  amount: string;
  startDate: string;
  endDate: string;
  label: string;
  categoryLines: CategoryLine[];
}

interface BudgetOverviewProps {
  // budgets: BudgetData[]; // Tableau de budgets passés en props
}


const BudgetOverview: React.FC<BudgetOverviewProps> = () => {
  // Données statiques pour la démonstration
  const currentMonth: string = "Janvier";
  const totalAmount: string = "2,029,530 FCFA";
  const monthlyBudget: string = "3,000,000 FCFA";
  const remaining: string = "970,470 FCFA";
  const isOverBudget: boolean = true;
  
  // Calcul du pourcentage de progression pour la barre de progression
  const spentAmount: number = 2029530; // Montant dépensé en numérique
  const budgetAmount: number = 3000000; // Budget total en numérique
  const progressPercentage: number = Math.min((spentAmount / budgetAmount) * 100, 100); // Pourcentage entre 0 et 100

  const remainingNumeric: number = parseFloat(remaining.replace(/[^0-9.-]+/g, ""));
  
  // Détermination de la couleur pour le texte "Reste"
  // Rouge si négatif (dépassement), vert si positif (reste positif)
  const remainingTextColor: string = remainingNumeric < 0 ? '#e74c3c' : '#1a171a';

  return (
    <View style={overviewStyles.overviewContainer}>
      {/* EN-TÊTE AVEC TITRE ET MONTANT TOTAL SUR LA MÊME LIGNE */}
      <View style={overviewStyles.headerRow}>
        <Text style={overviewStyles.overviewTitle}>Vue d'ensemble - {currentMonth}</Text>

        <View style={overviewStyles.amountContainer}>
          <Text style={overviewStyles.overviewAmount}>{totalAmount}</Text>
        </View>
      </View>
      
      {/* BARRE DE PROGRESSION VISUELLE */}
      <View style={overviewStyles.progressSection}>
        <View style={overviewStyles.progressBarContainer}>
          <View 
            style={[
              overviewStyles.progressBarFill,
              { 
                width: `${progressPercentage}%`,
                backgroundColor: COLORS.yellow_color,
                // Opacité qui augmente avec le pourcentage pour un effet de fondu
                opacity: 0.7 + (progressPercentage / 100) * 0.3
              }
            ]} 
          />
        </View>
        
        {/* Pourcentage de progression affiché numériquement */}
        <Text style={overviewStyles.progressText}>
          {progressPercentage.toFixed(1)}%
        </Text>
      </View>
      
      {/* INFORMATIONS BUDGÉTAIRES DÉTAILLÉES */}
      <View style={overviewStyles.budgetInfo}>
        <Text style={overviewStyles.budgetLabel}>Budget mensuel:</Text>
        <Text style={overviewStyles.budgetValue}>{monthlyBudget}</Text>
      </View>

      <View style={overviewStyles.budgetInfo}>
        <Text style={overviewStyles.budgetLabel}>Reste:</Text>
        <Text style={[
          overviewStyles.budgetValue,
          { color: remainingTextColor } 
        ]}>
          {remaining}
        </Text>
      </View>

      {/* AVERTISSEMENT SI BUDGET DÉPASSÉ AVEC ICÔNE */}
      {isOverBudget && (
        <TouchableOpacity style={overviewStyles.warningButton}>
          <View style={overviewStyles.warningContent}>
            <MaterialIcons name="warning" size={16} color="#e74c3c" />
            <Text style={overviewStyles.warningText}>Budget dépassé pour Alimentation</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* LISTE DES BUDGETS EXISTANTS */}
      {/* Section extensible pour afficher l'historique ou les détails supplémentaires */}
      {/* {budgets.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={[overviewStyles.label, { marginBottom: 10 }]}>Dépenses récentes</Text>
        </View>
      )} */}
    </View>
  );
};

export default BudgetOverview;


const overviewStyles =  StyleSheet.create({

  overviewContainer: {
    backgroundColor :COLORS.white,
    marginBottom: 10,
    borderRadius: 6,
    padding: 12,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
   // elevation: 3,
  },

  // CONTENEUR POUR L'EN-TÊTE
  headerRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },

  // TITRE DE LA SECTION VUE D'ENSEMBLE
  overviewTitle: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? FONTS.Poppins_Bold : FONTS.Poppins_Bold,
    color: '#1a171a',
  //  fontWeight: 'bold',
    flex: 1, 
  },

  // CONTENEUR DU MONTANT TOTAL
  amountContainer: {
    backgroundColor: COLORS.font_color, 
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 10, 
  },

  // MONTANT TOTAL 
  overviewAmount: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? FONTS.Poppins_Regular : FONTS.Poppins_Regular,
    color: '#8e5f46ff', 
    fontWeight: 'bold',
  },

  // SECTION DE LA BARRE DE PROGRESSION
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10, 
  },

  // CONTENEUR DE LA BARRE DE PROGRESSION (FOND)
  progressBarContainer: {
    flex: 1, 
    height: 8,
    backgroundColor: '#f0f0f0', 
    borderRadius: 4,
    overflow: 'hidden', 
  },

  // PARTIE REMPLIE DE LA BARRE DE PROGRESSION
  // MODIFICATION: Style de base pour la barre de progression avec dégradé
  progressBarFill: {
    height: '100%', 
    borderRadius: 4,
    // NOTE: Le dégradé et l'opacité sont gérés dynamiquement dans le style inline
  },

  // TEXTE DU POURCENTAGE DE PROGRESSION
  progressText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? FONTS.Poppins_Regular : FONTS.Poppins_Regular,
    color: '#1a171a',
    fontWeight: 'bold',
    minWidth: 40, 
    textAlign: 'center',
  },

  // section LIGNE BUDGET MENSUEL ET RESTE
  budgetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  // LABEL DES INFORMATIONS BUDGÉTAIRES
  budgetLabel: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? FONTS.Poppins_Regular : FONTS.Poppins_Regular,
    color: '#1a171a',
    opacity: 0.8,
  },

  // VALEUR DES INFORMATIONS BUDGÉTAIRES
  budgetValue: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? FONTS.Poppins_Regular : FONTS.Poppins_Regular,
    color: '#1a171a',
  },

  // BOUTON/ALERTE D'AVERTISSEMENT BUDGET DÉPASSÉ
  warningButton: {
    backgroundColor: '#ffeaea', 
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },

  // CONTENEUR DU CONTENU DE L'AVERTISSEMENT (ICÔNE + TEXTE)
  warningContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  // TEXTE D'AVERTISSEMENT BUDGET DÉPASSÉ
  warningText: {
    color: '#e74c3c', // Rouge pour l'avertissement
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? FONTS.Poppins_Bold : FONTS.Poppins_Bold,
   // fontWeight: 'bold',
  },

  // LABEL GÉNÉRIQUE
  label: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Poppins' : FONTS.Poppins_Regular,
    color: '#1a171a',
    opacity: 0.8,
  },
});