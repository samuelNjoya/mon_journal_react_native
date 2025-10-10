<?php

namespace App\Http\Middleware\Api;

use App\Helpers\Api\VerifyDataHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Closure;

class VerifyDataMiddleware
{
    private $err_code = "VD-";
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */

    use VerifyDataHelper;

    public function handle(Request $request, Closure $next, $routeName)
    {
        $err_code_function = "H";
        $validator = Validator::make($request->all(), $this->validationData($request,$routeName));
        if($validator->fails()){
            $response['status'] = 0;
            $response['err_title'] =__('api_middleware.incorrect_datas');
            $response['err_msg'] = json_encode($validator->errors());
            $response['err_code'] = $this->err_code.$err_code_function."1";
            return response()->json($response, 404);
        }else{
            return $next($request);
        }
    }
}
