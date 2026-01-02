<?php

namespace App\Http\Controllers;

use App\MenuCode;
use App\RequestAPIClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class BenAccController extends Controller
{
    public function list(Request $request){
        spx_set_selected_menu(MenuCode::$MIGRATE);
        $list_benefits = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$listBenefitsAcc),
            Session::get("accessToken"),[
                "lan"=>"fr",
                "sessionToken"=>$request->cookie("sessionToken")]
        );

        if ($list_benefits!= null && $list_benefits->status ==1){
            //dd($list_benefits);
            return view('benefits.listbenaccount',[
                "datas"=>$list_benefits->datas
            ]);
        }

        else if($list_benefits!= null && $list_benefits->status ==0){
            return response()->view('errors.500',
                ['err_title'=> $list_benefits->err_title,
                    'err_code'=> $list_benefits->err_code,
                    'err_msg'=> $list_benefits->err_msg,
                ], 500);
        }else{//cas où list benefits est nul
            $response['err_title']="Erreur interne";
            return response()->view('errors.500',[
                "err_title" => "Erreur interne",
                "err_code"=>"500",
                "err_msg"=>"Une erreur s'est produite. Veuillez réessayer plus tard"],500);
        }

    }

    public function getPay(Request $request){

        spx_set_selected_menu(MenuCode::$UPDATE_BEN);
        $id = $request->input('id');
        $benefit = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$benefitsAccFromId),
            Session::get("accessToken"),[
                "lan"=>"fr",
                "sessionToken"=>$request->cookie("sessionToken"),
                "id_type_ben_account"=>$id]
        );

        //$benefit = json_decode($benefit);
        if ($benefit!= null && $benefit->status ==1){
            return view('benefits.pay_ben_acc',[
                "datas"=>$benefit->datas,
                "agencies" =>isset($benefit->agencies) ? $benefit->agencies: [],
                "has_valid_visa_card" => $benefit->has_valid_visa_card,
            ]);
        }
        else if($benefit!= null && $benefit->status ==0){
            return response()->view('errors.500',
                ['err_title'=> $benefit->err_title,
                    'err_code'=> $benefit->err_code,
                    'err_msg'=> $benefit->err_msg,
                ], 500);
        }else{//cas où list benefits est nul
            $response['err_title']="Erreur interne";
            return response()->view('errors.500',[
                "err_title" => "Erreur interne",
                "err_code"=>"500",
                "err_msg"=>"Une erreur s'est produite. Veuillez réessayer plus tard"],500);
        }

    }

    public function payBenAcc(Request $request){

        $pay_ben_acc = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$subscribeBenAcc),
            Session::get("accessToken"),[
                "lan"=>"fr",
                "sessionToken"=>$request->cookie("sessionToken"),
                "id"=>$request->input('id'),
                "password"=>$request->input('password'),
                "times"=>$request->input('times'),
                "agency_id"=>$request->input('agency'),
                "payment_mode"=>"SESAME"
            ]
        );
        if ($pay_ben_acc!= null ){
            return response()->json($pay_ben_acc);
        }else{//cas où body est nul
            $response['err_title']="Erreur interne";
            return response()->json($response,500);
        }
    }
}
