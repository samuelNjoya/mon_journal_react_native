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


    <!--end::Base Path -->
    <meta charset="utf-8" />
    <title>Connexion | SesamPayx</title>
    <meta name="description" content="Login page example">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!--begin::Fonts -->
    <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js"></script>
    <script>
        WebFont.load({
            google: {
                "families": ["Poppins:300,400,500,600,700", "Roboto:300,400,500,600,700"]
            },
            active: function() {
                sessionStorage.fonts = true;
            }
        });
    </script>

    <!--end::Fonts -->

    <!--begin::Page Custom Styles(used by this page) -->
    <link href="./assets/css/demo1/pages/login/login-1.css" rel="stylesheet" type="text/css" />

    <!--end::Page Custom Styles -->

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
    <link href="./assets/css/demo1/style.bundle.css" rel="stylesheet" type="text/css" />
    <link href="./assets/css/intlTelInput.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="./assets/country_select/build/css/countrySelect.css">

    <!--end::Global Theme Styles -->

    <!--begin::Layout Skins(used by all pages) -->
    <link href="./assets/css/demo1/skins/header/base/light.css" rel="stylesheet" type="text/css" />
    <link href="./assets/css/demo1/skins/header/menu/light.css" rel="stylesheet" type="text/css" />
    <link href="./assets/css/demo1/skins/brand/dark.css" rel="stylesheet" type="text/css" />
    <link href="./assets/css/demo1/skins/aside/dark.css" rel="stylesheet" type="text/css" />

    <!--end::Layout Skins -->
    <link rel="shortcut icon" href="./assets/media/logos/logo_sesampayx.png" />
    <style>
        @media only screen and (max-width: 1024px) {
            #login_aside {
                display: none !important;
            }
        }

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
    class="kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--fixed kt-subheader--solid kt-aside--enabled kt-aside--fixed kt-page--loading">

    <!-- begin:: Page -->
    <div class="kt-grid kt-grid--ver kt-grid--root">
        <div class="kt-grid kt-grid--hor kt-grid--root  kt-login kt-login--v1" id="kt_login">
            <div
                class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--desktop kt-grid--ver-desktop kt-grid--hor-tablet-and-mobile">

                <!--begin::Aside-->
                <div id="login_aside"
                    class="kt-grid__item kt-grid__item--order-tablet-and-mobile-2 kt-grid kt-grid--hor kt-login__aside"
                    style="background-image: url({{ asset('img/fond.jpg') }}); background-size:cover; width:65%;">
                </div>

                <!--begin::Aside-->

                <!--begin::Content-->
                <div class="kt-grid__item kt-grid__item--fluid  kt-grid__item--order-tablet-and-mobile-1  kt-login__wrapper"
                    style="background-color: #f0f0f0">

                    <!--begin::Head-->
                    <div class="kt-login__head">
                        <span class="kt-login__signup-label">Vous n'avez pas encore de compte?</span>&nbsp;&nbsp;
                        <a href="{{ route('spx.signup') }}" class="kt-link kt-login__signup-link">Ouvrez un compte!</a>
                    </div>
                    <!--end::Head-->

                    <!--begin::Body-->
                    <div class="kt-login__body">

                        <!--begin::Signin-->
                        <div id="login_block" class="kt-login__form"
                            style="background-color: white; padding: 30px 20px; border-radius: 8px">
                            <div class="kt-grid__item">
                                <a href="#" class="kt-login__logo">

                                </a>
                            </div>
                            <div class="kt-login__title">
                                <img src="./assets/media/logos/logo_sesampayx.png" style="width: 70px;">
                                <h6 class="kt-login__title" style="margin: 12px;">Bienvenue sur SesamPayx, votre
                                    plateforme d'avantages et de services!</h6>
                                <h3 class="kt-login__title" style="color: #000000;font-weight: bold;">Connexion</h3>
                            </div>

                            <!--begin::Form-->
                            <form class="kt-form" method="POST" id="kt_login_form">
                                @csrf
                                <div class="form-group">
                                    <div class="input-group">
                                        <input type="tel" class="form-control"
                                            placeholder="Entrez votre numéro de télèphone" name="phone_number_"
                                            id="phone_number" autocomplete="off">
                                    </div>
                                    <span id="phone_number_not_valid" class="form-text text-muted d-none"
                                        style="color: #fd397a !important;">Numéro de téléphone incorrect</span>
                                    <!--<span class="form-text text-muted">Votre numéro de téléphone doit être au format
                                        international.</span>-->
                                </div>
                                <div class="form-group">
                                    <input class="form-control" type="password" placeholder="Mot de passe"
                                        name="password">
                                </div>

                                <div class="form-group">
                                    <a href="{{ route('spx.get.forgotpsw') }}" class="kt-link kt-login__signup-link">
                                        Mot de passe oublié ?
                                    </a>
                                </div>
                                <!--begin::Action-->
                                <div class="kt-login__actions">
                                    <a href="#" class="kt-link kt-login__signup-link">

                                    </a>
                                    <button id="kt_login_signin_submit"
                                        class="btn btn-warning btn-elevate kt-login__btn-warning"
                                        style="width:100%;">Connexion</button>
                                </div>

                                <!--end::Action-->
                            </form>

                            <!--end::Form-->
                            <div class="kt-grid__item">
                                <div class="kt-login__info">
                                    <div class="kt-login__copyright" style="color: #000000;">
                                        &copy 2021 Sesame Financial Services
                                    </div>
                                </div>
                            </div>

                            <!--end::Options-->
                        </div>

                        <!--end::Signin-->
                    </div>

                    <!--end::Body-->
                </div>

                <!--end::Content-->
            </div>
        </div>
    </div>

    <!-- Modal du transfert international step1 en mode non connecté-->
    <div class="modal fade" id="inter_trans1" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="document" id="modal_content">
        <div class="modal-content">
            <div class="modal-header opmodal-header">
                {{-- <img src="./assets/media/logos/logo_sesampayx.png" style="width: 50px;"> --}}
                <h5 class="modal-title opmodal-title" id="exampleModalLabel">Transfert d'Argent International</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <div class="modal-body" id="international_transfert1_body">

            </div>
        </div>
    </div>
    </div>

    <!-- end:: Page -->

    <!-- begin::Global Config(global config for global JS sciprts) -->
    <script>
        var KTAppOptions = {
            "colors": {
                "state": {
                    "brand": "#5d78ff",
                    "dark": "#282a3c",
                    "light": "#ffffff",
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
    <script src="./assets/vendors/general/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js" type="text/javascript"></script>
    <script src="./assets/vendors/custom/js/vendors/bootstrap-datepicker.init.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/bootstrap-datetime-picker/js/bootstrap-datetimepicker.min.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/bootstrap-timepicker/js/bootstrap-timepicker.min.js" type="text/javascript"></script>
    <script src="./assets/vendors/custom/js/vendors/bootstrap-timepicker.init.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/bootstrap-daterangepicker/daterangepicker.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/bootstrap-maxlength/src/bootstrap-maxlength.js" type="text/javascript"></script>
    <script src="./assets/vendors/custom/vendors/bootstrap-multiselectsplitter/bootstrap-multiselectsplitter.min.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/bootstrap-select/dist/js/bootstrap-select.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/bootstrap-switch/dist/js/bootstrap-switch.js" type="text/javascript"></script>
    <script src="./assets/vendors/custom/js/vendors/bootstrap-switch.init.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/select2/dist/js/select2.full.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/ion-rangeslider/js/ion.rangeSlider.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/typeahead.js/dist/typeahead.bundle.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/handlebars/dist/handlebars.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/inputmask/dist/jquery.inputmask.bundle.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/inputmask/dist/inputmask/inputmask.date.extensions.js" type="text/javascript"></script>
    <script src="./assets/vendors/general/inputmask/dist/inputmask/inputmask.numeric.extensions.js" type="text/javascript"></script>
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
    <script src="./assets/vendors/custom/vendors/bootstrap-session-timeout/dist/bootstrap-session-timeout.min.js"type="text/javascript"></script>
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
    <script src="./assets/js/demo1/scripts.bundle.js" type="text/javascript"></script>
    <script src="//rum-static.pingdom.net/pa-60a8ed73541c6000110000b0.js" async></script>

    <script src="./assets/js/intlTelInput-jquery.min.js" type="text/javascript"></script>
    <script src="./assets/js/intlTelInput.js" type="text/javascript"></script>
    <script src="./assets/country_select/build/js/countrySelect.min.js"></script>

    <!--end::Global Theme Bundle -->

    @include("layout.script")
    <!--begin::Page Scripts(used by this page) -->
    <script>
        "use strict";

        // Class Definition
        var KTLoginV1 = function() {

            var login = $('#kt_login');

            var showErrorMsg = function(form, type, msg) {
                var alert = $('<div class="kt-alert kt-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
                                    			<button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
                                    			<span></span>\
                                    		</div>');

                form.find('.alert').remove();
                alert.prependTo(form);
                //alert.animateClass('fadeIn animated');
                KTUtil.animateClass(alert[0], 'fadeIn animated');
                alert.find('span').html(msg);
            }

            // Private Functions

            var handleSignInFormSubmit = function() {
                $('#kt_login_signin_submit').click(function(e) {
                    $("#phone_number_not_valid").addClass("d-none")
                    e.preventDefault();
                    var btn = $(this);
                    //var form = $('#kt_login_form');
                    let form = $(this).closest('form');

                    form.validate({
                        rules: {
                            phone_number_: {
                                required: true,
                            },
                            password: {
                                required: true
                            }
                        },
                        messages: {
                            phone_number_: {
                                required: "Ce champ est requis",
                                minlength: "Vous devez entrer un numéro à 9 chiffres",
                                maxlength: "Vous devez entrer un numéro à 9 chiffres"
                            },
                            password: {
                                required: "Ce champ est requis"
                            }
                        }
                    });

                    if (!form.valid()) {
                        return;
                    }

                    if (!getPhoneNumberInternational().isValid) {
                        $("#phone_number_not_valid").removeClass("d-none")
                        return
                    }


                    btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr(
                        'disabled', true);
                    loader("#login_block");
                    form.ajaxSubmit({
                        url: "{{ route('spx.signin.validate') }}",
                        method: "POST",
                        data: {
                            phone_number: getPhoneNumberInternational().number
                        },
                        success: function(response, status, xhr, $form) {
                            window.location.href = "{{ route('spx.home') }}"
                        },
                        error: function(error) {
                            console.log(error)
                            let responseText = JSON.parse(error.responseText);
                            btn.removeClass(
                                'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light'
                            ).attr('disabled', false);
                            unloader("#login_block");
                            showErrorMsg(form, 'danger', responseText.err_title + ": " +
                                responseText.err_msg);
                            //alert(JSON.stringify(errors.responseText));
                        }
                    });
                });
            }

            // Public Functions
            return {
                // public functions
                init: function() {
                    handleSignInFormSubmit();
                }
            };
        }();

        // Class Initialization
        jQuery(document).ready(function() {
            KTLoginV1.init();
            getCountry("{{ $country_code }}")

            $("#inter_trans_step1").click(function() {
                loader("#inter_trans1");
                ajaxSubmit({
                    url: "{{ route('spx.op.get.international_transfert1') }}",
                }, function(data) {
                    if (data.status === 1) {
                        $(".modal-header").css("background-color", "#fddb2c");
                        $(".opmodal-title").css("color", "#000");
                        $("#international_transfert1_body").html(data.view);
                        data.withdrawal_modes.map(function(elt) {
                            $("#select_withdrawal_method").append("<option value="+elt.value+">"+elt.label+"</option>")
                        });
                        //init_inter_trans_form();
                        getCountryInterTrans("{{ $country_code }}");
                        $("#country_1").countrySelect({
                            defaultCountry: "{{$country_code ?? ""}}".toLowerCase()
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
                        //desactiver le loader
                        unloader("#inter_trans1")

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

                        //lorsqu'on soumet le formulaire
                        //lorsqu'on soumet le formulaire
                        $('#kt_international_transfert1').click(function(e) {
                            e.preventDefault();
                            let international_transf_btn = $(this);
                            //let form = $('.kt-login__form');
                            let international_transfert_form = $("#international_transfert1_form");
                            //let international_transfert_form = $(this).closest('form');
                            international_transfert_form.validate({
                                ignore: ":hidden",
                                rules: {
                                    lastname: {
                                        required: true
                                    },
                                    firstname: {
                                        required: true
                                    },
                                    phone_number_1: {
                                        required: true,
                                        /*minlength: 9,
                                        maxlength: 9*/
                                    },
                                    country: {
                                        required: true,
                                        /*minlength: 9,
                                        maxlength: 9*/
                                    },
                                    type_cni: {
                                        required: true,
                                        /*minlength: 9,
                                        maxlength: 9*/
                                    },
                                    cni: {
                                        required: true,
                                        /*minlength: 9,
                                        maxlength: 9*/
                                    },
                                    amount: {
                                        required: true,
                                        min: 0,
                                    }
                                },
                                messages: {
                                    lastname: {
                                        required: "Ce champs est requis"
                                    },
                                    country: {
                                        required: "Ce champs est requis"
                                    },
                                    type_cni: {
                                        required: "Ce champs est requis"
                                    },
                                    cni: {
                                        required: "Ce champs est requis"
                                    },
                                    firstname: {
                                        required: "Ce champs est requis"
                                    },
                                    phone_number_1: {
                                        required: "Ce champs est requis",
                                        minlength: "la longueur de ce champs est de 9",
                                        maxlength: "la longueur de ce champs est de 9"
                                    },
                                    amount: {
                                        required: "Ce champs est requis",
                                        min: "Le montant doit être une valeur supérieure à 0",
                                    }
                                }
                            });


                            if (!international_transfert_form.valid()) {
                                return;
                            }

                            if (!getPhoneNumberInternational().isValid) {
                                $("#sesampayx_phone_number_not_valid").removeClass("d-none")
                                return
                            }

                            loader("#international_transfert_body1");
                            international_transf_btn.addClass(
                                    'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light')
                                .attr('disabled', true);
                            international_transfert_form.ajaxSubmit({
                                url: "{{ route('spx.op.preview.noconnectedcheckAccount') }}",
                                method: "POST",
                                data: {
                                    phone_number: getPhoneNumberInternational().number
                                },
                                success: function(response, status, xhr, $form) {
                                    unloader("#international_transfert_body");
                                    international_transf_btn.removeClass(
                                        'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light'
                                    ).attr('disabled', false);
                                    if (response.status === 1) {
                                        $('#international_transfert1_body').html(response.view);
                                        getCountryInterTrans2("{{ $country_code }}");
                                    } else if (response.status === 0) {
                                        swal.fire({
                                            "title": response.err_title,
                                            "text": response.err_msg +
                                                ". Code d'erreur " + response.err_code,
                                            "type": "error",
                                            "confirmButtonClass": "btn btn-secondary",
                                        });
                                    } else if (response.status === -1) {
                                        loader("#international_transfert_body");
                                        window.location.href =
                                            "{{ route('spx.signin') }}"
                                    }

                                },
                                error: function(error) {
                                    unloader("#international_transfert_body");
                                    international_transf_btn.removeClass(
                                        'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light'
                                    ).attr('disabled', false);
                                    let responseText = JSON.parse(error.responseText);
                                    swal.fire({
                                        "title": responseText.err_title,
                                        "text": responseText.err_msg +
                                            ". Code d'erreur " + responseText
                                            .err_code,
                                        "type": "error",
                                        "confirmButtonClass": "btn btn-warning",
                                        "onClose": function(e) {
                                            console.log(
                                                'on close event fired!');
                                        }
                                    });
                                }
                            });

                        });
                    } else if (data.status === -1) {
                        console.log(data);
                        //window.location.href = "{{ route('spx.signin') }}"
                    }

                }, function(error) {
                    unloader("#international_transfert");
                    alert("Erreur");
                });

            });

            $("#inter_trans_step2").click(function() {
                loader("#inter_trans1");
            });
            $('#phone_number_2').on('change',function(e){
                console.log("toto");
            });

        });
    </script>
    {{-- <script src="./assets/js/demo1/pages/login/login-1.js" type="text/javascript"></script> --}}

    <!--end::Page Scripts -->
</body>

<!-- end::Body -->

</html>
