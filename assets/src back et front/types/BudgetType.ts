
export type CycleType = 'hebdomadaire' | 'mensuel' | 'annuel';

//interface principale du budget
export interface BudgetType{  
  id?: number;
  libelle: string;                   
  montantBudget: number;                
  dateDebut: Date; 
  dateFin: Date;                  
  statutBudget?: number; //(0: en cours, 1: termine)
  // isArchive?: boolean;   //(0:non archive, 1: archive)
  isCyclique?: number;   //(0:non cyclique, 1: cyclique)
  typeCycle?: CycleType;
  cycleStatus?: number;     // (0: cycle arrêté, 1: cycle en cours )   
  dateProchainCycle?: Date;  
  id_customer_account? : number;                    
  budgetType?: 'normal' | 'cyclique'; 
         
  createdAt?: Date;
  updated_at?: Date;
  total_depense?: number;
  montant_total_affecte?: number;
  pourcentage_utilisation?: number;
  ligneCategorie?: LigneCategorieType[]; //ligne des categories

  categories?: CategorieType[]; //liste des catgories du budget

  mois?: string;
  mois_en?: string;
  montantTotalBudget?: number;
  montantTotalAffecte?: number;
  reste?: number;
  tauxUtilisationBudget?: number;
  nombreBudgets?: number;

  budgets_depasses?: BudgetDepasse[]; //liste des budgets depasse
}

export interface BudgetDepasse{
  budget_id: number;
  budget_libelle: string;
  budget_montant_total: number;
  total_depenses: number;
  budget_depasse: boolean;
  montant_depassement_global: number;
  pourcentage_depassement_global: number;
  nombre_categories_depassees: number;
  date_debut: string;
  date_fin: string;
  categories_depassees : CategorieType[] //liste des categories depasse dans un budget 
  
}


//inteface pour la ligne des catégories dans le formulaire
export interface LigneCategorieType {
  idLigneCat?: number;
  idCategorie: number;          
  nomCategorie: string;     
  montantAffecter: number;    
}

// ========== INTERFACE PRINCIPALE DE LA CATÉGORIE ==========
export type IconSet = 'MaterialIcons' | 'FontAwesome' | 'FontAwesome5' | 'MaterialCommunityIcons'|'Feather'|'Ionicons';

export interface CategorieType {
  id?: number;              
  id_customer_account ?: string;   
  nom: string;
  nom_en?: string;
  type?: number;
  isArchive ?: boolean;         
  created_at ?: Date;
  updated_at ?: Date;   

  depenses?: number; // Total des dépenses associées à cette catégorie
  montantAffecter?: number; // Montant affecté à cette catégorie dans le budget
  pourcentage_utilisation?: number;
  icon?: string;             // Nom de l'icône dans la bibliothèque
  iconSet?: IconSet;         // Bibliothèque d'icônes à utiliser           
  color?: string;     // Couleur d'affichage de la catégorie

  iconComponent?: React.ReactNode; // Composant d'icône React

  depassement?: number;
  pourcentage_depassement? : number;
}