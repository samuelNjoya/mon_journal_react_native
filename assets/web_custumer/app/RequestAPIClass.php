<?php


namespace App;



class RequestAPIClass{
    //public static $image_server = "https://dev.admin.backoffice.sesampayx.com/";
    //public static $image_server = "http://127.0.0.1:8081";
    //public static $api_server = "http://192.168.4.96/api.sesampayx/public";
    //public static $image_server = "http://api.sesampayx.app";
    //public static $image_server = env("IMAGE_SERVER");
    //public static $api_server = "http://api.sesampayx.app";
    //public static $api_server = "https://dev.api.sesampayx.com";
    //public static $api_server = "http://127.0.0.1:8081";
    //public static $api_server = "https://dev.api.customer.sesampayx.com";
	//public static $api_server = env("API_SERVER");

    public static $login = "/api/spayxauth/login";
    public static $genAuthCode = "/api/spayxauth/signup/generatecode";
    public static $validateAuthCode = "/api/spayxauth/signup/validatecode";
    public static $signup = "/api/spayxauth/signup/signup";
    public static $logout = "/api/spayxauth/logout";
    public static $getRecovQuest = "/api/spayxauth/getrecovquest";
    public static $getRecovCode = "/api/spayxauth/sendrecovcode";
    public static $recoverPassword = "/api/spayxauth/recovpass";
    public static $home = "/api/spayxwebhome";
    public static $defaultPassword = "/api/defaultPassword";
    public static $hometransactions = "/api/spayxtransaction/webhome";
    public static $homeadvantages = "/api/spayxadvantage/webhome";
    public static $listBenefitsAcc = "/api/spayxbenacc/list";
    public static $benefitsAccFromId = "/api/spayxbenacc/benacc";
    public static $subscribeBenAcc = "/api/spayxbenacc/subscribe";
    public static $gains = "/api/spayxbenacc/advantages";
    public static $preview_acc_transfert = "/api/spayxop/preview/acctransf";
    public static $acc_transfert = "/api/spayxop/acctransf";
    public static $preview_non_acc_transfert = "/api/spayxop/preview/nonacctransf";
    public static $preview_international_transfert = "/api/spayxop/preview/internationaltransf";
    public static $non_acc_transfert = "/api/spayxop/nonacctransf";
    public static $international_transfert = "/api/spayxop/internationaltransf";
    public static $check_balance = "/api/spayxop/balance";
    public static $list_transactions = "/api/spayxop/webtransactions";
    public static $paginated_transactions = "/api/spayxop/paginatedtransactions";
    public static $user_info = "/api/spayxuser/infos";
    public static $change_password = "/api/spayxuser/changepsw";
    public static $switch_online_payment = "/api/spayxuser/payment/state/switch";
    public static $preview_deposit = "/api/spayxop/onlinedeposit";
    public static $preview_visa_deposit = "/api/spayxop/previewVisaDeposit";
    public static $request_to_pay = "/api/spayxop/deposit/requestpay";
    public static $momo_request_to_pay_status = "/api/spayxop/momo/requestpaystatus";
    public static $om_request_to_pay_status = "/api/spayxop/om/paymentstatus";
    public static $list_tv_subscription = "/api/spayxserv/tv/subscription/list";
    public static $list_tv_commands = "/api/spayxserv/tv/command/list";
    public static $list_tv_packages = "/api/spayxop/tvpackage";
    public static $create_tv_packages = "/api/spayxserv/tv/subscription/create";
    public static $delete_tv_packages = "/api/spayxserv/tv/subscription/delete";
    public static $pay_cplus = "/api/spayxop/paytvpackage";
    public static $list_camwater_subscription = "/api/spayxserv/camwater/subscription/list";
    public static $get_camwater_subscription = "/api/spayxserv/camwater/subscription/get";
    public static $delete_camwater_subscription = "/api/spayxserv/camwater/subscription/delete";
    public static $get_camwater_bill = "/api/spayxserv/camwater/bill/get";
    public static $get_camwater_payment_commissions = "/api/spayxserv/camwater/commissions/get";
    public static $create_camwater_subscription = "/api/spayxserv/camwater/subscription/create";
    public static $camwater_operation_pay = "/api/spayxserv/camwater/operation/pay";
    public static $get_camwater_payment_lastStep = "/api/spayxserv/camwater/payment/lastStep";
    public static $complete_payment = "/api/spayxserv/TV/complete_payment";
    public static $list_payment_modes = "/api/spayxserv/tv/subs/list/commission";
    public static $payment_modes = "/api/spayxserv/payment_mode/list";
    public static $withdrawal_modes = "/api/spayxop/paymentReceptionMethodes";
    public static $request_visa_deposit = "/api/spayxop/deposit/visarequest";

    public static $check_client_ip = 'https://api.ipify.org?format=json';
    public static $check_client_locaion = 'https://ip.nf/%s.json';
    public static $check_account = "/api/check_account_online";
    public static $getCom_inter_trans = "/api/spayxop/getComInterTrans";
    public static $have_sesampayx_account = "/api/have_account";
    public static $simpleSignup = "/api/spayxauth/signup/simpleSignup";
    public static $offline_preview_inter_trans = "/api/preview_no_account_international_transfert";

    // Module Dépenses - Catégories
    public static $list_categories = "/api/categorie";
    public static $create_category = "/api/categorie/creer";
    public static $update_category = "/api/categorie/update";
    public static $delete_category = "/api/categorie/delete";
    public static $show_category = "/api/categorie/show";


    public static function getApiServer(){
        return env("API_SERVER");
    }

    public static function getImageServer(){
        return env("IMAGE_SERVER");
    }

    public static function getRoute($relative_url){
        return static::getApiServer().$relative_url;
    }
}
