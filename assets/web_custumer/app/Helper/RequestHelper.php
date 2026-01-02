<?php

if (!function_exists('spx_format_image_url')){
    function spx_format_image_url($url){
        return \App\RequestAPIClass::getImageServer()."/".$url;
    }
}
if (!function_exists('spx_get_host')){
    function spx_get_host($request){
        $host["hostname"]=$request->header('User-Agent');
        $host["host_platform"]=$request->header('User-Agent');
        $host["host_os"]=$request->header('User-Agent');
        $host["app_version"]="1";

        return $host;
    }
}

if (!function_exists('spx_post_request')){
    function spx_post_request($url,$params=[]){

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($params));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER,
            array(
                "Content-Type:application/json"
            )
        );

        $server_output = curl_exec($ch);

        curl_close ($ch);

        return json_decode($server_output);

    }
}

if (!function_exists('spx_get_request')){
    function spx_get_request($url,$params=[]){

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($_SERVER["REMOTE_ADDR"]));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER,
            array(
                "Content-Type:application/json"
            )
        );

        $server_output = curl_exec($ch);

        curl_close ($ch);

        return json_decode($server_output);

    }
}
if (!function_exists('spx_post_auth_request')){
    function spx_post_auth_request($url,$token,$params=[]){
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS =>json_encode($params),
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json",
                "Authorization: Bearer $token"
            ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);

        //return $response;
        return json_decode($response);
    }
}

//ajouter pour les methodes gets
if (!function_exists('spx_get_auth_request')){
    function spx_get_auth_request($url, $token, $params = []){
        // Ajouter les paramètres à l'URL
        if (!empty($params)) {
            $url .= '?' . http_build_query($params);
        }

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET", // IMPORTANT: GET, pas POST
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json",
                "Authorization: Bearer $token",
                "Accept: application/json"
            ),
        ));

        $response = curl_exec($curl);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        curl_close($curl);

        // Log pour debug
        \Log::info("GET Request to: " . $url);
        \Log::info("Response Code: " . $httpCode);
        \Log::info("Response: " . substr($response, 0, 500));

        return json_decode($response);
    }
}


