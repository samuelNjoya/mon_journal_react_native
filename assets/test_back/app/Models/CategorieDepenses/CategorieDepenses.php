<?php

namespace App\Models\CategorieDepenses;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use App\Models\DepenseModule_Models\Budget;

class CategorieDepenses extends Model
{
    protected $table = 'categorie_depenses';

    protected $fillable = [
        'id_customer_account',
        'nom',
        'type'
    ];

    //afficher toutes les categories actives et filtrer
    public static function getAllCategoriesAndFilter($type = null, $perPage = 2)
    {

         $query = self::where('is_archive', 0)
                     ->where(function ($query) {
                         $query->where('id_customer_account', Auth::id())
                               ->orWhere('type', 0);
                     });
        if (!is_null($type)) {
            $query->where('type', $type);
        }

        return $query->orderBy('created_at','desc')
                     ->paginate($perPage);

    }

    //afficher toutes les categories actives
    public static function getAllCategories()
    {
     return self::where(function ($query) {
        $query->where('id_customer_account', Auth::id())
              ->orWhere('type', 0);
        })
        ->where('is_archive', 0)
        ->orderBy('created_at','desc')
        ->get();
    }

    //afficher les categories donc le type est = 1 (personnalisée) non supprimer
    public static function getCategoriesPersonnalisee()
    {
        return self::where('type', 1)
                    ->where('id_customer_account', Auth::id())
                    ->where('is_archive', 0)
                    ->get();
    }

    //verifier si le nom de la catégorie existe déjà pour l'utilisateur connecté ou si c'est une catégorie par défaut (type = 0)
    static public function categorieNameExistsForCustumer($nom_categorie)
    {
    $customerId = Auth::id();
    return self::where('nom', $nom_categorie)
        ->where(function($q) use ($customerId) {
            $q->where('id_customer_account', $customerId)
              ->orWhere('type', 0);
        })
        ->exists();
    }

    //trouver une catégorie de l'utilisateur connecté par son id
    public static function findCategorie($id)
    {
        return self::where('id', $id)
                    ->where('id_customer_account', Auth::id())//
                    ->where('is_archive', 0)
                    ->first();
    }


    //filtrer les categories par type
    public static function filterCategoriesByType($type = null)
    {
        $query = self::where('is_archive', 0)
                     ->where(function ($query) {
                         $query->where('id_customer_account', Auth::id())
                               ->orWhere('type', 0);
                     });
        if (!is_null($type)) {
            $query->where('type', $type);
        }

        return $query->get();
    }


    public function customerAccount()
    {
        return $this->belongsTo('App\Models\UserManagement\CustomerAccount', 'id_customer_account');
    }

    public function depenses()
    {
        return $this->hasMany('App\Models\CategorieDepenses\Depenses', 'id_categorie_depense');
    }
    // Relation many-to-many avec budgets via budget_categorie
    public function budgets()
    {                           // importer Budget
        return $this->belongsToMany(Budget::class, 'budget_categorie', 'IdCategorie', 'IdBudget')
                    ->withPivot('MontantAffecter');
    }
}
