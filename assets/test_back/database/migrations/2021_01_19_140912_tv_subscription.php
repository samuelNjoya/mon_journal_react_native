<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class TvSubscription extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('partmgt_tv_subscription', function (Blueprint $table) {
            $table->bigIncrements('id_tv_subscription');
            $table->integer('id_customer_account');
            $table->integer('id_tv_package');
            $table->string('title');
            $table->string('phone_number');
            $table->string('subscriber_number');
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
