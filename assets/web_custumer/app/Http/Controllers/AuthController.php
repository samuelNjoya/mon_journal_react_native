<?php

namespace App\Http\Controllers;

use App\RequestAPIClass;
use App\Traits\RequestTraits;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Session;

class AuthController extends Controller
{

    public function login()
    {

    }

    public function signUp(Request  $request){
        //dd($request);
        $host = spx_get_host($request);
        $person["firstname"]=$request->input("firstname");
        $person["lastname"]=$request->input("lastname");
        $person["birthdate"]=$request->input("birthdate");
        $person["gender"]=$request->input("gender");
        $person["email"]=$request->input("email");
        $person["type_identification"]=$request->input("id_type");
        $person["id_card_recto"]=$request->input("cni_recto");
        $person["id_card_verso"]=$request->input("cni_verso");
        $person["id_card_number"]=$request->input("cni_number");

        $cni_file           = $request->file("cni_recto");
        //$cni_recto_img_name = $cni_file->getClientOriginalName();
        //$cni_recto_img_path = $cni_file->getRealPath();
        //$cni_recto_img_ext  = $cni_file->getClientOriginalExtension();

        //$destinationPath = '../public';
        //$upload = $cni_file->move($destinationPath,$cni_file->getClientOriginalName());return $upload;

        /* $connection = ftp_connect("ftp.sesampayx.com");
        $login = ftp_login($connection, "dev.api.edbrice@sesampayx.com", "ZoQk]f0co@Z1");
            if (!$connection || !$login) { die('Connection attempt failed!'); }
        $upload = ftp_put($connection, $dest, $source, $mode);
            if (!$upload) { echo 'FTP upload failed!'; }
        ftp_close($connection); */

        //$person["cni_file"] = $cni_file;

        $custommer_account["phone_number"]= $request->input("phone_number");
        $custommer_account["email"]=$request->input("email");
        $custommer_account["password"]=$request->input("password");
        $custommer_account["pass"]=$request->input("password");
        $custommer_account["id_type_ben_account"]=$request->input("ben_acc");

        $answers =[];
        array_push($answers,["id_question"=>$request->input("question_one"),"answer_value"=>$request->input("answer_one")]);
        array_push($answers,["id_question"=>$request->input("question_two"),"answer_value"=>$request->input("answer_two")]);


        $body = spx_post_request(RequestAPIClass::getRoute(RequestAPIClass::$signup),[
            "lan"=>"fr",
            "person"=>$person,
            "customer_account"=>$custommer_account,
            "answers"=>$answers,
            "host"=>$host
        ]);

        //dd($body);
        if ($body!= null){
            if ($body->status == 1){
                Session::put('accessToken',$body->accessToken);
                Session::save();
                return response()->json($body)
                    ->cookie('sessionToken',$body->sessionToken,120);
            }
            return response()->json($body);
        }else{//cas où body est nul
            $response['err_title']="Erreur interne";
            return response()->json($response,500);
        }
    }

    public function validateAuthCode(Request  $request){
        //dd($request);
        $body = spx_post_request(RequestAPIClass::getRoute(RequestAPIClass::$validateAuthCode),[
            "lan"=>"fr",
            "phone_number"=> $request->input("phone_number"),
            "auth_code"=> $request->input("code")
        ]);


        //var_dump($body);

        if ($body!= null){
            return response()->json($body);
        }else{//cas où body est nul
            $response['err_title']="Erreur interne";
            return response()->json($response,500);
        }
    }

    public function generateAuthCode(Request  $request){
        $body = spx_post_request(RequestAPIClass::getRoute(RequestAPIClass::$genAuthCode),[
            "lan"=>"fr",
            "phone_number"=> $request->input("phone_number")
        ]);

        //var_dump($body);

        if ($body!= null){
            return response()->json($body);
        }else{//cas où body est nul
            $response['err_title']="Erreur interne";
            return response()->json($response,500);
        }
    }

    public function signIn(Request $request){
        try {
            //dd($request);
            $host = spx_get_host($request);
            $body = spx_post_request(RequestAPIClass::getRoute(RequestAPIClass::$login),[
                "lan"=>"fr",
                "phone_number" => $request->input("phone_number"),
                "password" => $request->input("password"),
                "host"=>$host
            ]);


            //$body = json_decode($body);
            //var_dump(json_decode($body));

            if ($body!= null && $body->status ==1){
                $status = $body->status;
                Session::put('accessToken',$body->accessToken);
                Session::save();
                return response()->json($status)
                    ->cookie('sessionToken',$body->sessionToken,120);
            }else if($body!= null && $body->status ==0){
                return response()->json($body,500);
            }else{//cas où body est nul
                $response['err_title']="Erreur interne";
                return response()->json($response,500);
            }
        } catch (\Throwable $th) {
            //throw $th;
        }

    }

    public function logout(Request $request){

        $body = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$logout),
            Session::get("accessToken"),[
                "lan"=>"fr",
                "sessionToken"=>$request->cookie("sessionToken")
            ]
        );

        //var_dump($body);
        //$body = json_decode($body);
        if ($body!= null && $body->status==1){
            //supression d'une requette
            $request->session()->forget('accessToken');
            Cookie::queue(Cookie::forget('sessionToken'));
            return  redirect()->route('spx.signin');

        }else if($body!= null && $body->status ==0){
            return response()->view('errors.500',
                ['err_title'=> $body->err_title,
                    'err_code'=> $body->err_code,
                    'err_msg'=> $body->err_msg,
                ], 500);
        }else{//cas où body est nul
            $response['err_title']="Erreur interne";
            return response()->view('errors.500',[
                "err_title" => "Erreur interne",
                "err_code"=>"500",
                "err_msg"=>"Une erreur s'est produite. Veuillez réessayer plus tard"],500);
        }

    }

    public function getRecoveryQuestions(Request  $request){
        $body = spx_post_request(RequestAPIClass::getRoute(RequestAPIClass::$getRecovQuest),[
            "lan"=>"fr",
            "phone_number"=> $request->input("phone_number")
        ]);
        if ($body!= null){
            return response()->json($body);
        }else{//cas où body est nul
            $response['err_title']="Erreur interne";
            return response()->json($response,500);
        }
    }
    public function getRecoveryCode(Request $request){
        $host = spx_get_host($request);
        $body = spx_post_request(RequestAPIClass::getRoute(RequestAPIClass::$getRecovCode),[
            "lan"=>"fr",
            "phone_number"=> $request->input("phone_number"),
            "answers"=>$request->input("answers"),
            "host"=>$host
        ]);
        if ($body!= null){
            return response()->json($body);
        }else{//cas où body est nul
            $response['err_title']="Erreur interne";
            return response()->json($response,500);
        }
    }
    public function recoverPassword(Request $request){
        $body = spx_post_request(RequestAPIClass::getRoute(RequestAPIClass::$getRecovQuest),[
            "lan"=>"fr",
            "phone_number"=> $request->input("phone_number"),
            "new_password"=>$request->input("password"),
            "recovery_code"=>$request->input("code"),
        ]);
        if ($body!= null){
            return response()->json($body);
        }else{//cas où body est nul
            $response['err_title']="Erreur interne";
            return response()->json($response,500);
        }
    }

    /*public function signUpImageTest(Request $request){
        return true;
    }*/
}
