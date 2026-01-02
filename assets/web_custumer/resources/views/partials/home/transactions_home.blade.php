<div class="kt-timeline-v2" >
    <div class="kt-timeline-v2__items  kt-padding-top-25 kt-padding-bottom-30">
        @foreach ($list_transactions as $index=> $transaction)
            <div class="kt-timeline-v2__item">
                <span class="kt-timeline-v2__item-time">{{$transaction->status}}</span>
                <div class="kt-timeline-v2__item-cricle">
                    <i class="fa fa-genderless kt-font-warning"></i>
                </div>
                <div class="kt-timeline-v2__item-text  kt-padding-top-5">
                    <b>{{$transaction->title}}</b><br/>
                    {{$transaction->subtitle}}<br/>
                    {{spx_format_float($transaction->op_amount)}} XAF<br/>
                </div>
            </div>
        @endforeach
    </div>
</div>
