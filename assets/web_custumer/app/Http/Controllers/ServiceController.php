<?php

namespace App\Http\Controllers;

use App\RequestAPIClass;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function getHomeCplus(Request $request){
        return view('services.cplus.home_cplus');

    }

    public function listTvSubscriptions(Request $request){
        try{
            $listTvSubscription = spx_post_auth_request(
                RequestAPIClass::getRoute(RequestAPIClass::$list_tv_subscription),
                \Session::get("accessToken"),[
                    "lan"=>"fr",
                    "sessionToken"=>$request->cookie("sessionToken")
                ]
            );

            if($listTvSubscription!= null ){
                return response()->json($listTvSubscription);
            }else{//cas où body est nul
                $response['err_title']="Erreur interne";
                return response()->json($response);
            }
        }catch (\Exception $exception){
            $response['err_title']="Erreur interne";
            $response['err_msg']=$exception->getMessage();
            return response()->json($response);
        }
    }

    public function listTvCommands(Request $request){
        try{
            $listTvCommands = spx_post_auth_request(
                RequestAPIClass::getRoute(RequestAPIClass::$list_tv_commands),
                \Session::get("accessToken"),[
                    "lan"=>"fr",
                    "sessionToken"=>$request->cookie("sessionToken")
                ]
            );

            if($listTvCommands!= null ){
                return response()->json($listTvCommands);
            }else{//cas où body est nul
                $response['err_title']="Erreur interne";
                return response()->json($response);
            }
        }catch (\Exception $exception){
            $response['err_title']="Erreur interne";
            $response['err_msg']=$exception->getMessage();
            return response()->json($response);
        }
    }

    public function listTvPackages(Request $request){
        try{
            $listTvPackages = spx_post_auth_request(
                RequestAPIClass::getRoute(RequestAPIClass::$list_tv_packages),
                \Session::get("accessToken"),[
                    "lan"=>"fr",
                    "sessionToken"=>$request->cookie("sessionToken"),
                    "op_reference"=>"SO_PYBCANAL",
                    "part_abbr"=>"CPLUS"
                ]
            );

            if($listTvPackages!= null ){
                return response()->json($listTvPackages);
            }else{//cas où body est nul
                $response['err_title']="Erreur interne";
                return response()->json($response);
            }
        }catch (\Exception $exception){
            $response['err_title']="Erreur interne";
            $response['err_msg']=$exception->getMessage();
            return response()->json($response);
        }
    }

    public function saveTVSubscription(Request $request){
        try{
            $subscription = [
                "title"=>$request->input("title"),
                "phone_number"=>"237".$request->input("phone_number"),
                "subscriber_number"=>$request->input("subscriber_number"),
                "id_tv_package"=>$request->input("id_tv_package")
            ];
            $saveSubscription = spx_post_auth_request(
                RequestAPIClass::getRoute(RequestAPIClass::$create_tv_packages),
                \Session::get("accessToken"),[
                    "lan"=>"fr",
                    "sessionToken"=>$request->cookie("sessionToken"),
                    "subscription"=>$subscription
                ]
            );

            if($subscription!= null ){
                return response()->json($saveSubscription);
            }else{//cas où body est nul
                $response['err_title']="Erreur interne";
                return response()->json($response);
            }
        }catch (\Exception $exception){
            $response['err_title']="Erreur interne";
            $response['err_msg']=$exception->getMessage();
            return response()->json($response);
        }
    }
    public function deleteTvSubscription(Request $request){
        try{
            $subscription = [
                "id_tv_subscription"=>$request->input("id_tv_subscription")
            ];
            $saveSubscription = spx_post_auth_request(
                RequestAPIClass::getRoute(RequestAPIClass::$delete_tv_packages),
                \Session::get("accessToken"),[
                    "lan"=>"fr",
                    "sessionToken"=>$request->cookie("sessionToken"),
                    "subscription"=>$subscription
                ]
            );

            if($subscription!= null ){
                return response()->json($saveSubscription);
            }else{//cas où body est nul
                $response['err_title']="Erreur interne";
                return response()->json($response);
            }
        }catch (\Exception $exception){
            $response['err_title']="Erreur interne";
            $response['err_msg']=$exception->getMessage();
            return response()->json($response);
        }
    }

    public function payCplus(Request $request){
        try{

            $pay_cplus = spx_post_auth_request(
                RequestAPIClass::getRoute(RequestAPIClass::$pay_cplus),
                \Session::get("accessToken"),[
                    "lan"=>"fr",
                    "sessionToken"=>$request->cookie("sessionToken"),
                    "password"=>$request->input("password"),
                    "payment_mode"=>$request->input("payment_mode"),
                    "momo_phone_number"=>"237".$request->input("momo_phone_number"),
                    "om_phone_number"=>"237".$request->input("om_phone_number"),
                    "mypackages"=>json_decode($request->input("mypackages"))
                ]
            );

            //$pay_cplus = json_decode($pay_cplus);
            if ($pay_cplus!= null && $pay_cplus->status ==1){
                $phone_number = $request->input("momo_phone_number")??$request->input("om_phone_number");
                return response()->json([
                    'status'=>1,
                    'step'=>$pay_cplus->step,
                    'transaction_code'=>$pay_cplus->transaction_code ?? "",
                    'view'=>view('operations.components.service_request_to_pay',
                        ["payment_mode"=>$request->input('payment_mode'),
                            "phone_number"=> "237".$phone_number,
                            "amount"=> $pay_cplus->amount,
                            "commission"=> $pay_cplus->commission,
                            "fees"=> $pay_cplus->fees ?? 0,
                            "total_amount"=> $pay_cplus->total])->render()]);

            }else if($pay_cplus!= null && $pay_cplus->status ==0) {

                return response()->json($pay_cplus);
            }else{//cas où body est null
                $response['status']=0;
                $response['err_title']="Erreur interne-";
                return response()->json($response);
            }
        }catch (\Exception $exception){
            $response['status']=0;
            $response['err_title']="Erreur interne";
            $response['err_msg']=$exception->getMessage();
            return response()->json($response);
        }
    }

    public function getPaymentMode(Request $request)
    {
        try{
            $listPaymentModes = spx_post_auth_request(
                RequestAPIClass::getRoute(RequestAPIClass::$list_payment_modes),
                \Session::get("accessToken"),[
                    "lan"=>"fr",
                    "sessionToken"=>$request->cookie("sessionToken"),
                    "packages"=>"[none]"
                ]
            );

            if($listPaymentModes!= null ){
                return response()->json($listPaymentModes);
            }else{//cas où body est nul
                $response['err_title']="Erreur interne";
                return response()->json($response);
            }
        }catch (\Exception $exception){
            $response['err_title']="Erreur interne";
            $response['err_msg']=$exception->getMessage();
            return response()->json($response);
        }
    }

}
