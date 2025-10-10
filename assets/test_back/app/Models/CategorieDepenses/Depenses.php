<?php

namespace App\Models\CategorieDepenses;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use App\Models\CategorieDepenses\CategorieDepenses;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class Depenses extends Model
{
    protected $table = 'depenses';

    protected $fillable = [
        'libelle',
        'montant',
        'is_repetitive',
        'date_debut',
        'date_fin',
        'piece_jointe',
        'status_is_repetitive',
        'id_categorie_depense',
        'IdBudget',
        'id_customer_account',
        'id_transaction'
    ];

    //afficher les depeses de l'utilisateur authentifié
    public static function getDepenses()
    {
        return self::where('id_customer_account', Auth::id())
                    ->where('is_archive', 0)
                     ->orderBy('created_at', 'desc')
                     ->get();
    }

    //afficher toutes les depenses actives filtrées par catégorie et paginées
    // public static function getDepensesAndFilter($id_budget = null,$id_categorie_depense = null, $perPage = 10, $montantMin = null, $montantMax = null, $is_repetitive = null, $status = null)
    // {

    //      $query = self::where('id_customer_account', Auth::id())
    //                  ->where('is_archive', 0);
    //     if (!is_null($id_budget)) {
    //         $query->where('IdBudget', $id_budget);
    //     }
    //     if (!is_null($id_categorie_depense)) {
    //         $query->where('id_categorie_depense', $id_categorie_depense);
    //     }
    //     if (!is_null($montantMin)) {
    //         $query->where('montant', '>=', $montantMin);
    //     }
    //     if (!is_null($montantMax)) {
    //         $query->where('montant', '<=', $montantMax);
    //     }
    //     if (!is_null($is_repetitive)) {
    //       $query->where('is_repetitive', $is_repetitive);
    //     }
    //      if (!is_null($status)) {
    //       $query->where('status_is_repetitive', $status);
    //     }

    //     return $query->orderBy('id','desc')
    //                  ->paginate($perPage);
    // }

public static function getDepensesAndFilter($libelle = null, $id_budget = null, $id_categorie_depense = null, $perPage = 10, $montantMin = null, $montantMax = null, $is_repetitive = null, $status = null, $date_debut = null, $date_fin = null)
{
    $query = self::with(['categorieDepense.budgets', 'CustomerAccount']) // Charger les relations imbriquées ici pour afficher l'id_budget dans RessourceDepenses
        ->where('id_customer_account', Auth::id())
        ->where('is_archive', 0);

    if (!is_null($id_budget)) {
        $query->where('IdBudget', $id_budget);
    }

    if (!is_null($id_categorie_depense)) {
        $query->where('id_categorie_depense', $id_categorie_depense);
    }

    if (!is_null($montantMin)) {
        $query->where('montant', '>=', $montantMin);
    }

    if (!is_null($montantMax)) {
        $query->where('montant', '<=', $montantMax);
    }

    if (!is_null($is_repetitive)) {
        $query->where('is_repetitive', $is_repetitive);
    }

    if (!is_null($status)) {
        $query->where('status_is_repetitive', $status);
    }

     if (!is_null($libelle) && $libelle !== '') {
        $query->where('libelle', 'LIKE', '%' . $libelle . '%');
    }

    // Filtre par plage de dates si les deux dates sont renseignées ou par
    if (!is_null($date_debut) && !is_null($date_fin)) {
    $date_debut = Carbon::createFromFormat('d-m-Y', $date_debut);
    $date_fin = Carbon::createFromFormat('d-m-Y', $date_fin);
      $query->whereBetween('created_at', [$date_debut, $date_fin]);
    }
    elseif (!is_null($date_debut)) {
        $date_debut = Carbon::createFromFormat('d-m-Y', $date_debut);
        $query->whereDate('created_at', $date_debut);
    }
    elseif (!is_null($date_fin)) {
        $date_fin = Carbon::createFromFormat('d-m-Y', $date_fin);
        $query->whereDate('created_at', $date_fin);
    }

    return $query->orderBy('id', 'desc')
        ->paginate($perPage);
}


    public static function findDepense($id)
    {
        return self::where('id', $id)
                    ->where('id_customer_account', Auth::id())
                    ->where('is_archive', 0)
                    ->first();
    }

    // vefification de la categorie dans le budget
        public static function checkCategorieInBudget($id_categorie_depense, $id_budget)
        {
            $customerId = Auth::id();

            return DB::table('budget_categorie')
                    ->join('categorie_depenses', 'budget_categorie.IdCategorie', '=', 'categorie_depenses.id')
                    ->where('budget_categorie.IdBudget', $id_budget)
                    ->where('budget_categorie.IdCategorie', $id_categorie_depense)
                    ->where('categorie_depenses.is_archive', 0)
                    ->where(function($q) use ($customerId) {
                        $q->where('categorie_depenses.id_customer_account', $customerId)
                        ->orWhere('categorie_depenses.type', 0);
                    })
                    ->exists();
          }

          //verification de la categorie pour une depense simple (manuelle)
         public static function checkDepensesByCategorie($id_categorie_depense){
            $customerId = Auth::id();
            return CategorieDepenses::where('id', $id_categorie_depense)
                ->where(function($q) use ($customerId) {
                    $q->where('id_customer_account', $customerId)
                    ->orWhere('type', 0);
                })
                ->where('is_archive', 0)
                ->exists();
          }

          //verification de l'existance du budget
          public static function checkBudgetExistence($id_budget)
         {
                // lorsque aucun budget n'est selectionné (depense normale))
                if (is_null($id_budget)) {
                    return true;
                }

                $customerId = Auth::id();

                return DB::table('budgets')
                    ->where('IdBudget', $id_budget)
                    ->where('statutBudget', 0) // Budget en cours
                    ->where('isArchive', 0)     // Non archivé
                    ->where('id_customer_account', $customerId) // Si tu as cette info dans budget
                    ->exists();
        }



    //Generer la prochaine depense repetitive
    public static function generateNextRepetitiveDepense()
    {
        $depensegenerees = [];
        // Sélectionne toutes les dépenses répétitives en cours de l'utilisateur
        $depenses = self::where('is_repetitive', 1)
            ->where('status_is_repetitive', 0)
            ->where('is_archive', 0)
            ->where('id_customer_account', Auth::id())
            ->get();

        foreach ($depenses as $depense) {
            // Vérifie si la période est terminée (date_fin < today)
            if ($depense->date_fin && now()->gt($depense->date_fin)) {
                // Marque la dépense comme terminée
                $depense->status_is_repetitive = 2;
                $depense->save();

                // Calcule la durée pour générer la suivante
                $duree = \Carbon\Carbon::parse($depense->date_debut)->diffInDays($depense->date_fin);
                $new_debut = \Carbon\Carbon::parse($depense->date_fin)->addDay();
                $new_fin = $new_debut->copy()->addDays($duree);

                // Crée la prochaine dépense répétitive avec les mêmes infos
               $nouvelleDepenseRepetitive = self::create([
                                                    'libelle' => $depense->libelle,
                                                    'montant' => $depense->montant,
                                                    'is_repetitive' => 1,
                                                    'date_debut' => $new_debut,
                                                    'date_fin' => $new_fin,
                                                    'status_is_repetitive' => 0, // encours
                                                    'is_archive' => 0,
                                                    'piece_jointe' => $depense->piece_jointe,
                                                    'id_categorie_depense' => $depense->id_categorie_depense,
                                                    'id_customer_account' => $depense->id_customer_account
                                             ]);
              $depensegenerees[] = [
                'libelle' => $nouvelleDepenseRepetitive->libelle,
                'date_prochaine_repetition' => $nouvelleDepenseRepetitive->date_fin->format('d-m-Y')
              ];
            }
        }
        return $depensegenerees;
    }

    public function dupliquer()
    {
        // Copie des attributs existants en tableau
        $data = $this->attributesToArray();
        // Retirer les champs auto-générés
        unset($data['id'], $data['created_at'], $data['updated_at']);
        // Créer une nouvelle instance en base avec les données modifiées
        return self::create($data);
    }

    //fonction alerte de depassement pour la categorie
    public static function checkDepassementCategorie($id_budget, $id_categorie, $nouveau_montant)
    {
        // Somme des dépenses déjà enregistrées (hors celle en cours)
        $depenses_sum = DB::table('depenses')
            ->where('IdBudget', $id_budget)
            ->where('id_categorie_depense', $id_categorie)
            ->where('is_archive', 0)
            ->sum('montant');

        // Montant affecté dans la catégorie sur le budget
        $montant_affecte = DB::table('budget_categorie')
            ->where('IdBudget', $id_budget)
            ->where('IdCategorie', $id_categorie)
            ->value('MontantAffecter');

       // $total = $depenses_sum + $nouveau_montant;
        // Reste disponible
        $reste = $montant_affecte - $depenses_sum;

        if ($nouveau_montant > $reste) {//$total > $montant_affecte
                                        //  $montant_depasse = $total - $montant_affecte;
            $montant_depasse = $nouveau_montant - $reste;

            // Récupérer le nom de la catégorie et du budget conserné
            $nom_categorie = DB::table('categorie_depenses')->where('id', $id_categorie)->value('nom');
            $libelle_budget = DB::table('budgets')->where('IdBudget', $id_budget)->value('Libelle');

            return [
                'montant_depasse' => $montant_depasse,
                'nom_categorie' => $nom_categorie,
                'libelle_budget' => $libelle_budget
            ];
        }

        return null; // Pas de dépassement
    }

    //fonction alerte depassement pour le budget global
    public static function checkDepassementBudgetGlobal($id_budget, $nouveau_montant)
    {
        // Somme des dépenses déjà enregistrées dans le budget (hors celle en cours)
        $depenses_sum = DB::table('depenses')
            ->where('IdBudget', $id_budget)
            ->where('is_archive', 0)
            ->sum('montant');

        // Montant total du budget
        $montant_budget = DB::table('budgets')
            ->where('IdBudget', $id_budget)
            ->value('MontantBudget');

       // $total = $depenses_sum + $nouveau_montant;
        // Reste disponible
       $reste = $montant_budget - $depenses_sum;

        if ($nouveau_montant > $reste) {//$total > $montant_budget
           // $montant_depasse = $total - $montant_budget;
            $montant_depasse = $nouveau_montant - $reste;
            // Récupérer le libellé du budget
            $libelle_budget = DB::table('budgets')->where('IdBudget', $id_budget)->value('Libelle');

            return [
                'montant_depasse' => $montant_depasse,
                'libelle_budget' => $libelle_budget
            ];
        }

        return null; // Pas de dépassement si nn existance d'une valeur non null contenant le montant du budget et son libelle
    }

    //fonction modification alerte pour categorie
    public static function checkDepassementCategorieUpdate($id_budget, $id_categorie, $nouveau_montant, $ancien_montant)
    {
        // Somme des dépenses existantes (y compris celle en cours de modification)
        $depenses_sum = DB::table('depenses')
            ->where('IdBudget', $id_budget)
            ->where('id_categorie_depense', $id_categorie)
            ->where('is_archive', 0)
            ->sum('montant');

        // Soustraire l'ancien montant pour éviter le double-comptage
        $depenses_sum_sans_ancien = $depenses_sum - $ancien_montant;

        // Montant affecté à la catégorie
        $montant_affecte = DB::table('budget_categorie')
            ->where('IdBudget', $id_budget)
            ->where('IdCategorie', $id_categorie)
            ->value('MontantAffecter');

        // Reste disponible
        $reste = $montant_affecte - $depenses_sum_sans_ancien;

        // Vérification du dépassement
        if ($nouveau_montant > $reste) {
            $montant_depasse = $nouveau_montant - $reste;
            $nom_categorie = DB::table('categorie_depenses')->where('id', $id_categorie)->value('nom');
            $libelle_budget = DB::table('budgets')->where('IdBudget', $id_budget)->value('Libelle');
            return [
                'montant_depasse' => $montant_depasse,
                'nom_categorie' => $nom_categorie,
                'libelle_budget' => $libelle_budget
            ];
        }
        return null;
    }

    //fonction alerte modification pour budget
    public static function checkDepassementBudgetGlobalUpdate($id_budget, $nouveau_montant, $ancien_montant)
    {
        //  Somme des dépenses existantes pour le budget
        $depenses_sum = DB::table('depenses')
            ->where('IdBudget', $id_budget)
            ->where('is_archive', 0)
            ->sum('montant');

        //  Soustraire l'ancien montant
        $depenses_sum_sans_ancien = $depenses_sum - $ancien_montant;

        // Montant total du budget
        $montant_budget = DB::table('budgets')
            ->where('IdBudget', $id_budget)
            ->value('MontantBudget');

        // Reste disponible
        $reste = $montant_budget - $depenses_sum_sans_ancien;

        //  Vérification du dépassement
        if ($nouveau_montant > $reste) {
            $montant_depasse = $nouveau_montant - $reste;
            $libelle_budget = DB::table('budgets')->where('IdBudget', $id_budget)->value('Libelle');
            return [
                'montant_depasse' => $montant_depasse,
                'libelle_budget' => $libelle_budget
            ];
        }
        return null;
    }




    public function categorieDepense()
    {
        return $this->belongsTo('App\Models\CategorieDepenses\CategorieDepenses', 'id_categorie_depense');
    }

    public function customerAccount()
    {
        return $this->belongsTo('App\Models\UserManagement\CustomerAccount', 'id_customer_account');
    }


}
