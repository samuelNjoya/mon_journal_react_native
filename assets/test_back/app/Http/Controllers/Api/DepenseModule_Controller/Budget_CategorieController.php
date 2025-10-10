<?php

namespace App\Http\Controllers\Api\DepenseModule_Controller;

use App\Helpers\Api\DepenseModule_Helpers\Budget_CategorieHelper;
use App\Helpers\Api\DepenseModule_Helpers\Budget_CategorieHelper2;
use App\Helpers\Api\DepenseModule_Helpers\BudgetCategorieHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class Budget_CategorieController extends Controller
{

   //recuperer le budget et les catégories associe à partir de IdBudget
     public function getBudgetCategorieByIdBudget(Request $request){
        try{
            app()->setLocale('fr');
            $validator = Validator::make($request->all(), [
                'IdBudget' => 'required|integer|exists:budgets,IdBudget',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'statut' => false,
                    'erreur' => $validator->errors()
                ], 422);
            }

            $response = Budget_CategorieHelper::getBudgetCategorieByIdBudget($validator->validate());
            return response()->json($response, $response['statut'] ? 200 : 400);

        }catch (\Exception $exception){
            $response['err_text'] = $exception->getMessage()." || ".$exception->getFile()." || ".$exception->getLine();
            return response()->json([
                'statut'=> false,
                'erreur'=>$response
            ]);
        }
    }

     //recuperer le budget et la catégorie à partir de IdCategorie
     public function getBudgetCategorieByIdCategorie(Request $request){
        try{
            app()->setLocale('fr');
            $validator = Validator::make($request->all(), [
                'IdCategorie' => 'required|integer|exists:categorie_depenses,id',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'statut' => false,
                    'erreur' => $validator->errors()
                ], 422);
            }
            $response = Budget_CategorieHelper::getBudgetCategorieByIdCategorie($validator->validate());
            return response()->json($response, $response['statut'] ? 200 : 400);

        }catch (\Exception $exception){
             $response['err_text'] = $exception->getMessage()." || ".$exception->getFile()." || ".$exception->getLine();
            return response()->json([
                'statut'=> false,
                'erreur'=>$response
            ]);
        }
    }

     // public function LierCategorieBudget(Request $request){
    //         try{
    //         // $fair_user = $request->fair_user;
    //         $validator= Validator::make($request->all(),[
    //         'IdBudget'=> 'required|numeric',
    //         'MontantBudget'=> 'required|numeric',
    //         'IdCategorie' => 'required|numeric',
    //         ]);

    //         if($validator->fails()) return response()->json([
    //             'statut'=> false,
    //             "message"=>"Erreur de validation des donnees",
    //             "error"=>$validator->getMessageBag()
    //         ],422);

    //         // $response = BudgetCategorieHelper::LierBudgetCategorieHelper($validator->validate());
    //         $response = Budget_CategorieHelper::LierBudgetCategorieHelper($validator->validate());
    //         if($response) return response()->json($response,200);

    //     }catch (\Exception $exception){
    //          $response['err_text'] = $exception->getMessage()." || ".$exception->getFile()." || ".$exception->getLine();
    //         return response()->json([
    //             'statut'=> false,
    //             'erreur'=>$response
    //         ]);
    //     }
    // }
}
