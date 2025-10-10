<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditTablesServiceAndPaymentMethod extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('transmgt_methodeDePaiement', function (Blueprint $table) {
            $table->boolean("state")->default(true)->after('icon');
        });
        Schema::table('partmgt_services', function (Blueprint $table) {
            $table->boolean("state")->default(true)->after('icon');
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
