<?php

use Carbon\Carbon;


if (! function_exists('spx_format_date')) {
    function spx_format_date($date) {
        return (new \Carbon\Carbon($date))->format('d.m.y');
    }
}

if (! function_exists('spx_set_selected_menu')) {
    function spx_set_selected_menu($code) {
        \Session::put("selected_menu", $code);
        \Session::save();
    }
}

if (! function_exists('spyx_aside_menu_state_class')) {
    function spyx_aside_menu_state_class($code) {
        return (\Session::get("selected_menu") == $code) ? "kt-menu__item--active" : "";
    }
}

function spx_format_float($value){
    if ($value==null){
        return 0;
    }else{
        return (float)$value;
    }
}
function spx_format_money($money){
    return $money;
}

function spx_format_money2($money)
{
    $money =  floatval(preg_replace("/[^-0-9\.]/","",$money));
    return number_format($money);
}

function spx_format_periods($periods){
    $p = [
        "labels"=>[],
        "values"=>[]
    ];
    $n_periods = count($periods);
    for ($i = 0; $i<$n_periods; $i++){
        $gains = spx_format_float($periods[$i]->total_price_before) - spx_format_float($periods[$i]->total_price_after);
        array_push($p["labels"],(new \Carbon\Carbon($periods[$i]->date))->format('d.m.y'));
        array_push($p["values"],$gains);
    }

    return $p;
}

function initiales($nom){
    $nom_initiale = ''; // déclare le recipient
    $n_mot = explode(" ",$nom);
    foreach($n_mot as $lettre){
        $nom_initiale .= $lettre[0];
    }
    return strtoupper($nom_initiale);
}

function renderAccountState($linked_ben_acc){
    if ($linked_ben_acc->last_subscription != null && $linked_ben_acc->last_subscription->is_subscription_active){
        $end_date = new Carbon($linked_ben_acc->last_subscription->end_date);

        if ($end_date->lessThan(Carbon::now())){
            return ["status"=>false,"msg"=>"Compte Inactif"];
        }else{
            return ["status"=>true,"msg"=>"Actif jusqu'au ".$end_date->format('d-m-Y à H:i:s')];;
        }
    }else{
        return ["status"=>false,"msg"=>"Compte Inactif"];
    }
}
function transactionPictures($op_code){
    switch ($op_code) {
        case "SOCASH_DEPOSIT":
        case "SO_DEPOSIT":
            return "./assets/media/custom/wallet.png";
        case "SO_WITHDRAW":
            return "./assets/media/custom/ic_remove.png";
        case "SO_TRSCUST":
            return "./assets/media/custom/ic_transfert_acc.png";
        case "SO_TRSNCUST":
            return "./assets/media/custom/ic_no_name.png";
        case "SOVM_DEPOSIT":
            return "./assets/media/custom/ic_credit_card.png";
        case "SOMTN_DEPOSIT":
            return "./assets/media/custom/ic_mtn_momo.png";
        case "SOOM_DEPOSIT":
            return "./assets/media/custom/ic_om.png";
        case "SOWI_DEPOSIT":
            return "./assets/media/custom/western.png";
        case "SO_PYBCANAL":
            return "./assets/media/custom/cplus.png";
        default:
            return "./assets/media/logos/logo_sesampayx.png";
    }
}
