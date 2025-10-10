<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsCycliqueToBudgetTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('budgets', function (Blueprint $table) {
            if (!Schema::hasColumn('budgets', 'isCyclique')) {
                $table->boolean('isCyclique')->default(false)->comment('Indique si le budget est cyclique')->after('isArchive');
            }
            if (!Schema::hasColumn('budgets', 'typeCycle')) {
                $table->enum('typeCycle', ['hebdomadaire', 'mensuel', 'annuel'])->nullable()->comment('Type de cycle pour les budgets cycliques')->after('isCyclique');
            }
            if (!Schema::hasColumn('budgets', 'dateProchainCycle')) {
                $table->dateTime('dateProchainCycle')->nullable()->comment('Date du prochain cycle pour les budgets cycliques')->after('typeCycle');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('budget', function (Blueprint $table) {
            //
        });
    }
}
