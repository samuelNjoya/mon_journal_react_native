<form class="kt-form" id="acc_transfert_form">
    @csrf
    <div class="row">
        <div class="col-xl-2"></div>
        <div class="col-xl-8">
            <div class="kt-section kt-section--first">
                <div class="kt-section__body">
                    <p style="border-bottom: 1px solid #646c9a; padding-bottom:5px;">{{ $msg->preview }}</p>

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
                    <div class="form-group form-group-last">
                        <label>Mot de passe</label>
                        <input type="password" name="password" class="form-control" placeholder="Mot de passe"
                            value="">
                    </div>
                </div>
            </div>
            <div class="kt-portlet__foot">
                <div class="kt-form__actions">
                    <button id="kt_confirm_international_transfert" type="submit" class="btn btn-warning">Valider</button>
                </div>
            </div>
        </div>
        <div class="col-xl-2"></div>
    </div>
</form>

<script>
    $('#kt_confirm_international_transfert').click(function(e) {
        e.preventDefault();
        let btn = $(this);
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

        btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
        loader("#international_transfert_body");
        form.ajaxSubmit({
            url: "{{ route('spx.op.post.com_inter_trans') }}",
            method: "POST",
            data: {
                amount: "{{ $datas['amount'] }}",
                country: "{{ $datas['country'] }}",
                firstname: "{{ $datas['firstname'] }}",
                lastname: "{{ $datas['lastname'] }}",
                phone_number: "{{ $datas['phone_number'] }}",
                type_cni: "{{ $datas['type_cni'] }}",
                withdrawal_method: "{{$datas['withdrawal_method']}}",
                cni: "{{ $datas['cni'] }}",
            },
            success: function(response, status, xhr, $form) {
                unloader("#international_transfert_body");
                btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light')
                    .attr('disabled', false);
                if (response.status === 1) {
                    $(".modal-header").css("background-color", "#0aefae");
                    $(".opmodal-title").css("color", "#fff");
                    $('#international_transfert_body').html(response.view);
                } else if (response.status === 0) {
                    swal.fire({
                        "title": response.err_title,
                        "text": response.err_msg + ". Code d'erreur " + response.err_code,
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary",

                    });
                } else if (response.status === -1) {
                    loader("#international_transfert_body");
                    window.location.href = "{{ route('spx.signin') }}"
                }

            },
            error: function(error) {
                unloader("#international_transfert_body");
                btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light')
                    .attr('disabled', false);
                let responseText = JSON.parse(error.responseText);
                swal.fire({
                    "title": responseText.err_title,
                    "text": responseText.err_msg + ". Code d'erreur " + responseText
                        .err_code,
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary",
                    "onClose": function(e) {
                        console.log('on close event fired!');
                    }
                });
            }
        });
    });
</script>
