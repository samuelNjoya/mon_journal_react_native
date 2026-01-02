<script>
    //gestion des opérations
    var deposit_type="";

    $(document).ready(function() {

        //transfert vers un abonné
        $("#acc_transf_but").click(function() {
            preview_account_transfert();
        });

        function preview_account_transfert() {
            //loader
            loader("#account_transfert");
            ajaxSubmit({
                url: "{{ route('spx.op.get.account_transfert') }}",
            }, function(data) {
                if (data.status === 1) {
                    $(".modal-header").css("background-color", "#fddb2c");
                    $(".opmodal-title").css("color", "#000");
                    $("#acc_transfert_body").html(data.view);
                    //desactiver le loader
                    unloader("#account_transfert");
                    //lorsqu'on soumet le formulaire

                    $('#kt_acc_transfert').click(function(e) {
                        e.preventDefault();
                        let btn = $(this);
                        let form = $(this).closest('form');
                        form.validate({
                            rules: {
                                phone_number: {
                                    required: true,
                                    minlength: 9,
                                    maxlength: 9
                                },
                                amount: {
                                    required: true,
                                    min: 0,
                                }
                            },
                            messages: {
                                phone_number: {
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

                        if (!form.valid()) {
                            return;
                        }

                        btn.addClass(
                                'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light')
                            .attr('disabled', true);
                        loader("#acc_transfert_body");
                        form.ajaxSubmit({
                            url: "{{ route('spx.op.preview.account_transfert') }}",
                            method: "POST",
                            success: function(response, status, xhr, $form) {
                                unloader("#acc_transfert_body");
                                btn.removeClass(
                                    'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light'
                                ).attr('disabled', false);

                                if (response.status === 1) {
                                    $('#acc_transfert_body').html(response.view);
                                } else if (response.status === 0) {
                                    swal.fire({
                                        "title": response.err_title,
                                        "text": response.err_msg +
                                            ". Code d'erreur " + response
                                            .err_code,
                                        "type": "error",
                                        "confirmButtonClass": "btn btn-secondary",

                                    });
                                } else if (response.status === -1) {
                                    loader("#acc_transfert_body");
                                    window.location.href =
                                        "{{ route('spx.signin') }}"
                                }

                            },
                            error: function(error) {
                                unloader("#acc_transfert_body");
                                btn.removeClass(
                                    'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light'
                                ).attr('disabled', false);
                                let responseText = JSON.parse(error.responseText);
                                swal.fire({
                                    "title": responseText.err_title,
                                    "text": responseText.err_msg +
                                        ". Code d'erreur " + responseText
                                        .err_code,
                                    "type": "error",
                                    "confirmButtonClass": "btn btn-secondary",
                                    "onClose": function(e) {
                                        console.log(
                                            'on close event fired!');
                                    }
                                });
                            }
                        });
                    });
                } else if (data.status === -1) {
                    window.location.href = "{{ route('spx.signin') }}"
                }

            }, function(error) {
                unloader("#account_transfert");
                alert("Error");
            });
        }

        //transfert vers un non abonné
        $("#non_acc_transf_but").click(function() {
            non_account_transfert();
        });

        function non_account_transfert() {
            //loader
            loader("#non_account_transfert");
            ajaxSubmit({
                url: "{{ route('spx.op.get.nonaccount_transfert') }}",
            }, function(data) {
                if (data.status === 1) {
                    $(".modal-header").css("background-color", "#fddb2c");
                    $(".opmodal-title").css("color", "#000");
                    $("#non_account_transfert_body").html(data.view);
                    //desactiver le loader
                    unloader("#non_account_transfert");

                    //lorsqu'on soumet le formulaire
                    $('#kt_non_acc_transfert').click(function(e) {
                        e.preventDefault();
                        let non_acc_transf_btn = $(this);
                        //let form = $('.kt-login__form');
                        let non_acc_transf_form = $(this).closest('form');
                        non_acc_transf_form.validate({
                            rules: {
                                lastname: {
                                    required: true
                                },
                                firstname: {
                                    required: true
                                },
                                phone_number: {
                                    required: true,
                                    minlength: 9,
                                    maxlength: 9
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
                                firstname: {
                                    required: "Ce champs est requis"
                                },
                                phone_number: {
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


                        if (!non_acc_transf_form.valid()) {
                            return;
                        }

                        loader("#non_account_transfert_body");
                        non_acc_transf_btn.addClass(
                                'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light')
                            .attr('disabled', true);
                        non_acc_transf_form.ajaxSubmit({
                            url: "{{ route('spx.op.preview.nonaccount_transfert') }}",
                            method: "POST",
                            success: function(response, status, xhr, $form) {
                                unloader("#non_account_transfert_body");
                                non_acc_transf_btn.removeClass(
                                    'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light'
                                ).attr('disabled', false);
                                if (response.status === 1) {
                                    $('#non_account_transfert_body').html(response
                                        .view);
                                } else if (response.status === 0) {
                                    swal.fire({
                                        "title": response.err_title,
                                        "text": response.err_msg +
                                            ". Code d'erreur " + response
                                            .err_code,
                                        "type": "error",
                                        "confirmButtonClass": "btn btn-secondary",
                                    });
                                } else if (response.status === -1) {
                                    loader("#non_account_transfert_body");
                                    window.location.href =
                                        "{{ route('spx.signin') }}"
                                }

                            },
                            error: function(error) {
                                unloader("#non_account_transfert_body");
                                non_acc_transf_btn.removeClass(
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
                    window.location.href = "{{ route('spx.signin') }}"
                }

            }, function(error) {
                unloader("#non_account_transfert");
                alert("Erreur");
            });
        }

        //transfert international
        $("#international_transfert_but").click(function() {
            international_transfert();
        });

        function international_transfert() {
            //loader
            loader("#international_transfert");
            ajaxSubmit({
                url: "{{ route('spx.op.get.international_transfert') }}",
            }, function(data) {
                if (data.status === 1) {
                    $(".modal-header").css("background-color", "#fddb2c");
                    $(".opmodal-title").css("color", "#000");
                    $("#international_transfert_body").html(data.view);
                    data.withdrawal_modes.map(function(elt) {
                        $("#select_withdrawal_method").append("<option value="+elt.value+">"+elt.label+"</option>")
                    });
                    //init_inter_trans_form();
                    getCountry("CM")
                    $("#country").countrySelect({
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
                    unloader("#international_transfert")

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
                                $("#label_phone_number").html("Numéro de téléphone MTN Mobile Money du bénéficiaire");

                            }
                            if($('#select_withdrawal_method').val()=='SESAMPAYX')
                            {
                                $("#nom_ben").hide();
                                $("#prenom_ben").hide();
                                $("#div_cni").hide();
                                $("#div_type_cni").hide();
                                $("#label_phone_number").html("Numéro de téléphone Sesampayx du bénéficiaire");
                            }
                            if($('#select_withdrawal_method').val()=='GUICHET')
                            {
                                $("#nom_ben").show();
                                $("#prenom_ben").show();
                                $("#div_cni").show();
                                $("#div_type_cni").show();
                                $("#label_phone_number").html("Numéro de téléphone du bénéficiaire");
                            }
                        }

                    });

                    //lorsqu'on soumet le formulaire
                    $('#kt_international_transfert').click(function(e) {
                        e.preventDefault();
                        let international_transf_btn = $(this);
                        //let form = $('.kt-login__form');
                        let international_transfert_form = $(this).closest('form');
                        international_transfert_form.validate({
                            ignore: ":hidden",
                            rules: {
                                lastname: {
                                    required: true
                                },
                                firstname: {
                                    required: true
                                },
                                phone_number_: {
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
                                phone_number_: {
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
                            $("#phone_number_not_valid").removeClass("d-none")
                            return
                        }

                        loader("#international_transfert_body");
                        international_transf_btn.addClass(
                                'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light')
                            .attr('disabled', true);
                        international_transfert_form.ajaxSubmit({
                            url: "{{ route('spx.op.preview.checkAccount') }}",
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
                                    $('#international_transfert_body').html(response.view);
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
                    window.location.href = "{{ route('spx.signin') }}"
                }

            }, function(error) {
                unloader("#international_transfert");
                alert("Erreur");
            });
        }

        function init_inter_trans_form(){
            $("#cash_phone_number").hide();
            $("#nom_ben").hide();
            $("#prenom_ben").hide();
        }

        //Consulter le solde
        $("#balance_but").click(function() {
            check_balance();
        });

        function check_balance() {
            //loader
            loader("#check_balance");
            ajaxSubmit({
                url: "{{ route('spx.op.get.balance') }}",
            }, function(data) {
                if (data.status === 1) {
                    $(".modal-header").css("background-color", "#fddb2c");
                    $(".opmodal-title").css("color", "#000");
                    $("#check_balance_body").html(data.view);
                    //desactiver le loader
                    unloader("#check_balance");
                    //lorsqu'on soumet le formulaire
                    $('#kt_check_balance').click(function(e) {
                        e.preventDefault();
                        let btn = $(this);
                        //let form = $('.kt-login__form');
                        let form = $(this).closest('form');
                        form.validate({
                            rules: {
                                password: {
                                    required: true
                                }
                            },
                            messages: {
                                password: {
                                    required: "Ce champs est requis"
                                }
                            }
                        });

                        if (!form.valid()) {
                            return;
                        }

                        btn.addClass(
                                'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light')
                            .attr('disabled', true);
                        loader("#check_balance_body");
                        form.ajaxSubmit({
                            url: "{{ route('spx.op.post.balance') }}",
                            method: "POST",
                            success: function(response, status, xhr, $form) {
                                unloader("#check_balance_body");
                                btn.removeClass(
                                    'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light'
                                ).attr('disabled', false);
                                if (response.status === 1) {
                                    $(".modal-header").css("background-color",
                                        "#0aefae");
                                    $(".opmodal-title").css("color", "#fff");
                                    $('#check_balance_body').html(response.view);
                                } else if (response.status === 0) {
                                    swal.fire({
                                        "title": response.err_title,
                                        "text": response.err_msg +
                                            ". Code d'erreur " + response
                                            .err_code,
                                        "type": "error",
                                        "confirmButtonClass": "btn btn-secondary",

                                    });
                                } else if (response.status === -1) {
                                    loader("#check_balance_body");
                                    window.location.href =
                                        "{{ route('spx.signin') }}"
                                }

                            },
                            error: function(error) {
                                unloader("#check_balance_body");
                                btn.removeClass(
                                    'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light'
                                ).attr('disabled', false);
                                let responseText = JSON.parse(error.responseText);
                                swal.fire({
                                    "title": responseText.err_title,
                                    "text": responseText.err_msg +
                                        ". Code d'erreur " + responseText
                                        .err_code,
                                    "type": "error",
                                    "confirmButtonClass": "btn btn-secondary",
                                    "onClose": function(e) {
                                        console.log(
                                            'on close event fired!');
                                    }
                                });
                            }
                        });
                    });
                } else if (data.status === -1) {
                    window.location.href = "{{ route('spx.signin') }}"
                }

            }, function(error) {
                unloader("#check_balance");
                alert("Error");
            });
        }

        $("#deposit_but").click(function() {
            deposit_type="SESAMPAYX";
            init_deposit();
        });

        function init_deposit() {
            loader("#deposit");
            ajaxSubmit({
                url: "{{ route('spx.op.get.deposit') }}",
            }, function(data) {
                if (data.status === 1) {
                    $(".modal-header").css("background-color", "#fddb2c");
                    $(".opmodal-title").css("color", "#000");
                    $("#deposit_body").html(data.view);
                    //desactiver le loader
                    unloader("#deposit");
                    $("#deposit_type").val(deposit_type);
                    //Afficher la bonne zone de texte lorsqu'on clique sur un mode de paiement
                    $("input[type=radio][name=payment_method]").change(function() {
                        if (this.value === 'MTNMOMO') {
                            $("#mtn_phone_number").show();
                            $("#om_phone_number").hide();
                        } else if (this.value === 'OM') {
                            $("#mtn_phone_number").hide();
                            $("#om_phone_number").show();
                        } else if (this.value === 'VISA/MASTERCARD') {
                            $("#mtn_phone_number").hide();
                            $("#om_phone_number").hide();
                        }
                    });
                    //lorsqu'on soumet le formulaire
                    $('#kt_init_deposit').click(function(e) {
                        e.preventDefault();
                        let btn = $(this);
                        //let form = $('.kt-login__form');
                        let form = $(this).closest('form');
                        form.validate({
                            ignore: ":hidden",
                            rules: {
                                mtn_phone_number: {
                                    required: true,
                                    minlength: 9,
                                    maxlength: 9
                                },
                                om_phone_number: {
                                    required: true,
                                    minlength: 9,
                                    maxlength: 9
                                },
                                amount: {
                                    required: true,
                                    min: 0,
                                }
                            },
                            messages: {
                                mtn_phone_number: {
                                    required: "Ce champs est requis",
                                    minlength: "la longueur de ce champs est de 9",
                                    maxlength: "la longueur de ce champs est de 9"
                                },
                                om_phone_number: {
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

                        if (!form.valid()) {
                            return;
                        }

                        btn.addClass(
                                'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light')
                            .attr('disabled', true);
                        loader("#deposit_body");
                        form.ajaxSubmit({
                            url: "{{ route('spx.op.post.preview.deposit') }}",
                            method: "POST",
                            success: function(response, status, xhr, $form) {
                                unloader("#deposit_body");
                                btn.removeClass(
                                    'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light'
                                ).attr('disabled', false);
                                if (response.status === 1) {
                                    $('#deposit_body').html(response.view);
                                    // $("#confirmdeposit").click(function (e) {
                                    //     e.preventDefault();
                                    //     confirmDeposit(response.payment_method,response.amount, response.phone_number);
                                    // });
                                } else if (response.status === 0) {
                                    swal.fire({
                                        "title": response.err_title,
                                        "text": response.err_msg +
                                            ". Code d'erreur " + response
                                            .err_code,
                                        "type": "error",
                                        "confirmButtonClass": "btn btn-secondary",

                                    });
                                } else if (response.status === -1) {
                                    loader("#deposit_body");
                                    window.location.href =
                                        "{{ route('spx.signin') }}"
                                }

                            },
                            error: function(error) {
                                unloader("#deposit_body");
                                btn.removeClass(
                                    'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light'
                                ).attr('disabled', false);
                                let responseText = JSON.parse(error.responseText);
                                swal.fire({
                                    "title": responseText.err_title,
                                    "text": responseText.err_msg +
                                        ". Code d'erreur " + responseText
                                        .err_code,
                                    "type": "error",
                                    "confirmButtonClass": "btn btn-secondary",
                                    "onClose": function(e) {
                                        console.log(
                                            'on close event fired!');
                                    }
                                });
                            }
                        });
                    });
                } else if (data.status === -1) {
                    window.location.href = "{{ route('spx.signin') }}"
                }

            }, function(error) {
                unloader("#deposit_body");
                alert("Error");
            });
        }

        $("#deposit_visa").click(function() {
            deposit_type="VISA";
            init_visa_deposit();
        });

        function init_visa_deposit() {
            loader("#deposit_visa_body");
            ajaxSubmit({
                url: "{{ route('spx.op.get.visa.deposit') }}",
            }, function(data) {
                if (data.status === 1) {
                    $(".modal-header").css("background-color", "#fddb2c");
                    $(".opmodal-title").css("color", "#000");
                    $("#deposit_visa_body").html(data.view);
                    //desactiver le loader
                    unloader("#depositVisa");
                    //Afficher la bonne zone de texte lorsqu'on clique sur un mode de paiement
                    $(document).on("change","input[type=radio][name=payment_method_visa]",function() {
                        if (this.value === 'MTNMOMO') {
                            $("#phone_number_label").html("Numero MTN Mobile Money");
                            $("#deposit_phone_number").show();
                        } else if (this.value === 'OM') {
                            $("#deposit_phone_number").show();
                            $("#phone_number_label").html("Numero Orange Money");
                        } else if (this.value == 'VISA/MASTERCARD') {
                            $("#deposit_phone_number").hide();
                        } else if (this.value === 'SESAME') {
                            $("#deposit_phone_number").hide();
                        }
                    });
                    //lorsqu'on soumet le formulaire
                    $('#kt_init_visa_deposit').click(function(e) {
                        e.preventDefault();
                        let btn = $(this);
                        //let form = $('.kt-login__form');
                        let form = $(this).closest('form');
                        form.validate({
                            ignore: ":hidden",
                            rules: {
                                phone_number: {
                                    required: true,
                                    minlength: 9,
                                    maxlength: 9
                                },
                                amount: {
                                    required: true,
                                    min: 0,
                                },
                                card_number:{
                                    required: true,
                                    minlength: 10,
                                    maxlength: 10
                                }
                            },
                            messages: {
                                phone_number: {
                                    required: "Ce champs est requis",
                                    minlength: "la longueur de ce champs est de 9",
                                    maxlength: "la longueur de ce champs est de 9"
                                },
                                amount: {
                                    required: "Ce champs est requis",
                                    min: "Le montant doit être une valeur supérieure à 0",
                                },
                                card_number: {
                                    required: "Ce champs est requis",
                                    minlength: "la longueur de ce champs est de 10",
                                    maxlength: "la longueur de ce champs est de 10"
                                },
                            }
                        });

                        if (!form.valid()) {
                            return;
                        }

                        btn.addClass(
                                'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light')
                            .attr('disabled', true);
                        loader("#deposit_visa_body");
                        form.ajaxSubmit({
                            url: "{{ route('spx.op.post.preview.visa.deposit') }}",
                            method: "POST",
                            success: function(response, status, xhr, $form) {
                                unloader("#deposit_visa_body");
								
                                btn.removeClass(
                                    'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light'
                                ).attr('disabled', false);
                                if (response.status === 1) {
                                    $('#deposit_visa_body').html(response.view);
                                    // $("#confirmdeposit").click(function (e) {
                                    //     e.preventDefault();
                                    //     confirmDeposit(response.payment_method,response.amount, response.phone_number);
                                    // });
                                } else if (response.status === 0) {
                                    swal.fire({
                                        "title": response.err_title,
                                        "text": response.err_msg +
                                            ". Code d'erreur " + response
                                            .err_code,
                                        "type": "error",
                                        "confirmButtonClass": "btn btn-secondary",

                                    });
                                } else if (response.status === -1) {
                                    loader("#deposit_visa_body");
                                    window.location.href =
                                        "{{ route('spx.signin') }}"
                                }

                            },
                            error: function(error) {
                                unloader("#deposit_visa_body");
                                btn.removeClass(
                                    'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light'
                                ).attr('disabled', false);
                                let responseText = JSON.parse(error.responseText);
                                swal.fire({
                                    "title": responseText.err_title,
                                    "text": responseText.err_msg +
                                        ". Code d'erreur " + responseText
                                        .err_code,
                                    "type": "error",
                                    "confirmButtonClass": "btn btn-secondary",
                                    "onClose": function(e) {
                                        console.log(
                                            'on close event fired!');
                                    }
                                });
                            }
                        });
                    });
                } else if (data.status === -1) {
                    window.location.href = "{{ route('spx.signin') }}"
                }

            }, function(error) {
                unloader("#deposit_visa_body");
                alert("Error");
            });
        }

    });

    //Depot Sesame
    var setTimeoutvar;

    function confirmDeposit(payment_method, amount = 0, phone_number = "", commission = '', fees = '', total_amount =
        '', url = "") {
        switch (payment_method) {
            case "MTNMOMO":
            case "OM":
                requestTopay(payment_method, parseFloat(amount), phone_number, commission, fees, total_amount);
                break;
            case "VISA/MASTERCARD":
                renderVisaMasterCardFrame(url)
                break;
        }
    }

    function confirmVisaDeposit(payment_method, amount = 0, phone_number = "", commission = '', fees = '', total_amount ='', card_number = "") {
        requestVisaDeposit(payment_method, parseFloat(amount), phone_number, commission, fees, total_amount,card_number);
    }

    function confirmInternational(e,amount,country,firstname,lastname,phone_number,cni="") {
        loader("#deposit_body");
        //window.location.href = url;
    }

    function renderVisaMasterCardFrame(url) {
        loader("#international_transfert_body");
        window.location.href = url;
    }

    function requestTopay(payment_method, amount, phone_number, commission = '', fees = '', total_amount = '') {
        loader("#deposit_body");
        $('#confirmdeposit').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled',
            true);
        $.ajax({
            url: "{{ route('spx.op.post.requestpay') }}",
            method: 'POST',
            dataType: "JSON",
            async: true,
            data: JSON.stringify({
                payment_method: payment_method,
                amount: amount,
                phone_number: phone_number,
                commission: commission,
                fees: fees,
                total_amount: total_amount,
            }),
            contentType: "application/json",
            cache: false,
            processData: false,
            success: function(response, status) { // success est toujours en place, bien sûr !
                unloader("#deposit_body");
                $('#confirmdeposit').removeClass(
                    'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled',
                    false);
                if (response.status === 1) {
                    $('#deposit_body').html(response.view);
                    setTimeoutvar = setTimeout(requestTopayStatus(response.transaction_code,
                        payment_method), 3000);
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
                unloader("#deposit_body");
                $('#confirmdeposit').removeClass(
                    'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled',
                    false);
                swal.fire({
                    "title": "Erreur interne",
                    "text": "Une erreur est survenue dans le serveur",
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary",
                    "onClose": function(e) {
                        window.location.href = "{{ route('spx.home') }}"
                    }
                });
            }

        });
    }

    function requestVisaDeposit(payment_method, amount, phone_number, commission = '', fees = '', total_amount = '',card_number='') {
		if($("#password_confirm_visa_deposit_id").val()=="" || $("#password_confirm_visa_deposit_id").val()==undefined){
			$("#password_confirm_visa_deposit_error_id").text("Ce champ es trequis");
			return;
		}
		$("#password_confirm_visa_deposit_error_id").text("");
        loader("#deposit_visa_body");
        $('#confirmvisadeposit').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled',true);
        $.ajax({
            url: "{{ route('spx.op.post.requestVisaDeposit') }}",
            method: 'POST',
            dataType: "JSON",
            async: true,
            data: JSON.stringify({
                payment_method: payment_method,
                amount: amount,
                phone_number: phone_number,
                commission: commission,
                fees: fees,
                total_amount: total_amount,
                card_number:card_number,
				password:$("#password_confirm_visa_deposit_id").val()
				
            }),
            contentType: "application/json",
            cache: false,
            processData: false,
            success: function(response, status) { // success est toujours en place, bien sûr !
                unloader("#deposit_visa_body");
                $('#confirmvisadeposit').removeClass(
                    'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled',
                    false);
                if (response.status === 1) {
                    switch(payment_method){
                        case "SESAME":
                            swal.fire({
                                    "title": "Paiement effectué",
                                    "text": "Votre demande de recharge a été enregistrée avec succès. Elle sera traité dans les plus befs delais",
                                    "type": "success",
                                    "confirmButtonClass": "btn btn-secondary",
                                    "onClose": function(e) {
                                        $("#depositVisa").modal('hide');
                                        //window.location.href = "{{ route('spx.home') }}"
                                    }
                            });
                            break;
                        case "MTNMOMO":
                        case "OM":
                            $('#deposit_visa_body').html(response.view);
                            setTimeoutvar = setTimeout(requestVisaDepositCheckStatus(response.transaction_code,
                            payment_method), 3000);
                            break;
                        case "VISA/MASTERCARD":
                            console.log("url du paiement",response.url);
                            window.location.href = response.url;
                            break;
                        default:
                            swal.fire({
                                "title": "Error",
                                "text": "Une erreur s'est produite lors de la verification du mode de paiement",
                                "type": "error",
                                "confirmButtonClass": "btn btn-secondary",
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
                unloader("#deposit_visa_body");
                $('#confirmvisadeposit').removeClass(
                    'kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled',
                    false);
                swal.fire({
                    "title": "Erreur interne",
                    "text": "Une erreur est survenue dans le serveur",
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary",
                    "onClose": function(e) {
                        window.location.href = "{{ route('spx.home') }}"
                    }
                });
            }

        });
    }

    function requestTopayStatus(transaction_code, payment_method) {
        //loader("#deposit");
        loader("#deposit_body");
        $.ajax({
            url: "{{ route('spx.op.post.requestpaystatus') }}",
            method: 'POST',
            dataType: "JSON",
            async: true,
            data: JSON.stringify({
                transaction_code: transaction_code,
                payment_method: payment_method
            }),
            contentType: "application/json",
            cache: false,
            processData: false,
            success: function(response) {
                if (response.status === "SUCCESSFUL") {
                    clearTimeout(setTimeoutvar);
                    swal.fire({
                        "title": "Recharge effectuée",
                        "text": "Votre compte SesamPayx a été rechargé avec succès",
                        "type": "success",
                        "confirmButtonClass": "btn btn-secondary",
                        "onClose": function(e) {
                            window.location.href = "{{ route('spx.home') }}"
                        }
                    });
                } else if (response.status === "FAILED") {
                    clearTimeout(setTimeoutvar);
                    swal.fire({
                        "title": "Recharge échouée",
                        "text": "Une erreur est survenue lors de la validation de votre transaction",
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary",
                        "onClose": function(e) {
                            window.location.href = "{{ route('spx.home') }}"
                        }
                    });
                } else if (response.status === "ERROR") {
                    clearTimeout(setTimeoutvar);
                    swal.fire({
                        "title": response.err_title,
                        "text": response.err_msg + ". Code d'erreur " + response.err_code,
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary",
                        "onClose": function(e) {
                            window.location.href = "{{ route('spx.home') }}"
                        }
                    });
                } else { //pending
                    setTimeoutvar = setTimeout(requestTopayStatus(transaction_code, payment_method), 3000);
                }
            },
            error: function(error) {
                unloader("#deposit");
                $('#btn_next').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light')
                    .attr('disabled', false);
                swal.fire({
                    "title": "Erreur interne",
                    "text": "Une erreur est survenue dans le serveur " + JSON.stringify(error),
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary",
                    "onClose": function(e) {
                        window.location.href = "{{ route('spx.home') }}"
                    }
                });
            }

        });
    }

    function requestVisaDepositCheckStatus(transaction_code, payment_method) {
        //loader("#deposit");
        loader("#deposit_visa_body");
        $.ajax({
            url: "{{ route('spx.op.post.requestpaystatus') }}",
            method: 'POST',
            dataType: "JSON",
            async: true,
            data: JSON.stringify({
                transaction_code: transaction_code,
                payment_method: payment_method
            }),
            contentType: "application/json",
            cache: false,
            processData: false,
            success: function(response) {
                if (response.status === "SUCCESSFUL") {
                    clearTimeout(setTimeoutvar);
                    swal.fire({
                        "title": "Paiement effectué",
                        "text": "Votre demande de recharge a été enregistrée avec succès. Elle sera traité dans les plus befs delais",
                        "type": "success",
                        "confirmButtonClass": "btn btn-secondary",
                        "onClose": function(e) {
                            $("#depositVisa").modal('hide');
                            window.location.href = "{{ route('spx.home') }}"
                        }
                    });
                } else if (response.status === "FAILED") {
                    clearTimeout(setTimeoutvar);
                    swal.fire({
                        "title": "Recharge échouée",
                        "text": "Une erreur est survenue lors de la validation de votre transaction",
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary",
                        "onClose": function(e) {
                            window.location.href = "{{ route('spx.home') }}"
                        }
                    });
                } else if (response.status === "ERROR") {
                    clearTimeout(setTimeoutvar);
                    swal.fire({
                        "title": response.err_title,
                        "text": response.err_msg + ". Code d'erreur " + response.err_code,
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary",
                        "onClose": function(e) {
                            window.location.href = "{{ route('spx.home') }}"
                        }
                    });
                } else { //pending
                    setTimeoutvar = setTimeout(requestVisaDepositCheckStatus(transaction_code, payment_method), 3000);
                }
            },
            error: function(error) {
                unloader("#deposit");
                $('#btn_next').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light')
                    .attr('disabled', false);
                swal.fire({
                    "title": "Erreur interne",
                    "text": "Une erreur est survenue dans le serveur " + JSON.stringify(error),
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary",
                    "onClose": function(e) {
                        window.location.href = "{{ route('spx.home') }}"
                    }
                });
            }

        });
    }
</script>
