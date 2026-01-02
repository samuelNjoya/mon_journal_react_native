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
    <title>@yield('title')</title>
    <meta name="description" content="Latest updates and statistic charts">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}" />

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

    <!--end::Fonts -->
    <link href="./assets/css/demo1/pages/pricing/pricing-4.css" rel="stylesheet" type="text/css" />
    <!--begin::Page Vendors Styles(used by this page) -->
    <link href="./assets/vendors/custom/fullcalendar/fullcalendar.bundle.css" rel="stylesheet" type="text/css" />

    <!--end::Page Vendors Styles -->

    <!--begin:: Global Mandatory Vendors -->
    <link href="./assets/vendors/general/perfect-scrollbar/css/perfect-scrollbar.css" rel="stylesheet"
        type="text/css" />

    <!--end:: Global Mandatory Vendors -->
    <link href="./assets/css/demo1/pages/wizard/wizard-2.css" rel="stylesheet" type="text/css" />

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
    <link href="./assets/css/wizard.css" rel="stylesheet" type="text/css" />

    <!--end:: Global Optional Vendors -->

    <!--begin::Global Theme Styles(used by all pages) -->
    <link href="./assets/css/demo11/style.bundle.css" rel="stylesheet" type="text/css" />
    <link href="./assets/css/style.css" rel="stylesheet" type="text/css" />
    <link href="./assets/css/intlTelInput.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="./assets/country_select/build/css/countrySelect.css">

    <!--end::Global Theme Styles -->

    <!--begin::Layout Skins(used by all pages) -->

    <!--end::Layout Skins -->
    <link rel="shortcut icon" href="./assets/media/logos/logo_sesampayx.png" />

    <style>
        .iti, .country-select {
            width: 100% !important;
        }

    </style>
     <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
</head>

<!-- end::Head -->

<!-- begin::Body -->

<body
    class="kt-page-content-white kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--transparent kt-aside--enabled kt-aside--fixed kt-page--loading">

    <!-- begin:: Page -->

    <!-- begin:: Header Mobile -->
    <div id="kt_header_mobile" class="kt-header-mobile  kt-header-mobile--fixed " style="background-color: #fddb2c;">
        <div class="kt-header-mobile__logo">
            <a href="#">
                <img alt="Logo" src="./assets/media/logos/logo_sesampayx.png" style="height: 50px" />
            </a>
        </div>
        <div class="kt-header-mobile__toolbar">
            <button class="kt-header-mobile__toolbar-toggler kt-header-mobile__toolbar-toggler--left"
                id="kt_aside_mobile_toggler"><span></span></button>
            <button class="kt-header-mobile__toolbar-topbar-toggler" id="kt_header_mobile_topbar_toggler"><i
                    class="flaticon-more-1"></i></button>
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
                                <a href="#">
                                    <img alt="Logo" src="./assets/media/logos/logo_sesampayx.png"
                                        style="height: 50px" />
                                </a>
                            </div>
                        </div>

                        <!-- end:: Brand -->

                        <!-- begin:: Header Topbar -->
                        <div class="kt-header__topbar">



                            <!--begin: Notifications -->
                            {{-- <div class="kt-header__topbar-item dropdown"> --}}
                            {{-- <div class="kt-header__topbar-wrapper" data-toggle="dropdown" data-offset="10px,0px"> --}}
                            {{-- <span class="kt-header__topbar-icon"><i class="flaticon2-bell-alarm-symbol" style="color: black;"></i></span> --}}
                            {{-- <span class="kt-hidden kt-badge kt-badge--danger"></span> --}}
                            {{-- </div> --}}
                            {{-- </div> --}}

                            {{-- <!--end: Notifications --> --}}

                            {{-- <!--begin: Quick actions --> --}}
                            {{-- <div class="kt-header__topbar-item dropdown"> --}}
                            {{-- <div class="kt-header__topbar-wrapper" data-toggle="dropdown" data-offset="10px,0px"> --}}
                            {{-- <span class="kt-header__topbar-icon"><i class="flaticon2-gear" style="color: black;"></i></span> --}}
                            {{-- </div> --}}
                            {{-- </div> --}}

                            <!--end: Quick actions -->


                            <!--begin: Language bar -->
                            {{-- <div class="kt-header__topbar-item kt-header__topbar-item--langs"> --}}
                            {{-- <div class="kt-header__topbar-wrapper" data-toggle="dropdown" data-offset="10px,0px"> --}}
                            {{-- <span class="kt-header__topbar-icon"> --}}
                            {{-- <img class="" src="./assets/media/flags/019-france.svg" alt="" /> --}}
                            {{-- </span> --}}
                            {{-- </div> --}}

                            {{-- </div> --}}

                            <!--end: Language bar -->

                            <!--begin: User bar -->
                            <div class="kt-header__topbar-item kt-header__topbar-item--user">

                                @if (\Session::get('home') !== null)
                                    <div class="kt-header__topbar-wrapper" data-toggle="dropdown"
                                        data-offset="10px,0px">
                                        <span class="kt-header__topbar-username kt-visible-desktop"
                                            style="color:black;">
                                            <b>
                                                {{ Session::get('home')->username }}
                                            </b><br />
                                            {{ Session::get('home')->linked_benacc->denomination }} -
                                            {{ Session::get('home')->account_state }}<br>
                                        </span>
                                        <div
                                            style="display: flex;align-content: center; flex-direction: column; margin: 8px;">
                                            <img alt="Pic" src="./assets/media/users/default.jpg" />
                                            <small style="color: black; text-align: center">Paramètres de mon
                                                compte</small>
                                        </div>
                                        <span class="kt-header__topbar-icon kt-bg-brand kt-hidden"><b>S</b></span>
                                    </div>
                                @else
                                    <div class="kt-header__topbar-wrapper" data-toggle="dropdown"
                                        data-offset="10px,0px">
                                        <span class="kt-header__topbar-username kt-visible-desktop">
                                            <b>
                                                __ - __
                                            </b>
                                        </span>
                                        <img alt="Pic" src="./assets/media/users/300_21.jpg" />
                                        <span class="kt-header__topbar-icon kt-bg-brand kt-hidden"><b>S</b></span>
                                    </div>
                                @endif
                                <div
                                    class="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-xl">

                                    <!--begin: Head -->

                                    @if (\Session::get('home') !== null)
                                        <div
                                            class="kt-user-card kt-user-card--skin-light kt-notification-item-padding-x">
                                            <div class="kt-user-card__avatar">
                                                <img class="kt-hidden-" alt="Pic"
                                                    src="./assets/media/users/default.jpg" />

                                                <!--use below badge element instead the user avatar to display username's first letter(remove kt-hidden class to display it) -->
                                                <span
                                                    class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--rounded kt-badge--bold kt-hidden">S</span>
                                            </div>
                                            <div class="kt-user-card__name">
                                                {{ Session::get('home')->username }}<br />

                                            </div>

                                        </div>
                                    @else
                                        <div
                                            class="kt-user-card kt-user-card--skin-light kt-notification-item-padding-x">
                                            <div class="kt-user-card__avatar">
                                                <img class="kt-hidden-" alt="Pic"
                                                    src="./assets/media/users/300_21.jpg" />

                                                <!--use below badge element instead the user avatar to display username's first letter(remove kt-hidden class to display it) -->
                                                <span
                                                    class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--rounded kt-badge--bold kt-hidden">S</span>
                                            </div>
                                            <div class="kt-user-card__name">
                                                __-__
                                            </div>

                                        </div>
                                    @endif

                                    <!--end: Head -->

                                    <!--begin: Navigation -->
                                    <div class="kt-notification">
                                        <a href="{{ route('spx.settings.get.account') }}" class="kt-notification__item">
                                            <div class="kt-notification__item-icon">
                                                <i class="flaticon2-calendar-3 kt-font-success"></i>
                                            </div>
                                            <div class="kt-notification__item-details">
                                                <div class="kt-notification__item-title kt-font-bold">
                                                    Mon Compte
                                                </div>
                                            </div>
                                        </a>
                                        <div class="kt-notification__custom kt-space-between">
                                            <a id="spx_logout" href="javascript:;"
                                                class="btn btn-label btn-label-brand btn-sm btn-bold">Déconnexion</a>
                                        </div>
                                    </div>

                                    <!--end: Navigation -->
                                </div>
                            </div>

                            <!--end: User bar -->
                        </div>

                        <!-- end:: Header Topbar -->
                    </div>
                </div>

                <!-- end:: Header -->
                <div class="kt-body kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-grid--stretch"
                    id="kt_body">
                    <div class="kt-container  kt-container--fluid  kt-grid kt-grid--ver">

                        <!-- begin:: Aside -->
                        <button class="kt-aside-close " id="kt_aside_close_btn"><i class="la la-close"></i></button>
                        <div class="kt-aside  kt-aside--fixed  kt-grid__item kt-grid kt-grid--desktop kt-grid--hor-desktop"
                            id="kt_aside">

                            <!-- begin:: Aside Menu -->
                            <div class="kt-aside-menu-wrapper kt-grid__item kt-grid__item--fluid"
                                id="kt_aside_menu_wrapper">
                                <div id="kt_aside_menu" class="kt-aside-menu " data-ktmenu-vertical="1"
                                    data-ktmenu-scroll="1">
                                    <ul class="kt-menu__nav ">
                                        <li class="kt-menu__item {{ spyx_aside_menu_state_class(\App\MenuCode::$DASHBOARD) }}"
                                            aria-haspopup="true"><a href="{{ route('spx.home') }}"
                                                class="kt-menu__link "><i
                                                    class="kt-menu__link-icon flaticon-squares"></i><span
                                                    class="kt-menu__link-text">Page d'accueil</span></a></li>
                                        {{-- <li class="kt-menu__section kt-menu__section--first"> --}}
                                        {{-- <h4 class="kt-menu__section-text">Comptes de Privilèges</h4> --}}
                                        {{-- <i class="kt-menu__section-icon flaticon-more-v2"></i> --}}
                                        {{-- </li> --}}
                                        <li class="kt-menu__item {{ spyx_aside_menu_state_class(\App\MenuCode::$MIGRATE) }}"
                                            aria-haspopup="true"><a href="{{ route('spx.benacc.getlist') }}"
                                                class="kt-menu__link "><i
                                                    class="kt-menu__link-icon flaticon-interface-7"></i><span
                                                    class="kt-menu__link-text">Les comptes de privilèges</span></a></li>
                                        <li class="kt-menu__item {{ spyx_aside_menu_state_class(\App\MenuCode::$UPDATE_BEN) }}"
                                            aria-haspopup="true"><a
                                                href="{{ route('spx.benacc.get.pay') }}?id={{ Session::get('home')->linked_benacc->id_type_ben_account }}"
                                                class="kt-menu__link "><i
                                                    class="kt-menu__link-icon flaticon-refresh"></i><span
                                                    class="kt-menu__link-text">Payer les frais de tenue de
                                                    compte</span></a></li>
                                        <li class="kt-menu__item {{ spyx_aside_menu_state_class(\App\MenuCode::$EXPENSE) }}"
                                            aria-haspopup="true"><a href="{{ route('dashboard.index') }}"
                                                class="kt-menu__link "><i class="kt-menu__link-icon fas fa-wallet"></i><span
                                                    class="kt-menu__link-text">Dépenses</span></a></li>
                                        {{-- <li class="kt-menu__section kt-menu__section--first"> --}}
                                        {{-- <h4 class="kt-menu__section-text">Opérations</h4> --}}
                                        {{-- <i class="kt-menu__section-icon flaticon-more-v2"></i> --}}
                                        {{-- </li> --}}
                                        {{-- <li class="kt-menu__item {{spyx_aside_menu_state_class(\App\MenuCode::$ACC_TRANSFERT)}}" aria-haspopup="true"><a href="{{route('spx.op.get.account_transfert')}}" class="kt-menu__link "><i class="kt-menu__link-icon flaticon-paper-plane"></i><span class="kt-menu__link-text">Transfert vers un compte Sesame</span></a></li> --}}
                                        {{-- <li class="kt-menu__item {{spyx_aside_menu_state_class(\App\MenuCode::$NONACC_TRANSFERT)}}" aria-haspopup="true"><a href="{{route('spx.op.get.nonaccount_transfert')}}" class="kt-menu__link "><i class="kt-menu__link-icon flaticon-avatar"></i><span class="kt-menu__link-text">Transfert vers un non abonné Sesame</span></a></li> --}}
                                        {{-- <!--                                    <li class="kt-menu__item {{spyx_aside_menu_state_class(\App\MenuCode::$DEPOSIT)}}" aria-haspopup="true"><a href="{{route('spx.op.get.deposit')}}" class="kt-menu__link "><i class="kt-menu__link-icon flaticon-symbol"></i><span class="kt-menu__link-text">Recharger mon compte</span></a></li>--> --}}
                                        {{-- <li class="kt-menu__item {{spyx_aside_menu_state_class(\App\MenuCode::$LIST_TRANSACTION)}}" aria-haspopup="true"><a href="{{route('spx.op.get.list_transactions')}}" class="kt-menu__link "><i class="kt-menu__link-icon flaticon-diagram"></i><span class="kt-menu__link-text">Liste des transactions</span></a></li> --}}
                                        <!--                                    <li class="kt-menu__section ">-->
                                        <!--                                        <h4 class="kt-menu__section-text">Assistance</h4>-->
                                        <!--                                        <i class="kt-menu__section-icon flaticon-more-v2"></i>-->
                                        <!--                                    </li>-->
                                        <!--                                    <li class="kt-menu__item {{ spyx_aside_menu_state_class(\App\MenuCode::$TICKET) }}" aria-haspopup="true"><a href="{{ route('spx.assist.get.tickets') }}" class="kt-menu__link "><i class="kt-menu__link-icon flaticon-chat"></i><span class="kt-menu__link-text">Tickets</span></a></li>-->
                                        <!--                                    <li class="kt-menu__item {{ spyx_aside_menu_state_class(\App\MenuCode::$ANNOUNCE) }}" aria-haspopup="true"><a href="{{ route('spx.assist.get.announces') }}" class="kt-menu__link "><i class="kt-menu__link-icon flaticon-alert"></i><span class="kt-menu__link-text">Annonces</span></a></li>-->
                                        <!--                                    <li class="kt-menu__item {{ spyx_aside_menu_state_class(\App\MenuCode::$FAQ) }}" aria-haspopup="true"><a href="{{ route('spx.assist.get.faq') }}" class="kt-menu__link "><i class="kt-menu__link-icon flaticon-questions-circular-button"></i><span class="kt-menu__link-text">Foire aux questions</span></a></li>-->

                                    </ul>
                                </div>
                            </div>

                            <!-- end:: Aside Menu -->
                        </div>

                        <!-- end:: Aside -->
                        <div class="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor"
                            id="kt_content">

                            @yield('content')
                        </div>

                        <!--begin::Modal-->
                        <div class="modal fade" id="kt_modal_4" tabindex="-1" role="dialog"
                            aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-lg" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">Paiement des frais de tenue de
                                            compte</h5>
                                        <button type="button" class="close" data-dismiss="modal"
                                            aria-label="Close">
                                        </button>
                                    </div>
                                    <div class="modal-body">

                                        <p>Vous souhaitez effectuer un paiement des frais de tenue de compte pour le
                                            compte Sesame Solo. Cette opération vous coûtera 1000XAF veuillez entrer
                                            votre mot de passe pour confirmer cette opération</p>

                                        <form>
                                            <div class="form-group">
                                                <label for="recipient-name" class="form-control-label">Mot de
                                                    passe:</label>
                                                <input type="text" class="form-control" id="recipient-name">
                                            </div>
                                        </form>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary"
                                            data-dismiss="modal">Fermer</button>
                                        <button type="button" class="btn btn-warning">Valider</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--end::Modal-->

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
                            <div class="kt-footer__menu">
                                <a href="https://sesampayx.com/tutoriel-sesampayx" target="_blank"
                                    class="kt-link">Tutoriel</a>
                                <a href="https://sesampayx.com/conditions-dutilisation" target="_blank"
                                    class="kt-link">Conditions d'utilisation</a>
                                <a href="https://sesampayx.com" target="_blank" class="kt-link">Contact</a>
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
    @include("operations.op_modals")

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
    <script src="//rum-static.pingdom.net/pa-60a8ed73541c6000110000b0.js" async></script>

    <!--end::Page Vendors -->

    <!--begin::Page Scripts(used by this page) -->
    <script src="./assets/js/demo11/pages/dashboard.js" type="text/javascript"></script>


    <script>
        //logout
        var KTSweetAlert2Demo = function() {
            var initDemos = function() {
                $('#spx_logout').click(function(e) {

                    swal.fire({
                        title: 'Deconnexion',
                        text: "Êtes vous sur de vouloir vous déconnecter?",
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Oui',
                        cancelButtonText: 'Non',
                    }).then(function(result) {
                        if (result.value) {
                            window.location.href = "{{ route('spx.logout') }}"
                        }
                    });
                });
            }

            return {
                // Init
                init: function() {
                    initDemos();
                },
            };
        }();

        var defaultPasswordMiddlewaire = function() {
            $.ajax({
                url: "{{ route('spx.defaultPassword') }}",
                method: "GET",
                dataType: 'JSON',
                data: JSON.stringify({}),
                contentType: "application/json",
                cache: false,
                processData: false,
                success: function(data) {
                    if(data.defaultPassword){
                        $("#default_password_btn").click()
                        loadChangeDefaultPassword("#default_password_body", $("#default_password_body"))
                    }
                },
                error: function(error) {}
            });
        }

        function loadChangeDefaultPassword(mainSelector, body) {
            //loader
            //smsKtAppblock(mainSelector);
            ajaxSubmit({
                url: "{{ route('spx.settings.get.change_password') }}",
            }, function(data) {
                body.html(data.view);
                $("#cancel_cp").css("display", "none")
                //scrollToTop();
                //desactiver le loader
                //smsKtAppunblock(mainSelector);

                $("#submit_cp").unbind().click(function(e) {
                    e.preventDefault();
                    let btn = $(this);
                    let form = btn.closest('form');

                    form.validate({
                        rules: {
                            old_password: {
                                required: true
                            },
                            new_password: {
                                required: true
                            },
                            confirm_new_password: {
                                required: true,
                                equalTo: "#new_password"
                            },
                        },
                        messages: {
                            old_password: {
                                required: "Ce champs est requis"
                            },
                            new_password: {
                                required: "Ce champs est requis"
                            },
                            confirm_new_password: {
                                required: "Ce champs est requis",
                                equalTo: "Ce champs doit être égal au mot de passe"
                            },
                        }
                    });

                    if (!form.valid()) {
                        return;
                    }

                    smsKtAppblock(mainSelector);

                    form.ajaxSubmit({
                        url: "{{ route('spx.settings.post.change_password') }}",
                        method: 'POST',
                        success: function(response, status, xhr, $form) {
                            smsKtAppunblock(mainSelector);
                            if (response.status === 1) {
                                swal.fire({
                                    "title": "Succès",
                                    "text": "Votre mot de passe a été modifié avec Succès",
                                    "type": "success",
                                    "confirmButtonClass": "btn btn-warning",
                                    "onClose": function(e) {
                                        window.location.href =
                                            "{{ route('spx.home') }}"
                                    }
                                });
                            } else {
                                swal.fire({
                                    "title": response.err_title,
                                    "text": response.err_msg + ". Code d'erreur " +
                                        response.err_code,
                                    "type": "error",
                                    "confirmButtonClass": "btn btn-secondary",
                                    "onClose": function(e) {
                                        console.log('on close event fired!');
                                    }
                                });
                            }

                        },
                        error: function(error) {
                            smsKtAppunblock(mainSelector);
                            let responseText = JSON.parse(error.responseText);
                            swal.fire({
                                "title": responseText.err_title,
                                "text": responseText.err_msg + ". Code d'erreur " +
                                    responseText.err_code,
                                "type": "error",
                                "confirmButtonClass": "btn btn-secondary",
                                "onClose": function(e) {
                                    console.log('on close event fired!');
                                }
                            });
                        }
                    });

                })


            }, function(error) {
                alert(JSON.stringify(error))
            });
        }

        // Class Initialization
        jQuery(document).ready(function() {
            KTSweetAlert2Demo.init();
            defaultPasswordMiddlewaire()
        });


    </script>
    @include("layout.script")
    @include("layout.op_script")
    @yield("scripts")

    <!--end::Page Scripts -->
</body>

<!-- end::Body -->

</html>
