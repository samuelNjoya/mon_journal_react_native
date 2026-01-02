<?php

use App\RequestAPIClass;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::group(['middleware' => 'spx_n_auth'], function () {
    Route::get('/signup', function () {
        // $myIp = json_decode(file_get_contents(sprintf(RequestAPIClass::$check_client_ip)));
        // $ip = json_decode(file_get_contents(sprintf(RequestAPIClass::$check_client_locaion, $myIp->ip)));
        // $country_code = $ip->ip->country_code;
        $country_code = "cm";
        return view('authentication.signup', compact("country_code"));
    })->name('spx.signup');
    Route::post('/signup', "AuthController@signUp")->name("spx.signup.validate");
    //Route::post('/signup/image', "AuthController@signUpImageTest")->name("spx.signup.image.upload");
    Route::post('/genauthcode', "AuthController@generateAuthCode")->name("spx.signup.genauthcode");
    Route::post('/valauthcode', "AuthController@validateAuthCode")->name("spx.signup.valauthcode");

    Route::get('/signin', function () {
        // $myIp = json_decode(file_get_contents(sprintf(RequestAPIClass::$check_client_ip)));
        // $ip = json_decode(file_get_contents(sprintf(RequestAPIClass::$check_client_locaion, $myIp->ip)));
        // $country_code = $ip->ip->country_code;
         $country_code = "cm";
        return view('authentication.login', compact("country_code"));
    })->name('spx.signin');
    Route::post('/signin', "AuthController@signIn")->name("spx.signin.validate");

    Route::get('/forgotpsw', function () {
        $myIp = json_decode(file_get_contents(sprintf(RequestAPIClass::$check_client_ip)));
        $ip = json_decode(file_get_contents(sprintf(RequestAPIClass::$check_client_locaion, $myIp->ip)));
        $country_code = $ip->ip->country_code;
        return view('authentication.forgot_password', compact("country_code"));
    })->name('spx.get.forgotpsw');
    Route::post('/recov/questions', "AuthController@getRecoveryQuestions")->name("spx.recov.questions");
    Route::post('/recov/code', "AuthController@getRecoveryCode")->name("spx.recov.code");
    Route::post('/recov/password', "AuthController@recoverPassword")->name("spx.recov.password");
    Route::group(['middleware' => 'spx_inter'], function () {
        Route::get('/international_customers','TransfertInternationalController@chooseOperation')->name('spx.choose.operation.to.do');
        Route::get('/transfert_international','TransfertInternationalController@getFirstStepForm')->name('spx.get.inter_trans_form');
    });

    Route::get('/transfert_international/have_account','TransfertInternationalController@haveSesampayxAccount')->name('spx.check.sesampayxAccount');
    Route::get('/transfert_international/auth_user','TransfertInternationalController@authUserforTransInter')->name('spx.op.preview.connect_user_for_inter_trans');

});



Route::group(['middleware' => 'spx_auth'], function () {
    Route::get('/', "HomeController@home")->name('spx.home');
    Route::get('/defaultPassword', "HomeController@defaultPassword")->name('spx.defaultPassword');
    Route::get('/logout', "AuthController@logout")->name('spx.logout');

    Route::group(['prefix' => 'benacc'], function () {
        Route::get('/list', "BenAccController@list")->name('spx.benacc.getlist');
        Route::get('/getpay', "BenAccController@getPay")->name('spx.benacc.get.pay');
        Route::post('/pay', "BenAccController@payBenAcc")->name('spx.benacc.post.pay');
    });

    Route::group(['prefix' => 'assistance'], function () {
        Route::get('/tickets', 'AssistController@getTickets')->name('spx.assist.get.tickets');
        Route::get('/faq', 'AssistController@getFaq')->name('spx.assist.get.faq');
        Route::get('/announces', 'AssistController@getAnnounces')->name('spx.assist.get.announces');
    });

    Route::group(['prefix' => 'settings'], function () {
        Route::get('/account', 'AccountController@getAccountView')->name('spx.settings.get.account');
        Route::get('/personalinfo', 'AccountController@getPersonnalInfoView')->name('spx.settings.get.personalinfo');
        Route::get('/changepp', 'AccountController@changePassword')->name('spx.settings.get.change_password');
        Route::post('/submitcpp', 'AccountController@submitChangePassword')->name('spx.settings.post.change_password');
        Route::post('/switcht/online/payment', 'AccountController@switchOnlinePayment')->name('spx.settings.switch.online_payment');
    });

    Route::group(['prefix' => 'operation'], function () {
        Route::get('/list', 'OperationController@listTransactions')->name('spx.op.get.list_transactions');
    });
    Route::group(['prefix' => 'service'], function () {
        Route::get('/cplus_home', 'ServiceController@getHomeCplus')->name('spx.serv.get.home_cplus');
        Route::get('/camwater_home', 'CamwaterServiceController@getHomeCamwater')->name('spx.serv.get.home_camwater');
    });
});
Route::get('/internationaltransfertStep1', 'OperationController@getInternationalTransfert1')->name('spx.op.get.international_transfert1');
Route::post('/checkAccount', 'OperationController@noConnectedCheckAccount')->name('spx.op.preview.noconnectedcheckAccount');
Route::group(['middleware' => 'spx_js_auth'], function () {

    Route::get('/transact/home', "HomeController@homelistTransactions")->name('spx.home.transactions');
    Route::get('/gains/home', "HomeController@homeAdvantage")->name('spx.home.gains');

    Route::group(['prefix' => 'operation'], function () {
        Route::get('/acctransfert', 'OperationController@getaccountTransfert')->name('spx.op.get.account_transfert');
        Route::get('/nonacctransfert', 'OperationController@getNonaccountTransfert')->name('spx.op.get.nonaccount_transfert');

        Route::get('/balance/get', 'OperationController@getBalance')->name('spx.op.get.balance');
        Route::get('/deposit', 'OperationController@getDeposit')->name('spx.op.get.deposit');
        Route::get('/visa/deposit', 'OperationController@getVisaDeposit')->name('spx.op.get.visa.deposit');
        Route::post('/checkAccount', 'OperationController@checkAccount')->name('spx.op.preview.checkAccount');
        Route::post('/getcom_inter_traans','OperationController@getComInterTrans')->name('spx.op.post.com_inter_trans');
        Route::get('/internationaltransfert', 'OperationController@getInternationalTransfert')->name('spx.op.get.international_transfert');
        Route::post('/paginated_transact', 'OperationController@paginatedTransactions')->name('spx.op.get.paginated_transactions');
        Route::post('/balance/check', 'OperationController@postCheckBalance')->name('spx.op.post.balance');
        Route::post('/preview/acctransfert', 'OperationController@previewAccountTransfert')->name('spx.op.preview.account_transfert');
        Route::post('/acctransfert', 'OperationController@postAccountTransfert')->name('spx.op.post.account_transfert');
        Route::post('/preview/nonacctransfert', 'OperationController@previewNonAccountTransfert')->name('spx.op.preview.nonaccount_transfert');
        Route::post('/preview/internationaltransfert', 'OperationController@previewInternationalTransfert')->name('spx.op.preview.international_transfert');
        Route::post('/nonacctransfert', 'OperationController@postNonAccountTransfert')->name('spx.op.post.nonaccount_transfert');
        Route::post('/internationaltransfert', 'OperationController@postInternationalTransfert')->name('spx.op.post.international_transfert');

        Route::post('/preview/deposit', 'OperationController@previewDeposit')->name('spx.op.post.preview.deposit');
        Route::post('/preview/visa/deposit', 'OperationController@previewVisaDeposit')->name('spx.op.post.preview.visa.deposit');

        Route::post('/momo/requestpay', 'OperationController@requestToPay')->name('spx.op.post.requestpay');
        Route::post('/momo/requestvisadeposit', 'OperationController@requestVisaDeposit')->name('spx.op.post.requestVisaDeposit');
        Route::post('/momo/statusrequestpay', 'OperationController@requestToPayStatus')->name('spx.op.post.requestpaystatus');
    });


    Route::group(['prefix' => 'service'], function () {
        Route::get('/list/tv/subscriptions', 'ServiceController@listTvSubscriptions')->name('spx.serv.get.tv_subscriptions');
        Route::get('/list/tv/commands', 'ServiceController@listTvCommands')->name('spx.serv.get.tv_commands');
        Route::get('/list/tv/packages', 'ServiceController@listTvPackages')->name('spx.serv.get.tv_packages');
        Route::post('/create/tv/subscription', 'ServiceController@saveTVSubscription')->name('spx.serv.create.tv_subscription');
        Route::post('/delete/tv/subscription', 'ServiceController@deleteTvSubscription')->name('spx.serv.delete.tv_subscription');
        Route::post('/payment/modes', 'ServiceController@getPaymentMode')->name('spx.serv.payment_mode');
        Route::post('/cplus/pay', 'ServiceController@payCplus')->name('spx.serv.cplus.pay');
    });

    Route::group(['prefix' => 'service'], function () {

        Route::get('/list/camwater/subscriptions', 'CamwaterServiceController@listSubscriptions')->name('spx.serv.get.camwater_subscriptions');
        Route::post('/create/camwater/subscription', 'CamwaterServiceController@saveCamwaterSubscription')->name('spx.serv.create.camwater_subscription');
        Route::post('/camwater/subscription/edit','CamwaterServiceController@editSubscription')->name('spx.serv.edit.camwater_subscription');
        Route::post('/delete/camwater/subscription', 'CamwaterServiceController@deleteSubscription')->name('spx.serv.delete.camwater_subscription');
        Route::post('/payment-form/get','CamwaterServiceController@getPaymentForm')->name('spx.serv.get.camwater_payment_form');
        Route::post('/camwater/payment/commissions/get','CamwaterServiceController@getCommissions')->name('spx.serv.get.camwater_payment_commissions');
        Route::post('/camwater/payment/last_step', 'CamwaterServiceController@lastStep')->name('spx.serv.get.camwater_payment_lastStep');
        /*Route::get('/list/tv/packages', 'ServiceController@listTvPackages')->name('spx.serv.get.tv_packages');
        Route::post('/delete/tv/subscription', 'ServiceController@deleteTvSubscription')->name('spx.serv.delete.tv_subscription');*/
        Route::post('/camwater/operation/pay', 'CamwaterServiceController@payCamwaterBill')->name('spx.serv.camwater.pay');
    });

    // Catégories
    // Route::group(['prefix' => 'categories'], function () {
    //     Route::get('/list', 'DepenseModule_Controller\CategoryController@index')->name('depense.categories.index');
    //     Route::get('/creer', 'DepenseModule_Controller\CategoryController@create')->name('depense.categories.create');
    //     Route::post('/creer', 'DepenseModule_Controller\CategoryController@store')->name('depense.categories.store');
    //     Route::get('/{id}/modifier', 'DepenseModule_Controller\CategoryController@edit')->name('depense.categories.edit');
    //     Route::post('/{id}/modifier', 'DepenseModule_Controller\CategoryController@update')->name('depense.categories.update');
    //     Route::post('/{id}/supprimer', 'DepenseModule_Controller\CategoryController@destroy')->name('depense.categories.delete');
    //     Route::get('/api/toutes', 'DepenseModule_Controller\CategoryController@getAll')->name('depense.categories.api.all');

    //     //test
    // });

    // Routes pour la gestion des catégories
     Route::group(['prefix' => 'categories'], function () {
        Route::get('/list', 'DepenseModule_Controller\CategoryController@getAllCategories')->name('categories.list');
        Route::post('/create', 'DepenseModule_Controller\CategoryController@createCategory')->name('categories.create');
        Route::post('/update', 'DepenseModule_Controller\CategoryController@updateCategory')->name('categories.update');
        Route::post('/delete', 'DepenseModule_Controller\CategoryController@deleteCategory')->name('categories.delete');
      });

    Route::get('/dashboard', 'DepenseModule_Controller\DashboardController@index')->name('dashboard.index');
    Route::get('/dashboard/expenses/data', 'DepenseModule_Controller\DashboardExpenseController@getDashboardData')->name('dashboard.expenses.data');
    Route::get('/dashboard/expenses/budget-category-filter', 'DepenseModule_Controller\DashboardExpenseController@getBudgetCategoryFilter')->name('dashboard.expenses.budget.category.filter');

    // Historique des dépenses
    Route::group(['prefix' => 'expenses'], function () {
        Route::get('/history', 'DepenseModule_Controller\ExpenseController@index')->name('expenses.history');
        Route::get('/list', 'DepenseModule_Controller\ExpenseController@getExpenses')->name('expenses.list');
        Route::get('/budgets', 'DepenseModule_Controller\ExpenseController@getBudgets')->name('expenses.budgets');
        Route::get('/categories', 'DepenseModule_Controller\ExpenseController@getCategories')->name('expenses.categories');
         Route::post('/creer', 'DepenseModule_Controller\ExpenseController@createExpense')->name('expenses.create');
        Route::post('/delete', 'DepenseModule_Controller\ExpenseController@deleteExpense')->name('expenses.delete');
        Route::post('/duplicate', 'DepenseModule_Controller\ExpenseController@duplicateExpense')->name('expenses.duplicate');
        Route::post('/stop-recurring', 'DepenseModule_Controller\ExpenseController@stopRecurring')->name('expenses.stop-recurring');
    });

});
Route::get('/transfert_international/getcom_offline_inter_trans','TransfertInternationalController@getComOfflineInterTrans')->name('spx.op.post.com_offline_inter_trans');
Route::post('/offline_internationaltransfert', 'TransfertInternationalController@postOfflineInternationalTransfert')->name('spx.op.post.offline_international_transfert');

