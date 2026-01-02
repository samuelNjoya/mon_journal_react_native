<?php

namespace App\Http\Controllers\DepenseModule_Controller;

use App\Http\Controllers\Controller;
use App\RequestAPIClass;
use App\MenuCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class ExpenseController extends Controller
{
    /**
     * Afficher la page de l'historique
     */
    public function index()
    {
        return view('DepenseModule_Views.expenses_history');
    }

    /**
 * Créer une nouvelle dépense
 */
/**
 * Créer une nouvelle dépense
 */
// public function createExpense(Request $request)
// {
//     $token = Session::get("accessToken");

//     if (!$token) {
//         return response()->json([
//             'status' => -1,
//             'err_title' => 'Non authentifié',
//             'err_msg' => 'Vous devez être connecté',
//             'err_code' => 401
//         ]);
//     }

//     try {
//         // ✅ Préparer le payload propre
//         $params = [
//             'lan' => 'fr',
//             'sessionToken' => $request->cookie("sessionToken"),
//             'libelle' => $request->input('libelle'),
//             'montant' => $request->input('montant'),
//             'id_categorie_depense' => $request->input('id_categorie_depense'),
//             'IdBudget' => $request->input('IdBudget') ?? null,
//             'piece_jointe' => $request->input('piece_jointe') ?? null,
//             'is_repetitive' => $request->input('is_repetitive') ? 1 : 0,
//             'status_is_repetitive' => $request->input('is_repetitive') ? 0 : null,
//             'date_debut' => $request->input('date_debut') ?? null,
//             'date_fin' => $request->input('date_fin') ?? null,
//             'created_at' => $request->input('created_at') ?? date('Y-m-d')
//         ];

//         // ✅ Appeler l'API
//         $url = RequestAPIClass::getRoute('/api/depenses/creer');
//         $response = spx_post_auth_request($url, $token, $params);

//         // ✅ Log pour debug
//         \Log::info('Response createExpense:', ['response' => $response]);

//         // ✅ Vérifier la vraie structure de la réponse
//         if (isset($response['data'])) {
//             return response()->json([
//                 'status' => 1,
//                 'message' => 'Dépense créée avec succès',
//                 'data' => $response['data'],
//                 'alerts' => $response['alerts'] ?? [] // ✅ Retourner les alertes de dépassement
//             ]);
//         } else {
//             // Si pas de 'data', retourner toute la réponse
//             return response()->json([
//                 'status' => 1,
//                 'message' => 'Dépense créée avec succès',
//                 'data' => $response,
//                 'alerts' => $response['alerts'] ?? []
//             ]);
//         }

//     } catch (\Exception $e) {
//         \Log::error('Erreur createExpense: ' . $e->getMessage());
//         \Log::error('Trace: ' . $e->getTraceAsString());

//         return response()->json([
//             'status' => 0,
//             'err_title' => 'Erreur',
//             'err_msg' => $e->getMessage(),
//             'err_code' => 500
//         ]);
//     }
// }

public function createExpense(Request $request)
{
    $token = Session::get("accessToken");

    // ✅ LOG 1 - Vérifier le token
    \Log::info('=== CREATE EXPENSE DEBUG ===');
    \Log::info('Token exists:', ['token' => $token ? 'YES' : 'NO']);

    if (!$token) {
        return response()->json([
            'status' => -1,
            'err_title' => 'Non authentifié',
            'err_msg' => 'Vous devez être connecté',
            'err_code' => 401
        ]);
    }

    try {
        // ✅ LOG 2 - Vérifier les données reçues
        \Log::info('Request data:', $request->all());

        // Préparer le payload
        $params = [
            'lan' => 'fr',
            'sessionToken' => $request->cookie("sessionToken"),
            'libelle' => $request->input('libelle'),
            'montant' => $request->input('montant'),
            'id_categorie_depense' => $request->input('id_categorie_depense'),
            'IdBudget' => $request->input('IdBudget'),
            'piece_jointe' => $request->input('piece_jointe'),
            'is_repetitive' => $request->input('is_repetitive') ? 1 : 0,
            'status_is_repetitive' => $request->input('is_repetitive') ? 0 : null,
            'date_debut' => $request->input('date_debut'),
            'date_fin' => $request->input('date_fin'),
            'created_at' => $request->input('created_at') ?? date('Y-m-d')
        ];

        // ✅ LOG 3 - Vérifier les params envoyés à l'API
        \Log::info('Params to API:', $params);

        // Appeler l'API
        $url = RequestAPIClass::getRoute('/api/depenses/creer');

        // ✅ LOG 4 - Vérifier l'URL
        \Log::info('API URL:', ['url' => $url]);

        $response = spx_post_auth_request($url, $token, $params);

        // ✅ LOG 5 - Vérifier la réponse
        \Log::info('API Response:', ['response' => $response]);

        return response()->json([
            'status' => 1,
            'message' => 'Dépense créée avec succès',
            'data' => $response,
            //'alerts' => $response['alerts'] ?? []
             'alerts' => $response->alerts ?? []  // ✅ CORRECT
        ]);

    } catch (\Exception $e) {
        // ✅ LOG 6 - Capturer l'erreur exacte
        \Log::error('=== ERREUR createExpense ===');
        \Log::error('Message: ' . $e->getMessage());
        \Log::error('File: ' . $e->getFile());
        \Log::error('Line: ' . $e->getLine());
        \Log::error('Trace: ' . $e->getTraceAsString());

        return response()->json([
            'status' => 0,
            'err_title' => 'Erreur',
            'err_msg' => $e->getMessage(),
            'err_code' => 500
        ]);
    }
}

  /**
 * Récupérer TOUTES les dépenses
 */
    public function getExpenses(Request $request)
    {
        $token = Session::get("accessToken");

        if (!$token) {
            return response()->json([
                'status' => -1,
                'err_title' => 'Non authentifié',
                'err_msg' => 'Vous devez être connecté',
                'err_code' => 401
            ]);
        }

        try {
            // ✅ Pas de paramètres de filtrage - on charge TOUT
            $params = [
                'lan' => 'fr',
                'sessionToken' => $request->cookie("sessionToken")
            ];

            $url = RequestAPIClass::getRoute('/api/depenses/');
            $response = spx_get_auth_request($url, $token, $params);

            return response()->json([
                'status' => 1,
                'data' => $response
            ]);

        } catch (\Exception $e) {
            \Log::error('Erreur getExpenses: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'err_title' => 'Erreur',
                'err_msg' => $e->getMessage(),
                'err_code' => 500
            ]);
        }
    }

    /**
     * Récupérer les budgets pour le filtre
     */
    public function getBudgets(Request $request)
    {
        $token = Session::get("accessToken");
        $params = [
            'lan' => 'fr',
            'sessionToken' => $request->cookie("sessionToken")
        ];

        if (!$token) {
            return response()->json(['status' => -1]);
        }

        try {
            $url = RequestAPIClass::getRoute('/api/buget_categorie_list_filter');
            $response = spx_get_auth_request($url, $token, $params);

            return response()->json([
                'status' => 1,
                'data' => $response
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'err_title' => 'Erreur',
                'err_msg' => $e->getMessage(),
                'err_code' => 500
            ]);
        }
    }

    /**
     * Récupérer les catégories
     */
    public function getCategories(Request $request)
    {
        $token = Session::get("accessToken");
        $params = [
            'lan' => 'fr',
            'sessionToken' => $request->cookie("sessionToken")
        ];

        if (!$token) {
            return response()->json(['status' => -1]);
        }

        try {
            $url = RequestAPIClass::getRoute('/api/categorie/getAllCategorie');
            $response = spx_get_auth_request($url, $token, $params);

            return response()->json([
                'status' => 1,
                'data' => $response
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'err_title' => 'Erreur',
                'err_msg' => $e->getMessage(),
                'err_code' => 500
            ]);
        }
    }

    /**
     * Supprimer une dépense
     */
    public function deleteExpense(Request $request)
    {
        $token = Session::get("accessToken");
        $params = [
            'lan' => 'fr',
            'sessionToken' => $request->cookie("sessionToken"),
            'id' => $request->input('id')
        ];

        if (!$token) {
            return response()->json(['status' => -1]);
        }

        try {
            $url = RequestAPIClass::getRoute('/api/depenses/delete');
            $response = spx_post_auth_request($url, $token, $params);

            return response()->json([
                'status' => 1,
                'message' => 'Dépense supprimée avec succès',
                'data' => $response
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'err_title' => 'Erreur',
                'err_msg' => $e->getMessage(),
                'err_code' => 500
            ]);
        }
    }

    /**
     * Dupliquer une dépense
     */
    public function duplicateExpense(Request $request)
    {
        $token = Session::get("accessToken");
        $params = [
            'lan' => 'fr',
            'sessionToken' => $request->cookie("sessionToken"),
            'id' => $request->input('id')
        ];

        if (!$token) {
            return response()->json(['status' => -1]);
        }

        try {
            $url = RequestAPIClass::getRoute('/api/depenses/dupliquer_dps');
            $response = spx_post_auth_request($url, $token, $params);

            return response()->json([
                'status' => 1,
                'message' => 'Dépense dupliquée avec succès',
                'data' => $response
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'err_title' => 'Erreur',
                'err_msg' => $e->getMessage(),
                'err_code' => 500
            ]);
        }
    }

    /**
     * Arrêter la récurrence d'une dépense
     */
    public function stopRecurring(Request $request)
    {
        $token = Session::get("accessToken");
        $params = [
            'lan' => 'fr',
            'sessionToken' => $request->cookie("sessionToken"),
            'id' => $request->input('id')
        ];

        if (!$token) {
            return response()->json(['status' => -1]);
        }

        try {
            $url = RequestAPIClass::getRoute('/api/depenses/stop_dps_repetitive');
            $response = spx_post_auth_request($url, $token, $params);

            return response()->json([
                'status' => 1,
                'message' => 'Récurrence arrêtée avec succès',
                'data' => $response
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'err_title' => 'Erreur',
                'err_msg' => $e->getMessage(),
                'err_code' => 500
            ]);
        }
    }
}
