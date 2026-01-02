<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\RequestAPIClass;
use Illuminate\Support\Facades\View;

class CamwaterServiceController extends Controller
{
    public function getHomeCamwater(Request $request){
        return view('services.camwater.home');

    }
    public function listSubscriptions(Request $request){
        try{
            $listCamwaterSubscription = spx_post_auth_request(
                RequestAPIClass::getRoute(RequestAPIClass::$list_camwater_subscription),
                \Session::get("accessToken"),[
                    "lan"=>"fr",
                    "sessionToken"=>$request->cookie("sessionToken")
                ]
            );
            //$listCamwaterSubscription = json_decode($listCamwaterSubscription);
            if($listCamwaterSubscription!= null ){
                return response()->json($listCamwaterSubscription);
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

    public function saveCamwaterSubscription(Request $request)
    {
        try{
            $title = trim($request->input("title"));
            $subscription_number = trim($request->input("subscription_number"));
            $response = spx_post_auth_request(
                RequestAPIClass::getRoute(RequestAPIClass::$create_camwater_subscription),
                \Session::get("accessToken"),[
                    "lan"=>"fr",
                    "sessionToken"=>$request->cookie("sessionToken"),
                    "title" => $title,
                    "subscription_number" => $subscription_number,
                    "subscription_id" =>$request->subscription_id,
                ]
            );
            //dd($response);
            if($response!= null ){
                return response()->json($response);
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

    public function editSubscription(Request $request)
    {
        try{
            $subscription = spx_post_auth_request(
                RequestAPIClass::getRoute(RequestAPIClass::$get_camwater_subscription),
                \Session::get("accessToken"),[
                    "lan"=>"fr",
                    "sessionToken"=>$request->cookie("sessionToken"),
                    'id_camwater_subscription'=>$request->input('id_camwater_subscription')
                ]
            );
            $subscription = json_decode($subscription);
            if($subscription!= null ){

                return response()->json([
                    'status' => $subscription->status,
                    'subscription'=>$subscription->data,
                    'view' => view('services.camwater.add_edit')->with('subscription',$subscription->data)->render()
                ]);

            }else{//cas où body est nul
                $response['err_title']="Erreur interne ";
                return response()->json($response);
            }
        }catch (\Exception $exception){
            $response['err_title']="Erreur interne";
            $response['err_msg']=$exception->getMessage();
            return response()->json($response);
        }
    }

    public function deleteSubscription(Request $request)
    {
        try{
            $response = spx_post_auth_request(
                RequestAPIClass::getRoute(RequestAPIClass::$delete_camwater_subscription),
                \Session::get("accessToken"),[
                    "lan"=>"fr",
                    "sessionToken"=>$request->cookie("sessionToken"),
                    'id_camwater_subscription'=>$request->input('id_camwater_subscription')
                ]
            );
            if($response != null ){
                return response()->json($response);
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

    public function getPaymentForm(Request $request)
    {
        try{
            $s_number = $request->input('id_camwater_subscription');
            $response = spx_post_auth_request(
                RequestAPIClass::getRoute(RequestAPIClass::$get_camwater_bill),
                \Session::get("accessToken"),[
                    "lan"=>"fr",
                    "sessionToken"=>$request->cookie("sessionToken"),
                    'id_camwater_subscription'=>$request->input('id_camwater_subscription')
                ]
            );
            //$response = json_decode($response);
            if(!is_null($response) && $response->status == 1){

                return response()->json([
                    'data' => $response,
                    'view' => view('services.camwater.payment_view')->with(["bill"=>$response->data->data,"subscription_number"=>$s_number])->render()
                ]);
            }else{//cas où body est nul
                $error = array("err_title"=>"Erreur interne","response"=>$response);
                return response()->json($error);
            }
        }catch (\Exception $exception){
            $error = array('err_title'=>"Erreur interne",'err_msg'=>$exception->getMessage(),"response"=>$response);
            return response()->json($error);
        }
    }

    public function getCommissions(Request $request)
    {
        try{
            $response = spx_post_auth_request(
                RequestAPIClass::getRoute(RequestAPIClass::$get_camwater_payment_commissions),
                \Session::get("accessToken"),[
                    "lan"=>"fr",
                    "sessionToken"=>$request->cookie("sessionToken"),
                    'amount'=> $request->input('amount'),
                ]
            );

            if($response != null ){
                $response = $response;
                $has_commission = true;
                if($response->status==1 && $response->commission==0)$has_commission = false;
                return response()->json([
                    'status' => $response->status,
                    'view' => view('services.camwater.details_fees_portlet')->with(["fees"=>$response,"has_commission"=>$has_commission])->render()
                ]);
            }else{//cas où body est nul
                $error = array("err_title"=>"Erreur interne","response"=>$response);
                return response()->json($error);
            }
        }catch (\Exception $exception){
            $error = array('err_title'=>"Erreur interne",'err_msg'=>$exception->getMessage(),"response"=>$response);
            return response()->json($error);
        }
    }

    public function payCamwaterBill(Request $request)
    {
        try{
            $response = spx_post_auth_request(
                RequestAPIClass::getRoute(RequestAPIClass::$camwater_operation_pay),
                \Session::get("accessToken"),[
                    "lan"=>"fr",
                    "sessionToken"=>$request->cookie("sessionToken"),
                    'reference' => $request->input('reference'),
                    'amount'=> $request->input('amount'),
                    'operation'=>$request->input('operation'),
                    'payment_mode'=>$request->input('payment_mode'),
                    'password' =>$request->password,
                    'momo_phone_number' => $request->momo_phone_number,
                    'om_phone_number' => $request->om_phone_number,
                    'mintopay' => $request->minToPay,
                    'monthFlow' => $request->monthFlow,
                    'unpaid' => $request->unpaid,
                    'deadline' => $request->deadline
                ]
            );
            //dd($response);
            //$response = json_decode($response);
            if($response != null && $response->status==1 ){
                return response()->json([
                    'status' => $response->status,
                    'step'=>$response->step,
                    'api'=>$response->api ?? "",
                    'transaction_code'=>$response->transaction_code ?? "",
                    'view'=>view('operations.components.camwater_request_to_pay',
                        ["payment_mode"=>$request->input('payment_mode'),
                            "phone_number"=> "237".$request->input("momo_phone_number"),
                            "title" => $response->title ?? "",
                            "msg" => $response->msg ?? "",
                            "amount"=> $response->amount ?? 0,
                            "commission"=> $response->commission??0,
                            "fees"=> $response->fees ?? 0,
                            "total_amount"=> $response->total ?? 0])->render()
                ]);
            }else if($response!= null && $response->status ==0) {
                return response()->json($response);
            }else{//cas où body est nul
                $error = array("err_title"=>"Erreur interne","response"=>$response);
                return response()->json($error);
            }
        }catch (\Exception $exception){
            $error = array('err_title'=>"Erreur interne",'err_msg'=>$exception->getMessage(),"response"=>$response);
            return response()->json($error);
        }
    }

    public function lastStep(Request $request)
    {
        try{
            $response = spx_post_auth_request(
                RequestAPIClass::getRoute(RequestAPIClass::$get_camwater_payment_lastStep),
                \Session::get("accessToken"),[
                    "lan"=>"fr",
                    "sessionToken"=>$request->cookie("sessionToken"),
                    'amount'=> $request->input('amount'),
                ]
            );
            //dd($response);
            if($response != null ){
                //$response = $response;
                $has_commission = true;
                if($response->status==1)$has_commission = false;
                return response()->json([
                    'status' => $response->status,
                    'methodes' => $response->methodes,
                    'view' => view('services.camwater.details_fees_portlet')->with(["fees"=>$response,"has_commission"=>$has_commission])->render(),
                    'view2'=> view('services.camwater.methodesDePaiement')->with(["methodes"=>$response->methodes])->render()
                ]);
            }else{//cas où body est nul
                $error = array("err_title"=>"Erreur interne","response"=>$response);
                return response()->json($error);
            }
        }catch (\Exception $exception){
            $error = array('err_title'=>"Erreur interne",'err_msg'=>$exception->getMessage(),"response"=>$response);
            return response()->json($error);
        }
    }
}
