import { ApiResponseType } from "../types/ApiResponseType";
import { OperationType } from "../types/TransacACategoriserType";
import { apiClient } from "./Api";

export const TransactionACatService = {

    //liste operations considerer comme des depenses
    getAllOperation: async(): Promise<OperationType[]> =>{
        try {
            const response: ApiResponseType = await apiClient.get('/OperationDepense');
            // console.log("Operation recuperer", response.data?.length + 'Transaction');

            return response.data

        }catch (error: any) {
            console.error('Erreur détaillée dans TransactionACatService.getAllOperation:');
            console.error('Type:', error?.constructor?.name);
            console.error('Code:', error?.code);
            console.error('Message:', error?.message);
            throw error;
        }
    },

    //recuperer la liste des transactions a categoriser pour un utilisateur 
    getAllTransCustomer: async (page: number = 1, itemsPerPage: number = 10, operation?: number): Promise<ApiResponseType> => {
        try {
        // Construction des parametres de requete
        const params = new URLSearchParams({
            per_page: itemsPerPage.toString(),
            page: page.toString()
        });

        // Ajout du filtre operation si spécifié
        if (operation) {
            params.append('operation', operation.toString());
        }

        // Construction de l'URL complète
        const apiUrl = `/TransactionACategoriser?${params}`;
        // console.log('Chargement depuis:', apiUrl);

        const response: ApiResponseType = await apiClient.get(apiUrl);

        // console.log('Données reçues avec pagination:', response);
        // console.log('getAllTransCustomer réussi:', response.data?.length + ' transaction sur la page ' + page);
        
        // retour avec pagination
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

    /**
   * Catégorise une transaction
   */
   categoriserTransaction: async(transactionId: number, categoryId: number): Promise<ApiResponseType>=> {
    try {

      const transactionData: any ={
        idCategorie: categoryId,
        idTransaction: transactionId
      }
        // console.log("Données envoyées à l'API:", JSON.stringify(transactionData, null, 2));

      const response: ApiResponseType = await apiClient.post('/CategoriserTransaction',transactionData);
      
      return response;

    } catch (error: any) {
      console.error('Erreur détaillée dans BudgetService.ajouterBudget:');
      console.error('Type:', error?.constructor?.name);
      console.error('Code:', error?.code);
      console.error('Message:', error?.message);
      console.error('Response data:', error?.response?.data);
      
      // Retour de l'erreur formatée
      return {
        statut: false,
        message: error?.response?.data?.message || 'Erreur lors de la categorisation de la transaction',
        erreur: error?.response?.data?.erreur || error.message
      };
    }
  }
}