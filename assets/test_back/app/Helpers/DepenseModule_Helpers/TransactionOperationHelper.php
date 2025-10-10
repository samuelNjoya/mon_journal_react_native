<?php

namespace App\Helpers\DepenseModule_Helpers;

// use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\CategorieDepenses\Depenses;

class TransactionOperationHelper
{

    public static function getTransactions($operationRefs,$id_operation_filter=null,$perPage=50)
    {
            $customerId = Auth::id();
        //  $customerId = 538;
             $query = DB::table('transmgt_transaction as tt')
                ->join('transmod_sesampayxoperation as tso', 'tt.id_sesampayx_operation', '=', 'tso.id_sesampayx_operation')
                ->where('tt.id_customer_account', $customerId)
                ->where('tt.deleted_at', NULL)
                ->where('tt.id_transaction_parent', NULL)
                ->whereIn('tso.reference', $operationRefs)
                ->select('tt.id_transaction','tso.reference','tso.name', 'tt.amount','tt.created_at');

            if (!is_null($id_operation_filter)) {
              $query->where('tt.id_sesampayx_operation', $id_operation_filter);
            }

             $results = $query->paginate($perPage);

            if (!is_null($id_operation_filter) && $results->isEmpty()) {
                    return [
                        'success' => false,
                        'message' => "Aucune transaction trouvée pour l'opération ID : {$id_operation_filter}."
                    ];
                }

            // Convertir chaque montant en float
            $results->getCollection()->transform(function ($item) {
                $item->amount = (float)$item->amount;
                return $item;
            });

            return $results;
    }

    public static function linkTransactionAsDepense($id_transaction, $id_categorie_depense, $operationRefs)
    {

            $transaction = DB::table('transmgt_transaction as tt')
                ->join('transmod_sesampayxoperation as tso', 'tt.id_sesampayx_operation', '=', 'tso.id_sesampayx_operation')
                ->where('tt.id_customer_account', Auth::id())
                ->where('tt.deleted_at', NULL)
                ->where('tt.id_transaction_parent', NULL)
                ->where('tt.id_transaction', $id_transaction)
                ->whereIn('tso.reference', $operationRefs)
                ->first();


            if (!$transaction) {
                return ['success' => false, 'message' => 'La transaction spécifiée n\'existe pas.'];
            }

            $categorieDepense = Depenses::checkDepensesByCategorie($id_categorie_depense);

            if (!$categorieDepense) {
                return ['success' => false, 'message' => 'La catégorie de dépense spécifiée n\'existe pas.'];
            }

             //Vérifier si la transaction a déjà été liée comme dépense
            $existingDepense = DB::table('depenses')
                ->where('id_customer_account',  Auth::id())
                ->where('id_transaction', $transaction->id_transaction) // colonne id_transaction  dans la table depenses
                ->first();

            if ($existingDepense) {
                return [
                    'success' => false,
                    'message' => "La transaction '{$transaction->name}' a déjà été liée comme dépense (ID dépense : {$existingDepense->id})."
                ];
            }

            //Récupérer le nom de l'opération (name) pour referencer libellé (dans la table Depense) depuis transmod_sesampayxoperation
            $operation = DB::table('transmod_sesampayxoperation')
                ->where('id_sesampayx_operation', $transaction->id_sesampayx_operation)
                ->first();

            if (!$operation) {
                return ['success' => false, 'message' => 'L\'opération associée à la transaction n\'existe pas.'];
            }

            // Créer une nouvelle dépense dans la table `depenses`
            $depenseData = [
                'id_customer_account' => Auth::id(),
                'montant' => $transaction->amount,
                'id_transaction' => $transaction->id_transaction,//inserer aussi l'id de la transaction
                'libelle' => $operation->name,
                'id_categorie_depense' => $id_categorie_depense,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Insérer la nouvelle dépense
            $depenseId = DB::table('depenses')->insertGetId($depenseData);

            if ($depenseId) {
                return ['success' => true, 'message' => "La transaction: '{$operation->name}' a été liée comme dépense avec succès.", 'depense_id' => $depenseId];
            } else {
                return ['success' => false, 'message' => 'Une erreur est survenue lors de la création de la dépense.'];
            }
    }

}
