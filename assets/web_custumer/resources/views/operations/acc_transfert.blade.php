
<form class="kt-form" id="acc_transfert_form">
    @csrf
    <div class="row">
        <div class="col-xl-2"></div>
        <div class="col-xl-8">
            <div class="kt-section kt-section--first">
                <div class="kt-section__body">
                    <div class="form-group">
                        <label>Numéro de téléphone du bénéficiaire</label>
                        <div class="input-group">
                            <div class="input-group-prepend"><span class="input-group-text"><i class="la la-phone"></i>+237</span></div>
                            <input type="text" name="phone_number" class="form-control" value="" placeholder="Veuillez entrer le numéro de téléphone du bénéficiaire" aria-describedby="basic-addon1">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Montant</label>
                        <div>
                            <div class="input-group">
                                <input type="text" name="amount" class="form-control" value="" placeholder="Veuillez entrer le montant à transferer" aria-describedby="basic-addon1">
                                <div class="input-group-prepend"><span class="input-group-text">XAF</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="kt-portlet__foot">
                <div class="kt-form__actions">
                    <button id="kt_acc_transfert" type="submit" class="btn btn-warning">Suivant</button>
                </div>
            </div>
        </div>
        <div class="col-xl-2"></div>
    </div>
</form>
