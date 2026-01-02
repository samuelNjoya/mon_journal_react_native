<?php

namespace App\Http\Middleware\Spayx;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\RequestAPIClass;

class AuthenticationMiddleware
{


    public function handle( $request,  $next)
    {
        //si on ne trouve pas les deux token dans les cookies
        if (Session::get('accessToken')== null || $request->cookie('sessionToken')== null){
            $myIp = json_decode(file_get_contents(sprintf(RequestAPIClass::$check_client_ip)));
            $ip = json_decode(file_get_contents(sprintf(RequestAPIClass::$check_client_locaion, $myIp->ip)));
            $country_code = $ip->ip->country_code;
            //si on ne trouve pas les deux token dans les cookies
            /*if ($country_code!="CM"){
                return redirect()->route('spx.choose.operation.to.do');
            }*/
            return redirect()->route('spx.signin');
        }
        return $next($request);
    }
}
