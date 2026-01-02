<?php

namespace App\Http\Controllers;

use App\MenuCode;
use App\RequestAPIClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Symfony\Component\Console\Input\Input;

class OperationController extends Controller
{
    public function getaccountTransfert(Request $request)
    {
        //spx_set_selected_menu(MenuCode::$ACC_TRANSFERT);
        return response()->json(['status' => 1, 'view' => view('operations.acc_transfert')->render()]);
    }
    public function getNonaccountTransfert(Request $request)
    {
        //spx_set_selected_menu(MenuCode::$NONACC_TRANSFERT);
        return response()->json(['status' => 1, 'view' => view('operations.non_acc_transfert')->render()]);
    }
    public function getInternationalTransfert(Request $request)
    {
        //spx_set_selected_menu(MenuCode::$INTER_TRANSFERT);
        $response = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$withdrawal_modes),
            Session::get("accessToken"),
            [
                "lan" => "fr",
                "amount" => $request->input('amount')
            ]
        );

        return response()->json(['status' => 1,
                'withdrawal_modes' => $response->withdrawalMethodes,
                'view' => view('operations.international_transfert')->render()]);
    }
    //premiere etatpe du transfert international mode non connecte
    public function getInternationalTransfert1(Request $request){
        $response = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$withdrawal_modes),
            Session::get("accessToken"),
            [
                "lan" => "fr",
                "amount" => $request->input('amount')
            ]
        );

        return response()->json(['status' => 1,
                'withdrawal_modes' => $response->withdrawalMethodes,
                'view' => view('operations.transfert_international.transfert_international1')->render()]);
    }

    public function getBalance(Request $request)
    {
        return response()->json(['status' => 1, 'view' => view('operations.consult_balance')->render()]);
    }
    public function getDeposit(Request $request)
    {
        //return response()->json(['status' => 1, 'view' => view('operations.deposit')->render()]);
        $deposit_paymentMethod = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$payment_modes),
            Session::get("accessToken"),
            [
                "lan" => "fr",
                "sessionToken" => $request->cookie("sessionToken"),
                "type_deposit" => "SESAMPAYX"
            ]
        );
        //dd($deposit_paymentMethod );
        //$preview_acc_transfert = json_decode($preview_acc_transfert);
        if ($deposit_paymentMethod  != null && $deposit_paymentMethod ->status == 1) {
            $status = $deposit_paymentMethod->status;
            return response()->json([
                'status' => 1,
                'view' => view('operations.deposit', ['paymentMethod' => $deposit_paymentMethod->methodes])->render()
            ]);
        } else if ($deposit_paymentMethod != null && $deposit_paymentMethod->status == 0) {
            return response()->json($deposit_paymentMethod, 500);
        } else { //cas où body est nul
            $response['err_title'] = "Erreur interne";
            return response()->json($response, 500);
        }
    }


    public function previewAccountTransfert(Request $request)
    {


        $beneficiary['phone_number'] = "237" . $request->input('phone_number');

        $preview_acc_transfert = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$preview_acc_transfert),
            Session::get("accessToken"),
            [
                "lan" => "fr",
                "sessionToken" => $request->cookie("sessionToken"),
                "beneficiary" => $beneficiary,
                "amount" => $request->input('amount')
            ]
        );
        //dd($preview_acc_transfert);
        //$preview_acc_transfert = json_decode($preview_acc_transfert);
        if ($preview_acc_transfert != null && $preview_acc_transfert->status == 1) {
            $status = $preview_acc_transfert->status;
            return response()->json([
                'status' => 1,
                'view' => view('operations.recap_acc_transfert', ['msg' => $preview_acc_transfert->msg, "phone_number" => $request->input('phone_number'), "amount" => $request->input('amount')])->render()
            ]);
        } else if ($preview_acc_transfert != null && $preview_acc_transfert->status == 0) {
            return response()->json($preview_acc_transfert, 500);
        } else { //cas où body est nul
            $response['err_title'] = "Erreur interne";
            return response()->json($response, 500);
        }
    }

    public function postAccountTransfert(Request $request)
    {
        $beneficiary['phone_number'] = "237" . $request->input('phone_number');

        $acc_transfert = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$acc_transfert),
            Session::get("accessToken"),
            [
                "lan" => "fr",
                "sessionToken" => $request->cookie("sessionToken"),
                "beneficiary" => $beneficiary,
                "amount" => $request->input('amount'),
                "password" => $request->input('password')
            ]
        );
        //$acc_transfert = json_decode($acc_transfert);
        //dd($acc_transfert);
        if ($acc_transfert != null && $acc_transfert->status == 1) {
            $status = $acc_transfert->status;
            return response()->json([
                'status' => 1,
                'view' => view('operations.result_operation', ['msg' => $acc_transfert->datas->message])->render()
            ]);
        } else if ($acc_transfert != null && $acc_transfert->status == 0) {
            return response()->json($acc_transfert, 500);
        } else { //cas où body est nul
            $response['err_title'] = "Erreur interne";
            return response()->json($response, 500);
        }
    }

    public function previewNonAccountTransfert(Request $request)
    {

        $beneficiary['phone_number'] = "237" . $request->input('phone_number');
        $beneficiary['firstname'] = $request->input('firstname');
        $beneficiary['lastname'] = $request->input('lastname');

        $prev_non_acc_transfert = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$preview_non_acc_transfert),
            Session::get("accessToken"),
            [
                "lan" => "fr",
                "sessionToken" => $request->cookie("sessionToken"),
                "beneficiary" => $beneficiary,
                "amount" => $request->input('amount'),
                "password" => $request->input('password')
            ]
        );
        //$prev_non_acc_transfert = json_decode($prev_non_acc_transfert);
        if ($prev_non_acc_transfert != null && $prev_non_acc_transfert->status == 1) {
            $status = $prev_non_acc_transfert->status;
            return response()->json([
                'status' => 1,
                'view' => view('operations.recap_non_acc_transfert', [
                    'msg' => $prev_non_acc_transfert->msg,
                    "phone_number" => $request->input('phone_number'), "amount" => $request->input('amount'),
                    'firstname' => $request->input('firstname'), "lastname" => $request->input('lastname')
                ])->render()
            ]);
        } else if ($prev_non_acc_transfert != null && $prev_non_acc_transfert->status == 0) {
            return response()->json($prev_non_acc_transfert, 500);
        } else { //cas où body est nul
            $response['err_title'] = "Erreur interne";
            return response()->json($response, 500);
        }
    }

    public function previewInternationalTransfert(Request $request)
    {
        $firstname = $request->input('firstname');
        $lastname = $request->input('lastname');
        if($request->input('withdrawal_method')=="SESAMPAYX"){
            $firstname = "None";
            $lastname = "None";
        }

        $beneficiary['phone_number'] = $request->input('phone_number');
        $beneficiary['firstname'] = $firstname ;
        $beneficiary['lastname'] = $lastname ;
        $beneficiary['type_cni'] = $request->input('type_cni');
        $beneficiary['cni'] = $request->input('cni');
        $transmitter['country'] = $request->input('country');

        $prev_international_transfert = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$preview_international_transfert),
            Session::get("accessToken"),
            [
                "lan" => "fr",
                "sessionToken" => $request->cookie("sessionToken"),
                "beneficiary" => $beneficiary,
                "transmitter" => $transmitter,
                "amount" => $request->input('amount'),
                "reference" => "INTER_MONEY_TRANSFERT",
                "withdrawal_method" => $request->input('withdrawal_method'),
                "phone_number" => $request->input('phone_number')
            ]
        );
        //$prev_international_transfert = json_decode($prev_international_transfert);
        if ($prev_international_transfert != null && $prev_international_transfert->status == 1) {
            //$prev_international_transfert->msg->total = str_replace("\n", "<br>", $prev_international_transfert->msg->total);
            $datas = $request->input();
            $datas["amount"] = $prev_international_transfert->amount;
            return response()->json([
                'status' => 1,
                'view' => view('operations.recap_international_transfert', [
                    'msg' => $prev_international_transfert->msg,
                    'datas' => $datas,
                ])->render()]);
        } else if ($prev_international_transfert != null && $prev_international_transfert->status == 0) {
            return response()->json($prev_international_transfert, 500);
        } else { //cas où body est nul
            $response['err_title'] = "Erreur interne";
            return response()->json($response, 500);
        }
    }

    public function postNonAccountTransfert(Request $request)
    {

        $beneficiary['phone_number'] = "237" . $request->input('phone_number');
        $beneficiary['firstname'] = $request->input('firstname');
        $beneficiary['lastname'] = $request->input('lastname');

        $non_acc_transfert = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$non_acc_transfert),
            Session::get("accessToken"),
            [
                "lan" => "fr",
                "sessionToken" => $request->cookie("sessionToken"),
                "beneficiary" => $beneficiary,
                "amount" => $request->input('amount'),
                "password" => $request->input('password')
            ]
        );

        if ($non_acc_transfert != null && $non_acc_transfert->status == 1) {
            $status = $non_acc_transfert->status;
            return response()->json([
                'status' => 1,
                'view' => view('operations.result_operation', ['msg' => $non_acc_transfert->datas->message])->render()
            ]);
        } else if ($non_acc_transfert != null && $non_acc_transfert->status == 0) {
            return response()->json($non_acc_transfert, 500);
        } else { //cas où body est nul
            $response['err_title'] = "Erreur interne";
            return response()->json($response, 500);
        }
    }

    public function postInternationalTransfert(Request $request)
    {

        $beneficiary['phone_number'] = $request->input('phone_number');
        $beneficiary['firstname'] = $request->input('firstname');
        $beneficiary['lastname'] = $request->input('lastname');
        $beneficiary['type_cni'] = $request->input("type_cni");
        $beneficiary['cni'] = $request->input("cni");
        $transmitter['country'] = $request->input('country');

        $international_transfert = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$international_transfert),
            Session::get("accessToken"),
            [
                "lan" => "fr",
                "sessionToken" => $request->cookie("sessionToken"),
                "beneficiary" => $beneficiary,
                "transmitter" => $transmitter,
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

    public function postCheckBalance(Request $request)
    {

        $check_balance = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$check_balance),
            Session::get("accessToken"),
            [
                "lan" => "fr",
                "sessionToken" => $request->cookie("sessionToken"),
                "password" => $request->input('password')
            ]
        );
        //$check_balance = json_decode($check_balance);
        if ($check_balance != null && $check_balance->status == 1) {
            $status = $check_balance->status;
            return response()->json([
                'status' => 1,
                'view' => view('operations.result_operation', ['msg' => "Votre solde est de " . number_format((float)$check_balance->balance, 2) . " XAF"])->render()
            ]);
        } else if ($check_balance != null && $check_balance->status == 0) {
            return response()->json($check_balance);
        } else { //cas où body est nul
            $response['err_title'] = "Erreur interne";
            return response()->json($response, 500);
        }
    }

    public function listTransactions(Request $request)
    {
        spx_set_selected_menu(MenuCode::$LIST_TRANSACTION);

        $transactions = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$list_transactions),
            Session::get("accessToken"),
            [
                "lan" => "fr",
                "sessionToken" => $request->cookie("sessionToken")
            ]
        );
        //dd($transactions);

        if ($transactions != null && $transactions->status == 1) {
            return view('operations.list_transactions', [
                "datas" => $transactions->datas,
                "paginator" => $transactions->paginator
            ]);
        } else if ($transactions != null && $transactions->status == 0) {
            return response()->view(
                'errors.500',
                [
                    'err_title' => $transactions->err_title,
                    'err_code' => $transactions->err_code,
                    'err_msg' => $transactions->err_msg,
                ],
                500
            );
        } else { //cas où list benefits est nul
            $response['err_title'] = "Erreur interne";
            return response()->view('errors.500', [
                "err_title" => "Erreur interne",
                "err_code" => "500",
                "err_msg" => "Une erreur s'est produite. Veuillez réessayer plus tard"
            ], 500);
        }
    }

    public function paginatedTransactions(Request $request)
    {

        $transactions = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$paginated_transactions),
            Session::get("accessToken"),
            [
                "lan" => "fr",
                "sessionToken" => $request->cookie("sessionToken"),
                "page" => $request->input("page"),
                "number" => 10
            ]
        );

        if ($transactions != null && $transactions->status == 1) {

            return response()->json([
                'status' => 1,
                'view' => view(
                    'operations.components.paginated_transactions',
                    [
                        "datas" => $transactions->datas,
                        "paginator" => $transactions->paginator
                    ]
                )->render()
            ]);
        } else if ($transactions != null && $transactions->status == 0) {
            return response()->json($transactions);
        } else { //cas où list benefits est nul

            $response['err_title'] = "Erreur interne";
            return response()->json($response);
        }
    }

    public function previewDeposit(Request $request)
    {
        try {

            $payment_method = $request->input('payment_method');
            $phone_number = "";
            if ($payment_method == "MTNMOMO") {
                $phone_number = "237" . $request->input('mtn_phone_number');
            }
            if ($payment_method == "OM") {
                $phone_number = "237" . $request->input('om_phone_number');
            }
            $preview_deposit = spx_post_auth_request(
                RequestAPIClass::getRoute(RequestAPIClass::$preview_deposit),
                Session::get("accessToken"),
                [
                    "lan" => "fr",
                    "sessionToken" => $request->cookie("sessionToken"),
                    "amount" => $request->input('amount'),
                    "payment_method" => $payment_method,
                    "phone_number" => $phone_number
                ]
            );
            //dd($preview_deposit);
            if ($preview_deposit != null && $preview_deposit->status == 1) {
                $status = $preview_deposit->status;
                $url = "";
                if ($payment_method == "VISA/MASTERCARD") {
                    $url = $preview_deposit->api;
                }


                return response()->json([
                    'status' => 1,
                    'amount' => $preview_deposit->amount,
                    'payment_method' => $payment_method,
                    'phone_number' => $phone_number,
                    'view' => view(
                        'operations.components.preview_deposit',
                        [
                            'amount' => $preview_deposit->amount,
                            'fees' => $preview_deposit->fees,
                            'commission' => $preview_deposit->commission,
                            'total' => $preview_deposit->total,
                            'payment_method' => $payment_method,
                            'phone_number' => $phone_number,
                            "url" => $url
                        ]
                    )->render()
                ]);
            } else if ($preview_deposit != null && $preview_deposit->status == 0) {
                return response()->json($preview_deposit);
            } else { //cas où body est nul
                $response['err_title'] = "Erreur interne";
                return response()->json($response);
            }
        } catch (\Exception $exception) {
            $response['status'] = 0;
            $response['err_title'] = "Erreur interne";
            $response['err_msg'] = $exception->getMessage();
            return response()->json($response);
        }
    }

    public function requestToPay(Request $request)
    {
        try {
            $request_to_pay = spx_post_auth_request(
                RequestAPIClass::getRoute(RequestAPIClass::$request_to_pay),
                Session::get("accessToken"),
                [
                    "lan" => "fr",
                    "sessionToken" => $request->cookie("sessionToken"),
                    "amount" => $request->input('amount'),
                    "payment_method" => $request->input('payment_method'),
                    "phone_number" => $request->input('phone_number')
                ]
            );
            //dd($request_to_pay);
            if ($request_to_pay != null && $request_to_pay->status == 1) {
                return response()->json([
                    'status' => 1,
                    'transaction_code' => $request_to_pay->transaction_code,
                    'view' => view(
                        'operations.components.deposit_request_to_pay',
                        [
                            'transaction_code' => $request_to_pay->transaction_code,
                            'msg' => $request_to_pay->msg,
                            "payment_method" => $request->input('payment_method'),
                            "phone_number" => $request->input('phone_number'),
                            "amount" => $request->input('amount'),
                            "commission" => $request->input('commission'),
                            "fees" => $request->input('fees'),
                            "total_amount" => $request->input('total_amount'),
                        ]
                    )->render()
                ]);
            } else if ($request_to_pay != null && $request_to_pay->status == 0) {
                return response()->json($request_to_pay);
            } else { //cas où body est nul
                $response['err_title'] = "Erreur interne";
                return response()->json($response);
            }
        } catch (\Exception $exception) {
            $response['err_title'] = "Erreur interne";
            $response['err_msg'] = $exception->getMessage();
            return response()->json($response);
        }
    }

    public function requestToPayStatus(Request $request)
    {
        try {

            $payment_method = $request->input('payment_method');
            if($payment_method==="MTNMOMO")$payment_method="MTN";
            $url = "";
            switch ($payment_method) {
                case "MTN":
                    $url = RequestAPIClass::getRoute(RequestAPIClass::$momo_request_to_pay_status);
                    break;
                case "OM":
                    $url = RequestAPIClass::getRoute(RequestAPIClass::$om_request_to_pay_status);
                    break;
            }
            //dd($url);
            $request_to_pay_status = spx_post_auth_request(
                $url,
                Session::get("accessToken"),
                [
                    "lan" => "fr",
                    "sessionToken" => $request->cookie("sessionToken"),
                    "transaction_code" => $request->input('transaction_code')
                ]
            );
            //dd($request_to_pay_status);
            //$request_to_pay_status = json_decode($request_to_pay_status);
            if ($request_to_pay_status != null) {
                return response()->json($request_to_pay_status);
            } else { //cas où body est nul
                $response['err_title'] = "Erreur interne";
                $response["status"] = "STOP";
                return response()->json($response);
            }
        } catch (\Exception $exception) {
            $response['err_title'] = "Erreur interne";
            $response['err_msg'] = $exception->getMessage();
            return response()->json($response);
        }
    }

    public function checkAccount(Request $request){
        $firstname = $request->input('firstname');
        $lastname = $request->input('lastname');
        if($request->input('withdrawal_method')=="SESAMPAYX"){
            $firstname = "None";
            $lastname = "None";
        }

        $beneficiary['phone_number'] = $request->input('phone_number');
        $beneficiary['firstname'] = $firstname ;
        $beneficiary['lastname'] = $lastname ;
        $beneficiary['type_cni'] = $request->input('type_cni');
        $beneficiary['cni'] = $request->input('cni');
        $transmitter['country'] = $request->input('country');

        $check_account_response = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$check_account),
            Session::get("accessToken"),
            [
                "lan" => "fr",
                "beneficiary" => $beneficiary,
                "withdrawal_method" => $request->input('withdrawal_method'),
                "phone_number" => $request->input('phone_number'),
                "amount" => $request->input("amount")
            ]
        );
        //$prev_international_transfert = json_decode($prev_international_transfert);
        if ($check_account_response != null && $check_account_response->status == 1) {
            //$prev_international_transfert->msg->total = str_replace("\n", "<br>", $prev_international_transfert->msg->total);
            $datas = $request->input();
            $datas["amount"] = $check_account_response->amount;
            if($request->input('withdrawal_method')=="SESAMPAYX"){
                $datas["firstname"] = $check_account_response->firstname;
                $datas["lastname"] = $check_account_response->lastname;
            }
            return response()->json([
                'status' => 1,
                'view' => view('operations.recap_international_transfert', [
                    'msg' => $check_account_response->msg,
                    'datas' => $datas,
                ])->render()]);
        } else if ($check_account_response != null && $check_account_response->status == 0) {
            return response()->json($check_account_response);
        } else { //cas où body est nul
            $response['err_title'] = "Erreur interne";
            return response()->json($response, 500);
        }
    }

    public function noConnectedCheckAccount(Request $request){
        $firstname = $request->input('firstname');
        $lastname = $request->input('lastname');
        if($request->input('withdrawal_method')=="SESAMPAYX"){
            $firstname = "None";
            $lastname = "None";
        }

        $beneficiary['phone_number'] = $request->input('phone_number');
        $beneficiary['firstname'] = $firstname ;
        $beneficiary['lastname'] = $lastname ;
        $beneficiary['type_cni'] = $request->input('type_cni');
        $beneficiary['cni'] = $request->input('cni');
        $transmitter['country'] = $request->input('country');

        $check_account_response = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$check_account),
            Session::get("accessToken"),
            [
                "lan" => "fr",
                "beneficiary" => $beneficiary,
                "withdrawal_method" => $request->input('withdrawal_method'),
                "phone_number" => $request->input('phone_number'),
                "amount" => $request->input("amount")
            ]
        );
        //$prev_international_transfert = json_decode($prev_international_transfert);
        if ($check_account_response != null && $check_account_response->status == 1) {
            return response()->json([
                'status' => 1,
                'firstname' =>$check_account_response->firstname,
                'lastname' =>$check_account_response->lastname,
            ]);
        } else if ($check_account_response != null && $check_account_response->status == 0) {
            return response()->json($check_account_response);
        } else { //cas où body est nul
            $response['err_title'] = "Erreur interne";
            return response()->json($response, 500);
        }
    }

    public function getComInterTrans(Request $request){


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
            //$prev_international_transfert->msg->total = str_replace("\n", "<br>", $prev_international_transfert->msg->total);
            $datas = $request->input();
            $datas["amount"] = $check_com_response->amount;
            return response()->json([
                'status' => 1,
                'amount' => $check_com_response->amount,
                'payment_method' => $request->input('payment_method'),
                'phone_number' => $request->input('phone_number'),
                'view' => view(
                    'operations.components.preview_international',
                    [
                        'amount' => $check_com_response->amount,
                        'fees' => $check_com_response->fees,
                        'commission' => $check_com_response->commission,
                        'total' => $check_com_response->total,
                        'payment_method' => $request->input('payment_method'),
                        'phone_number' => $request->input('phone_number'),
                        'datas' => $datas,
                        "url" => "#"
                    ]
                )->render()
            ]);
        } else if ($check_com_response != null && $check_com_response->status == 0) {
            return response()->json($check_com_response, 500);
        } else { //cas où body est nul
            $response['err_title'] = "Erreur interne";
            return response()->json($response, 500);
        }
    }

    public function getVisaDeposit(Request $request)
    {
        //return response()->json(['status' => 1, 'view' => view('operations.deposit')->render()]);
        $deposit_paymentMethod = spx_post_auth_request(
            RequestAPIClass::getRoute(RequestAPIClass::$payment_modes),
            Session::get("accessToken"),
            [
                "lan" => "fr",
                "sessionToken" => $request->cookie("sessionToken"),
                "type_deposit" => "VISA"
            ]
        );
        //dd($deposit_paymentMethod );
        //$preview_acc_transfert = json_decode($preview_acc_transfert);
        if ($deposit_paymentMethod  != null && $deposit_paymentMethod ->status == 1) {
            $status = $deposit_paymentMethod->status;
            return response()->json([
                'status' => 1,
                'view' => view('operations.visaDeposit', ['paymentMethod' => $deposit_paymentMethod->methodes])->render()
            ]);
        } else if ($deposit_paymentMethod != null && $deposit_paymentMethod->status == 0) {
            return response()->json($deposit_paymentMethod, 500);
        } else { //cas où body est nul
            $response['err_title'] = "Erreur interne";
            return response()->json($response, 500);
        }
    }

    public function previewVisaDeposit(Request $request)
    {
        try {

            $payment_method = $request->input('payment_method_visa');
            $phone_number = "237" . $request->input('phone_number');
            $preview_deposit = spx_post_auth_request(
                RequestAPIClass::getRoute(RequestAPIClass::$preview_visa_deposit),
                Session::get("accessToken"),
                [
                    "lan" => "fr",
                    "sessionToken" => $request->cookie("sessionToken"),
                    "amount" => $request->input('amount'),
                    "payment_method" => $payment_method,
                    "phone_number" => $phone_number
                ]
            );
            //dd($preview_deposit);
            if ($preview_deposit != null && $preview_deposit->status == 1) {
                $status = $preview_deposit->status;

                return response()->json([
                    'status' => 1,
                    'amount' => $preview_deposit->amount,
                    'payment_method' => $payment_method,
                    'phone_number' => $phone_number,
                    'card_number' => $request->input("card_number"),
                    'view' => view(
                        'operations.components.preview_visa_deposit',
                        [
                            'amount' => $preview_deposit->amount,
                            'fees' => $preview_deposit->fees,
							'visa_fees' => $preview_deposit->visa_fees,
                            'commission' => $preview_deposit->commission,
                            'total' => $preview_deposit->total,
                            'payment_method' => $payment_method,
                            'phone_number' => $phone_number,
                            'card_number' => $request->input("card_number"),
                        ]
                    )->render()
                ]);
            } else if ($preview_deposit != null && $preview_deposit->status == 0) {
                return response()->json($preview_deposit);
            } else { //cas où body est nul
                $response['err_title'] = "Erreur interne";
                return response()->json($response);
            }
        } catch (\Exception $exception) {
            $response['status'] = 0;
            $response['err_title'] = "Erreur interne";
            $response['err_msg'] = $exception->getMessage();
            return response()->json($response);
        }
    }
    public function requestVisaDeposit(Request $request)
    {
        try {
            $request_to_pay = spx_post_auth_request(
                RequestAPIClass::getRoute(RequestAPIClass::$request_visa_deposit),
                Session::get("accessToken"),
                [
                    "lan" => "fr",
                    "sessionToken" => $request->cookie("sessionToken"),
                    "amount" => $request->input('amount'),
                    "payment_method" => $request->input('payment_method'),
                    "phone_number" => $request->input('phone_number'),
                    "card_number" => $request->input('card_number'),
					"password" => $request->input('password')
                ]
            );
            //dd($request_to_pay);
            if ($request_to_pay != null && $request_to_pay->status == 1) {
                $url = "";
                $transaction_code="";
                if ($request->input('payment_method') == "VISA/MASTERCARD") {
                    $url = $request_to_pay->api;
                }else{
                    $transaction_code = $request_to_pay->transaction_code;
                }
                return response()->json([
                    'status' => 1,
                    'transaction_code' => $transaction_code,
                    "url" => $url,
                    'view' => view(
                        'operations.components.deposit_request_to_pay',
                        [
                            'transaction_code' => $transaction_code,
                            'msg' => $request_to_pay->msg,
                            "payment_method" => $request->input('payment_method'),
                            "phone_number" => $request->input('phone_number'),
                            "amount" => $request->input('amount'),
                            "commission" => $request->input('commission'),
                            "fees" => $request->input('fees'),
                            "total_amount" => $request->input('total_amount'),
                            "url" => $url
                        ]
                    )->render()
                ]);
            } else if ($request_to_pay != null && $request_to_pay->status == 0) {
                return response()->json($request_to_pay);
            } else { //cas où body est nul
                $response['err_title'] = "Erreur interne";
                return response()->json($response);
            }
        } catch (\Exception $exception) {
            $response['err_title'] = "Erreur interne";
            $response['err_msg'] = $exception->getMessage();
            return response()->json($response);
        }
    }
}
