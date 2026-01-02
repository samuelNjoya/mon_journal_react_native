<div class="kt-form" id="deposit_visa_preview">
    <div class="row">
        <div class="col-2"></div>
        <div class="col-8">
            <div class="kt-portlet__head">
                <div class="kt-portlet__head-label row">
                    <div class="col-2">
                        @if($payment_method == "MTNMOMO")
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
                            @if($payment_method == "MTNMOMO")
                                Recharge de la carte visa via MTN Mobile Money
                            @elseif($payment_method=="OM")
                                Recharge de la carte visa via Orange Money
                            @elseif($payment_method=="VISA/MASTERCARD")
                                Recharge de la carte visa via une carte VISA ou MasterCard
                            @elseif($payment_method=="SESAME")
                                Recharge de la carte visa via le compte SesamPayx
                            @endif
                        </h6>
                    </div>

                </div>
            </div>
            <div style="padding: 16px;">
                <div class="row">
                    <h7 style="color:black; flex:3; font-weight:500">Montant:</h7>
                    <p style="flex:1; text-align: end; font-weight:600;">{{number_format((float)$amount,2)}} XAF</p>
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
                    <h7 style="color:black; flex:3">Frais visa:</h7>
                    <p style="flex:1;text-align: end">{{number_format((float)$visa_fees,2)}} XAF</p>
                </div>
                <div class="row">
                    <h7 style="color:black; flex:3; font-weight:500">Total:</h7>
                    <p style="flex:1; text-align: end; font-weight:600;color:blue;" >{{number_format((float)$total,2)}} XAF</p>
                </div>

            </div>
			<div class="form-group">
				<label>Mot de passe </label>
				<div>
					<input type="password" name="password" class="form-control" id="password_confirm_visa_deposit_id" placeholder="Entrer le mot de passe pour confirmer l'operation" >
					<span style="color:red" id="password_confirm_visa_deposit_error_id"></span>
				</div>
			</div>
            <div class="kt-portlet__foot">
                <div class="kt-form__actions">
                    <button class="btn btn-secondary" data-dismiss="modal" aria-label="Close" style="width:48%">Annuler</button>
                    <button class="btn btn-warning" id="#confirmvisadeposit" style="width:50%" onclick="confirmVisaDeposit('{{$payment_method}}','{{$amount}}','{{$phone_number}}','{{$commission}}','{{$fees}}','{{$total}}','{{$card_number}}')">Valider</button>
                </div>
            </div>
        </div>
        <div class="col-2"></div>
    </div>
</div>

<script>
</script>
