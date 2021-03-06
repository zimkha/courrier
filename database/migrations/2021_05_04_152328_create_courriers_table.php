<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCourriersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('courriers', function (Blueprint $table) {
            $table->increments('id');
            $table->string('reference');
            $table->date('date_courrier')->nullable();
            $table->date('date_arrive')->nullable();
            $table->string('expediteur')->nullable();
            $table->string('numero');
            $table->string('destinataire')->nullable();
            $table->date('date_depart')->nullable();
            $table->string('type');
            $table->text('autre_instruction')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('courriers');
    }
}
