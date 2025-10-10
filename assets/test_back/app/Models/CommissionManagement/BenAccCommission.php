<?php

namespace App\Models\CommissionManagement;

use App\Models\TransMod\PriceRange;
use Illuminate\Database\Eloquent\Model;

class BenAccCommission extends Model
{

    public static $FIXED_COMMISSION = "FIXED_VALUE";
    public static $PERCENTAGE_COMMISSION = "PERCENTAGE";
    public static $FIXED_REDUCTION_COMMISSION = "FIXED_REDUCTION_VALUE";
    public static $REDUCTION_PERCENTAGE_COMMISSION = "PERCENTAGE_REDUCTION";

    protected $table = 'commgt_benefitsacccommission';
    protected $primaryKey = 'id_ben_acc_commission';




    public static function getAmountCommission($id_type_ben_account,$standard_commission,$amount){

        $commission = BenAccCommission::where('id_standard_commission','=',$standard_commission->id_standard_commission)
            ->where('id_type_ben_account','=',$id_type_ben_account)
            ->where('deleted_at','=',null)
            ->first();

        switch ($commission->type){
            case self::$PERCENTAGE_COMMISSION:
                $commission->value = $amount*$commission->value;
                break;
            case self::$FIXED_REDUCTION_COMMISSION:
                $commission->value = $standard_commission->value - $commission->value;
                break;
            case self::$REDUCTION_PERCENTAGE_COMMISSION:
                $commission->value = $standard_commission->value - ($standard_commission->value*$commission->value);
                break;
        }

        return $commission;
    }
}
