import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { BudgetType, CategorieType } from "../types/BudgetType";
import { Alert, ScrollView } from "react-native";
import Toast from "../components/Toast";
import Spinner from "../components/Spinner";
import { BudgetService} from "../services/BudgetService";
import { ApiResponseType } from "../types/ApiResponseType";

import { Category, useExpenses } from "./ExpenseContext"; //pour centraliser les données du ExpenseContexte a celui ci
import { Translations } from "../types";
import { useTranslation } from "../hooks/useTranslation";

// ========== TYPE DU CONTEXTE ==========
interface BudgetContextType {

  budgetData: BudgetType;
  setBudgetData: React.Dispatch<React.SetStateAction<BudgetType>>;
  isEditMode: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  budgetToEdit: BudgetType | null;
  setBudgetToEdit: React.Dispatch<React.SetStateAction<BudgetType | null>>;
  scrollViewRef: React.RefObject<ScrollView | null>;
  selectedStatus: string;
  setSelectedStatus: React.Dispatch<React.SetStateAction<string>>;
  statBudgetMensuel: BudgetType | null;
  setStatBudgetMensuel: React.Dispatch<React.SetStateAction<BudgetType | null>>;

  showBudgetForm: boolean;
  setShowBudgetForm: React.Dispatch<React.SetStateAction<boolean>>;

  //Etat pagination
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage: number;
  setItemsPerPage:  React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number;
  setTotalItems: React.Dispatch<React.SetStateAction<number>>;
  showItemsPerPageDropdown: boolean;
  setShowItemsPerPageDropdown:  React.Dispatch<React.SetStateAction<boolean>>;

  // Liste des budgets avec pagination
  listebudgets: BudgetType[];
  setListebudgets: React.Dispatch<React.SetStateAction<BudgetType[]>>;
  listeCategorie: Category[];
  setListeCategorie: React.Dispatch<React.SetStateAction<Category[]>>;
  toastConfig: {
    visible: boolean;
    message: string;
    type: 'success' | 'warning';
  };
  showToast: (message: string, type?: 'success' | 'warning') => void;
  hideToast: () => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Fonctions de gestion des budgets
  addBudget: (budget: BudgetType, t: Translations) => Promise<any>;
  onUpdateBudget: (updatedBudget: BudgetType, t: Translations) => Promise<any>;
  onDeleteBudget:(idBudget: number, t: Translations)=> Promise<any>;
  onStopBudgetCyclique: (idBudget: number, t: Translations)=> Promise<any>;

  // Fonctions d'édition
  handleEditBudget: (budget: BudgetType) => void;
  handleCancelEdit: (t: Translations) => void;
  updateBudgetForm: (newData: Partial<BudgetType>) => void;
  scrollToForm: () => void;

  // Fonctions de chargement 
  getCollectionBudget: (page?: number, itemsPerPage?: number, statut?: string) => Promise<ApiResponseType>;
  chargerBudgetsFiltres:(page?:number, itemsPerPage?:number, selectedStatus?:string) => void;
  getMounth: (statistiqueMensuel: BudgetType)=>string | undefined;
}

// ========== CRÉATION DU CONTEXTE ==========
export const BudgetContext = createContext<BudgetContextType | undefined>(undefined);



// ========== PROPS DU PROVIDER ==========
interface BudgetProviderProps {
  children: ReactNode;
}

// ========== DONNÉES INITIALES DU FORMULAIRE ==========
const initialBudgetData: BudgetType = {
  montantBudget: 0, 
  dateDebut: new Date(), 
  dateFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
  libelle: '', 
  ligneCategorie: [{ 
    idLigneCat: Date.now(),
    idCategorie: 0, 
    nomCategorie: '', 
    montantAffecter: 0 
  }],
  budgetType: 'normal', 
  typeCycle: undefined 
};

// ========== COMPOSANT PROVIDER ==========
export const BudgetProvider: React.FC<BudgetProviderProps> = ({ children }) => {

  const { categories, loadBudgets, loadBudgetsForFilter } = useExpenses(); //appel des donnees du contexte pour unifier 

  const [budgetData, setBudgetData] = useState<BudgetType>(initialBudgetData);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [budgetToEdit, setBudgetToEdit] = useState<BudgetType | null>(null);
  const [listeCategorie, setListeCategorie] = useState<CategorieType[]>([]);
  const [listebudgets, setListebudgets] = useState<BudgetType[]>([]); // État pour la liste des budgets
  const [selectedStatus, setSelectedStatus] = useState<string>('tous'); // État pour le filtre de statut
  const [statBudgetMensuel, setStatBudgetMensuel] = useState<BudgetType | null>(null);
  const [showBudgetForm, setShowBudgetForm] = useState<boolean>(false); //Etat pour caher et afficher le formulaire budget

    // ========== ÉTATS POUR LA PAGINATION   ==========
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10); // 10 éléments par défaut
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number >(0);
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState<boolean>(false);

  const {t, language} = useTranslation();
  // États pour Toast
  const [toastConfig, setToastConfig] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'warning'
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const  scrollViewRef = useRef<ScrollView>(null);
  
  // Fonctions pour gérer le Toast
  const showToast = (message: string, type: 'success' | 'warning' = 'success') => {
    setToastConfig({visible: true,message,type});
  };
  
  const hideToast = () => {
    setToastConfig(prev => ({ ...prev, visible: false }));
  };

  // Fonction pour gérer le loading
  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  // Ramène l'utilisateur en haut de l'écran vers le formulaire
  const scrollToForm = (): void => {
    setTimeout(() => {
      if (  scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ 
          y: 100, //1500 0
          animated: true 
        });
      }
    }, 100);
  };

  useEffect(() => {
    statistiqueBudgetMensuel();
    checkAndUpdateExpiredBudgetsCycliques();
  }, []);

  // ========== FONCTION LISTE DES BUDGETS AVEC PAGINATION ==========
  const getCollectionBudget = async (page: number = 1, itemsPerPage: number = 10, statut?: string): Promise<ApiResponseType> => {
    try {
      
      const response:ApiResponseType  = await BudgetService.getAllBudgets(page, itemsPerPage, statut);
      
      if (response.statut === true) {

        // Mettre à jour la liste des budgets dans le contexte
        setListebudgets(response.data || []);
        setTotalItems(response.pagination?.total || 0) // Mettre à jour le total des éléments pour la pagination
        setItemsPerPage(response.pagination?.element_par_page || 0) // Mettre à jour les éléments par page
        setTotalPages(response.pagination?.total_pages || 0); // Mettre à jour le total des pages

        await statistiqueBudgetMensuel();
        return response;
      } else {
        console.error('Erreur API:', response.message);
        setListebudgets([]);
        return response;
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des budgets:', error.message || error);
      setListebudgets([]);
      throw error;
    }
  };

  //recuperer le mon a partir de la langague
  const getMounth = (statistiqueMensuel: BudgetType): string | undefined =>{
      if(language === 'en'){
        return statBudgetMensuel?.mois_en;
      }else{
         return statBudgetMensuel?.mois;
      }

  }


  //Statistique budget mensuel
  const statistiqueBudgetMensuel = async () =>{
    try{

      const statistiques = await BudgetService.statistiqueBudgetMensuel();
      setStatBudgetMensuel(statistiques);

    } catch(error) {
      console.error('Erreur lors de la recuperation des statistique du budget mensuel', error);
    }
  }
    
  //FONCTION POUR RENOUVELER LE CYCLE D'UN BUDGET CYCLIQUE
  const checkAndUpdateExpiredBudgetsCycliques = async()=>{
    try{
      const response = await BudgetService.checkAndUpdateExpiredBudgetsCyclique();
      if(response.statut === true){
        showToast(t.budget.msg_renew_budget,'success');
        
        await chargerBudgetsFiltres(page, itemsPerPage,selectedStatus);
      }
    }catch(error) {
      console.error('Erreur lors du renouvellement du budget cyclique', error);
    }
  }

// Fonction pour recharger les budgets en fonction du statut sélectionné et de la pagination
  const chargerBudgetsFiltres = async (page?: number,itemsPerPage?: number,selectedStatus?: string) : Promise<void> =>  {
    let statutBudget = 'tous'; // Valeur par défaut pour recharger tous les budgets

    switch (selectedStatus) {
        case 'En cours':
            statutBudget = 'En cours';
            break;
        case 'Terminé':
            statutBudget = 'Terminé';
            break;
        default:
            statutBudget = 'tous';
            break;
    }

    await getCollectionBudget(page, itemsPerPage, statutBudget); // Recharger les budgets avec les nouveaux filtres
   
  };

  // ========== FONCTION AJOUT BUDGET ==========
  const addBudget = async (budget: BudgetType, t: Translations): Promise<any> => {
    try {
      setLoading(true);
      const response = await new Promise<ApiResponseType>((resolve,reject) => {
        setTimeout(async () => {
          try {
            const apiResponse = await BudgetService.ajouterBudget(budget);
            resolve(apiResponse);
          } catch (error) {
            reject(error);
          }
        }, 1000); 
      });
      
      if (response.statut === true) {
        setLoading(false);
        if(response.data){
          const successMessage = response.message || `Budget ${budget.budgetType === 'cyclique' ? 'cyclique ' : ''}ajouté avec succès!`;
          // showToast(successMessage, 'success');
           showToast(t.budget.handleAdd.success_msg, 'success');
          
          await chargerBudgetsFiltres(page, itemsPerPage, selectedStatus);
          //  synchronisation pour charger les budgets de ExpenseContext
            await loadBudgets();
            await loadBudgetsForFilter();

        }else if (response.doublons) {
          Alert.alert(t.budget.duplicate_category, t.budget.msg_duplicate_category);
        }else if (response.isArchiveCategorie) {
          Alert.alert(t.budget.archived_category, t.budget.msg_archived_category);
        }else{
          Alert.alert('Alerte !', `${response.message}`);
        }

        return response;
        
      } else {
        setLoading(false);
        // const errorMessage = response.message || "Erreur lors de l'ajout du budget";
        const errorMessage = t.budget.handleAdd.error_msg;
        const fullErrorMessage = response.erreur ? 
          `${errorMessage}: ${typeof response.erreur === 'string' ? response.erreur : JSON.stringify(response.erreur)}` : 
          errorMessage;
        
        // showToast(fullErrorMessage, 'warning');
        showToast(errorMessage, 'warning');
        return response;
      }
      
    } catch (error) {
      setLoading(false);
      console.error("Erreur inattendue lors de l'ajout du budget:", error);
      showToast(t.budget.handleAdd.error_msg, 'warning');
      return false;
    }
  };

  //FONCTION POUR SUPPRIMER UN BUDGET
  const onDeleteBudget = async(idBudget: number, t: Translations): Promise<any> =>{
    try{
      setLoading(true);

      const response = await new Promise<ApiResponseType>((resolve, reject) => {
        setTimeout(async () => {
          try {
            const apiResponse =  await BudgetService.deleteBudget(idBudget);
            resolve(apiResponse);
          } catch (error) {
            reject(error);
          }
        }, 1000);
      });

      if(response.statut === true){
        setLoading(false);
        // showToast(response.message || "",'success');
        showToast(t.budget.handleDelete.success_msg || "",'success');

        await chargerBudgetsFiltres(page, itemsPerPage, selectedStatus);
       
        await loadBudgets();
        await loadBudgetsForFilter();
      }else{
        setLoading(false);
        // const errorMessage = response.message || "Erreur lors de la suppression du budget";
        const errorMessage =  t.budget.handleDelete.error_msg;
        const fullErrorMessage = response.erreur ? 
          `${errorMessage}: ${typeof response.erreur === 'string' ? response.erreur : JSON.stringify(response.erreur)}` : 
          errorMessage;
        
        showToast(fullErrorMessage, 'warning');
        return response;
      }
    }catch (error) {
      setLoading(false);
      console.error("Erreur inattendue lors de la suppression du budget:", error);
      showToast(t.budget.handleDelete.error_msg, 'warning');
      return false;
    } 
  }

  //FONCTION POUR ARRETER LE CYCLE D'UN BUDGET CYCLIQUE
  const onStopBudgetCyclique= async (idBudget: number, t: Translations): Promise<any> =>{
    try{
       setLoading(true);

      const response = await new Promise<ApiResponseType>((resolve, reject) => {
        setTimeout(async () => {
          try {
            const apiResponse =  await BudgetService.stopBudgetCyclique(idBudget);
            resolve(apiResponse);
          } catch (error) {
            reject(error);
          }
        }, 1000);
      });

      if(response.statut === true){
        setLoading(false);
        showToast(t.budget.handleStopCycle?.success_msg || "",'success');
         await chargerBudgetsFiltres(page, itemsPerPage, selectedStatus);
        
      }else{
        setLoading(false);
        // const errorMessage = response.message || "Erreur lors de la mise a jour du budget";
        const errorMessage =  t.budget.handleStopCycle.error_msg;
        const fullErrorMessage = response.erreur ? 
          `${errorMessage}: ${typeof response.erreur === 'string' ? response.erreur : JSON.stringify(response.erreur)}` : 
          errorMessage;
        
        showToast(fullErrorMessage, 'warning');
        return response;
      }

    }catch (error) {
      setLoading(false);
      console.error("Une erreur inattendue s'est produite lors de l'arret du budget cyclique", error);
     showToast(t.budget.handleStopCycle.error_msg, 'warning');
      return false;
    } 
  }

  // Fonction pour préparer l'édition d'un budget existant
  const handleEditBudget = async (budget: BudgetType) => {
    // console.log('Début de la modification du budget:', budget.libelle);

    const budgetToEdit= await BudgetService.getBudgetCategorieByIdBudget(budget?.id || 0) ;

    // Prépare les données pour le formulaire d'édition
    const budgetDataToEdit: BudgetType = {
      id: budgetToEdit?.id,
      montantBudget: budgetToEdit?.montantBudget || 0, 
      dateDebut: budgetToEdit?.dateDebut || new Date(),
      dateFin: budgetToEdit?.dateFin || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      libelle: budgetToEdit?.libelle || '', 
      
      ligneCategorie: (budgetToEdit?.categories || [])
        .map(cat => ({
          idLigneCat: Number(String(Date.now()) + Math.floor(Math.random() * 1000)),
          idCategorie: cat.id ?? 0, 
          nomCategorie: cat.nom, 
          montantAffecter: cat.montantAffecter || 0
        })),

      budgetType: budgetToEdit?.isCyclique == 1 ? 'cyclique' : 'normal',
       typeCycle: budgetToEdit?.isCyclique == 1 ? budgetToEdit?.typeCycle : undefined
    };

    setBudgetToEdit(budgetDataToEdit);
    setBudgetData(budgetDataToEdit);
    setIsEditMode(true);
    scrollToForm(); 
    setShowBudgetForm(true); // afficher le formulaire
    // console.log('Formulaire préparé en mode édition avec scroll automatique:', budgetDataToEdit);
  };

  //FONCTION POUR METTRE A JOUR UN BUDGET
  const onUpdateBudget = async (updatedBudget: BudgetType, t: Translations): Promise<any> => {
      try {
        setLoading(true);
        
        // console.log('Données envoyées:', JSON.stringify(updatedBudget, null, 2));
        
        const response = await new Promise<ApiResponseType>((resolve, reject) => {
          setTimeout(async () => {
            try {
              const apiResponse = await BudgetService.updateBudget(updatedBudget);
              resolve(apiResponse);
            } catch (error) {
              reject(error);
            }
          }, 1000); 
        });
        
        if (response.statut === true) {
          setLoading(false);
          if(response.data){
            const successMessage = response.message || `Budget ${updatedBudget.budgetType === 'cyclique' ? 'cyclique ' : ''} mis à jour avec succès!`;
            // showToast(successMessage, 'success');
              showToast( t.budget.handleUpdate.success_msg, 'success');

             await chargerBudgetsFiltres(page, itemsPerPage, selectedStatus);
             //  synchronisation pour charger les budgets de ExpenseContext
            await loadBudgets();
            await loadBudgetsForFilter();
            
        }else if (response.doublons) {
          Alert.alert(t.budget.duplicate_category, t.budget.msg_duplicate_category);
        }else if (response.isArchiveCategorie) {
          Alert.alert(t.budget.archived_category, t.budget.msg_archived_category);
        }else{
          Alert.alert('Alerte !', `${response.message}`);
        }
          
          return response;
          
        } else {
          setLoading(false);
          // const errorMessage = response.message || "Erreur lors de la mise a jour du budget";
           const errorMessage = t.budget.handleUpdate.error_msg;
          const fullErrorMessage = response.erreur ? 
            `${errorMessage}: ${typeof response.erreur === 'string' ? response.erreur : JSON.stringify(response.erreur)}` : 
            errorMessage;
          
          // showToast(fullErrorMessage, 'warning');
          showToast(errorMessage, 'warning');
          
          if (response.erreur_ligne) {
            Alert.alert('Erreurs par ligne', JSON.stringify(response.erreur_ligne));
          }
          return response;
        }
      
    } catch (error) {
      setLoading(false);
      console.error("Erreur inattendue lors de la mise a jour du budget :", error);
      // showToast("Une erreur inattendue s'est produite lors  de la mise a jour du budget", 'warning');
      showToast( t.budget.handleUpdate.error_msg, 'warning');
      return false;
    } 
  };

  // Fonction pour annuler l'édition et revenir au mode création
  const handleCancelEdit = (t: Translations): void => {
    // console.log('Annulation de la modification du budget');
    setIsEditMode(false); 
    setBudgetToEdit(null);
    setBudgetData(initialBudgetData);
    showToast(t.budget.handleUpdate.cancel_msg, 'warning');
  };

  // Fonction pour mettre à jour progressivement le formulaire
  const updateBudgetForm = (newData: Partial<BudgetType>): void => {
    setBudgetData(prev => ({ ...prev, ...newData }));
  };

  // ========== VALEUR DU CONTEXTE ==========
  const value: BudgetContextType = {
    budgetData,
    setBudgetData,
    isEditMode,
    setIsEditMode,
    budgetToEdit,
    setBudgetToEdit,
    listebudgets,
    setListebudgets,
    addBudget,
    onDeleteBudget,
    onStopBudgetCyclique,
    handleEditBudget,
    onUpdateBudget,
    handleCancelEdit,
    updateBudgetForm,
    scrollToForm,
    scrollViewRef,
    showBudgetForm,
    setShowBudgetForm, 

    listeCategorie: categories,
    getCollectionBudget,
    selectedStatus,
    setSelectedStatus,
    statBudgetMensuel,
    setStatBudgetMensuel,
    getMounth,

    //Etat pagination
    page,
    setPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    setTotalPages,
    totalItems,
    setTotalItems,
    showItemsPerPageDropdown,
    setShowItemsPerPageDropdown,

    // États et fonctions pour Toast et Spinner
    toastConfig,
    showToast,
    hideToast,
    isLoading,
    setLoading,

    chargerBudgetsFiltres,
  
    setListeCategorie: function (value: React.SetStateAction<Category[]>): void {
      throw new Error("Function not implemented.");
    },

  };

  // ========== RENDU DU PROVIDER ==========
  return (
    <BudgetContext.Provider value={value}>
      {children}

      {/* =====Toast message succes ou echec====== */}
       <Toast
          visible={toastConfig.visible}
          message={toastConfig.message}
          type={toastConfig.type}
          onHide={hideToast}
        />
      
    {/* ========== SPINNER GLOBAL ========== */}
    <Spinner visible={isLoading} />

    </BudgetContext.Provider>
  );
};

// ========== HOOK PERSONNALISÉ ==========
export const useBudget = (): BudgetContextType => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error("useBudget doit être utilisé à l'intérieur d'un BudgetProvider");
  }
  return context;
};