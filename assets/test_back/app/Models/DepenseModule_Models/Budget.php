<?php

namespace App\Models\DepenseModule_Models;

use App\Models\UserManagement\CustomerAccount;
use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    protected $table = 'Budgets';
    protected $primaryKey = 'IdBudget';

    protected $casts = [
         'DateDebut'=> 'datetime',
          'DateFin'=> 'datetime',
    ];

    protected $fillable = [
        'Libelle',
        'MontantBudget',
        'DateDebut',
        'DateFin',
        'id_customer_account',
        'statutBudget',
        'isArchive',

        'isCyclique', //indique si le budget est cyclique
        'typeCycle',  //mensuel', 'hebdomadaire', 'annuel'
        'dateProchainCycle'// date du prochain cycle
    ];


    public function customerAccount(){
        return $this->belongsTo(CustomerAccount::class,
        'id_customer_account');
    }
      public function categories(){
        return $this->hasMany(Budget_categorie::class, 'IdBudget');
        // ->where('isArchive', 0); //uniquement les categorie non archive
    }
    //  public function categories()
    // {
    //     return $this->belongsToMany(Categorie::class, 'budget_categorie', 'id_budget', 'id_categorie')
    //                 ->withPivot('montant');
    // }
}
