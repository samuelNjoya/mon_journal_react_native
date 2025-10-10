<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([
    "prefix" => 'admin',
    'middleware' => ["cors"]
], function(){
    Route::post('connect','Auth\LoginController@connexion')->name('admin.connexion');
});

Route::get('api/test', 'TestController@test');
Route::group(['prefix' => 'spayxauth', 'middleware' => 'api_set_language'], function () {
    Route::group(['middleware' => ['guest:api']], function () {
        Route::post('login', 'Api\AuthController@login')->name('login');
        Route::get('login', 'Api\AuthController@login')->name('login');
        Route::group(['prefix' => 'signup'], function () {
            Route::post('generatecode', 'Api\AuthController@generateSignUpAuthCode')->middleware('api_verify_data:auth_signup_generatecode');
            Route::post('signupMobilePart1', 'Api\AuthController@signupMobilePArt1');
            Route::post('validatecode', 'Api\AuthController@validateSignUpAuthCode');
            Route::post('signup', 'Api\AuthController@signup')->middleware('api_verify_data:auth_signup');
            Route::post('simpleSignup', 'Api\AuthController@simpleSignup')->middleware('api_verify_data:auth_simpleSgnup');
        });

        Route::post('getrecovquest', 'Api\AuthController@getRecoveryQuestions')
            ->middleware('api_verify_data:auth_getrecovquest');
        Route::post('sendrecovcode', 'Api\AuthController@sendRecovCode')
            ->middleware('api_verify_data:auth_sendrecovcode');
        Route::post('recovpass', 'Api\AuthController@recoverypassword')
            ->middleware('api_verify_data:auth_recovpass');
    });
    Route::group(['middleware' => 'auth:api'], function () {
        Route::post('logout', 'Api\AuthController@logout');
    });
});
Route::group(['prefix' => 'spayxop'], function () {
    Route::post('getStandardCommissions', 'Api\OperationController@getCommission')
        ->middleware(['api_verify_data:spayxop_getStandardCom']);
});
Route::group(['prefix' => 'spayxop'], function () {
    Route::post('paymentReceptionMethodes', 'Api\OperationController@getPaymentReceptionMethod');
});
Route::group(['prefix' => 'spayxop'], function () {
    Route::post('getComInterTrans', 'Api\OperationController@getCommissionsInterTransf')
        ->middleware(['api_verify_data:spayxop_getStandardCom']);
});

Route::group(['middleware' => ['auth:api', 'api_set_language', 'api_verify_user_integrity', 'api_verify_session_token']], function () {

    Route::post('spayxhome', 'Api\HomeController@home')
        ->middleware(['api_verify_data:spayx_home']);

    Route::post('spayxwebhome', 'Api\HomeController@webHome')
        ->middleware(['api_verify_data:spayx_home']);

    Route::group(['middleware' => ['api_verify_password_user']], function () {

        Route::post('defaultPassword', 'Api\HomeController@defaultPassword'); //Cette route est utilisé pour checker si le mot de passe de l'utilisatuer est = 0000 après le chargement de la Home page


        Route::post('spayxtransaction/webhome', 'Api\HomeController@homeLastTransactions')
            ->middleware(['api_verify_data:spayx_home']);
        Route::post('spayxadvantage/webhome', 'Api\HomeController@homeAdvantages')
            ->middleware(['api_verify_data:spayx_home']);


        Route::group(['prefix' => 'spayxop'], function () {
            Route::post('getcom', 'Api\OperationController@getCommission')
                ->middleware(['api_verify_data:spayxop_getcom']);
            Route::post('preview/acctransf', 'Api\OperationController@previewAccTransfert')
                ->middleware(['api_verify_data:spayxop_prev_acctransf']);
            Route::post('acctransf', 'Api\OperationController@accountTransfert')
                ->middleware(['api_verify_data:spayxop_acctransf']);
            Route::post('preview/nonacctransf', 'Api\OperationController@previewNonAccountTransfert')
                ->middleware(['api_verify_data:spayxop_prev_nonacctransf']);
            Route::post('nonacctransf', 'Api\OperationController@nonAccountTransfert')
                ->middleware(['api_verify_data:spayxop_nonacctransf']);
            Route::post('preview/internationaltransf', 'Api\OperationController@previewInternationalTransfert')
                ->middleware(['api_verify_data:spayxop_prev_nonacctransf']);
            Route::post('internationaltransf', 'Api\OperationController@internationalTransfert')
                ->middleware(['api_verify_data:spayxop_nonacctransf']);
            Route::post('confirmwithdraw', 'Api\OperationController@confirmWithdraw')
                ->middleware(['api_verify_data:spayxop_confwithdraw']);
            Route::post('balance', 'Api\OperationController@verfyBalance')
                ->middleware(['api_verify_data:spayxop_balance']);
            Route::post('transactions', 'Api\OperationController@listTransactions')
                ->middleware(['api_verify_data:spayxop_transactions']);
            Route::post('webtransactions', 'Api\OperationController@listWebTransactions')
                ->middleware(['api_verify_data:spayxop_web_transactions']);
            Route::post('paginatedtransactions', 'Api\OperationController@paginatedTransactions')
                ->middleware(['api_verify_data:spayxop_paginatedtransactions']);
            Route::post('onlinedeposit', 'Api\OperationController@onlinedeposit')
                ->middleware(['api_verify_data:spayxop_onlinedeposit']);
            Route::post('previewVisaDeposit', 'Api\OperationController@previewVisaDeposit')
                ->middleware(['api_verify_data:spayxop_onlinedeposit']);
            Route::post('deposit/requestpay', 'Api\OperationController@requestpay')
                ->middleware(['api_verify_data:spayxop_requestpay']);
            Route::post('deposit/visarequest', 'Api\OperationController@RequestToMakeVisaDeposit')
                ->middleware(['api_verify_data:spayxop_requestpay']);
            Route::post('tvpackage', 'Api\OperationController@tvPackages')
                ->middleware(['api_verify_data:spayxop_tvpackage']);
            Route::post('paytvpackage', 'Api\OperationController@payTVPackages')
                ->middleware(['api_verify_data:spayxop_paytvpackage']);
            Route::post('momo/requestpaystatus', 'Api\OperationController@momoRequestPayStatus')
                ->middleware(['api_verify_data:spayxop_requestpaystatus']);
            Route::post('om/paymentstatus', 'Api\OperationController@omPaymentStatus')
                ->middleware(['api_verify_data:spayxop_requestpaystatus']);

        });
        Route::group(['prefix' => 'spayxserv'], function () {
            Route::post('tv/subscription/list', 'Api\ServiceController@tvListSubscription')
                ->middleware(['api_verify_data:spayxserv_listsubsc']);
            Route::post('tv/subs/list/commission', 'Api\ServiceController@packageCommissions')
                ->middleware(['api_verify_data:spayxserv_listsubsccommission']);
            Route::post('tv/subscription/create', 'Api\ServiceController@createTVSubscription')
                ->middleware(['api_verify_data:spayxserv_createsubsc']);
            Route::post('tv/subscription/edit', 'Api\ServiceController@editTVSubscription')
                ->middleware(['api_verify_data:spayxserv_editsubsc']);
            Route::post('tv/subscription/delete', 'Api\ServiceController@deleteTVSubscription')
                ->middleware(['api_verify_data:spayxserv_deletesubsc']);
            Route::post('tv/command/list', 'Api\ServiceController@listTvCommands')
                ->middleware(['api_verify_data:spayxserv_listtvcommand']);
            Route::post('payment_mode/list','Api\ServiceController@getPaymentMode')->middleware(['api_verify_data:spayxserv_listtvcommand']);
        });
        Route::group(['prefix' => 'spayxeneo'], function () {
            Route::post('eneo/contract/list', 'Api\Service\EneoController@listContractNumber')
                ->middleware(['api_verify_data:spayxeneo_contractlist']);
            Route::post('eneo/contract/create', 'Api\Service\EneoController@createContractNumber')
                ->middleware(['api_verify_data:spayxeneo_contractcreate']);
            Route::post('eneo/contract/edit', 'Api\Service\EneoController@editContractNumber')
                ->middleware(['api_verify_data:spayxeneo_contractedit']);
            Route::post('eneo/contract/delete', 'Api\Service\EneoController@deleteContractNumber')
                ->middleware(['api_verify_data:spayxeneo_contractdelete']);
            Route::post('eneo/searchbill', 'Api\Service\EneoController@searchBill')
                ->middleware(['api_verify_data:spayxeneo_billsearch']);
            Route::post('eneo/bill/pay', 'Api\Service\EneoController@payEneoBill')
                ->middleware(['api_verify_data:spayxeneo_billpay']);
            Route::post('eneo/list/command', 'Api\Service\EneoController@listPaidInvoices')
                ->middleware(['api_verify_data:spayxeneo_list_commands']);
            Route::post('eneo/bill/commission', 'Api\Service\EneoController@getEneoCommission')
                ->middleware(['api_verify_data:spayxop_getcom']);
            Route::post('eneo/bill/invoice', 'Api\Service\EneoController@printEneoInvoice')
                ->middleware(['api_verify_data:spayxeneo_bill_invoice']);
        });

        Route::group(['prefix' => 'spayxserv'], function () {
            Route::post('camwater/subscription/list', 'Api\Service\ServiceCamwaterController@listSubscription')
                ->middleware(['api_verify_data:spayxserv_listsubsc']);
            Route::post('camwater/subscription/create', 'Api\Service\ServiceCamwaterController@createCamwaterSubscription')
                ->middleware(['api_verify_data:spayxserv_createcamwatersubsc']);
            Route::post('camwater/subscription/delete', 'Api\Service\ServiceCamwaterController@deleteCamwaterSubscription')
                ->middleware(['api_verify_data:spayxserv_deletecamwatersubsc']);
            Route::post('camwater/subscription/edit', 'Api\Service\ServiceCamwaterController@editCamwaterSubscription')
                ->middleware(['api_verify_data:spayxserv_editcamwatersubsc']);
            Route::post('camwater/commissions/get', 'Api\Service\ServiceCamwaterController@getCommissions')
                ->middleware(['api_verify_data:spayxserv_camwaterpaycommisions']);
            Route::post('camwater/subscription/get','Api\Service\ServiceCamwaterController@getSusbcription')
                ->middleware(['api_verify_data:spayxserv_getsubscription']);
            Route::post('camwater/bill/get','Api\Service\ServiceCamwaterController@getBill')
                ->middleware(['api_verify_data:spayxserv_getsubscription']);
            Route::post('camwater/operation/pay', 'Api\Service\ServiceCamwaterController@savePay')
                ->middleware(['api_verify_data:spayserv_billpay']);
            Route::post('/camwater/payment/lastStep','Api\Service\ServiceCamwaterController@getLastStep')
                ->middleware(['api_verify_data:spayxserv_camwaterpaycommisions']);
        });


        Route::group(['prefix' => 'spayxbenacc'], function () {
            Route::post('advantages', 'Api\BenAccController@custommerAdvantages')
                ->middleware(['api_verify_data:benacc_advantages']);
            Route::post('list', 'Api\BenAccController@listBenAcc')
                ->middleware(['api_verify_data:benacc_list']);
            Route::post('subscribe', 'Api\BenAccController@subscribeBenefit')
                ->middleware(['api_verify_data:benacc_subscribe']);
            Route::post('listsubscript', 'Api\BenAccController@listBenAccSubscriptions')
                ->middleware(['api_verify_data:benacc_listsubscript']);
            Route::post('benacc', 'Api\BenAccController@benacc')
                ->middleware(['api_verify_data:benacc_benacc']);
        });

        Route::group(['prefix' => 'spayxassist'], function () {
            Route::post('listcat', 'Api\AssistanceController@listCategories')
                ->middleware(['api_verify_data:spayxassist_listcat']);
            Route::group(['prefix' => 'ticket'], function () {
                Route::post('create', 'Api\AssistanceController@createTicket')
                    ->middleware(['api_verify_data:spayxassist_ticket_create']);
                Route::post('list', 'Api\AssistanceController@listTickets')
                    ->middleware(['api_verify_data:spayxassist_ticket_list']);
            });
            Route::group(['prefix' => 'message'], function () {
                Route::post('list', 'Api\AssistanceController@listMessages')
                    ->middleware(['api_verify_data:spayxassist_message_list']);
                Route::post('sendtext', 'Api\AssistanceController@sendTextMessage')
                    ->middleware(['api_verify_data:spayxassist_message_sendtext']);
            });
            Route::group(['prefix' => 'agency'], function () {
                Route::post('list', 'Api\AssistanceController@listAgencies')
                    ->middleware(['api_verify_data:spayxassist_agency_list']);
            });
            Route::group(['prefix' => 'announcement'], function () {
                Route::post('list', 'Api\AnnouncementController@listAnnouncement')
                    ->middleware(['api_verify_data:spayxassist_announcement_list']);
            });
        });
    });



    Route::group(['prefix' => 'spayxuser'], function () {
        Route::post('infos', 'Api\UserController@userInfos')
            ->middleware(['api_verify_data:user_infos']);
        Route::post('discsession', 'Api\UserController@disconnectSession')
            ->middleware(['api_verify_data:spayxuser_discsession']);
        Route::post('changepsw', 'Api\UserController@changepassword')
            ->middleware(['api_verify_data:spayxuser_changepsw']);
        Route::post('updatepp', 'Api\UserController@updateProfilePicture')
            ->middleware(['api_verify_data:spayxuser_updatepp']);
        Route::post('savemedia', 'Api\UserController@saveMediaAfterSignUp')
            ->middleware(['api_verify_data:spayxuser_savemedia']);
        Route::post('payment/state/switch', 'Api\UserController@switchOnlinePaymentState')
            ->middleware(['api_verify_data:spayxuser_sopayment']);
    });
});

Route::post('visa_card_request_config', 'Api\HomeController@getVisaCardRequestConfig');

Route::post('have_account', 'Api\OperationController@have_account');
Route::post('check_inter_transfert', 'Api\HomeController@checkInternationalTransfert');
Route::post('preview_no_account_international_transfert', 'Api\OperationController@previewNoAccountInternationalTransfert');
Route::post('check_account', 'Api\OperationController@check_account');
Route::post('check_account_online', 'Api\OperationController@check_account_online');
Route::get('callbackvisa', 'Api\OperationController@callback_visa');
Route::get("callbackvisa_international/{id_online_cash_register}", 'Api\OperationController@callback_visa_international')->name("callbackvisa_international");
Route::post('callback_momo', 'Api\OperationController@callback_momo');
Route::post('callback_om', 'Api\OperationController@callback_om');
Route::post('renewbenaccounts', 'Api\BenAccController@renewBenAccounts');
Route::get('momo/requesttopay/status', 'Api\OperationController@automaticmomoRequestPayStatus');
Route::get('depositCallback', 'Api\OperationController@depositCallback')->name('depositCallback');
Route::get('pdfview','PdfController@createPdf');
//script
Route::get('adjustAccountNumber', 'Api\AuthController@adjustAccountNumber');



Route::group(['prefix' => 'catagorie'], function () {
   Route::group(['middleware' => ['auth:api', 'api_set_language', 'api_verify_user_integrity', 'api_verify_session_token']], function () {
        Route::get('/', 'Api\CategorieDpsController@index')->name('categorie-dps.index');
        Route::get('/show', 'Api\CategorieDpsController@show')->name('categorie-dps.show');
        Route::post('/creer', 'Api\CategorieDpsController@store')->name('categorie-dps.store');
        Route::post('/update', 'Api\CategorieDpsController@update')->name('categorie-dps.update');
        Route::post('/delete', 'Api\CategorieDpsController@destroy')->name('categorie-dps.destroy');
    });

});

Route::group(['prefix' => 'depenses'], function () {
   Route::group(['middleware' => ['auth:api', 'api_set_language', 'api_verify_user_integrity', 'api_verify_session_token']], function () {
        Route::get('/', 'Api\DepensesController@index')->name('depenses.index');
        Route::get('/show', 'Api\DepensesController@show')->name('depenses.show');
        Route::post('/creer', 'Api\DepensesController@store')->name('depenses.store');
        Route::post('/update', 'Api\DepensesController@update')->name('depenses.update');
        Route::post('/delete', 'Api\DepensesController@destroy')->name('depenses.destroy');

        Route::post('/dps_repetitive', 'Api\DepensesController@genererDepenseRepetitive')->name('depenses.repetitive');
        Route::post('/dupliquer_dps', 'Api\DepensesController@dupliquerrDepense')->name('depenses.dupliquer');

        Route::get('/statistique', 'Api\DepenseModule_Controller\StatistiquesController@getStats')->name('depenses.stats');

        Route::get('/transactions', 'Api\DepenseModule_Controller\TransactionOperationController@getTransactionsWithAmount');

        Route::post('/link_transaction', 'Api\DepenseModule_Controller\TransactionOperationController@linkTransactionAsDepense');

    });

});
