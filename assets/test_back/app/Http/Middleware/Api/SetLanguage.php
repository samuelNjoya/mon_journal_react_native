<?php

namespace App\Http\Middleware\Api;

use Closure;
use Illuminate\Support\Facades\App;

class SetLanguage
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
        $lan = $request->input('lan');
        if($lan=="fr"){
            App::setLocale("fr");
        }else{
            App::setLocale("en");
        }
        return $next($request);
    }
}
