<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTableMaxtimesoperation extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transmod_maxcustomeroperation', function (Blueprint $table) {
            $table->integer("number_of_times");
            $table->integer("period");
            $table->integer('id_sesampayx_operation');
            $table->foreign('id_sesampayx_operation')
                ->references('id_sesampayx_operation')
                ->on('transmod_sesampayxoperation')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->integer('id_customer_account');
            $table->foreign('id_customer_account')
                ->references('id_customer_account')
                ->on('usrmgt_customeraccount')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->date("begin_to");
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
