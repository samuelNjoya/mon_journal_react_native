<?php

namespace App\Http\Controllers;

use App\RequestAPIClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class AccountController extends Controller
{
    public function getAccountView(Request $request){
        spx_set_selected_menu("");
        return view('settings.my_account');

    }
    public function getPersonnalInfoView(Request $request){

        $user_infos = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$user_info),
            Session::get("accessToken"),[
                "lan"=>"fr",
                "sessionToken"=>$request->cookie("sessionToken")]
        );

        if ($user_infos!= null && $user_infos->status ==1){
            return response()->json(['view'=>view('partials.account.my_account',["user"=>$user_infos->user])->render()]);
        }
        else if($user_infos!= null && $user_infos->status ==0){
            return response()->json(['view'=>view('errors.500',
                ['err_title'=> $user_infos->err_title,
                    'err_code'=> $user_infos->err_code,
                    'err_msg'=> $user_infos->err_msg,
                ] )->render()]);
        }else{//cas où list benefits est nul
            return response()->json(['view'=>view('errors.500',
                [   "err_title" => "Erreur interne",
                    "err_code"=>"500",
                    "err_msg"=>"Une erreur s'est produite. Veuillez réessayer plus tard"] )->render()]);
        }

    }

    public function changePassword(Request $request){
        return response()->json(['view'=>view('partials.account.change_password')->render()]);

    }
    public function submitChangePassword(Request $request){
        try{
            $host = spx_get_host($request);

            $submitChangePassword = spx_post_auth_request(
                RequestAPIClass::getRoute(RequestAPIClass::$change_password),
                Session::get("accessToken"),[
                    "lan"=>"fr",
                    "sessionToken"=>$request->cookie("sessionToken"),
                    "password"=>$request->input('old_password'),
                    "new_password"=>$request->input('new_password'),
                    "host"=>$host
                ]
            );

            if ($submitChangePassword!= null && $submitChangePassword->status ==1){
                $status = $submitChangePassword->status;
                Session::put('accessToken',$submitChangePassword->accessToken);
                Session::save();
                return response()->json(["status"=>$status])->cookie('sessionToken',$submitChangePassword->sessionToken,120);
            }else if($submitChangePassword!= null && $submitChangePassword->status ==0){
                return response()->json($submitChangePassword);
            }else{//cas où body est nul
                $response['err_title']="Erreur interne";
                return response()->json($response,500);
            }
        }catch (\Exception $exception){
            $response['err_title']="Erreur interne";
            $response['err_msg']=$exception->getMessage();
            return response()->json($response,500);
        }
    }

    public function switchOnlinePayment(Request $request){
        try{
            $body = spx_post_auth_request(RequestAPIClass::getRoute(RequestAPIClass::$switch_online_payment),
                Session::get("accessToken"),[
                "lan"=>"fr",
                "sessionToken"=>$request->cookie("sessionToken"),
                "payment_state"=>$request->input("payment_state")
            ]);
            if ($body!= null){
                if ($body->status ==1){
                    $home = Session::get('home');
                    $home->payment_state = $body->payment_state;
                    Session::put("home",$home);
                }
                return response()->json($body);
            }else{//cas où body est nul
                $response['err_title']="Erreur interne" ;
                return response()->json($response);
            }
        }catch (\Exception $exception){
            $response['err_title']="Erreur interne";
            $response['err_msg']=$exception->getMessage();
            return response()->json($response);
        }

    }

}
