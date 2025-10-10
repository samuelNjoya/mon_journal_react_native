<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CategorieDepenses\CategorieDepenses;
use App\Http\Resources\CategorieDepenses\ResourceCategorieDps;
use Illuminate\Support\Facades\Auth;

class CategorieDpsController extends Controller
{
    //
    public function index(Request $request)
    {
       $type = $request->input('type');
       $perPage = $request->input('per_page', 10); // Nombre d'éléments par page, valeur par défaut
       $categories = CategorieDepenses::getAllCategoriesAndFilter($type, $perPage);
       return ResourceCategorieDps::collection($categories);
    }

    public function show(Request $request)
    {
        $categorie = CategorieDepenses::findCategorie($request->input('id'));
        if (!$categorie) {
            return response()->json(['error' => 'Catégorie non trouvée'], 404);
        }
        return new ResourceCategorieDps($categorie);
    }

    public function store(Request $request)
    {
        app()->setLocale('fr');
        $request->validate([
            'nom' => 'required|string|max:255',
            'type' => 'required|boolean',
        ]);

        //appel au model pour verifier que le nom de la catégorie n'existe pas déjà pour l'utilisateur connecté
        $nomExists = CategorieDepenses::categorieNameExistsForCustumer($request->nom);
        if ($nomExists) {
            return response()->json(['error' => 'Le nom de cette catégorie existe déjà'], 422);
        }

      //  $categorie = CategorieDepenses::create($request->all());
        $categorie = new CategorieDepenses();
        $categorie->nom = trim($request->nom);
        $categorie->type = $request->type;
        $categorie->id_customer_account = Auth::id();
        $categorie->save();

        return new ResourceCategorieDps($categorie);
    }

    // publiic function edit()
    public function update(Request $request)
    {
        app()->setLocale('fr');
        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'type' => 'sometimes|boolean',
        ]);

        //modifier les categories de l'utilisateur connecter
        $categorie = CategorieDepenses::findCategorie($request->input('id'));
        if (!$categorie) {
            return response()->json(['error' => 'Catégorie non trouvée ou vous n\'êtes pas autorisé à la modifier'], 404);
        }


        $nomExists = CategorieDepenses::categorieNameExistsForCustumer($request->nom);
        if ($nomExists && $categorie->nom !== $request->nom) {
            return response()->json(['error' => 'Le nom de cette catégorie existe déjà'], 422);
       }


        $categorie->nom = trim($request->nom);
        $categorie->type = $request->type;
        $categorie->save();

        return new ResourceCategorieDps($categorie);

    }

    public function destroy(Request $request)
    {
        $categorie = CategorieDepenses::findCategorie($request->input('id'));
        if (!$categorie) {
            return response()->json(['error' => 'Catégorie non trouvée ou vous n\'êtes pas autorisé à la supprimer'], 404);
        }
        //quand on supprime une catégorie, on archive aussi toutes les dépenses associées à cette catégorie
        $categorie->is_archive = 1;
        $categorie->save();
        $depenses = $categorie->depenses;
        foreach ($depenses as $depense) {
            $depense->is_archive = 1;
            $depense->save();
        }
        return response()->json(["categorie supprimée avec toutes les depenses associées"], 200);
    }

}

