<?php
namespace App\Helpers\Api\DepenseModule_Helpers;

use App\Models\DepenseModule_Models\Budget;
use App\Models\DepenseModule_Models\Budget_categorie;
use App\Models\DepenseModule_Models\CategorieDepenses;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BudgetHelper{

    public static function checkAndUpdateExpiredBudgets($idCustomers){
        $now = Carbon::now();
        // Récupérer tous les budgets actifs qui sont expirés
        $expiredBudgets = Budget::where('DateFin', '<=', $now)
                            ->where('statutBudget', 0)
                            ->where('id_customer_account',$idCustomers)
                            ->get();

        foreach ($expiredBudgets as $budget) {
            // Mettre à jour le statut du budget
            $budget->update([
                'statutBudget' => 1,
                'updated_at' => $now
            ]);
        }
    }

    // //creer un budget avec ces categories
    // public static function CreerBudget($data,$idCustomers){
    //       // Vérifier si le libellé existe déjà
    //     $libelleExiste = Budget::where('Libelle', $data['Libelle'])
    //                         ->where('id_customer_account', $idCustomers)
    //                         ->first();
    //     if($libelleExiste){
    //         return [
    //             "statut" => false,
    //             "message" => 'Un budget ayant ce libellé existe déjà',
    //         ];
    //     }
    //       // Valider les montants des catégories
    //     $validationCategories = self::validerCategories($data['categories'], $data['MontantBudget']);
    //     if(!$validationCategories['valide']){
    //         return [
    //             "statut" => false,
    //             "message" => $validationCategories['message'],
    //             'doublons' => $validationCategories['doublons'] ?? [],
    //             "erreur_ligne" => $validationCategories['ligne_erreur'] ?? null
    //         ];
    //     }

    //     // Démarrer une transaction
    //    DB::beginTransaction();
    //      try {
    //     // Créer le budget
    //     $budget = new Budget();
    //     $budget->Libelle = $data['Libelle'];
    //     $budget->MontantBudget = $data['MontantBudget'];
    //     $budget->DateDebut = $data['DateDebut'];
    //     $budget->DateFin = $data['DateFin'];
    //     $budget->id_customer_account = $idCustomers;
    //     $budget->save();
    //      // Ajouter les catégories
    //     foreach ($data['categories'] as $categorieData) {
    //         Budget_categorie::create([
    //             'IdBudget' => $budget->IdBudget,
    //             'IdCategorie' => $categorieData['IdCategorie'],
    //             'MontantAffecter' => $categorieData['MontantAffecter']
    //         ]);
    //     }

    //     DB::commit();
    //       return [
    //         "statut" => true,
    //         "message" => 'Votre budget a été créé avec succès',
    //         "data" => $budget->load('categories')
    //     ];
    //      } catch (\Exception $e) {
    //         DB::rollBack();
    //         return [
    //             "statut" => false,
    //             "message" => 'Erreur lors de la création du budget',
    //             "erreur" => $e->getMessage()
    //         ];
    //     }

    // }

        /**
     * Créer un budget (normal ou cyclique)
     */
    public static function creerBudget($data, $idCustomers)
    {
        // Vérifier si le libellé existe déjà
        $libelleExiste = Budget::where('Libelle', $data['Libelle'])
                            ->where('id_customer_account', $idCustomers)
                            ->first();
        if ($libelleExiste) {
            return [
                "statut" => false,
                "message" => 'Un budget ayant ce libellé existe déjà',
            ];
        }

        // Valider les montants des catégories
        $validationCategories = self::validerCategories($data['categories'], $data['MontantBudget']);
        if (!$validationCategories['valide']) {
            return [
                "statut" => false,
                "message" => $validationCategories['message'],
                'doublons' => $validationCategories['doublons'] ?? null,
                'isArchiveCategorie' => $validationCategories['isArchiveCategorie'] ?? null,
                'message_complet' => $validationCategories['message_complet'] ?? null,
                "erreur_ligne" => $validationCategories['ligne_erreur'] ?? null
            ];
        }

        // Démarrer une transaction
        DB::beginTransaction();
        try {
            // Créer le budget
            $budget = new Budget();
            $budget->Libelle = $data['Libelle'];
            $budget->MontantBudget = $data['MontantBudget'];
            $budget->DateDebut = $data['DateDebut'];
            $budget->DateFin = $data['DateFin'];
            $budget->id_customer_account = $idCustomers;
            $budget->statutBudget = 0;
            $budget->isArchive = 0;

            // Gestion du budget cyclique
            if (isset($data['isCyclique']) && $data['isCyclique']) {
                $budget->isCyclique = true;
                $budget->typeCycle = $data['typeCycle'];

                // Calculer la date du prochain cycle
                $budget->dateProchainCycle = self::calculerProchainCycle($data['DateFin'], $data['typeCycle']);
            } else {
                $budget->isCyclique = false;
                $budget->typeCycle = null;
                $budget->dateProchainCycle = null;
            }

            $budget->save();

            // Ajouter les catégories
            foreach ($data['categories'] as $categorieData) {
                Budget_categorie::create([
                    'IdBudget' => $budget->IdBudget,
                    'IdCategorie' => $categorieData['IdCategorie'],
                    'MontantAffecter' => $categorieData['MontantAffecter']
                ]);
            }

            DB::commit();
            return [
                "statut" => true,
                "message" => 'Votre budget a été créé avec succès',
                "data" => $budget->load('categories')
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                "statut" => false,
                "message" => 'Erreur lors de la création du budget',
                "erreur" => $e->getMessage()
            ];
        }
    }

    /**
     * Calculer la date du prochain cycle
     */
    public static function calculerProchainCycle($dateFin, $typeCycle)
    {
        $date = Carbon::parse($dateFin);

        switch ($typeCycle) {
            case 'hebdomadaire':
                return $date->addWeek()->format('Y-m-d');
            case 'mensuel':
                return $date->addMonth()->format('Y-m-d');
            case 'annuel':
                return $date->addYear()->format('Y-m-d');
            default:
                return $date->addMonth()->format('Y-m-d');
        }
    }

    /**
     * Renouveler un budget cyclique
     */
    public static function renouvelerCycle(Budget $budget)
    {
        if (!$budget->isCyclique) {
            return [
                "statut" => false,
                "message" => "Ce budget n'est pas cyclique"
            ];
        }

        DB::beginTransaction();
        try {
            // Créer un nouveau budget pour le cycle suivant
            $nouveauBudget = $budget->replicate();
            $nouveauBudget->DateDebut = $budget->dateProchainCycle;

            // Calculer la nouvelle date de fin
            $duree = $budget->DateFin->diffInSeconds($budget->DateDebut);
            $nouveauBudget->DateFin = Carbon::parse($budget->dateProchainCycle)->addSeconds($duree);

            // Calculer la date du prochain cycle
            $nouveauBudget->dateProchainCycle = self::calculerProchainCycle(
                $nouveauBudget->DateFin->format('Y-m-d'),
                $budget->typeCycle
            );

            $nouveauBudget->statutBudget = 0;
            $nouveauBudget->created_at = now();
            $nouveauBudget->updated_at = now();
            $nouveauBudget->save();

            // Copier les catégories associées
            foreach ($budget->categories as $categorie) {
                Budget_categorie::create([
                    'IdBudget' => $nouveauBudget->IdBudget,
                    'IdCategorie' => $categorie->IdCategorie,
                    'MontantAffecter' => $categorie->MontantAffecter
                ]);
            }

            // mise a jour budget comme terminé
            $budget->statutBudget = 1;
            $budget->save();

            DB::commit();
            return [
                "statut" => true,
                "message" => "Budget renouvelé avec succès",
                "data" => $nouveauBudget->load('categories')
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                "statut" => false,
                "message" => "Erreur lors du renouvellement du budget",
                "erreur" => $e->getMessage()
            ];
        }
    }

    /**
     * Vérifier et renouveler les budgets cycliques expirés
     */
    public static function checkAndUpdateExpiredBudgetsCyclique($idCustomers = null)
    {
        $query = Budget::where('isCyclique', true)
            ->where('dateProchainCycle', '<=', now())
            ->where('statutBudget', 0);
        // $idCustomers = Auth::id();
        if ($idCustomers) {
            $query->where('id_customer_account', $idCustomers);
        }

        $budgetsARenouveler = $query->get();

        $results = [];
        foreach ($budgetsARenouveler as $budget) {
            $results[] = [
                'budget' => $budget->Libelle,
                'resultat' => self::renouvelerCycle($budget)
            ];
        }

        return $results;
    }

    private static function validerCategories($categories, $montantBudget){
        $totalMontant = 0;
        $categoriesIds = [];
        $doublons = []; // Pour stocker toutes les lignes avec doublons

        foreach ($categories as $index => $categorie) {
            $ligne = $index + 1;

            // Vérifier si le montant est vide
            if (empty($categorie['MontantAffecter'])) {
                return [
                    'valide' => false,
                    'message' => "Montant manquant pour la catégorie à la ligne $ligne",
                    'ligne_erreur' => $ligne,
                ];
            }
            // Vérifier si le montant est négatif
            if ($categorie['MontantAffecter'] < 0) {
                return [
                    'valide' => false,
                    'message' => "Montant négatif pour la catégorie à la ligne $ligne",
                    'ligne_erreur' => $ligne,
                ];
            }

            //verifier si la categorie n'est pas archive
            if(!empty($categorie['IdCategorie'])){
                $idCategorie = $categorie['IdCategorie'];
                $categorieArchives = self::checkCategorieIsArchive($idCategorie);
                if($categorieArchives){
                    $categorieArchives_array[] = [
                        'ligne' => $ligne,
                        'categorie' => $categorieArchives->nom,
                        'id_categorie' => $idCategorie,
                    ];
                }
            }

            // Vérifier les doublons de catégories
            $idCategorie = $categorie['IdCategorie'];
            if (in_array($idCategorie, $categoriesIds)) {
                $nomCategorie = self::getNomCategorie($idCategorie);
                $doublons[] = [
                    'ligne' => $ligne,
                    'categorie' => $nomCategorie,
                    'id_categorie' => $idCategorie,
                ];
            } else {
                $categoriesIds[] = $idCategorie;
            }

            $totalMontant += $categorie['MontantAffecter'];
        }

        //si des categorie sont archive
        if(!empty($categorieArchives_array)){
            $messages = [];
            foreach ($categorieArchives_array as $categorieArchive) {
                $messages[] = "La catégorie '{$categorieArchive['categorie']}' à la ligne {$categorieArchive['ligne']} n'est pas trouvée";
            }
            return [
                'valide' => false,
                'message' => "Categorie n'existe pas",
                'isArchiveCategorie' => $categorieArchives_array,
                'message_complet' => implode(', ', $messages)
            ];
        }

        // Si des doublons ont été trouvés
        if (!empty($doublons)) {
            $messages = [];
            foreach ($doublons as $doublon) {
                $messages[] = "La catégorie '{$doublon['categorie']}' est dupliquée à la ligne {$doublon['ligne']}";
            }
            return [
                'valide' => false,
                'message' => "Doublons de catégories détectés",
                'doublons' => $doublons,
                'message_complet' => implode(', ', $messages)
            ];
        }

        // Vérifier si la somme dépasse le budget
        if ($totalMontant > $montantBudget) {
            return [
                'valide' => false,
                'message' => "La somme des montants affectés ($totalMontant) dépasse le montant du budget ($montantBudget)"
            ];
        }

        return ['valide' => true];
    }

    // Méthode pour récupérer le nom de la catégorie
    private static function getNomCategorie($idCategorie) {

        $categorie = CategorieDepenses::where('id',$idCategorie)->first();
        return $categorie ? $categorie->nom : "Catégorie #$idCategorie Non trouvee";
    }

    //methode pour verifier quu la cat n'est pas archive
    private static function checkCategorieIsArchive($idCategorie){
         $isArchiveCategorie = CategorieDepenses::where('id',$idCategorie)->where('isArchive',1)->first();
         if($isArchiveCategorie) return $isArchiveCategorie;

    }


    //liste des budgets du customer
   public static function BudgetsCustomers($idCustomers, $filters = [], $perPage = 10, $page = 1)
    {
        $query = Budget::where('id_customer_account', $idCustomers)
                    ->where('isArchive', 0);

        // Applique des filtres
        self::applyFilters($query, $filters);

        // requête avec pagination
        $budgetsPaginated = $query->paginate($perPage, ['*'], 'page', $page);

        if ($budgetsPaginated->isEmpty()) {
            return [
                "statut" => true,
                "message" => "Aucun budget trouvé",
                "data" => [],
                "pagination" => [
                    "page_actuelle" => $budgetsPaginated->currentPage(),
                    "element_par_page" => $budgetsPaginated->perPage(),
                    "total" => $budgetsPaginated->total(),
                    "total_pages" => $budgetsPaginated->lastPage(),
                ],
                "filtres_appliques" => array_filter($filters)
            ];
        }

        return [
            "statut" => true,
            "message" => "Budgets du client",
            "data" => $budgetsPaginated->items(),
            "pagination" => [
                "page_actuelle" => $budgetsPaginated->currentPage(),
                "element_par_page" => $budgetsPaginated->perPage(),
                "total" => $budgetsPaginated->total(),
                "total_pages" => $budgetsPaginated->lastPage(),
                "parge_suivante" => $budgetsPaginated->nextPageUrl(),
                "parge_precedente" => $budgetsPaginated->previousPageUrl()
            ],
            "filtres_appliques" => array_filter($filters)
        ];
    }
    private static function applyFilters($query, $filters) {

        // Filtre par date debut
        if (!empty($filters['dateDebut'])) {
            // $query->whereDate('DateDebut', $filters['dateDebut']);
            self::applyDateFilter($query, 'DateDebut', $filters['dateDebut']);
        }

        // Filtre par statut
       if(isset($filters['statut']) && $filters['statut'] !== null && $filters['statut'] !== '') {
            $query->where('statutBudget', $filters['statut']);
        }

        // Filtre par date de fin
        if (!empty($filters['dateFin'])) {
            // $query->whereDate('DateFin', $filters['dateFin']);
             self::applyDateFilter($query, 'DateFin', $filters['dateFin']);
        }

            // Filtre par catégorie
        if (isset($filters['categorie']) && $filters['categorie'] !== null && $filters['categorie'] !== '') {
            $query->whereHas('categories', function($q) use ($filters) {
                $q->where('IdCategorie', $filters['categorie']);
            });
        }
    }

    /**
     * filtre de date avec support d'opérateurs
     * Format: "2024-01-15" ou ">=2024-01-15" ou "<=2024-01-15"
     */
    private static function applyDateFilter($query, $field, $dateFilter) {
        if (preg_match('/^([<>]=?)(.+)$/', $dateFilter, $matches)) {
            $operator = $matches[1];
            $date = $matches[2];
            $query->whereDate($field, $operator, $date);
        } else {
            $query->whereDate($field, $dateFilter);
        }
    }



    //get budget
    public static function getBudgetCustomer($data,$idCustomers){

        $budgets = Budget::where('IdBudget',$data['IdBudget'])->where('id_customer_account',$idCustomers)->where('isArchive',0)->first();

        if(!$budgets){
            return[
                "statut"=> true,
                "message" => "Aucun budget trouvé",
                "data" => []
            ];
        }
        return [
            "statut"=> true,
            "message"=>"Budget",
            "data" => $budgets
        ];
    }


    //modifier un budget
    public static function modifierBudget($data,$idCustomers){

         DB::beginTransaction();

        try {
            // Vérifier l'existence du budget
            $budget = Budget::where('IdBudget', $data['IdBudget'])
                        ->where('isArchive', 0)
                        ->where('id_customer_account', $idCustomers)
                        ->first();

            if (!$budget) return ['statut' => false,'message' => "Aucun budget trouvé"];

            // Vérifier si le libellé existe déjà (pour un autre budget)
            $libelleExiste = Budget::where('Libelle', $data['Libelle'])
                                ->where('id_customer_account', $idCustomers)
                                ->where('IdBudget', '!=', $data['IdBudget'])
                                ->where('isArchive', 0)
                                ->first();

            if ($libelleExiste) return ['statut' => false,'message' => "Modification impossible : ce libellé existe déjà"];

            // Gestion des catégories si présentes
            if (isset($data['categories'])) {
                $validation = self::validerCategories_2($data['categories'], $data['MontantBudget']);

                if (!$validation['valide']) {
                    DB::rollBack();
                     return [
                        "statut" => false,
                        "message" => $validation['message'],
                        'doublons' => $validation['doublons'] ?? null,
                        'isArchiveCategorie' => $validation['isArchiveCategorie'] ?? null,
                        'message_complet' => $validation['message_complet'] ?? null,
                        "erreur_ligne" => $validation['ligne_erreur'] ?? null
                    ];
                }

                // Supprimer toutes les catégories existantes et recréer les nouvelles
                Budget_categorie::where('IdBudget', $data['IdBudget'])->delete();

                foreach ($data['categories'] as $categorie) {
                    Budget_categorie::create([
                        'IdBudget' => $data['IdBudget'],
                        'IdCategorie' => $categorie['IdCategorie'],
                        'MontantAffecter' => $categorie['MontantAffecter']
                    ]);
                }
            } else {

                    // Vérifier que le nouveau montant couvre les catégories existantes
                $totalAffecte = Budget_categorie::where('IdBudget', $data['IdBudget'])->sum('MontantAffecter');

                if ($data['MontantBudget'] < $totalAffecte) {
                    DB::rollBack();
                    return [
                        'statut' => false,
                        'message' => "Modification impossible : la somme allouée aux catégories ($totalAffecte) est supérieure au nouveau montant du budget ({$data['MontantBudget']})."
                    ];
                }
            }
            // Mettre à jour le budget
            $budget->Libelle = $data['Libelle'];
            $budget->MontantBudget = $data['MontantBudget'];
            $budget->DateDebut = $data['DateDebut'];
            $budget->DateFin = $data['DateFin'];
            $budget->save();

            DB::commit();

            // Charger les catégories mises à jour
            $budget->load('categories');
            return [
                'statut' => true,
                'message' => "Votre budget a été modifié avec succès",
                'data' => $budget
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'statut' => false,
                'message' => 'Erreur lors de la modification du budget',
                'erreur' => $e->getMessage()
            ];
        }
    }

    private static function validerCategories_2($categories, $montantBudget)
    {
        $totalMontant = 0;
        $categoriesIds = [];
        $erreurs = [];

        foreach ($categories as $index => $categorie) {
            $ligne = $index + 1;

            // Vérification 1: Montant non vide
            if (empty($categorie['MontantAffecter'])) {
                // $erreurs[] = "Montant manquant pour la catégorie à la ligne $ligne";
                // continue;
                return [
                    'valide' => false,
                    'message' => "Montant manquant pour la catégorie à la ligne $ligne",
                    'ligne_erreur' => $ligne,
                ];
            }

            // Vérification 2: Montant non négatif
            if ($categorie['MontantAffecter'] < 0) {
                // $erreurs[] = "Montant négatif pour la catégorie à la ligne $ligne";
                // continue;
                 return [
                    'valide' => false,
                    'message' => "Montant négatif pour la catégorie à la ligne $ligne",
                    'ligne_erreur' => $ligne,
                ];
            }

             //verifier si la categorie n'est pas archive
            if(!empty($categorie['IdCategorie'])){
                $idCategorie = $categorie['IdCategorie'];
                $categorieArchives = self::checkCategorieIsArchive($idCategorie);
                if($categorieArchives){
                    $categorieArchives_array[] = [
                        'ligne' => $ligne,
                        'categorie' => $categorieArchives->nom,
                        'id_categorie' => $idCategorie,
                    ];
                }
            }

            $idCategorie = $categorie['IdCategorie'];
            if (in_array($idCategorie, $categoriesIds)) {
                $nomCategorie = self::getNomCategorie($idCategorie);
                $doublons[] = [
                    'ligne' => $ligne,
                    'categorie' => $nomCategorie,
                    'id_categorie' => $idCategorie,
                ];
            } else {
                $categoriesIds[] = $idCategorie;
            }

            $categoriesIds[] = $idCategorie;
            $totalMontant += $categorie['MontantAffecter'];
        }

        //si des categorie sont archive
        if(!empty($categorieArchives_array)){
            $messages = [];
            foreach ($categorieArchives_array as $categorieArchive) {
                $messages[] = "La catégorie '{$categorieArchive['categorie']}' à la ligne {$categorieArchive['ligne']} n'est pas trouvée";
            }
            return [
                'valide' => false,
                'message' => "Categorie n'existe pas",
                'isArchiveCategorie' => $categorieArchives_array,
                'message_complet' => implode(', ', $messages)
            ];
        }

        // Si des doublons ont été trouvés
        if (!empty($doublons)) {
            $messages = [];
            foreach ($doublons as $doublon) {
                $messages[] = "La catégorie '{$doublon['categorie']}' est dupliquée à la ligne {$doublon['ligne']}";
            }
            return [
                'valide' => false,
                'message' => "Doublons de catégories détectés",
                'doublons' => $doublons,
                'message_complet' => implode(', ', $messages)
            ];
        }

        // Vérification 4: Somme des montants <= montant du budget
        if ($totalMontant > $montantBudget) {
            return [
                'valide' => false,
                'message' => "La somme des montants affectés ($totalMontant) dépasse le montant du budget ($montantBudget)"
            ];
        }

        return ['valide' => true];
    }

    //supprimer le budget
    public static function supprimerBudget($data,$idCustomers){
        $budget = Budget::where('IdBudget',$data['IdBudget'])->where('isArchive',0)->where('id_customer_account',$idCustomers)->first();
        if(!$budget) return ['statut'=>true, 'message'=> "Aucun budget trouvé"];

        $budget->isArchive = 1;
        $budget->updated_at = now() -> toDateTime();
        $budget->save();
        return [
            'statut'=>true,
            'message'=>"Votre budget a été supprimé"
        ];

    }




    //budget en cours du customer
    public static function BudgetsEncoursCustomers ($idCustomers){

         $budgetEncoursCustomers = Budget::where('id_customer_account',$idCustomers)
                                    ->where('statutBudget','0')->get();
        if ($budgetEncoursCustomers->isEmpty()) {
            return[
                "statut"=> true,
                "message" => "Aucun budget encours trouvé",
                "data" => []
            ];
    }
        return [
            "statut"=> true,
            "message"=>"Budgets en cours",
            "data" => $budgetEncoursCustomers
        ];
    }
    //budget ternine ou expire du customer
    public static function BudgetsTermineCustomers ($idCustomers){

         $budgetTermineCustomers = Budget::where('id_customer_account',$idCustomers)
                                    ->where('statutBudget',1)->get();
        if ($budgetTermineCustomers->isEmpty()) {
            return[
                "statut"=> true,
                "message" => "Aucun budget trouvé",
                "data" => []
            ];
        }
        return [
            "statut"=> true,
            "message"=>"Budgets terminés",
            "data" => $budgetTermineCustomers
        ];
    }


}
