<!DOCTYPE html>

<!--
Template Name: Metronic - Responsive Admin Dashboard Template build with Twitter Bootstrap 4 & Angular 8
Author: KeenThemes
Website: http://www.keenthemes.com/
Contact: support@keenthemes.com
Follow: www.twitter.com/keenthemes
Dribbble: www.dribbble.com/keenthemes
Like: www.facebook.com/keenthemes
Purchase: http://themeforest.net/item/metronic-responsive-admin-dashboard-template/4021469?ref=keenthemes
Renew Support: http://themeforest.net/item/metronic-responsive-admin-dashboard-template/4021469?ref=keenthemes
License: You must have a valid license purchased only from themeforest(the above link) in order to legally use the theme for your project.
-->
<html lang="en">

<!-- begin::Head -->

<head>

    <!--begin::Base Path (base relative path for assets of this page) -->
    <base href="../">
    <meta name="csrf_token" content="{{ csrf_token() }}" />

    <!--end::Base Path -->
    <meta charset="utf-8" />
    <title>Transfert international vers le Cameroun | SesamPayx</title>
    <meta name="description" content="Latest updates and statistic charts">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!--begin::Fonts -->
    <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js"></script>
    <script>
        WebFont.load({
            google: {
                "families": ["Poppins:300,400,500,600,700", "Asap+Condensed:500"]
            },
            active: function() {
                sessionStorage.fonts = true;
            }
        });
    </script>

    <!--begin::Page Custom Styles(used by this page) -->
    <link href="./assets/css/demo1/pages/wizard/wizard-3.css" rel="stylesheet" type="text/css" />

    <!--end::Page Custom Styles -->


    <!--end::Fonts -->
    <link href="./assets/css/demo1/pages/pricing/pricing-4.css" rel="stylesheet" type="text/css" />
    <!--begin::Page Vendors Styles(used by this page) -->
    <link href="./assets/vendors/custom/fullcalendar/fullcalendar.bundle.css" rel="stylesheet" type="text/css" />

    <!--end::Page Vendors Styles -->

    <!--begin:: Global Mandatory Vendors -->
    <link href="./assets/vendors/general/perfect-scrollbar/css/perfect-scrollbar.css" rel="stylesheet"
        type="text/css" />

    <!--end:: Global Mandatory Vendors -->

    <!--begin:: Global Optional Vendors -->
    <link href="./assets/vendors/general/tether/dist/css/tether.css" rel="stylesheet" type="text/css" />
    <link href="./assets/vendors/general/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css" rel="stylesheet"
        type="text/css" />
    <link href="./assets/vendors/general/bootstrap-datetime-picker/css/bootstrap-datetimepicker.css" rel="stylesheet"
        type="text/css" />
    <link href="./assets/vendors/general/bootstrap-timepicker/css/bootstrap-timepicker.css" rel="stylesheet"
        type="text/css" />
    <link href="./assets/vendors/general/bootstrap-daterangepicker/daterangepicker.css" rel="stylesheet"
        type="text/css" />
    <link href="./assets/vendors/general/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.css" rel="stylesheet"
        type="text/css" />
    <link href="./assets/vendors/general/bootstrap-select/dist/css/bootstrap-select.css" rel="stylesheet"
        type="text/css" />
    <link href="./assets/vendors/general/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css" rel="stylesheet"
        type="text/css" />
    <link href="./assets/vendors/general/select2/dist/css/select2.css" rel="stylesheet" type="text/css" />
    <link href="./assets/vendors/general/ion-rangeslider/css/ion.rangeSlider.css" rel="stylesheet" type="text/css" />
    <link href="./assets/vendors/general/nouislider/distribute/nouislider.css" rel="stylesheet" type="text/css" />
    <link href="./assets/vendors/general/owl.carousel/dist/assets/owl.carousel.css" rel="stylesheet" type="text/css" />
    <link href="./assets/vendors/general/owl.carousel/dist/assets/owl.theme.default.css" rel="stylesheet"
        type="text/css" />
    <link href="./assets/vendors/general/dropzone/dist/dropzone.css" rel="stylesheet" type="text/css" />
    <link href="./assets/vendors/general/summernote/dist/summernote.css" rel="stylesheet" type="text/css" />
    <link href="./assets/vendors/general/bootstrap-markdown/css/bootstrap-markdown.min.css" rel="stylesheet"
        type="text/css" />
    <link href="./assets/vendors/general/animate.css/animate.css" rel="stylesheet" type="text/css" />
    <link href="./assets/vendors/general/toastr/build/toastr.css" rel="stylesheet" type="text/css" />
    <link href="./assets/vendors/general/morris.js/morris.css" rel="stylesheet" type="text/css" />
    <link href="./assets/vendors/general/sweetalert2/dist/sweetalert2.css" rel="stylesheet" type="text/css" />
    <link href="./assets/vendors/general/socicon/css/socicon.css" rel="stylesheet" type="text/css" />
    <link href="./assets/vendors/custom/vendors/line-awesome/css/line-awesome.css" rel="stylesheet" type="text/css" />
    <link href="./assets/vendors/custom/vendors/flaticon/flaticon.css" rel="stylesheet" type="text/css" />
    <link href="./assets/vendors/custom/vendors/flaticon2/flaticon.css" rel="stylesheet" type="text/css" />
    <link href="./assets/vendors/general/@fortawesome/fontawesome-free/css/all.min.css" rel="stylesheet"
        type="text/css" />

    <!--end:: Global Optional Vendors -->

    <!--begin::Global Theme Styles(used by all pages) -->
    <link href="./assets/css/demo11/style.bundle.css" rel="stylesheet" type="text/css" />
    <link href="./assets/css/intlTelInput.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="./assets/country_select/build/css/countrySelect.css">

    <!--end::Global Theme Styles -->

    <!--begin::Layout Skins(used by all pages) -->

    <!--end::Layout Skins -->
    <link rel="shortcut icon" href="./assets/media/logos/logo_sesampayx.png" />
    <style>
        .iti {
            width: 100% !important;
        }
        .iti, .country-select {
            width: 100% !important;
        }

    </style>
</head>

<!-- end::Head -->

<!-- begin::Body -->

<body
    class="kt-page-content-white kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--transparent kt-aside--enabled kt-aside--fixed kt-page--loading">

    <!-- begin:: Page -->

    <!-- begin:: Header Mobile -->
    <div id="kt_header_mobile" class="kt-header-mobile  kt-header-mobile--fixed " style="background-color: #fddb2c;">
        <div class="kt-header-mobile__logo">
            <div class="kt-header__brand-logo">
                <a href="{{ route('spx.signin') }}">
                    <img alt="Logo" src="./assets/media/logos/logo_sesampayx.png" style="height: 50px" />
                </a>
            </div>
            <div class="col-lg-12">
                <span>
                    <span style="font-size: 10px;">SesamPayx</span> <br>
                    <b style="color: #000;">Inscription </b>
                </span>
            </div>
        </div>
        {{-- <div class="kt-header-mobile__toolbar"> --}}
        {{-- <button class="kt-header-mobile__toolbar-toggler kt-header-mobile__toolbar-toggler--left" id="kt_aside_mobile_toggler"><span></span></button> --}}
        {{-- <button class="kt-header-mobile__toolbar-topbar-toggler" id="kt_header_mobile_topbar_toggler"><i class="flaticon-more-1"></i></button> --}}
        {{-- </div> --}}
    </div>

    <!-- end:: Header Mobile -->
    <div class="kt-grid kt-grid--hor kt-grid--root">
        <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver kt-page">
            <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper" id="kt_wrapper">

                <!-- begin:: Header -->
                <div id="kt_header" class="kt-header kt-grid__item  kt-header--fixed " data-ktheader-minimize="on"
                    style="background-color: #fddb2c">
                    <div class="kt-container  kt-container--fluid ">

                        <!-- begin:: Brand -->
                        <div class="kt-header__brand " id="kt_header_brand">
                            <div class="kt-header__brand-logo">
                                <a href="{{ route('spx.signin') }}">
                                    <img alt="Logo" src="./assets/media/logos/logo_sesampayx.png"
                                        style="height: 50px" />
                                </a>
                            </div>
                            <div class="col-lg-12">
                                <span class="kt-header__topbar-username kt-visible-desktop">
                                    <span style="font-size: 10px;">SesamPayx</span> <br>
                                    <b style="color: #000;">Transfert international vers le Cameroun </b>
                                </span>
                            </div>
                        </div>

                        <!-- end:: Brand -->

                        <!-- begin:: Header Topbar -->
                        <div class="kt-header__topbar">
                            <!--begin: Language bar -->
                            {{-- <div class="kt-header__topbar-item kt-header__topbar-item--langs"> --}}
                            {{-- <div class="kt-header__topbar-wrapper" data-toggle="dropdown" data-offset="10px,0px"> --}}
                            {{-- <span class="kt-header__topbar-icon"> --}}
                            {{-- <img class="" src="./assets/media/flags/019-france.svg" alt="" /> --}}
                            {{-- </span> --}}
                            {{-- </div> --}}
                            {{-- </div> --}}
                            <!--end: Language bar -->
                        </div>

                        <!-- end:: Header Topbar -->
                    </div>
                </div>

                <!-- end:: Header -->
                <div class="kt-body kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-grid--stretch"
                    id="kt_body">
                    <div class="kt-container  kt-container--fluid  kt-grid kt-grid--ver">

                        <div class="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor"
                            id="kt_content">

                            <!-- begin:: Content -->
                            <div class="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                                <div class="kt-portlet">
                                    <div class="kt-portlet__body kt-portlet__body--fit">
                                        <div class="kt-grid kt-wizard-v3 kt-wizard-v3--white" id="kt_wizard_v3"
                                            data-wizard-clickable="false" data-ktwizard-state="step-first">
                                            <div class="kt-grid__item">

                                                <!--begin: Form Wizard Nav -->
                                                <div class="kt-wizard-v3__nav">
                                                    <div class="kt-wizard-v3__nav-items">
                                                        <div class="kt-wizard-v3__nav-item" data-ktwizard-type="step"
                                                            data-wizard-clickable="false">
                                                            <div class="kt-wizard-v3__nav-body">
                                                                <div class="kt-wizard-v3__nav-label">
                                                                    <span>1</span> Informations du retrait
                                                                </div>
                                                                <div class="kt-wizard-v3__nav-bar"></div>
                                                            </div>
                                                        </div>
                                                        <div class="kt-wizard-v3__nav-item" data-ktwizard-type="step"
                                                            data-wizard-clickable="false">
                                                            <div class="kt-wizard-v3__nav-body">
                                                                <div class="kt-wizard-v3__nav-label">
                                                                    <span>2</span> Vos informations
                                                                </div>
                                                                <div class="kt-wizard-v3__nav-bar"></div>
                                                            </div>
                                                        </div>
                                                        <div class="kt-wizard-v3__nav-item" data-ktwizard-type="step"
                                                            data-wizard-clickable="false">
                                                            <div class="kt-wizard-v3__nav-body">
                                                                <div class="kt-wizard-v3__nav-label">
                                                                    <span>3</span>Recapitulatif
                                                                </div>
                                                                <div class="kt-wizard-v3__nav-bar"></div>
                                                            </div>
                                                        </div>
                                                        <div class="kt-wizard-v3__nav-item" data-ktwizard-type="step"
                                                            data-wizard-clickable="false">
                                                            <div class="kt-wizard-v3__nav-body">
                                                                <div class="kt-wizard-v3__nav-label">
                                                                    <span>4</span> Validation
                                                                </div>
                                                                <div class="kt-wizard-v3__nav-bar"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!--end: Form Wizard Nav -->
                                            </div>
                                            <div class="kt-grid__item kt-grid__item--fluid kt-wizard-v3__wrapper">

                                                <!--begin: Form Wizard Form-->
                                                <form class="kt-form" id="kt_form">
                                                    @csrf

                                                    <!--begin: Form Wizard Step 1-->
                                                    <div class="kt-wizard-v3__content" data-ktwizard-type="step-content"
                                                        data-ktwizard-state="current">
                                                        <div class="row">
                                                            <div class="col-xl-2"></div>
                                                            <div class="col-xl-8">
                                                                <div class="kt-section kt-section--first">
                                                                    <div class="kt-section__body">
                                                                        <div class="form-group">
                                                                            <label>Pays de Provenance</label>
                                                                            <input type="text" name="country" id="country" class="form-control"
                                                                                placeholder="Veuillez selectioner votre pays">
                                                                            <span id="provenance_err" class="form-text text-muted error_clean"
                                                                                style="color: #fd397a !important;"></span>
                                                                        </div>
                                                                        <div class="form-group">
                                                                            <label>Mode de reception de l'argent</label>
                                                                            <select class="form-control kt-select2" id="select_withdrawal_method" name="withdrawal_method" id="mode_retrait">
                                                                                <option selected value="nodefine">Veuillez selectionner le mode de reception de l'argent</option>
                                                                            </select>
                                                                            <span id="mode_retrait_err" class="form-text text-muted error_clean"
                                                                                        style="color: #fd397a !important;"></span>
                                                                        </div>
                                                                        <div class="form-group" id="nom_ben" style="display: none;">
                                                                            <label>Nom du bénéficiaire</label>
                                                                            <input type="text" name="lastname" class="form-control" value="" id="nom_ben_1"
                                                                                placeholder="Veuillez entrer le nom du bénéficiaire" aria-describedby="basic-addon1">
                                                                            <span id="nom_ben_err" class="form-text text-muted error_clean"
                                                                                style="color: #fd397a !important;"></span>
                                                                        </div>
                                                                        <div class="form-group" id="prenom_ben" style="display: none;">
                                                                            <label>Prénom du bénéficiaire</label>
                                                                            <input type="text" name="firstname" class="form-control" value="" id="prenom_ben1"
                                                                                placeholder="Veuillez entrer le prénom du bénéficiaire" aria-describedby="basic-addon1">
                                                                            <span id="prenom_ben_err" class="form-text text-muted error_clean"
                                                                                style="color: #fd397a !important;"></span>

                                                                        </div>
                                                                        <div class="form-group" id="div_type_cni" style="display: none;">
                                                                            <label>Type de Carte D'identité du Bénéficiaire</label>
                                                                            <select class="form-control kt-select2" id="type_cni" name="type_cni">
                                                                                <option selected value="">Veuillez selectionner le type de cni</option>
                                                                                <option value="Carte National">Carte National</option>
                                                                                <option value="Passeport">Passeport</option>
                                                                                <option value="Récépissé">Récépissé</option>
                                                                            </select>
                                                                            <span id="type_cni_err" class="form-text text-muted error_clean"
                                                                                style="color: #fd397a !important;"></span>
                                                                        </div>
                                                                        <div class="form-group d-none" id="div_cni" style="display: none;">
                                                                            <label id="label_cni"></label>
                                                                            <input type="text" name="cni" class="form-control" id="cni_number"
                                                                                placeholder="Entrez le numéro" value="">
                                                                            <span id="cni_number_err" class="form-text text-muted error_clean"
                                                                                style="color: #fd397a !important;"></span>
                                                                        </div>

                                                                        <div class="form-group" id="cash_phone_number" style="display: none;">
                                                                            <label id="label_phone_number1"></label>
                                                                            <div class="input-group">
                                                                                <input type="tel" class="form-control"
                                                                                    placeholder="Veuillez saisir le numéro de téléphone"
                                                                                    name="ben_phone_number" id="phone_number" autocomplete="off"
                                                                                    aria-describedby="basic-addon1">
                                                                            </div>
                                                                            <span id="phone_number_not_valid" class="form-text text-muted error_clean"
                                                                                style="color: #fd397a !important;"></span>
                                                                            <!--<span class="form-text text-muted">Votre numéro de téléphone doit être au format
                                                                                international.</span>-->
                                                                        </div>

                                                                        <div class="form-group">
                                                                            <label>Montant</label>
                                                                            <div>
                                                                                <div class="input-group">
                                                                                    <input type="text" name="amount" class="form-control" value="" id="amount"
                                                                                        placeholder="Veuillez entrer le montant à transferer"
                                                                                        aria-describedby="basic-addon1">
                                                                                    <div class="input-group-prepend"><span class="input-group-text">XAF</span></div>
                                                                                </div>
                                                                                <span id="montant_err" class="form-text text-muted error_clean"
                                                                                style="color: #fd397a !important;"></span>
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

                                                    </div>
                                                    <!--end: Form Wizard Step 1-->

                                                    <!--begin: Form Wizard Step 2-->
                                                    <div class="kt-wizard-v3__content"
                                                        data-ktwizard-type="step-content">
                                                        <div class="form-group">
                                                            <div class="input-group">
                                                                <label>Numero de telephone de l'emetteur</label>
                                                                <input type="tel" class="form-control"
                                                                    placeholder="Entrez votre numéro de télèphone" name="phone_number1"
                                                                    id="phone_number_1" autocomplete="off">
                                                                    <span></span>
                                                            </div>
                                                        </div>
                                                        <p class="have_account_msg_id" style="border-bottom: 1px solid #646c9a; padding-bottom:5px; display: none;">
                                                            Numéro de téléphone existant entrer votre mot de passe pour continuer
                                                        </p>

                                                        <div class="emetteur_form" style="display: none">
                                                            <div class="form-group" id="trans_name_div_id">
                                                                <label>Nom du bénéficiaire</label>
                                                                <input type="text" name="trans_lastname" class="form-control" value="" id="trans_lastname_id"
                                                                    placeholder="Veuillez entrer le nom du bénéficiaire" aria-describedby="basic-addon1">
                                                            </div>
                                                            <div class="form-group">
                                                                <label>Prénom du bénéficiaire</label>
                                                                <input type="text" name="trans_firstname" class="form-control" value="" id="trans_firstname_id"
                                                                    placeholder="Veuillez entrer votre prenom" aria-describedby="basic-addon1">
                                                            </div>
                                                            <div class="form-group">
                                                                <label>Type de Carte D'identité du Bénéficiaire</label>
                                                                <select class="form-control kt-select2" id="trans_type_cni_id" name="trans_type_cni">
                                                                    <option selected value="">Veuillez selectionner le type de cni</option>
                                                                    <option value="Carte National">Carte National</option>
                                                                    <option value="Passeport">Passeport</option>
                                                                    <option value="Récépissé">Récépissé</option>
                                                                </select>
                                                            </div>
                                                            <div class="form-group">
                                                                <label id="trans_cni_label_id">Entrez le numero de la piece</label>
                                                                <input type="text" name="trans_cni" id="trans_cni_id" class="form-control"
                                                                    placeholder="Entrez le numéro" value="">
                                                            </div>
                                                            <div class="form-group">
                                                                <label id="trans_cni_label_id">Date de delivrance de la pièce</label>
                                                                <input type="text" name="trans_date_cni" id="trans_date_cni_id" class="form-control"
                                                                    placeholder="Entrez le numéro" value="">
                                                            </div>
                                                            <div class="form-group">
                                                                <label>Email(optionel)</label>
                                                                <input type="text" name="trans_email" id="trans_email_id" class="form-control"
                                                                    placeholder="Entrez votre Email" value="">
                                                            </div>
                                                        </div>
                                                        <div class="form-group" id="div_password_id"  style="display: none">
                                                            <label><span id="exist_phone_number_password" class="form-text text-muted">Mot de passe</span></label>
                                                            <input type="password" name="password" class="form-control" value="" id="password_id"
                                                                placeholder="Veuillez saisir votre password" aria-describedby="basic-addon1">
                                                        </div>
                                                        <div class="form-group emetteur_form" style="display: none">
                                                            <label>Confirmez votre mot de passe</label>
                                                            <input type="password" name="confirm_password1" class="form-control" value="" id="trans_confirm_password1_id"
                                                                placeholder="Veuillez saisir votre password" aria-describedby="basic-addon1">
                                                        </div>
                                                    </div>
                                                    <!--end: Form Wizard Step 2-->

                                                    <!--begin: Form Wizard Step 3-->
                                                    <div class="kt-wizard-v3__content"
                                                        data-ktwizard-type="step-content">
                                                        <div class="kt-heading kt-heading--md">Informations personnelles
                                                        </div>
                                                        <div class="kt-form__section kt-form__section--first">
                                                            <div class="kt-wizard-v3__form">
                                                                <p id="recap_inter_trans" style="border-bottom: 1px solid #646c9a; padding-bottom:5px;"></p>
                                                                <div class="form-group">
                                                                    <p>Veuillez selectionner le moyen de paiement</p>
                                                                    <div class="kt-radio-list">
                                                                        <!--<label class="kt-radio" style="color:#fddb2c">
                                                                            <input type="radio" name="payment_method" value="MTN" checked="checked"> MTN Mobile Money
                                                                            <span></span>
                                                                        </label>
                                                                        <label class="kt-radio" style="color: #ff8400">
                                                                            <input type="radio" name="payment_method" value="OM"> Orange Money
                                                                            <span></span>
                                                                        </label>-->
                                                                        <label class="kt-radio" style="color: #4285f4">
                                                                            <input type="radio" name="payment_method" value="VISA/MASTERCARD" checked>
                                                                            Visa/MasterCard
                                                                            <span></span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!--end: Form Wizard Step 3-->

                                                    <!--begin: Form Wizard Step 4-->
                                                    <div class="kt-wizard-v3__content"
                                                        data-ktwizard-type="step-content">
                                                        <div class="kt-form__section kt-form__section--first">
                                                            <div class="kt-form">
                                                                <div class="row">
                                                                    <div class="col-2"></div>
                                                                    <div class="col-8">
                                                                        <div class="kt-portlet__head">
                                                                            <div class="kt-portlet__head-label row">
                                                                                <div class="col-2">
                                                                                    <img id="illustration" class="kt-widget7__img" src="./assets/media/custom/ic_credit_card.png" alt="" style="height:35px;">
                                                                                </div>
                                                                                <div class="col-10">
                                                                                    <h6 class="kt-portlet__head-title">
                                                                                        Transfert d'Argent International via VISA ou MasterCard
                                                                                    </h6>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                        <div style="padding: 16px;">
                                                                            <div class="row">
                                                                                <h7 style="color:black; flex:3">Montant:</h7>
                                                                                <p style="flex:1; text-align: end" id="montant_id"></p>
                                                                            </div>
                                                                            <div class="row">
                                                                                <h7 style="color:black; flex:3">Commission:</h7>
                                                                                <p style="flex:1;text-align: end" id="commission_id"></p>
                                                                            </div>
                                                                            <div class="row">
                                                                                <h7 style="color:black; flex:3">Frais de l'opérateur:</h7>
                                                                                <p style="flex:1;text-align: end" id="frais_operateur_id"></p>
                                                                            </div>
                                                                            <div class="row">
                                                                                <h7 style="color:black; flex:3">Total:</h7>
                                                                                <p style="flex:1; text-align: end" id="total_id"></p>
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <!--end: Form Wizard Step 4-->


                                                    <!--begin: Form Actions -->
                                                    <div class="kt-form__actions">
                                                        <div class="btn btn-secondary btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u d-none"
                                                            data-ktwizard-type="action-prev" id="btn_prev">
                                                            Précédent
                                                        </div>
                                                        <div id="btn_validate"
                                                            class="btn btn-success btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u"
                                                            data-ktwizard-type="action-submit">
                                                            Valider
                                                        </div>
                                                        <!--                                                    <div style="display:none;" class="btn btn-brand btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u" data-ktwizard-type="action-next">-->
                                                        <!--                                                        Suivant-->
                                                        <!--                                                    </div>-->
                                                        <div id="btn_next"
                                                            class="btn btn-brand btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u">
                                                            Suivant
                                                        </div>

                                                    </div>

                                                    <!--end: Form Actions -->
                                                </form>

                                                <!--end: Form Wizard Form-->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- end:: Content -->


                        </div>


                    </div>
                </div>

                <!-- begin:: Footer -->
                <div class="kt-footer kt-grid__item" id="kt_footer" style="background-color: #000000">
                    <div class="kt-container  kt-container--fluid ">
                        <div class="kt-footer__wrapper">
                            <div class="kt-footer__copyright">
                                2020&nbsp;&copy;&nbsp;<a href="https://sesamefinance.com/" target="_blank"
                                    class="kt-link">Sesame Financial Services</a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- end:: Footer -->
            </div>
        </div>
    </div>

    <!-- end:: Page -->
    <div class="modal fade" id="offline_international_transfert" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog" role="document" id="modal_content">
            <div class="modal-content">
                <div class="modal-header opmodal-header">
                    {{-- <img src="./assets/media/logos/logo_sesampayx.png" style="width: 50px;"> --}}
                    <h5 class="modal-title opmodal-title" id="exampleModalLabel">Transfert d'Argent International</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <div class="modal-body" id="offline_international_transfert_body">

                </div>
            </div>
        </div>
    </div>

    <!-- begin::Scrolltop -->
    <div id="kt_scrolltop" class="kt-scrolltop">
        <i class="fa fa-arrow-up"></i>
    </div>

    <!-- end::Scrolltop -->


    <!-- begin::Global Config(global config for global JS sciprts) -->
    <script>
        var KTAppOptions = {
            "colors": {
                "state": {
                    "brand": "#5d78ff",
                    "light": "#ffffff",
                    "dark": "#282a3c",
                    "primary": "#5867dd",
                    "success": "#34bfa3",
                    "info": "#36a3f7",
                    "warning": "#ffb822",
                    "danger": "#fd3995"
                },
                "base": {
                    "label": ["#c5cbe3", "#a1a8c3", "#3d4465", "#3e4466"],
                    "shape": ["#f0f3ff", "#d9dffa", "#afb4d4", "#646c9a"]
                }
            }
        };
    </script>

    <!-- end::Global Config -->

    <!--begin:: Global Mandatory Vendors -->
    <script src="./assets/vendors/general/jquery/dist/jquery.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/popper.js/dist/umd/popper.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/bootstrap/dist/js/bootstrap.min.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/js-cookie/src/js.cookie.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/moment/min/moment.min.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/tooltip.js/dist/umd/tooltip.min.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/perfect-scrollbar/dist/perfect-scrollbar.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/sticky-js/dist/sticky.min.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/wnumb/wNumb.js" type="text/javascript"></script>

    <!--end:: Global Mandatory Vendors -->

    <!--begin:: Global Optional Vendors -->
    <script src="./assets/vendors/general/jquery-form/dist/jquery.form.min.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/block-ui/jquery.blockUI.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js" type="text/javascript">
    </script>
    <script src="./assets/vendors/custom/js/vendors/bootstrap-datepicker.init.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/bootstrap-datetime-picker/js/bootstrap-datetimepicker.min.js"
        type="text/javascript"></script>
    <script src="./assets/vendors/general/bootstrap-timepicker/js/bootstrap-timepicker.min.js" type="text/javascript">
    </script>
    <script src="./assets/vendors/custom/js/vendors/bootstrap-timepicker.init.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/bootstrap-daterangepicker/daterangepicker.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.js" type="text/javascript">
    </script>
    <script src="./assets/vendors/general/bootstrap-maxlength/src/bootstrap-maxlength.js" type="text/javascript"></script>
    <script src="./assets/vendors/custom/vendors/bootstrap-multiselectsplitter/bootstrap-multiselectsplitter.min.js"
        type="text/javascript"></script>
    <script src="./assets/vendors/general/bootstrap-select/dist/js/bootstrap-select.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/bootstrap-switch/dist/js/bootstrap-switch.js" type="text/javascript"></script>
    <script src="./assets/vendors/custom/js/vendors/bootstrap-switch.init.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/select2/dist/js/select2.full.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/ion-rangeslider/js/ion.rangeSlider.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/typeahead.js/dist/typeahead.bundle.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/handlebars/dist/handlebars.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/inputmask/dist/jquery.inputmask.bundle.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/inputmask/dist/inputmask/inputmask.date.extensions.js" type="text/javascript">
    </script>
    <script src="./assets/vendors/general/inputmask/dist/inputmask/inputmask.numeric.extensions.js" type="text/javascript">
    </script>
    <script src="./assets/vendors/general/nouislider/distribute/nouislider.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/owl.carousel/dist/owl.carousel.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/autosize/dist/autosize.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/clipboard/dist/clipboard.min.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/dropzone/dist/dropzone.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/summernote/dist/summernote.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/markdown/lib/markdown.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/bootstrap-markdown/js/bootstrap-markdown.js" type="text/javascript"></script>
    <script src="./assets/vendors/custom/js/vendors/bootstrap-markdown.init.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/bootstrap-notify/bootstrap-notify.min.js" type="text/javascript"></script>
    <script src="./assets/vendors/custom/js/vendors/bootstrap-notify.init.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/jquery-validation/dist/jquery.validate.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/jquery-validation/dist/additional-methods.js" type="text/javascript"></script>
    <script src="./assets/vendors/custom/js/vendors/jquery-validation.init.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/toastr/build/toastr.min.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/raphael/raphael.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/morris.js/morris.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/chart.js/dist/Chart.bundle.js" type="text/javascript"></script>
    <script src="./assets/vendors/custom/vendors/bootstrap-session-timeout/dist/bootstrap-session-timeout.min.js"
        type="text/javascript"></script>
    <script src="./assets/vendors/custom/vendors/jquery-idletimer/idle-timer.min.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/waypoints/lib/jquery.waypoints.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/counterup/jquery.counterup.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/es6-promise-polyfill/promise.min.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/sweetalert2/dist/sweetalert2.min.js" type="text/javascript"></script>
    <script src="./assets/vendors/custom/js/vendors/sweetalert2.init.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/jquery.repeater/src/lib.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/jquery.repeater/src/jquery.input.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/jquery.repeater/src/repeater.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/dompurify/dist/purify.js" type="text/javascript"></script>

    <!--end:: Global Optional Vendors -->

    <!--begin::Global Theme Bundle(used by all pages) -->
    <script src="./assets/js/demo11/scripts.bundle.js" type="text/javascript"></script>
    <script src="./assets/js/intlTelInput-jquery.min.js" type="text/javascript"></script>
    <script src="./assets/js/intlTelInput.js" type="text/javascript"></script>
    <script src="./assets/country_select/build/js/countrySelect.min.js"></script>

    <!--end::Global Theme Bundle -->

    <!--begin::Page Vendors(used by this page) -->
    <script src="./assets/vendors/custom/fullcalendar/fullcalendar.bundle.js" type="text/javascript"></script>
    <script src="//maps.google.com/maps/api/js?key=AIzaSyBTGnKT7dt597vo9QgeQ7BFhvSRP4eiMSM" type="text/javascript"></script>
    <script src="./assets/vendors/custom/gmaps/gmaps.js" type="text/javascript"></script>

    <!--end::Page Vendors -->

    <!--begin::Page Scripts(used by this page) -->
    <!--begin::Page Scripts(used by this page) -->
    <script src="./assets/js/demo1/pages/wizard/wizard-3.js" type="text/javascript"></script>
    <script src="//rum-static.pingdom.net/pa-60a8ed73541c6000110000b0.js" async></script>
    @include("layout.script")
    <script>
        // Class definition

        var wizard;
        var phone_number;
        var code;
        var next_button = $('#btn_next');
        var wizardObject;
        var wizardstate = false;
        var datas = {
            beneficiary:{
                firstname:"",
                lastname:"",
                type_cni:"none",
                cni:"0000"
            },
            transmitter: {
                firstname: null,
                lastname: null,
                country: null,
                type_cni: "None",
                cni: "none",
                email:null
            },
            password: null,
            reference: 'INTER_MONEY_TRANSFERT',
            phone_number: null,
            amount: null,
            withdrawal_method: 'GUICHET',
            payment_method:'VISA/MASTERCARD',
            "_token": "{{ csrf_token() }}",
        };

        var KTWizard3 = function() {
            // Base elements
            var wizardEl;
            var formEl;

            // Private functions
            var initWizard = function() {
                // Initialize form wizard
                wizard = new KTWizard('kt_wizard_v3', {
                    startStep: 1,
                    clickableSteps: false
                });

                // Validation before going to next page
                wizard.on('beforeNext', function(wizardObj) {
                    wizardObject = wizardObj;
                });

                wizard.on('beforePrev', function(wizardObj) {
                    /*if (validator.form() !== true) {
                        wizardObj.stop(); // don't go to the next step
                    }*/
                });

                // Change event
                wizard.on('change', function(wizard) {
                    KTUtil.scrollTop();
                    if (wizard.isLastStep()) {
                        next_button.hide();
                    } else {
                        next_button.show();
                    }
                });

            }

            var initValidation = function() {
                validator = formEl.validate({
                    // Validate only visible fields
                    ignore: ":hidden",

                    // Validation rules
                    rules: {
                        country: {
                            required: true
                        },
                        withdrawal_method: {
                            required: true
                        },
                        lastname: {
                            required: true
                        },
                        firstname: {
                            required: true
                        },
                        type_cni: {
                            required: true
                        },
                        cni: {
                            required: true
                        },
                        ben_phone_number: {
                            required: true
                        },
                        amount: {
                            required: true
                        },
                        //= Step 2
                        phone_number1: {
                            required: true
                        },

                        //= Step 2
                        password: {
                            required: true
                        },

                        //= Step 3
                        trans_firstname: {
                            required: true
                        },
                        trans_lastname: {
                            required: true
                        },
                        trans_date_cni: {
                            required: true,
                        },
                        confirm_password1: {
                            required: true,
                            equalTo: "#password_id"
                        },
                        trans_type_cni: {
                            required: true
                        },
                        trans_cni: {
                            required: true
                        },
                    },
                    messages: {
                        country: {
                            required: "Ce champ est requis",
                        },
                        withdrawal_method: {
                            required: "Ce champ est requis",
                        },
                        lastname: {
                            required: "Ce champ est requis",
                        },
                        firstname: {
                            required: "Ce champ est requis",
                        },
                        type_cni: {
                            required: "Ce champ est requis",
                        },
                        cni: {
                            required: "Ce champ est requis",
                        },
                        ben_phone_number: {
                            required: "Ce champ est requis",
                        },
                        amount: {
                            required: "Ce champ est requis",
                        },
                        phone_number1: {
                            required: "Ce champ est requis",
                            minlength: "Vous devez entrer un numéro à 9 chiffres",
                            maxlength: "Vous devez entrer un numéro à 9 chiffres"
                        }, //= Step 2
                        //= Step 3
                        trans_firstname: {
                            required: "Ce champ est requis"
                        },
                        trans_lastname: {
                            required: "Ce champ est requis"
                        },
                        trans_date_cni: {
                            required: "Ce champ est requis",
                        },
                        password: {
                            required: "Ce champ est requis"
                        },
                        confirm_password1: {
                            required: "Ce champ est requis",
                            equalTo: "Les mot de passe ne correspondent pas"
                        },
                        trans_type_cni: {
                            required: "Ce champ est requis"
                        },
                        trans_cni: {
                            required: "Ce champ est requis"
                        },
                    },

                    // Display errors
                    invalidHandler: function(event, validator) {
                        KTUtil.scrollTop();

                        swal.fire({
                            "title": "",
                            "text": "Une erreur est survenue lors de la validation de certains champs",
                            "type": "error",
                            "confirmButtonClass": "btn btn-secondary"
                        });
                    },

                    // Submit valid form
                    submitHandler: function(form) {
                        // $('#btn_validate').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
                        // formSubmit(form);
                    }
                });
            }

            var initSubmit = function() {
                var btn = formEl.find('[data-ktwizard-type="action-submit"]');

                btn.unbind().click(function(e) {
                    e.preventDefault();
                    loader("#kt_form");
                    KTApp.progress(btn);
                    formSubmit(formEl, btn);
                });
            }

            return {
                // public functions
                init: function() {
                    wizardEl = KTUtil.get('kt_wizard_v3');
                    formEl = $('#kt_form');

                    initWizard();
                    initValidation();
                    initSubmit();
                }
            };
        }();

        jQuery(document).ready(function() {
            KTWizard3.init();
            init_trans();

            next_button.unbind().click(function() {

                //$("#phone_number_not_valid").addClass("d-none")

                if (wizard.getStep() === 1) {

                    stepOneValidate(wizard, getPhoneNumberInternational().number)
                    /*if (getPhoneNumberInternational().isValid) {
                        loader("#kt_form");
                        $('#btn_next').addClass(
                                'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light')
                            .attr('disabled', true);
                        stepOneValidate(wizard, getPhoneNumberInternational().number)
                    } else {
                        $("#phone_number_not_valid").removeClass("d-none")
                    }*/
                } else if (wizard.getStep() === 2) {

                    if (getPhoneNumberInternational().isValid) {
                        loader("#kt_form");
                        $('#btn_next').addClass(
                                'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light')
                            .attr('disabled', true);
                        code = $('#code').val();
                        stepTwoValidate(wizard, getPhoneNumberInternational(), code)
                    } else {
                        $("#phone_number_not_valid").removeClass("d-none")
                    }
                }else if(wizard.getStep() === 3){
                    loader("#kt_form");
                        $('#btn_next').addClass(
                                'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light')
                            .attr('disabled', true);
                    stepThreeValidate(wizard, getPhoneNumberInternational())
                }else {
                    loader("#kt_form");
                        $('#btn_next').addClass(
                                'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light')
                            .attr('disabled', true);
                    transfertValidate(wizard, getPhoneNumberInternational())

                }
            })

            getCountry("{{ $country_code }}")
            $("#select_withdrawal_method").change(function() {
                if($('#select_withdrawal_method').val()=='nodefine'){
                    $(':input[type="submit"]').prop('disabled', true);
                    init_inter_trans_form();

                }else{
                    $(':input[type="submit"]').prop('disabled', false);
                    $("#cash_phone_number").show();
                    if($('#select_withdrawal_method').val()=='MTNMOMO')
                    {
                        $("#div_cni").hide();
                        $("#div_type_cni").hide();
                        $("#nom_ben").show();
                        $("#prenom_ben").show();
                        $("#label_phone_number1").html("Numéro de téléphone MTN Mobile Money du bénéficiaire");

                    }
                    if($('#select_withdrawal_method').val()=='SESAMPAYX')
                    {
                        $("#nom_ben").hide();
                        $("#prenom_ben").hide();
                        $("#div_cni").hide();
                        $("#div_type_cni").hide();
                        $("#label_phone_number1").html("Numéro de téléphone Sesampayx du bénéficiaire");
                    }
                    if($('#select_withdrawal_method').val()=='GUICHET')
                    {
                        $("#nom_ben").show();
                        $("#prenom_ben").show();
                        $("#div_cni").show();
                        $("#div_type_cni").show();
                        $("#label_phone_number1").html("Numéro de téléphone du bénéficiaire");
                    }
                }

            });

            $('#phone_number_1').keyup(function(e){

                if(getPhoneNumberInternational().isValid) {
                    loader("#kt_form");
                    $.ajax({
                        url : "{{ route('spx.check.sesampayxAccount') }}",
                        type : 'GET',
                        data : {
                            phone_number: getPhoneNumberInternational().number,
                        },
                        dataType:'json',
                        success : function(data) {
                            datas.have_account = data.have_account;
                            $("#div_password_id").show();
                            unloader("#kt_form")
                            $("#phone_number_1").prop('disabled', false);
                        },
                        error : function(request,error)
                        {
                            $(".emetteur_form").hide();
                            $(".have_account_msg_id").hide();
                            $("#div_password_id").hide();
                            alert("Request: "+JSON.stringify(request));
                            unloader("#kt_form")
                            $("#phone_number_1").prop('disabled', false);
                        }
                    });
                }

            });

            $("#btn_validate_offline_inter_trans").click(function(){
                console.log("process here");
                $.ajax({
                    url: "{{route('spx.op.post.offline_international_transfert')}}",
                    type: 'GET',
                    dataType:'JSON',
                    data: datas,
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')},
                    success: function(response, status) { // success est toujours en place, bien sûr !
                        unloader("#kt_form");
                        $('#btn_next').removeClass(
                            'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr(
                            'disabled', false);
                        if (response.status === 1) {
                            wizardObj.goNext();
                            $('#montant_id').html(response.amount);
                            $('#frais_operateur_id').html(response.fees);
                            $('#commission_id').html(response.commission);
                            $('#total_id').html(response.total);
                        } else {
                            swal.fire({
                                "title": response.err_title,
                                "text": response.err_msg + ". Code d'erreur " + response.err_code,
                                "type": "error",
                                "confirmButtonClass": "btn btn-secondary",
                            });
                        }
                    },
                    error: function(error) {
                        unloader("#kt_form");
                        $('#btn_next').removeClass(
                            'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr(
                            'disabled', false);
                        swal.fire({
                            "title": "Erreur interne",
                            "text": "Une erreur est survenue dans le serveur",
                            "type": "error",
                            "confirmButtonClass": "btn btn-secondary",
                        });
                    }

                });
            });
        });
        function init_trans(){
            loader("#kt_form");
            $("#country").countrySelect({
                defaultCountry: "{{$country_code ?? ""}}".toLowerCase()
            });
            $.ajax({
                url : "{{ route('spx.op.get.international_transfert1') }}",
                type : 'GET',
                data : {
                    'numberOfWords' : 10
                },
                dataType:'json',
                success : function(data) {
                    //alert('Data: '+data);
                    data.withdrawal_modes.map(function(elt) {
                        $("#select_withdrawal_method").append("<option value="+elt.value+">"+elt.label+"</option>")
                    });
                    $("#type_cni").change(function(){
                        if($(this).val() != null && $(this).val() != ""){
                            $("#label_cni").html("Numéro "+$(this).val()+" du bénéficiaire")
                            $("#cni").attr("placeholder","Entrez le numéro "+$(this).val())
                            $("#div_cni").removeClass("d-none")
                        }else{
                            $("#div_cni").addClass("d-none")
                        }
                    })
                    unloader("#kt_form")
                },
                error : function(request,error)
                {
                    alert("Request: "+JSON.stringify(request));
                    unloader("#kt_form")
                }
            });
        }

        function stepOneValidate(wizardObj, phone_number) {
            $(".error_clean").text("");
            if(!$.isNumeric($("#amount").val())){
                $("#montant_err").text("Valeur non valide")
                return
            }
            if (validator.form() !== true) {
                unloader("#kt_form");
                $('#btn_next').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled',
                    false);
                return;

            } else {
                if (!getPhoneNumberInternational().isValid) {
                    $("#phone_number_not_valid").text("Numero de telephone non valide");
                    return
                }
                datas.withdrawal_method = $("#select_withdrawal_method").val();
                datas.beneficiary.firstname = $("#prenom_ben1").val();
                datas.beneficiary.lastname = $("#nom_ben_1").val();
                datas.beneficiary.type_cni = $("#type_cni").val();
                datas.beneficiary.cni = $("#cni_number").val();
                datas.phone_number  = phone_number;
                datas.beneficiary.phone_number  = phone_number;
                datas.amount = $("#amount").val();
                datas.transmitter.country  = $("#country").val();
                if(datas.withdrawal_method=="GUICHET"){
                    wizardObj.goNext();
                    getCountryInterTrans("{{ $country_code }}");
                }else{
                    loader("#kt_form");
                    $('#btn_next').addClass(
                            'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light')
                        .attr('disabled', true);

                    $.ajax({
                        url: "{{ route('spx.op.preview.noconnectedcheckAccount') }}",
                        type: 'POST',
                        dataType:'JSON',
                        data: datas,
                        headers: {'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')},
                        success: function(response, status) { // success est toujours en place, bien sûr !
                            unloader("#kt_form");
                            $('#btn_next').removeClass(
                                'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr(
                                'disabled', false);
                            if (response.status === 1) {
                                wizardObj.goNext();
                                datas.beneficiary.firstname = response.firstname;
                                datas.beneficiary.lastname = response.lastname;
                                getCountryInterTrans("{{ $country_code }}");
                            } else {
                                swal.fire({
                                    "title": response.err_title,
                                    "text": response.err_msg + ". Code d'erreur " + response.err_code,
                                    "type": "error",
                                    "confirmButtonClass": "btn btn-secondary",
                                });
                            }
                        },
                        error: function(error) {
                            unloader("#kt_form");
                            $('#btn_next').removeClass(
                                'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr(
                                'disabled', false);
                            swal.fire({
                                "title": "Erreur interne",
                                "text": "Une erreur est survenue dans le serveur",
                                "type": "error",
                                "confirmButtonClass": "btn btn-secondary",
                            });
                        }

                    });
                }


            }

        }

        function stepTwoValidate(wizardObj, phone_number, code) {

            document.getElementById('btn_prev').className = "btn btn-secondary btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u";

            if (validator.form() !== true) {
                unloader("#kt_form");
                $('#btn_next').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled',
                    false);
                return;

            } else {
                datas.transmitter.firstname = $("#trans_firstname_id").val();
                datas.transmitter.lastname = $("#trans_lastname_id").val();
                datas.transmitter.email = $("#trans_email_id").val();
                datas.phone_number = getPhoneNumberInternational().number
                datas.transmitter.phone_number = getPhoneNumberInternational().number
                datas.transmitter.type_cni = $("#trans_type_cni_id").val();
                datas.transmitter.cni = $("#trans_cni_id").val();
                datas.transmitter.date_cni = $("#trans_date_cni_id").val();
                datas.password = $("#password_id").val();
                $.ajax({
                url: "{{route('spx.op.preview.connect_user_for_inter_trans')}}",
                type: 'GET',
                dataType:'JSON',
                data: datas,
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')},
                success: function(response, status) { // success est toujours en place, bien sûr !
                    unloader("#kt_form");
                    $('#btn_next').removeClass(
                        'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr(
                        'disabled', false);
                    if (response.status === 1) {
                        wizardObj.goNext();
                        $("#recap_inter_trans").html(response.msg['preview']);
                    } else {
                        swal.fire({
                            "title": response.err_title,
                            "text": response.err_msg + ". Code d'erreur " + response.err_code,
                            "type": "error",
                            "confirmButtonClass": "btn btn-secondary",
                        });
                    }
                },
                error: function(error) {
                    unloader("#kt_form");
                    $('#btn_next').removeClass(
                        'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr(
                        'disabled', false);
                    swal.fire({
                        "title": "Erreur interne",
                        "text": "Une erreur est survenue dans le serveur",
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary",
                    });
                }

            });

            }
        }

        function stepThreeValidate(wizardObj, phone_number){
            document.getElementById('btn_prev').className = "btn btn-secondary btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u";

            if (validator.form() !== true) {
                unloader("#kt_form");
                $('#btn_next').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled',
                    false);
                return;

            }else{
                $.ajax({
                    url: "{{route('spx.op.post.com_offline_inter_trans')}}",
                    type: 'GET',
                    dataType:'JSON',
                    data: datas,
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')},
                    success: function(response, status) { // success est toujours en place, bien sûr !
                        unloader("#kt_form");
                        $('#btn_next').removeClass(
                            'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr(
                            'disabled', false);
                        if (response.status === 1) {
                            wizardObj.goNext();
                            $('#montant_id').html(response.amount);
                            $('#frais_operateur_id').html(response.fees);
                            $('#commission_id').html(response.commission);
                            $('#total_id').html(response.total);
                        } else {
                            swal.fire({
                                "title": response.err_title,
                                "text": response.err_msg + ". Code d'erreur " + response.err_code,
                                "type": "error",
                                "confirmButtonClass": "btn btn-secondary",
                            });
                        }
                    },
                    error: function(error) {
                        unloader("#kt_form");
                        $('#btn_next').removeClass(
                            'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr(
                            'disabled', false);
                        swal.fire({
                            "title": "Erreur interne",
                            "text": "Une erreur est survenue dans le serveur",
                            "type": "error",
                            "confirmButtonClass": "btn btn-secondary",
                        });
                    }

                });
            }
        }

        function transfertValidate(wizard,phone_number){
            if (validator.form() !== true) {
                unloader("#kt_form");
                $('#btn_next').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled',
                    false);
                return;

            }else{
                $.ajax({
                    url: "{{route('spx.op.post.offline_international_transfert')}}",
                    type: 'GET',
                    dataType:'JSON',
                    data: datas,
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')},
                    success: function(response, status) { // success est toujours en place, bien sûr !
                        unloader("#kt_form");
                        $('#btn_next').removeClass(
                            'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr(
                            'disabled', false);
                        if (response.status === 1) {
                            wizardObj.goNext();
                            $('#montant_id').html(response.amount);
                            $('#frais_operateur_id').html(response.fees);
                            $('#commission_id').html(response.commission);
                            $('#total_id').html(response.total);
                        } else {
                            swal.fire({
                                "title": response.err_title,
                                "text": response.err_msg + ". Code d'erreur " + response.err_code,
                                "type": "error",
                                "confirmButtonClass": "btn btn-secondary",
                            });
                        }
                    },
                    error: function(error) {
                        unloader("#kt_form");
                        $('#btn_next').removeClass(
                            'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr(
                            'disabled', false);
                        swal.fire({
                            "title": "Erreur interne",
                            "text": "Une erreur est survenue dans le serveur",
                            "type": "error",
                            "confirmButtonClass": "btn btn-secondary",
                        });
                    }

                });
            }
        }
        function formSubmit(form, btn) {
            console.log("process here ");

            if (validator.form() !== true) {
                KTApp.unprogress(btn);
                unloader("#kt_form");

            } else {
                $.ajax({
                    url: "{{route('spx.op.post.offline_international_transfert')}}",
                    type: 'POST',
                    dataType:'JSON',
                    data: datas,
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')},
                    success: function(response, status) { // success est toujours en place, bien sûr !
                        unloader("#kt_form");
                        $('#btn_next').removeClass(
                            'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr(
                            'disabled', false);
                        if (response.status === 1) {
                            window.location.href = response.url;
                        } else {
                            swal.fire({
                                "title": response.err_title,
                                "text": response.err_msg + ". Code d'erreur " + response.err_code,
                                "type": "error",
                                "confirmButtonClass": "btn btn-secondary",
                            });
                        }
                    },
                    error: function(error) {
                        unloader("#kt_form");
                        $('#btn_next').removeClass(
                            'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr(
                            'disabled', false);
                        swal.fire({
                            "title": "Erreur interne",
                            "text": "Une erreur est survenue dans le serveur",
                            "type": "error",
                            "confirmButtonClass": "btn btn-secondary",
                        });
                    }

                });
            }
        }

       /* function formSubmit(form, btn) {console.log(form);

            if (validator.form() !== true) {
                KTApp.unprogress(btn);
                unloader("#kt_form");

            } else {
                form.ajaxSubmit({
                    url: "{{ route('spx.signup.validate') }}",
                    method: "POST",
                    data: {
                        phone_number: getPhoneNumberInternational().number
                    },
                    success: function(response, status, xhr, $form) {
                        unloader("#kt_form");
                        KTApp.unprogress(btn);console.log(response);
                        //alert(JSON.stringify(response));
                        if (response.status === 1) {
                            window.location.href = "{{ route('spx.home') }}";
                        } else {console.log(response);
                            swal.fire({
                                "title": response.err_title,
                                "text": response.err_msg + ". Code d'erreur " + response.err_code,
                                "type": "error",
                                "confirmButtonClass": "btn btn-secondary",
                            });
                        }

                    },
                    error: function(error) {
                        unloader("#kt_form");
                        KTApp.unprogress(btn);
                        swal.fire({
                            "title": "Erreur interne",
                            "text": "Une erreur est survenue dans le serveur",
                            "type": "error",
                            "confirmButtonClass": "btn btn-secondary",
                        });
                    }
                });
            }
        }*/
    </script>

    <!--end::Page Scripts -->
</body>

<!-- end::Body -->

</html>
