<!-- MultiStep Form -->
<div class="row">
    <div class="col-md-4 mb-4">
        <div class="card mb-4">
          <div class="card-header py-3">
            <h5 class="mb-0">Details</h5>
          </div>
          <div class="card-body">
            <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                Abonnement N°
                <strong id="Na" style="font-size: 10px;">{{$subscription_number}}</strong>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                    <strong  style="font-size: 16px;">{{$bill->customerName}}</strong>
                </li>
              <li class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                Impayés
                <span style="color:#FA8072"><strong>{!! spx_format_money2($bill->unpaid)!!} XAF</strong></span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                Penalités
                <span style="color: #FA8072;"><strong>{{$bill->penalty}} XAF</strong></span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                Minimum à payer
                <span style="color: #FA8072;"><strong>{{$bill->minToPay}} XAF</strong></span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                Montant total
                <span><strong>{{$bill->balance}} XAF</strong></span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                <div>
                  <span>Montant du mois</span>
                </div>
                <strong style="color: #FA8072;">{{$bill->monthFlow}} XAF</strong>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                Date limite
                <strong style="color: #FA8072;">{{$bill->deadline}}</strong>
              </li>
              <input type="hidden" name="mintopay" value="{{$bill->minToPay}}"/>
            </ul>
          </div>
        </div>
    </div>
    <!-- MultiStep Form -->
    <div class="col-md-8 mb-4">
        <div class="col-12" id="details_fees">

        </div>
        <div class="container-fluid" id="grad1">
            <div class="row justify-content-center mt-0">
                <div class="col-11 col-sm-9 col-md-7 col-lg-12 text-center p-0 mb-2">
                    <div class="card px-0 pt-4 pb-0 mt-3 mb-3">
                        <div class="row">
                            <div class="col-md-12 mx-0">
                                <form id="msform" class="kt-form">
                                    @csrf
                                    <!-- progressbar -->
                                    <ul id="progressbar">
                                        <li class="active" id="account"><strong>Montant</strong></li>
                                        <li id="personal"><strong>Paiement</strong></li>
                                        <li id="confirm"><strong>Finish</strong></li>
                                    </ul>
                                    <!-- fieldsets -->
                                    <fieldset>
                                        <div class="form-card">
                                            <h2 class="fs-title">Information du montant</h2>
                                            <div class="form-group form-group-last" style="padding-bottom: 5%;">
                                                <label>Operation</label>
                                                <select id="select_operation" class="form-control" name="operation">
                                                    <option value="" disabled selected>Selectionner une operation</option>
                                                    <option value="0">Regler une facture</option>
                                                    <option value="1">Recharger son compte Prepayé</option>
                                                    <option value="2">Recharger son compte camwater</option>
                                                </select>
                                            </div>
                                            <div class="form-group form-group-last">
                                                <label>Montant</label>
                                                <input type="text" id="amount" name="amount" class="form-control" placeholder="Montant">
                                            </div>
                                            <span class="invalide_step1" style="color: red;"></span>
                                        </div>
                                        <input type="button" name="next" class="btn btn-outline-warning btn-elevate kt-login__btn-warning action-button next" value="Suivant"/>
                                    </fieldset>
                                    <fieldset>
                                        <div class="form-card">
                                            <!--h2 class="fs-title">Information du paiement</h2-->
                                            <p id="mess_warning" style="color: black;"> </p>
                                            <br/>
                                            <p style="color: black;">Veuillez selectionner votre moyen de paiement</p>
                                            <div class="kt-radio-list" id="methodes-de-paiement">

                                            </div>
                                            <input type="hidden" id="reference" name="mypackages">
                                            <input type="hidden" id="mintopay" name="minToPay" value="{{$bill->minToPay}}" />
                                            <input type="hidden" id="monthflow" name="monthFlow" value="{{$bill->monthFlow}}" />
                                            <input type="hidden" id="unpaid" name="unpaid" value="{{$bill->unpaid}}" />
                                            <input type="hidden" id="deadline" name="deadline" value="{{$bill->deadline}}" />
                                            <div class="form-group" id="mtn_phone_number" style="display:none">
                                                <label>Numéro de téléphone MTN Mobile Money</label>
                                                <div>
                                                    <div class="input-group">
                                                        <div class="input-group-prepend"><span class="input-group-text"><i class="la la-phone"></i>+237</span></div>
                                                        <input type="text" name="momo_phone_number" class="form-control" placeholder="Veuillez entrer le numéro de téléphone lié à votre compte MTN Mobile Money" aria-describedby="basic-addon1">
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
                                            <div class="form-group form-group-last" style="padding-top: 10px;">
                                                <label>Mot de passe</label>
                                                <input type="password" name="password" class="form-control" placeholder="Mot de passe" value="">
                                            </div>

                                        </div>
                                        <input type="button" name="previous" class="previous btn btn-outline-info btn-elevate kt-login__btn-warning" value="Précédent"/>
                                        <input type="button" id="save_operation" name="save" class="btn btn-warning btn-elevate kt-login__btn-warning" value="Confirmer"/>

                                    </fieldset>
                                    <fieldset>
                                        <div class="form-card">
                                            <h2 class="fs-title text-center">Success !</h2>
                                            <br><br>
                                            <div class="row justify-content-center">
                                                <div class="col-3">
                                                    <img src="https://img.icons8.com/color/96/000000/ok--v2.png" class="fit-image">
                                                </div>
                                            </div>
                                            <br><br>
                                            <div class="row justify-content-center">
                                                <div class="col-7 text-center">
                                                    <h5>your transaction has been successfully completed</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <input type="button" name="next" class="btn btn-outline-success btn-elevate kt-login__btn-warning"  data-dismiss="modal" aria-label="Close" value="OK"/>
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    $(document).ready(function () {
        //jQuery time
        var current_fs, next_fs, previous_fs; //fieldsets
            var opacity;

            $(".next").click(function(){
                let operation = $("select[name=operation]").val();
                let amount = parseFloat($("#amount").val());
                let mintopay = parseFloat($("input[name=mintopay]").val());
                let operation_text = $( "#select_operation option:selected").text();
                if(operation =="" || operation==" " || amount=="" || amount ==" ")
                {
                    $('.invalide_step1').text("Ces champs ne peuvent pas etre vides!");
                    return 1;
                }else{
                    if((amount < mintopay) && operation ==0){

                        $('.invalide_step1').text("Montant inferieur au montant minimum à payer!");
                        return 1
                    }
                    $('.invalide_step1').text("");
                }
                loader("#payment-form");
                current_fs = $(this).parent();
                next_fs = $(this).parent().next();

                //Add Class Active
                $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

                //show the next fieldset
                next_fs.show();
                //hide the current fieldset with style
                current_fs.animate({opacity: 0}, {
                    step: function(now) {
                        // for making fielset appear animation
                        opacity = 1 - now;

                        current_fs.css({
                            'display': 'none',
                            'position': 'relative'
                        });
                        next_fs.css({'opacity': opacity});
                    },
                    duration: 600
                });
                $.ajax({
                    url: "{{route('spx.serv.get.camwater_payment_lastStep')}}",
                    method : 'POST',
                    dataType:"JSON",
                    async:true,
                    data : JSON.stringify({
                        "_token":"{{csrf_token()}}",
                        id_camwater_subscription: selected_subscriptions[0].id_camwater_subscription,
                        amount:amount,
                        operation:operation
                    }),
                    contentType:"application/json",
                    cache: false,
                    processData:false,
                    success: function (res) {
                        if (res.status == 1) {
                            console.log("processs on");
                            $("#mess_warning").html("Vous allez "+operation_text+" avec un montant de "+amount+" XAF, veuillez choisir le moyen de paiement et entrer votre mot de passe pour valider la transaction");
                            $('#details_fees').html(res.view);
                            $('#methodes-de-paiement').html(res.view2);
                        } else {
                            console.log('impossible de recuperer les données du montant plus la commission');
                        }
                        unloader("#payment-form");
                    },
                    error: function (data) {
                        unloader("#payment-form");
                        console.log(data);
                    }
                });

            });

            $(".previous").click(function(){

                current_fs = $(this).parent();
                previous_fs = $(this).parent().prev();

                //Remove class active
                $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

                //show the previous fieldset
                previous_fs.show();

                //hide the current fieldset with style
                current_fs.animate({opacity: 0}, {
                    step: function(now) {
                        // for making fielset appear animation
                        opacity = 1 - now;

                        current_fs.css({
                            'display': 'none',
                            'position': 'relative'
                        });
                        previous_fs.css({'opacity': opacity});
                    },
                    duration: 600
                });
            });

            $('.radio-group .radio').click(function(){
                $(this).parent().find('.radio').removeClass('selected');
                $(this).addClass('selected');
            });

            $(".submit").click(function(){
                return false;
            })

            $("input[type=radio][name=payment_mode]").change(function() {
                if (this.value === 'MTNMOMO') {
                    $("#mtn_phone_number").show();
                    $("#orange_phone_number").hide();
                }
                else if(this.value === 'OM') {
                    $("#orange_phone_number").show();
                    $("#mtn_phone_number").hide();
                }
                else{
                    $("#orange_phone_number").hide();
                    $("#mtn_phone_number").hide();
                }
            });

            $("#save_operation").click(function(e){
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
                        password: {
                            required: "Ce champs est requis"
                        }
                    }
                });

                if (!form.valid()) {
                    return;
                }
                $('#reference').val(selected_subscriptions[0].reference);
                btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
                loader("#payment-form");
                form.ajaxSubmit({
                    url: "{{route('spx.serv.camwater.pay')}}",
                    method:"POST",
                    success: function (response, status, xhr, $form) {
                        unloader("#payment-form");
                        btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                        if (response.status === 1){
                            console.log("process on here",response);
                            unloader("#payment-form");
                            switch (response.step) {
                                case "SESAME":
                                    swal.fire({
                                        "title": "Paiement effectué",
                                        "text": "Votre operation a été enregistrée avec succès. Elle sera traité dans les plus befs delais",
                                        "type": "success",
                                        "confirmButtonClass": "btn btn-secondary",
                                        "onClose": function(e) {
                                            $("#pay_cplus").modal('hide');
                                            //let commands_content = $('#cplus_commands_view');
                                            //commands_content.empty();
                                            list_subscriptions();
                                        }
                                    });
                                    break;
                                case "MTNMOMO":
                                    setTimeoutvar = setTimeout(momo_requestTopayStatus(response.transaction_code), 3000);
                                    console.log("transaction_code",response.transaction_code);
                                    //$("#pay_cplus").modal('hide');
                                    $('#payment-form').html(response.view);
                                    break;

                                case "OM":
                                setTimeoutvar = setTimeout(momo_requestTopayStatus(response.transaction_code), 3000);
                                //$("#pay_cplus").modal('hide');
                                $('#payment-form').html(response.view);
                                break;
                                case "VISA/MASTERCARD":
                                //setTimeoutvar = setTimeout(momo_requestTopayStatus(response.transaction_code), 3000);
                                window.location.href=response.api;
                                console.log("transaction_code",response.transaction_code);
                                //$("#pay_cplus").modal('hide');
                                $('#payment-form').html(response.view);
                                break;
                            }
                        }else if(response.status === 0){
                            swal.fire({
                                "title": response.err_title,
                                "text": response.err_msg+". Code d'erreur "+response.err_code,
                                "type": "error",
                                "confirmButtonClass": "btn btn-secondary",

                            });
                        }else if (response.status === -1){
                            loader("##payment-form");
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
/*function momo_requestTopayStatus1(transaction_code){
            loader("#pay_cplus");
            $.ajax({
                url : "{{route('spx.op.post.requestpaystatus')}}",
                method : 'POST',
                dataType:"JSON",
                async:true,
                data : JSON.stringify({
                    transaction_code: transaction_code
                }),
                contentType:"application/json",
                cache: false,
                processData:false,
                success : function(response){
                    if (response.status === "SUCCESSFUL"){
                        clearTimeout(setTimeoutvar);
                        swal.fire({
                            "title": "Paiement effectué",
                            "text": "Merci pour le paiement, votre operation a été enregistré avec succèss",
                            "type": "success",
                            "confirmButtonClass": "btn btn-secondary",
                            "onClose": function(e) {
                                $("#pay_cplus").modal('hide');
                                list_subscriptions();
                            }
                        });
                    }else if(response.status === "FAILED") {
                        clearTimeout(setTimeoutvar);
                        swal.fire({
                            "title": "Paiement échoué",
                            "text": "Une erreur est survenue lors de votre operation",
                            "type": "error",
                            "confirmButtonClass": "btn btn-secondary",
                            "onClose": function(e) {
                                window.location.href ="{{route("spx.serv.get.home_camwater")}}"
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
                                window.location.href ="{{route("spx.serv.get.home_camwater")}}"
                            }
                        });
                    }else{//pending
                        setTimeoutvar = setTimeout(momo_requestTopayStatus1(transaction_code), 3000);
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
                            window.location.href ="{{route("spx.serv.get.home_camwater")}}"
                        }
                    });
                }

            });
        }*/
</script>
