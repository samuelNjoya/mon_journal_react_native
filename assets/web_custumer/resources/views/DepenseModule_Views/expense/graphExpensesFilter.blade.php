<!-- SECTION FILTRES -->
<div class="analytics-filter-container">
    <div class="analytics-filter-header">
        <h3 class="analytics-filter-title">Filtres des Dépenses</h3>
        <div class="analytics-filtering-indicator" id="analyticsFilteringIndicator" style="display: none;">
            <i class="la la-refresh"></i>
            <span>Filtrage en cours...</span>
        </div>
    </div>

    <!-- Grille de filtres -->
    <div class="analytics-filters-grid">
        <!-- Dates -->
        <div class="analytics-filter-group">
            <label class="analytics-filter-label">Période</label>
            <div class="analytics-date-group">
                <input type="date" id="analyticsStartDate" class="analytics-date-input">
                <span class="analytics-date-separator">au</span>
                <input type="date" id="analyticsEndDate" class="analytics-date-input">
            </div>
        </div>

        <!-- Budget -->
        <div class="analytics-filter-group">
            <label class="analytics-filter-label">Budget</label>
            <select id="analyticsBudgetFilter" class="analytics-filter-select">
                <option value="0">Tous les budgets</option>
            </select>
        </div>

        <!-- Catégorie -->
        <div class="analytics-filter-group">
            <label class="analytics-filter-label">Catégorie</label>
            <select id="analyticsCategoryFilter" class="analytics-filter-select">
                <option value="0">Toutes les catégories</option>
            </select>
        </div>

        <!-- Montant - Prend toute la largeur -->
        <div class="analytics-amount-slider-container">
            <div class="analytics-amount-labels">
                <span class="analytics-amount-label" id="analyticsMinAmountLabel">0 FCFA</span>
                <span class="analytics-amount-label" id="analyticsMaxAmountLabel">1,000,000 FCFA</span>
            </div>
            
            <!-- Conteneur du double slider -->
            <div class="analytics-slider-container" id="analyticsAmountSliderContainer">
                <div class="analytics-slider-track"></div>
                <div class="analytics-slider-range" id="analyticsSliderRange"></div>
                <div class="analytics-slider-thumb" id="analyticsMinSliderThumb">
                    <div class="analytics-slider-value" id="analyticsMinSliderValue">0</div>
                </div>
                <div class="analytics-slider-thumb" id="analyticsMaxSliderThumb">
                    <div class="analytics-slider-value" id="analyticsMaxSliderValue">1,000,000</div>
                </div>
            </div>
            
            <div class="analytics-amount-inputs">
                <input type="number" 
                       id="analyticsMinAmountInput" 
                       class="analytics-amount-input" 
                       placeholder="Montant min"
                       min="0"
                       max="1000000">
                <span class="analytics-amount-separator">-</span>
                <input type="number" 
                       id="analyticsMaxAmountInput" 
                       class="analytics-amount-input" 
                       placeholder="Montant max"
                       min="0"
                       max="1000000">
            </div>
        </div>
    </div>
</div>

<!-- SECTION GRAPHIQUES -->
<div class="analytics-charts-grid">
    <!-- Graphique en barres -->
    <div class="analytics-chart-card">
        <h3 class="analytics-chart-title">Évolution des Dépenses</h3>
        <div class="analytics-chart-container">
            <canvas id="analyticsBarChart"></canvas>
        </div>
        <div class="analytics-empty-state" id="analyticsBarChartEmpty" style="display: none;">
            <i class="la la-info-circle"></i>
            <div class="analytics-empty-text">Aucune dépense trouvée pour cette période</div>
        </div>
    </div>

    <!-- Graphique en camembert -->
    <div class="analytics-chart-card">
        <h3 class="analytics-chart-title">Répartition par Catégorie</h3>
        <div class="analytics-chart-container">
            <canvas id="analyticsPieChart"></canvas>
        </div>
        <div class="analytics-legend-container" id="analyticsPieChartLegend">
            <!-- Légende générée dynamiquement -->
        </div>
        <div class="analytics-empty-state" id="analyticsPieChartEmpty" style="display: none;">
            <i class="la la-info-circle"></i>
            <div class="analytics-empty-text">Aucune dépense catégorisée pour cette période</div>
        </div>
    </div>
</div>