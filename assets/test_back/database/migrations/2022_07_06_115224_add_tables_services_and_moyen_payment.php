<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTablesServicesAndMoyenPayment extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('partmgt_services', function (Blueprint $table) {
            $table->bigIncrements('service_id');
            $table->string('libelle');
            $table->string('code', 32)->unique();
            $table->string('link');
            $table->string('icon');
            $table->boolean("state")->default(true);
            $table->timestamps();
        });

        Schema::create('transmgt_methodeDePaiement', function (Blueprint $table) {
            $table->bigIncrements('methodeDePaiement_id');
            $table->string('libelle');
            $table->string('code', 32)->unique();
            $table->string('icon');
            $table->boolean("state")->default(true);
            $table->timestamps();
        });

        Schema::create('service_methodeDePaiement', function (Blueprint $table) {
            $table->unsignedBigInteger('service_id');
            $table->unsignedBigInteger('methodeDePaiement_id');
            $table->boolean("state")->default(true);
            $table->timestamps();
            $table->foreign('service_id')->references('service_id')->on('partmgt_services')->onDelete('cascade');
            $table->foreign('methodeDePaiement_id')->references('methodeDePaiement_id')->on('transmgt_methodeDePaiement')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('partmgt_services');
        Schema::dropIfExists('transmgt_methodeDePaiement');
        Schema::dropIfExists('service_methodeDePaiement');
    }
}
