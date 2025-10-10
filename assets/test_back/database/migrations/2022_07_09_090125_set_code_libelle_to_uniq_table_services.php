<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SetCodeLibelleToUniqTableServices extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('partmgt_services', function (Blueprint $table) {
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
        Schema::table('partmgt_services', function (Blueprint $table) {
            $table->dropUnique('libelle');
        });
    }
}
