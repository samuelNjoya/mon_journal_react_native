<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBudgetCategorie extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('budget_categorie')){
            Schema::create('budget_categorie', function (Blueprint $table) {
                // $table->bigIncrements('id');
                 // Clé primaire composite avec les deux clés étrangères

                // $table->unsignedBigInteger('IdCategorie');
                // $table->unsignedBigInteger('IdBudget');

                $table->primary(['IdCategorie', 'IdBudget']);
                $table->decimal("MontantAffecter",10,2);

                $table->unsignedBigInteger('IdCategorie');
                $table->foreign('IdCategorie')
                        ->references('id')
                        ->on('categorie_depenses')
                        ->onDelete('cascade');

                $table->unsignedBigInteger('IdBudget');
                $table->foreign('IdBudget')
                        ->references('IdBudget')
                        ->on('budgets')
                        ->onDelete('cascade');
                    $table->timestamps();
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
        Schema::dropIfExists('budget_categorie');
    }
}
