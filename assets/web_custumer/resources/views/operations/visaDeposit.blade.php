
<form class="kt-form" id="deposit_visa_form">
    @csrf
    <div class="row">
        <div class="col-xl-2"></div>
        <div class="col-xl-8">
            <div class="kt-section kt-section--first">
                <div class="kt-section__body">
                    <div class="form-group">
                        <label>Identifiant de la carte(10 chiffres)</label>
                        <div>
                            <div class="input-group">
								<div class="input-group-prepend"><span class="input-group-text"><i class="la la-cc-visa" style="font-size:2.8rem;color:blue;"></i></span></div>
                                <input type="text" name="card_number" class="form-control" id="kt_inputmask_3" placeholder="Veuillez entrer le numero à 10 chiffres">
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <p>Veuillez selectionner le moyen de votre recharge</p>
                        <div class="kt-radio-list">
                            @foreach ($paymentMethod ?? [] as $method)
                            <label class="kt-radio" style="color:{{$method->color}}">
                                @if($method->value=="MTNMOMO")
                                <input type="radio" name="payment_method_visa" value="MTNMOMO"  checked="checked" >{{$method->label}}
                                @else
                                <input type="radio" name="payment_method_visa" value="{{$method->value}}">{{$method->label}}
                                @endif
                                <span></span>
                            </label>
                            @endforeach
                            <!--label class="kt-radio" style="color:#fddb2c">
                                <input type="radio" name="payment_method" value="MTN" checked="checked"> MTN Mobile Money
                                <span></span>
                            </label>
                            <label class="kt-radio" style="color: #ff8400">
                                <input type="radio" name="payment_method" value="OM"> Orange Money
                                <span></span>
                            </label>
                            <label class="kt-radio" style="color: #4285f4">
                                <input type="radio" name="payment_method" value="VISA/MASTERCARD"> Visa/MasterCard
                                <span></span>
                            </label-->
                        </div>
                    </div>

                    <div class="form-group" id="deposit_phone_number">
                        <label id="phone_number_label">Numéro de téléphone MTN Mobile Money</label>
                        <div>
                            <div class="input-group">
                                <div class="input-group-prepend"><span class="input-group-text"><i class="la la-phone"></i>+237</span></div>
                                <input type="text" name="phone_number" class="form-control" value="" placeholder="Veuillez entrer le numéro de téléphone " aria-describedby="basic-addon1">
                            </div>
                            <span class="form-text text-muted">votre numéro de téléphone doit tenir sur 9 chiffres.</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Montant</label>
                        <div>
                            <div class="input-group">
                                <input type="text" name="amount" class="form-control" value="" placeholder="Veuillez entrer le montant de la recharge" aria-describedby="basic-addon1">
                                <div class="input-group-prepend"><span class="input-group-text">XAF</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="kt-portlet__foot">
                <div class="kt-form__actions">
                    <button id="kt_init_visa_deposit" type="submit" class="btn btn-warning" style="width:100%">Valider</button>
                </div>
            </div>
        </div>
        <div class="col-xl-2"></div>
    </div>
</form>
