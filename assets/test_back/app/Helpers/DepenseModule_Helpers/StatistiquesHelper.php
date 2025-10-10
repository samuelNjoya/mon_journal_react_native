<?php
namespace App\Helpers\DepenseModule_Helpers;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Models\CategorieDepenses\Depenses;

class StatistiquesHelper
{
    //Valider l'interval de date
    public static function prepareIntervalleDates(?string $debut, ?string $fin): array
    {
        $aujourdhui = Carbon::today();
        //$debutDate = $debut ? Carbon::createFromFormat('d-m-Y', $debut) : $aujourdhui->copy()->startOfMonth();
        $debutDate = $debut ? Carbon::createFromFormat('d-m-Y', $debut) : $aujourdhui->copy()->subDays(6); // Pour couvrir aujourd'hui et les 6 jours précédents
        $finDate = $fin ? Carbon::createFromFormat('d-m-Y', $fin) : $aujourdhui;
        if ($finDate->lt($debutDate)) {
            throw new \Exception("La date de fin doit être postérieure à la date de début.");
        }
        return [$debutDate, $finDate];
    }

    // Vérification de l'existence des catégories
    public static function checkCategorieExistence(int $id_categorie, ?int $id_budget): bool
    {
        if (is_null($id_budget)) {
            return Depenses::checkDepensesByCategorie($id_categorie);
        }
        return Depenses::checkCategorieInBudget($id_categorie, $id_budget);
    }

    // Retourne le nom du jour en français
    private static function getNomJour(int $dayNumber): string
    {
        $jours = [
            1 => 'Dimanche',
            2 => 'Lundi',
            3 => 'Mardi',
            4 => 'Mercredi',
            5 => 'Jeudi',
            6 => 'Vendredi',
            7 => 'Samedi',
        ];
        return $jours[$dayNumber] ?? 'Inconnu';
    }

    // Retourne le nom du mois en français
    private static function getNomMois(int $monthNumber): string
    {
        $mois = [
            1 => 'Janvier',
            2 => 'Février',
            3 => 'Mars',
            4 => 'Avril',
            5 => 'Mai',
            6 => 'Juin',
            7 => 'Juillet',
            8 => 'Août',
            9 => 'Septembre',
            10 => 'Octobre',
            11 => 'Novembre',
            12 => 'Décembre',
        ];
        return $mois[$monthNumber] ?? 'Inconnu';
    }

    // Générer une liste de tous les jours entre deux dates
    private static function genererJoursEntreDates(Carbon $debut, Carbon $fin): array
    {
        $jours = [];
        $current = $debut->copy()->startOfDay();
        $end = $fin->copy()->endOfDay();
        while ($current->lte($end)) {
            $jours[] = [
                'date' => $current->format('Y-m-d'),
                'jour' => self::getNomJour($current->dayOfWeek + 1),//Décale de +1 pour correspondre à la méthode getNomJour car dayOfWeek est configurer comme suite 0=Dimanche jusqu'a 6=samedi
                'total' => 0,
                'nombre_depenses' => 0,
            ];
            $current->addDay();
        }
        return $jours;
    }

    // Générer une liste de toutes les semaines entre deux dates
    private static function genererSemainesEntreDates(Carbon $debut, Carbon $fin): array
    {
        $semaines = [];
        $current = $debut->copy();
        $end = $fin->copy();
        while ($current->lte($end)) {
            $finSemaine = $current->copy()->addDays(6);
            if ($finSemaine->gt($end)) {
                $finSemaine = $end->copy();
            }
            $semaines[] = [
                'debut_semaine' => $current->format('Y-m-d'),
                'fin_semaine' => $finSemaine->format('Y-m-d'),
                'est_complete' => $finSemaine->diffInDays($current) === 6,
                'total' => 0,
                'nombre_depenses' => 0,
            ];
            $current->addDays(7);
        }
        return $semaines;
    }

    // Générer une liste de tous les mois entre deux dates
    private static function genererMoisEntreDates(Carbon $debut, Carbon $fin): array
    {
        $mois = [];
        $current = $debut->copy()->startOfMonth();
        $end = $fin->copy()->endOfMonth();
        while ($current->lte($end)) {
            $mois[] = [
                'annee' => $current->year,
                'mois_num' => $current->month,
                'mois' => self::getNomMois($current->month),
                'total' => 0,
                'nombre_depenses' => 0,
            ];
            $current->addMonth();
        }
        return $mois;
    }

    //Generer une liste de toutes les années entre deux dates
    private static function genererAnneesEntreDates(Carbon $debut, Carbon $fin): array
    {
        $annees = [];
        $current = $debut->copy()->startOfYear();
        $end = $fin->copy()->endOfYear();
        while ($current->lte($end)) {
            $annees[] = [
                'annee' => $current->year,
                'total' => 0,
                'nombre_depenses' => 0,
            ];
            $current->addYear();
        }
        return $annees;
    }


    // Requête pour les depenses par catégories et par periode
    private static function getCategoriesQuery(Carbon $debut, Carbon $fin, ?int $id_budget, ?int $id_categorie, string $mode, int $customerId)
    {
        // $keyField = ($mode === 'mois') ? "CONCAT(YEAR(depenses.created_at), '-', MONTH(depenses.created_at)) as month_key" : "DATE(depenses.created_at) as date_key";
        // $groupBy = ($mode === 'mois')
        //     ? [DB::raw('YEAR(depenses.created_at)'), DB::raw('MONTH(depenses.created_at)'), 'categorie_depenses.id']
        //     : [DB::raw('DATE(depenses.created_at)'), 'categorie_depenses.id'];

        if ($mode === 'annee') {
            $keyField = "YEAR(depenses.created_at) as year_key";
            $groupBy = [DB::raw('YEAR(depenses.created_at)'), 'categorie_depenses.id'];
         } elseif ($mode === 'mois') {
                $keyField = "CONCAT(YEAR(depenses.created_at), '-', MONTH(depenses.created_at)) as month_key";
                $groupBy = [DB::raw('YEAR(depenses.created_at)'), DB::raw('MONTH(depenses.created_at)'), 'categorie_depenses.id'];
         } else {
                $keyField = "DATE(depenses.created_at) as date_key";
                $groupBy = [DB::raw('DATE(depenses.created_at)'), 'categorie_depenses.id'];
         }

        return DB::table('depenses')
            ->join('categorie_depenses', 'depenses.id_categorie_depense', '=', 'categorie_depenses.id')
            ->selectRaw("
                {$keyField},
                categorie_depenses.id as categorie_id,
                categorie_depenses.nom as categorie_nom,
                SUM(depenses.montant) as montant,
                COUNT(depenses.id) as nombre_depenses
            ")
            ->where('depenses.id_customer_account', $customerId)
            ->where('depenses.is_archive', 0)
            ->whereBetween('depenses.created_at', [$debut->startOfDay(), $fin->endOfDay()])
            ->when($id_budget, fn($q) => $q->where('depenses.IdBudget', $id_budget))
            ->when($id_categorie, fn($q) => $q->where('depenses.id_categorie_depense', $id_categorie))
            ->groupBy($groupBy);
    }

    // Fusion des résultats (factorisée) pour les periodes jour et mois
    private static function fusionnerResultats(array &$toutesPeriodes, $resultatsPrincipaux, $resultatsCategories, string $mode)
    {
        foreach ($toutesPeriodes as &$periode) {
          //  $key = ($mode === 'jour') ? $periode['date'] : "{$periode['annee']}-{$periode['mois_num']}";
           $key = ($mode === 'jour') ? $periode['date'] :
               (($mode === 'mois') ? "{$periode['annee']}-{$periode['mois_num']}" : $periode['annee']);

            if ($resultatsPrincipaux->has($key)) {
                $periode = array_merge($periode, (array) $resultatsPrincipaux->get($key));
            }

            $periode['categories'] = [];
            if ($resultatsCategories->has($key)) {
                $total = $periode['total'];
                foreach ($resultatsCategories->get($key) as $cat) {
                    $pourcentage = $total > 0 ? round(($cat->montant / $total) * 100, 2) : 0;
                    $periode['categories'][] = [
                        'categorie_id' => $cat->categorie_id,
                        'categorie_nom' => $cat->categorie_nom,
                        'montant' => (float) $cat->montant,
                        'nombre_depenses' => $cat->nombre_depenses,
                        'pourcentage' => $pourcentage
                    ];
                }
            }
        }
        return $toutesPeriodes;
    }

    // Fonction principale
    public static function getStatsDepenses(?string $mode, ?string $dateDebut = null, ?string $dateFin = null, ?int $id_categorie = null, ?int $id_budget = null, int $perPage = 10): array
    {
        //mode par default Jour
        $mode = $mode ?? 'jour';

        list($debut, $fin) = self::prepareIntervalleDates($dateDebut, $dateFin);

        $budgetExistence = Depenses::checkBudgetExistence($id_budget);
        if (!$budgetExistence) {
            throw new \Exception("Budget non trouvé ou non valide.");
        }

        if ($id_categorie && !self::checkCategorieExistence($id_categorie, $id_budget)) {
            throw new \Exception("Catégorie non trouvée ou invalide dans ce contexte.");
        }

        $customerId = Auth::id();
        $query = DB::table('depenses')
            ->join('categorie_depenses', 'depenses.id_categorie_depense', '=', 'categorie_depenses.id')
            ->where('depenses.id_customer_account', $customerId)
            ->where('depenses.is_archive', 0)
            ->whereBetween('depenses.created_at', [$debut->startOfDay(), $fin->endOfDay()]);

        if ($id_budget) {
            $query->where('depenses.IdBudget', $id_budget);
        }
        if ($id_categorie) {
            $query->where('depenses.id_categorie_depense', $id_categorie);
        }

        switch ($mode) {
            case 'jour':
                $query->selectRaw("
                    DATE(depenses.created_at) as date,
                    SUM(depenses.montant) as total,
                    COUNT(depenses.id) as nombre_depenses
                ")
                ->groupBy(DB::raw('DATE(depenses.created_at)'))
                ->orderBy('date');
                $toutesPeriodes = self::genererJoursEntreDates($debut, $fin);
                $resultatsPrincipaux = $query->get()->keyBy('date');
                // Convertir les totaux en float
                foreach ($resultatsPrincipaux as &$resultat) {
                    $resultat->total = (float) $resultat->total;
                }
                $resultatsCategories = self::getCategoriesQuery($debut, $fin, $id_budget, $id_categorie, 'jour', $customerId)->get()->groupBy('date_key');
                $statsComplete = self::fusionnerResultats($toutesPeriodes, $resultatsPrincipaux, $resultatsCategories, 'jour');
                break;

            case 'semaine':
                $toutesPeriodes = self::genererSemainesEntreDates($debut, $fin);
                $depenses = DB::table('depenses')
                    ->join('categorie_depenses', 'depenses.id_categorie_depense', '=', 'categorie_depenses.id')
                    ->selectRaw("
                        depenses.id,
                        depenses.created_at,
                        depenses.montant,
                        categorie_depenses.id as categorie_id,
                        categorie_depenses.nom as categorie_nom
                    ")
                    ->where('depenses.id_customer_account', $customerId)
                    ->where('depenses.is_archive', 0)
                    ->whereBetween('depenses.created_at', [$debut->startOfDay(), $fin->endOfDay()])
                    ->when($id_budget, fn($q) => $q->where('depenses.IdBudget', $id_budget))
                    ->when($id_categorie, fn($q) => $q->where('depenses.id_categorie_depense', $id_categorie))
                    ->get();

                foreach ($toutesPeriodes as &$semaine) {
                    $debutSemaine = Carbon::parse($semaine['debut_semaine']);
                    $finSemaine = Carbon::parse($semaine['fin_semaine']);
                    $total = 0;
                    $nombreDepenses = 0;
                    $categories = [];

                    foreach ($depenses as $depense) {
                        $dateDepense = Carbon::parse($depense->created_at);
                        if ($dateDepense->between($debutSemaine, $finSemaine)) {
                            $total += (float) $depense->montant;
                            $nombreDepenses++;

                            if (!isset($categories[$depense->categorie_id])) {
                                $categories[$depense->categorie_id] = [
                                    'categorie_id' => $depense->categorie_id,
                                    'categorie_nom' => $depense->categorie_nom,
                                    'montant' => 0,
                                    'nombre_depenses' => 0,
                                ];
                            }
                            $categories[$depense->categorie_id]['montant'] += (float) $depense->montant;
                            $categories[$depense->categorie_id]['nombre_depenses']++;
                        }
                    }

                    $semaine['total'] = $total;
                    $semaine['nombre_depenses'] = $nombreDepenses;
                    $semaine['categories'] = array_values($categories);

                    foreach ($semaine['categories'] as &$cat) {
                        $cat['pourcentage'] = $total > 0 ? round(($cat['montant'] / $total) * 100, 2) : 0;
                    }

                    if (!$semaine['est_complete']) {
                        $semaine['message'] = "Semaine non complète";
                    }
                }
                $statsComplete = $toutesPeriodes;
                break;

            case 'mois':
                $query->selectRaw("
                    YEAR(depenses.created_at) as annee,
                    MONTH(depenses.created_at) as mois_num,
                    SUM(depenses.montant) as total,
                    COUNT(depenses.id) as nombre_depenses
                ")
                ->groupBy(DB::raw('YEAR(depenses.created_at)'), DB::raw('MONTH(depenses.created_at)'))
                ->orderBy('annee')
                ->orderBy('mois_num');
                $toutesPeriodes = self::genererMoisEntreDates($debut, $fin);
                $resultatsPrincipaux = $query->get()->keyBy(function ($item) {
                    return "{$item->annee}-{$item->mois_num}";
                });
                // Convertir les totaux en float
                foreach ($resultatsPrincipaux as &$resultat) {
                    $resultat->total = (float) $resultat->total;
                }
                $resultatsCategories = self::getCategoriesQuery($debut, $fin, $id_budget, $id_categorie, 'mois', $customerId)->get()->groupBy('month_key');
                $statsComplete = self::fusionnerResultats($toutesPeriodes, $resultatsPrincipaux, $resultatsCategories, 'mois');

                //calcul pour comparaison(evolution) avec les autres mois
                $previousTotal = null;
                $previousAnnee = null;
                $previousMoisNum = null;
                foreach ($statsComplete as &$mois) {
                    if ($previousTotal !== null && $previousTotal != 0) {  // Vérifie que $previousTotal n'est pas 0
                        if ($mois['mois_num'] == 1 && $previousAnnee == $mois['annee'] - 1 && $previousMoisNum == 12) {
                            // Comparaison de janvier avec décembre de l'année précédente
                            $evolution = (($mois['total'] - $previousTotal) / $previousTotal) * 100;
                            $mois['evolution'] = [
                                'status' => true,
                                'pourcentage' => round($evolution, 2),
                                'signe' => $evolution >= 0 ? '+' : '-',
                                'comparaison' => "vs Décembre " . ($mois['annee'] - 1)
                            ];
                        } elseif ($mois['mois_num'] != 1) {
                            // Comparaison normale
                            $evolution = (($mois['total'] - $previousTotal) / $previousTotal) * 100;
                            $mois['evolution'] = [
                                'status' => true,
                                'pourcentage' => round($evolution, 2),
                                'signe' => $evolution >= 0 ? '+' : '-',
                                'comparaison' => "vs " . self::getNomMois($mois['mois_num'] - 1)
                            ];
                        }
                    } else {
                        // Cas où le mois précédent n'a pas de dépenses
                        if ($previousTotal !== null) {  // Si $previousTotal est 0
                            $mois['evolution'] = [
                                'status' => false,
                                // 'pourcentage' => null,
                                // 'signe' => null,
                                'comparaison' => "vs " . self::getNomMois($mois['mois_num'] - 1),
                                'message' => "Le mois précédent n'a pas de dépenses pour comparaison."
                            ];
                        }
                    }
                    $previousTotal = $mois['total'];
                    $previousAnnee = $mois['annee'];
                    $previousMoisNum = $mois['mois_num'];
                }
                break;

            case 'annee':
                $query->selectRaw("
                    YEAR(depenses.created_at) as annee,
                    SUM(depenses.montant) as total,
                    COUNT(depenses.id) as nombre_depenses
                ")
                ->groupBy(DB::raw('YEAR(depenses.created_at)'))
                ->orderBy('annee');
                $toutesPeriodes = self::genererAnneesEntreDates($debut, $fin);
                $resultatsPrincipaux = $query->get()->keyBy('annee');
                // Convertir les totaux en float
                foreach ($resultatsPrincipaux as &$resultat) {
                    $resultat->total = (float) $resultat->total;
                }
                $resultatsCategories = self::getCategoriesQuery($debut, $fin, $id_budget, $id_categorie, 'annee', $customerId)->get()->groupBy('year_key');
                $statsComplete = self::fusionnerResultats($toutesPeriodes, $resultatsPrincipaux, $resultatsCategories, 'annee');

                // Ajout du calcul de l'évolution entre les années
                $previousTotal = null;
                $previousAnnee = null;
                foreach ($statsComplete as &$annee) {
                    if ($previousTotal !== null && $previousTotal != 0) {
                        $evolution = (($annee['total'] - $previousTotal) / $previousTotal) * 100;
                        $annee['evolution'] = [
                            'status' => true,
                            'pourcentage' => round($evolution, 2),
                            'signe' => $evolution >= 0 ? '+' : '-',
                            'comparaison' => "vs " . ($annee['annee'] - 1)
                        ];
                    } else {
                        if ($previousTotal !== null) {
                            $annee['evolution'] = [
                                'status' => false,
                                // 'pourcentage' => null,
                                // 'signe' => null,
                                'comparaison' => "vs " . ($annee['annee'] - 1),
                                'message' => "L'année précédente n'a pas de dépenses pour comparaison."
                            ];
                        }
                    }
                    $previousTotal = $annee['total'];
                    $previousAnnee = $annee['annee'];
                }
                break;


            default:
                throw new \Exception("Mode de statistique incorrect : $mode");
        }

        // Ajoute les noms des jours/mois et supprime les numéros
        foreach ($statsComplete as &$stat) {
            if ($mode === 'jour' && isset($stat['jour_num'])) {
                unset($stat['jour_num']);
            } elseif ($mode === 'mois') {
                unset($stat['mois_num']);  // Supprime 'mois_num' pour ne pas l'afficher
            }
        }

        // Pagination manuelle
        $page = request()->get('page', 1);
        $offset = ($page - 1) * $perPage;
        $statsPaginees = array_slice($statsComplete, $offset, $perPage);

        return [
            'data' => $statsPaginees,
            'total' => count($statsComplete),
            'per_page' => $perPage,
            'current_page' => $page,
            'last_page' => ceil(count($statsComplete) / $perPage),
        ];
    }
}
