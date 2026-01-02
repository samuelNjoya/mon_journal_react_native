
@extends('layout')

@section('title','Paiement des frais de tenue de compte')

@section('content')
    <div class="kt-body kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor " id="kt_body">
        <!-- begin:: Subheader -->
        <div class="kt-subheader   kt-grid__item" id="kt_subheader">
            <div class="kt-container ">
                <div class="kt-subheader__main">
                    <h3 class="kt-subheader__title">
                    </h3>
                    <span class="kt-subheader__separator kt-hidden"></span>
                </div>
            </div>
        </div>

        <!-- end:: Subheader -->

        <!-- begin:: Content -->
        <div class="kt-container  kt-grid__item kt-grid__item--fluid" id="form_content">

            <div class="kt-portlet kt-portlet--last kt-portlet--head-lg kt-portlet--responsive-mobile" id="kt_page_portlet">
                <div class="kt-portlet__head kt-portlet__head--lg">
                    <div class="kt-portlet__head-label">
                        <h3 class="kt-portlet__head-title">Paiement des frais de tenue de compte </h3>
                    </div>
                </div>
                <div class="row" style="padding:16px;">
                    <div class="col-sm-8">
                        <form class="kt-form" id="kt_form">
                            @csrf
                            <div class="row">
                                <div class="col-xl-2"></div>
                                <div class="col-xl-9">
                                    <div class="kt-section kt-section--first">
                                        <div class="kt-section__body">
                                            <p>Vous souhaitez effectuer un paiement des frais de tenue de votre compte
                                                <b>{{isset($datas->denomination)?$datas->denomination:""}}</b>. Veuillez entrer le nombre de mois et votre mot de passe pour confirmer l'opéraiton</p>
                                            @if (!$has_valid_visa_card)
                                                <p style="color:blue;">Ce compte vous donne automatiquement droit à une carte Visa</p>
                                            @endif
                                            <?php
                                                $i = 0;
                                                $select_length = 12;
                                                if($datas->reference== "SPX-BA-PLATINUM" || $datas->reference== "SPX-BA-IVORY" ){
                                                    $select_length = 3;
                                                }
                                            ?>

                                            <div class="form-group">
                                                <div class="col-xl-9">
                                                    <label>Periode de validité </label>
                                                    <div class="input-group">
                                                        <!--input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2"-->
                                                        <select class="form-control" aria-label="Default select example" aria-describedby="basic-addon2" id="select_period_id" name="select_periode">
                                                            <option selected>Choisissez la periode validite de votre compte</option>
                                                            @for ($i = 1; $i <= $select_length; $i++)
                                                            <?php $val = $datas->period * $i ?>
                                                                <option value="{{ $val }}">{{ $val }}</option>
                                                            @endfor
                                                          </select>
                                                        <span class="input-group-text" id="basic-addon2">
                                                            @if ($datas->reference=="SPX-BA-SOLO")
                                                                Jour(s)
                                                            @else
                                                                Mois
                                                            @endif
                                                        </span>
                                                    </div>
                                                    <input name="times" type="hidden" id="times" class="form-control">
                                                    <span style="font-size: 10px;">Minimum : {{$datas->min_subscription}} mois </span> <span style="font-size: 10px;"> Periode : {{$datas->period}} mois</span>
                                                </div>
                                            </div>
                                            @if (!$has_valid_visa_card)
                                                <div class="form-group">
                                                    <div class="col-xl-9">
                                                        <label class="">Point de retrait de la carte</label>
                                                        <select class="form-control selectpicker" data-size="7" data-live-search="true" name="agency">
                                                            @foreach ($agencies as $agcy )
                                                                <option value="{{$agcy->id_agency}}">{{$agcy->name}}</option>
                                                            @endforeach
                                                        </select>
                                                    </div>
                                                </div>
                                            @endif
                                            <div class="form-group">
                                                <div class="col-xl-9">
                                                    <label>Mot de passe</label>
                                                    <input name="password" type="password" class="form-control" placeholder="Mot de passe" value="">
                                                </div>
                                            </div>
                                            <span id="benacc_error_id" style="color: red;"></span>
                                        </div>
                                    </div>
                                    <div class="kt-portlet__foot">
                                        <div class="kt-form__actions">
                                            <button type="reset" class="btn btn-secondary">Annuler</button>
                                            <button id="kt_pay_but" type="submit" class="btn btn-warning">Valider</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-2"></div>
                            </div>
                        </form>
                    </div>
                    <div class="col-sm-4">
                        <img src="{{spx_format_image_url($datas->card_picture)}}" style="max-height:200px"/>
                    </div>
                </div>
            </div>


        </div>
    </div>
@endsection


@section("scripts")
    <script>
        "use strict";
        var spx_reference = "{{$datas->reference}}";
        //console.log(spx_reference);
        // Class Definition
        //let transfert = $('#kt_form');

        // Class Initialization
        jQuery(document).ready(function () {

            $("#select_period_id").change(function(e){
                //$("#times").val() $(this).val();
                if(spx_reference=="SPX-BA-PLATINUM" || spx_reference=="SPX-BA-IVORY"){
                    $("#times").val(parseInt($(this).val())*12);
                }else{
                    $("#times").val($(this).val());
                }
            });

            $('#kt_pay_but').click(function (e) {
                e.preventDefault();
                let numberChoices = $("#times").val();
                let minSubs = parseInt({{$datas->min_subscription}});
                let period = parseInt({{$datas->period}});
                $("#benacc_error_id").html("");
                if(numberChoices < minSubs){
                    $("#benacc_error_id").html("vous ne pouvez pas souscrire pour moins de "+minSubs+" moins à ce compte");
                    return;
                }
                if((numberChoices-minSubs) % period ==1){
                    $("#benacc_error_id").html("Vous ne pouvez payer que sur des intervales de "+period+" mois");
                    return;
                }
                let btn = $(this);
                //let form = $('.kt-login__form');
                let form = $(this).closest('form');
                form.validate({
                    rules: {
                        password: {
                            required: true
                        },
                        times: {
                            required: true,
                            digits:true
                        },
                        select_periode: {
                            required: true
                        },
                    },
                    messages:{
                        password: {
                            required: "Ce champs est requis"
                        },
                        times: {
                            required: "Ce champs est requis",
                            digits: "Veuillez renseigner un nombre dans ce champs"
                        },
                        select_periode: {
                            required: "Veuillez choisir une valeur valide"
                        },
                    }
                });


                if (!form.valid()) {
                    return;
                }

                swal.fire({
                    title: 'Paiement des frais de tenue de compte',
                    text: "Cette opératération vous coûtera "+ addCommas(parseFloat({{$datas->price}})*parseFloat($('#times').val())) + " XAF. Êtes vous sûr de vouloir payer vos frais de tenue de compte?",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Oui',
                    cancelButtonText: 'Non',
                }).then(function(result) {
                    if (result.value) {
                        btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
                        loader("#form_content");
                        form.ajaxSubmit({
                            url: "{{route("spx.benacc.post.pay")}}?id={{$datas->id_type_ben_account}}",
                            method:"POST",
                            success: function (response, status, xhr, $form) {
                                btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                                unloader("#form_content");
                                if (response.status ===1){
                                    swal.fire({
                                        "title": "Succès",
                                        "text": "Opération effectuée avec succès",
                                        "type": "success",
                                        "confirmButtonClass": "btn btn-warning",
                                        "onClose": function(e) {
                                            loader("#kt_body");
                                            window.location.href ="{{route("spx.home")}}"
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
                            error: function (error) {
                                btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                                unloader("#form_content");
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


            });
            function addCommas(nStr)
            {
                nStr += '';
                let x = nStr.split('.');
                let x1 = x[0];
                let x2 = x.length > 1 ? '.' + x[1] : '';
                var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + ',' + '$2');
                }
                return x1 + x2;
            }
        });
    </script>
@endsection
