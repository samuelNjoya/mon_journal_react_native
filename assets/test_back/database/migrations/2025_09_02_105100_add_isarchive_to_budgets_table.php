<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsarchiveToBudgetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
          if (!Schema::hasColumn('budgets', 'isArchive')) {
        Schema::table('budgets', function (Blueprint $table) {
            $table->boolean('isArchive')->comment('0=Non archivé, 1=Archivé')
                  ->default(false) // Utilisez false au lieu de '0' pour boolean
                  ->after('statutBudget');
        });
    }

       
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('budgets', function (Blueprint $table) {
            //
        });
    }
}
