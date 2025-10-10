<?php

namespace App\Http\Middleware\Api;

use App\Helpers\Api\AuthenticationHelper;
use App\Models\UserManagement\Privileges;
use App\Models\UserManagement\Session;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;
use Closure;
use RuntimeException;

class VerifySessionToken
{
    use AuthenticationHelper;
    private $err_code = "LOGOUT-VT-";
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $err_code_function = "HST";

        try{
            $fair_user = $request->fair_user;
            $session = Session::where('token','=',$request->input("sessionToken"))
                ->where('id_account','=',$fair_user['account']->id_account)
                ->first();

            if (!$session){
                $response['status'] = 0;
                $response['err_title'] = __('api_middleware.error');
                $response['err_msg'] =  __('api_middleware.cannot_get_session');
                $response['err_code'] = $this->err_code.$err_code_function."1";
                return response()->json($response, 404);
            }
            if (!$session->is_session_active){
                $response['status'] = 0;
                $response['err_title'] = __('api_middleware.error');
                $response['err_msg'] = __('api_middleware.inactive_session');
                $response['err_code'] = $this->err_code.$err_code_function."2";
                return response()->json($response, 404);
            }//verifier si le beneficiaire a le droit de consulter son code
            if(!$this->doesAccountHavePrivilege($fair_user['customer_account']->id_account_state,Privileges::$ACCESS_PLATFORM)){
                $response['status'] = 0;
                $response['err_title'] = __('api_middleware.restrict_rights');
                $response['err_msg'] = __('api_middleware.restrict_rights_msg');
                $response['err_code'] = $this->err_code.$err_code_function."3";
                return response()->json($response, 404);
            }

            return $next($request);

        }catch (\Exception $exception){
            Bugsnag::notifyException(new RuntimeException($exception));
            $response['status'] = 0;
            $response['err_title'] = __('api_auth.server_error_title');
            $response['err_msg'] = __('api_auth.server_error_msg');
            $response['err_code'] = $this->err_code.$err_code_function."EX";

            return $this->sendError($response,500);
        }


    }
}
