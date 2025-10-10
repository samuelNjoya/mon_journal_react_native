<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategorieDepensesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       if (!Schema::hasTable('categorie_depenses')) {
         Schema::create('categorie_depenses', function (Blueprint $table) {
             $table->bigIncrements('id');
             $table->bigInteger('id_customer_account');
            $table->string('nom');
           //  $table->date('date'); la date de création est déjà gérée par les timestamps
            $table->boolean('type')->comment('0=standard, 1=personalisé');
            $table->foreign('id_customer_account')
                ->references('id_customer_account')
                ->on('usrmgt_customeraccount')
                ->onDelete('cascade');

            $table->timestamps();
        });
       }

        Schema::table('categorie_depenses', function (Blueprint $table) {
             $table->tinyInteger('is_archive')->default(0)->comment('0=non archivée, 1=archivée')->after('type');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('categorie_depenses');
    }
}
