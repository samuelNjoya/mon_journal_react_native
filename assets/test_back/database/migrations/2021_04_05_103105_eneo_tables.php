<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EneoTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('partmgt_eneo_contract_number', function (Blueprint $table) {
            $table->bigIncrements('id_contract_number');
            $table->integer('id_customer_account');
            $table->string('denomination');
            $table->string('contract_number');
            $table->timestamps();
        });

        Schema::create('partmgt_eneo_command', function (Blueprint $table) {
            $table->bigIncrements('id_eneo_command');
            $table->integer('id_transaction')->nullable();
            $table->string('contract_number')->nullable();
            $table->string('bill_type')->nullable();
            $table->string('ref4')->nullable();
            $table->string('bill_number')->nullable();
            $table->date('generation_date')->nullable();
            $table->date('due_date')->nullable();
            $table->double('amount', 19, 4)->nullable();
            $table->string('customer_name')->nullable();
            $table->string('meter_number')->nullable();
            $table->string('bill_type_desc')->nullable();
            $table->string('agence')->nullable();
            $table->string('bill_status')->nullable();
            $table->string('payment_status')->nullable();
            $table->string('eneo_transaction_id')->nullable();
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
