<?php

namespace App\Models\DepenseModule_Models;

use Illuminate\Database\Eloquent\Model;

class Budget_categorie extends Model
{
    protected $table = "budget_categorie";
//  protected $primaryKey = 'id';
    // protected $primaryKey = ['IdCategorie', 'IdBudget']; //Clé primaire composite

    protected $fillable = [
        "IdBudget",
        "IdCategorie",
        "MontantAffecter",

    ];

    public function categorie(){
        return $this->belongsTo(CategorieDepenses::class,"IdCategorie");
    }

    public function budget(){
        return $this->belongsTo(Budget::class,"IdBudget");
    }

}
