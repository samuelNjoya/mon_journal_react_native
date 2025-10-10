<?php

namespace App\Models\CommissionManagement;

use App\Models\TransMod\PriceRange;
use Illuminate\Database\Eloquent\Model;

class StandardCommission extends Model
{
    public static $FIXED_COMMISSION = "FIXED_VALUE";
    public static $PERCENTAGE_COMMISSION = "PERCENTAGE";

    public static $ID_BEN_TYPE = 1;

    protected $table = 'commgt_standardcommission';
    protected $primaryKey = 'id_standard_commission';


    public function price_range(){
        return $this->belongsTo('App\Models\TransMod\PriceRange','id_price_range', 'id_price_range')
            ->where('deleted_at', '=',null);
    }

    public function customCommissionOfBenefit(){
        return $this->hasMany('App\Models\CommissionManagement\BenAccCommission','id_standard_commission','id_standard_commission')
            ->where('deleted_at', '=',null)
            ->where('id_type_ben_account','=',StandardCommission::$ID_BEN_TYPE);
    }

    public static function getAmountCommission($id_operation,$amount){

        $amout_range = PriceRange::getAmountRange($amount);
        $commission = StandardCommission::where('id_sesampayx_operation','=',$id_operation)
                                        ->where('id_price_range','=',$amout_range->id_price_range)
                                        ->where('deleted_at','=',null)
                                        ->first();

            if ($commission->type == self::$PERCENTAGE_COMMISSION)
                $commission->value = $amount*$commission->value;

            return $commission;
    }



}
