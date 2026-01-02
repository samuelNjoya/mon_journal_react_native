<?php

namespace App\Http\Controllers\DepenseModule_Controller;

use App\Http\Controllers\Controller;
use App\RequestAPIClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class CategoryController extends Controller
{

    // public function index(Request $request)
    // {
    //     try {
    //         // 1. Vérifier l'authentification
    //         if (!Session::has("accessToken")) {
    //             return redirect()->route('spx.signin')
    //                 ->withErrors(['error' => 'Veuillez vous reconnecter']);
    //         }

    //         $token = Session::get("accessToken");
    //         \Log::info("Token: " . substr($token, 0, 20) . "...");

    //         // 2. Construire l'URL avec les paramètres
    //         $baseUrl = RequestAPIClass::getRoute(RequestAPIClass::$list_categories);

    //         // Préparer les paramètres pour GET
    //         $params = [
    //             'lan' => 'fr',
    //             "sessionToken"=>$request->cookie("sessionToken"),
    //             'per_page' => $request->input('per_page', 15),
    //         ];

    //         // Ajouter le paramètre de recherche si présent
    //         if ($request->has('search') && !empty($request->input('search'))) {
    //             $params['search'] = $request->input('search');
    //         }

    //         \Log::info("Calling API with params: ", $params);

    //         // 3. Appel API avec GET (pas POST) spx_get_request
    //         $body = spx_get_auth_request($baseUrl, $token, $params);
    //         // $body = spx_post_auth_request($baseUrl,$token, $params);



    //         \Log::info("API Response: ", (array) $body);

    //         // 4. Vérifier la réponse
    //         if ($body == null) {
    //             \Log::error("API returned NULL");
    //             return back()->withErrors([
    //                 'error' => 'L\'API n\'a pas répondu. Vérifiez votre connexion.'
    //             ]);
    //         }

    //         // Vérifier le format de réponse
    //         if (isset($body->status) && $body->status == 0) {
    //             $errorMsg = $body->err_msg ?? "Erreur API";
    //             \Log::error("API Error: " . $errorMsg);
    //             return back()->withErrors(['error' => $errorMsg]);
    //         }

    //         // 5. Traiter les données
    //         $categories = [];

    //         // Différents formats possibles de réponse
    //         if (isset($body->data)) {
    //             $categories = is_array($body->data) ? $body->data : [$body->data];
    //         } elseif (is_array($body)) {
    //             $categories = $body;
    //         } elseif (isset($body->categories)) {
    //             $categories = $body->categories;
    //         }

    //     // dd($categories);
    //         \Log::info("Categories count: " . count($categories));

    //         // 6. Retourner la vue
    //         return view('DepenseModule_Views.categories.index', [
    //             'categories' => $categories,
    //             'search' => $request->input('search', ''),
    //             'per_page' => $request->input('per_page', 15),
    //         ]);

    //     } catch (\Exception $e) {
    //         \Log::error('CategoryController@index Exception: ' . $e->getMessage());
    //         \Log::error('Stack trace: ' . $e->getTraceAsString());

    //         return back()->withErrors([
    //             'error' => 'Erreur: ' . $e->getMessage()
    //         ]);
    //     }
    // }
    /**
     * Show the form for creating a new category.
     */
    // public function create()
    // {
    //     return view('DepenseModule_Views.categories.create');
    // }

    /**
     * Store a newly created category.
     */
    // public function store(Request $request)
    // {
    //     // Validation
    //     $request->validate([
    //         'libelle' => 'required|string|max:255',
    //         'description' => 'nullable|string',
    //         'couleur' => 'nullable|string|max:7', // #FF0000
    //         'icone' => 'nullable|string|max:50',
    //     ]);

    //     try {
    //         // Préparer les données
    //         $data = [
    //             'lan' => 'fr',
    //             'libelle' => $request->input('libelle'),
    //             'description' => $request->input('description', ''),
    //             'couleur' => $request->input('couleur', '#3498db'),
    //             'icone' => $request->input('icone', 'fas fa-tag'),
    //         ];

    //         // Appel API
    //         $body = spx_post_auth_request(
    //             RequestAPIClass::getRoute(RequestAPIClass::$create_category),
    //             Session::get("accessToken"),
    //             $data
    //         );

    //         // Vérifier la réponse
    //         if ($body == null || (isset($body->status) && $body->status == 0)) {
    //             $errorMsg = $body->err_msg ?? "Erreur lors de la création de la catégorie";

    //             if ($request->ajax() || $request->wantsJson()) {
    //                 return response()->json([
    //                     'success' => false,
    //                     'message' => $errorMsg
    //                 ], 400);
    //             }

    //             return back()->withInput()->withErrors(['error' => $errorMsg]);
    //         }

    //         // Succès
    //         $message = 'Catégorie créée avec succès';

    //         if ($request->ajax() || $request->wantsJson()) {
    //             return response()->json([
    //                 'success' => true,
    //                 'message' => $message,
    //                 'data' => $body->data ?? $body
    //             ], 201);
    //         }

    //         return redirect()->route('depense.categories.index')
    //             ->with('success', $message);

    //     } catch (\Exception $e) {
    //         \Log::error('CategoryController@store error: ' . $e->getMessage());

    //         if ($request->ajax() || $request->wantsJson()) {
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'Erreur serveur: ' . $e->getMessage()
    //             ], 500);
    //         }

    //         return back()->withInput()
    //             ->withErrors(['error' => 'Erreur: ' . $e->getMessage()]);
    //     }
    // }
    /**
     * Show the form for editing the specified category.
     */
    // public function edit($id)
    // {
    //     try {
    //         // Récupérer la catégorie spécifique
    //         $body = spx_post_auth_request(
    //             RequestAPIClass::getRoute(RequestAPIClass::$show_category),
    //             Session::get("accessToken"),
    //             ['lan' => 'fr', 'id' => $id]
    //         );

    //         if ($body == null || (isset($body->status) && $body->status == 0)) {
    //             return redirect()->route('depense.categories.index')
    //                 ->withErrors(['error' => 'Catégorie non trouvée']);
    //         }

    //         // Formater les données
    //         $category = $body->data ?? $body;

    //         return view('DepenseModule_Views.categories.edit', [
    //             'category' => $category,
    //         ]);

    //     } catch (\Exception $e) {
    //         \Log::error('CategoryController@edit error: ' . $e->getMessage());

    //         return redirect()->route('depense.categories.index')
    //             ->withErrors(['error' => 'Erreur: ' . $e->getMessage()]);
    //     }
    // }

    /**
     * Update the specified category.
     */
    // public function update(Request $request, $id)
    // {
    //     // Validation
    //     $request->validate([
    //         'libelle' => 'required|string|max:255',
    //         'description' => 'nullable|string',
    //         'couleur' => 'nullable|string|max:7',
    //         'icone' => 'nullable|string|max:50',
    //     ]);

    //     try {
    //         // Préparer les données
    //         $data = [
    //             'lan' => 'fr',
    //             'id' => $id,
    //             'libelle' => $request->input('libelle'),
    //             'description' => $request->input('description', ''),
    //             'couleur' => $request->input('couleur', '#3498db'),
    //             'icone' => $request->input('icone', 'fas fa-tag'),
    //         ];

    //         // Appel API
    //         $body = spx_post_auth_request(
    //             RequestAPIClass::getRoute(RequestAPIClass::$update_category),
    //             Session::get("accessToken"),
    //             $data
    //         );

    //         // Vérifier la réponse
    //         if ($body == null || (isset($body->status) && $body->status == 0)) {
    //             $errorMsg = $body->err_msg ?? "Erreur lors de la modification";

    //             if ($request->ajax() || $request->wantsJson()) {
    //                 return response()->json([
    //                     'success' => false,
    //                     'message' => $errorMsg
    //                 ], 400);
    //             }

    //             return back()->withInput()->withErrors(['error' => $errorMsg]);
    //         }

    //         // Succès
    //         $message = 'Catégorie modifiée avec succès';

    //         if ($request->ajax() || $request->wantsJson()) {
    //             return response()->json([
    //                 'success' => true,
    //                 'message' => $message,
    //                 'data' => $body->data ?? $body
    //             ]);
    //         }

    //         return redirect()->route('depense.categories.index')
    //             ->with('success', $message);

    //     } catch (\Exception $e) {
    //         \Log::error('CategoryController@update error: ' . $e->getMessage());

    //         if ($request->ajax() || $request->wantsJson()) {
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'Erreur serveur: ' . $e->getMessage()
    //             ], 500);
    //         }

    //         return back()->withInput()
    //             ->withErrors(['error' => 'Erreur: ' . $e->getMessage()]);
    //     }
    // }

    /**
     * Remove the specified category.
     */
    // public function destroy($id, Request $request)
    // {
    //     try {
    //         // Appel API pour suppression
    //         $body = spx_post_auth_request(
    //             RequestAPIClass::getRoute(RequestAPIClass::$delete_category),
    //             Session::get("accessToken"),
    //             ['lan' => 'fr', 'id' => $id]
    //         );

    //         // Vérifier la réponse
    //         if ($body == null || (isset($body->status) && $body->status == 0)) {
    //             $errorMsg = $body->err_msg ?? "Erreur lors de la suppression";

    //             if ($request->ajax() || $request->wantsJson()) {
    //                 return response()->json([
    //                     'success' => false,
    //                     'message' => $errorMsg
    //                 ], 400);
    //             }

    //             return back()->withErrors(['error' => $errorMsg]);
    //         }

    //         // Succès
    //         $message = 'Catégorie supprimée avec succès';

    //         if ($request->ajax() || $request->wantsJson()) {
    //             return response()->json([
    //                 'success' => true,
    //                 'message' => $message
    //             ]);
    //         }

    //         return redirect()->route('depense.categories.index')
    //             ->with('success', $message);

    //     } catch (\Exception $e) {
    //         \Log::error('CategoryController@destroy error: ' . $e->getMessage());

    //         if ($request->ajax() || $request->wantsJson()) {
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'Erreur serveur: ' . $e->getMessage()
    //             ], 500);
    //         }

    //         return back()->withErrors(['error' => 'Erreur: ' . $e->getMessage()]);
    //     }
    // }

    /**
     * Get all categories for dropdown/select (AJAX).
     */
    // public function getAll(Request $request)
    // {
    //     try {
    //         // Appel API pour toutes les catégories
    //         $body = spx_post_auth_request(
    //             RequestAPIClass::getRoute(RequestAPIClass::$get_all_categories),
    //             Session::get("accessToken"),
    //             ['lan' => 'fr']
    //         );

    //         if ($body == null || (isset($body->status) && $body->status == 0)) {
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'Erreur lors du chargement',
    //                 'data' => []
    //             ]);
    //         }

    //         // Formater les données
    //         $categories = [];
    //         if (isset($body->data)) {
    //             $categories = is_array($body->data) ? $body->data : [$body->data];
    //         }

    //         return response()->json([
    //             'success' => true,
    //             'data' => $categories
    //         ]);

    //     } catch (\Exception $e) {
    //         \Log::error('CategoryController@getAll error: ' . $e->getMessage());

    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Erreur serveur',
    //             'data' => []
    //         ], 500);
    //     }
    // }

 /**
     * Récupérer toutes les catégories
     */
    public function getAllCategories(Request $request)
    {
        $token = Session::get("accessToken");
        $params = [
            'lan' => 'fr',
            "sessionToken" => $request->cookie("sessionToken"),
        ];

        if (!$token) {
            return response()->json([
                'status' => -1,
                'err_title' => 'Non authentifié',
                'err_msg' => 'Vous devez être connecté',
                'err_code' => 401
            ]);
        }

        try {
            $url = RequestAPIClass::getRoute('/api/categorie');
            $response = spx_get_auth_request($url, $token, $params);

            return response()->json([
                'status' => 1,
                'data' => $response
            ]);

        } catch (\Exception $e) {
            \Log::error('Erreur getAllCategories: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'err_title' => 'Erreur',
                'err_msg' => $e->getMessage(),
                'err_code' => 500
            ]);
        }
    }

    /**
     * Créer une nouvelle catégorie
     */
    public function createCategory(Request $request)
    {
        $token = Session::get("accessToken");
        $params = [
            'lan' => 'fr',
            "sessionToken" => $request->cookie("sessionToken"),
            'nom' => $request->input('nom'),
            'type' => 1, // Toujours 1 pour les catégories utilisateur
            'icon_name' => 'account-group',
            'color' => $request->input('color', '#FFC107')
        ];

        if (!$token) {
            return response()->json([
                'status' => -1,
                'err_title' => 'Non authentifié',
                'err_msg' => 'Vous devez être connecté',
                'err_code' => 401
            ]);
        }

        try {
            $url = RequestAPIClass::getRoute('/api/categorie/creer');
            $response = spx_post_auth_request($url, $token, $params);

            return response()->json([
                'status' => 1,
                'message' => 'Catégorie créée avec succès',
                'data' => $response
            ]);

        } catch (\Exception $e) {
            \Log::error('Erreur createCategory: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'err_title' => 'Erreur',
                'err_msg' => $e->getMessage(),
                'err_code' => 500
            ]);
        }
    }

    /**
     * Modifier une catégorie
     */
    public function updateCategory(Request $request)
    {
        $token = Session::get("accessToken");
        $params = [
            'lan' => 'fr',
            "sessionToken" => $request->cookie("sessionToken"),
            'id' => $request->input('id'),
            'nom' => $request->input('nom'),
            'type' => 1,
            'icon_name' => 'account-group',
            'color' => $request->input('color', '#FFC107')
        ];

        if (!$token) {
            return response()->json([
                'status' => -1,
                'err_title' => 'Non authentifié',
                'err_msg' => 'Vous devez être connecté',
                'err_code' => 401
            ]);
        }

        try {
            $url = RequestAPIClass::getRoute('/api/categorie/update');
            $response = spx_post_auth_request($url, $token, $params);

            return response()->json([
                'status' => 1,
                'message' => 'Catégorie modifiée avec succès',
                'data' => $response
            ]);

        } catch (\Exception $e) {
            \Log::error('Erreur updateCategory: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'err_title' => 'Erreur',
                'err_msg' => $e->getMessage(),
                'err_code' => 500
            ]);
        }
    }

    /**
     * Supprimer une catégorie
     */
    public function deleteCategory(Request $request)
    {
        $token = Session::get("accessToken");
        $params = [
            'lan' => 'fr',
            "sessionToken" => $request->cookie("sessionToken"),
            'id' => $request->input('id')
        ];

        if (!$token) {
            return response()->json([
                'status' => -1,
                'err_title' => 'Non authentifié',
                'err_msg' => 'Vous devez être connecté',
                'err_code' => 401
            ]);
        }

        try {
            $url = RequestAPIClass::getRoute('/api/categorie/delete');
            $response = spx_post_auth_request($url, $token, $params);

            return response()->json([
                'status' => 1,
                'message' => 'Catégorie supprimée avec succès',
                'data' => $response
            ]);

        } catch (\Exception $e) {
            \Log::error('Erreur deleteCategory: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'err_title' => 'Erreur',
                'err_msg' => $e->getMessage(),
                'err_code' => 500
            ]);
        }
    }
}
