<div >

    <!-- Carte principale -->
    <div class="exp-hist-card">
        <!-- Header -->
        <div class="exp-hist-card-header">
            <h2 class="exp-hist-title">
                <i class="la la-history"></i>
                Historique des Dépenses
            </h2>
        </div>

        <!-- Contenu -->
        <div class="exp-hist-card-body">

            <!-- Barre de recherche et filtres -->
            <div class="exp-hist-search-bar">
                <div class="exp-hist-search-box">
                    <i class="la la-search"></i>
                    <input type="text"
                           id="expHistSearchInput"
                           placeholder="Rechercher une dépense..."
                           class="exp-hist-search-input">
                </div>
                <button class="exp-hist-filter-btn" id="expHistFilterToggleBtn">
                    <i class="la la-filter"></i>
                    <span class="exp-hist-btn-text">Filtres</span>
                    <span class="exp-hist-badge" id="expHistActiveFilterCount" style="display: none;">0</span>
                </button>
            </div>

            <!-- Panneau de filtres -->
            <div class="exp-hist-filters-panel" id="expHistFiltersPanel">
                <div class="exp-hist-filters-grid">

                    <!-- Dates -->
                    <div class="exp-hist-filter-group">
                        <label class="exp-hist-filter-label">Période</label>
                        <div class="exp-hist-date-group">
                            <input type="date" id="expHistStartDate" class="exp-hist-filter-input">
                            <span class="exp-hist-date-separator">au</span>
                            <input type="date" id="expHistEndDate" class="exp-hist-filter-input">
                        </div>
                    </div>

                    <!-- Budget -->
                    <div class="exp-hist-filter-group">
                        <label class="exp-hist-filter-label">Budget</label>
                        <select id="expHistBudgetFilter" class="exp-hist-filter-select">
                            <option value="0">Tous les budgets</option>
                        </select>
                    </div>

                    <!-- Catégorie -->
                    <div class="exp-hist-filter-group">
                        <label class="exp-hist-filter-label">Catégorie</label>
                        <select id="expHistCategoryFilter" class="exp-hist-filter-select">
                            <option value="0">Toutes les catégories</option>
                        </select>
                    </div>

                    <!-- Montant -->
                    <div class="exp-hist-filter-group">
                        <label class="exp-hist-filter-label">Plage de montant (FCFA)</label>
                        <div class="exp-hist-amount-slider-container">
                            <div class="exp-hist-amount-labels">
                                <span class="exp-hist-amount-label" id="expHistMinAmountLabel">0 FCFA</span>
                                <span class="exp-hist-amount-label" id="expHistMaxAmountLabel">1,000,000 FCFA</span>
                            </div>

                            <div class="exp-hist-slider-container" id="expHistAmountSliderContainer">
                                <div class="exp-hist-slider-track"></div>
                                <div class="exp-hist-slider-range" id="expHistSliderRange"></div>
                                <div class="exp-hist-slider-thumb" id="expHistMinSliderThumb">
                                    <div class="exp-hist-slider-value" id="expHistMinSliderValue">0</div>
                                </div>
                                <div class="exp-hist-slider-thumb" id="expHistMaxSliderThumb">
                                    <div class="exp-hist-slider-value" id="expHistMaxSliderValue">1M</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Sélecteur de pagination -->
            <div class="exp-hist-pagination-selector">
                <div class="exp-hist-selector-info">
                    <i class="la la-table"></i>
                    <span id="expHistSelectorInfoText">Dépenses 1 à 25 sur 0</span>
                </div>
                <div class="exp-hist-items-per-page">
                    <select id="expHistItemsPerPageSelect" class="exp-hist-filter-select">
                        <option value="10">10</option>
                        <option value="25" selected>25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
            </div>

            <!-- Liste des dépenses -->
            <div class="exp-hist-list-container" id="expHistListContainer">
                <div id="expHistList">
                    <!-- Les items seront chargés ici -->
                </div>

                <!-- État vide -->
                <div class="exp-hist-empty-state" id="expHistEmptyState" style="display: none;">
                    <i class="la la-inbox"></i>
                    <h4>Aucune dépense trouvée</h4>
                    <p id="expHistEmptyMessage">Les dépenses apparaîtront ici</p>
                    <button class="exp-hist-clear-filters-btn" id="expHistClearFiltersBtn" style="display: none;">
                        <i class="la la-times-circle"></i> Effacer les filtres
                    </button>
                </div>
            </div>

            <!-- Pagination -->
            <div class="exp-hist-pagination-container" id="expHistPaginationContainer" style="display: none;">
                <button class="exp-hist-page-btn" id="expHistFirstPageBtn" disabled>
                    <i class="la la-angle-double-left"></i>
                </button>
                <button class="exp-hist-page-btn" id="expHistPrevPageBtn" disabled>
                    <i class="la la-angle-left"></i>
                </button>

                <div class="exp-hist-pagination-info" id="expHistPaginationInfo">
                    Page <span id="expHistCurrentPage">1</span> / <span id="expHistTotalPages">1</span>
                </div>

                <button class="exp-hist-page-btn" id="expHistNextPageBtn" disabled>
                    <i class="la la-angle-right"></i>
                </button>
                <button class="exp-hist-page-btn" id="expHistLastPageBtn" disabled>
                    <i class="la la-angle-double-right"></i>
                </button>
            </div>

        </div>
    </div>

</div>

<!-- Spinner global -->
<div class="exp-hist-spinner-overlay" id="expHistSpinnerOverlay">
    <div class="exp-hist-spinner"></div>
    <div class="exp-hist-spinner-text" id="expHistSpinnerText">Chargement...</div>
</div>

<!-- Modal des détails -->
<div class="exp-hist-modal-overlay" id="expHistDetailModal">
    <div class="exp-hist-modal-content">
        <div class="exp-hist-modal-header">
            <h5>
                <i class="la la-receipt"></i>
                Détails de la dépense
            </h5>
            <button class="exp-hist-modal-close" id="expHistCloseDetailModal">
                <i class="la la-times"></i>
            </button>
        </div>
        <div class="exp-hist-modal-body" id="expHistDetailBody">
            <!-- Les détails seront chargés ici -->
        </div>
    </div>
</div>
