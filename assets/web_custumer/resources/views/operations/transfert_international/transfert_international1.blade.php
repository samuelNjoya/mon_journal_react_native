<form class="kt-form" id="international_transfert1_form">
    @csrf
    <div class="row">
        <div class="col-xl-2"></div>
        <div class="col-xl-8">
            <div class="kt-section kt-section--first">
                <div class="kt-section__body">
                    <div class="form-group">
                        <label>Pays de Provenance</label>
                        <input type="text" name="country" id="country" class="form-control"
                            placeholder="Veuillez selectioner votre pays">
                    </div>
                    <div class="form-group">
                        <label>Mode de reception de l'argent</label>
                        <select class="form-control kt-select2" id="select_withdrawal_method" name="withdrawal_method">
                            <option selected value="nodefine">Veuillez selectionner le mode de reception de l'argent</option>
                        </select>
                    </div>
                    <div class="form-group" id="nom_ben" style="display: none;">
                        <label>Nom du bénéficiaire</label>
                        <input type="text" name="lastname" class="form-control" value=""
                            placeholder="Veuillez entrer le nom du bénéficiaire" aria-describedby="basic-addon1">
                    </div>
                    <div class="form-group" id="prenom_ben" style="display: none;">
                        <label>Prénom du bénéficiaire</label>
                        <input type="text" name="firstname" class="form-control" value=""
                            placeholder="Veuillez entrer le prénom du bénéficiaire" aria-describedby="basic-addon1">

                    </div>
                    <div class="form-group" id="div_type_cni" style="display: none;">
                        <label>Type de Carte D'identité du Bénéficiaire</label>
                        <select class="form-control kt-select2" id="type_cni" name="type_cni">
                            <option selected value="None">Veuillez selectionner le type de cni</option>
                            <option value="Carte National">Carte National</option>
                            <option value="Passeport">Passeport</option>
                            <option value="Récépissé">Récépissé</option>
                        </select>
                        <span id="sesampayx_phone_number_not_valid" class="form-text text-muted d-none"
                            style="color: #fd397a !important;">Veuillez selectionner un type de CNI valide</span>
                    </div>
                    <div class="form-group d-none" id="div_cni" style="display: none;">
                        <label id="label_cni"></label>
                        <input type="text" name="cni" id="cni" class="form-control"
                            placeholder="Entrez le numéro" value="">
                            <span id="sesampayx_phone_number_not_valid" class="form-text text-muted d-none"
                            style="color: #fd397a !important;">Numéro de téléphone incorrect</span>
                    </div>

                    <div class="form-group" id="cash_phone_number" style="display: none;">
                        <label id="label_phone_number1"></label>
                        <div class="input-group">
                            <input type="tel" class="form-control"
                                placeholder="Veuillez saisir le numéro de téléphone"
                                name="ben_phone_number" id="phone_number" autocomplete="off"
                                aria-describedby="basic-addon1">
                        </div>
                        <span id="sesampayx_phone_number_not_valid" class="form-text text-muted d-none"
                            style="color: #fd397a !important;">Numéro de téléphone incorrect</span>
                        <!--<span class="form-text text-muted">Votre numéro de téléphone doit être au format
                            international.</span>-->
                    </div>

                    <div class="form-group">
                        <label>Montant</label>
                        <div>
                            <div class="input-group">
                                <input type="text" name="amount" class="form-control" value=""
                                    placeholder="Veuillez entrer le montant à transferer"
                                    aria-describedby="basic-addon1">
                                <div class="input-group-prepend"><span class="input-group-text">XAF</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--div class="kt-portlet__foot">
                <div class="kt-form__actions">
                    <button id="kt_international_transfert1" type="submit" class="btn btn-warning"
                        style="width: 100%;" disabled>Suivant</button>
                </div>
            </div-->
        </div>
        <div class="col-xl-2"></div>
    </div>
</form>
