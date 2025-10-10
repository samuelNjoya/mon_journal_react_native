<?php

namespace App\Http\Controllers\Api\DepenseModule_Controller;

use App\Helpers\DepenseModule_Helpers\TransactionOperationHelper;
use App\Models\CategorieDepenses\Depenses;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TransactionOperationController extends Controller
{

        public function getTransactionsWithAmount(Request $request)
        {
           // $operationIds = [3, 4, 5, 6, 7, 9, 11, 12, 13, 33, 39, 57, 70, 82];
            $operationRefs = ['SOMD_DEPOSIT','SOMI_DEPOSIT','SORD_DEPOSIT','SORI_DEPOSIT','SOWD_DEPOSIT','SOWI_DEPOSIT','SO_APP_CARD','SO_PAYBEN','SO_PAYENEOBILL','SO_PYBCANAL','SO_PYBLIT','SO_PYBSEM','SO_TRSCUST','SO_TRSNCUST'];
            $transactions = TransactionOperationHelper::getTransactions($operationRefs,$request->input('id_operation'),$request->input('per_page', 5));

            return response()->json([
                'success' => true,
                'data' => $transactions,
            ]);
        }


        public function linkTransactionAsDepense(Request $request)
        {
            // Valider les données d'entrée
            app()->setLocale('fr');
            $validated = $request->validate([
                'id_transaction' => 'required|integer',
                'id_categorie_depense' => 'required|integer',
            ]);

            $id_transaction =  $request->input('id_transaction');
            $id_categorie   =  $request->input('id_categorie_depense');
          //  $operationIds = [3, 4, 5, 6, 7, 9, 11, 12, 13, 33, 39, 57, 70, 82];
            $operationRefs = ['SOMD_DEPOSIT','SOMI_DEPOSIT','SORD_DEPOSIT','SORI_DEPOSIT','SOWD_DEPOSIT','SOWI_DEPOSIT','SO_APP_CARD','SO_PAYBEN','SO_PAYENEOBILL','SO_PYBCANAL','SO_PYBLIT','SO_PYBSEM','SO_TRSCUST','SO_TRSNCUST'];


            $result = TransactionOperationHelper::linkTransactionAsDepense($id_transaction,$id_categorie,$operationRefs);

            return response()->json($result);
        }
}


