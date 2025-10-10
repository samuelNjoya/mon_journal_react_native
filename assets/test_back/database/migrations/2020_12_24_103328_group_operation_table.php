<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class GroupOperationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transmgt_groupoperations', function (Blueprint $table) {
            $table->bigIncrements('id_groupoperations');
            $table->string('reference');
            $table->string('transaction_codes');
            $table->string('state');
            $table->string('payment_mode');
            $table->integer('id_customer_account')->nullable();
            $table->integer('id_type_ben_account')->nullable();
            $table->integer('times')->nullable();
            $table->string('id_tv_command')->nullable();
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
        Schema::dropIfExists('transmgt_groupoperations');
    }
}
