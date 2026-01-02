<div class="modal fade" id="check_balance" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="document" id="modal_content">
        <div class="modal-content">
            <div class="modal-header" id="check_balance_header">
                {{-- <img src="./assets/media/logos/logo_sesampayx.png" style="width: 50px;"> --}}
                <h5 class="modal-title opmodal-title" id="exampleModalLabel">Consulter mon solde</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <div class="modal-body" id="check_balance_body">
                @include("operations.consult_balance")
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="account_transfert" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="document" id="modal_content">
        <div class="modal-content">
            <div class="modal-header opmodal-header">
                {{-- <img src="./assets/media/logos/logo_sesampayx.png" style="width: 50px;"> --}}
                <h5 class="modal-title opmodal-title" id="exampleModalLabel">Transfert vers un compte Sesame</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <div class="modal-body" id="acc_transfert_body">
                @include('operations.acc_transfert')
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="non_account_transfert" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="document" id="modal_content">
        <div class="modal-content">
            <div class="modal-header opmodal-header">
                {{-- <img src="./assets/media/logos/logo_sesampayx.png" style="width: 50px;"> --}}
                <h5 class="modal-title opmodal-title" id="exampleModalLabel">Transfert vers un non abonné</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <div class="modal-body" id="non_account_transfert_body">
                @include('operations.non_acc_transfert')
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="deposit" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="document" id="modal_content">
        <div class="modal-content">
            <div class="modal-header opmodal-header">
                {{-- <img src="./assets/media/logos/logo_sesampayx.png" style="width: 50px;"> --}}
                <h5 class="modal-title opmodal-title" id="exampleModalLabel">Recharger mon compte</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <div class="modal-body" id="deposit_body">
                @include('operations.deposit')
            </div>
        </div>
    </div>
</div>

<div id="default_password_btn" class="kt-widget4__item" data-toggle="modal" data-target="#default_password">
</div>
<div class="modal fade" id="default_password" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="document" id="modal_content">
        <div class="modal-content" id="default_password_body">

        </div>
    </div>
</div>
<!-- Modal du transfert international step 1 -->
<div class="modal fade" id="international_transfert" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="document" id="modal_content">
        <div class="modal-content">
            <div class="modal-header opmodal-header">
                {{-- <img src="./assets/media/logos/logo_sesampayx.png" style="width: 50px;"> --}}
                <h5 class="modal-title opmodal-title" id="exampleModalLabel">Transfert d'Argent International</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <div class="modal-body" id="international_transfert_body">
                @include('operations.international_transfert')
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="depositVisa" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="document" id="modal_content">
        <div class="modal-content">
            <div class="modal-header opmodal-header">
                {{-- <img src="./assets/media/logos/logo_sesampayx.png" style="width: 50px;"> --}}
                <h5 class="modal-title opmodal-title" id="exampleModalLabel">Recharger mon compte visa</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <div class="modal-body" id="deposit_visa_body">
                @include('operations.visaDeposit')
            </div>
        </div>
    </div>
</div>




