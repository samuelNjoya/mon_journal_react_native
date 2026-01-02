<div class="kt-form" id="deposit_preview">
    <div class="row">
        <div class="col-2"></div>
        <div class="col-8">
            <div class="kt-portlet__head">
                <div class="kt-portlet__head-label row">
                    <div class="col-2">
                        @if($payment_method == "MTN")
                            <img id="illustration" class="kt-widget7__img" src="./assets/media/custom/ic_mtn_momo.png" alt="" style="height:35px;">
                        @elseif($payment_method=="OM")
                            <img id="illustration" class="kt-widget7__img" src="./assets/media/custom/ic_om.png" alt="" style="height:35px;">
                        @elseif($payment_method=="VISA/MASTERCARD")
                            <img id="illustration" class="kt-widget7__img" src="./assets/media/custom/ic_credit_card.png" alt="" style="height:35px;">
                        @else
                            <img id="illustration" class="kt-widget7__img" src="./assets/media/logos/logo_sesampayx.png" alt="" style="height:35px;">
                        @endif
                    </div>
                    <div class="col-10">
                        <h6 class="kt-portlet__head-title">
                            @if($payment_method == "MTN")
                                Recharge du compte Sesame via MTN Mobile Money
                            @elseif($payment_method=="OM")
                                Recharge du compte Sesame via Orange Money
                            @elseif($payment_method=="VISA/MASTERCARD")
                                Recharge du compte Sesame via VISA ou MasterCard
                            @endif
                        </h6>
                    </div>

                </div>
            </div>
            <div style="padding: 16px;">
                <div class="row">
                    <h7 style="color:black; flex:3">Montant:</h7>
                    <p style="flex:1; text-align: end">{{number_format((float)$amount,2)}} XAF</p>
                </div>
                <div class="row">
                    <h7 style="color:black; flex:3">Commission:</h7>
                    <p style="flex:1;text-align: end">{{number_format((float)$commission,2)}} XAF</p>
                </div>
                <div class="row">
                    <h7 style="color:black; flex:3">Frais de l'opérateur:</h7>
                    <p style="flex:1;text-align: end">{{number_format((float)$fees,2)}} XAF</p>
                </div>
                <div class="row">
                    <h7 style="color:black; flex:3">Total:</h7>
                    <p style="flex:1; text-align: end" >{{number_format((float)$total,2)}} XAF</p>
                </div>

            </div>
            <div class="kt-portlet__foot">
                <div class="kt-form__actions">
                    <button class="btn btn-secondary" data-dismiss="modal" aria-label="Close" style="width:45%">Annuler</button>
                    <button class="btn btn-warning" id="#confirmdeposit" style="width:45%" onclick="confirmDeposit('{{$payment_method}}','{{$amount}}','{{$phone_number}}','{{$commission}}','{{$fees}}','{{$total}}','{{$url}}')">Valider</button>
                </div>
            </div>
        </div>
        <div class="col-2"></div>
    </div>
</div>

<script>
</script>
