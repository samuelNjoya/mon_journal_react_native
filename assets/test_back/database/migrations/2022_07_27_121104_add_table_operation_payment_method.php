<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTableOperationPaymentMethod extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transmod_spayxoperation_payment', function (Blueprint $table) {
            $table->Integer('operation_id');
            $table->Integer('paymentMethod_id');
            $table->boolean("state")->default(true);
            $table->timestamps();
            $table->foreign('operation_id')->references('id_sesampayx_operation')->on('transmod_sesampayxoperation');
            $table->foreign('paymentMethod_id')->references('id_sesampayx_operation')->on('transmod_sesampayxoperation');
        });
        //Schema::dropIfExists('sesampayxoperation_paymentMethod');
        /*Schema::table('sesampayxoperation_paymentMethod', function (Blueprint $table) {
            $table->Integer('operation_id')->change();
            $table->Integer('paymentMethod_id')->change();
            $table->foreign('operation_id')->references('id_sesampayx_operation')->on('transmod_sesampayxoperation');
            $table->foreign('paymentMethod_id')->references('id_sesampayx_operation')->on('transmod_sesampayxoperation');
        });*/
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
