class ExpenseList {
    constructor() {
        this.API_BASE_URL = 'http://localhost:3000/api';
        this.expenses = [];
        this.categories = [];
        this.budgets = [];

        // État de l'application
        this.state = {
            searchQuery: '',
            currentPage: 0,
            itemsPerPage: 25,
            totalItems: 0,
            filters: {
                startDate: this.getFirstDayOfMonth(),
                endDate: new Date().toISOString().split('T')[0],
                selectedBudget: 0,
                selectedCategory: 0,
                minAmount: 0,
                maxAmount: 1000000
            },
            activeFilters: {},
            isLoading: false,
            isFilterLoading: false,
            selectedExpense: null,
            pendingAction: null,
            pendingExpenseId: null,
            minAmountThumb: null,
            maxAmountThumb: null,
            isDragging: false,
            activeThumb: null
        };

        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.initDoubleSlider();
        this.render();
    }

    /**
     * ============================================
     * CHARGEMENT DES DONNÉES
     * ============================================
     */
    async loadData() {
        try {
            this.showSpinner('Chargement des données...');

            // Simulation des données
            await this.simulateApiCalls();

            this.populateFilters();
            this.applyFilters();

        } catch (error) {
            console.error('Erreur de chargement:', error);
            this.showToast('Erreur lors du chargement des données', 'error');
        } finally {
            this.hideSpinner();
        }
    }

    simulateApiCalls() {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Données de démo pour les catégories avec couleurs
                this.categories = [
                    { id: 1, nom: 'Nourriture' },
                    { id: 2, nom: 'Transport' },
                    { id: 3, nom: 'Logement' },
                    { id: 4, nom: 'Loisirs' },
                    { id: 5, nom: 'Santé' },
                    { id: 6, nom: 'Éducation' },
                    { id: 7, nom: 'Shopping' },
                    { id: 8, nom: 'Restaurant' },
                    { id: 9, nom: 'Voyage' },
                    { id: 10, nom: 'Épargne' }
                ];


                // Données de démo pour les budgets
                this.budgets = [
                    { id: 1, libelle: 'Budget Maison', categories: [1, 2, 3] },
                    { id: 2, libelle: 'Budget Transport', categories: [2] },
                    { id: 3, libelle: 'Budget Loisirs', categories: [4, 5] },
                    { id: 4, libelle: 'Budget Courses', categories: [1, 7, 8] },
                    { id: 5, libelle: 'Budget Santé', categories: [5] },
                    { id: 6, libelle: 'Budget Éducation', categories: [6] }
                ];

                // Génération de données de démo pour les dépenses
                this.expenses = this.generateDemoExpenses(150);

                resolve();
            }, 1500);
        });
    }

    generateDemoExpenses(count) {
        const expenses = [];
        const categories = this.categories;
        const budgets = this.budgets;

        for (let i = 1; i <= count; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const budget = budgets[Math.floor(Math.random() * budgets.length)];
            const amount = Math.floor(Math.random() * 100000) + 1000;
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 90));

            const isRecurring = Math.random() > 0.7;
            const recurringStatus = isRecurring ? (Math.random() > 0.3 ? 0 : 1) : null;

            expenses.push({
                id: i,
                libelle: `Dépense ${i} - ${category.nom}`,
                montant: amount,
                id_categorie_depense: category.id,
                IdBudget: budget.id,
                created_at: date.toISOString().split('T')[0],
                is_repetitive: isRecurring ? 1 : 0,
                status_is_repetitive: recurringStatus,
                piece_jointe: Math.random() > 0.9 ? 'data:image/png;base64,...' : null
            });
        }

        // Trier par date décroissante
        return expenses.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    getFirstDayOfMonth() {
        const date = new Date();
        date.setDate(1);
        return date.toISOString().split('T')[0];
    }

    /**
     * ============================================
     * DOUBLE SLIDER POUR MONTANT
     * ============================================
     */
    initDoubleSlider() {
        const container = document.getElementById('amountSliderContainer');
        const track = container.querySelector('.slider-track');
        const range = container.querySelector('.slider-range');
        const minThumb = container.querySelector('#minSliderThumb');
        const maxThumb = container.querySelector('#maxSliderThumb');
        const minValue = container.querySelector('#minSliderValue');
        const maxValue = container.querySelector('#maxSliderValue');

        this.state.minAmountThumb = minThumb;
        this.state.maxAmountThumb = maxThumb;

        const updateSlider = () => {
            const minPercent = (this.state.filters.minAmount / 1000000) * 100;
            const maxPercent = (this.state.filters.maxAmount / 1000000) * 100;

            // Mettre à jour la plage
            range.style.left = `${minPercent}%`;
            range.style.width = `${maxPercent - minPercent}%`;

            // Mettre à jour les curseurs
            minThumb.style.left = `${minPercent}%`;
            maxThumb.style.left = `${maxPercent}%`;

            // Mettre à jour les valeurs affichées
            minValue.textContent = this.formatAmount(this.state.filters.minAmount);
            maxValue.textContent = this.formatAmount(this.state.filters.maxAmount);
        };

        const startDrag = (e, thumbType) => {
            e.preventDefault();
            this.state.isDragging = true;
            this.state.activeThumb = thumbType;

            const moveHandler = (e) => {
                if (!this.state.isDragging) return;

                const rect = track.getBoundingClientRect();
                const x = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
                let percent = ((x - rect.left) / rect.width) * 100;
                percent = Math.max(0, Math.min(100, percent));

                const value = Math.round((percent / 100) * 1000000);

                if (this.state.activeThumb === 'min') {
                    if (value < this.state.filters.maxAmount) {
                        this.state.filters.minAmount = value;
                        document.getElementById('minAmountInput').value = value;
                    }
                } else {
                    if (value > this.state.filters.minAmount) {
                        this.state.filters.maxAmount = value;
                        document.getElementById('maxAmountInput').value = value;
                    }
                }

                updateSlider();
                this.updateAmountLabels(this.state.filters.minAmount, this.state.filters.maxAmount);
                this.updateActiveFilters();
                this.applyFilters();
            };

            const stopDrag = () => {
                this.state.isDragging = false;
                this.state.activeThumb = null;
                document.removeEventListener('mousemove', moveHandler);
                document.removeEventListener('touchmove', moveHandler);
                document.removeEventListener('mouseup', stopDrag);
                document.removeEventListener('touchend', stopDrag);
            };

            document.addEventListener('mousemove', moveHandler);
            document.addEventListener('touchmove', moveHandler);
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
        };

        // Événements pour les curseurs
        minThumb.addEventListener('mousedown', (e) => startDrag(e, 'min'));
        maxThumb.addEventListener('mousedown', (e) => startDrag(e, 'max'));
        minThumb.addEventListener('touchstart', (e) => startDrag(e, 'min'));
        maxThumb.addEventListener('touchstart', (e) => startDrag(e, 'max'));

        // Initialiser le slider
        updateSlider();
    }

    formatAmount(amount) {
        if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
        if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
        return amount.toString();
    }

    /**
     * ============================================
     * CONFIGURATION DES ÉVÉNEMENTS
     * ============================================
     */
    setupEventListeners() {
        // Barre de recherche avec debounce
        let searchTimeout;
        document.getElementById('searchInput').addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.handleSearch(e.target.value);
            }, 300);
        });

        // Toggle des filtres
        document.getElementById('filterToggleBtn').addEventListener('click', () => {
            this.toggleFilters();
        });

        // Filtres - Temps réel
        document.getElementById('startDate').addEventListener('change', (e) => {
            this.state.filters.startDate = e.target.value;
            this.updateActiveFilters();
            this.applyFilters();
        });

        document.getElementById('endDate').addEventListener('change', (e) => {
            this.state.filters.endDate = e.target.value;
            this.updateActiveFilters();
            this.applyFilters();
        });

        document.getElementById('budgetFilter').addEventListener('change', (e) => {
            this.handleBudgetFilterChange(e.target.value);
            this.applyFilters();
        });

        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.state.filters.selectedCategory = parseInt(e.target.value);
            this.updateActiveFilters();
            this.applyFilters();
        });

        // Inputs de montant
        const minAmountInput = document.getElementById('minAmountInput');
        const maxAmountInput = document.getElementById('maxAmountInput');

        let amountTimeout;

        const updateAmountFilter = () => {
            const min = parseInt(minAmountInput.value) || 0;
            const max = parseInt(maxAmountInput.value) || 1000000;

            if (min < 0 || min > 1000000 || max < 0 || max > 1000000) return;

            if (min <= max) {
                this.state.filters.minAmount = Math.min(min, 1000000);
                this.state.filters.maxAmount = Math.min(max, 1000000);

                // Mettre à jour le slider
                const minPercent = (this.state.filters.minAmount / 1000000) * 100;
                const maxPercent = (this.state.filters.maxAmount / 1000000) * 100;

                if (this.state.minAmountThumb && this.state.maxAmountThumb) {
                    this.state.minAmountThumb.style.left = `${minPercent}%`;
                    this.state.maxAmountThumb.style.left = `${maxPercent}%`;

                    const range = document.querySelector('.slider-range');
                    range.style.left = `${minPercent}%`;
                    range.style.width = `${maxPercent - minPercent}%`;

                    // Mettre à jour les valeurs affichées
                    document.getElementById('minSliderValue').textContent = this.formatAmount(this.state.filters.minAmount);
                    document.getElementById('maxSliderValue').textContent = this.formatAmount(this.state.filters.maxAmount);
                }

                this.updateAmountLabels(this.state.filters.minAmount, this.state.filters.maxAmount);
                this.updateActiveFilters();
                this.applyFilters();
            }
        };

        minAmountInput.addEventListener('input', () => {
            clearTimeout(amountTimeout);
            amountTimeout = setTimeout(updateAmountFilter, 300);
        });

        maxAmountInput.addEventListener('input', () => {
            clearTimeout(amountTimeout);
            amountTimeout = setTimeout(updateAmountFilter, 300);
        });

        // Bouton effacer les filtres
        document.getElementById('clearFiltersBtn').addEventListener('click', () => {
            this.clearFilters();
        });

        // Pagination
        document.getElementById('itemsPerPageSelect').addEventListener('change', (e) => {
            this.handleItemsPerPageChange(e.target.value);
        });

        document.getElementById('firstPageBtn').addEventListener('click', () => {
            this.handlePageChange(0);
        });

        document.getElementById('prevPageBtn').addEventListener('click', () => {
            this.handlePageChange(this.state.currentPage - 1);
        });

        document.getElementById('nextPageBtn').addEventListener('click', () => {
            this.handlePageChange(this.state.currentPage + 1);
        });

        document.getElementById('lastPageBtn').addEventListener('click', () => {
            const totalPages = Math.ceil(this.state.totalItems / this.state.itemsPerPage);
            this.handlePageChange(totalPages - 1);
        });

        // Modals
        document.getElementById('closeDetailModal').addEventListener('click', () => {
            this.closeExpenseDetail();
        });

        document.getElementById('ajaxModalClose').addEventListener('click', () => {
            this.closeAjaxModal();
        });

        document.getElementById('ajaxModalCancelBtn').addEventListener('click', () => {
            this.closeAjaxModal();
        });

        document.getElementById('ajaxModalConfirmBtn').addEventListener('click', () => {
            this.executePendingAction();
        });

        // Fermer les modals en cliquant à l'extérieur
        document.getElementById('expenseDetailModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeExpenseDetail();
            }
        });

        document.getElementById('ajaxModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeAjaxModal();
            }
        });
    }

    /**
     * ============================================
     * GESTION DE L'UI
     * ============================================
     */
    render() {
        this.renderExpenses();
        this.updatePagination();
        this.updateCounts();
    }

    renderExpenses() {
        const listContainer = document.getElementById('expenseList');
        const emptyState = document.getElementById('emptyState');
        const emptyStateMessage = document.getElementById('emptyStateMessage');
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        const listLoading = document.getElementById('listLoading');
        const paginationContainer = document.getElementById('paginationContainer');

        // Afficher le loading pendant le filtrage
        if (this.state.isFilterLoading) {
            listLoading.style.display = 'flex';
        }

        // Filtrer les dépenses
        const filteredExpenses = this.getFilteredExpenses();
        this.state.totalItems = filteredExpenses.length;

        // Pagination
        const start = this.state.currentPage * this.state.itemsPerPage;
        const end = start + this.state.itemsPerPage;
        const paginatedExpenses = filteredExpenses.slice(start, end);

        // Mettre à jour les informations de pagination
        this.updateSelectorInfo();

        if (paginatedExpenses.length === 0) {
            listContainer.innerHTML = '';
            emptyState.style.display = 'block';
            paginationContainer.style.display = 'none';
            listLoading.style.display = 'none';

            const hasFilters = this.state.searchQuery ||
                this.state.filters.selectedBudget !== 0 ||
                this.state.filters.selectedCategory !== 0 ||
                this.state.filters.minAmount !== 0 ||
                this.state.filters.maxAmount !== 1000000 ||
                this.state.filters.startDate !== this.getFirstDayOfMonth() ||
                this.state.filters.endDate !== new Date().toISOString().split('T')[0];

            if (hasFilters) {
                emptyStateMessage.textContent = 'Aucune dépense ne correspond à vos critères de recherche';
                clearFiltersBtn.style.display = 'inline-flex';
            } else {
                emptyStateMessage.textContent = 'Aucune dépense enregistrée';
                clearFiltersBtn.style.display = 'none';
            }

            return;
        }

        emptyState.style.display = 'none';
        paginationContainer.style.display = 'flex';
        listLoading.style.display = 'none';

        // Générer les items de dépense
        listContainer.innerHTML = paginatedExpenses.map(expense => {
            const category = this.categories.find(c => c.id === expense.id_categorie_depense);
            const budget = this.budgets.find(b => b.id === expense.IdBudget);
            const isRecurring = expense.is_repetitive === 1;
            const isActive = expense.status_is_repetitive === 0;

            return `
                <div class="expense-item ${isRecurring ? 'recurring' : ''}" data-id="${expense.id}">
                    <div class="expense-item-content">
                        <div class="expense-info">
                            <div class="expense-header">
                                <h3 class="expense-label">${expense.libelle}</h3>
                                <div class="expense-amount">- ${expense.montant.toLocaleString('fr-FR')} FCFA</div>
                            </div> 
                            <div class="expense-details-actions">
                                <div class="expense-details">
                                    <span>${new Date(expense.created_at).toLocaleDateString('fr-FR')}</span>
                                    <span>•</span>
                                    <span>${category?.nom || 'Inconnue'}</span>
                                </div>
                                <div class="expense-actions">
                                    ${isRecurring && isActive ? `
                                        <button class="expense-btn btn-stop" onclick="expenseList.showStopRecurringModal(${expense.id})" title="Arrêter la récurrence">
                                            <i class="bi bi-arrow-repeat"></i>
                                        </button>
                                    ` : ''}
                                    <button class="expense-btn btn-duplicate" onclick="expenseList.showDuplicateModal(${expense.id})" title="Dupliquer">
                                        <i class="bi bi-files"></i>
                                    </button>
                                    <button class="expense-btn btn-delete" onclick="expenseList.showDeleteModal(${expense.id})" title="Supprimer">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Ajouter les événements de clic sur les items
        listContainer.querySelectorAll('.expense-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // Ne pas déclencher si on clique sur un bouton d'action
                if (!e.target.closest('.expense-btn')) {
                    const expenseId = parseInt(item.dataset.id);
                    this.viewExpenseDetail(expenseId);
                }
            });
        });
    }

    updateSelectorInfo() {
        const start = this.state.currentPage * this.state.itemsPerPage + 1;
        const end = Math.min(start + this.state.itemsPerPage - 1, this.state.totalItems);

        document.getElementById('selectorInfoText').textContent =
            `Dépenses ${start} à ${end} sur ${this.state.totalItems}`;
    }

    updatePagination() {
        const totalPages = Math.ceil(this.state.totalItems / this.state.itemsPerPage);

        // Mettre à jour les informations
        document.getElementById('currentPage').textContent = this.state.currentPage + 1;
        document.getElementById('totalPages').textContent = totalPages;

        // Mettre à jour les boutons de page
        document.getElementById('firstPageBtn').disabled = this.state.currentPage === 0;
        document.getElementById('prevPageBtn').disabled = this.state.currentPage === 0;
        document.getElementById('nextPageBtn').disabled = this.state.currentPage >= totalPages - 1;
        document.getElementById('lastPageBtn').disabled = this.state.currentPage >= totalPages - 1;
    }

    updateCounts() {
        const expenseCount = document.getElementById('expenseCount');
        const filteredCount = this.getFilteredExpenses().length;

        expenseCount.textContent = filteredCount;
    }

    populateFilters() {
        // Budgets
        const budgetFilter = document.getElementById('budgetFilter');
        budgetFilter.innerHTML = '<option value="0">Tous les budgets</option>';

        this.budgets.forEach(budget => {
            const option = document.createElement('option');
            option.value = budget.id;
            option.textContent = budget.libelle;
            budgetFilter.appendChild(option);
        });

        // Catégories
        const categoryFilter = document.getElementById('categoryFilter');
        categoryFilter.innerHTML = '<option value="0">Toutes les catégories</option>';

        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.nom;
            option.dataset.color = category.color;
            option.dataset.icon = category.icon;
            categoryFilter.appendChild(option);
        });

        // Dates
        document.getElementById('startDate').value = this.state.filters.startDate;
        document.getElementById('endDate').value = this.state.filters.endDate;

        // Montant
        document.getElementById('minAmountInput').value = this.state.filters.minAmount;
        document.getElementById('maxAmountInput').value = this.state.filters.maxAmount;
        this.updateAmountLabels(this.state.filters.minAmount, this.state.filters.maxAmount);
    }

    updateAmountLabels(min, max) {
        document.getElementById('minAmountLabel').textContent = `${min.toLocaleString('fr-FR')} FCFA`;
        document.getElementById('maxAmountLabel').textContent = `${max.toLocaleString('fr-FR')} FCFA`;
    }

    /**
     * ============================================
     * MODALS AJAX POUR LES CONFIRMATIONS
     * ============================================
     */
    showAjaxModal(config) {
        const {
            type = 'warning',
            title = 'Confirmation',
            message = 'Êtes-vous sûr de vouloir effectuer cette action ?',
            confirmText = 'Confirmer',
            cancelText = 'Annuler',
            icon = 'bi-question-circle',
            onConfirm = null,
            onCancel = null,
            data = null
        } = config;

        this.state.pendingAction = onConfirm;
        this.state.pendingData = data;

        const modal = document.getElementById('ajaxModal');
        const header = document.getElementById('ajaxModalHeader');
        const iconElement = document.getElementById('ajaxModalIcon');
        const mainTitle = document.getElementById('ajaxModalMainTitle');
        const messageElement = document.getElementById('ajaxModalMessage');
        const confirmBtn = document.getElementById('ajaxModalConfirmBtn');
        const cancelBtn = document.getElementById('ajaxModalCancelBtn');
        const closeBtn = document.getElementById('ajaxModalClose');

        const typeClasses = {
            warning: { header: 'warning', icon: 'warning', btn: 'warning' },
            danger: { header: 'danger', icon: 'danger', btn: 'danger' },
            success: { header: 'success', icon: 'success', btn: 'success' },
            info: { header: '', icon: 'info', btn: '' }
        };

        const classes = typeClasses[type] || typeClasses.warning;

        header.className = 'ajax-modal-header';
        iconElement.className = 'ajax-modal-icon';
        confirmBtn.className = 'ajax-modal-btn ajax-modal-btn-confirm';
        closeBtn.className = 'ajax-modal-close';

        if (classes.header) header.classList.add(classes.header);
        if (classes.icon) iconElement.classList.add(classes.icon);
        if (classes.btn) confirmBtn.classList.add(classes.btn);
        if (classes.header) closeBtn.classList.add(classes.header);

        document.getElementById('ajaxModalTitle').textContent = title;
        mainTitle.textContent = title;
        messageElement.textContent = message;
        confirmBtn.textContent = confirmText;
        cancelBtn.textContent = cancelText;

        iconElement.innerHTML = `<i class="bi ${icon}"></i>`;

        modal.classList.add('show');
    }

    closeAjaxModal() {
        const modal = document.getElementById('ajaxModal');
        modal.classList.remove('show');

        this.state.pendingAction = null;
        this.state.pendingData = null;
        this.state.pendingExpenseId = null;
    }

    executePendingAction() {
        if (this.state.pendingAction) {
            this.state.pendingAction(this.state.pendingData);
        }
        this.closeAjaxModal();
    }

    showDeleteModal(expenseId) {
        const expense = this.expenses.find(e => e.id === expenseId);
        if (!expense) return;

        this.state.pendingExpenseId = expenseId;

        this.showAjaxModal({
            type: 'warning',
            title: 'Supprimer la dépense',
            message: `Êtes-vous sûr de vouloir supprimer la dépense "${expense.libelle}" ? Cette action est irréversible.`,
            confirmText: 'Supprimer',
            icon: 'bi-exclamation-triangle',
            onConfirm: () => this.deleteExpense(expenseId),
            data: expenseId
        });
    }

    showStopRecurringModal(expenseId) {
        const expense = this.expenses.find(e => e.id === expenseId);
        if (!expense) return;

        this.state.pendingExpenseId = expenseId;

        this.showAjaxModal({
            type: 'warning',
            title: 'Arrêter la récurrence',
            message: `Êtes-vous sûr de vouloir arrêter la récurrence de la dépense "${expense.libelle}" ?`,
            confirmText: 'Arrêter',
            icon: 'bi-pause-circle',
            onConfirm: () => this.stopRecurring(expenseId),
            data: expenseId
        });
    }

    showDuplicateModal(expenseId) {
        const expense = this.expenses.find(e => e.id === expenseId);
        if (!expense) return;

        this.state.pendingExpenseId = expenseId;

        this.showAjaxModal({
            type: 'info',
            title: 'Dupliquer la dépense',
            message: `Voulez-vous dupliquer la dépense "${expense.libelle}" ?`,
            confirmText: 'Dupliquer',
            icon: 'bi-copy',
            onConfirm: () => this.duplicateExpense(expenseId),
            data: expenseId
        });
    }

    /**
     * ============================================
     * FILTRAGE ET RECHERCHE (TEMPS RÉEL)
     * ============================================
     */
    getFilteredExpenses() {
        return this.expenses.filter(expense => {
            // Recherche texte
            if (this.state.searchQuery &&
                !expense.libelle.toLowerCase().includes(this.state.searchQuery.toLowerCase())) {
                return false;
            }

            // Filtre par date
            const expenseDate = new Date(expense.created_at);
            const startDate = new Date(this.state.filters.startDate);
            const endDate = new Date(this.state.filters.endDate);
            endDate.setHours(23, 59, 59, 999);

            if (expenseDate < startDate || expenseDate > endDate) {
                return false;
            }

            // Filtre par budget
            if (this.state.filters.selectedBudget !== 0 &&
                expense.IdBudget !== this.state.filters.selectedBudget) {
                return false;
            }

            // Filtre par catégorie
            if (this.state.filters.selectedCategory !== 0 &&
                expense.id_categorie_depense !== this.state.filters.selectedCategory) {
                return false;
            }

            // Filtre par montant
            if (expense.montant < this.state.filters.minAmount ||
                expense.montant > this.state.filters.maxAmount) {
                return false;
            }

            return true;
        });
    }

    handleBudgetFilterChange(budgetId) {
        const budgetIdNum = parseInt(budgetId);
        this.state.filters.selectedBudget = budgetIdNum;

        // Filtrer les catégories selon le budget sélectionné
        const categoryFilter = document.getElementById('categoryFilter');

        if (budgetIdNum === 0) {
            // Toutes les catégories
            categoryFilter.innerHTML = '<option value="0">Toutes les catégories</option>';
            this.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.nom;
                option.dataset.color = category.color;
                option.dataset.icon = category.icon;
                categoryFilter.appendChild(option);
            });
        } else {
            // Catégories du budget sélectionné
            const budget = this.budgets.find(b => b.id === budgetIdNum);
            categoryFilter.innerHTML = '<option value="0">Toutes les catégories</option>';

            if (budget && budget.categories) {
                budget.categories.forEach(categoryId => {
                    const category = this.categories.find(c => c.id === categoryId);
                    if (category) {
                        const option = document.createElement('option');
                        option.value = category.id;
                        option.textContent = category.nom;
                        option.dataset.color = category.color;
                        option.dataset.icon = category.icon;
                        categoryFilter.appendChild(option);
                    }
                });
            }
        }

        // Réinitialiser la catégorie sélectionnée si elle n'est pas disponible
        const availableCategoryIds = Array.from(categoryFilter.options).map(opt => parseInt(opt.value));
        if (!availableCategoryIds.includes(this.state.filters.selectedCategory)) {
            this.state.filters.selectedCategory = 0;
            categoryFilter.value = '0';
        }

        this.updateActiveFilters();
    }

    updateActiveFilters() {
        const activeFilters = [];
        const activeFiltersContainer = document.getElementById('activeFilters');
        const filterCountBadge = document.getElementById('activeFilterCount');

        // Vérifier chaque filtre
        if (this.state.filters.startDate !== this.getFirstDayOfMonth() ||
            this.state.filters.endDate !== new Date().toISOString().split('T')[0]) {
            activeFilters.push({
                type: 'date',
                label: `Période: ${new Date(this.state.filters.startDate).toLocaleDateString('fr-FR')} - ${new Date(this.state.filters.endDate).toLocaleDateString('fr-FR')}`
            });
        }

        if (this.state.filters.selectedBudget !== 0) {
            const budget = this.budgets.find(b => b.id === this.state.filters.selectedBudget);
            if (budget) {
                activeFilters.push({
                    type: 'budget',
                    label: `Budget: ${budget.libelle}`
                });
            }
        }

        if (this.state.filters.selectedCategory !== 0) {
            const category = this.categories.find(c => c.id === this.state.filters.selectedCategory);
            if (category) {
                activeFilters.push({
                    type: 'category',
                    label: `Catégorie: ${category.nom}`
                });
            }
        }

        if (this.state.filters.minAmount !== 0 || this.state.filters.maxAmount !== 1000000) {
            activeFilters.push({
                type: 'amount',
                label: `Montant: ${this.state.filters.minAmount.toLocaleString('fr-FR')} - ${this.state.filters.maxAmount.toLocaleString('fr-FR')} FCFA`
            });
        }

        // // Afficher/masquer le conteneur
        // if (activeFilters.length > 0) {
        //     activeFiltersContainer.style.display = 'flex';
        //     filterCountBadge.style.display = 'inline';
        //     filterCountBadge.textContent = activeFilters.length;

        //     // Générer les tags
        //     activeFiltersContainer.innerHTML = activeFilters.map(filter => `
        //         <div class="filter-tag">
        //             ${filter.label}
        //             <span class="remove" onclick="expenseList.removeFilter('${filter.type}')">
        //                 <i class="bi bi-x"></i>
        //             </span>
        //         </div>
        //     `).join('');
        // } else {
        //     activeFiltersContainer.style.display = 'none';
        //     filterCountBadge.style.display = 'none';
        // }

        // Mettre à jour l'état
        this.state.activeFilters = activeFilters.reduce((acc, filter) => {
            acc[filter.type] = true;
            return acc;
        }, {});
    }

    removeFilter(filterType) {
        switch (filterType) {
            case 'date':
                this.state.filters.startDate = this.getFirstDayOfMonth();
                this.state.filters.endDate = new Date().toISOString().split('T')[0];
                document.getElementById('startDate').value = this.state.filters.startDate;
                document.getElementById('endDate').value = this.state.filters.endDate;
                break;
            case 'budget':
                this.state.filters.selectedBudget = 0;
                document.getElementById('budgetFilter').value = '0';
                this.handleBudgetFilterChange('0');
                break;
            case 'category':
                this.state.filters.selectedCategory = 0;
                document.getElementById('categoryFilter').value = '0';
                break;
            case 'amount':
                this.state.filters.minAmount = 0;
                this.state.filters.maxAmount = 1000000;
                document.getElementById('minAmountInput').value = 0;
                document.getElementById('maxAmountInput').value = 1000000;

                // Mettre à jour le slider
                const minPercent = 0;
                const maxPercent = 100;

                if (this.state.minAmountThumb && this.state.maxAmountThumb) {
                    this.state.minAmountThumb.style.left = `${minPercent}%`;
                    this.state.maxAmountThumb.style.left = `${maxPercent}%`;

                    const range = document.querySelector('.slider-range');
                    range.style.left = `${minPercent}%`;
                    range.style.width = `${maxPercent - minPercent}%`;

                    document.getElementById('minSliderValue').textContent = '0';
                    document.getElementById('maxSliderValue').textContent = '1M';
                }

                this.updateAmountLabels(0, 1000000);
                break;
        }

        this.updateActiveFilters();
        this.applyFilters();
    }

    /**
     * ============================================
     * GESTION DES ÉVÉNEMENTS
     * ============================================
     */
    toggleFilters() {
        const filtersPanel = document.getElementById('filtersPanel');
        const filterBtn = document.getElementById('filterToggleBtn');

        if (filtersPanel.classList.contains('show')) {
            filtersPanel.classList.remove('show');
            filterBtn.classList.remove('active');
        } else {
            filtersPanel.classList.add('show');
            filterBtn.classList.add('active');
        }
    }

    handleSearch(query) {
        this.state.searchQuery = query;
        this.state.currentPage = 0;
        this.applyFilters();
    }

    applyFilters() {
        this.showListLoading();

        // Simuler un délai de filtrage
        setTimeout(() => {
            this.renderExpenses();
            this.updatePagination();
            this.updateCounts();
            this.hideListLoading();
        }, 300);
    }

    clearFilters() {
        // Réinitialiser les filtres
        this.state.filters = {
            startDate: this.getFirstDayOfMonth(),
            endDate: new Date().toISOString().split('T')[0],
            selectedBudget: 0,
            selectedCategory: 0,
            minAmount: 0,
            maxAmount: 1000000
        };

        this.state.searchQuery = '';
        this.state.currentPage = 0;

        // Réinitialiser l'UI
        document.getElementById('searchInput').value = '';
        document.getElementById('startDate').value = this.state.filters.startDate;
        document.getElementById('endDate').value = this.state.filters.endDate;
        document.getElementById('budgetFilter').value = '0';
        document.getElementById('categoryFilter').value = '0';
        document.getElementById('minAmountInput').value = 0;
        document.getElementById('maxAmountInput').value = 1000000;

        // Réinitialiser les filtres de catégories
        this.handleBudgetFilterChange('0');

        // Réinitialiser le slider
        const minPercent = 0;
        const maxPercent = 100;

        if (this.state.minAmountThumb && this.state.maxAmountThumb) {
            this.state.minAmountThumb.style.left = `${minPercent}%`;
            this.state.maxAmountThumb.style.left = `${maxPercent}%`;

            const range = document.querySelector('.slider-range');
            range.style.left = `${minPercent}%`;
            range.style.width = `${maxPercent - minPercent}%`;

            document.getElementById('minSliderValue').textContent = '0';
            document.getElementById('maxSliderValue').textContent = '1M';
        }

        this.updateAmountLabels(0, 1000000);
        this.updateActiveFilters();
        this.applyFilters();
    }

    handleItemsPerPageChange(value) {
        this.state.itemsPerPage = parseInt(value);
        this.state.currentPage = 0;
        this.applyFilters();
    }

    handlePageChange(page) {
        const totalPages = Math.ceil(this.state.totalItems / this.state.itemsPerPage);

        if (page >= 0 && page < totalPages) {
            this.state.currentPage = page;
            this.renderExpenses();
            this.updatePagination();
        }
    }

    /**
     * ============================================
     * MODAL DÉTAILS (correspond à React Native)
     * ============================================
     */
    viewExpenseDetail(expenseId) {
        const expense = this.expenses.find(e => e.id === expenseId);
        if (!expense) return;

        this.state.selectedExpense = expense;
        const category = this.categories.find(c => c.id === expense.id_categorie_depense);
        const budget = this.budgets.find(b => b.id === expense.IdBudget);
        const isRecurring = expense.is_repetitive === 1;
        const isActive = expense.status_is_repetitive === 0;

        const detailBody = document.getElementById('expenseDetailBody');
        detailBody.innerHTML = `
            <div class="detail-section">
                <div class="detail-item">
                    <div class="detail-icon" style="background-color: ${category?.color || '#6c757d'}">
                        <i class="bi bi-receipt"></i>
                    </div>
                    <div class="detail-content">
                        <span class="detail-label">Libelle</span>
                        <span class="detail-value">${expense.libelle}</span>
                    </div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-icon" style="background-color: var(--yellow_color)">
                        <i class="bi bi-cash-stack"></i>
                    </div>
                    <div class="detail-content">
                        <span class="detail-label">Montant</span>
                        <span class="detail-value amount-value">${expense.montant.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-icon" style="background-color: ${category?.color || '#6c757d'}">
                        <i class="bi ${category?.icon || 'bi-tag'}"></i>
                    </div>
                    <div class="detail-content">
                        <span class="detail-label">Catégorie</span>
                        <span class="detail-value">${category?.nom || 'Inconnue'}</span>
                    </div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-icon" style="background-color: var(--blue-color)">
                        <i class="bi bi-calendar"></i>
                    </div>
                    <div class="detail-content">
                        <span class="detail-label">Date</span>
                        <span class="detail-value">${new Date(expense.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                </div>
                
                ${budget ? `
                    <div class="detail-item">
                        <div class="detail-icon" style="background-color: var(--yellow_color)">
                            <i class="bi bi-wallet"></i>
                        </div>
                        <div class="detail-content">
                            <span class="detail-label">Budget</span>
                            <span class="detail-value">${budget.libelle}</span>
                        </div>
                    </div>
                ` : ''}
                
                ${isRecurring ? `
                    <div class="detail-item">
                        <div class="detail-icon" style="background-color: ${isActive ? 'var(--green-color)' : 'var(--danger-color)'}">
                            <i class="bi bi-arrow-repeat"></i>
                        </div>
                        <div class="detail-content">
                            <span class="detail-label">Cycle récurrent</span>
                            <span class="detail-value">
                                ${isActive ? 'Actif' : 'Arrêté/Terminé'}
                                <span class="cycle-status ${isActive ? 'active' : 'inactive'}">
                                    ${isActive ? 'Active' : 'Inactive'}
                                </span>
                            </span>
                        </div>
                    </div>
                ` : `
                    <div class="detail-item">
                        <div class="detail-icon" style="background-color: var(--danger-color)">
                            <i class="bi bi-x-circle"></i>
                        </div>
                        <div class="detail-content">
                            <span class="detail-label">Cycle récurrent</span>
                            <span class="detail-value">Pas de cycle récurrent</span>
                        </div>
                    </div>
                `}
            </div>
        `;

        document.getElementById('expenseDetailModal').classList.add('show');
    }

    closeExpenseDetail() {
        document.getElementById('expenseDetailModal').classList.remove('show');
        this.state.selectedExpense = null;
    }

    /**
     * ============================================
     * GESTION DES DÉPENSES (AJAX)
     * ============================================
     */
    async deleteExpense(expenseId) {
        try {
            this.showSpinner('Suppression en cours...');

            const success = await this.ajaxCall('DELETE', `${this.API_BASE_URL}/expenses/${expenseId}`);

            if (success) {
                this.expenses = this.expenses.filter(e => e.id !== expenseId);

                this.showToast('Dépense supprimée avec succès', 'success');
                this.applyFilters();
                this.closeExpenseDetail();
            } else {
                this.showToast('Erreur lors de la suppression', 'error');
            }

        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            this.showToast('Erreur lors de la suppression', 'error');
        } finally {
            this.hideSpinner();
        }
    }

    async stopRecurring(expenseId) {
        try {
            this.showSpinner('Arrêt de la récurrence...');

            const success = await this.ajaxCall('PATCH', `${this.API_BASE_URL}/expenses/${expenseId}/stop-recurring`);

            if (success) {
                const expense = this.expenses.find(e => e.id === expenseId);
                if (expense) {
                    expense.status_is_repetitive = 1;
                }

                this.showToast('Récurrence arrêtée avec succès', 'warning');
                this.applyFilters();
                this.closeExpenseDetail();
            } else {
                this.showToast('Erreur lors de l\'arrêt de la récurrence', 'error');
            }

        } catch (error) {
            console.error('Erreur lors de l\'arrêt de la récurrence:', error);
            this.showToast('Erreur lors de l\'arrêt de la récurrence', 'error');
        } finally {
            this.hideSpinner();
        }
    }

    async duplicateExpense(expenseId) {
        try {
            this.showSpinner('Duplication en cours...');

            const expense = this.expenses.find(e => e.id === expenseId);
            if (!expense) {
                this.showToast('Dépense non trouvée', 'error');
                return;
            }

            const newExpenseData = {
                ...expense,
                id: null,
                libelle: `${expense.libelle} (copie)`,
                created_at: new Date().toISOString().split('T')[0]
            };

            const success = await this.ajaxCall('POST', `${this.API_BASE_URL}/expenses`, newExpenseData);

            if (success) {
                const newExpense = {
                    ...expense,
                    id: Math.max(...this.expenses.map(e => e.id)) + 1,
                    libelle: `${expense.libelle} (copie)`,
                    created_at: new Date().toISOString().split('T')[0]
                };
                this.expenses.unshift(newExpense);

                this.showToast('Dépense dupliquée avec succès', 'success');
                this.applyFilters();
                this.closeExpenseDetail();
            } else {
                this.showToast('Erreur lors de la duplication', 'error');
            }

        } catch (error) {
            console.error('Erreur lors de la duplication:', error);
            this.showToast('Erreur lors de la duplication', 'error');
        } finally {
            this.hideSpinner();
        }
    }

    /**
     * ============================================
     * APPELS AJAX AVEC JQUERY
     * ============================================
     */
    ajaxCall(method, url, data = null) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const success = Math.random() > 0.1;

                if (success) {
                    console.log(`${method} ${url}`, data ? `Data: ${JSON.stringify(data)}` : '');
                    resolve(true);
                } else {
                    console.error(`Erreur ${method} ${url}`);
                    resolve(false);
                }
            }, 1000);
        });
    }

    /**
     * ============================================
     * UTILITAIRES
     * ============================================
     */
    showListLoading() {
        this.state.isFilterLoading = true;
        document.getElementById('listLoading').style.display = 'flex';
    }

    hideListLoading() {
        setTimeout(() => {
            this.state.isFilterLoading = false;
            document.getElementById('listLoading').style.display = 'none';
        }, 300);
    }

    showSpinner(message = 'Chargement...') {
        const spinner = document.getElementById('spinnerOverlay');
        const spinnerText = document.getElementById('spinnerText');

        spinnerText.textContent = message;
        spinner.style.display = 'flex';
    }

    hideSpinner() {
        const spinner = document.getElementById('spinnerOverlay');
        spinner.style.display = 'none';
    }

    showToast(message, type = 'info') {
        const toastId = 'toast-' + Date.now();
        const bgClass = type === 'success' ? 'bg-success' :
            type === 'error' ? 'bg-danger' :
                type === 'warning' ? 'bg-warning' :
                    'bg-primary';

        const icon = type === 'success' ? 'bi-check-circle-fill' :
            type === 'error' ? 'bi-exclamation-circle-fill' :
                type === 'warning' ? 'bi-exclamation-triangle-fill' :
                    'bi-info-circle-fill';

        const toastHtml = `
            <div id="${toastId}" class="toast ${bgClass} text-white" role="alert">
                <div class="toast-header ${bgClass} text-white">
                    <i class="bi ${icon} me-2"></i>
                    <strong class="me-auto">
                        ${type === 'success' ? 'Succès' :
                type === 'error' ? 'Erreur' :
                    type === 'warning' ? 'Attention' :
                        'Information'}
                    </strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;

        const container = document.getElementById('toastContainer');
        container.insertAdjacentHTML('beforeend', toastHtml);

        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, {
            delay: 3000,
            autohide: true,
            animation: true
        });

        toast.show();

        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }
}

// Initialisation
let expenseList;

document.addEventListener('DOMContentLoaded', () => {
    expenseList = new ExpenseList();
    window.expenseList = expenseList;
});