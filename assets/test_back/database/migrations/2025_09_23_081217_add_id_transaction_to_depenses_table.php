<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIdTransactionToDepensesTable extends Migration
{
   public function up()
{
     Schema::table('depenses', function (Blueprint $table) {
           if (!Schema::hasColumn('depenses', 'id_transaction')) {
                 $table->unsignedBigInteger('id_transaction')->nullable()->after('id_customer_account');
                 $table->foreign('id_transaction')->references('id_transaction')->on('transmgt_transaction');
            }
        });
}

public function down()
{
    Schema::table('depenses', function (Blueprint $table) {
       
    });
}

}
