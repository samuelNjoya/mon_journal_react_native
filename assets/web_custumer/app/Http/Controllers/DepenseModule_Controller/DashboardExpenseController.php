<?php

namespace App\Http\Controllers\DepenseModule_Controller;

use App\Http\Controllers\Controller;
use App\RequestAPIClass;
use App\MenuCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class DashboardExpenseController extends Controller
{
  
    /**
     * Récupérer TOUTES les données nécessaires au dashboard
     * (catégories + dépenses)
     */
    public function getDashboardData(Request $request)
    {
        // 1. Récupérer le token de l'utilisateur connecté
        $token = Session::get("accessToken");
        $params = [
            'lan' => 'fr',
             "sessionToken"=>$request->cookie("sessionToken"),
        ];

        // 2. Si pas de token = utilisateur non connecté
        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié'
            ], 401);
        }

        // 3. Appeler l'API pour récupérer les CATÉGORIES
        $categoriesUrl = RequestAPIClass::getRoute(RequestAPIClass::$list_categories);
        $categoriesResponse = spx_get_auth_request($categoriesUrl, $token, $params);

        // 4. Appeler l'API pour récupérer les DÉPENSES
        $depensesUrl = RequestAPIClass::getRoute('/api/depenses');
        $depensesResponse = spx_get_auth_request($depensesUrl, $token, $params);

        // 5. Retourner les deux en un seul JSON
        return response()->json([
            'success' => true,
            'data' => [
                'categories' => $categoriesResponse,
                'expenses' => $depensesResponse
            ]
        ]);
    }

    /**
     * Récupérer la liste des budgets avec leurs catégories pour le filtre
     */
    public function getBudgetCategoryFilter(Request $request)
    {
        $token = Session::get("accessToken");
        $params = [
            'lan' => 'fr',
            "sessionToken" => $request->cookie("sessionToken"),
        ];
        
        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié'
            ], 401);
        }

        try {
            // Appeler l'API pour récupérer les budgets avec leurs catégories
            $url = RequestAPIClass::getRoute('/api/categorie/buget_categorie_list_filter');
            $response = spx_get_auth_request($url, $token, $params);

            return response()->json([
                'success' => true,
                'data' => $response
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Erreur getBudgetCategoryFilter: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur : ' . $e->getMessage()
            ], 500);
        }
    }
}
