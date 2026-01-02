<form class="kt-form" id="check_balance_form">
    @csrf
    <div class="row">
        <div class="col-xl-2"></div>
        <div class="col-xl-8">
            <div class="kt-section kt-section--first">
                <div class="kt-section__body">
                    <p>Veuillez entrer votre mot de passe afin de consulter votre solde</p>
                    <div class="form-group form-group-last">
                        <label>Mot de passe</label>
                        <input type="password" name="password" class="form-control" placeholder="Mot de passe" value="">
                    </div>
                </div>
            </div>
            <div class="kt-portlet__foot">
                <div class="kt-form__actions">
                    <button id="kt_check_balance" type="submit" class="btn btn-warning">Valider</button>
                </div>
            </div>
        </div>
        <div class="col-xl-2"></div>
    </div>
</form>
