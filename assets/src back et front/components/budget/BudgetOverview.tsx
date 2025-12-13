import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { useBudget } from '../../context/BudgetsContext';
import BudgetDepasseModal from './BudgetDepasseModal'; 
import { useTranslation } from '../../hooks/useTranslation';

interface BudgetOverviewProps {

}

const BudgetOverview: React.FC<BudgetOverviewProps> = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const { statBudgetMensuel, getMounth } = useBudget();
  const { t,locale } = useTranslation();

  // Vérifie s'il y a des budgets dépassés
  const hasBudgetsDepasses = statBudgetMensuel?.budgets_depasses && 
                            statBudgetMensuel.budgets_depasses.length > 0;

  return (
    <View style={overviewStyles.overviewContainer}>
      {/* EN-TÊTE AVEC TITRE ET MONTANT TOTAL SUR LA MÊME LIGNE */}
      <View style={overviewStyles.headerRow}>
        <Text style={overviewStyles.overviewTitle}>{t.budget?.budget_overview} - {statBudgetMensuel ?getMounth(statBudgetMensuel) : "Chargement..."}</Text>

        <View style={overviewStyles.amountContainer}>
          <Text style={overviewStyles.overviewAmount}>{statBudgetMensuel ? (statBudgetMensuel.montantTotalAffecte ?? 0).toLocaleString(locale) : 0} FCFA</Text>
        </View>
      </View>
      
      {/* BARRE DE PROGRESSION VISUELLE */}
      <View style={overviewStyles.progressSection}>
        <View style={overviewStyles.progressBarContainer}>
          <View 
            style={[
              overviewStyles.progressBarFill,
              { 
                width: `${statBudgetMensuel?.tauxUtilisationBudget ?? 0}%`,
                backgroundColor: '#f8be12ff',
                
                opacity: 0.7 + ((statBudgetMensuel?.tauxUtilisationBudget ?? 0) / 100) * 0.3
              }
            ]} 
          />
        </View>
        
        {/* Pourcentage de progression affiché numériquement */}
        <Text style={overviewStyles.progressText}>
          {statBudgetMensuel ? (statBudgetMensuel.tauxUtilisationBudget ?? 0).toFixed(1) : 0}%
        </Text>
      </View>
      
      {/* INFORMATIONS BUDGÉTAIRES DÉTAILLÉES */}
      <View style={overviewStyles.budgetInfo}>
        <Text style={overviewStyles.budgetLabel}>{t.budget?.monthly_budget}:</Text>
        <Text style={overviewStyles.budgetValue}>{statBudgetMensuel ? (statBudgetMensuel.montantTotalBudget ?? 0).toLocaleString(locale) : 0} FCFA</Text>
      </View>

      <View style={overviewStyles.budgetInfo}>
        <Text style={overviewStyles.budgetLabel}>{t.budget?.remaining_budget} :</Text>
        <Text style={[
          overviewStyles.budgetValue,
          // { color: remainingTextColor } 
        ]}>
          {statBudgetMensuel ? (statBudgetMensuel.reste ?? 0).toLocaleString(locale) : 0} FCFA
        </Text>
      </View>

       <View style={overviewStyles.budgetInfo}>
        <Text style={overviewStyles.budgetLabel}>{t.budget?.budget_amount} :</Text>
        <Text style={[
          overviewStyles.budgetValue,
        ]}>
          {statBudgetMensuel ? statBudgetMensuel.nombreBudgets : 0}
        </Text>
      </View>

      {/* AVERTISSEMENT SI BUDGET DÉPASSÉ AVEC ICÔNE */}
      {hasBudgetsDepasses && (
        <TouchableOpacity 
          style={overviewStyles.warningButton}
          onPress={() => setModalVisible(true)}
        >
          <View style={overviewStyles.warningContent}>
            <MaterialIcons name="warning" size={16} color="#e74c3c" />
            <Text style={overviewStyles.warningText}>
              {statBudgetMensuel?.budgets_depasses?.length} {t.budget?.over_budget}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* MODAL DES BUDGETS DÉPASSÉS */}
      <BudgetDepasseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        budgetsDepasses={statBudgetMensuel?.budgets_depasses || []}
      />
 
    </View>
  );
};


export default BudgetOverview;


const overviewStyles =  StyleSheet.create({

  overviewContainer: {
    backgroundColor: '#ffffff',
    marginBottom: 10,
    marginTop: 4,
    borderRadius: 6,
    padding: 12,
    
    // shadowColor: '#000', 
    // shadowOffset: { width: 0, height: 2 }, 
    // shadowOpacity: 0.1, 
    // shadowRadius: 6, 
    // elevation: 4, 
    overflow: 'hidden', 
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
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    color: '#1a171a',
    // fontWeight: 'bold',
    flex: 1, 
  },

  // CONTENEUR DU MONTANT TOTAL
  amountContainer: {
    backgroundColor: '#fdf3c6', 
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 10, 
  },

  // MONTANT TOTAL 
  overviewAmount: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
    color: '#8e5f46ff', 
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
  progressBarFill: {
    height: '100%', 
    borderRadius: 4,
  },

  // TEXTE DU POURCENTAGE DE PROGRESSION
  progressText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
    color: '#1a171a',
    // fontWeight: 'bold',
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
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
    color: '#1a171a',
    opacity: 0.8,
  },

  // VALEUR DES INFORMATIONS BUDGÉTAIRES
  budgetValue: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
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
    fontSize: Platform.OS == 'ios' ? 12 : 10,
    fontFamily:'Poppins-Bold',
    // fontWeight: 'bold',
  },

  // LABEL GÉNÉRIQUE
  label: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Poppins' : 'Poppins-Regular',
    color: '#1a171a',
    opacity: 0.8,
  },
});