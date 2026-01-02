<link href="{{ asset('assets/css/DepenseModule_css/graphExpensesLine.css') }}" rel="stylesheet" type="text/css" />

<!-- Barre de filtre -->
<div class="filter-bar">
    <h3 class="title">Suivi des Dépenses</h3>
    <div class="filter-buttons">
        <button class="time-filter-btn" data-timeframe="week">Semaine</button>
        <button class="time-filter-btn active" data-timeframe="month">Mois</button>
        <button class="time-filter-btn" data-timeframe="year">Année</button>
    </div>
</div>

<!-- Carte principale avec graphique -->
<div class="kt-portlet graph-main-card">
    <div class="kt-portlet__body">
        
        <!-- Section total des dépenses -->
        <div class="total-expenses-section">
            <div>
                <div class="total-expenses-label">Total des dépenses</div>
                <div class="total-expenses-amount" id="totalExpenses">--- FCFA</div>
            </div>
            <div class="comparison-badge" id="comparisonBadge" style="display: none;">
                <span id="comparisonText">+5.2% vs sem préc</span>
            </div>
        </div>

        <!-- Graphique -->
        <div class="chart-container">
            <canvas id="expenseChart"></canvas>
        </div>

        <!-- Liste des catégories -->
        <div class="categories-scroll-container">
            <div class="categories-title">Répartition par catégorie</div>
            
            <!-- Boutons de navigation -->
            <button class="scroll-nav left" id="scrollLeftBtn">
                <i class="la la-angle-left"></i>
            </button>
            
            <button class="scroll-nav right" id="scrollRightBtn">
                <i class="la la-angle-right"></i>
            </button>
            
            <div class="categories-list" id="categoriesList">
                <!-- Les cartes de catégories seront ajoutées ici dynamiquement -->
            </div>
        </div>
        
    </div>
</div>

<!-- Chart.js pour le graphique -->
{{-- <script src="https://cdn.jsdelivr.net/npm/chart.js"></script> --}}
{{-- <script src="{{ asset('assets/css/DepenseModule_css/graphExpensesLine.js') }}"></script> --}}