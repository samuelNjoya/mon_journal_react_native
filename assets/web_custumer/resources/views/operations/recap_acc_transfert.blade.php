
<form class="kt-form" id="acc_transfert_form">
    @csrf
    <div class="row">
        <div class="col-xl-2"></div>
        <div class="col-xl-8">
            <div class="kt-section kt-section--first">
                <div class="kt-section__body">
                    <p>{{$msg}}</p>
                    <div class="form-group form-group-last">
                        <label>Mot de passe</label>
                        <input type="password" name="password" class="form-control" placeholder="Mot de passe" value="">
                    </div>
                </div>
            </div>
            <div class="kt-portlet__foot">
                <div class="kt-form__actions">
                    <button id="kt_confirm_acc_transfert" type="submit" class="btn btn-warning">Valider</button>
                </div>
            </div>
        </div>
        <div class="col-xl-2"></div>
    </div>
</form>

<script>
    $('#kt_confirm_acc_transfert').click(function (e) {
        e.preventDefault();
        let btn = $(this);
        let form = $(this).closest('form');
        form.validate({
            rules: {
                password: {
                    required: true
                }
            },
            messages:{
                password: {
                    required: "Ce champs est requis"
                }
            }
        });

        if (!form.valid()) {
            return;
        }

        btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
        loader("#acc_transfert_body");
        form.ajaxSubmit({
            url: "{{route("spx.op.post.account_transfert")}}",
            data:{"phone_number":'{{$phone_number}}',"amount":'{{$amount}}'},
            method:"POST",
            success: function (response, status, xhr, $form) {
                unloader("#acc_transfert_body");
                btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);

                if (response.status === 1){
                     $( ".modal-header" ).css( "background-color", "#0aefae" );
                     $( ".opmodal-title" ).css( "color", "#fff" );
                    $('#acc_transfert_body').html(response.view);
                }else if(response.status === 0){
                    swal.fire({
                        "title": response.err_title,
                        "text": response.err_msg+". Code d'erreur "+response.err_code,
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary",

                    });
                }else if (response.status === -1){
                    loader("#acc_transfert_body");
                    window.location.href ="{{route("spx.signin")}}"
                }

            },
            error: function (error) {
                unloader("#acc_transfert_body");
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
</script>
