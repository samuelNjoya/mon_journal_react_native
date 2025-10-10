<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Models\AgencyMgt\CashRegister;
use App\Models\TransactionManagement\GroupOperations;
use App\Models\TransactionManagement\Transaction;
use App\Models\TransMod\SesamPayxOperation;
use App\Models\UserManagement\CustomerAccount;
use Carbon\Carbon;
use PDF;
use Illuminate\Support\Facades\DB;
use App\Helpers\Api\OperationHelper;
use App\Models\OnlinePayment\Yupayx;

class PdfController extends Controller
{
    use OperationHelper;
    public function createPdf(Request $request)
    {
        /*$items = DB::table("items")->get();
        view()->share('items',$items);*/
        $emetteur_phone_number="";
        $emetteur_firstname = "";
        $emetteur_lastname = "";
        $receiver_phone_number="";
        $identification_number = "";
        $receiver_firstname = "";
        $receiver_lastname = "";
        $op_date = Carbon::now();
        $group_op = GroupOperations::where('reference', '=', $request->input("code_op"))->first();
        $group_op = json_decode(json_encode($group_op));
        $transaction_op_code="";
        $fees = 0;
        $params["error"] = true;
            $params["msg"] = $group_op;
        if($group_op!=null && $group_op->id_customer_account!=null){
            $withdrawal_method = $group_op->receiving_mode;
            $transcode = explode("_",$group_op->transaction_codes)[1];
            $id_operation_for_commission = null;
            $operation_international = null;
            $identification = "";
            switch($withdrawal_method){
                case "GUICHET":
                    //le id du receiver est sur la ligne transaction du retrait d'un non abonne
                    $operation_international = SesamPayxOperation::where('reference', '=', SesamPayxOperation::$REF_WITHDRAW_TRANS_NO_SUBSCRIBER)->where('state', '=', SesamPayxOperation::$ACTIVE_TYPE)->where('deleted_at', '=', null)->first();
                    if($operation_international!=null){
                        $operation_for_commission = SesamPayxOperation::where('reference', '=', SesamPayxOperation::$REF_INTER_MONEY_TRANSFERT_GUICHET)->where('state', '=', SesamPayxOperation::$ACTIVE_TYPE)->where('deleted_at', '=', null)->first();
                        $id_operation_for_commission = $operation_for_commission->id_sesampayx_operation;
                        $transaction = Transaction::where('trans_operation_code','=',$transcode)->where('id_sesampayx_operation',$operation_international->id_sesampayx_operation)->first();
                        $receiver_query = DB::select('SELECT p.firstname,p.lastname,p.phone_number,p.type_identification,p.id_card_number,p.passport_number FROM usrmgt_person as p, transmgt_senderreceiver as sr WHERE sr.id_sender_receiver='.$transaction->receiver_id_sender_receiver.' AND sr.id_person=p.id_person');

                    }else{
                        $params["error"] = true;
                        $params["msg"] = "international operation for Guichet or withdrawal method  is not valid";
                    }
                    break;
                case "SESAMPAYX":
                    $operation_international = SesamPayxOperation::where('reference', '=', SesamPayxOperation::$REF_INTER_MONEY_TRANSFERT_SESAMPAYX)->where('state', '=', SesamPayxOperation::$ACTIVE_TYPE)->where('deleted_at', '=', null)->first();
                    if($operation_international!=null){
                        $id_operation_for_commission = $operation_international->id_sesampayx_operation;
                        $transaction = Transaction::where('trans_operation_code','=',$transcode)->where('id_sesampayx_operation',$operation_international->id_sesampayx_operation)->first();
                        $id_customer = DB::select('SELECT sr.id_customer_account FROM  transmgt_senderreceiver as sr WHERE sr.id_sender_receiver='.$transaction->receiver_id_sender_receiver)[0]->id_customer_account;
                        $receiver_query = DB::select('SELECT p.firstname,p.lastname,p.type_identification,p.id_card_number,p.passport_number,c.phone_number from usrmgt_person as p, usrmgt_customeraccount as c, usrmgt_account as a where c.id_customer_account='
                        .$id_customer.' AND c.id_customer_account=a.id_customer_account and a.id_person=p.id_person;');
                    }else{
                        $params["error"] = true;
                        $params["msg"] = "international operation or withdrawal method  is not valid";
                    }
                    break;
                case "MTNMOMO":
                    $operation_international = SesamPayxOperation::where('reference', '=', SesamPayxOperation::$REF_INTER_MONEY_TRANSFERT_MTNMOMO)->where('state', '=', SesamPayxOperation::$ACTIVE_TYPE)->where('deleted_at', '=', null)->first();
                    if($operation_international!=null){
                        $id_operation_for_commission = $operation_international->id_sesampayx_operation;
                        $transaction = Transaction::where('trans_operation_code','=',$transcode)->where('id_sesampayx_operation',$operation_international->id_sesampayx_operation)->first();
                        $receiver_query = DB::select('SELECT p.firstname,p.lastname,p.phone_number,p.type_identification,p.id_card_number,p.passport_number FROM usrmgt_person as p, transmgt_senderreceiver as sr WHERE sr.id_sender_receiver='.$transaction->receiver_id_sender_receiver.' AND sr.id_person=p.id_person');
                    }else{
                        $params["error"] = true;
                        $params["msg"] = "international operation for MTN  is not valid";
                    }
                    break;
                default:
                    $params["error"] = true;
                    $params["msg"] = "withdrawal_method is not valid";
                    break;
            }
            if($operation_international !=null){
                $query = DB::select('SELECT p.firstname,p.lastname,c.phone_number from usrmgt_person as p, usrmgt_customeraccount as c, usrmgt_account as a where c.id_customer_account='.$group_op->id_customer_account.' AND c.id_customer_account=a.id_customer_account and a.id_person=p.id_person;');
                if(count($query)>0){
                    $emetteur_phone_number = $query[0]->phone_number;
                    $emetteur_firstname = $query[0]->firstname;
                    $emetteur_lastname = $query[0]->lastname;
                    $op_date = $group_op->updated_at;
                }else{
                    $params["error"] = true;
                    $params["msg"] = "Emetteur query is not valid";
                }
                if(count($receiver_query)>0){
                    $receiver_phone_number = $query[0]->phone_number;
                    $receiver_firstname = $receiver_query[0]->firstname;
                    $receiver_lastname = $receiver_query[0]->lastname;
                    $identification = $receiver_query[0]->type_identification;
                    if($identification=="PASSEPORT")
                        $identification_number = $receiver_query[0]->passport_number;
                    else
                        $identification_number = $receiver_query[0]->id_card_number;
                }else{
                    $params["error"] = true;
                    $params["msg"] = "Receiver query is not valid";
                }
                $online_cashregister = DB::table('agcymgt_cashregister')
                ->join('transmgt_senderreceiver', 'agcymgt_cashregister.id_cash_register', '=', 'transmgt_senderreceiver.id_cash_register')
                ->where('agcymgt_cashregister.function', '=', CashRegister::$ONLINE_CASHREGISTER)
                ->first();
                if($online_cashregister!=null){
                    $request_commission_international = $this->requestCommission([
                        '_token' => null,
                        'montant_to_load' => (float)$transaction->amount,
                        'operation_do' => $id_operation_for_commission,
                        'id_cash_register' => $online_cashregister->id_cash_register,
                        'id_customer' => $group_op->id_customer_account
                    ]);
                    $total_amount = $request_commission_international["total_amount"];
                    $commission = $request_commission_international["commission"];
                    $yupayx_payment = new Yupayx();
                    $total_amount += $request_commission_international["commission"];
                    $commission += $request_commission_international["commission"];
                    $yupayx_amount = $yupayx_payment->amountWithCommission($total_amount, Yupayx::$CYBS_PM);
                    if ($yupayx_amount["status"] == 0) {
                        $fees = 0;
                    }else{
                        $fees = $yupayx_amount["new_amount"] - $yupayx_amount["old_amount"];
                        $total_amount = $yupayx_amount["new_amount"];
                    }


                }else{
                    $total_amount = (float)$transaction->amount;
                    $commission = 0;
                }

                $params =["status"=>$request->input("status"),
                    "code_op"=>$transaction->trans_operation_code,
                    "montant"=>(float)$transaction->amount,
                    "commission"=>$commission,
                    "frais"=>$fees,
                    "montant_total"=>$total_amount,
                    "beneficiaire_firstname"=>$receiver_firstname,
                    "beneficiaire_lastname"=>$receiver_lastname,
                    "identification"=>$identification,
                    "phone_number"=>$receiver_phone_number,
                    "emetteur_phone_number"=>$emetteur_phone_number,
                    "emetteur_firstname"=> $emetteur_firstname,
                    "emetteur_lastname"=> $emetteur_lastname,
                    "identification_number" => $identification_number,
                    "bill_date"=> Carbon::now(),
                    "operation_date"=> $op_date,
                    "error"=>false,
                    "msg"=>""
                ];
            }else{
                $params["error"] = true;
                $params["msg"] = "international operation or withdrawal method  is not valid";
            }



        }else{
            $params["error"] = true;
            $params["msg"] = "code operation ist invalid";
        }

        view()->share('params',$params);
        if($request->has('download')){
            $pdf = PDF::loadView('pdfview')/*->setPaper('a5', 'landscape')*/;
            return $pdf->download('facture_'.$transaction->trans_operation_code.'.pdf');
        }


        return view('pdfview');
    }
}
