import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { OperationType, TransactionACategoriserType } from '../types/TransacACategoriserType';
import Toast from '../components/Toast';
import Spinner from '../components/Spinner';
import { TransactionACatService } from '../services/TransactionACatService';
import { ApiResponseType } from '../types/ApiResponseType';
import { Translations } from '../types';


export interface TransacACategoriserContextType{
  listeOperation : OperationType[]; 
  setlisteOperation: React.Dispatch<React.SetStateAction<OperationType[]>>; 
  listeTransacACategoriser: TransactionACategoriserType[] ;
  setlisteTransacACategoriser:React.Dispatch<React.SetStateAction<TransactionACategoriserType[]>>; 
  isTransCatMode: boolean;  
  setIsTransCatMode: React.Dispatch<React.SetStateAction<boolean>>;  
  transACategoriser: TransactionACategoriserType | null;
  setTransACategoriser: React.Dispatch<React.SetStateAction<TransactionACategoriserType | null>>;   
  selectedOperation: OperationType | null;
  setSelectedOperation: React.Dispatch<React.SetStateAction<OperationType | null>>;

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

  // État pour indiquer si une catégorisation est en cours
  isCategorizing: boolean; 
  setIsCategorizing: React.Dispatch<React.SetStateAction<boolean>>;

  //États pour le modal de catégorisation
  isCategorizationModalVisible: boolean;
  setIsCategorizationModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTransaction: TransactionACategoriserType | null;
  setSelectedTransaction: React.Dispatch<React.SetStateAction<TransactionACategoriserType | null>>;

  // États pour Toast et Spinner
  toastConfig: {
      visible: boolean;
      message: string;
      type: 'success' | 'warning';
  };
  showToast: (message: string, type?: 'success' | 'warning') => void;
  hideToast: () => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  //fonction
  onAddTransCat: (idCategorie: number, idTransaction: number, categoryName: string,  t: Translations)=> Promise<any>; 
  loadTransACat : (page?: number, itemsPerPage?: number, operation?: number)=> Promise<ApiResponseType>; //charger les transactions
  loadOperation: () =>void;

  //Fonction pour ouvrir le modal de catégorisation
  openCategorizationModal: (transaction: TransactionACategoriserType) => void;
  // Fonction pour fermer le modal de catégorisation
  closeCategorizationModal: () => void;

}



export const TransacACategoriserContext = createContext<TransacACategoriserContextType | undefined>(undefined);

interface TransacACategoriserProps {
  children: ReactNode; // Les composants enfants qui auront accès au contexte
}


export const TransCatProvider: React.FC<TransacACategoriserProps> = ({ children }) => {

  const [listeOperation, setlisteOperation] = useState<OperationType[]>([]);
  const [listeTransacACategoriser, setlisteTransacACategoriser] = useState<TransactionACategoriserType[]>([]);                     // State pour la liste des budgets. initialiser la liste des budget
  const [isTransCatMode, setIsTransCatMode] = useState<boolean>(false);             // State pour le mode édition (false = création, true = édition)
  const [transACategoriser, setTransACategoriser] = useState<TransactionACategoriserType | null>(null);     // State pour des donnee de la transaction a categoriser
  
  const [selectedOperation, setSelectedOperation] = useState<OperationType | null>(null); //operation selectionnee

  const [isCategorizationModalVisible, setIsCategorizationModalVisible] = useState<boolean>(false);   //États pour gérer le modal de catégorisation
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionACategoriserType | null>(null);

  
  // Gère l'état de chargement pendant la catégorisation
  const [isCategorizing, setIsCategorizing] = useState<boolean>(false);

   // ========== ÉTATS POUR LA PAGINATION AVEC  ==========
    const [page, setPage] = useState<number>(1); 
    const [itemsPerPage, setItemsPerPage] = useState<number>(10); // 10 éléments par défaut
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);  // Total des éléments pour la pagination
    const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState<boolean>(false); // État pour afficher le dropdown des éléments par page
   
  // États pour Toast et Spinner
  const [toastConfig, setToastConfig] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'warning'
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //charger la liste des transaction a categoriser et des operations au demarrage
  useEffect (()=>{
    loadTransACat()
    loadOperation()
  }, []);

  // Fonctions pour gérer le Toast
  const showToast = (message: string, type: 'success' | 'warning' = 'success') => {
    setToastConfig({
      visible: true,
      message,
      type
    });
  };

  const hideToast = () => {
    setToastConfig(prev => ({ ...prev, visible: false }));
  };

   // Fonction pour gérer le loading
  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

   //fonction pour la liste des transactions a categoriser
  const loadTransACat =  async (page: number = 1, itemsPerPage: number = 10, operation?: number): Promise<ApiResponseType> =>{
    try {
        
        const response: ApiResponseType = await TransactionACatService.getAllTransCustomer(
          page, 
          itemsPerPage, 
          operation);
        
        if (response.statut === true) {
          console.log('Transaction a categorise chargés avec succès:', response.data.length + ' transactions');
   
          setlisteTransacACategoriser(response.data || []);        // Mettre à jour la liste des transactions dans le contexte
        
          setTotalItems(response.pagination?.total || 0) // Mettre à jour le total des éléments pour la pagination
          setItemsPerPage(response.pagination?.element_par_page || 0) // Mettre à jour les éléments par page
          setTotalPages(response.pagination?.total_pages || 1); // Mettre à jour le total des pages
          return response;
        } else {
          console.error('Erreur API:', response.message);
          setlisteTransacACategoriser([]);
          return response;
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement des transactions a categoriser:', error.message || error);
        setlisteTransacACategoriser([]);
        throw error;
      }
   }

   //fonction pour la liste des operation
   const loadOperation = async () =>{
    try{
      const response = await TransactionACatService.getAllOperation();
      setlisteOperation(response);

    }catch(error) {
      console.error('Erreur lors de la recuperation des la liste des operations consideree comme depense', error);
      setlisteOperation([]);
      throw error;
    }
    
   }

    //Fonction pour ouvrir le modal de catégorisation
   const openCategorizationModal = (transaction: TransactionACategoriserType): void => {
    setSelectedTransaction(transaction);
    setIsCategorizationModalVisible(true);
   };

   //Fonction pour fermer le modal de catégorisation
   const closeCategorizationModal = (): void => {
    setIsCategorizationModalVisible(false);
    setSelectedTransaction(null);
   };

   // Fonction pour catégoriser une transaction
   const onAddTransCat = async (idCategorie: number, idTransaction: number, categoryName: string, t: Translations): Promise<any> => {
    console.log(`Catégorisation: Transaction ${idTransaction} -> Catégorie ${idCategorie} (${categoryName})`);
    
    try {

      setIsCategorizing(true);
      
        const response= await new Promise<ApiResponseType>((resolve, reject) => {
          setTimeout( async() => {
            try {
              const apiResponse = await TransactionACatService.categoriserTransaction(
                idTransaction,idCategorie)
              resolve(apiResponse);
            } catch (error) {
              reject(error);
            }
          }, 1500); 
      });

      if(response.statut === true){
        // setLoading(false);
        setIsCategorizing(false);
         closeCategorizationModal();
        // showToast(response.message ?? "Catégorisation réussie","success")
        showToast(t.Transaction_categorization?.success_msg || "","success");

        if(selectedOperation){
          await loadTransACat(page,itemsPerPage,selectedOperation.id_sesampayx_operation)
        }else{
          await loadTransACat(page,itemsPerPage)
        }
       
      }else{
         setIsCategorizing(false);
        // const errorMessage = response.message || "Erreur lors de l'ajout du budget";
         const errorMessage = t.Transaction_categorization.error_msg;
        const fullErrorMessage = response.erreur ? 
          `${errorMessage}: ${typeof response.erreur === 'string' ? response.erreur : JSON.stringify(response.erreur)}` : 
          errorMessage;
        
        showToast(fullErrorMessage, 'warning');

      }

       return response
    } catch (error) {
      // Gestion des erreurs
       setIsCategorizing(false);
      console.error('Erreur lors de la catégorisation:', error);
      showToast(t.Transaction_categorization.error_msg, 'warning');
    } 
   }


  // ========== VALEUR DU CONTEXTE ==========
  const value: TransacACategoriserContextType = {
    listeOperation,
    setlisteOperation,
    listeTransacACategoriser,
    setlisteTransacACategoriser,
    isTransCatMode,
    setIsTransCatMode,
    transACategoriser,
    setTransACategoriser,
    selectedOperation,
    setSelectedOperation,

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

    // État pour indiquer si une catégorisation est en cours
    isCategorizing,
    setIsCategorizing,

     //Ajout des états et fonctions pour le modal
    isCategorizationModalVisible,
    setIsCategorizationModalVisible,
    selectedTransaction,
    setSelectedTransaction,
    openCategorizationModal,
    closeCategorizationModal,

    // États et fonctions pour Toast et Spinner
    toastConfig,
    showToast,
    hideToast,
    isLoading,
    setLoading,

    onAddTransCat,
    loadTransACat,
    loadOperation

  };

  // ========== RENDU DU PROVIDER ==========
  return (
    <TransacACategoriserContext.Provider value={value}>
      {children}
       {/* ========== TOAST GLOBAL ========== */}
      <Toast
        visible={toastConfig.visible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHide={hideToast}
      />

      {/* ========== SPINNER GLOBAL ========== */}
      <Spinner visible={isLoading} />
    </TransacACategoriserContext.Provider>
  );
};

// ========== HOOK PERSONNALISÉ ==========
export const useTransCat = (): TransacACategoriserContextType => {
  const context = useContext(TransacACategoriserContext);
  if (context === undefined) {
    throw new Error("useTransCat doit être utilisé à l'intérieur d'un TransacACategoriserProvider");
  }
  return context;
};
