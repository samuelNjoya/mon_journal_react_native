<div class="kt-form" id="international_preview">
    <div class="row">
        <div class="col-2"></div>
        <div class="col-8">
            <div class="kt-portlet__head">
                <div class="kt-portlet__head-label row">
                    <div class="col-2">
                        @if($payment_method == "MTN")
                            <img id="illustration" class="kt-widget7__img" src="./assets/media/custom/ic_mtn_momo.png" alt="" style="height:35px;">
                        @elseif($payment_method=="OM")
                            <img id="illustration" class="kt-widget7__img" src="./assets/media/custom/ic_om.png" alt="" style="height:35px;">
                        @elseif($payment_method=="VISA/MASTERCARD")
                            <img id="illustration" class="kt-widget7__img" src="./assets/media/custom/ic_credit_card.png" alt="" style="height:35px;">
                        @else
                            <img id="illustration" class="kt-widget7__img" src="./assets/media/logos/logo_sesampayx.png" alt="" style="height:35px;">
                        @endif
                    </div>
                    <div class="col-10">
                        <h6 class="kt-portlet__head-title">
                            @if($payment_method == "MTN")
                                Recharge du compte Sesame via MTN Mobile Money
                            @elseif($payment_method=="OM")
                                Recharge du compte Sesame via Orange Money
                            @elseif($payment_method=="VISA/MASTERCARD")
                                Transfert d'Argent International via VISA ou MasterCard
                            @endif
                        </h6>
                    </div>

                </div>
            </div>
            <div style="padding: 16px;">
                <div class="row">
                    <h7 style="color:black; flex:3">Montant:</h7>
                    <p style="flex:1; text-align: end">{{number_format((float)$amount,2)}} XAF</p>
                </div>
                <div class="row">
                    <h7 style="color:black; flex:3">Commission:</h7>
                    <p style="flex:1;text-align: end">{{number_format((float)$commission,2)}} XAF</p>
                </div>
                <div class="row">
                    <h7 style="color:black; flex:3">Frais de l'opérateur:</h7>
                    <p style="flex:1;text-align: end">{{number_format((float)$fees,2)}} XAF</p>
                </div>
                <div class="row">
                    <h7 style="color:black; flex:3">Total:</h7>
                    <p style="flex:1; text-align: end" >{{number_format((float)$total,2)}} XAF</p>
                </div>

            </div>
            <div class="kt-portlet__foot">
                <div class="kt-form__actions">
                    <button class="btn btn-secondary" data-dismiss="modal" aria-label="Close" style="width:45%">Annuler</button>
                    <button class="btn btn-warning" id="confirmdeposit" style="width:45%">Transférer</button>
                </div>
            </div>
        </div>
        <div class="col-2"></div>
    </div>
</div>
<script>
    $('#confirmdeposit').click(function(e) {
        console.log("in processing");
        e.preventDefault();
        let btn = $(this);
        let form = $(this).closest('form');

        btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
        loader("#international_transfert_body");
        $.ajax({
            url: "{{ route('spx.op.post.international_transfert') }}",
            type: 'post',
            //data: {name:'yogesh',salary: 35000,email: 'yogesh@makitweb.com'},
            data: {
                amount: "{{ $datas['amount'] }}",
                country: "{{ $datas['country'] }}",
                firstname: "{{ $datas['firstname'] }}",
                lastname: "{{ $datas['lastname'] }}",
                phone_number: "{{ $datas['phone_number'] }}",
                password: "{{ $datas['password'] }}",
                payment_method: "{{ $datas['payment_method'] }}",
                withdrawal_method: "{{$datas['withdrawal_method']}}",
                type_cni: "{{ $datas['type_cni'] }}",
                cni: "{{ $datas['cni'] }}",
            },
            success: function(response){
                unloader("#international_transfert_body");
                btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light')
                    .attr('disabled', false);
                if (response.status === 1) {
                    $(".modal-header").css("background-color", "#0aefae");
                    $(".opmodal-title").css("color", "#fff");
                    //$('#international_transfert_body').html(response.view);
                    window.location.href = response.url;
                } else if (response.status === 0) {
                    console.log(response.status);
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
            error: function (error) { // error callback
                unloader("#international_transfert_body");
                btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light')
                    .attr('disabled', false);
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
</script>
