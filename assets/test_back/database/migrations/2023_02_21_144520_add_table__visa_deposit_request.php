<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTableVisaDepositRequest extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('serv_depositVisaRequest', function (Blueprint $table) {
            $table->bigIncrements("id");
            $table->float("amount");
            $table->integer('id_transaction')->nullable();
            $table->foreign('id_transaction')->references('id_transaction')->on('transmgt_transaction')->onUpdate('cascade');
            $table->boolean("is_valid")->default(true);
            $table->string('card_number', 32);
            $table->string('state',20);
            $table->timestamps();
        });
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
