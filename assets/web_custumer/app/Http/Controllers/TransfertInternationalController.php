<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\RequestAPIClass;
use Illuminate\Support\Facades\Session;

class TransfertInternationalController extends Controller
{
    public function chooseOperation(Request $request){
        $myIp = json_decode(file_get_contents(sprintf(RequestAPIClass::$check_client_ip)));
        $ip = json_decode(file_get_contents(sprintf(RequestAPIClass::$check_client_locaion, $myIp->ip)));
        $country_code = $ip->ip->country_code;
        return view('operations.choose_international_transfert', compact("country_code"));
    }

    public function getFirstStepForm(Request $request){
        $myIp = json_decode(file_get_contents(sprintf(RequestAPIClass::$check_client_ip)));
        $ip = json_decode(file_get_contents(sprintf(RequestAPIClass::$check_client_locaion, $myIp->ip)));
        $country_code = $ip->ip->country_code;
        return view('operations.offline_international_transfert_view', compact("country_code"));
    }

    public function haveSesampayxAccount(Request $request){

        $check_account_response = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$have_sesampayx_account),
            Session::get("accessToken"),
            [
                "lan" => "fr",
                "phone_number" => $request->input('phone_number'),
            ]
        );
        //$prev_international_transfert = json_decode($prev_international_transfert);
        if ($check_account_response != null && $check_account_response->status) {
            return response()->json($check_account_response,200);
        } else if ($check_account_response != null && !$check_account_response->status) {
            return response()->json($check_account_response);
        } else { //cas où body est nul
            $response['err_title'] = "Erreur interne";
            return response()->json($response, 500);
        }
    }

    public function authUserforTransInter(Request $request){

        $have_account = $request->input('have_account');
        $host = spx_get_host($request);
        $beneficiary['phone_number'] = $request->beneficiary["phone_number"];
        $beneficiary['firstname'] = $request->beneficiary["firstname"];
        $beneficiary['lastname'] = $request->beneficiary["lastname"];
        $beneficiary['type_cni'] = $request->beneficiary["type_cni"];
        $beneficiary['cni'] = $request->beneficiary["cni"];
        $transmitter['country'] = $request->transmitter["country"];

        if($have_account){
            $body = spx_post_request(RequestAPIClass::getRoute(RequestAPIClass::$login),[
                "lan"=>"fr",
                "phone_number" => $request->input("phone_number"),
                "password" => "00000",
                "host"=>$host
            ]);
            if($body != null && $body->status==1){
                Session::put('accessToken',$body->accessToken);
                Session::save();


                $prev_international_transfert = spx_post_auth_request(
                    RequestAPIClass::getRoute(RequestAPIClass::$preview_international_transfert),
                    Session::get("accessToken"),
                    [
                        "lan" => "fr",
                        "sessionToken" => $body->sessionToken,
                        "beneficiary" => $beneficiary,
                        "transmitter" => $transmitter,
                        "amount" => $request->input('amount'),
                        "reference" => "INTER_MONEY_TRANSFERT",
                        "withdrawal_method" => $request->input('withdrawal_method'),
                        "phone_number" => $request->input('phone_number')
                    ]
                );

                if ($prev_international_transfert != null && $prev_international_transfert->status == 1) {
                    return response()->json([
                        'status' => 1,
                        'msg' => $prev_international_transfert->msg,
                        ])->cookie('sessionToken',$body->sessionToken,120);
                } else if ($prev_international_transfert != null && $prev_international_transfert->status == 0) {
                    return response()->json($prev_international_transfert);
                } else { //cas où body est nul
                    $response['err_title'] = "Erreur interne";
                    return response()->json($response, 500);
                }
            }else if($body != null && $body->status==0){
                return response()->json($body, 500);
            }else{
                $response['err_title'] = "Erreur interne";
                $response['debug'] = "param body is null";
                return response()->json($response, 500);
            }
        }else{
            $prev_international_transfert = spx_post_auth_request(
                RequestAPIClass::getRoute(RequestAPIClass::$offline_preview_inter_trans),
                Session::get("accessToken"),
                [
                    "lan" => "fr",
                    "beneficiary" => $beneficiary,
                    "transmitter" => $transmitter,
                    "amount" => $request->input('amount'),
                    "reference" => "INTER_MONEY_TRANSFERT",
                    "withdrawal_method" => $request->input('withdrawal_method'),
                    "phone_number" => $request->input('phone_number')
                ]
            );
            if ($prev_international_transfert != null && $prev_international_transfert->status == 1) {
                return response()->json([
                    'status' => 1,
                    'msg' => $prev_international_transfert->msg,
                    ]);
            } else if ($prev_international_transfert != null && $prev_international_transfert->status == 0) {
                return response()->json($prev_international_transfert);
            } else { //cas où body est nul
                $response['err_title'] = "Erreur interne";
                return response()->json($response, 500);
            }
        }
    }

    public function getComOfflineInterTrans(Request $request){
        //dd($request);
        $check_com_response = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$getCom_inter_trans),
            Session::get("accessToken"),
            [
                "lan" => "fr",
                "withdrawal_method" => $request->input('withdrawal_method'),
                "phone_number" => $request->input('phone_number'),
                "reference" => "INTER_MONEY_TRANSFERT",
                "amount" => $request->input("amount")
            ]
        );
        //$prev_international_transfert = json_decode($prev_international_transfert);
        if ($check_com_response != null && $check_com_response->status == 1) {

            return response()->json([
                'status' => 1,
                'amount' => number_format((float)$check_com_response->amount, 2) . " XAF",
                'fees' =>  number_format((float)$check_com_response->fees, 2) . " XAF",
                'commission' => number_format((float)$check_com_response->commission, 2) . " XAF",
                'total' =>  number_format((float)$check_com_response->total, 2) . " XAF",
                'payment_method' => $request->input('payment_method'),
                'phone_number' => $request->input('phone_number'),
            ]);
        } else if ($check_com_response != null && $check_com_response->status == 0) {
            return response()->json($check_com_response, 500);
        } else { //cas où body est nul
            $response['err_title'] = "Erreur interne";
            return response()->json($response, 500);
        }
    }

    public function postOfflineInternationalTransfert(Request $request){
        //
        $have_account = $request->input('have_account');
        $host = spx_get_host($request);
        //var_dump($have_account);
        if(!$have_account){

            $body = spx_post_request(RequestAPIClass::getRoute(RequestAPIClass::$simpleSignup),
            [
                "lan"=>"fr",
                "transmitter" => $request->transmitter,
                "phone_number" => $request->input("phone_number"),
                "password" => $request->input("password"),
                "host"=>$host
            ]);
            if($body!=null && $body->status==1){
                Session::put('accessToken',$body->accessToken);
                Session::save();
                if($request->input("withdrawal_method")!="GUICHET"){
                    $cni = "00";
                    $type_cni="none";
                }else{
                    $cni = $request->beneficiary["cni"];
                    $type_cni=$request->beneficiary["type_cni"];
                }
                $beneficiary['phone_number'] = $request->beneficiary["phone_number"];
                $beneficiary['firstname'] = $request->beneficiary["firstname"];
                $beneficiary['lastname'] = $request->beneficiary["lastname"];
                $beneficiary['type_cni'] = $type_cni;
                $beneficiary['cni'] = $cni;
                $transmitter['country'] = $request->transmitter["country"];
                $international_transfert = spx_post_auth_request(
                    RequestAPIClass::getRoute(RequestAPIClass::$international_transfert),
                    Session::get("accessToken"),
                    [
                        "lan" => "fr",
                        "sessionToken" => $body->sessionToken,
                        "beneficiary" => $beneficiary,
                        "transmitter" => $request->transmitter,
                        "amount" => $request->input('amount'),
                        "password" => $request->input('password'),
                        "payment_method" => $request->input('payment_method'),
                        "withdrawal_method" => $request->input('withdrawal_method'),
                        "reference" => "INTER_MONEY_TRANSFERT"
                    ]
                );

                if ($international_transfert != null && $international_transfert->status == 1) {
                    return response()->json([
                        'status' => 1,
                        'amount' => $international_transfert->amount,
                        "url" => $international_transfert->api,
                    ]);
                } else if ($international_transfert != null && $international_transfert->status == 0) {
                    return response()->json($international_transfert);
                } else { //cas où body est nul
                    $response['err_title'] = "Erreur interne";
                    return response()->json($response, 500);
                }

            }else if($body!=null && $body->status!=1){
                return response()->json($body);
            }else{
                $response['err_title'] = "Erreur interne";
                return response()->json($response, 500);
            }
        }else{

            $beneficiary['phone_number'] = $request->beneficiary["phone_number"];
            $beneficiary['firstname'] = $request->beneficiary["firstname"];
            $beneficiary['lastname'] = $request->beneficiary["lastname"];
            $beneficiary['type_cni'] = $request->beneficiary["type_cni"];
            $beneficiary['cni'] = $request->beneficiary["cni"];
            $transmitter['country'] = $request->transmitter["country"];
            $international_transfert = spx_post_auth_request(
                RequestAPIClass::getRoute(RequestAPIClass::$international_transfert),
                Session::get("accessToken"),
                [
                    "lan" => "fr",
                    "sessionToken" => $request->cookie("sessionToken"),
                    "beneficiary" => $beneficiary,
                    "transmitter" => $request->transmitter,
                    "amount" => $request->input('amount'),
                    "password" => $request->input('password'),
                    "payment_method" => $request->input('payment_method'),
                    "withdrawal_method" => $request->input('withdrawal_method'),
                    "reference" => "INTER_MONEY_TRANSFERT"
                ]
            );
            if ($international_transfert != null && $international_transfert->status == 1) {
                return response()->json([
                    'status' => 1,
                    'amount' => $international_transfert->amount,
                    "url" => $international_transfert->api,
                ]);
            } else if ($international_transfert != null && $international_transfert->status == 0) {
                return response()->json($international_transfert, 500);
            } else { //cas où body est nul
                $response['err_title'] = "Erreur interne";
                return response()->json($response, 500);
            }
        }


    }
}
