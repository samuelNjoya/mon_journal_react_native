<?php

namespace App\Http\Controllers\Api\DepenseModule_Controller;

use App\Helpers\Api\DepenseModule_Helpers\BudgetHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Util\Json;

    // use BudgetHelper;

class BudgetController extends Controller
{

    //ajout un budget
      public function AjoutBudget(Request $request)
    {
        try{
            app()->setLocale('fr');
            $validator = Validator::make($request->all(), [
                'Libelle' => 'required|string|max:255',
                'MontantBudget' => 'required|numeric|min:0',
                'DateDebut' => 'required|date',
                'DateFin' => 'required|date|after:DateDebut',
                'categories' => 'required|array|min:1',
                'categories.*.IdCategorie' => 'required|exists:categorie_depenses,id',
                'categories.*.MontantAffecter' => 'required|numeric|min:0',
                'isCyclique' => 'sometimes|boolean',
                'typeCycle' => 'required_if:isCyclique,true|in:hebdomadaire,mensuel,annuel'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'statut' => false,
                    'message' => 'Données invalides',
                    'erreurs' => $validator->errors()
                ], 422);
            }

            $idCustomer = Auth::id();
            $resultat = BudgetHelper::creerBudget($request->all(), $idCustomer);

            if ($resultat['statut']) {
                return response()->json($resultat, 201);
            } else {
                return response()->json($resultat, 400);
            }
        }catch (\Exception $exception){
             $response['err_text'] = $exception->getMessage()." || ".$exception->getFile()." || ".$exception->getLine();
            return response()->json([
                'statut'=> false,
                'erreur'=>$response
            ]);
        }
    }
    // public function AjoutBudget(Request $request){
    //     try{
    //         app()->setLocale('fr');

    //         $validator = Validator::make($request->all(),[
    //             'Libelle' => 'required|string',
    //             'MontantBudget' => 'required|numeric|min:1',
    //             'DateDebut' => 'required|date',
    //             'DateFin' => 'required|date',
    //             'categories' => 'required|array|min:1',
    //             'categories.*.IdCategorie' => 'required|integer|exists:categorie_depenses,id', //Vérifions que l'ID existe dans la table categorie_depenses
    //             'categories.*.MontantAffecter' => 'required|numeric|min:0']);

    //         if($validator->fails()) return response()->json([
    //             'statut' => false,
    //             "message" => "Erreur de validation des données",
    //             "erreur" => $validator->errors()->toArray()
    //         ], 422);

    //         $response = BudgetHelper::CreerBudget($validator->validate(),Auth::id());
    //         return response()->json($response, $response['statut'] ? 200 : 400);

    //     }catch (\Exception $exception){
    //          $response['err_text'] = $exception->getMessage()." || ".$exception->getFile()." || ".$exception->getLine();
    //         return response()->json([
    //             'statut'=> false,
    //             'erreur'=>$response
    //         ]);
    //     }
    // }

    //liste des budget pour un customer
    public function BudgetCustomer(Request $request){
        try{
            app()->setLocale('fr');
            $idCustomers = Auth::id();

            // Vérifier et mettre à jour les budgets expirés
            BudgetHelper::checkAndUpdateExpiredBudgets($idCustomers);

            // Récupérer les paramètres de filtrage et de pagination
            $filters = [
                'categorie' => $request->query('categorie'),
                'dateDebut' => $request->query('dateDebut'),
                'statut' => $request->query('statut'),
                'dateFin' => $request->query('dateFin')
            ];

            // Paramètres de pagination avec valeurs par défaut
            $perPage = $request->query('per_page', 10); //Nbre element par page
            $page = $request->query('page', 1); // Page courante

            // Validation des paramètres de pagination
            $perPage = max(1, min(100, (int)$perPage)); // Limite entre 1 et 100
            $page = max(1, (int)$page); // Page minimum 1

            // Helper avec les filtres et la pagination
            $response = BudgetHelper::BudgetsCustomers($idCustomers, $filters, $perPage, $page);

            return response()->json($response, $response['statut'] ? 200 : 400);

        }catch (\Exception $exception){
            $response['err_text'] = $exception->getMessage()." || ".$exception->getFile()." || ".$exception->getLine();
            return response()->json([
                'statut'=> false,
                'erreur'=>$response
            ], 500);
        }
    }
    //recuperer un budget avec son id
    public function GetBudget(Request $request){
        app()->setLocale('fr');
        try{
            //  $validator = Validator::make(array_merge($request->all(), [
            //     'IdBudget' => $request->query('IdBudget')
            // ]), [
            //     'IdBudget' => 'required|integer|exists:budgets,IdBudget',
            // ]);
             $validator = Validator::make($request->all(), [
                'IdBudget' => 'required|integer|exists:budgets,IdBudget',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'statut' => false,
                    'erreur' => $validator->errors()
                ], 422);
            }

            $idCustomers = Auth::id();
            BudgetHelper::checkAndUpdateExpiredBudgets($idCustomers);
            $response = BudgetHelper::getBudgetCustomer($validator->validate(),$idCustomers);
            return response()->json($response, $response['statut'] ? 200 : 400);

        }catch (\Exception $exception){
             $response['err_text'] = $exception->getMessage()." || ".$exception->getFile()." || ".$exception->getLine();
            return response()->json([
                'statut'=> false,
                'erreur'=>$response
            ]);
        }
    }

    //modifier un budget lie au customer
    public function ModifierBudget (Request $request){
        try{
            app()->setLocale('fr');
            $validator = Validator::make($request->all(),[
                'IdBudget' => 'required|integer|exists:budgets,IdBudget',
                'Libelle' => 'required|string|max:255',
                'MontantBudget' => 'required|numeric|min:1',
                'DateDebut' => 'required|date',
                'DateFin' => 'required|date|after_or_equal:DateDebut',
                'categories' => 'sometimes|array',
                'categories.*.IdCategorie' => 'required_with:categories|integer|exists:categorie_depenses,id',
                'categories.*.MontantAffecter' => 'required_with:categories.*.IdCategorie|numeric|min:0',
            ]);

           if($validator->fails()) return response()->json([
                'statut' => false,
                "message" => "Erreur de validation des données",
                "erreur" => $validator->errors()->toArray()
            ], 422);

            $response = BudgetHelper::modifierBudget($validator->validate(), Auth::id());
            return response()->json($response, $response['statut'] ? 200 : 400);

        }catch (\Exception $exception){
             $response['err_text'] = $exception->getMessage()." || ".$exception->getFile()." || ".$exception->getLine();
            return response()->json([
                'statut'=> false,
                'erreur'=>$response
            ]);
        }
    }

    //supprimer un budget lie au customer
    public function SupprimerBudget (Request $request){
        app()->setLocale('fr');
        try{
              $validator = Validator::make($request->all(), [
                'IdBudget' => 'required|integer|exists:budgets,IdBudget',
            ]);

            if($validator->fails()) return response()->json([
                'statut'=> false,
                "message"=>"Erreur de validation des donnees",
                "error"=>$validator->getMessageBag()
            ],422);

            $response = BudgetHelper::supprimerBudget($validator->validate(),Auth::id());
            return response()->json($response, $response['statut'] ? 200 : 400);

        }catch (\Exception $exception){
             $response['err_text'] = $exception->getMessage()." || ".$exception->getFile()." || ".$exception->getLine();
            return response()->json([
                'statut'=> false,
                'erreur'=>$response
            ]);
        }

    }



    public function BudgetEncoursCustomer(){
        app()->setLocale('fr');
        try{
            $idCustomers = Auth::id();
            BudgetHelper::checkAndUpdateExpiredBudgets($idCustomers);
            $response = BudgetHelper::BudgetsEncoursCustomers($idCustomers);
            if($response) return response()->json($response,200);

        }catch (\Exception $exception){
             $response['err_text'] = $exception->getMessage()." || ".$exception->getFile()." || ".$exception->getLine();
            return response()->json([
                'statut'=> false,
                'erreur'=>$response
            ]);
        }
    }
    public function BudgetTermineCustomer(){
        app()->setLocale('fr');
        try{
            $idCustomers = Auth::id();
            BudgetHelper::checkAndUpdateExpiredBudgets($idCustomers);
            $response = BudgetHelper::BudgetsTermineCustomers($idCustomers);
            if($response) return response()->json($response,200);

        }catch (\Exception $exception){
             $response['err_text'] = $exception->getMessage()." || ".$exception->getFile()." || ".$exception->getLine();
            return response()->json([
                'statut'=> false,
                'erreur'=>$response
            ]);
        }
    }




}
