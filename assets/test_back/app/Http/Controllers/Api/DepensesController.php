<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CategorieDepenses\Depenses;
use App\Models\CategorieDepenses\CategorieDepense;
use App\Models\UserManagement\CustomerAccount;
use App\Http\Resources\CategorieDepenses\ResourceDepenses;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;



class DepensesController extends Controller
{

    public function index(Request $request){
        //$depenses = Depenses::getDepenses(); $status
        $libelle = $request->input('libelle');
        $perPage = $request->input('per_page', 10);
        $id_budget = $request->input('id_budget');
        $id_categorie_depense = $request->input('id_categorie');
        $montantMin = $request->input('montant_min');
        $montantMax = $request->input('montant_max');
        $is_repetitive = $request->input('is_repetitive');
        $status_is_repetitive = $request->input('status_is_repetitive');
        $date_debut = $request->input('date_debut');
        $date_fin = $request->input('date_fin');
        $depenses = Depenses::getDepensesAndFilter($libelle, $id_budget, $id_categorie_depense, $perPage, $montantMin, $montantMax,$is_repetitive,$status_is_repetitive,$date_debut,$date_fin);
        if ($depenses->isEmpty()) {
            return response()->json(['error' => 'Aucune dépense trouvée'], 404);
        }
        return ResourceDepenses::collection($depenses);
    }

    public function show(Request $request){

        $depense = Depenses::findDepense($request->input('id'));
        if (!$depense) {
            return response()->json(['error' => 'Dépense non trouvée'], 404);
        }
        return new ResourceDepenses($depense);
    }

    public function store(Request $request){
        app()->setLocale('fr');
        $request->validate([
            'libelle' => 'required|string|max:255',
            'montant' => 'required|numeric|min:0',
         //   'is_repetitive'=> 'required|integer|in:0,1',
            'date_debut' => 'required_if:is_repetitive,1|nullable|date|after_or_equal:today',
            'date_fin' => 'required_if:is_repetitive,1|nullable|date|after:date_debut|different:date_debut',
            'piece_jointe' => 'nullable|string|max:255',
           // 'status_is_repetitive' => 'required_if:is_repetitive,1|integer|in:0,1,2',
           // 'id_categorie_depense' => 'required|integer|exists:categorie_depenses,id',
        ]);

        //appel au model pour verifier que la catégorie appartient bien à l'utilisateur connecté
        $categorieExists = Depenses::checkDepensesByCategorie($request->id_categorie_depense);
        if (!$categorieExists) {
            return response()->json(['error' => 'catégorie non trouvée'], 403);
        }

         // Vérifier existence budget
        $budgetExists = Depenses::checkBudgetExistence($request->IdBudget);
        if (!$budgetExists) {
            return response()->json(['error' => 'Budget non trouvé, terminé ou archivé'], 403);
        }

        //verification de la categorie du budget
        //  $categorieExistsBudget = Depenses::checkCategorieInBudget($request->id_categorie_depense, $request->IdBudget);
        // if (!$categorieExistsBudget) {
        //     return response()->json(['error' => 'catégorie non trouvée pour ce budget'], 403);
        // }

        // verification de la categorie liée au budget uniquement au cas ou le budget est concerné
       if (!is_null($request->IdBudget)) {
            $categorieExistsBudget = Depenses::checkCategorieInBudget($request->id_categorie_depense, $request->IdBudget);
            if (!$categorieExistsBudget) {
                return response()->json(['error' => 'catégorie non trouvée pour ce budget'], 403);
            }
        }

    //    try {
    //         Depenses::checkDepensesByCategorie($request->id_categorie_depense, $request->IdBbudget ?? null);
    //     } catch (\Exception $e) {
    //         return response()->json(['error' => $e->getMessage()], 403);
    //     }

        $depense = new Depenses();
        $depense->libelle = trim($request->libelle);
        $depense->montant = trim($request->montant);
        $depense->is_repetitive = $request->is_repetitive ?? 0;
        $depense->date_debut = $request->date_debut;
        $depense->date_fin = $request->date_fin;
        $depense->piece_jointe = $request->piece_jointe;
        if ($depense->is_repetitive == 1) {
            $depense->status_is_repetitive = 0;
        } else {
            $depense->status_is_repetitive = $request->status_is_repetitive;
        }
        $depense->id_categorie_depense = $request->id_categorie_depense;
        $depense->IdBudget = $request->IdBudget;
        $depense->id_customer_account = Auth::id();
     //   $depense->save();

         // Vérifier si la dépense est liée à un budget
        if ($depense->IdBudget) {

            $alerts = [];
            // Calculer dépassement par catégorie
            $depassementCategorie = Depenses::checkDepassementCategorie(
                $depense->IdBudget,
                $depense->id_categorie_depense,
                $depense->montant
            );

            if ($depassementCategorie) { // si valeur return du model differente de null
              $alerts[] = "Vous avez dépassé le budget affecté à la catégorie " . $depassementCategorie['nom_categorie'] . " du budget " .
                           $depassementCategorie['libelle_budget'] ." de " . number_format($depassementCategorie['montant_depasse'], 0, ',', ' ') . " FCFA";
            }

            // Calculer dépassement global budget
            $depassementGlobal = Depenses::checkDepassementBudgetGlobal(
                $depense->IdBudget,
                $depense->montant
            );

            if ($depassementGlobal) {// si valeur return du model differente de null
                $alerts[] = "Vous avez dépassé le budget " . $depassementGlobal['libelle_budget'] . " de " .
                             number_format($depassementGlobal['montant_depasse'], 0, ',', ' ') . " FCFA";
            }

        }

        //enregistrer la depense apres toutes les verification c'est important de vérifier les depassements
        // de categorie et budget avant d'enregistrer pour eviter les erreurs de calcules
        $depense->save();

           if (!empty($alerts)) {
                return response()->json([
                    'data' => $depense,
                    'alerts' => $alerts
                ], 201);
            }

        return response()->json(['data' => $depense], 201);

       // return new ResourceDepenses($depense);
    }

    //fonction pour generer les depenses repetitives
    public function genererDepenseRepetitive(){
       $depensegenerees = Depenses::generateNextRepetitiveDepense();
       $nombre = count($depensegenerees);
       if($nombre>0){
          return response()->json(
            [
                'message' => "$nombre dépense(s) répétitive(s) générée(s).",
                'libelle(s)' => $depensegenerees
            ]
          );
       }else{
         return response()->json(['message' => 'Aucune Dépense répétitive générée.'],200);
       }

    }

    //modifier
    public function update(Request $request){
        app()->setLocale('fr');
        $request->validate([
            'libelle' => 'required|string|max:255',
            'montant' => 'required|numeric|min:0',
            'is_repetitive'=> 'required|integer',
            'date_debut' => 'required_if:is_repetitive,1|nullable|date|after_or_equal:today',
            'date_fin' => 'required_if:is_repetitive,1|nullable|date|after:date_debut|different:date_debut',
            'piece_jointe' => 'nullable|string|max:255',
            // 'status_is_repetitive' => 'required_if:is_repetitive,1|integer|in:0,1,2',
           // 'id_categorie_depense' => 'sometimes|integer|exists:categorie_depenses,id'
        ]);

        $depense = Depenses::findDepense($request->input('id'));
        if (!$depense) {
            return response()->json(['error' => 'Dépense non trouvée'], 404);
        }

        //appel au model pour verifier que la catégorie appartient bien à l'utilisateur connecté
        $categorieExists = Depenses::checkDepensesByCategorie($request->id_categorie_depense);
        if (!$categorieExists) {
            return response()->json(['error' => 'catégorie non trouvée'], 403);
        }

         $budgetExists = Depenses::checkBudgetExistence($request->IdBudget);
        if (!$budgetExists) {
            return response()->json(['error' => 'Budget non trouvé, terminé ou archivé'], 403);
        }


        // verification de la categorie liée au budget uniquement au cas ou le budget est concerné
       if (!is_null($request->IdBudget)) {
            $categorieExistsBudget = Depenses::checkCategorieInBudget($request->id_categorie_depense, $request->IdBudget);
            if (!$categorieExistsBudget) {
                return response()->json(['error' => 'catégorie non trouvée pour ce budget'], 403);
            }
        }

        //ancien montant pour eviter les doublons dans la BD et générer les Alertes bien calculés
        $ancien_montant = $depense->montant;

        $depense->libelle = trim($request->libelle);
        $depense->montant = trim($request->montant);
        $depense->is_repetitive = $request->is_repetitive;
        $depense->date_debut = $request->date_debut;
        $depense->date_fin = $request->date_fin;
        $depense->piece_jointe = trim($request->piece_jointe);
        $depense->status_is_repetitive = $request->status_is_repetitive;
        $depense->IdBudget = $request->IdBudget;
        $depense->id_categorie_depense = trim($request->id_categorie_depense);
       // $depense->id_customer_account = trim($request->id_customer_account);

         // Vérifier si la dépense est liée à un budget
        if ($depense->IdBudget) {

            $alerts = [];
            // Calculer dépassement par catégorie
            $depassementCategorie = Depenses::checkDepassementCategorieUpdate(
                $depense->IdBudget,
                $depense->id_categorie_depense,
                $depense->montant,
                $ancien_montant
            );

            if ($depassementCategorie) { // si valeur return du model differente de null
              $alerts[] = "Vous avez dépassé le budget affecté à la catégorie " . $depassementCategorie['nom_categorie'] . " du budget " .
                           $depassementCategorie['libelle_budget'] ." de " . number_format($depassementCategorie['montant_depasse'], 0, ',', ' ') . " FCFA";
            }

            // Calculer dépassement global budget
            $depassementGlobal = Depenses::checkDepassementBudgetGlobalUpdate(
                $depense->IdBudget,
                $depense->montant,
                $ancien_montant
            );

            if ($depassementGlobal) {// si valeur return du model differente de null
                $alerts[] = "Vous avez dépassé le budget " . $depassementGlobal['libelle_budget'] . " de " .
                             number_format($depassementGlobal['montant_depasse'], 0, ',', ' ') . " FCFA";
            }

        }

        //Enregistrement apres verification de depassement du montant alloué au budget ou categorie du budget
        // qui est succeptible de se declancher aussi lors de la modification
        $depense->save();


            if (!empty($alerts)) {
                return response()->json([
                    'data' => $depense,
                    'alerts' => $alerts
                ], 201);
            }

        return response()->json(['data' => $depense], 201);

       // return new ResourceDepenses($depense);
    }

    //supprimer
    public function destroy(Request $request){
        $depense = Depenses::findDepense($request->input('id'));
        if (!$depense) {
            return response()->json(['error' => 'Dépense non trouvée '], 404);
        }
        $depense->is_archive = 1;
        $depense->save();
        return response()->json(["Depense supprimer"], 200);
    }


    // fonction pour dupliquer une depense
    public function dupliquerrDepense(Request $request){

       $depense = Depenses::findDepense($request->input('id'));

        if (!$depense) {
            return response()->json(['message' => 'Dépense non trouvée'], 404);
        }

        $nouvelleDepense = $depense->dupliquer();

        return response()->json([
            'message' => 'Dépense dupliquée avec succès',
            'nouvelle_depense' => $nouvelleDepense,
        ]);

    }

}

