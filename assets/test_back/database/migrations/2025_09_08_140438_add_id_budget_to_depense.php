<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIdBudgetToDepense extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('depenses', function (Blueprint $table) {
           if (!Schema::hasColumn('depenses', 'IdBudget')) {
                 $table->unsignedBigInteger('IdBudget')->nullable()->after('status_is_repetitive');

            $table->foreign('IdBudget')
                  ->references('IdBudget')->on('budgets')
                  ->onDelete('cascade');
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
        Schema::table('depenses', function (Blueprint $table) {
            //
        });
    }
}
