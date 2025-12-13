import { apiClient } from './Api';
import { BudgetType, CategorieType, LigneCategorieType } from "../types/BudgetType";
import { ApiResponseType } from '../types/ApiResponseType';

export const BudgetService = {
  
  // Liste des catégories
  getAllCategories: async (): Promise<CategorieType[]> => {
    try {
      const response: ApiResponseType = await apiClient.get('/catagorie');
      // console.log('getAllCategories réussi:', response.data?.length + ' catégories');
     
      return response.data || [];
    } catch (error: any) {
      console.error('Erreur détaillée dans BudgetService.getAllCategories:');
      console.error('Type:', error?.constructor?.name);
      console.error('Code:', error?.code);
      console.error('Message:', error?.message);
      throw error;
    }
  },

  // ========== LISTE DES BUDGETS AVEC PAGINATION ==========
  getAllBudgets: async (page: number = 1, itemsPerPage: number = 10, statut?: string): Promise<ApiResponseType> => {
    try {

      // Construction des paramètres de requête
      const params = new URLSearchParams({
        per_page: itemsPerPage.toString(),
        page: page.toString()
      });

      // Ajout du filtre statut si spécifié
      if (statut && statut !== 'tous') {
        const statutValue = statut === 'En cours' ? '0' : '1';
        params.append('statut', statutValue);
      }

      // Construction de l'URL complète
      const apiUrl = `/BudgetsCustomer?${params}`;
      // console.log('Chargement depuis:', apiUrl);

      const response: ApiResponseType = await apiClient.get(apiUrl);
      
      // console.log('Données reçues avec pagination:', response);
      // console.log('getAllBudgets réussi:', response.data?.length + ' budgets sur la page ' + page);
      
      // Retourner la réponse complète avec pagination
      return {
        statut: response.statut,
        message: response.message,
        data: response.data || [],
        pagination: response.pagination? {
          page_actuelle: page,
          element_par_page: itemsPerPage,
          total: response.pagination.total,
          total_pages: response.pagination.total_pages,
          parge_suivante: null,
          parge_precedente: null
        } : {
          page_actuelle: page,
          element_par_page: itemsPerPage,
          total: 0,
          total_pages: 1,
          parge_suivante: null,
          parge_precedente: null
        },
        filtres_appliques: response.filtres_appliques || []
      };
      
    } catch (error: any) {
      console.error('Erreur détaillée dans BudgetService.getAllBudgets:');
      console.error('Type:', error?.constructor?.name);
      console.error('Code:', error?.code);
      console.error('Message:', error?.message);
      throw error;
    }
  },

  // Ajouter un budget
  ajouterBudget: async (budgetData: BudgetType): Promise<ApiResponseType> => {
    try {

      // Préparation des données pour l'API 
      const dataToSend: any = {
        libelle: budgetData.libelle,
        montantBudget: budgetData.montantBudget,
        dateDebut: budgetData.dateDebut.toISOString().split('T')[0], // Format YYYY-MM-DD
        ligneCategorie: (budgetData.ligneCategorie || []).map((line: LigneCategorieType) => ({
          idCategorie: parseInt(line.idCategorie.toString()),
          montantAffecter: parseFloat(line.montantAffecter.toString())
        }))
      };
      if(budgetData.budgetType === 'cyclique'){
       dataToSend.isCyclique = true;
       dataToSend.typeCycle= budgetData.budgetType === 'cyclique' ? budgetData.typeCycle : null;
      }else{
        dataToSend.isCyclique = false;
        dataToSend.dateFin = budgetData.dateFin.toISOString().split('T')[0]; // date fin 
      }

      // console.log("Données envoyées à l'API:", JSON.stringify(dataToSend, null, 2));

      const response: ApiResponseType = await apiClient.post('/Budgets', dataToSend);
      
      // console.log("Réponse de l'API ajouterBudget:", JSON.stringify(response, null, 2));
      
      return response;
    } catch (error: any) {
      console.error('Erreur détaillée dans BudgetService.ajouterBudget:');
      console.error('Type:', error?.constructor?.name);
      console.error('Code:', error?.code);
      console.error('Message:', error?.message);
      console.error('Response data:', error?.response?.data);
      
      // Retourner l'erreur formatée
      return {
        statut: false,
        message: error?.response?.data?.message || 'Erreur lors de la création du budget',
        erreur: error?.response?.data?.erreur || error.message
      };
    }
  },

  //modifier un budget
   updateBudget: async(budgetData: BudgetType): Promise<ApiResponseType> => {
    try{
       // Préparation des données pour l'API 
      const dataToSend: any = {
        idBudget: budgetData.id,
        libelle: budgetData.libelle,
        montantBudget: budgetData.montantBudget,
        dateDebut: budgetData.dateDebut.toISOString().split('T')[0], // Format YYYY-MM-DD
        ligneCategorie: (budgetData.ligneCategorie || []).map((line: LigneCategorieType) => ({
          idCategorie: parseInt(line.idCategorie.toString()),
          montantAffecter: parseFloat(line.montantAffecter.toString())
        }))
      };
      if(budgetData.budgetType === 'cyclique'){
       dataToSend.isCyclique = true;
       dataToSend.typeCycle= budgetData.budgetType === 'cyclique' ? budgetData.typeCycle : null;
      }else{
        dataToSend.isCyclique = false;
        dataToSend.dateFin=  budgetData.dateFin.toISOString().split('T')[0]; // Format YYYY-MM-DD
      }

      // console.log("Données envoyées à l'API:", JSON.stringify(dataToSend, null, 2));

      const response: ApiResponseType = await apiClient.post('/Modifier', dataToSend);
      
      // console.log("Réponse de l'API updateBudget:", JSON.stringify(response, null, 2));
      
      return response;
    }catch (error: any) {
      console.error('Erreur détaillée dans BudgetService.upddateBudget:');
      console.error('Type:', error?.constructor?.name);
      console.error('Code:', error?.code);
      console.error('Message:', error?.message);
      console.error('Response data:', error?.response?.data);
      
      // Retourn de l'erreur formatée
      return {
        statut: false,
        message: error?.response?.data?.message || 'Erreur lors de mise a jour du budget',
        erreur: error?.response?.data?.erreur || error.message
      };
    }
  },

  //get statistique budget_Catgories a partir d'un budget selectionne
  getBudgetCategorieByIdBudget: async (budgetId: number): Promise<BudgetType | null> => {
    try {
      const response :ApiResponseType = await apiClient.get('/StatistiqueBudgetCategorie/', {budget_id: budgetId });

      // Vérifier la structure de réponse de votre API
      if (response.data && response.data.statut !== false) {
        return response.data.data || response.data;

      } else {
        throw new Error(response.data?.message || 'Budget non trouvé');
      }
      
    } catch (error: any) {
      console.error('Erreur détaillée dans BudgetService.getBudgetCategorieByIdBudget:');
      console.error('Type:', error?.constructor?.name);
      console.error('Code:', error?.code);
      console.error('Message:', error?.message);
      throw error;
    }
  },

  // arreter le cycle budget cyclique d'un customer 
  checkAndUpdateExpiredBudgetsCyclique: async(): Promise<ApiResponseType> =>{
    try{

      const response: ApiResponseType =  await apiClient.get('/checkAndUpdateExpiredBudgetsCycliques');
      // console.log("Nouveau cycle renouveler", JSON.stringify(response,null,2));
      return response;

    } catch (error: any) {
      console.error('Erreur détaillée dans BudgetService.checkAndUpdateExpiredBudgetsCyclique:');
      console.error('Type:', error?.constructor?.name);
      console.error('Code:', error?.code);
      console.error('Message:', error?.message);
      throw error;
    }
  },


  //supprimer un budget
  deleteBudget: async(budgetId: number) : Promise<ApiResponseType> =>{
    try{
      //preparation des donnees pour l'api
      const dataToSend: any ={
        idBudget: budgetId
      }
      // console.log("suppression du budget", dataToSend);
      const response: ApiResponseType = await apiClient.post('/Supprimer', dataToSend)
      return response;
    }catch (error: any) {
      console.error('Erreur détaillée dans BudgetService.deleteBudget:');
      console.error('Type:', error?.constructor?.name);
      console.error('Code:', error?.code);
      console.error('Message:', error?.message);
      throw error;
    }
  },

  //arreter le cycle d'un budget cyclique
  stopBudgetCyclique: async(budgetId: number): Promise<ApiResponseType>=>{
    try{
      const dataToSend: any= {
        idBudget: budgetId
      }
      const response: ApiResponseType= await apiClient.post('/ArreterCycle',dataToSend);
      return response;

    }catch (error: any) {
      console.error('Erreur détaillée dans BudgetService.stopBudgetCyclique:');
      console.error('Type:', error?.constructor?.name);
      console.error('Code:', error?.code);
      console.error('Message:', error?.message);
      throw error;
    }
  },

  //statisque budget mensuel
  statistiqueBudgetMensuel: async (): Promise<BudgetType> => {
    try{
      
      const response: ApiResponseType = await apiClient.get('/StatistiqueBudgetMensuel');
      // console.log("Statistique budget mensuel", JSON.stringify(response))
      return response.data
      
    }catch (error: any) {
      console.error('Erreur détaillée dans BudgetService.statistiqueBudgetMensuel:');
      console.error('Type:', error?.constructor?.name);
      console.error('Code:', error?.code);
      console.error('Message:', error?.message);
      throw error;
    }
  }


};