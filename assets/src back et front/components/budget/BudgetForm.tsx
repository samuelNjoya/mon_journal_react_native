import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform, 
  ScrollView, Animated, LayoutAnimation, KeyboardAvoidingView, StyleSheet, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CategoryLine from './CategoryLine';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Ionicons, MaterialIcons, FontAwesome5, Feather, MaterialCommunityIcons, EvilIcons } from '@expo/vector-icons';
import { LigneCategorieType, CycleType, BudgetType } from '../../types/BudgetType';
import { useBudget } from '../../context/BudgetsContext';
import { BudgetService } from '../../services/BudgetService';
import { ApiResponseType } from '../../types/ApiResponseType';
import { useTranslation } from '../../hooks/useTranslation';
import { Translations } from '../../types';


// DÉTECTION DE LA LARGEUR D'ÉCRAN POUR LE RESPONSIVE
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface BudgetFormProps {
  budgetData: BudgetType;                         
  updateBudgetForm: (newData: Partial<BudgetType>) => void; 
  onAddBudget: (budget: BudgetType, t: Translations) =>Promise<any>; // Callback pour l'ajout
  isEditMode?: boolean; // mode édition
  budgetToEdit?: BudgetType | null; // Budget à modifier
  onUpdateBudget?: (budgetData: BudgetType, t: Translations) => Promise<any>; // Callback pour la mise à jour
  onCancelEdit?: (t: Translations) => void; // Callback pour annuler l'édition    
}

const BudgetForm: React.FC<BudgetFormProps> = ({ budgetData, updateBudgetForm, onAddBudget,
  isEditMode = false, budgetToEdit = null, onUpdateBudget, onCancelEdit}) => {

  const { montantBudget, dateDebut, dateFin, libelle, 
    ligneCategorie, budgetType, typeCycle } = budgetData;  
  
  const scrollViewRef = useRef<ScrollView>(null);
  const contentViewRef = useRef<View>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
  const [startDateValue, setStartDateValue] = useState<Date>(new Date());
  const [endDateValue, setEndDateValue] = useState<Date>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  
  const [isExpanded, setIsExpanded] = useState<boolean>(true); // Toujours true pour rester ouvert
  
  const [animation] = useState<Animated.Value>(new Animated.Value(1)); // Commence à 1 pour être ouvert
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [showCyclePicker, setShowCyclePicker] = useState<boolean>(false);

  // SUIVI DU NOMBRE DE CATÉGORIES POUR LE SCROLL AUTOMATIQUE
  const prevCategoryLinesLength = useRef<number>(ligneCategorie?.length ?? 0);

  const {showToast, setIsEditMode, setBudgetToEdit, scrollToForm, setShowBudgetForm}= useBudget();

  const { t } = useTranslation();

  useEffect(() => {
    if (isEditMode && budgetToEdit) {

      // Mise à jour complète des données du formulaire avec le budget à modifier
      updateBudgetForm({
        ...budgetToEdit,
        // S'assurer que les dates sont bien des objets Date
        dateDebut: budgetToEdit.dateDebut ? new Date(budgetToEdit.dateDebut) : new Date(),
        dateFin: budgetToEdit.dateFin ? new Date(budgetToEdit.dateFin) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      
      // Initialiser les états locaux des dates
      if (budgetToEdit.dateDebut) {
        setStartDateValue(new Date(budgetToEdit.dateDebut));
      }
      if (budgetToEdit.dateFin) {
        setEndDateValue(new Date(budgetToEdit.dateFin));
      }
      
      //On s'assure que l'accordéon reste ouvert en mode édition
      if (!isExpanded) {
        setIsExpanded(true);
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    }
  }, [isEditMode, budgetToEdit]);


  useEffect(() => {
    // Si une nouvelle catégorie a été ajoutée, scroller vers le bas
    if (ligneCategorie?.length ?? 0 > prevCategoryLinesLength.current) {
      scrollToBottom();
    }
    prevCategoryLinesLength.current = ligneCategorie?.length ?? 0;
  }, [ligneCategorie?.length ?? 0]);
  // ========== FONCTION POUR RÉINITIALISER LE FORMULAIRE ==========
  const resetForm = (): void => {
    updateBudgetForm({
      montantBudget: 0,
      dateDebut: new Date(),
      dateFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      libelle: '',
      ligneCategorie: [{ idLigneCat: Date.now(),idCategorie:0, nomCategorie: '', montantAffecter: 0 }],
      budgetType: 'normal',
      typeCycle: undefined
    });
    setStartDateValue(new Date());
    setEndDateValue(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  };

  // ANIMATION DE L'ACCORDÉON
  const toggleAccordion = (): void => {
    //L'accordéon ne se ferme plus
    /*
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    if (!isExpanded) {
      setIsExpanded(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      // En mode édition, demander confirmation avant de fermer
      if (isEditMode && hasUnsavedChanges()) {
        Alert.alert(
          t.budget.hasUnsavedChanges.title1,
          t.budget.hasUnsavedChanges.title2,
          [
            {
              text: t.budget.hasUnsavedChanges.text1,
              style: "cancel"
            },
            {
              text: t.budget.hasUnsavedChanges.text2,
              style: "destructive",
              onPress: () => {
                Animated.timing(animation, {
                  toValue: 0,
                  duration: 250,
                  useNativeDriver: false,
                }).start(() => {
                  setIsExpanded(false);
                  if (onCancelEdit) {
                    onCancelEdit(t);
                  }
                });
              }
            }
          ]
        );
      } else {
        Animated.timing(animation, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }).start(() => setIsExpanded(false));
      }
    }
    */
  };

  //fonction pour fermer le formulaire
  const onCancelForm= (): void=>{
    // scrollToForm(); 
    setShowBudgetForm(false);
  }

  // ========== FONCTION POUR VÉRIFIER LES CHANGEMENTS NON SAUVEGARDÉS ==========
  const hasUnsavedChanges = (): boolean => {
    if (!budgetToEdit) return true;
    
    return (
      budgetData.libelle !== budgetToEdit.libelle ||
      budgetData.montantBudget !== budgetToEdit.montantBudget ||
      budgetData.dateDebut !== budgetToEdit.dateDebut ||
      budgetData.dateFin !== budgetToEdit.dateFin ||
      budgetData.budgetType !== budgetToEdit.budgetType ||
      budgetData.typeCycle !== budgetToEdit.typeCycle ||
      JSON.stringify(budgetData.ligneCategorie) !== JSON.stringify(budgetToEdit.ligneCategorie)
    );
  };

  // SCROLL VERS LE BAS POUR LES CATÉGORIES
  const scrollToBottom = (): void => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ 
          animated: true 
        });
      }
    }, 500);
  };

  // GESTION DU TYPE DE BUDGET
  const toggleBudgetType = (): void => {
    const newBudgetType = budgetType === 'normal' ? 'cyclique' : 'normal';
    
    if (newBudgetType === 'cyclique') {
      // Si on passe en budget cyclique, définir un cycle par défaut
      updateBudgetForm({ 
        budgetType: newBudgetType,
        typeCycle: typeCycle || 'mensuel' // Garder l'ancien cycle ou mettre mensuel par défaut
      });
    } else {
      // Si on revient en budget normal, supprimer le cycleType
      updateBudgetForm({ 
        budgetType: newBudgetType,
        typeCycle: undefined 
      });
    }
  };

  // SÉLECTION DU TYPE DE CYCLE
  const selectCycleType = (type: CycleType): void => {
    updateBudgetForm({ typeCycle: type });
    setShowCyclePicker(false);
  };

  // ========== GESTION AMÉLIORÉE DES DATES ==========
  const handleDatePress = (type: 'start' | 'end', t: Translations): void => {
    if (type === 'start') {
      setShowStartDatePicker(true);
      setShowEndDatePicker(false);
    } else {
      if (!dateDebut) {
        Alert.alert(t.budget.handleDatePress.title1, t.budget.handleDatePress.message1);
        return;
      }
      setShowEndDatePicker(true);
      setShowStartDatePicker(false);
    }
  };

  // ========== CALLBACK DE SÉLECTION DE DATE - RÈGLES DE GESTION ==========
  const onDateChange = (
    event: any, 
    selectedDate: Date | undefined, 
    type: 'start' | 'end'
  ): void => {
    if (Platform.OS === 'android' && event.type === 'set') {
      type === 'start' ? setShowStartDatePicker(false) : setShowEndDatePicker(false);
    }
    
    if (selectedDate) {
      // RÈGLE DE GESTION : La date de début ne doit jamais être supérieure à la date de fin
      if (type === 'start') {

        if (selectedDate > endDateValue) {
          Alert.alert(
            t.budget.handleDatePress.title2, 
            t.budget.handleDatePress.message2
          );
          
          // date de fin pour être 30 jours après la nouvelle date de début
          const newEndDate = new Date(selectedDate);
          newEndDate.setDate(newEndDate.getDate() + 30);
          
          updateBudgetForm({ 
            dateDebut: selectedDate,
            dateFin: newEndDate
          });
          setStartDateValue(selectedDate);
          setEndDateValue(newEndDate);
        } else {
          // Date de début valide
          updateBudgetForm({ dateDebut: selectedDate });
          setStartDateValue(selectedDate);
        }
      } 
      
      else if (type === 'end') {
        // Si on modifie la date de fin, vérifier qu'elle n'est pas avant la date de début
        if (selectedDate < startDateValue) {
          Alert.alert(
            t.budget.handleDatePress.title2, 
            t.budget.handleDatePress.message3
          );
          return; 
        } else {
          // Date de fin valide
          updateBudgetForm({ dateFin: selectedDate });
          setEndDateValue(selectedDate);
        }
      }
    }
    
    if (Platform.OS === 'ios') {
      type === 'start' ? setShowStartDatePicker(false) : setShowEndDatePicker(false);
    }
  };

  // ========== VALIDATION DES DATES AVANT SOUMISSION ==========
  const validateDates = (): boolean => {
    //Pour les budgets cycliques, on ne valide pas la date de fin
    if (budgetType === 'cyclique') {
      if (!dateDebut) {
        Alert.alert(t.budget.handleDatePress.title4, t.budget.handleDatePress.message4);
        return false;
      }
      return true;
    }

    // Validation normale pour les budgets non cycliques
    if (!dateDebut || !dateFin) {
      Alert.alert(t.budget.handleDatePress.title4, t.budget.handleDatePress.message4);
      return false;
    }

    // RÈGLE PRINCIPALE :  date de début ne doit jamais être supérieure à la date de fin
    if (dateDebut > dateFin) {
      Alert.alert(
        t.budget.handleDatePress.title2, 
        t.budget.handleDatePress.message5
      );
      return false;
    }

    // Validation supplémentaire : la date de fin doit être au moins 1 jour après la date de début
    const oneDayMs = 24 * 60 * 60 * 1000;
    if (dateFin.getTime() - dateDebut.getTime() < oneDayMs) {
      Alert.alert(
        t.budget.handleDatePress.title6,
        t.budget.handleDatePress.message6
      );
      return false;
    }

    return true;
  };

  // AJOUT D'UNE ligne CATÉGORIE
  const addCategoryLine = (): void => {
    const newLine: LigneCategorieType = { 
      idLigneCat: Date.now(),
      idCategorie: 0, 
      nomCategorie: '', 
      montantAffecter: 0 
    };
    updateBudgetForm({ 
      ligneCategorie: [...(ligneCategorie ?? []), newLine] 
    });
  };

  // SUPPRESSION D'UNE CATÉGORIE
  const removeCategoryLine = (id: number): void => {
    if ((ligneCategorie ?? []).length > 1) {
      updateBudgetForm({ 
        ligneCategorie: (ligneCategorie ?? []).filter(line => line.idLigneCat !== id) 
      });
    } else {
      Alert.alert('Erreur', t.budget.handleDatePress.error_msg);
    }
  };

// MISE À JOUR D'UNE LIGNE DE CATÉGORIE
const updateCategoryLine = (id: number, field: keyof LigneCategorieType, value: string | number, idCat?: number): void => {
  const updatedLines = (ligneCategorie ?? []).map(line => {
    if (line.idLigneCat === id) {
      // Créer un objet de mise à jour de base
      const updatedLine: any = {
        ...line,
        [field]: value
      };
      
      // Ajout de idCategorie seulement si idCat est fourni
      if (idCat !== undefined) {
        updatedLine.idCategorie = idCat;
      }
      
      return updatedLine; 
    }
    return line;
  });
  
  // console.log(updatedLines);
  updateBudgetForm({ ligneCategorie: updatedLines });
};


  // ========== FONCTION DE SOUMISSION POUR L'AJOUT ==========
const handleAdd = async (t: Translations) => {
  // VALIDATIONS EXISTANTES (garder toutes vos validations actuelles)
  if (!montantBudget || !libelle) {
    Alert.alert(t.budget.handleAdd.title1, t.budget.handleAdd.message1);
    return;
  }

  // VALIDATION DES DATES AVEC LES NOUVELLES RÈGLES
  if (!validateDates()) {
    return;
  }

  // Validation supplémentaire pour les budgets cycliques
  if (budgetType === 'cyclique' && !typeCycle) {
    Alert.alert(t.budget.handleAdd.title2, t.budget.handleAdd.message2);
    return;
  }

  const totalCategories = (ligneCategorie ?? []).reduce((sum, line) => {
    return sum + ((line.montantAffecter) || 0);
  }, 0);

  if (totalCategories > montantBudget) {
    Alert.alert(t.budget.handleAdd.title3, `${t.budget.handleAdd.message3} (${totalCategories} FCFA) ${t.budget.handleAdd.message5} (${montantBudget} FCFA)`);
    return;
  }

  const hasEmptyCategories = (ligneCategorie ?? []).some(line => 
    !line.nomCategorie || !line.montantAffecter || line.idCategorie === 0
  );
  
  if (hasEmptyCategories) {
    Alert.alert(t.budget.handleAdd.title4, t.budget.handleAdd.message4);
    return;
  }

   try {
    // APPEL DE LA FONCTION addBudget DU CONTEXTE QUI GÈRE L'APPEL API
    const response: ApiResponseType = await onAddBudget(budgetData, t);
    
    if (response.statut == true) {

      // RÉINITIALISATION DU FORMULAIRE APRÈS SOUMISSION (message )
      if(response.data){
        resetForm();
        setShowBudgetForm(false);
        //On ne ferme pas l'accordéon après soumission
        // setIsExpanded(false);
        // animation.setValue(0);
      }
  
    }
    
  } catch (error) {
    console.error(t.budget.handleAdd.error_msg, error);
    showToast(t.budget.handleAdd.error_msg, 'warning');
  }
};



// ========== FONCTION DE SOUMISSION POUR LA MODIFICATION ==========
const handleUpdate = async (t: Translations) => {
  // VALIDATIONS EXISTANTES (identique à handleAdd)
  if (!montantBudget || !libelle) {
    Alert.alert(t.budget.handleAdd.title1, t.budget.handleAdd.message1);
    return;
  }

  if (!validateDates()) {
    return;
  }

  // Validation supplémentaire pour les budgets cycliques
  if (budgetType === 'cyclique' && !typeCycle) {
     Alert.alert(t.budget.handleAdd.title2, t.budget.handleAdd.message2);
    return;
  }

  const totalCategories = (ligneCategorie ?? []).reduce((sum, line) => {
    return sum + ((line.montantAffecter) || 0);
  }, 0);

  if (totalCategories > montantBudget) {
     Alert.alert(t.budget.handleAdd.title3, `${t.budget.handleAdd.message3} (${totalCategories} FCFA) ${t.budget.handleAdd.message5} (${montantBudget} FCFA)`);
    return;
  }

  const hasEmptyCategories = (ligneCategorie ?? []).some(line => 
    !line.nomCategorie || !line.montantAffecter || line.idCategorie === 0
  );
  
  if (hasEmptyCategories) {
    Alert.alert(t.budget.handleAdd.title4, t.budget.handleAdd.message4);
    return;
  }

  // MISE À JOUR DU BUDGET 
  if (onUpdateBudget) {
     try {

    const response: ApiResponseType = await onUpdateBudget(budgetData, t);
    
    if (response.statut == true) {
      if(response.data){
        resetForm();
        setShowBudgetForm(false);
        setIsEditMode(false); 
        setBudgetToEdit(null);
      
      // On ne ferme pas le formulaire après mise à jour
      /*
      Animated.timing(animation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start(() => {
        setIsExpanded(false);
      });
      */
      }
  
    }  
  } catch (error) {
    console.error(t.budget.handleUpdate.error_msg, error);
    showToast(t.budget.handleUpdate.error_msg, 'warning');
  }
  }
};

  // ========== FONCTION UNIFIÉE DE SOUMISSION ==========
  const handleSubmit = (t: Translations): void => {
    if (isEditMode) {
      handleUpdate(t);
    } else {
      handleAdd(t);
    }
  };

  // ========== FONCTION POUR ANNULER L'ÉDITION ==========
  const handleCancelEdit = (): void => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        t.budget.hasUnsavedChanges.title1,
          t.budget.hasUnsavedChanges.title2,
        [
          {
            text: t.budget.hasUnsavedChanges.text1,
            style: "cancel"
          },
          {
            text: t.budget.hasUnsavedChanges.text2,
            style: "destructive",
            onPress: () => {
              //On ne ferme pas l'accordéon, on garde juste la logique d'annulation
              if (onCancelEdit) {
                onCancelEdit(t);
                setShowBudgetForm(false);
              }
              
              /*
              Animated.timing(animation, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false,
              }).start(() => {
                setIsExpanded(false);
                if (onCancelEdit) {
                  onCancelEdit(t);
                }
              });
              */
            }
          }
        ]
      );
    } else {
      //On ne ferme pas l'accordéon, on garde juste la logique d'annulation
      if (onCancelEdit) {
        onCancelEdit(t);
        setShowBudgetForm(false);
      }
      
      /*
      Animated.timing(animation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start(() => {
        setIsExpanded(false);
        if (onCancelEdit) {
          onCancelEdit(t);
        }
      });
      */
    }
  };

  // MESURE DE LA HAUTEUR DU CONTENU POUR L'ANIMATION
  const onContentLayout = (event: any): void => {
    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
  };

  // HAUTEUR ANIMÉE POUR L'ACCORDÉON 
  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    // L'accordéon est toujours ouvert à sa hauteur complète
    outputRange: [Math.min(contentHeight, screenHeight * 0.7), Math.min(contentHeight, screenHeight * 0.7)],
  });

  // ICÔNES POUR LES TYPES DE CYCLE
  const getCycleIcon = (type: CycleType) => {
    switch (type) {
      case 'hebdomadaire':
        return <MaterialIcons name="date-range" size={20} color="#fcbf00" />;
      case 'mensuel':
        return <FontAwesome5 name="calendar-alt" size={18} color="#fcbf00" />;
      case 'annuel':
        return <MaterialCommunityIcons name="calendar-star" size={20} color="#fcbf00" />;
      default:
        return <Ionicons name="calendar" size={20} color="#fcbf00" />;
    }
  };

  // LIBELLÉS POUR LES TYPES DE CYCLE
  const getCycleLabel = (type: CycleType, t: Translations) => {
    switch (type) {
      case 'hebdomadaire':
        return t.budget.weekly_type;
      case 'mensuel':
        return t.budget.monthly_type;
      case 'annuel':
        return t.budget.annual_type;
      default:
        return t.budget.seach_cycle;
    }
  };

  // ========== TEXTE DYNAMIQUE SELON LE MODE ==========
  const getFormTitle = (titleAccordeonAdd : string, titleAccordeonUpdate: string ): string => {
    return isEditMode ? titleAccordeonUpdate : titleAccordeonAdd;
  };

  const getSubmitButtonText = (btn_add_budget: string, btn_update_budget: string, cyclical_type: string): string => {
    return isEditMode 
      ? `${btn_update_budget} ${budgetType === 'cyclique' ? cyclical_type : ''}`
      : `${btn_add_budget} ${budgetType === 'cyclique' ? cyclical_type : ''}`;
  };

  return (
    <View style={budgetFormStyles.accordionContainer}>
      {/* EN-TÊTE DE L'ACCORDÉON AVEC TITRE DYNAMIQUE */}
      
      <View 
        style={budgetFormStyles.accordionHeader} 
      >
        <Text style={budgetFormStyles.accordionTitle}>{getFormTitle(t.budget.title_accordeon_add, t.budget.title_accordeon_update)}</Text>
        {/* <MaterialIcons name='keyboard-arrow-down' size={22} color='#000'/> */}
         <EvilIcons name="close" size={22} color='#000' 
         onPress={onCancelForm} 
        />
      </View>

      {/* CONTENU DE L'ACCORDÉON  */}
      <Animated.View style={[budgetFormStyles.accordionContent, { height: animatedHeight }]}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {/* SCROLLVIEW POUR LE CONTENU DÉFILANT */}
          <ScrollView 
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={budgetFormStyles.scrollContent}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
            overScrollMode="never"
            bounces={true}
            scrollEventThrottle={16}
            onContentSizeChange={() => {
              if ((ligneCategorie ?? []).length > prevCategoryLinesLength.current) {
                scrollToBottom();
              }
            }}
          >
            {/* CONTENU MESURÉ POUR L'ANIMATION */}
            <View 
              ref={contentViewRef}
              onLayout={onContentLayout}
              style={budgetFormStyles.contentWrapper}
            >

              {/* SWITCH BUDGET CYCLIQUE  */}
              <View style={budgetFormStyles.budgetTypeContainer}>
                <View style={budgetFormStyles.budgetTypeLabelContainer}>
                  <MaterialCommunityIcons 
                    name="sync" 
                    size={20} 
                    color={budgetType === 'cyclique' ? '#fcbf00' : '#666'} 
                  />
                  <Text style={[
                    budgetFormStyles.budgetTypeLabel,
                    budgetType === 'cyclique' && budgetFormStyles.budgetTypeLabelActive
                  ]}>
                    {t.budget.cyclical_budget}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  style={[
                    budgetFormStyles.toggleSwitch,
                    budgetType === 'cyclique' && budgetFormStyles.toggleSwitchActive
                  ]}
                  onPress={toggleBudgetType}
                  activeOpacity={0.9}
                >
                  <View style={[
                    budgetFormStyles.toggleCircle,
                    budgetType === 'cyclique' && budgetFormStyles.toggleCircleActive
                  ]} />
                </TouchableOpacity>
              </View>

              {/* SELECTEUR DE TYPE DE CYCLE - APPARAIT SEULEMENT POUR BUDGET CYCLIQUE */}
              {budgetType === 'cyclique' && (
                <View style={budgetFormStyles.cycleTypeSection}>
                  <Text style={budgetFormStyles.cycleTypeLabel}>{t.budget.cyclical_budget_type}</Text>
                  
                  <TouchableOpacity 
                    style={budgetFormStyles.cycleTypeSelector}
                    onPress={() => setShowCyclePicker(!showCyclePicker)}
                    activeOpacity={0.7}
                  >
                    <View style={budgetFormStyles.cycleTypeSelectorContent}>
                      {typeCycle && getCycleIcon(typeCycle)}
                      <Text style={budgetFormStyles.cycleTypeSelectorText}>
                        {typeCycle ? getCycleLabel(typeCycle, t) : 'Choisir un cycle'}
                      </Text>
                    </View>
                    <Feather 
                      name={showCyclePicker ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>

                  {/* MENU DÉROULANT DES TYPES DE CYCLE */}
                  {showCyclePicker && (
                    <View style={budgetFormStyles.cycleTypeDropdown}>
                      {(['hebdomadaire', 'mensuel', 'annuel'] as CycleType[]).map((type) => (
                        <TouchableOpacity
                          key={type}
                          style={[
                            budgetFormStyles.cycleTypeOption,
                            typeCycle === type && budgetFormStyles.cycleTypeOptionActive
                          ]}
                          onPress={() => selectCycleType(type)}
                          activeOpacity={0.7}
                        >
                          {getCycleIcon(type)}
                          <Text style={[
                            budgetFormStyles.cycleTypeOptionText,
                            typeCycle === type && budgetFormStyles.cycleTypeOptionTextActive
                          ]}>
                            {getCycleLabel(type, t)}
                          </Text>
                          {typeCycle === type && (
                            <Ionicons name="checkmark" size={18} color="#fcbf00" />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              )}
              
              <View style={[
                budgetFormStyles.row
              ]}>
                <View style={budgetFormStyles.inputGroup}>
                  <Text style={budgetFormStyles.label}>{t.budget.budget_label}</Text>
                  <TextInput
                    style={budgetFormStyles.input}
                    value={libelle} 
                    onChangeText={(text) => updateBudgetForm({ libelle: text })}
                    placeholder={t.budget.input_budget}
                    placeholderTextColor="#9e9e9e"
                  />
                </View>
                
                <View style={budgetFormStyles.inputGroup}>
                  <Text style={budgetFormStyles.label}>{t.budget.budget_amount}</Text>
                  <TextInput
                    style={budgetFormStyles.input}
                    value={montantBudget === 0 ? '': montantBudget.toString()} 
                    onChangeText={(text) => {
                        const numericValue = text === '' ? 0 : parseFloat(text);
                        updateBudgetForm({ 
                          montantBudget: isNaN(numericValue) ? 0 : numericValue 
                        });
                      }}
                      placeholder='0'
                    placeholderTextColor="#9e9e9e"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={[
                budgetFormStyles.row,
                screenWidth < 375 ? budgetFormStyles.rowSmallScreen : null
              ]}>
                {/* Date de début  */}
                <View style={[
                  budgetFormStyles.inputGroup,
                  budgetType === 'cyclique' && budgetFormStyles.fullWidthInputGroup
                ]}>
                  <Text style={budgetFormStyles.label}>{t.budget.start_date}</Text>
                  <TouchableOpacity 
                    style={budgetFormStyles.inputWithIcon}
                    onPress={() => handleDatePress('start', t)}
                  >
                    <TextInput
                      style={budgetFormStyles.textInput}
                      value={new Date(dateDebut).toISOString().split('T')[0]}
                      editable={false}
                      placeholder="JJ/MM/AAAA"
                      placeholderTextColor="#9e9e9e"
                    />
                    <View style={budgetFormStyles.iconContainer}>
                      <AntDesign name="calendar" size={16} color="#666" />
                    </View>
                  </TouchableOpacity>
                </View>
                
                {/* Date de fin */}
                {budgetType !== 'cyclique' && (
                  <View style={budgetFormStyles.inputGroup}>
                    <Text style={budgetFormStyles.label}>{t.budget.end_date}</Text>
                    <TouchableOpacity 
                      style={budgetFormStyles.inputWithIcon}
                      onPress={() => handleDatePress('end', t)}
                    >
                      <TextInput
                        style={budgetFormStyles.textInput}
                        value={new Date(dateFin).toISOString().split('T')[0]} 
                        editable={false}
                        placeholder="JJ/MM/AAAA"
                        placeholderTextColor="#9e9e9e"
                      />
                      <View style={budgetFormStyles.iconContainer}>
                        <AntDesign name="calendar" size={16} color="#666" />
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* PICKERS DE DATE */}
              {showStartDatePicker && (
                <DateTimePicker
                  value={startDateValue}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, date) => onDateChange(event, date, 'start')}
                />
              )}
              
              {showEndDatePicker && (
                <DateTimePicker
                  value={endDateValue}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, date) => onDateChange(event, date, 'end')}
                  minimumDate={startDateValue} 
                />
              )}

              {/* SECTION DES CATÉGORIES */}
              <View style={budgetFormStyles.categorySection}>
                <Text style={budgetFormStyles.sectionTitle}>{t.budget.allocation_category}</Text>
                
                {/* LIGNES DE CATÉGORIES   */}
                {(ligneCategorie ?? []).map((line, index) => (
                  <CategoryLine
                    key={line.idLigneCat}
                    lineCategorie={line}
                    index={index}
                    onUpdateCategorieLine={(id, field, value, idCategorie) => updateCategoryLine(id, field as keyof LigneCategorieType, value, idCategorie)}
                    onRemoveCategorieLine={removeCategoryLine}
                    isRemovable={(ligneCategorie ?? []).length > 1}
                  />
                ))}
                
                
                {/* BOUTON AJOUTER CATÉGORIE */}
                <TouchableOpacity 
                  style={budgetFormStyles.addLineButton} 
                  onPress={addCategoryLine}
                  activeOpacity={0.7}
                >
                  <View style={budgetFormStyles.addLineIconContainer}>
                    <Text style={budgetFormStyles.addLineIcon}>+</Text>
                  </View>
                  <Text style={budgetFormStyles.addLineText}>{t.budget.add_category}</Text>
                </TouchableOpacity>
              </View>

              {/* BOUTONS DE SOUMISSION */}
              <View style={budgetFormStyles.actionsContainer}>
                {/* BOUTON DE SOUMISSION PRINCIPAL */}
                <TouchableOpacity 
                  style={[
                    budgetFormStyles.addButton,
                    budgetType === 'cyclique' && budgetFormStyles.addButtonCyclique
                  ]} 
                  onPress={() => handleSubmit(t)}
                  activeOpacity={0.8}
                >
                  <Text style={budgetFormStyles.addButtonText}>
                    {getSubmitButtonText(t.budget.btn_add_budget, t.budget.btn_update_budget, t.budget.cyclical_type)}
                  </Text>
                </TouchableOpacity>

                {/* BOUTON ANNULER EN MODE ÉDITION */}
                {isEditMode && (
                  <TouchableOpacity 
                    style={budgetFormStyles.cancelEditButton}
                    onPress={handleCancelEdit}
                    activeOpacity={0.7}
                  >
                    <Text style={budgetFormStyles.cancelEditButtonText}>{t.budget.cancel}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
};

export default BudgetForm;
export const budgetFormStyles = StyleSheet.create({
  // Conteneur principal de l'accordéon
  accordionContainer: {
    backgroundColor: '#ffffff', 
    marginBottom: 10,
    borderRadius: 8, 
    // shadowColor: '#000', 
    // shadowOffset: { width: 0, height: 2 }, 
    // shadowOpacity: 0.1, 
    shadowRadius: 6, 
    // elevation: 4, 
    overflow: 'hidden', 
  },
  
  // En-tête de l'accordéon
  accordionHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 10,
    backgroundColor: '#f8f9fa', 
    height: 48, 
  },
  
  // Titre de l'accordéon
  accordionTitle: {
    fontSize: 14, 
    fontFamily: 'Poppins-Medium', 
    color: '#1a171a', 
  },
  
  // Icône de l'accordéon
  accordionIcon: {
    marginLeft: 10, 
  },
  
  // Contenu de l'accordéon
  accordionContent: {
    overflow: 'hidden', 
  },
  
  //Contenu de la scrollview
  scrollContent: {
    flexGrow: 1, 
  },
  
  //Wrapper du contenu mesuré
  contentWrapper: {
    padding: 16, 
  },

  //Bouton d'annulation (ancien style)
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDEDED',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F5B7B1',
  },
  
  // Texte du bouton d'annulation
  cancelButtonText: {
    color: '#E74C3C',
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 8,
  },
  
  // Conteneur des actions
  actionsContainer: {
    marginTop: 16,
  },
  
  // Bouton d'annulation en mode édition
  cancelEditButton: {
    backgroundColor: 'transparent',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E74C3C',
  },
  
  // Texte du bouton d'annulation en mode édition
  cancelEditButtonText: {
    color: '#E74C3C',
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
  },

  // Conteneur du type de budget
  budgetTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  
  // Conteneur du label du type de budget
  budgetTypeLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Label du type de budget
  budgetTypeLabel: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#666',
    marginLeft: 8,
  },
  
  // Label du type de budget actif
  budgetTypeLabelActive: {
    color: '#fcbf00',
  },
  
  // Toggle switch
  toggleSwitch: {
    width: 50,
    height: 28,
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    padding: 2,
    justifyContent: 'center',
  },
  
  // Toggle switch activé
  toggleSwitchActive: {
    backgroundColor: '#fcbf00',
  },
  
  // Cercle du toggle
  toggleCircle: {
    width: 24,
    height: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    transform: [{ translateX: 0 }],
  },
  
  // Cercle du toggle activé
  toggleCircleActive: {
    transform: [{ translateX: 22 }],
  },
  
  // Section du type de cycle
  cycleTypeSection: {
    marginBottom: 16,
  },
  
  // Label du type de cycle
  cycleTypeLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#1a171a',
    marginBottom: 6,
    opacity: 0.8,
  },
  
  // Sélecteur de type de cycle
  cycleTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    backgroundColor: '#fafafa',
    minHeight: Platform.OS === 'ios' ? 44 : 42,
  },
  
  // Contenu du sélecteur de cycle
  cycleTypeSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Texte du sélecteur de cycle
  cycleTypeSelectorText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#1a171a',
    marginLeft: 8,
  },
  
  // Menu déroulant des cycles
  cycleTypeDropdown: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  
  // Option de cycle
  cycleTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  
  // Option de cycle active
  cycleTypeOptionActive: {
    backgroundColor: '#fff9e6',
  },
  
  // Texte de l'option de cycle
  cycleTypeOptionText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#1a171a',
    marginLeft: 8,
  },
  
  // Texte de l'option de cycle active
  cycleTypeOptionTextActive: {
    color: '#fcbf00',
    fontFamily: 'Poppins-SemiBold',
  },
  
  // Ligne d'éléments
  row: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 12, 
    marginBottom: 1, 
  },
  
  // Ligne adaptée aux petits écrans
  rowSmallScreen: {
    flexDirection: 'column', 
    gap: 8, 
  },
  
  // Groupe de champs
  inputGroup: {
    flex: 1, 
    marginBottom: 12, 
  },
  
  //  Groupe de champs en pleine largeur
  fullWidthInputGroup: {
    flex: 1,
    width: '100%',
  },
  
  // Label des champs
  label: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular', 
    color: '#1a171a', 
    marginBottom: 6, 
    opacity: 0.8, 
  },
  
  // Champ de saisie
  input: {
    borderWidth: 1, 
    borderColor: '#e0e0e0', 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    paddingVertical: Platform.OS === 'ios' ? 12 : 10, 
    fontSize: 12, 
    backgroundColor: '#fafafa', 
    fontFamily: 'Poppins-Regular', 
    minHeight: Platform.OS === 'ios' ? 44 : 42, 
  },
  
  // Champ avec icône
  inputWithIcon: {
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#e0e0e0', 
    borderRadius: 8, 
    backgroundColor: '#fafafa', 
    minHeight: Platform.OS === 'ios' ? 40 : 38, 
  },
  
  // Champ texte dans inputWithIcon
  textInput: {
    flex: 1,
    paddingHorizontal: 12, 
    paddingVertical: Platform.OS === 'ios' ? 12 : 10, 
    fontSize: 12, 
    fontFamily: 'Poppins-Regular', 
    color: '#1a171a', 
  },
  
  // Conteneur d'icône
  iconContainer: {
    paddingHorizontal: 12, 
    paddingVertical: 10, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  
  // Section des catégories
  categorySection: {
    marginTop: 2, 
  },
  
  // Titre de section
  sectionTitle: {
    fontSize: 14, 
    fontFamily: 'Poppins-Regular', 
    color: '#1a171a', 
    marginBottom: 12, 
  },
  
  // Bouton d'ajout de ligne
  addLineButton: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1, 
    borderColor: '#fcbf00', 
    borderStyle: 'dashed',
    borderRadius: 8, 
    padding: 10, 
    marginTop: 8, 
  },
  
  // Conteneur de l'icône d'ajout
  addLineIconContainer: {
    width: 20, 
    height: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 8, 
  },
  
  // Icône d'ajout
  addLineIcon: {
    fontSize: 16, 
    color: '#fcbf00', 
    fontFamily: 'Poppins-Bold', 
    lineHeight: Platform.OS === 'ios' ? 18 :9 , 
  },
  
  // Texte d'ajout de ligne
  addLineText: {
    fontSize: 13, 
    color: '#fcbf00', 
    fontFamily: 'Poppins-Regular',
  },
  
  // Bouton d'ajout principal
  addButton: {
    backgroundColor: '#fcbf00', 
    padding: 10, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 16, 
    marginBottom: 8, 
    justifyContent: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3, 
  },
  
  // Bouton d'ajout pour budget cyclique
  addButtonCyclique: {
    backgroundColor: '#fcbf00',
  },
  
  // Texte du bouton d'ajout
  addButtonText: {
    color: '#000000',
    fontSize: 13, 
    fontFamily: 'Poppins-Bold',
  },
});
