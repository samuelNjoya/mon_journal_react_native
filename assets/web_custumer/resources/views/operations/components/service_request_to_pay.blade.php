<div class="kt-form" id="deposit_preview">
    <div class="row">
        <div class="col-2"></div>
        <div class="col-8">
            <div class="kt-portlet__head">
                <div class="kt-portlet__head-label row">
                    <div class="col-2">
                        @if($payment_mode == "MTNMOMO")
                            <img id="illustration" class="kt-widget7__img" src="./assets/media/custom/ic_mtn_momo.png" alt="" style="height:35px;">
                        @else
                            <img id="illustration" class="kt-widget7__img" src="./assets/media/logos/logo_sesampayx.png" alt="" style="height:35px;">
                        @endif
                    </div>
                    <div class="col-10">
                        <h6 class="kt-portlet__head-title">
                            @if($payment_mode == "MTNMOMO")
                                Paiement des factures Canal+ via MTN Mobile Money
                            @endif
                        </h6>
                    </div>

                </div>
            </div>
            <div style="padding: 16px;">

                <p>
                    @if($payment_mode == "MTNMOMO")
                        Un message de confirmation a été envoyé au numéro {{$phone_number}}, veuillez entrer *126# pour terminer la procedure
                    @endif
                    @if($payment_mode == "OM")
                        Un message de confirmation a été envoyé au numéro {{$phone_number}}, veuillez entrer #150*50#  pour terminer la procedure
                    @endif
                </p>
                <div style="padding: 16px;">
                    <div class="row">
                        <h7 style="color:black; flex:3">Montant:</h7>
                        <p style="flex:2; text-align: end">{{number_format((float)$amount,2)}} XAF</p>
                    </div>
                    <div class="row">
                        <h7 style="color:black; flex:3">Commission:</h7>
                        <p style="flex:2;text-align: end">{{number_format((float)$commission,2)}} XAF</p>
                    </div>
                    <div class="row">
                        <h7 style="color:black; flex:3">Frais de l'opérateur:</h7>
                        <p style="flex:2;text-align: end">{{number_format((float)$fees,2)}} XAF</p>
                    </div>
                    <div class="row">
                        <h7 style="color:black; flex:3">Total:</h7>
                        <p style="flex:2; text-align: end" >{{number_format((float)$total_amount,2)}} XAF</p>
                    </div>

                </div>

            </div>
        </div>
        <div class="col-2"></div>
    </div>
</div>
