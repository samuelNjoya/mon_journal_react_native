<?php

namespace App\Http\Middleware\Api;

use App\Helpers\Api\AuthenticationHelper;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;
use Closure;
use RuntimeException;

class VerifyUserIntegrity
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
        $err_code_function = "HUI";
        try{

            $customer_account = $request->user();
            if(!$customer_account){
                $response['status'] = 0;
                $response['err_title'] = __('api_middleware.error');
                $response['err_msg'] = __('api_middleware.not_valid_account');
                $response['err_code'] = $this->err_code.$err_code_function."1";
                return response()->json($response, 404);
            }
            $fair_user = $this->userIntegrity($customer_account->phone_number,$err_code_function);
            if(!$fair_user['status']){
                $response['status'] = 0;
                $response['err_title'] = __('api_middleware.error');
                $response['err_msg'] = $fair_user['err_msg'];
                $response['err_code'] = $fair_user['err_code'];
                return response()->json($response, 404);
            }
            $request = $request->merge(["fair_user" => $fair_user]);

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
