<?php

namespace App\Http\Middleware\Spayx;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class NonAuthenticatedRouteMiddleware
{


    public function handle( $request,  $next)
    {
        //si on ne trouve pas les deux token dans les cookies
        if (Session::get('accessToken')== null || $request->cookie('sessionToken')== null){
            return $next($request);
        }
        return redirect()->route('spx.home');
    }
}
