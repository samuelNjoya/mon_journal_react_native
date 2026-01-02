
@extends('layout')

@section('title','Liste des transactions')

@section('content')
    <div class="kt-subheader   kt-grid__item" id="kt_subheader">
        <div class="kt-container  kt-container--fluid ">
            <div class="kt-subheader__main">
                <h3 class="kt-subheader__title">
                    SesamPayx </h3>
                <span class="kt-subheader__separator kt-hidden"></span>
                <div class="kt-subheader__breadcrumbs">
                    <a href="#" class="kt-subheader__breadcrumbs-home"><i class="flaticon2-shelter"></i></a>
                    <span class="kt-subheader__breadcrumbs-separator"></span>
                    <a href="" class="kt-subheader__breadcrumbs-link">
                        LIste des transactions </a>

                    <!-- <span class="kt-subheader__breadcrumbs-link kt-subheader__breadcrumbs-link--active">Active link</span> -->
                </div>
            </div>
        </div>
    </div>
    <div class="kt-container  kt-grid__item" id="kt_body">

        <div class="row">
            <div class="col-sm-6" id="transactions">
{{--                <div class="kt-portlet">--}}
{{--                    <div class="kt-section__content kt-section__content--border kt-section__content--fit">--}}
{{--                        <ul class="kt-nav kt-nav--bold" style="padding: .2% 1%;">--}}
{{--                            <li class="kt-nav__item">--}}
{{--                                <a data-toggle="modal" data-target="#popup_view_operation_suspens" class="kt-nav__link">--}}
{{--                                    <i class="kt-nav__link-icon flaticon-statistics"></i>--}}
{{--                                    <span class="kt-nav__link-text">Export d'opérations</span>--}}
{{--                                </a>--}}
{{--                            </li>--}}
{{--                        </ul>--}}
{{--                    </div>--}}
{{--                </div>--}}
                @include('operations.components.paginated_transactions')
            </div>

            <div class="col-sm-6" style="min-height: 250px;" id="detail_transaction">
                @include('operations.components.detail_transaction')
            </div>
        </div>

    </div>
@endsection


@section("scripts")
    <script>
        let no_trans_header = $('#no_trans_header');
        let detail_transaction = $('#detail_transaction');
        let illustration = $('#illustration');
        let title = $('#title');
        let subtitle = $('#subtitle');
        let status = $('#status');
        let date = $('#date');
        let amount = $('#amount');
        let transaction_code = $('#transaction_code');
        let op_amount = $('#op_amount');
        let op_commission = $('#op_commission');
        let transaction_item = $('.transaction_item');

        function show_details(index,transaction) {

            illustration.attr("src",transactionPictures(transaction.ref_operation));
            title.text(transaction.title);
            subtitle.text(transaction.subtitle);
            status.text(transaction.status);
            status.css('color',transaction.status_color);
            date.text( (new Date(transaction.date)).toLocaleString('en-GB',{timeZone:"UTC"}));
            amount.text(formatMoney(transaction.amount))
            transaction_code.text(transaction.transaction_code)
            op_amount.text(formatMoney(transaction.op_amount)+" XAF")
            op_commission.text(formatMoney(transaction.op_commission)+" XAF")
            no_trans_header.hide();
            detail_transaction.show();

            //Modification de la classe
            let current_div = $('.transaction_item').eq(index);
            let divs = $('.transaction_active');
            divs.removeClass('transaction_active');
            current_div.addClass('transaction_active');

        }

        function transactionPictures($op_code){
            switch ($op_code) {
                case "SOCASH_DEPOSIT":
                case "SO_DEPOSIT":
                    return "./assets/media/custom/wallet.png";
                case "SO_WITHDRAW":
                    return "./assets/media/custom/ic_remove.png";
                case "SO_TRSCUST":
                    return "./assets/media/custom/ic_transfert_acc.png";
                case "SO_TRSNCUST":
                    return "./assets/media/custom/ic_no_name.png";
                case "SOVM_DEPOSIT":
                    return "./assets/media/custom/ic_credit_card.png";
                case "SOMTN_DEPOSIT":
                    return "./assets/media/custom/ic_mtn_momo.png";
                case "SOOM_DEPOSIT":
                    return "./assets/media/custom/ic_om.png";
                case "SOWI_DEPOSIT":
                    return "./assets/media/custom/western.png";
                case "SO_PYBCANAL":
                    return "./assets/media/custom/cplus.png";
                default:
                    return "./assets/media/logos/logo_sesampayx.png";
            }
        }

        //test
        function paginateListTransaction(page){
            //loader
            loader("#transactions");
            $.ajax({
                url:"{{ route("spx.op.get.paginated_transactions") }}",
                method : 'POST',
                dataType:"JSON",
                async:true,
                data : JSON.stringify({
                    page: page
                }),
                contentType:"application/json",
                success : function(response, status){ // success est toujours en place, bien sûr !
                    unloader("#transactions");
                    if(response.status ===1){
                        //desactiver le loader
                        $("#transactions").html(response.view);
                        setpaginationEvent();

                    }else if (response.status === -1){
                        window.location.href ="{{route("spx.signin")}}"
                    }else if(response.status === 0){
                        swal.fire({
                            "title": response.err_title,
                            "text": response.err_msg+". Code d'erreur "+response.err_code,
                            "type": "error",
                            "confirmButtonClass": "btn btn-secondary",
                        });
                    }
                },
                error : function(error){
                    unloader("#transactions");
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
        }
        function setpaginationEvent(){
            $(".pagination-page-item").click(function (e) {
                let page = this.dataset.page;
                paginateListTransaction(page-1)
            })
        }

        $(document).ready(function () {
            no_trans_header.show();
            detail_transaction.hide();
            setpaginationEvent();
        })
    </script>
@endsection
