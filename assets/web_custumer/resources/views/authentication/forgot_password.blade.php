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

    <!--end::Base Path -->
    <meta charset="utf-8" />
    <title>Mot de passe oublié | SesamPayx</title>
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

    <!--end::Global Theme Styles -->

    <!--begin::Layout Skins(used by all pages) -->

    <!--end::Layout Skins -->
    <link rel="shortcut icon" href="./assets/media/logos/logo_sesampayx.png" />
    <style>
        .iti {
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
                    <b style="color: #000;">Mot de passe oublié </b>
                </span>
            </div>
        </div>
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
                                    <b style="color: #000;">Mot de passe oublié </b>
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
                                                                    <span>1</span> Numéro de Téléphone
                                                                </div>
                                                                <div class="kt-wizard-v3__nav-bar"></div>
                                                            </div>
                                                        </div>
                                                        <div class="kt-wizard-v3__nav-item" data-ktwizard-type="step"
                                                            data-wizard-clickable="false">
                                                            <div class="kt-wizard-v3__nav-body">
                                                                <div class="kt-wizard-v3__nav-label">
                                                                    <span>2</span> Réponses secretes
                                                                </div>
                                                                <div class="kt-wizard-v3__nav-bar"></div>
                                                            </div>
                                                        </div>
                                                        <div class="kt-wizard-v3__nav-item" data-ktwizard-type="step"
                                                            data-wizard-clickable="false">
                                                            <div class="kt-wizard-v3__nav-body">
                                                                <div class="kt-wizard-v3__nav-label">
                                                                    <span>3</span> Nouveau mot de passe
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
                                                        <div class="kt-heading kt-heading--md">Numéro de Téléphone</div>
                                                        <div class="kt-form__section kt-form__section--first">
                                                            <div class="kt-wizard-v3__form">
                                                                <p>Dans le but de vous permettre de restaurer votre mot
                                                                    de passe, nous vous prions de repondre à un ensemble
                                                                    de questions. Pour commencer, veuillez entrer votre
                                                                    numéro de téléphone</p>
                                                                <div class="form-group">
                                                                    <label>Numéro de téléphone</label>

                                                                    <div class="input-group">
                                                                        <!-- <div class="input-group-prepend"><span
                                                                                class="input-group-text"><i
                                                                                    class="la la-phone"></i>+237</span>
                                                                        </div>-->
                                                                        <input type="text" class="form-control"
                                                                            id="phone_number" name="phone_number_"
                                                                            placeholder="Entrez votre numéro de télèphone">
                                                                    </div>
                                                                    <span id="phone_number_not_valid"
                                                                        class="form-text text-muted d-none"
                                                                        style="color: #fd397a !important;">Numéro de
                                                                        téléphone incorrect</span>
                                                                    <!--<span class="form-text text-muted">Votre numéro de téléphone doit être au format
                                                                        international.</span>-->
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!--end: Form Wizard Step 1-->

                                                    <!--begin: Form Wizard Step 2-->
                                                    <div class="kt-wizard-v3__content"
                                                        data-ktwizard-type="step-content">
                                                        <div class="kt-heading kt-heading--md">Reponses secrètes</div>
                                                        <div class="kt-form__section kt-form__section--first">
                                                            <div class="kt-wizard-v3__form" id="secret_ans">

                                                            </div>
                                                        </div>
                                                    </div>

                                                    <!--end: Form Wizard Step 2-->

                                                    <!--begin: Form Wizard Step 3-->
                                                    <div class="kt-wizard-v3__content"
                                                        data-ktwizard-type="step-content">
                                                        <div class="kt-heading kt-heading--md">Code de validation</div>
                                                        <div class="kt-form__section kt-form__section--first">
                                                            <div class="kt-wizard-v3__form">
                                                                <p>Nous avons envoyé un code de validation au numéro
                                                                    entré précédement. Veuillez l'entrer ci dessous afin
                                                                    de restaurer votre mot de passe</p>

                                                                <div class="form-group">
                                                                    <label>Code de restauration du mot de passe</label>
                                                                    <input type="text" class="form-control"
                                                                        name="code">
                                                                </div>
                                                                <div class="form-group">
                                                                    <label>Nouveau Mot de passe</label>
                                                                    <input type="password" class="form-control"
                                                                        name="password" id="password">
                                                                </div>
                                                                <div class="form-group">
                                                                    <label>Confirmez votre mot de passe</label>
                                                                    <input type="password" class="form-control"
                                                                        name="confirm_password">
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!--end: Form Wizard Step 3-->

                                                    <!--begin: Form Actions -->
                                                    <div class="kt-form__actions">
                                                        <div class="btn btn-secondary btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u"
                                                            data-ktwizard-type="action-prev">
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

        var KTWizard3 = function() {
            // Base elements
            var wizardEl;
            var formEl;

            // Private functions
            var initWizard = function() {
                // Initialize form wizard
                wizard = new KTWizard('kt_wizard_v3', {
                    startStep: 1,
                    clickableSteps: true
                });

                // Validation before going to next page
                wizard.on('beforeNext', function(wizardObj) {
                    wizardObject = wizardObj;
                });

                wizard.on('beforePrev', function(wizardObj) {
                    // if (validator.form() !== true) {
                    //     wizardObj.stop();  // don't go to the next step
                    // }
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
                        //= Step 1
                        phone_number: {
                            required: true
                        },

                        //= Step 3
                        code: {
                            required: true
                        },
                        password: {
                            required: true
                        },
                        confirm_password: {
                            required: true,
                            equalTo: "#password"
                        }
                    },
                    messages: {
                        phone_number: {
                            required: "Ce champ est requis",
                            minlength: "Vous devez entrer un numéro à 9 chiffres",
                            maxlength: "Vous devez entrer un numéro à 9 chiffres"
                        },

                        //= Step 3
                        code: {
                            required: "Ce champ est requis"
                        },
                        password: {
                            required: "Ce champ est requis"
                        },
                        confirm_password: {
                            required: "Ce champ est requis",
                            equalTo: "Les mot de passe ne correspondent pas"
                        }
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
                        formSubmit(form);
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
            next_button.unbind().click(function() {

                $("#phone_number_not_valid").addClass("d-none")

                if (wizard.getStep() === 1) {

                    if (getPhoneNumberInternational().isValid) {
                        loader("#kt_form");
                        $('#btn_next').addClass(
                                'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light')
                            .attr('disabled', true);
                        fpgetQuestions(wizard, getPhoneNumberInternational().number);
                    } else {
                        $("#phone_number_not_valid").removeClass("d-none")
                    }
                } else if (wizard.getStep() === 2) {

                    if (getPhoneNumberInternational().isValid) {
                        loader("#kt_form");
                        $('#btn_next').addClass(
                                'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light')
                            .attr('disabled', true);
                        getRecoveryCode(wizard, getPhoneNumberInternational().number)
                    } else {
                        $("#phone_number_not_valid").removeClass("d-none")
                    }
                } else {
                    if (validator.form() === true) {
                        wizard.goNext();
                    }
                }
            })

            getCountry("{{ $country_code }}")
        });

        function fpgetQuestions(wizardObj, phone_number) {
            // unloader("#kt_form");
            // $('#btn_next').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
            // wizardObj.goNext();
            if (validator.form() !== true) {
                unloader("#kt_form");
                $('#btn_next').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled',
                    false);
            } else {
                $.ajax({
                    url: "{{ route('spx.recov.questions') }}",
                    method: 'POST',
                    dataType: "JSON",
                    async: true,
                    data: JSON.stringify({
                        "_token": "{{ csrf_token() }}",
                        phone_number: phone_number
                    }),
                    contentType: "application/json",
                    cache: false,
                    processData: false,
                    success: function(response, status) { // success est toujours en place, bien sûr !
                        unloader("#kt_form");
                        $('#btn_next').removeClass(
                            'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr(
                            'disabled', false);
                        if (response.status === 1) {
                            if (response.questions.length > 0) {
                                let content = $('#secret_ans');
                                content.empty();
                                for (let i = 0; i < response.questions.length; i++) {
                                    content.append("<div class=\"form-group questions\">\n" +
                                        "<label id='" + response.questions[i].id_question + "'>" + response
                                        .questions[i].question + "</label>\n" +
                                        "<input type=\"hidden\" id=\"id_question" + i + "\" value=\"" +
                                        response.questions[i].id_question + "\">\n" +
                                        "<input type=\"text\" class=\"form-control\" id=\"answer" + i +
                                        "\" name=\"answer" + i + "\">\n" +
                                        "</div>");
                                }
                                wizardObj.goNext();
                            } else {
                                swal.fire({
                                    title: 'Pas de question secrete',
                                    text: "Vous n'avez pas encore enregistré de questions secrète! Pour rentrer en possession de votre mot de passe, veuillez vous rapprocher d'un point de vente Sesame Financial Services ou partenaire ou contactez le numéro suivant : +237 670 03 45 45",
                                    type: 'warning',
                                    showCancelButton: false,
                                    confirmButtonText: 'Ok'
                                });
                            }
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

        function getRecoveryCode(wizardObj, phone_number) {
            //construction de l'objet answers
            let answers = [];
            let questions_divs = $('.questions');
            for (let i = 0; i < questions_divs.length; i++) {
                let current_answer_id = '#answer' + i;
                let current_question_id = '#id_question' + i;
                answers.push({
                    id_question: $(current_question_id).val(),
                    answer_value: $(current_answer_id).val()
                });
            }
            $.ajax({
                url: "{{ route('spx.recov.code') }}",
                method: 'POST',
                dataType: "JSON",
                async: true,
                data: JSON.stringify({
                    "_token": "{{ csrf_token() }}",
                    phone_number: phone_number,
                    answers: answers
                }),
                contentType: "application/json",
                cache: false,
                processData: false,
                success: function(response, status) { // success est toujours en place, bien sûr !
                    unloader("#kt_form");
                    $('#btn_next').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light')
                        .attr('disabled', false);
                    //alert(JSON.stringify(response));
                    if (response.status === 1) {
                        wizardObj.goNext();
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
                    $('#btn_next').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light')
                        .attr('disabled', false);
                    swal.fire({
                        "title": "Erreur interne",
                        "text": "Une erreur est survenue dans le serveur",
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary",
                    });
                }

            });
        }

        function formSubmit(form, btn) {

            if (validator.form() !== true) {
                KTApp.unprogress(btn);
                unloader("#kt_form");
            } else {
                form.ajaxSubmit({
                    url: "{{ route('spx.recov.password') }}",
                    method: "POST",
                    data: {
                        phone_number: getPhoneNumberInternational().number
                    },
                    success: function(response, status, xhr, $form) {
                        unloader("#kt_form");
                        KTApp.unprogress(btn);
                        //alert(JSON.stringify(response));
                        if (response.status === 1) {
                            swal.fire({
                                title: 'Mot de passe modifié avec Succès',
                                text: "Votre mot de passe a été modifié. Vous serez reconduit dans la page de connection afin d'acceder à votre compte!",
                                type: 'success',
                                showCancelButton: false,
                                confirmButtonText: 'Ok'
                            }).then(function(result) {
                                if (result.value) {
                                    window.location.href = "{{ route('spx.signin') }}";
                                }
                            });
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
        }
    </script>

    <!--end::Page Scripts -->
</body>

<!-- end::Body -->

</html>
