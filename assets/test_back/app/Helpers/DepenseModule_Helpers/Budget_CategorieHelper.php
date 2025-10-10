<?php

namespace App\Helpers\Api\DepenseModule_Helpers;

use App\Http\Controllers\Controller;
use App\Models\AssMod\Category;
use App\Models\DepenseModule_Models\Budget;
use App\Models\DepenseModule_Models\Budget_categorie;
use App\Models\DepenseModule_Models\CategorieDepenses;
use Illuminate\Http\Request;

class Budget_CategorieHelper
{

      //recuperer le budget et les catégorie à partir de IdBudget
    public static function getBudgetCategorieByIdBudget($data){
        $isArchiveBudget = Budget::where('isArchive',0)->where('IdBudget',$data['IdBudget'])->first();
        if(!$isArchiveBudget) return [
            "statut" => false,
            "message"=> "Aucun budget trouvé",
            "data"=> []
        ];
        $categorieBudgetByIdBudget = Budget_categorie:: with('categorie','budget')
            ->whereHas('categorie', function($query) {
                    $query->where('isArchive', 0);
                })
            ->whereHas('budget', function($query) {
                $query->where('isArchive', 0);
            })
            -> where('IdBudget',$data['IdBudget'])->get();

         if ($categorieBudgetByIdBudget->isEmpty()) {
            return[
                "statut"=> false,
                "message" => "Aucune categorie liée a ce budget",
                "data" => []
            ];
        }
        return [
            "statut"=> true,
            "message"=>"Categories liées au budget",
            "data" => $categorieBudgetByIdBudget
        ];

    }

    //recuperer le budget et catégorie à partir de IdCategorie
    public static function getBudgetCategorieByIdCategorie($data){

        $isArchiveCategorie = CategorieDepenses::where('isArchive',0)->where('id',$data['IdCategorie'])->first();
        if(!$isArchiveCategorie) return[
            "statut" => false,
            "message"=> "Aucune categorie trouvée",
            "data"=> []
        ];
          $categorieBudgetByIdCategorie = Budget_categorie:: with('categorie','budget')
          ->whereHas('categorie', function($query) {
                    $query->where('isArchive', 0);
                })
            ->whereHas('budget', function($query) {
                $query->where('isArchive', 0);
            })-> where('IdCategorie',$data['IdCategorie'])->first();

         if (!$categorieBudgetByIdCategorie) {
            return[
                "statut"=> false,
                "message" => "Données non trouvées",
                "data" => []
            ];
        }
        return [
            "statut"=> true,
            "message"=>"Categories lié au budget",
            "data" => $categorieBudgetByIdCategorie
        ];

    }

    // //lier la categorie au budget
    // public static function LierBudgetCategorieHelper($data){

    //     $budget = Budget::where('IdBudget',$data['IdBudget'])->first();
    //     if(!$budget) return [
    //         "statut"=> false,
    //         "message" => "Le budget specifique n'existe"
    //     ];

    //      $categorie = CategorieDepenses::where('id',$data['IdCategorie'])->first();
    //     if(!$categorie) return [
    //         "statut"=> false,
    //         "message" => "La categorie specifique n'existe pas"
    //     ];

    //     //montant total affecte a des categorie du budget
    //     $totalAffecte = Budget_categorie::where('IdBudget',$data['IdBudget'])->sum('MontantAffecter');

    //     $nouveauTotal = $totalAffecte + $data['MontantBudget'];
    //     $montantRestant = $budget->MontantBudget - $totalAffecte;
    //     if($nouveauTotal > $budget->MontantBudget) {

    //         return [
    //             'statut'=>false,
    //             'message'=> "Impossible de lier cette categorie au budget. Montant disponsible insuffisant.Reste: {$montantRestant} FCFA"
    //         ];
    //     }


    //     $budgetCategorie = new Budget_categorie();
    //     $budgetCategorie->IdBudget = $data['IdBudget'];
    //     $budgetCategorie->IdCategorie = $data['IdCategorie'];
    //     $budgetCategorie->MontantAffecter = $data['MontantBudget'];
    //     $budgetCategorie->save();

    //     return [
    //         'statut'=>true,
    //         'message'=> "Votre categorie a été liée a ce budget. Montant disponible pour ce budget: {$montantRestant}"
    //     ];
    // }

}
