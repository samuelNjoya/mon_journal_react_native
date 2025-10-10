<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDepensesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('depenses')) {
           Schema::create('depenses', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('id_categorie_depense');
            $table->unsignedBigInteger('id_customer_account');
            $table->string('libelle');
            $table->decimal('montant', 10, 2);
            $table->date('date_debut')->nullable();
            $table->date('date_fin')->nullable();
            $table->string('piece_jointe')->nullable();
            $table->boolean('status_is_repetitive')->nullable()->default(0)->comment('0=En cours, 1=Annuler, 2=Terminer');
            $table->foreign('id_categorie_depense')->references('id')->on('categorie_depenses')->onDelete('cascade');
            $table->foreign('id_customer_account')->references('id_customer_account')->on('usrmgt_customeraccount')->onDelete('cascade');
            $table->timestamps();
        });
      }

        Schema::table('depenses', function (Blueprint $table) {
            $table->tinyInteger('is_archive')->default(0)->comment('0=non archivée, 1=archivée');
            $table->tinyInteger('is_repetitive')->default(0)->comment('0=depense manuelle, 1=depense repetitive')->after('montant');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('depenses');
    }
}
