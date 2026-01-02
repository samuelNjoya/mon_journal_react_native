<?php

namespace App\Http\Controllers;

use App\MenuCode;
use App\RequestAPIClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Session;
use Illuminate\View\View;

class HomeController extends Controller
{
    public function home(Request $request){
        spx_set_selected_menu(MenuCode::$DASHBOARD);


        // $myIp = json_decode(file_get_contents(sprintf(RequestAPIClass::$check_client_ip)));
        // $ip = json_decode(file_get_contents(sprintf(RequestAPIClass::$check_client_locaion, $myIp->ip)));
        // $country_code = $ip->ip->country_code;
        $country_code = "cm";

        $home = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$home),
            Session::get("accessToken"),[
            "lan"=>"fr",
            "sessionToken"=>$request->cookie("sessionToken")]
            );

		//var_dump($home);
        //$home = json_decode($home);

        if ($home!= null && $home->status ==1){
            $datas = $home->datas;
            Session::put("home",$datas);
            Session::save();
            //$advantages = $datas->advantages;
            //$total_gains = spx_format_float($advantages->total_balance->total_price_before) - spx_format_float($advantages->total_balance->total_price_after);
            //$periods = spx_format_periods($advantages->periods);
            return response()->view('index',
                ["slides"=>$datas->slides,
                "linked_benacc"=>$datas->linked_benacc,
                "transfert_international_service" => $datas->transfert_international_service,
                "country_code" => $country_code,
                //"list_transactions"=>$datas->list_transactions,
                //"advantages_period"=>$periods,
                //"total_gains"=>$total_gains
                ], 200);
        }
        else if($home!= null && $home->status ==0){
            return response()->view('errors.500',
                ['err_title'=> $home->err_title,
                'err_code'=> $home->err_code,
                'err_msg'=> $home->err_msg,
                    ], 500);
        }else{
            //cas où home est nul
            $response['err_title']="Erreur interne";
            return response()->view('errors.500',[
                "err_title" => "Erreur interne: Home",
                "err_code"=>"500",
                "err_msg"=>"Une erreur s'est produite. Veuillez réessayer plus tard"],500);
        }
        //return response()->view('index', ['home'=> $home], 200);
    }

    public function defaultPassword (Request $request){
        $defaultPassword = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$defaultPassword),
            Session::get("accessToken"),[
            "lan"=>"fr",
            "sessionToken"=>$request->cookie("sessionToken")]
        );
        //$defaultPassword = json_decode($defaultPassword);
        $response = array();

        if($defaultPassword->status == 5){
            $response["defaultPassword"] = true;
        }else{
            $response["defaultPassword"] = false;
        }

        return response()->json($response);
    }

    public function homelistTransactions(Request $request){

        $transactions = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$hometransactions),
            Session::get("accessToken"),[
                "lan"=>"fr",
                "sessionToken"=>$request->cookie("sessionToken")]
        );

        //$transactions = json_decode($transactions);

        if ($transactions!= null && $transactions->status ==1){
            return response()->json([
                'status'=>1,
                'transaction_view'=>view('partials.home.transactions_home',["list_transactions"=>$transactions->datas->list_transactions])->render()]);
        }
        else if($transactions!= null && $transactions->status ==0){
            return response()->view('errors.500',
                ['err_title'=> $transactions->err_title,
                    'err_code'=> $transactions->err_code,
                    'err_msg'=> $transactions->err_msg,
                ], 500);
        }
        else if($transactions!= null && $transactions->status == 5){
            return response()->json();
        }
        else{//cas où list benefits est nul
            $response['err_title']="Erreur interne";
            return response()->view('errors.500',[
                "err_title" => "Erreur interne",
                "err_code"=>"500",
                "err_msg"=>"Une erreur s'est produite. Veuillez réessayer plus tard"],500);
        }
    }

    public function homeAdvantage(Request $request){

        $advantages = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$homeadvantages),
            Session::get("accessToken"),[
                "lan"=>"fr",
                "sessionToken"=>$request->cookie("sessionToken")]
        );
        //$advantages = json_decode($advantages);
        if ($advantages!= null && $advantages->status ==1){
            $advantages = $advantages->datas->advantages;
            $total_gains = spx_format_float($advantages->total_balance->total_price_before) - spx_format_float($advantages->total_balance->total_price_after);
            $periods = spx_format_periods($advantages->periods);

            return response()->json([
                'status'=>1,
                'advantage_view'=>view('partials.home.advantages_home',["advantages_period"=>$periods,"total_gains"=>$total_gains])->render()
                ]);
        }
        else if($advantages!= null && $advantages->status ==0){
            return response()->view('errors.500',
                ['err_title'=> $advantages->err_title,
                    'err_code'=> $advantages->err_code,
                    'err_msg'=> $advantages->err_msg,
                ], 500);
        }else if($advantages!= null && $advantages->status == 5){
            return response()->json();
        }
        else{//cas où list benefits est nul
            $response['err_title']="Erreur interne";
            return response()->view('errors.500',[
                "err_title" => "Erreur interne",
                "err_code"=>"500",
                "err_msg"=>"Une erreur s'est produite. Veuillez réessayer plus tard"],500);
        }
    }

}
