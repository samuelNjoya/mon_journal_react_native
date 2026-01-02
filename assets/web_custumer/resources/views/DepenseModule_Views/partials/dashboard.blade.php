<!-- Sélecteur de période -->
<div class="timeframe-selector">
    <button class="timeframe-btn active" data-timeframe="today">
        <i class="bi bi-calendar-day"></i>
        <span>Jour</span>
    </button>
    <button class="timeframe-btn" data-timeframe="week">
        <i class="bi bi-calendar-week"></i>
        <span>Semaine</span>
    </button>
    <button class="timeframe-btn" data-timeframe="month">
        <i class="bi bi-calendar-month"></i>
        <span>Mois</span>
    </button>
    <button class="timeframe-btn" data-timeframe="year">
        <i class="bi bi-calendar"></i>
        <span>Année</span>
    </button>
</div>

<!-- Carte principale du dashboard -->
<div class="kt-portlet dashboard-main-card">
    <div class="kt-portlet__body">

        <!-- En-tête période -->
        <div class="period-header">
            <i class="flaticon-calendar-3"></i>
            <span class="period-text" id="periodText">Chargement...</span>
        </div>

        <!-- Section total -->
        <div class="total-section">
            <div class="total-info">
                <div class="total-label" id="totalLabel">Dépenses quotidiennes</div>
                <div class="total-amount" id="totalAmount">- - - FCFA</div>
            </div>
            <div class="trend-badge trend-up" id="trendBadge" >
                <i class="bi bi-graph-up-arrow"></i>
                <span id="trendText">- - - vs hier</span>
            </div>
        </div>

        <!-- Grille de statistiques principales -->
        <div class="stats-grid">
            <div class="stat-card-large">
                <div class="stat-icon-large">
                    <i class="bi bi-cash-stack"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label" id="mainStatLabel">Dépenses du jour</div>
                    <div class="stat-value" id="mainStatValue">- - - FCFA</div>
                    <div class="stat-subtext" id="mainStatSubtext">- - - dépense</div>
                </div>
            </div>
        </div>

        <!-- Statistiques détaillées -->
        <div class="stats-details" id="statsDetails">
            <!-- Les statistiques seront chargées dynamiquement ici -->
        </div>

        <!-- Catégories les plus consommées -->
        <div class="categories-section">
            <div class="section-header">
                <i class="bi bi-pie-chart-fill"></i>
                <h3 class="section-title">Catégories les plus consommées</h3>
            </div>
            <div class="categories-grid" id="categoriesGrid">
                <!-- Les catégories seront chargées dynamiquement ici -->
            </div>
        </div>

    </div>
</div>

  {{-- partie du deuxieme graph --}}
<div class="mt-3">
   @include('DepenseModule_Views.expense.lineChart')
</div>

<div class="mt-3">
   @include('DepenseModule_Views.expense.graphExpensesFilter')
</div>
