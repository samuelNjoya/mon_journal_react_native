<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBudgetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('budgets')){
         Schema::create('budgets', function (Blueprint $table) {
            $table->bigIncrements('IdBudget');
            $table->string('Libelle');
            $table->decimal('MontantBudget',10,2);
            $table->dateTime('DateDebut');
            $table->dateTime('DateFin');

            $table->integer('id_customer_account');
            $table->foreign('id_customer_account')
                    ->references('id_customer_account')
                    ->on('usrmgt_customeraccount')
                    ->onDelete('cascade');
             $table->timestamps();
        });
    }

     Schema::table('budgets', function (Blueprint $table) {
            $table->boolean('statutBudget')->comment('0=Encours, 1=Terminé')
                  ->default('0') // Valeur par défaut pour les enregistrements existants
                  ->after('DateFin'); // Position de la colonne

        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('budgets');

    }
}
