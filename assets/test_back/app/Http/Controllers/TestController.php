<?php

namespace App\Http\Controllers;

use App\Models\PartnerMgt\TVCommand;
use App\Models\UserManagement\CustomerAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TestController extends Controller
{
    public function test(Request $request){
        //$tvcommand = TVCommand::find(343);
        //return response()->json(getPaymentModes(79));
        try{
            $numeros_sans_compte = [];
            $numeros_de_compte = explode(',',$request->input("comptes"));
            foreach($numeros_de_compte as $num){
                $customerAccount = CustomerAccount::where("phone_number",$num)->first();

                if($customerAccount==null){
                    array_push($numeros_sans_compte,$num);
                }
            }
            $response["numero_sans_compte"] = $numeros_sans_compte;
            $response["nbre"] = count($numeros_de_compte);
            return response()->json($response);
        }catch(\Exception $exception){
            $response["statut"] = "exception";
            $response["error_msg"] = $exception->getMessage();
            return response()->json($response);
        }

    }
}
