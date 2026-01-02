
<div class="kt-portlet">
    <div class="kt-widget5" style="height:500px; padding:16px; overflow:auto">
        @foreach($datas as $index=>$transaction)
            <div class="kt-widget5__item transaction_item" onclick="show_details({{$index}},{{json_encode($transaction)}})">
                <div class="kt-widget5__content">
                    <div class="kt-widget5__pic">
                        <img class="kt-widget7__img" src={{transactionPictures($transaction->ref_operation)}} alt="" style="width:70px;">
                    </div>
                    <div class="kt-widget5__section">
                        <a class="kt-widget5__title">
                            {{$transaction->title}}
                        </a>
                        <p class="kt-widget5__desc">
                            {{$transaction->subtitle}}
                        </p>
                        <div class="kt-widget5__info">
                            <span>Statut:</span>
                            <span style="color:{{$transaction->status_color}}">{{$transaction->status}}</span>
                            <span>Date:</span>
                            <span class="kt-font-info">{{(new \Carbon\Carbon($transaction->date))->format('d.m.y à H:i:s')}}</span>
                        </div>
                    </div>
                </div>
                <div class="kt-widget5__content">
                    <div class="kt-widget5__stats">
                        <span class="kt-widget5__number">{{number_format($transaction->amount)}}</span>
                        <span class="kt-widget5__sales">XAF</span>
                    </div>
                </div>
            </div>
        @endforeach


    </div>
    <div class="kt-widget5" style="margin: 16px;">
        @include("operations.components.list_transactions_pagination")

    </div>
</div>
