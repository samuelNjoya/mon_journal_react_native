
export interface ApiResponseType{
  
    statut?: boolean;  //statut requete
    data?: any;   //donnees retournee
    message? : string;  // Message d'information
    erreur?: string;   //message d'erreur

    doublons?: [];
    isArchiveCategorie?:[];
    erreur_ligne?:string;

    pagination?: {
        page_actuelle: number;
        element_par_page: number;
        total: number;
        total_pages: number;
        parge_suivante: string | null;
        parge_precedente: string | null;
  };
  filtres_appliques?: any[];
}