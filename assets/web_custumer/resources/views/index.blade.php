@extends('layout')

@section('title', 'SesamPayx | Accueil')


@section('content')
    <!-- begin:: Subheader -->
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
                        Page d'accueil </a>

                    <!-- <span class="kt-subheader__breadcrumbs-link kt-subheader__breadcrumbs-link--active">Active link</span> -->
                </div>
            </div>
        </div>
    </div>

    <!-- end:: Subheader -->

    <!-- begin:: Content -->
    <div class="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">

        <!--Begin::Dashboard 4-->

        <!--Begin::Row-->
        <div class="row">
            <div class="col-12">
                <div class="row">
                    <div class="col-xl-3 col-lg-3">
                        <div class="kt-portlet kt-portlet--border-bottom-brand"
                            style="border: 0.5px solid {{ $linked_benacc->main_color }};">

                            <div class="kt-portlet__body kt-portlet__body--fluid">
                                <div class="kt-widget26">
                                    <div class="kt-widget26__content">
                                        <div class="kt-widget kt-widget--user-profile-3">
                                            <div class="kt-widget__top">
                                                <div class="kt-widget__pic kt-widget__pic--danger kt-font-danger kt-font-boldest kt-font-light kt-hidden-"
                                                    style="background-color: {{ $linked_benacc->main_color }};">
                                                    <h3 style="color:white;">{{ initiales($linked_benacc->denomination) }}
                                                    </h3>
                                                </div>
                                                <div class="kt-widget__content">
                                                    <div class="kt-widget__head">
                                                        <h4 class="kt-widget__username" style="font-size: 14px;">
                                                            Compte {{ $linked_benacc->denomination }}
                                                        </h4>
                                                        <p>{{ renderAccountState($linked_benacc)['msg'] }}</p>
                                                    </div>
                                                    <a href="{{ route('spx.benacc.getlist') }}" class="btn btn-outline-primary">
                                                        <i class="flaticon-file"></i> Migrer
                                                    </a>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--Begin::Portlet-->
                        <div class="kt-portlet ">
                            <div class="kt-portlet__head">
                                <div class="kt-portlet__head-label">
                                    <h3 class="kt-portlet__head-title">
                                        Activités récentes
                                    </h3>
                                </div>
                            </div>
                            <div class="kt-portlet__body" id="transactions" style="min-height: 100px;">

                                <!--Begin::Timeline 3 -->
                                {{-- <div class="kt-timeline-v2" > --}}
                                {{-- <div class="kt-timeline-v2__items  kt-padding-top-25 kt-padding-bottom-30"> --}}
                                {{-- @foreach ($list_transactions as $index => $transaction) --}}
                                {{-- <div class="kt-timeline-v2__item"> --}}
                                {{-- <span class="kt-timeline-v2__item-time">{{$transaction->status}}</span> --}}
                                {{-- <div class="kt-timeline-v2__item-cricle"> --}}
                                {{-- <i class="fa fa-genderless kt-font-warning"></i> --}}
                                {{-- </div> --}}
                                {{-- <div class="kt-timeline-v2__item-text  kt-padding-top-5"> --}}
                                {{-- <b>{{$transaction->title}}</b><br/> --}}
                                {{-- {{$transaction->subtitle}}<br/> --}}
                                {{-- {{spx_format_float($transaction->op_amount)}} XAF<br/> --}}
                                {{-- </div> --}}
                                {{-- </div> --}}
                                {{-- @endforeach --}}
                                {{-- </div> --}}
                                {{-- </div> --}}

                                <!--End::Timeline 3 -->
                            </div>
                        </div>
                        <!--End::Portlet-->
                    </div>
                    <div class="col-xl-6 col-lg-6">
                        <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
                            <ol class="carousel-indicators">
                                @foreach ($slides as $index => $slide)
                                    <li data-target="#carouselExampleIndicators" data-slide-to="{{ $index }}"
                                        @if ($index == 0) class="active" @endif></li>
                                @endforeach
                            </ol>
                            <div class="carousel-inner">
                                @foreach ($slides as $index => $slide)
                                    <div class="carousel-item @if ($index == 0) active @endif">
                                        <img class="d-block w-100" src="{{ spx_format_image_url($slide->url_slide) }}"
                                            alt="First slide">
                                    </div>
                                @endforeach
                            </div>
                            <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button"
                                data-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="sr-only">Previous</span>
                            </a>
                            <a class="carousel-control-next" href="#carouselExampleIndicators" role="button"
                                data-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="sr-only">Next</span>
                            </a>
                        </div>
                        <!--begin:: Widgets/Order Statistics-->
                        <div class="kt-portlet " style="margin-top: 16px;">
                            <div class="kt-portlet__head">
                                <div class="kt-portlet__head-label">
                                    <h3 class="kt-portlet__head-title">
                                        Mes Gains
                                    </h3>
                                </div>
                            </div>
                            <div class="kt-portlet__body kt-portlet__body--fluid" id="advantages" style="min-height:100px;">
                                {{-- <div class="kt-widget12"> --}}
                                {{-- <div class="kt-widget12__content"> --}}
                                {{-- <div class="kt-widget12__item"> --}}
                                {{-- <div class="kt-widget12__info"> --}}
                                {{-- <span class="kt-widget12__desc">Gains de la semaine</span> --}}
                                {{-- <span class="kt-widget12__value">{{$total_gains}} XAF</span> --}}
                                {{-- </div> --}}
                                {{-- <div class="kt-widget12__info"> --}}
                                {{-- <span class="kt-widget12__desc">Semaine du </span> --}}
                                {{-- <span class="kt-widget12__value">{{$advantages_period["labels"][0]}}</span> --}}

                                {{-- </div> --}}
                                {{-- </div> --}}
                                {{-- </div> --}}
                                {{-- <div class="kt-widget12__chart" style="height:250px;"> --}}
                                {{-- <canvas id="kt_chart_order_statistics"></canvas> --}}
                                {{-- </div> --}}
                                {{-- </div> --}}
                            </div>
                        </div>
                        <!--end:: Widgets/Order Statistics-->
                    </div>
                    <div class="col-xl-3 col-lg-3">

                        <div class="kt-portlet kt-portlet--tabs" style="border: 0.5px solid #fddb2c;">
                            <div class="kt-portlet__head">
                                <div class="kt-portlet__head-label">
                                    <h3 class="kt-portlet__head-title">
                                        Mes Opérations
                                    </h3>
                                </div>
                            </div>
                            <div class="kt-portlet__body">
                                <div class="tab-content">
                                    <div class="tab-pane active" id="kt_widget4_tab1_content">
                                        <div class="kt-widget4">
                                            <div id="acc_transf_but" class="kt-widget4__item" data-toggle="modal"
                                                data-target="#account_transfert">
                                                <div class="kt-widget4__pic kt-widget4__pic--pic">
                                                    <img src="./assets/media/custom/ic_transfert_acc.png" alt="">
                                                </div>
                                                <div class="kt-widget4__info">
                                                    <a href="#" class="kt-widget4__username">
                                                        Transfert vers un compte Sesame
                                                    </a>
                                                </div>
                                            </div>
                                            <div id="non_acc_transf_but" class="kt-widget4__item" data-toggle="modal"
                                                data-target="#non_account_transfert">
                                                <div class="kt-widget4__pic kt-widget4__pic--pic">
                                                    <img src="./assets/media/custom/ic_no_name.png" alt="">
                                                </div>
                                                <div class="kt-widget4__info">
                                                    <a href="#" class="kt-widget4__username">
                                                        Transfert vers un client non abonné
                                                    </a>
                                                </div>
                                            </div>
                                            <div id="deposit_but" class="kt-widget4__item" data-toggle="modal"
                                                data-target="#deposit">
                                                <div class="kt-widget4__pic kt-widget4__pic--pic">
                                                    <img src="./assets/media/custom/wallet.png" alt="">
                                                </div>
                                                <div class="kt-widget4__info">
                                                    <a href="#" class="kt-widget4__username">
                                                        Recharger mon compte
                                                    </a>
                                                </div>
                                            </div>
                                            <div id="balance_but" class="kt-widget4__item" data-toggle="modal"
                                                data-target="#check_balance">
                                                <div class="kt-widget4__pic kt-widget4__pic--pic">
                                                    <img src="./assets/media/custom/ic_solde.png" alt="">
                                                </div>
                                                <div class="kt-widget4__info">
                                                    <a href="#" class="kt-widget4__username">
                                                        Consulter mon solde
                                                    </a>
                                                </div>
                                            </div>
                                            <div class="kt-widget4__item">
                                                <div class="kt-widget4__pic kt-widget4__pic--pic">
                                                    <img src="./assets/media/custom/ic_transaction.png" alt="">
                                                </div>
                                                <div class="kt-widget4__info">
                                                    <a href="{{ route('spx.op.get.list_transactions') }}"
                                                        class="kt-widget4__username">
                                                        Liste des transactions
                                                    </a>
                                                </div>
                                            </div>
                                            <div id="deposit_visa" class="kt-widget4__item" data-toggle="modal"
                                                data-target="#depositVisa">
                                                <div class="kt-widget4__pic kt-widget4__pic--pic">
                                                    <img src="./assets/media/custom/wallet.png" alt="">
                                                </div>
                                                <div class="kt-widget4__info">
                                                    <a href="#" class="kt-widget4__username">
                                                        Recharger sa carte visa
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="kt-portlet kt-portlet--tabs">
                            <div class="kt-portlet__head">
                                <div class="kt-portlet__head-label">
                                    <h3 class="kt-portlet__head-title">
                                        Services
                                    </h3>
                                </div>
                            </div>
                            <div class="kt-portlet__body">
                                <div class="tab-content">
                                    <div class="tab-pane active">
                                        <div class="kt-widget4">
                                            <div class="kt-widget4__item" data-toggle="modal" data-target="#op_modal">
                                                <div class="kt-widget4__pic kt-widget4__pic--pic">
                                                    <img src="./assets/media/custom/cplus.png" alt="">
                                                </div>
                                                <div class="kt-widget4__info">
                                                    <a href="{{ route('spx.serv.get.home_cplus') }}"
                                                        class="kt-widget4__username">
                                                        Paiement des factures Canal +
                                                    </a>
                                                </div>
                                            </div>

                                            <!--div class="kt-widget4__item" data-toggle="modal" data-target="#op_modal">
                                                <div class="kt-widget4__pic kt-widget4__pic--pic">
                                                    <img src="./assets/media/custom/camwater.jpg" alt="">
                                                </div>
                                                <div class="kt-widget4__info">
                                                    <a href="{{ route('spx.serv.get.home_camwater') }}"
                                                        class="kt-widget4__username">
                                                        Paiement des factures CamWater
                                                    </a>
                                                </div>
                                            </div-->

                                            <div id="international_transfert_but" class="kt-widget4__item {{ $transfert_international_service === true ? "" : "d-none" }}" data-toggle="modal"
                                                data-target="#international_transfert">
                                                <div class="kt-widget4__pic kt-widget4__pic--pic">
                                                    <img src="./assets/media/custom/money.jpg" alt="">
                                                </div>
                                                <div class="kt-widget4__info">
                                                    <a href="#" class="kt-widget4__username">
                                                        Transfert d'Argent International
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>


            </div>
        </div>
        <!--End::Row-->

        <!--End::Dashboard 4-->
    </div>

@endsection


@section('scripts')
    <script>
        $(document).ready(function() {

            let list_transactions = $("#transactions");
            let list_advantages = $("#advantages");
            //transactions recentes
            recent_transactions();
            my_gains();

            function recent_transactions() {
                //loader
                loader("#transactions");
                ajaxSubmit({
                    url: "{{ route('spx.home.transactions') }}",
                }, function(data) {
                    if (data.status === 1) {
                        //desactiver le loader
                        unloader("#transactions");
                        list_transactions.html(data.transaction_view);

                    } else if (data.status === -1) {
                        window.location.href = "{{ route('spx.signin') }}"
                    }

                }, function(error) {
                    unloader("#transactions");
                    alert(JSON.stringify(error));
                });
            }

            function my_gains() {
                //loader
                loader("#advantages");
                ajaxSubmit({
                    url: "{{ route('spx.home.gains') }}",
                }, function(data) {
                    if (data.status === 1) {
                        //desactiver le loader
                        unloader("#advantages");
                        list_advantages.html(data.advantage_view);

                    } else if (data.status === -1) {
                        window.location.href = "{{ route('spx.signin') }}"
                    }

                }, function(error) {
                    unloader("#advantages");
                });
            }


        });

        {{-- //gestion du graph home --}}
        {{-- var labels= []; --}}

        {{-- @for ($i = 0; $i < count($advantages_period['labels']); $i++) --}}
        {{-- labels.push("{{$advantages_period["labels"][$i]}}"); --}}
        {{-- @endfor --}}


        {{-- var orderStatistics = function() { --}}
        {{-- var container = KTUtil.getByID('kt_chart_order_statistics'); --}}

        {{-- if (!container) { --}}
        {{-- return; --}}
        {{-- } --}}

        {{-- var color = Chart.helpers.color; --}}
        {{-- var barChartData = { --}}
        {{-- labels:labels , --}}
        {{-- datasets : [ --}}
        {{-- { --}}
        {{-- fill: true, --}}
        {{-- //borderWidth: 0, --}}
        {{-- backgroundColor: color(KTApp.getStateColor('brand')).alpha(0.6).rgbString(), --}}
        {{-- borderColor : color(KTApp.getStateColor('brand')).alpha(0).rgbString(), --}}

        {{-- pointHoverRadius: 4, --}}
        {{-- pointHoverBorderWidth: 12, --}}
        {{-- pointBackgroundColor: Chart.helpers.color('#000000').alpha(0).rgbString(), --}}
        {{-- pointBorderColor: Chart.helpers.color('#000000').alpha(0).rgbString(), --}}
        {{-- pointHoverBackgroundColor: KTApp.getStateColor('brand'), --}}
        {{-- pointHoverBorderColor: Chart.helpers.color('#000000').alpha(0.1).rgbString(), --}}

        {{-- data: JSON.parse("{{json_encode($advantages_period["values"])}}") --}}
        {{-- } --}}
        {{-- ] --}}
        {{-- }; --}}

        {{-- var ctx = container.getContext('2d'); --}}
        {{-- var chart = new Chart(ctx, { --}}
        {{-- type: 'line', --}}
        {{-- data: barChartData, --}}
        {{-- options: { --}}
        {{-- responsive: true, --}}
        {{-- maintainAspectRatio: false, --}}
        {{-- legend: false, --}}
        {{-- scales: { --}}
        {{-- xAxes: [{ --}}
        {{-- categoryPercentage: 0.35, --}}
        {{-- barPercentage: 0.70, --}}
        {{-- display: true, --}}
        {{-- scaleLabel: { --}}
        {{-- display: false, --}}
        {{-- labelString: 'Month' --}}
        {{-- }, --}}
        {{-- gridLines: false, --}}
        {{-- ticks: { --}}
        {{-- display: true, --}}
        {{-- beginAtZero: true, --}}
        {{-- fontColor: KTApp.getBaseColor('shape', 3), --}}
        {{-- fontSize: 13, --}}
        {{-- padding: 10 --}}
        {{-- } --}}
        {{-- }], --}}
        {{-- yAxes: [{ --}}
        {{-- categoryPercentage: 0.35, --}}
        {{-- barPercentage: 0.70, --}}
        {{-- display: true, --}}
        {{-- scaleLabel: { --}}
        {{-- display: false, --}}
        {{-- labelString: 'Value' --}}
        {{-- }, --}}
        {{-- gridLines: { --}}
        {{-- color: KTApp.getBaseColor('shape', 2), --}}
        {{-- drawBorder: false, --}}
        {{-- offsetGridLines: false, --}}
        {{-- drawTicks: false, --}}
        {{-- borderDash: [3, 4], --}}
        {{-- zeroLineWidth: 1, --}}
        {{-- zeroLineColor: KTApp.getBaseColor('shape', 2), --}}
        {{-- zeroLineBorderDash: [3, 4] --}}
        {{-- }, --}}
        {{-- ticks: { --}}
        {{-- max: 70, --}}
        {{-- stepSize: 10, --}}
        {{-- display: true, --}}
        {{-- beginAtZero: true, --}}
        {{-- fontColor: KTApp.getBaseColor('shape', 3), --}}
        {{-- fontSize: 13, --}}
        {{-- padding: 10 --}}
        {{-- } --}}
        {{-- }] --}}
        {{-- }, --}}
        {{-- title: { --}}
        {{-- display: false --}}
        {{-- }, --}}
        {{-- hover: { --}}
        {{-- mode: 'index' --}}
        {{-- }, --}}
        {{-- tooltips: { --}}
        {{-- enabled: true, --}}
        {{-- intersect: false, --}}
        {{-- mode: 'nearest', --}}
        {{-- bodySpacing: 5, --}}
        {{-- yPadding: 10, --}}
        {{-- xPadding: 10, --}}
        {{-- caretPadding: 0, --}}
        {{-- displayColors: false, --}}
        {{-- backgroundColor: KTApp.getStateColor('brand'), --}}
        {{-- titleFontColor: '#ffffff', --}}
        {{-- cornerRadius: 4, --}}
        {{-- footerSpacing: 0, --}}
        {{-- titleSpacing: 0 --}}
        {{-- }, --}}
        {{-- layout: { --}}
        {{-- padding: { --}}
        {{-- left: 0, --}}
        {{-- right: 0, --}}
        {{-- top: 5, --}}
        {{-- bottom: 5 --}}
        {{-- } --}}
        {{-- } --}}
        {{-- } --}}
        {{-- }); --}}
        {{-- } --}}

        {{-- jQuery(document).ready(function() { --}}
        {{-- orderStatistics(); --}}
        {{-- }); --}}
    </script>

@endsection
