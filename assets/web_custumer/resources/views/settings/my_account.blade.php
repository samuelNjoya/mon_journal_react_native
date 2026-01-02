
@extends('layout')

@section('title','Mon Compte')


@section('content')
    <div class="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid" id="content">

        <div class="kt-subheader   kt-grid__item" id="kt_subheader">
            <div class="kt-container ">
                <div class="kt-subheader__main">
                    <span class="kt-subheader__separator kt-hidden"></span>
                    <div class="kt-subheader__breadcrumbs">
                        <a class="kt-subheader__breadcrumbs-home"><i class="flaticon2-shelter"></i></a>
                        <span class="kt-subheader__breadcrumbs-separator"></span>
                        <a class="kt-subheader__breadcrumbs-link">
                            Mon Compte </a>
                        </div>
                </div>
            </div>
        </div>
        <!--Begin::App-->
        <div class="kt-grid kt-grid--desktop kt-grid--ver kt-grid--ver-desktop kt-app">


            <!--Begin:: App Aside Mobile Toggle-->
            <button class="kt-app__aside-close" id="kt_user_profile_aside_close">
                <i class="la la-close"></i>
            </button>

            <!--End:: App Aside Mobile Toggle-->

            <!--Begin:: App Aside-->
            <div class="kt-grid__item kt-app__toggle" id="kt_user_profile_aside">

                <!--begin:: Widgets/Applications/User/Profile1-->
                <div class="kt-portlet ">
                    <div class="kt-portlet__head  kt-portlet__head--noborder">
                        <div class="kt-portlet__head-label">
                            <h3 class="kt-portlet__head-title">
                            </h3>
                        </div>

                    </div>
                    <div class="kt-portlet__body kt-portlet__body--fit-y">

                        <!--begin::Widget -->
                        <div class="kt-widget kt-widget--user-profile-1">
                            <div class="kt-widget__head">
                                <div class="kt-widget__media">
                                    <img src="./assets/media/users/default.jpg" alt="image">
                                </div>
                                <div class="kt-widget__content">
                                    <div class="kt-widget__section">
                                        <a class="kt-widget__username">
                                            {{Session::get('home')->username}}
                                            <i class="flaticon2-correct kt-font-success"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="kt-widget__body">
                                <div class="kt-widget__content">
                                    <div class="kt-widget__info">
                                        <span class="kt-widget__label">Etat du compte Sesame :</span>
                                        <a class="kt-widget__data">
                                            {{Session::get('home')->account_state}}</a>
                                    </div>
                                </div>
                                <div class="kt-widget__content">
                                    <div class="kt-widget__info">
                                        <span class="kt-widget__label">Paiement en ligne :</span>
                                       <div class="kt-widget__data">
                                           <span class="kt-switch">
                                                <label>
                                                    <input id="online_payment" type="checkbox" onclick="switch_online_payment();" {{Session::get('home')->payment_state?"checked":""}}/>
                                                    <span></span>
                                                </label>
                                            </span>
                                       </div>
                                    </div>
                                </div>
                                <div class="kt-widget__items">
                                    <a id="my_account" class="kt-widget__item kt-widget__item--active">
                                        <span class="kt-widget__section">
                                            <span class="kt-widget__icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                        <polygon id="Bound" points="0 0 24 0 24 24 0 24" />
                                                        <path d="M12.9336061,16.072447 L19.36,10.9564761 L19.5181585,10.8312381 C20.1676248,10.3169571 20.2772143,9.3735535 19.7629333,8.72408713 C19.6917232,8.63415859 19.6104327,8.55269514 19.5206557,8.48129411 L12.9336854,3.24257445 C12.3871201,2.80788259 11.6128799,2.80788259 11.0663146,3.24257445 L4.47482784,8.48488609 C3.82645598,9.00054628 3.71887192,9.94418071 4.23453211,10.5925526 C4.30500305,10.6811601 4.38527899,10.7615046 4.47382636,10.8320511 L4.63,10.9564761 L11.0659024,16.0730648 C11.6126744,16.5077525 12.3871218,16.5074963 12.9336061,16.072447 Z" id="Shape" fill="#000000" fill-rule="nonzero" />
                                                        <path d="M11.0563554,18.6706981 L5.33593024,14.122919 C4.94553994,13.8125559 4.37746707,13.8774308 4.06710397,14.2678211 C4.06471678,14.2708238 4.06234874,14.2738418 4.06,14.2768747 L4.06,14.2768747 C3.75257288,14.6738539 3.82516916,15.244888 4.22214834,15.5523151 C4.22358765,15.5534297 4.2250303,15.55454 4.22647627,15.555646 L11.0872776,20.8031356 C11.6250734,21.2144692 12.371757,21.2145375 12.909628,20.8033023 L19.7677785,15.559828 C20.1693192,15.2528257 20.2459576,14.6784381 19.9389553,14.2768974 C19.9376429,14.2751809 19.9363245,14.2734691 19.935,14.2717619 L19.935,14.2717619 C19.6266937,13.8743807 19.0546209,13.8021712 18.6572397,14.1104775 C18.654352,14.112718 18.6514778,14.1149757 18.6486172,14.1172508 L12.9235044,18.6705218 C12.377022,19.1051477 11.6029199,19.1052208 11.0563554,18.6706981 Z" id="Path" fill="#000000" opacity="0.3" />
                                                    </g>
                                                </svg> </span>
                                            <span class="kt-widget__desc">
                                                Mon Compte
                                            </span>
                                        </span>
                                    </a>
                                    <a id="change_password"  class="kt-widget__item">
                                        <span class="kt-widget__section">
                                            <span class="kt-widget__icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                        <polygon id="Shape" points="0 0 24 0 24 24 0 24" />
                                                        <path d="M12,11 C9.790861,11 8,9.209139 8,7 C8,4.790861 9.790861,3 12,3 C14.209139,3 16,4.790861 16,7 C16,9.209139 14.209139,11 12,11 Z" id="Mask" fill="#000000" fill-rule="nonzero" opacity="0.3" />
                                                        <path d="M3.00065168,20.1992055 C3.38825852,15.4265159 7.26191235,13 11.9833413,13 C16.7712164,13 20.7048837,15.2931929 20.9979143,20.2 C21.0095879,20.3954741 20.9979143,21 20.2466999,21 C16.541124,21 11.0347247,21 3.72750223,21 C3.47671215,21 2.97953825,20.45918 3.00065168,20.1992055 Z" id="Mask-Copy" fill="#000000" fill-rule="nonzero" />
                                                    </g>
                                                </svg> </span>
                                            <span class="kt-widget__desc">
                                                Modifier mon mot de passe
                                            </span>
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!--end::Widget -->
                    </div>
                </div>

                <!--end:: Widgets/Applications/User/Profile1-->
            </div>
            <!--End:: App Aside-->

            <!--Begin:: App Content-->
            <div id="app_content" class="kt-grid__item kt-grid__item--fluid kt-app__content">

            </div>
            <!--End:: App Content-->

        </div>

        <!--End::App-->
    </div>
@endsection

@section("scripts")
    <script src="./assets/js/demo1/pages/dashboard.js" type="text/javascript"></script>
    <script src="./assets/js/demo1/pages/custom/user/profile.js" type="text/javascript"></script>
    <script src="./assets/js/demo1/pages/wizard/wizard-2.js" type="text/javascript"></script>

    <script>

        $(document).ready(function () {

            let mainSelector = "#app_content";
            let body = $("#app_content");

            //loading account block
            loadAccountBody(mainSelector, "#my_account");
            $("#my_account").click(function () {
                loadAccountBody(mainSelector,"#my_account");
            });
            //loading password block
            $("#change_password").click(function () {
                loadChangePassword(mainSelector,"#change_password");
            });

            function updateSelectedItem(selector) {
                $(".kt-widget__item").removeClass("kt-widget__item--active");
                $(selector).addClass("kt-widget__item--active");
            }

            function scrollToTop() {
                KTUtil.scrollTop();
            }

            function loadAccountBody(mainSelector, choosedAccountSelector) {
                //met à jour le menu
                updateSelectedItem(choosedAccountSelector);
                //loader
                smsKtAppblock(mainSelector);
                ajaxSubmit({
                    url:"{{ route("spx.settings.get.personalinfo") }}",
                }, function (data) {
                    body.html(data.view);
                    scrollToTop();
                    //desactiver le loader
                    smsKtAppunblock(mainSelector);

                }, function (error) {
                    smsKtAppunblock(mainSelector);
                    smsToastError(JSON.stringify(error));
                });
            }

            function loadChangePassword(mainSelector, changePasswordSelector) {
                //met à jour le menu
                updateSelectedItem(changePasswordSelector);
                //loader
                smsKtAppblock(mainSelector);
                ajaxSubmit({
                    url:"{{ route("spx.settings.get.change_password") }}",
                }, function (data) {
                    body.html(data.view);
                    scrollToTop();
                    //desactiver le loader
                    smsKtAppunblock(mainSelector);


                    $("#cancel_cp").unbind().click(function (e) {
                        e.preventDefault();
                        loadChangePassword(mainSelector, changePasswordSelector);
                    });

                    $("#submit_cp").unbind().click(function (e) {
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
                                    equalTo:"#new_password"
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
                                    equalTo:"Ce champs doit être égal au mot de passe"
                                },
                            }
                        });

                        if (!form.valid()) {
                            return;
                        }

                        smsKtAppblock(mainSelector);

                        form.ajaxSubmit({
                            url: '{{ route("spx.settings.post.change_password") }}',
                            method: 'POST',
                            success: function(response, status, xhr, $form) {
                                smsKtAppunblock(mainSelector);
                                if(response.status===1){
                                    swal.fire({
                                        "title": "Succès",
                                        "text": "Votre mot de passe a été modifié avec Succès",
                                        "type": "success",
                                        "confirmButtonClass": "btn btn-warning",
                                        "onClose": function(e) {
                                            window.location.href ="{{route("spx.home")}}"
                                        }
                                    });
                                }else{
                                    swal.fire({
                                        "title": response.err_title,
                                        "text": response.err_msg+". Code d'erreur "+response.err_code,
                                        "type": "error",
                                        "confirmButtonClass": "btn btn-secondary",
                                        "onClose": function(e) {
                                            console.log('on close event fired!');
                                        }
                                    });
                                }

                            },
                            error: function (error) {
                                smsKtAppunblock(mainSelector);
                                let responseText = JSON.parse(error.responseText);
                                swal.fire({
                                    "title": responseText.err_title,
                                    "text": responseText.err_msg+". Code d'erreur "+responseText.err_code,
                                    "type": "error",
                                    "confirmButtonClass": "btn btn-secondary",
                                    "onClose": function(e) {
                                        console.log('on close event fired!');
                                    }
                                });
                            }
                        });

                    })


                }, function (error) {
                    alert(JSON.stringify(error))
                });
            }


        });

        function switch_online_payment() {
            //loader
            smsKtAppblock("#content");
            $.ajax({
                url: "{{ route("spx.settings.switch.online_payment") }}",
                method: 'POST',
                dataType: "JSON",
                data: JSON.stringify({
                    payment_state: $("#online_payment").is(":checked")
                }),
                contentType: "application/json",
                cache: false,
                processData: false,
                success: function (data) {
                    smsKtAppunblock("#content");
                    if (data.status === 1) {
                        if(data.payment_state === true){
                            swal.fire({
                                "title": "Paiement en ligne activé",
                                "text": "Le paiement en ligne a été activé avec succès",
                                "type": "success",
                                "confirmButtonClass": "btn btn-secondary",
                            });
                        }else{
                            swal.fire({
                                "title": "Paiement en ligne désactivé",
                                "text": "Le paiement en ligne a été désactivé avec succès",
                                "type": "success",
                                "confirmButtonClass": "btn btn-secondary",
                            });
                        }
                    } else {
                        $('#online_payment').prop('checked', !$("#online_payment").is(":checked"));
                        swal.fire({
                            "title": data.err_title,
                            "text": data.err_msg + ". Code d'erreur " + data.err_code,
                            "type": "error",
                            "confirmButtonClass": "btn btn-secondary",
                        });
                    }
                },
                error: function (error) {
                    smsKtAppunblock("#content");
                    $('#online_payment').prop('checked', !$("#online_payment").is(":checked"));
                    swal.fire({
                        "title": "Erreur interne",
                        "text": "Une erreur est survenue dans le serveur4",
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary",
                    });
                }
            });
        }
    </script>
@endsection
