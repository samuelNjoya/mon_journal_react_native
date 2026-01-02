@foreach ($methodes as $mt )
<label class="kt-radio">
    <input type="radio" name="payment_mode" value="{{$mt->value}}"><label>{{$mt->label}}</label>
    <span></span>
</label>
@endforeach
<script>
    $(document).ready(function() {
        $("input[type=radio][name=payment_mode]").change(function() {
            if (this.value === 'MTNMOMO') {
                $("#mtn_phone_number").show();
                $("#orange_phone_number").hide();
            }
            else if(this.value === 'OM') {
                $("#orange_phone_number").show();
                $("#mtn_phone_number").hide();
            }
            else{
                $("#orange_phone_number").hide();
                $("#mtn_phone_number").hide();
            }
        });
        $('.radio-group .radio').click(function(){
            $(this).parent().find('.radio').removeClass('selected');
            $(this).addClass('selected');
        });
    })
</script>
