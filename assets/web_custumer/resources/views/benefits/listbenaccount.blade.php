
@extends('layout')

@section('title','SesamPayx | Comptes de Privilèges')


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
                        Liste de Privilèges </a>

                    <!-- <span class="kt-subheader__breadcrumbs-link kt-subheader__breadcrumbs-link--active">Active link</span> -->
                </div>
            </div>
        </div>
    </div>
    <!--begin::Portlet-->
    <div class="kt-portlet">
        <div class="kt-portlet__body kt-portlet__body--fit">

            <!--begin::Basic Pricing 4-->
            <div class="kt-pricing-4">
                <div class="kt-pricing-4__top">
                    <div class="kt-pricing-4__top-container kt-pricing-4__top-container--fixed">
                        <div class="kt-pricing-4__top-header">
                            <div class="kt-pricing-4__top-title kt-font-light">
                                <h1 style="color: #282a3c;">Les comptes de privilèges</h1>
                            </div>
                        </div>
                        <div class="kt-pricing-4__top-body">
                            <!--begin::Pricing Items-->
                            <div class="kt-pricing-4__top-items">

                            @foreach($datas as $data)
                                <!--begin::Pricing Item-->
                                    <div class="kt-pricing-4__top-item">
                                        <img src="{{spx_format_image_url($data->card_picture)}}" style="width: 100px;"/>
                                        <h2 class="kt-pricing-4__subtitle">{{$data->denomination}}</h2>
{{--                                        <div class="kt-pricing-4__features">--}}
{{--                                            <span>{{$data->description}}</span>--}}
{{--                                        </div>--}}
                                        @if ($data->reference=="SPX-BA-PLATINUM")
                                        <span class="kt-pricing-4__label">{{spx_format_float(round($data->min_s * $data->price))}} XAF </span><br/>
                                        @elseif($data->reference=="SPX-BA-IVORY")
                                        <span class="kt-pricing-4__label">{{spx_format_float(round($data->min_s * $data->price))}} XAF </span><br/>
                                        @else
                                        <span class="kt-pricing-4__label">{{spx_format_float($data->price)}} XAF </span><br/>
                                        @endif

                                        <div class="kt-pricing-4__features">
                                            @if ($data->reference=="SPX-BA-PLATINUM" || $data->reference=="SPX-BA-IVORY")
                                                <span>valide pendant {{spx_format_float(1)}} An</span>
                                            @else
                                                <span>valide pendant {{spx_format_float($data->delay)}} jour(s)</span>
                                            @endif

                                        </div>
                                        <div class="kt-pricing-4__btn">
                                            <a href="{{route('spx.benacc.get.pay')}}?id={{$data->id_type_ben_account}}" type="button" class="btn btn-pill btn-info btn-upper btn-bold">Migrer</a>
                                        </div>

                                        <!--begin::Mobile Pricing Table-->
                                        <div class="kt-pricing-4__top-items-mobile">
                                            @foreach($data->badges as $badge)
                                                <div class="kt-pricing-4__top-item-mobile">
                                                    <span>{{$badge->title}}</span>
                                                    <span>{{$badge->alert==null?"":"(".$badge->alert.")"}}</span>
                                                </div>
                                            @endforeach
                                            <div class="kt-pricing-4__top-btn">
                                                <a href="{{route('spx.benacc.get.pay')}}?id={{$data->id_type_ben_account}}" type="button" class="btn btn-pill  btn-info btn-upper btn-bold">Migrer</a>
                                            </div>
                                        </div>

                                        <!--end::Mobile Pricing Table-->
                                    </div>

                                    <!--end::Pricing Items-->
                            @endforeach


                                <!--end::Pricing Items-->
                            </div>

                            <!--end::Pricing Items-->
                        </div>
                    </div>
                </div>


                <div class="kt-pricing-4__bottom">
                    <div class="kt-pricing-4__bottok-container kt-pricing-4__bottok-container--fixed">
                        @for($i=0; $i<count($datas[0]->badges); $i++)
                        <div class="kt-pricing-4__bottom-items">

                            <div class="kt-pricing-4__bottom-item">
                                {{$datas[0]->badges[$i]->title}}
                            </div>
                            @foreach($datas as $data)
                            <div class="kt-pricing-4__bottom-item">
                                <span>
                                {{$data->badges[$i]->alert==null?"Disponible":$data->badges[$i]->alert}}</span>
                            </div>
                            @endforeach
                        </div>
                        @endfor
                    </div>
                </div>
            </div>

            <!--end::Basic Pricing 4-->
        </div>
    </div>

    <!--end::Portlet-->


    <!--begin::Modal-->
    <div class="modal fade" id="kt_modal_4" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Paiement des frais de tenue de compte</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <div class="modal-body">

                    <p>Vous souhaitez effectuer un paiement des frais de tenue de compte pour le compte Sesame Solo. Cette opération vous coûtera 1000XAF veuillez entrer votre mot de passe pour confirmer cette opération</p>

                    <form>
                        <div class="form-group">
                            <label for="recipient-name" class="form-control-label">Mot de passe:</label>
                            <input type="text" class="form-control" id="recipient-name">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
                    <button type="button" class="btn btn-warning">Valider</button>
                </div>
            </div>
        </div>
    </div>
    <!--end::Modal-->

@endsection
