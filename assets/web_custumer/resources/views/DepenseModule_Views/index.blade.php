@extends('layout')
@section('title','Module dépenses')

@section('content')
<div class="kt-container kt-container--fluid kt-grid__item kt-grid__item--fluid">

    <!-- Navigation par onglets -->
    <div class="kt-portlet" style="margin-bottom: 15px; margin-top:35px">
        <div class="kt-portlet__body" style="padding: 10px 10px 0 10px;">
            <ul class="nav nav-tabs nav-tabs-line nav-tabs-bold expense-tabs" role="tablist" style="border: none; justify-content: space-around;margin-bottom: 0;">
                <li class="nav-item" style="flex: 1; text-align: center;margin-bottom: 0;">
                    <a class="nav-link active" data-toggle="tab" href="#tab_dashboard" role="tab" data-title="Tableau de bord" data-subtitle="Vue d'ensemble de vos finances">
                        <i class="flaticon-squares" style="font-size: 20px; display: block; margin-bottom: 1px;"></i>
                        <span style="font-size: 11px; font-weight: 500;">Tableau de bord</span>
                    </a>
                </li>
                <li class="nav-item" style="flex: 1; text-align: center;">
                    <a class="nav-link" data-toggle="tab" href="#tab_expenses" role="tab" data-title="Dépenses" data-subtitle="Gérez vos dépenses quotidiennes">
                        <i class="flaticon-coins" style="font-size: 20px; display: block; margin-bottom: 1px;"></i>
                        <span style="font-size: 11px; font-weight: 500;">Dépenses</span>
                    </a>
                </li>
                <li class="nav-item" style="flex: 1; text-align: center;">
                    <a class="nav-link" data-toggle="tab" href="#tab_categories" role="tab" data-title="Catégories" data-subtitle="Organisez vos dépenses par catégorie">
                        <i class="flaticon-shapes" style="font-size: 20px; display: block; margin-bottom: 1px;"></i>
                        <span style="font-size: 11px; font-weight: 500;">Catégories</span>
                    </a>
                </li>
                <li class="nav-item" style="flex: 1; text-align: center;">
                    <a class="nav-link" data-toggle="tab" href="#tab_budgets" role="tab" data-title="Budgets" data-subtitle="Suivez et contrôlez vos budgets">
                        <i class="flaticon-pie-chart" style="font-size: 20px; display: block; margin-bottom: 1px;"></i>
                        <span style="font-size: 11px; font-weight: 500;">Budgets</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>

     <!-- En-tête avec icône et titre -->
    <div class="kt-portlet kt-portlet--mobile" style="margin-bottom: 15px;margin-top:15px">
        <div class="kt-portlet__body" style="padding: 20px;">
            <div class="row align-items-center">
                <div class="col-auto">
                    <div style="background-color: #fcbf00; border-radius: 12px; padding: 12px; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center;">
                        <i class="flaticon-folder" style="font-size: 28px; color: white;"></i>
                    </div>
                </div>
                <div class="col">
                    <h3 class="kt-portlet__head-title" style="margin: 0; font-size: 20px; font-weight: 600; color: #333;">
                        <span id="section-title">Tableau de bord</span>
                    </h3>
                    <p style="margin: 0; color: #666; font-size: 13px;">
                        <span id="section-subtitle">Vue d'ensemble de vos finances</span>
                    </p>
                </div>
            </div>
        </div>
    </div>


    <!-- Contenu des onglets -->
    <div class="tab-content">

        <!-- ONGLET TABLEAU DE BORD -->
        <div class="tab-pane active" id="tab_dashboard" role="tabpanel">
            @include('DepenseModule_Views.partials.dashboard')
        </div>

        <!-- ONGLET DÉPENSES -->
        <div class="tab-pane" id="tab_expenses" role="tabpanel">
            @include('DepenseModule_Views.partials.expenses')
        </div>

        <!-- ONGLET CATÉGORIES -->
        <div class="tab-pane" id="tab_categories" role="tabpanel">
            @include('DepenseModule_Views.partials.categories')
        </div>

        <!-- ONGLET BUDGETS -->
        <div class="tab-pane" id="tab_budgets" role="tabpanel">
            @include('DepenseModule_Views.partials.budgets')
        </div>

    </div>

</div>
@endsection

@section('scripts')

<!-- Styles du dashboard -->
<link href="{{ asset('assets/css/DepenseModule_css/dashboard-expenses.css') }}" rel="stylesheet" type="text/css" />
<link href="{{ asset('assets/css/DepenseModule_css/graphExpensesLine.css') }}" rel="stylesheet" type="text/css" />
<link href="{{ asset('assets/css/DepenseModule_css/graphExpensesFilter.css') }}" rel="stylesheet" type="text/css" />
<link href="{{ asset('assets/css/DepenseModule_css/categoryFormAndList.css') }}" rel="stylesheet" type="text/css" />
<link href="{{ asset('assets/css/DepenseModule_css/expensesList.css') }}" rel="stylesheet" type="text/css" />
<link href="{{ asset('assets/css/DepenseModule_css/expensesForm.css') }}" rel="stylesheet" type="text/css" />
 <!-- Chart.js pour le graphique -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
$(document).ready(function() {
    // Gestion du changement d'onglet avec mise à jour du titre
    $('.expense-tabs a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var title = $(e.target).data('title');
        var subtitle = $(e.target).data('subtitle');

        $('#section-title').text(title);
        $('#section-subtitle').text(subtitle);

        // Animation de l'icône (optionnel)
        $('.expense-tabs i').css('color', '#666');
        $(e.target).find('i').css('color', '#fcbf00');
    });

    // Style actif initial
    $('.expense-tabs .nav-link.active i').css('color', '#fcbf00');
});

// Gestion du formulaire de dépense
// Gestion du formulaire de dépense
function showExpenseForm() {
    $('#expense-button-container').hide(); // Cache le bouton
    $('#expense-form-container').slideDown(); // Affiche le formulaire
    $('html, body').animate({ scrollTop: $('#expense-form-container').offset().top - 100 }, 500);
}

function hideExpenseForm() {
    $('#expense-form-container').slideUp(function() { // Cache le formulaire
        $('#expense-button-container').show(); // Réaffiche le bouton après l'animation
    });
}

// Gestion du formulaire de budget
function showBudgetForm() {
    // Votre logique ici
    alert('Formulaire de budget à implémenter');
}
</script>

<style>
/* Styles personnalisés pour les onglets */
.expense-tabs {
    margin-bottom: 0 !important;  /*Supprime la marge en bas du ul */
}

.expense-tabs .nav-item {
    margin-bottom: 0 !important;  /* Supprime la marge des li */
}
.expense-tabs .nav-link {
    border: none !important;
    color: #666;
    padding: 10px 5px;
    transition: all 0.3s ease;
    position: relative;
}

.expense-tabs .nav-link:hover {
    background-color: transparent;
    color: #fcbf00;
}

.expense-tabs .nav-link.active {
    background-color: transparent !important;
    color: #fcbf00 !important;
    font-weight: 600;
}

.expense-tabs .nav-link.active::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 3px;
    background-color: #fcbf00;
    border-radius: 0 0 2px 2px;
}

.expense-tabs .nav-link i {
    transition: color 0.3s ease;
}

/* Responsive */
@media (max-width: 768px) {
    .expense-tabs span {
        font-size: 9px !important;
    }

    .expense-tabs i {
        font-size: 18px !important;
    }
}
</style>

<!-- Script du dashboard -->
<script src="{{ asset('assets/js/DepenseModule_js/dashboard-expenses.js') }}"></script>
<script src="{{ asset('assets/js/DepenseModule_js/graphExpensesLine.js') }}"></script>
<script src="{{ asset('assets/js/DepenseModule_js/graphExpensesFilter.js') }}"></script>
<script src="{{ asset('assets/js/DepenseModule_js/categoryFormAndList.js') }}"></script>
<script src="{{ asset('assets/js/DepenseModule_js/expensesList.js') }}"></script>
<script src="{{ asset('assets/js/DepenseModule_js/expensesForm.js') }}"></script>
@endsection
