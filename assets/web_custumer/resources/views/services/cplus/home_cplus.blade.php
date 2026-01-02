
@extends('layout')

@section('title','Paiement des factures Canal plus')

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
                            Paiement des factures Canal plus </a>
                    </div>
                </div>
            </div>
        </div>
        <!--Begin::App-->
        <div class="row kt-grid kt-grid--desktop kt-grid--ver kt-grid--ver-desktop kt-app">

            <!--End:: App Aside Mobile Toggle-->

            <!--Begin:: App Aside-->
            <div class="col-md-5" id="kt_user_profile_aside">

                <!--begin:: Widgets/Applications/User/Profile1-->
                <div class="kt-portlet">
                    <button type="button" id="new_subscription" class ="btn btn-bold btn-label-brand" data-toggle="modal" data-target="#cplus_op" style="width:100%">Enregistrer un abonnement</button>
                </div>
                <div class="kt-portlet">
                    <div class="kt-portlet__head">
                        <div class="kt-portlet__head-label">
                            <h4 class="kt-portlet__head-title">
                                Mes abonnements
                            </h4>
                        </div>
                    </div>
                    <div id="cplus_list_view" class="kt-portlet__body kt-portlet__body--fit-y" style="padding:16px;">

                        <div class="kt-checkbox-list" id="cplus_subscriptions" style="padding:16px; height:350px; overflow:auto">

                        </div>

                        <button id="preview_buy_cplus" class="btn btn-warning btn-elevate kt-login__btn-warning" style="width:100%; margin-top: 21px;">Payer</button>
                    </div>
                </div>

                <!--end:: Widgets/Applications/User/Profile1-->
            </div>
            <!--End:: App Aside-->

            <!--Begin:: App Content-->
            <div id="app_content" class="col-md-7">
                <div class="kt-portlet">
                    <div class="kt-portlet__head">
                        <div class="kt-portlet__head-label">
                            <h4 class="kt-portlet__head-title">
                                Mes Commandes effectuées
                            </h4>
                        </div>
                    </div>
                    <div id="list_commands_view" class="kt-portlet__body kt-portlet__body--fit-y" style="padding:16px;">
                        <div class="kt-checkbox-list" id="cplus_commands_view" style="padding:16px; height:500px; overflow:auto">

                        </div>
                    </div>
                </div>
            </div>
            <!--End:: App Content-->

        </div>

        <!--End::App-->
    </div>

    <div class="modal fade" id="cplus_op" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog" role="document" id="modal_content">
            <div class="modal-content">
                <div class="modal-header" style="background-color: black;" >
                            <img src="./assets/media/custom/canal_plus.png" style="width: 50px;">
                    <h5 class="modal-title opmodal-title" id="exampleModalLabel" style="color: white;">Enregistrer un Abonnement Canal +</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <div class="modal-body" id="package_create">
                    <form class="kt-form" >
                        @csrf
                        <div class="row">
                            <div class="col-xl-1"></div>
                            <div class="col-xl-10">
                                <div class="kt-section kt-section--first">
                                    <div class="kt-section__body">
                                        <div class="form-group">
                                            <label>Intitulé</label>
                                            <input type="text" name="title" class="form-control" value="" placeholder="Exemple: abonnement de la TV du salon" aria-describedby="basic-addon1">
                                        </div>
                                        <div class="form-group">
                                            <label>Numéro de téléphone (lié à votre compte canal+)</label>
                                            <div>
                                                <div class="input-group">
                                                    <div class="input-group-prepend"><span class="input-group-text"><i class="la la-phone"></i>+237</span></div>
                                                    <input type="text" name="phone_number" class="form-control" value="" aria-describedby="basic-addon1">
                                                </div>
                                                <span class="form-text text-muted">votre numéro de téléphone doit tenir sur 9 chiffres.</span>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label>Numéro d'abonnement</label>
                                            <div>
                                                <div class="input-group">
                                                    <input type="text" name="subscriber_number" class="form-control" value="" aria-describedby="basic-addon1">
                                                </div>
                                                <span class="form-text text-muted">votre numéro de d'abonnement doit tenir sur 14 chiffres.</span>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label>Bouquet Canal+</label>
                                            <select class="form-control kt-select2" id="list_packages" name="id_tv_package">

                                            </select>
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
            </div>
        </div>
    </div>

    <div class="modal fade" id="pay_cplus" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog" role="document" id="modal_content">
            <div class="modal-content">
                <div class="modal-header" style="background-color: black;" >
                            <img src="./assets/media/custom/canal_plus.png" style="width: 50px;">
                    <h5 class="modal-title opmodal-title" id="exampleModalLabel" style="color: white;">Recapitulatif</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <div class="modal-body" id="view_pay_cplus" style="padding:16px;">
                    <form class="row kt-form" >
                        <div class="col-1"></div>
                        <div class="col-10">
                            <div id="subs_to_pay">
                            </div>
                            <div class="row">
                                <h6 style="flex:3">Montant total à payer</h6>
                                <div id="total_amount">
                                </div>
                            </div>
                            <p>Veuillez selectionner votre moyen de paiement</p>
                            <div class="kt-radio-list" id="payment_method">
                                <!--label class="kt-radio">
                                    <input type="radio" name="payment_mode" value="SESAME" checked="checked"> Mon compte SesamPayx
                                    <span></span>
                                </label>
                                <label class="kt-radio">
                                    <input type="radio" name="payment_mode" value="MTNMOMO"> Mon compte MTN Mobile Money
                                    <span></span>
                                </label-->
                            </div>
                            <input type="hidden" id="mypackages" name="mypackages">
                            <div class="form-group" id="mtn_phone_number" style="display:none">
                                <label>Numéro de téléphone MTN Mobile Money</label>
                                <div>
                                    <div class="input-group">
                                        <div class="input-group-prepend"><span class="input-group-text"><i class="la la-phone"></i>+237</span></div>
                                        <input type="text" name="momo_phone_number" class="form-control" value="" placeholder="Veuillez entrer le numéro de téléphone lié à votre compte MTN Mobile Money" aria-describedby="basic-addon1">
                                    </div>
                                    <span class="form-text text-muted">votre numéro de téléphone doit tenir sur 9 chiffres.</span>
                                </div>
                            </div>
                            <div class="form-group" id="orange_phone_number" style="display:none">
                                <label>Numéro de téléphone Orange Money</label>
                                <div>
                                    <div class="input-group">
                                        <div class="input-group-prepend"><span class="input-group-text"><i class="la la-phone"></i>+237</span></div>
                                        <input type="text" name="om_phone_number" class="form-control" value="" placeholder="Veuillez entrer le numéro de téléphone lié à votre compte Orange Money" aria-describedby="basic-addon1">
                                    </div>
                                    <span class="form-text text-muted">votre numéro de téléphone doit tenir sur 9 chiffres.</span>
                                </div>
                            </div>
                            <div class="form-group form-group-last">
                                <label>Mot de passe</label>
                                <input type="password" name="password" class="form-control" placeholder="Mot de passe" value="">
                            </div>

                            <button id="recap_buy_cplus" class="btn btn-warning btn-elevate kt-login__btn-warning" type="submit" style="width:100%; margin-top: 21px;">Payer</button>

                        </div>
                        <div class="col-1"></div>
                    </form>

                </div>
            </div>
        </div>
    </div>
@endsection

@section("scripts")

    <script>

        var my_list_subscriptions = [];
        var methodes = [];
        var selected_subscriptions = [];
        var setTimeoutvar;

        $(document).ready(function () {

            list_subscriptions();
            list_commands();
            $("#new_subscription").click(function () {
                list_packages();
            });

            //create tv package
            $("#save_subscription").click(function (e) {
                e.preventDefault();
                let btn = $(this);
                let form = $(this).closest('form');

                form.validate({
                    rules: {
                        title: {
                            required: true
                        },
                        phone_number: {
                            required: true,
                            minlength: 9,
                            maxlength: 9
                        },
                        subscriber_number: {
                            required: true,
                            minlength: 14,
                            maxlength: 14
                        },
                        id_tv_package: {
                            required: true
                        },

                    },
                    messages:{
                        title: {
                            required:"Ce champ est requis",
                        },
                        phone_number: {
                            required:"Ce champ est requis",
                            minlength: "Vous devez entrer un numéro à 9 chiffres",
                            maxlength: "Vous devez entrer un numéro à 9 chiffres"
                        },
                        subscriber_number: {
                            required:"Ce champ est requis",
                            minlength: "Vous devez entrer un numéro à 14 chiffres",
                            maxlength: "Vous devez entrer un numéro à 14 chiffres"
                        },
                        id_tv_package: {
                            required: "Ce champ est requis"
                        }
                    },
                });

                if (!form.valid()) {
                    return;
                }

                btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
                loader("#package_create");
                form.ajaxSubmit({
                    url: "{{route("spx.serv.create.tv_subscription")}}",
                    method:"POST",
                    success: function (response, status, xhr, $form) {
                        unloader("#package_create");
                        btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                        //response = JSON.parse(response);

                        if (response.status === 1){

                            swal.fire({
                                "title": "Abonnement enregistré",
                                "text": "Votre abonnement Canal+ a été enregistré avec succès.",
                                "type": "success",
                                "confirmButtonClass": "btn btn-secondary",
                                "onClose": function(e) {
                                    $("#cplus_op").modal('hide');
                                    let cplus_content = $('#cplus_subscriptions');
                                    cplus_content.empty();
                                    list_subscriptions();
                                }
                            });
                        }else if(response.status === 0){
                            swal.fire({
                                "title": response.err_title,
                                "text": response.err_msg+". Code d'erreur "+response.err_code,
                                "type": "error",
                                "confirmButtonClass": "btn btn-secondary",

                            });
                        }else if (response.status === -1){
                            loader("#package_create");
                            window.location.href ="{{route("spx.signin")}}"
                        }

                    },
                    error: function (error) {
                        unloader("#package_create");
                        btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
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
            });

            //preview pay
            $("#preview_buy_cplus").click(function (e) {
                e.preventDefault();
                selected_subscriptions=[];
                $('input[name=subscription]:checked').each(function() {
                    let selected_index = $(this).attr('value');
                    selected_subscriptions.push(my_list_subscriptions[parseInt(selected_index)])
                });
                n_selected_subscriptions = selected_subscriptions.length;
                if(n_selected_subscriptions === 0){
                    swal.fire({
                        "title": "Aucune selection",
                        "text": "Vous devez selectionner au moins un abonnement avant de payer",
                        "type": "warning",
                        "confirmButtonClass": "btn btn-secondary"
                    });
                }else{
                    let total = {
                        price:0,
                        commission:0
                    };
                    $('#subs_to_pay').empty();
                    for(let i=0; i< n_selected_subscriptions ; i++){
                        //montage de la vue de paiement
                        let current_selected=selected_subscriptions[i];
                        total.price += current_selected.price;
                        total.commission += current_selected.commission;
                        $('#subs_to_pay').append("<div  class=row style=\"border-left-style: solid; border-left-color: black; padding: 8px;margin-bottom: 8px\">\n" +
                            "                                <div style=\"flex: 3\">\n" +
                            "                                    <h6><b>"+current_selected.denomination+"("+current_selected.title+")</b></h6>\n" +
                            "                                    <p><b>Numéro d'abonnement</b>:"+current_selected.subscriber_number+"\n" +
                            "                                        <br/><b>Telephone</b>: "+current_selected.phone_number+"\n" +
                            "                                </div>\n" +
                            "                                <div>\n" +
                            "                                    <p style=\"flex:1; text-align: end\" ><b>"+formatMoney(current_selected.price +current_selected.commission)+" XAF</b>\n" +
                            (("{{renderAccountState(Session::get('home')->linked_benacc)["status"]}}" === "1")?"<br/><strike>"+formatMoney(current_selected.price)+" XAF</strike></p>\n":"") +
                            "                                </div>\n" +
                            "                            </div>")
                    }
                    $('#total_amount').empty();
                    $('#total_amount').append("<p style=\"flex:1; text-align: end;\" ><b style=\"color:#E6AF1C;\">"+formatMoney(total.price + total.commission)+" XAF</b>\n" +
                        (("{{renderAccountState(Session::get('home')->linked_benacc)["status"]}}" === "1")?"<br/><strike>"+formatMoney(total.price)+" XAF</strike></p>\n":"") );
                        $("#pay_cplus").modal('show');
                    let checked = "";
                    initCplus();
                    methodes.map(function(index){
                        if(index.value==="SESAME")checked = "checked"; else checked ="";
                        $('#payment_method').append('<label class="kt-radio"> <input type="radio" name="payment_mode" value='+index.value+' '+checked+'>'+index.label+'<span></span></label>')
                    })

                }
            });

            /*$("input[type=radio][name=payment_mode]").change(function() {
                console.log("toto");
                if (this.value === 'MTNMOMO') {
                    $("#mtn_phone_number").show();
                }
                else {
                    $("#mtn_phone_number").hide();
                }
            });*/



            $('#recap_buy_cplus').click(function (e) {
                e.preventDefault();
                let btn = $(this);
                //let form = $('.kt-login__form');
                let form = $(this).closest('form');
                form.validate({
                    ignore: ":hidden",
                    rules: {
                        momo_phone_number: {
                            required: true,
                            minlength: 9,
                            maxlength: 9
                        },
                        om_phone_number: {
                            required: true,
                            minlength: 9,
                            maxlength: 9
                        },
                        password: {
                            required: true
                        }
                    },
                    messages:{
                        momo_phone_number: {
                            required: "Ce champs est requis",
                            minlength: "la longueur de ce champs est de 9",
                            maxlength: "la longueur de ce champs est de 9"
                        },
                        om_phone_number: {
                            required: "Ce champs est requis",
                            minlength: "la longueur de ce champs est de 9",
                            maxlength: "la longueur de ce champs est de 9"
                        },
                        password: {
                            required: "Ce champs est requis"
                        }
                    }
                });

                if (!form.valid()) {
                    return;
                }

                $('#mypackages').val(JSON.stringify(selected_subscriptions));
                btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
                loader("#view_pay_cplus");
                form.ajaxSubmit({
                    url: "{{route("spx.serv.cplus.pay")}}",
                    method:"POST",
                    success: function (response, status, xhr, $form) {
                        unloader("#view_pay_cplus");
                        btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                        if (response.status === 1){
                            switch (response.step) {
                                case "SESAME":
                                    swal.fire({
                                        "title": "Paiement effectué",
                                        "text": "Votre demande d'abonnement Canal+ a été enregistrée avec succès. Elle sera traité dans les plus befs delais",
                                        "type": "success",
                                        "confirmButtonClass": "btn btn-secondary",
                                        "onClose": function(e) {
                                            $("#pay_cplus").modal('hide');
                                            let commands_content = $('#cplus_commands_view');
                                            commands_content.empty();
                                            //window.location.href ="{{route("spx.serv.get.home_cplus")}}"
                                            //list_commands();
                                            list_subscriptions();
                                        }
                                    });
                                    break;
                                case "MTNMOMO":
                                    let payment_method = "MTNMOMO";
                                    setTimeoutvar = setTimeout(momo_requestTopayStatus(response.transaction_code,payment_method), 3000);
                                    $('#view_pay_cplus').html(response.view);
                                    break;
                                case "OM":
                                    setTimeoutvar = setTimeout(momo_requestTopayStatus(response.transaction_code,response.step), 3000);
                                    $('#view_pay_cplus').html(response.view);
                                    break;
                            }
                        }else if(response.status === 0){
                            console.log("error toto");
                            swal.fire({
                                "title": response.err_title,
                                "text": response.err_msg+". Code d'erreur "+response.err_code,
                                "type": "error",
                                "confirmButtonClass": "btn btn-secondary",

                            });
                        }else if (response.status === -1){
                            loader("#view_pay_cplus");
                            window.location.href ="{{route("spx.signin")}}"
                        }

                    },
                    error: function (error) {

                        unloader("#view_pay_cplus");
                        btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
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
            });

        });

        $(document).on('change', 'input[type=radio][name=payment_mode]', function() {
            if (this.value === 'MTNMOMO') {
                $("#mtn_phone_number").show();
            }
            else {
                $("#mtn_phone_number").hide();
            }
            if(this.value === 'OM'){
                $("#orange_phone_number").show();
            }else{
                $("#orange_phone_number").hide();
            }
        } )

        function list_subscriptions() {
            //loader
            loader("#cplus_list_view");
            ajaxSubmit({
                url:"{{ route("spx.serv.get.tv_subscriptions") }}",
            }, function (data) {
                unloader("#cplus_list_view");
                let cplus_content = $('#cplus_subscriptions');
                cplus_content.empty();
                //data = JSON.parse(data);
                if(data.status ===1){
                    my_list_subscriptions = data.packages;
                    methodes = data.methodes;
                    console.log(methodes);
                    if(data.packages.length === 0){
                        $('#preview_buy_cplus').hide();
                        cplus_content.append("<div class=\"row\" style=\"width:100%;\">\n" +
                            "                    <div class=\"col-md-3\"></div>\n" +
                            "                    <div class=\"col-md-6\">\n" +
                            "                         <img src=\"./assets/media/custom/empty_box.png\" alt=\"\" style=\"width:100%;\">" +
                            "                         <h6 style=\"width:100%; text-align:center;\">Aucun abonnement: veuillez enregistrer un abonnement en cliquant sur le bouton ci dessus</h6>\n" +
                            "                     </div>\n" +
                            "                     <div class=\"col-md-3\"></div>\n" +
                            "                  </div>");

                    }else{
                        $('#preview_buy_cplus').show();
                        for(let i=0; i< data.packages.length; i++){
                            cplus_content.append("<label class=\"kt-checkbox\" style=\"align-items: center; margin:16px;\">\n" +
                                "                                <input type=\"checkbox\" name=\"subscription\" value="+i+" style=\"margin: 10px;\">\n" +
                                "                                <div class=\"row\">\n" +
                                "                                    <img src=\"./assets/media/custom/cplus.png\" alt=\"\" style=\"width:50px;height:50px;\">\n" +
                                "                                    <div class=\"col\">\n" +
                                "                                        <h6>"+data.packages[i].denomination+" ("+data.packages[i].title+")</h6>\n" +
                                "                                        <p><b>NA:</b> "+data.packages[i].subscriber_number+"; <b>Tel:</b>"+data.packages[i].phone_number+ " </p>\n" +
                                "                                    </div>\n" +
                                "                                    <button type=\"button\" class=\"btn btn-secondary\" onclick=\"delete_subscription("+data.packages[i].id_tv_subscription+",'"+data.packages[i].title+"')\"><i class=\"fa fa-trash\"></i></button>\n" +
                                "                                </div>\n" +
                                "                                <span></span>\n" +
                                "                            </label>");
                        }
                    }
                }else if (data.status === 0){
                    $('#preview_buy_cplus').hide();
                    cplus_content.append("<div class=\"row\" style=\"width:100%;\">\n" +
                        "                    <div class=\"col-md-3\"></div>\n" +
                        "                    <div class=\"col-md-6\">\n" +
                        "                         <img src=\"./assets/media/custom/empty_box.png\" alt=\"\" style=\"width:100%;\">" +
                        "                         <h6 style=\"width:100%; text-align:center;\">Aucun abonnement trouvé</h6>\n" +
                        "                     </div>\n" +
                        "                     <div class=\"col-md-3\"></div>\n" +
                        "                  </div>");
                }else if (data.status === -1){
                    window.location.href ="{{route("spx.signin")}}"
                }

            }, function (error) {
                unloader("#cplus_subscriptions");
                swal.fire({
                    "title": "Erreur interne",
                    "text": "Une erreur est survenue dans le serveur",
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary"
                });
            });
        }

        function list_commands() {
            //loader
            loader("#cplus_commands_view");
            ajaxSubmit({
                url:"{{ route("spx.serv.get.tv_commands") }}",
            }, function (data) {
                unloader("#cplus_commands_view");
                let cplus_command_content = $('#cplus_commands_view');
                cplus_command_content.empty();
                //data = JSON.parse(data);
                if(data.status ===1){
                    if(data.commands.length === 0){
                        cplus_command_content.append("<div class=\"row\" style=\"width:100%;\">\n" +
                            "                    <div class=\"col-md-3\"></div>\n" +
                            "                    <div class=\"col-md-6\">\n" +
                            "                         <img src=\"./assets/media/custom/empty_box.png\" alt=\"\" style=\"width:100%;\">" +
                            "                         <h6 style=\"width:100%; text-align:center;\">Aucune commande trouvée</h6>\n" +
                            "                     </div>\n" +
                            "                     <div class=\"col-md-3\"></div>\n" +
                            "                  </div>");
                    }else{
                        for(let i=0; i< data.commands.length; i++){
                            cplus_command_content.append("<div  class=\"row\" style=\"border-left-style: solid; border-left-color: black; padding: 8px;margin: 8px\">\n" +
                                "                            <div style=\"flex: 3\">\n" +
                                "                                <h6><b>Bouquet: "+data.commands[i].denomination+"</b></h6>\n" +
                                "                                <p><b>Numéro d'abonnement</b>:"+data.commands[i].subscriber_number+";\n" +
                                "                                    <br/><b>Telephone</b>: "+data.commands[i].phone_number+"\n" +
                                "                                    <br/>Date de souscription: "+data.commands[i].created_at+"\n" +
                                "                            </div>\n" +
                                "                            <p style=\"flex:1; text-align: end\" ><b>"+data.commands[i].state+"</b></p>\n" +
                                "                        </div>");
                        }
                    }

                }else if (data.status === 0){
                    swal.fire({
                        "title": data.err_title,
                        "text": data.err_msg+". Code d'erreur "+data.err_code,
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary"
                    });
                    cplus_command_content.append("<div class=\"row\" style=\"width:100%;\">\n" +
                        "                    <div class=\"col-md-3\"></div>\n" +
                        "                    <div class=\"col-md-6\">\n" +
                        "                         <img src=\"./assets/media/custom/empty_box.png\" alt=\"\" style=\"width:100%;\">" +
                        "                         <h6 style=\"width:100%; text-align:center;\">Aucune commande trouvée</h6>\n" +
                        "                     </div>\n" +
                        "                     <div class=\"col-md-3\"></div>\n" +
                        "                  </div>");
                }else if (data.status === -1){
                    window.location.href ="{{route("spx.signin")}}"
                }

            }, function (error) {
                unloader("#cplus_commands_view");
                swal.fire({
                    "title": "Erreur interne",
                    "text": "Une erreur est survenue dans le serveur",
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary"
                });
            });
        }

        function list_packages() {
            //loader

            loader("#package_create");
            ajaxSubmit({
                url:"{{ route("spx.serv.get.tv_packages") }}",
            }, function (data) {
                unloader("#package_create");
                console.log("lavaleur12");
                let cplus_packages = $('#list_packages');
                cplus_packages.empty();
                cplus_packages.append("<option value=\"\">Veuillez selectionner un bouquet</option>");
                //data = JSON.parse(data);
                console.log("data",data);
                if(data.status === 1){
                    for(let i=0; i< data.packages.length; i++){
                        cplus_packages.append("<option value=\""+data.packages[i].id_tv_package+"\">"+data.packages[i].denomination+"</option>");
                    }
                }else if (data.status === 0){
                    swal.fire({
                        "title": data.err_title,
                        "text": data.err_msg+". Code d'erreur "+data.err_code,
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary"
                    });
                }else if (data.status === -1){
                    window.location.href ="{{route("spx.signin")}}"
                }

            }, function (error) {
                unloader("#package_create");
                let cplus_packages = $('#list_packages');
                cplus_packages.empty();
                cplus_packages.append("<option value=\"0\">Veuillez selectionner un bouquet</option>");
                swal.fire({
                    "title": "Erreur interne",
                    "text": "Une erreur est survenue dans le serveur",
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary"
                });
            });
        }
         function initCplus(){
            $('#payment_method').empty();
            $("#mtn_phone_number").hide();
            $("#orange_phone_number").hide();
         }

        function delete_subscription(id_tv_subscription,title) {
            swal.fire({
                title: 'Confirmation de Suppression',
                text: "voulez vous vraiment supprimer l'abonnement "+title+" ?",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Oui',
                cancelButtonText: 'Non',
            }).then(function(result) {
                if (result.value) {

                    loader("#cplus_list_view");
                    $.ajax({
                        url : "{{route('spx.serv.delete.tv_subscription')}}",
                        method : 'POST',
                        dataType:"JSON",
                        async:true,
                        data : JSON.stringify({
                            "_token":"{{csrf_token()}}",
                            id_tv_subscription: id_tv_subscription
                        }),
                        contentType:"application/json",
                        cache: false,
                        processData:false,
                        success : function(response, status){ // success est toujours en place, bien sûr !
                            unloader("#cplus_list_view");
                            response = JSON.parse(response);
                            if (response.status === 1){
                                swal.fire({
                                    "title": "Abonnement Supprimé",
                                    "text": "Votre abonnement Canal+ a été supprimé avec succès.",
                                    "type": "success",
                                    "confirmButtonClass": "btn btn-secondary",
                                    "onClose": function(e) {
                                        let cplus_content = $('#cplus_subscriptions');
                                        cplus_content.empty();
                                        list_subscriptions();
                                    }
                                });
                            }else {
                                swal.fire({
                                    "title": response.err_title,
                                    "text": response.err_msg+". Code d'erreur "+response.err_code,
                                    "type": "error",
                                    "confirmButtonClass": "btn btn-secondary",
                                });
                            }
                        },
                        error : function(error){
                            unloader("#cplus_list_view");
                            swal.fire({
                                "title": "Erreur interne",
                                "text": "Une erreur est survenue dans le serveur",
                                "type": "error",
                                "confirmButtonClass": "btn btn-secondary",
                            });
                        }

                    });

                }
            });

        }

        function momo_requestTopayStatus(transaction_code,payment_method){
            loader("#pay_cplus");
            $.ajax({
                url : "{{route('spx.op.post.requestpaystatus')}}",
                method : 'POST',
                dataType:"JSON",
                async:true,
                data : JSON.stringify({
                    transaction_code: transaction_code,
                    payment_method: payment_method
                }),
                contentType:"application/json",
                cache: false,
                processData:false,
                success : function(response){
                    //console.log("on test le process",response.status);
                    if (response.status === "SUCCESSFUL"){
                        //completeTheOperation(transaction_code);
                        clearTimeout(setTimeoutvar);
                        swal.fire({
                            "title": "Paiement effectué",
                            "text": "Merci pour le paiement, votre commande Canal Plus sera traitée d'ici peu",
                            "type": "success",
                            "confirmButtonClass": "btn btn-secondary",
                            "onClose": function(e) {
                                /*$("#pay_cplus").modal('hide');
                                let commands_content = $('#cplus_commands_view');
                                commands_content.empty();
                                list_commands();*/
                                window.location.href ="{{route("spx.serv.get.home_cplus")}}"
                            }
                        });
                    }else if(response.status === "FAILED") {
                        clearTimeout(setTimeoutvar);
                        swal.fire({
                            "title": "Paiement échoué",
                            "text": "Une erreur est survenue lors de la validation de votre paiement Canal Plus",
                            "type": "error",
                            "confirmButtonClass": "btn btn-secondary",
                            "onClose": function(e) {
                                window.location.href ="{{route("spx.serv.get.home_cplus")}}"
                            }
                        });
                    }else if(response.status ==="ERROR"){
                        clearTimeout(setTimeoutvar);
                        swal.fire({
                            "title": response.err_title,
                            "text": response.err_msg+". Code d'erreur "+response.err_code,
                            "type": "error",
                            "confirmButtonClass": "btn btn-secondary",
                            "onClose": function(e) {
                                window.location.href ="{{route("spx.serv.get.home_cplus")}}"
                            }
                        });
                    }else{//pending
                        setTimeoutvar = setTimeout(momo_requestTopayStatus(transaction_code,payment_method), 3000);
                    }
                },
                error : function(error){
                    unloader("#pay_cplus");
                    swal.fire({
                        "title": "Erreur interne",
                        "text": "Une erreur est survenue dans le serveur "+JSON.stringify(error),
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary",
                        "onClose": function(e) {
                            window.location.href ="{{route("spx.serv.get.home_cplus")}}"
                        }
                    });
                }

            });
        }
    </script>

@endsection
