<?php

namespace App\Http\Controllers\Api\DepenseModule_Controller;

use App\Helpers\DepenseModule_Helpers\StatistiquesHelper;
use App\Models\CategorieDepenses\Depenses;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StatistiquesController extends Controller
{

     public function getStats(Request $request)
    {
        app()->setLocale('fr');

        $request->validate([
            'mode' => 'nullable|string|in:jour,semaine,mois,annee',
            'date_debut' => 'nullable|date_format:d-m-Y',
            'date_fin' => 'nullable|date_format:d-m-Y',
            'id_categorie' => 'nullable|integer',
            'id_budget' => 'nullable|integer',
        ]);

        try {
            $stats = StatistiquesHelper::getStatsDepenses(
                $request->mode,
                $request->date_debut,
                $request->date_fin,
                $request->id_categorie,
                $request->id_budget,
                $request->input('per_page', 10)
            );


            return response()->json([
                'stats' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }



}
