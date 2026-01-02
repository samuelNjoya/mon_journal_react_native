<div class="row">
    <h6 style="flex:1">Commissions</h6>
    <div id="total_amount">
        <p style="flex:1; text-align: end;" >@if ($has_commission)<b style="color:#E6AF1C;"><ins> {{$fees->commission}} XAF</ins></b>
            @else <b style="color:#E6AF1C;">{{$fees->commission}} XAF</b>  @endif</p>
    </div>
</div>
<div class="row">
    <h6 style="flex:1">Montant net à payer</h6>
    <div id="total_amount">
        <p style="flex:1; text-align: end;" ><b style="color:#82BF44">{{$fees->total_amount}} XAF</b></p>
    </div>
</div>
