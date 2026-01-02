class ExpensesHistory {
    constructor() {
        this.expenses = [];
        this.categories = [];
        this.budgets = [];

        // État de l'application
        this.state = {
            searchQuery: '',
            currentPage: 1,
            itemsPerPage: 25,
            filters: {
                startDate: this.getFirstDayOfMonth(),
                endDate: new Date().toISOString().split('T')[0],
                selectedBudget: 0,
                selectedCategory: 0,
                minAmount: 0,
                maxAmount: 1000000
            },
            isLoadingList: false, //  AJOUTÉ pour le loading dans la liste
            selectedExpense: null,
            minAmountThumb: null,
            maxAmountThumb: null,
            isDragging: false,
            activeThumb: null
        };

        this.filterTimeout = null;
        this.init();
    }

    /**
     * ============================================
     * INITIALISATION
     * ============================================
     */
    async init() {
        this.setupEventListeners();
        this.initDoubleSlider();
        await this.loadData();
    }

    /**
     * ============================================
     * CHARGEMENT DES DONNÉES
     * ============================================
     */
    async loadData() {
        try {
            //  Activer le loading dans la liste
            this.state.isLoadingList = true;
            this.renderExpenses([], 0, 0);

            //  Charger depuis l'API
            await this.loadRealApiData();

            //  Pré-remplir les dates
            $('#expHistStartDate').val(this.state.filters.startDate);
            $('#expHistEndDate').val(this.state.filters.endDate);

            this.populateFilters();
            this.applyFilters();

        } catch (error) {
            console.error('Erreur loadData:', error);
            this.state.isLoadingList = false;
            swal.fire({
                "title": "Erreur",
                "text": "Erreur lors du chargement des données",
                "type": "error",
                "confirmButtonClass": "btn btn-secondary"
            });
        }
    }

    /**
     * ============================================
     * CHARGEMENT DEPUIS L'API
     * ============================================
     */
    async loadRealApiData() {
        const response = await fetch('/dashboard/expenses/data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message);
        }

        const apiData = result.data;

        //  Stocker les catégories
        if (apiData.categories && apiData.categories.data) {
            this.categories = apiData.categories.data.map(cat => ({
                id: cat.id,
                nom: cat.nom,
                color: cat.color
            }));
        }

        //  Stocker les dépenses ET TRIER DU PLUS RÉCENT AU PLUS ANCIEN
        if (apiData.expenses && apiData.expenses.data) {
            this.expenses = apiData.expenses.data.map(exp => ({
                id: exp.id,
                libelle: exp.libelle,
                montant: parseFloat(exp.montant),
                id_categorie_depense: exp.id_categorie_depense,
                IdBudget: exp.IdBudget,
                created_at: exp.created_at,
                is_repetitive: exp.is_repetitive,
                status_is_repetitive: exp.status_is_repetitive,
                piece_jointe: exp.piece_jointe, // AJOUTÉ
                date_debut: exp.date_debut, // AJOUTÉ pour le cycle
                date_fin: exp.date_fin // AJOUTÉ pour le cycle
            }));

          this.expenses.sort((a, b) => b.id - a.id);
        }

        // Charger les budgets
        await this.loadBudgetCategoryFilter();
    }

    /**
     * ============================================
     * CHARGEMENT DES BUDGETS
     * ============================================
     */
    async loadBudgetCategoryFilter() {
        try {
            const response = await fetch('/dashboard/expenses/budget-category-filter', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (!response.ok) {
                console.warn('Impossible de charger les budgets');
                this.budgets = [];
                return;
            }

            const result = await response.json();

            if (!result.success) {
                console.warn('Erreur lors du chargement des budgets:', result.message);
                this.budgets = [];
                return;
            }

            let budgetData = null;

            if (result.data && result.data.data) {
                budgetData = result.data.data;
            } else if (result.data && Array.isArray(result.data)) {
                budgetData = result.data;
            } else {
                console.error('Structure non reconnue:', result);
                this.budgets = [];
                return;
            }

            if (!Array.isArray(budgetData)) {
                console.error('budgetData n\'est pas un tableau !');
                this.budgets = [];
                return;
            }

            this.budgets = budgetData.map(budget => ({
                id: budget.id || budget.IdBudget,
                libelle: budget.libelle || budget.nom_budget || budget.libelle_budget || `Budget ${budget.id}`,
                categories: budget.categories || budget.id_categories || budget.id_categorie_depense || []
            }));

        } catch (error) {
            console.error('Erreur loadBudgetCategoryFilter:', error);
            this.budgets = [];
        }
    }

    /**
     * ============================================
     * PARSE DE DATE (gère les formats français et ISO)
     * ============================================
     */
    parseExpenseDate(dateString) {
        if (!dateString) return new Date(0);

        //  Format français : "15/01/2024"
        if (typeof dateString === 'string' && dateString.includes('/')) {
            const [day, month, year] = dateString.split('/');
            return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        }

        //  Format ISO : "2024-01-15"
        return new Date(dateString);
    }

    /**
     * ============================================
     * FORMAT D'AFFICHAGE DE DATE
     * ============================================
     */
    formatDisplayDate(dateString) {
        const date = this.parseExpenseDate(dateString);

        //  Vérifier si la date est valide
        if (isNaN(date.getTime())) {
            return 'Date invalide';
        }

        //  Formater en français : "15 janv. 2024"
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    /**
     * ============================================
     * FILTRAGE CÔTÉ CLIENT
     * ============================================
     */
    getFilteredExpenses() {
        return this.expenses.filter(expense => {
            //  Filtre par recherche texte
            if (this.state.searchQuery &&
                !expense.libelle.toLowerCase().includes(this.state.searchQuery.toLowerCase())) {
                return false;
            }

            //  Filtre par date
            const expDate = this.parseExpenseDate(expense.created_at);
            const startDate = new Date(this.state.filters.startDate);
            const endDate = new Date(this.state.filters.endDate);
            endDate.setHours(23, 59, 59, 999);

            if (expDate < startDate || expDate > endDate) {
                return false;
            }

            //  Filtre par budget
            if (this.state.filters.selectedBudget !== 0 &&
                expense.IdBudget !== this.state.filters.selectedBudget) {
                return false;
            }

            //  Filtre par catégorie
            if (this.state.filters.selectedCategory !== 0 &&
                expense.id_categorie_depense !== this.state.filters.selectedCategory) {
                return false;
            }

            //  Filtre par montant
            if (expense.montant < this.state.filters.minAmount ||
                expense.montant > this.state.filters.maxAmount) {
                return false;
            }

            return true;
        });
    }

    /**
     * ============================================
     * APPLICATION DES FILTRES
     * ============================================
     */
    applyFilters() {
        //  Désactiver le loading
        this.state.isLoadingList = false;

        //  Filtrer les dépenses
        const filteredExpenses = this.getFilteredExpenses();
        const totalFiltered = filteredExpenses.length;
        const totalPages = Math.ceil(totalFiltered / this.state.itemsPerPage);

        //  Réinitialiser à la page 1 si on dépasse
        if (this.state.currentPage > totalPages && totalPages > 0) {
            this.state.currentPage = 1;
        }

        if (totalPages === 0) {
            this.state.currentPage = 1;
        }

        //  Paginer les résultats filtrés
        const start = (this.state.currentPage - 1) * this.state.itemsPerPage;
        const end = start + this.state.itemsPerPage;
        const paginatedExpenses = filteredExpenses.slice(start, end);

        //  Rendre la liste
        this.renderExpenses(paginatedExpenses, totalFiltered, totalPages);
    }

    debouncedApplyFilters() {
        if (this.filterTimeout) {
            clearTimeout(this.filterTimeout);
        }

        this.filterTimeout = setTimeout(() => {
            this.applyFilters();
        }, 500);
    }

    /**
     * ============================================
     * RENDU DE LA LISTE (avec loading comme catégories)
     * ============================================
     */
    renderExpenses(paginatedExpenses, totalFiltered, totalPages) {
        const listContainer = $('#expHistList');
        const emptyState = $('#expHistEmptyState');
        const emptyMessage = $('#expHistEmptyMessage');
        const clearFiltersBtn = $('#expHistClearFiltersBtn');
        const paginationContainer = $('#expHistPaginationContainer');

        //  AFFICHER LE LOADING DANS LA LISTE (comme catégories)
        if (this.state.isLoadingList) {
            emptyState.hide();
            paginationContainer.hide();
            listContainer.html(`
                <div class="exp-hist-loading-in-list">
                    <i class="la la-hourglass"></i>
                    <div class="exp-hist-loading-text">Chargement des dépenses...</div>
                    <div class="exp-hist-loading-subtext">Veuillez patienter</div>
                </div>
            `);
            return;
        }

        //  Pas de dépenses
        if (paginatedExpenses.length === 0) {
            listContainer.html('');
            emptyState.show();
            paginationContainer.hide();

            const hasFilters = this.hasActiveFilters();

            if (hasFilters) {
                emptyMessage.text('Aucune dépense ne correspond à vos critères');
                clearFiltersBtn.show();
            } else {
                emptyMessage.text('Aucune dépense pour cette période');
                clearFiltersBtn.hide();
            }

            return;
        }

        //  Afficher les dépenses paginées
        emptyState.hide();
        paginationContainer.show();

        const html = paginatedExpenses.map(expense => {
            const category = this.categories.find(c => c.id === expense.id_categorie_depense);
            const isRecurring = expense.is_repetitive === 1;
            const isActive = expense.status_is_repetitive === 0;

            return `
                <div class="exp-hist-item" data-id="${expense.id}" onclick="expensesHistory.viewExpenseDetail(${expense.id})">
                    <div class="exp-hist-item-header">
                        <h3 class="exp-hist-item-label">${expense.libelle}</h3>
                        <div class="exp-hist-item-amount">- ${expense.montant.toLocaleString('fr-FR')} FCFA</div>
                    </div>
                    <div class="exp-hist-item-details-actions">
                        <div class="exp-hist-item-details">
                            <span>${this.formatDisplayDate(expense.created_at)}</span>
                            <span>•</span>
                            <span>${category?.nom || 'Inconnue'}</span>
                        </div>
                        <div class="exp-hist-item-actions" onclick="event.stopPropagation()">
                            ${isRecurring && isActive ? `
                                <button class="exp-hist-item-btn exp-hist-btn-stop" onclick="expensesHistory.confirmStopRecurring(${expense.id})" title="Arrêter la récurrence">
                                    <i class="bi bi-arrow-repeat"></i>
                                </button>
                            ` : ''}
                            <button class="exp-hist-item-btn exp-hist-btn-duplicate" onclick="expensesHistory.confirmDuplicate(${expense.id})" title="Dupliquer">
                                <i class="bi bi-files"></i>
                            </button>
                            <button class="exp-hist-item-btn exp-hist-btn-delete" onclick="expensesHistory.confirmDelete(${expense.id})" title="Supprimer">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        listContainer.html(html);

        //  Mettre à jour la pagination
        this.updatePagination(totalPages);
        this.updateSelectorInfo(totalFiltered);
    }

    /**
     * ============================================
     * MISE À JOUR DE LA PAGINATION
     * ============================================
     */
    updatePagination(totalPages) {
        $('#expHistCurrentPage').text(this.state.currentPage);
        $('#expHistTotalPages').text(totalPages);

        $('#expHistFirstPageBtn').prop('disabled', this.state.currentPage === 1);
        $('#expHistPrevPageBtn').prop('disabled', this.state.currentPage === 1);
        $('#expHistNextPageBtn').prop('disabled', this.state.currentPage >= totalPages);
        $('#expHistLastPageBtn').prop('disabled', this.state.currentPage >= totalPages);
    }

    updateSelectorInfo(totalFiltered) {
        const start = totalFiltered === 0 ? 0 : (this.state.currentPage - 1) * this.state.itemsPerPage + 1;
        const end = Math.min(start + this.state.itemsPerPage - 1, totalFiltered);

        $('#expHistSelectorInfoText').text(
            `Dépenses ${start} à ${end} sur ${totalFiltered}`
        );
    }

    /**
     * ============================================
     * POPULATION DES FILTRES
     * ============================================
     */
    populateFilters() {
        const budgetFilter = $('#expHistBudgetFilter');
        budgetFilter.html('<option value="0">Tous les budgets</option>');

        this.budgets.forEach(budget => {
            budgetFilter.append(`<option value="${budget.id}">${budget.libelle}</option>`);
        });

        this.populateCategoryFilter(this.categories);

        $('#expHistMinAmountInput').val(this.state.filters.minAmount);
        $('#expHistMaxAmountInput').val(this.state.filters.maxAmount);
        this.updateAmountLabels();
    }

    populateCategoryFilter(categoriesToShow) {
        const select = $('#expHistCategoryFilter');
        select.html('<option value="0">Toutes les catégories</option>');

        const categories = categoriesToShow || this.categories;

        categories.forEach(category => {
            select.append(`<option value="${category.id}">${category.nom}</option>`);
        });
    }

    /**
     * ============================================
     * FILTRE BUDGET → CATÉGORIES
     * ============================================
     */
    handleBudgetFilterChange(budgetId) {
        const budgetIdNum = parseInt(budgetId);
        this.state.filters.selectedBudget = budgetIdNum;

        if (budgetIdNum === 0) {
            this.populateCategoryFilter(this.categories);
        } else {
            const budget = this.budgets.find(b => b.id === budgetIdNum);
            if (budget && budget.categories) {
                const filteredCategories = budget.categories
                    .map(catId => this.categories.find(c => c.id === catId))
                    .filter(c => c !== undefined);
                this.populateCategoryFilter(filteredCategories);
            } else {
                this.populateCategoryFilter([]);
            }
        }

        const categoryFilter = $('#expHistCategoryFilter');
        const availableCategoryIds = Array.from(categoryFilter[0].options).map(opt => parseInt(opt.value));

        if (!availableCategoryIds.includes(this.state.filters.selectedCategory)) {
            this.state.filters.selectedCategory = 0;
            categoryFilter.val('0');
        }

        this.state.currentPage = 1;
        this.debouncedApplyFilters();
    }

    /**
     * ============================================
     * DOUBLE SLIDER
     * ============================================
     */
    initDoubleSlider() {
        const container = $('#expHistAmountSliderContainer');
        if (!container.length) return;

        const range = container.find('.exp-hist-slider-range');
        const minThumb = container.find('#expHistMinSliderThumb');
        const maxThumb = container.find('#expHistMaxSliderThumb');

        this.state.minAmountThumb = minThumb[0];
        this.state.maxAmountThumb = maxThumb[0];

        const updateSlider = () => {
            const minPercent = (this.state.filters.minAmount / 1000000) * 100;
            const maxPercent = (this.state.filters.maxAmount / 1000000) * 100;

            range.css({
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`
            });

            minThumb.css('left', `${minPercent}%`);
            maxThumb.css('left', `${maxPercent}%`);

            $('#expHistMinSliderValue').text(this.formatAmount(this.state.filters.minAmount));
            $('#expHistMaxSliderValue').text(this.formatAmount(this.state.filters.maxAmount));
        };

        const startDrag = (e, thumbType) => {
            e.preventDefault();
            this.state.isDragging = true;
            this.state.activeThumb = thumbType;

            const track = container.find('.exp-hist-slider-track');

            const moveHandler = (e) => {
                if (!this.state.isDragging) return;

                const rect = track[0].getBoundingClientRect();
                const x = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
                let percent = ((x - rect.left) / rect.width) * 100;
                percent = Math.max(0, Math.min(100, percent));

                const value = Math.round((percent / 100) * 1000000);

                if (this.state.activeThumb === 'min') {
                    if (value < this.state.filters.maxAmount) {
                        this.state.filters.minAmount = value;
                    }
                } else {
                    if (value > this.state.filters.minAmount) {
                        this.state.filters.maxAmount = value;
                    }
                }

                updateSlider();
                this.updateAmountLabels();
            };

            const stopDrag = () => {
                if (this.state.isDragging) {
                    this.state.isDragging = false;
                    this.state.activeThumb = null;
                    this.debouncedApplyFilters();
                }

                $(document).off('mousemove touchmove', moveHandler);
                $(document).off('mouseup touchend', stopDrag);
            };

            $(document).on('mousemove touchmove', moveHandler);
            $(document).on('mouseup touchend', stopDrag);
        };

        minThumb.on('mousedown touchstart', (e) => startDrag(e.originalEvent, 'min'));
        maxThumb.on('mousedown touchstart', (e) => startDrag(e.originalEvent, 'max'));

        updateSlider();
    }

    formatAmount(amount) {
        if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
        if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
        return amount.toString();
    }

    updateAmountLabels() {
        $('#expHistMinAmountLabel').text(`${this.state.filters.minAmount.toLocaleString('fr-FR')} FCFA`);
        $('#expHistMaxAmountLabel').text(`${this.state.filters.maxAmount.toLocaleString('fr-FR')} FCFA`);
    }

    /**
     * ============================================
     * ÉVÉNEMENTS
     * ============================================
     */
    setupEventListeners() {
        let searchTimeout;
        $('#expHistSearchInput').on('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.state.searchQuery = e.target.value;
                this.state.currentPage = 1;
                this.applyFilters();
            }, 500);
        });

        $('#expHistFilterToggleBtn').on('click', () => {
            this.toggleFilters();
        });

        $('#expHistStartDate').on('change', (e) => {
            this.state.filters.startDate = e.target.value;
            this.state.currentPage = 1;
            this.debouncedApplyFilters();
        });

        $('#expHistEndDate').on('change', (e) => {
            this.state.filters.endDate = e.target.value;
            this.state.currentPage = 1;
            this.debouncedApplyFilters();
        });

        $('#expHistBudgetFilter').on('change', (e) => {
            this.handleBudgetFilterChange(parseInt(e.target.value));
        });

        $('#expHistCategoryFilter').on('change', (e) => {
            this.state.filters.selectedCategory = parseInt(e.target.value);
            this.state.currentPage = 1;
            this.debouncedApplyFilters();
        });

        $('#expHistItemsPerPageSelect').on('change', (e) => {
            this.state.itemsPerPage = parseInt(e.target.value);
            this.state.currentPage = 1;
            this.applyFilters();
        });

        $('#expHistFirstPageBtn').on('click', () => this.goToPage(1));
        $('#expHistPrevPageBtn').on('click', () => {
            if (this.state.currentPage > 1) {
                this.goToPage(this.state.currentPage - 1);
            }
        });
        $('#expHistNextPageBtn').on('click', () => {
            const totalPages = Math.ceil(this.getFilteredExpenses().length / this.state.itemsPerPage);
            if (this.state.currentPage < totalPages) {
                this.goToPage(this.state.currentPage + 1);
            }
        });
        $('#expHistLastPageBtn').on('click', () => {
            const totalPages = Math.ceil(this.getFilteredExpenses().length / this.state.itemsPerPage);
            this.goToPage(totalPages);
        });

        $('#expHistClearFiltersBtn').on('click', () => this.clearFilters());

        $('#expHistCloseDetailModal').on('click', () => this.closeDetailModal());
        $('#expHistDetailModal').on('click', (e) => {
            if (e.target.id === 'expHistDetailModal') {
                this.closeDetailModal();
            }
        });
    }

    toggleFilters() {
        const panel = $('#expHistFiltersPanel');
        const btn = $('#expHistFilterToggleBtn');

        if (panel.hasClass('show')) {
            panel.removeClass('show');
            btn.removeClass('active');
        } else {
            panel.addClass('show');
            btn.addClass('active');
        }
    }

    clearFilters() {
        this.state.filters = {
            startDate: this.getFirstDayOfMonth(),
            endDate: new Date().toISOString().split('T')[0],
            selectedBudget: 0,
            selectedCategory: 0,
            minAmount: 0,
            maxAmount: 1000000
        };

        this.state.searchQuery = '';
        this.state.currentPage = 1;

        $('#expHistSearchInput').val('');
        $('#expHistStartDate').val(this.state.filters.startDate);
        $('#expHistEndDate').val(this.state.filters.endDate);
        $('#expHistBudgetFilter').val('0');
        $('#expHistCategoryFilter').val('0');

        this.populateCategoryFilter(this.categories);
        this.updateAmountLabels();

        $(this.state.minAmountThumb).css('left', '0%');
        $(this.state.maxAmountThumb).css('left', '100%');
        $('.exp-hist-slider-range').css({ left: '0%', width: '100%' });
        $('#expHistMinSliderValue').text('0');
        $('#expHistMaxSliderValue').text('1M');

        this.applyFilters();
    }

    hasActiveFilters() {
        return this.state.searchQuery ||
            this.state.filters.selectedBudget !== 0 ||
            this.state.filters.selectedCategory !== 0 ||
            this.state.filters.minAmount !== 0 ||
            this.state.filters.maxAmount !== 1000000 ||
            this.state.filters.startDate !== this.getFirstDayOfMonth() ||
            this.state.filters.endDate !== new Date().toISOString().split('T')[0];
    }

    goToPage(page) {
        this.state.currentPage = page;
        this.applyFilters();
    }

    getFirstDayOfMonth() {
        const date = new Date();
        date.setDate(1);
        return date.toISOString().split('T')[0];
    }

    /**
     * ============================================
     * MODAL DÉTAILS
     * ============================================
     */
    // viewExpenseDetail(id) {
    //     const expense = this.expenses.find(e => e.id === id);
    //     if (!expense) return;

    //     const category = this.categories.find(c => c.id === expense.id_categorie_depense);
    //     const budget = this.budgets.find(b => b.id === expense.IdBudget);
    //     const isRecurring = expense.is_repetitive === 1;
    //     const isActive = expense.status_is_repetitive === 0;

    //     const detailBody = $('#expHistDetailBody');
    //     detailBody.html(`
    //         <div class="exp-hist-detail-item">
    //             <div class="exp-hist-detail-icon" style="background-color: #ffc107;">
    //                 <i class="la la-tag"></i>
    //             </div>
    //             <div class="exp-hist-detail-content">
    //                 <span class="exp-hist-detail-label">Libellé</span>
    //                 <span class="exp-hist-detail-value">${expense.libelle}</span>
    //             </div>
    //         </div>

    //         <div class="exp-hist-detail-item">
    //             <div class="exp-hist-detail-icon" style="background-color: #dc3545;">
    //                <i class="bi bi-cash-stack"></i>
    //             </div>
    //             <div class="exp-hist-detail-content">
    //                 <span class="exp-hist-detail-label">Montant</span>
    //                 <span class="exp-hist-detail-value amount">${expense.montant.toLocaleString('fr-FR')} FCFA</span>
    //             </div>
    //         </div>

    //         <div class="exp-hist-detail-item">
    //             <div class="exp-hist-detail-icon" style="background-color: #6c757d;">
    //                 <i class="la la-list"></i>
    //             </div>
    //             <div class="exp-hist-detail-content">
    //                 <span class="exp-hist-detail-label">Catégorie</span>
    //                 <span class="exp-hist-detail-value">${category?.nom || 'Inconnue'}</span>
    //             </div>
    //         </div>

    //         <div class="exp-hist-detail-item">
    //             <div class="exp-hist-detail-icon" style="background-color: #0d6efd;">
    //                 <i class="la la-calendar"></i>
    //             </div>
    //             <div class="exp-hist-detail-content">
    //                 <span class="exp-hist-detail-label">Date</span>
    //                 <span class="exp-hist-detail-value">${this.formatDisplayDate(expense.created_at)}</span>
    //             </div>
    //         </div>

    //         ${budget ? `
    //             <div class="exp-hist-detail-item">
    //                 <div class="exp-hist-detail-icon" style="background-color: #ffc107;">
    //                      <i class="bi bi-wallet"></i>
    //                 </div>
    //                 <div class="exp-hist-detail-content">
    //                     <span class="exp-hist-detail-label">Budget</span>
    //                     <span class="exp-hist-detail-value">${budget.libelle}</span>
    //                 </div>
    //             </div>
    //         ` : ''}

    //         ${isRecurring ? `
    //             <div class="exp-hist-detail-item">
    //                 <div class="exp-hist-detail-icon" style="background-color: ${isActive ? '#198754' : '#dc3545'};">
    //                     <i class="la la-repeat"></i>
    //                 </div>
    //                 <div class="exp-hist-detail-content">
    //                     <span class="exp-hist-detail-label">Récurrence</span>
    //                     <span class="exp-hist-detail-value">${isActive ? 'Active' : 'Arrêtée'}</span>
    //                 </div>
    //             </div>
    //         ` : ''}
    //     `);

    //     $('#expHistDetailModal').addClass('show');
    // }

    /**
 * ============================================
 * MODAL DÉTAILS (style mobile-like)
 * ============================================
 */
viewExpenseDetail(id) {
    const expense = this.expenses.find(e => e.id === id);
    if (!expense) return;

    const category = this.categories.find(c => c.id === expense.id_categorie_depense);
    const budget = this.budgets.find(b => b.id === expense.IdBudget);
    const isRecurring = expense.is_repetitive === 1;
    const isActive = expense.status_is_repetitive === 0;

    const detailBody = $('#expHistDetailBody');

    // Construction du HTML avec image conditionnelle
    let htmlContent = `
       
    `;

    // Image (si disponible)
    if (expense.piece_jointe) {
        htmlContent += `
            <div class="exp-hist-detail-image-container">
                <img src="${expense.piece_jointe}" alt="Pièce jointe" class="exp-hist-detail-image">
            </div>
        `;
    }

    htmlContent += `<div class="exp-hist-detail-separator"></div>`;

    //  Informations principales
    htmlContent += `
        <div class="exp-hist-detail-section">
            <!-- Libellé -->
            <div class="exp-hist-detail-row">
                <div class="exp-hist-detail-icon" style="background-color: rgba(108, 117, 125, 0.1);">
                    <i class="la la-tag" style="color: #6c757d;"></i>
                </div>
                <div class="exp-hist-detail-text">
                    <span class="exp-hist-detail-label">Libellé :</span>
                    <span class="exp-hist-detail-value">${expense.libelle}</span>
                </div>
            </div>

            <!-- Montant -->
            <div class="exp-hist-detail-row">
                <div class="exp-hist-detail-icon" style="background-color: rgba(255, 193, 7, 0.1);">
                   <i class="bi bi-cash-stack"></i>
                </div>
                <div class="exp-hist-detail-text">
                    <span class="exp-hist-detail-label">Montant :</span>
                    <span class="exp-hist-detail-value exp-hist-detail-amount">${expense.montant.toLocaleString('fr-FR')} FCFA</span>
                </div>
            </div>

            <!-- Date -->
            <div class="exp-hist-detail-row">
                <div class="exp-hist-detail-icon" style="background-color: rgba(13, 110, 253, 0.1);">
                    <i class="la la-calendar" style="color: #0d6efd;"></i>
                </div>
                <div class="exp-hist-detail-text">
                    <span class="exp-hist-detail-label">Date :</span>
                    <span class="exp-hist-detail-value">${this.formatDisplayDate(expense.created_at)}</span>
                </div>
            </div>

            <!-- Catégorie -->
            ${category ? `
                <div class="exp-hist-detail-row">
                    <div class="exp-hist-detail-icon" style="background-color: ${category.color}15;">
                        <i class="la la-list" style="color: ${category.color};"></i>
                    </div>
                    <div class="exp-hist-detail-text">
                        <span class="exp-hist-detail-label">Catégorie :</span>
                        <span class="exp-hist-detail-value">${category.nom}</span>
                    </div>
                </div>
            ` : ''}

            <!-- Budget -->
            ${budget ? `
                <div class="exp-hist-detail-row">
                    <div class="exp-hist-detail-icon" style="background-color: rgba(255, 193, 7, 0.1);">
                        <i class="bi bi-wallet" style="color: #ffc107;"></i>
                    </div>
                    <div class="exp-hist-detail-text">
                        <span class="exp-hist-detail-label">Budget :</span>
                        <span class="exp-hist-detail-value">${budget.libelle}</span>
                    </div>
                </div>
            ` : ''}

            <!-- Cycle répétitif -->
            ${isRecurring ? `
                <div class="exp-hist-detail-row">
                    <div class="exp-hist-detail-icon" style="background-color: ${isActive ? 'rgba(25, 135, 84, 0.1)' : 'rgba(220, 53, 69, 0.1)'};">
                        <i class="la la-repeat" style="color: ${isActive ? '#198754' : '#dc3545'};"></i>
                    </div>
                    <div class="exp-hist-detail-text">
                        <span class="exp-hist-detail-label">Cycle :</span>
                        <span class="exp-hist-detail-value">
                            ${expense.date_debut || '?'} → ${expense.date_fin || '?'}
                            <span style="color: ${isActive ? '#198754' : '#dc3545'}; font-weight: 600; margin-left: 5px;">
                                (${isActive ? 'Actif' : 'Arrêté'})
                            </span>
                        </span>
                    </div>
                </div>
            ` : `
                <div class="exp-hist-detail-row">
                    <div class="exp-hist-detail-icon" style="background-color: rgba(220, 53, 69, 0.1);">
                        <i class="la la-times-circle" style="color: #dc3545;"></i>
                    </div>
                    <div class="exp-hist-detail-text">
                        <span class="exp-hist-detail-value" style="color: #6c757d; font-style: italic;">Aucun cycle répétitif</span>
                    </div>
                </div>
            `}
        </div>
    `;

    detailBody.html(htmlContent);
    $('#expHistDetailModal').addClass('show');
}

    closeDetailModal() {
        $('#expHistDetailModal').removeClass('show');
    }

    /**
     * ============================================
     * ACTIONS AVEC SWAL
     * ============================================
     */
    confirmDelete(id) {
        const expense = this.expenses.find(e => e.id === id);
        if (!expense) return;

        swal.fire({
            title: "Supprimer la dépense",
            text: `Êtes-vous sûr de vouloir supprimer "${expense.libelle}" ?`,
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn btn-danger",
            cancelButtonClass: "btn btn-secondary",
            confirmButtonText: "Supprimer",
            cancelButtonText: "Annuler"
        }).then((result) => {
            if (result.value) {
                this.deleteExpense(id);
            }
        });
    }

    async deleteExpense(id) {
        this.showSpinner('Suppression en cours...');

        $.ajax({
            url: "/expenses/delete",
            method: 'POST',
            dataType: "JSON",
            data: JSON.stringify({
                "_token": $('meta[name="csrf-token"]').attr('content'),
                "id": id
            }),
            contentType: "application/json",
            success: (response) => {
                this.hideSpinner();

                if (response.status === 1) {
                    this.expenses = this.expenses.filter(e => e.id !== id);

                    swal.fire({
                        "title": "Dépense supprimée",
                        "text": "La dépense a été supprimée avec succès.",
                        "type": "success",
                        "confirmButtonClass": "btn btn-secondary",
                        "onClose": () => {
                            this.closeDetailModal();
                            this.applyFilters();
                        }
                    });
                } else if (response.status === 0) {
                    swal.fire({
                        "title": response.err_title,
                        "text": response.err_msg,
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary"
                    });
                } else if (response.status === -1) {
                    window.location.href = "{{ route('spx.signin') }}";
                }
            },
            error: (error) => {
                this.hideSpinner();

                let responseText = error.responseJSON;
                swal.fire({
                    "title": responseText?.err_title || "Erreur",
                    "text": responseText?.err_msg || "Erreur lors de la suppression",
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary"
                });
            }
        });
    }

    confirmDuplicate(id) {
        const expense = this.expenses.find(e => e.id === id);
        if (!expense) return;

        swal.fire({
            title: "Dupliquer la dépense",
            text: `Voulez-vous dupliquer "${expense.libelle}" ?`,
            type: "info",
            showCancelButton: true,
            confirmButtonClass: "btn btn-primary",
            cancelButtonClass: "btn btn-secondary",
            confirmButtonText: "Dupliquer",
            cancelButtonText: "Annuler"
        }).then((result) => {
            if (result.value) {
                this.duplicateExpense(id);
            }
        });
    }

    async duplicateExpense(id) {
        this.showSpinner('Duplication en cours...');

        $.ajax({
            url: "/expenses/duplicate",
            method: 'POST',
            dataType: "JSON",
            data: JSON.stringify({
                "_token": $('meta[name="csrf-token"]').attr('content'),
                "id": id
            }),
            contentType: "application/json",
            success: (response) => {
                this.hideSpinner();

                if (response.status === 1) {
                    swal.fire({
                        "title": "Dépense dupliquée",
                        "text": "La dépense a été dupliquée avec succès.",
                        "type": "success",
                        "confirmButtonClass": "btn btn-secondary",
                        "onClose": () => {
                            this.closeDetailModal();
                            this.loadData();
                        }
                    });
                } else if (response.status === 0) {
                    swal.fire({
                        "title": response.err_title,
                        "text": response.err_msg,
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary"
                    });
                } else if (response.status === -1) {
                    window.location.href = "{{ route('spx.signin') }}";
                }
            },
            error: (error) => {
                this.hideSpinner();

                let responseText = error.responseJSON;
                swal.fire({
                    "title": responseText?.err_title || "Erreur",
                    "text": responseText?.err_msg || "Erreur lors de la duplication",
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary"
                });
            }
        });
    }

    confirmStopRecurring(id) {
        const expense = this.expenses.find(e => e.id === id);
        if (!expense) return;

        swal.fire({
            title: "Arrêter la récurrence",
            text: `Voulez-vous arrêter la récurrence de "${expense.libelle}" ?`,
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn btn-warning",
            cancelButtonClass: "btn btn-secondary",
            confirmButtonText: "Arrêter",
            cancelButtonText: "Annuler"
        }).then((result) => {
            if (result.value) {
                this.stopRecurring(id);
            }
        });
    }

    async stopRecurring(id) {
        this.showSpinner('Arrêt en cours...');

        $.ajax({
            url: "/expenses/stop-recurring",
            method: 'POST',
            dataType: "JSON",
            data: JSON.stringify({
                "_token": $('meta[name="csrf-token"]').attr('content'),
                "id": id
            }),
            contentType: "application/json",
            success: (response) => {
                this.hideSpinner();

                if (response.status === 1) {
                    const expense = this.expenses.find(e => e.id === id);
                    if (expense) {
                        expense.status_is_repetitive = 1;
                    }

                    swal.fire({
                        "title": "Récurrence arrêtée",
                        "text": "La récurrence a été arrêtée avec succès.",
                        "type": "success",
                        "confirmButtonClass": "btn btn-secondary",
                        "onClose": () => {
                            this.closeDetailModal();
                            this.applyFilters();
                        }
                    });
                } else if (response.status === 0) {
                    swal.fire({
                        "title": response.err_title,
                        "text": response.err_msg,
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary"
                    });
                } else if (response.status === -1) {
                    window.location.href = "{{ route('spx.signin') }}";
                }
            },
            error: (error) => {
                this.hideSpinner();

                let responseText = error.responseJSON;
                swal.fire({
                    "title": responseText?.err_title || "Erreur",
                    "text": responseText?.err_msg || "Erreur lors de l'arrêt",
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary"
                });
            }
        });
    }

    /**
     * ============================================
     * UTILITAIRES
     * ============================================
     */
    showSpinner(message = 'Chargement...') {
        $('#expHistSpinnerText').text(message);
      //  $('#expHistSpinnerOverlay').fadeIn(200);
         // Forcer display: flex pour le centrage
       $('#expHistSpinnerOverlay').css('display', 'flex').hide().fadeIn(200);
    }

    hideSpinner() {
        $('#expHistSpinnerOverlay').fadeOut(200);
    }
}

// Initialisation
let expensesHistory;

$(document).ready(function() {
    expensesHistory = new ExpensesHistory();
    window.expensesHistory = expensesHistory;
});
