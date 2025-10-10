<?php

namespace App\Http\Middleware\Api;

use Closure;
use Illuminate\Support\Facades\Hash;

class VerifyPassWordMiddleware
{

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $customer_account = $request->user();
        if (Hash::check("0000", $customer_account->password)) {
            $response['status'] = 5; //Statut permettent de savoir si le mot de passe de l'utilisateur est = 0000
            $response['err_title'] = __('api_middleware.edit_password');
            $response['err_msg'] =  __('api_middleware.edit_password_message');
            return response()->json($response, 404);
        }
        return $next($request);
    }
}
