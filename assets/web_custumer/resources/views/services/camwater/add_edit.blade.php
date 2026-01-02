<?php
$edit = isset($subscription) && !is_null($subscription)
?>
<div id="form_add">
    <form class="kt-form" >
        @csrf
        <div class="row">
            <div class="col-xl-1"></div>
            <div class="col-xl-10">
                <div class="kt-section kt-section--first">
                    <div class="kt-section__body">
                        <div class="form-group">
                            <label>Intitulé</label>
                            <input type="text" name="title" class="form-control" value="" placeholder="Exemple: compteur de la maison 1" aria-describedby="basic-addon1" @if ($subscription) value="intitule" @endif>
                        </div>
                        <div class="form-group">
                            <label>Numéro de téléphone </label>
                            <div>
                                <div class="input-group">
                                    <div class="input-group-prepend"><span class="input-group-text"><i class="la la-phone"></i>+237</span></div>
                                    <input type="text" name="phone_number" class="form-control" value="" aria-describedby="basic-addon1" @if ($subscription) value="phone number" @endif>
                                </div>
                                <span class="form-text text-muted">votre numéro de téléphone doit tenir sur 9 chiffres.</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Numéro de contrat</label>
                            <div>
                                <div class="input-group">
                                    <input type="text" name="subscriber_number" class="form-control" value="" aria-describedby="basic-addon1" @if ($subscription) value="numero d abonne" @endif >
                                </div>
                                <span class="form-text text-muted">votre numéro de d'abonnement doit tenir sur 14 chiffres.</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="kt-portlet__foot">
                    <div class="kt-form__actions">
                        <button id="save_subscription" type="submit" class="btn btn-warning" style="width:100%">Enregistrer</button>
                    </div>
                </div>
            </div>
            <div class="col-xl-1"></div>
        </div>
    </form>
</div>
