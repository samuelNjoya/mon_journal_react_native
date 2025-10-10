<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SetCodeLibelleToUniqTableMethodesDePaiement extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('transmgt_methodeDePaiement', function (Blueprint $table) {
            $table->unique('libelle', 'code');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('transmgt_methodeDePaiement', function (Blueprint $table) {
            $table->dropUnique('libelle');
        });
    }
}
