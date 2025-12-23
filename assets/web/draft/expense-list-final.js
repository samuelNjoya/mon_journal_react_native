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
            selectedExpense: null,
            pendingAction: null,
            pendingExpenseId: null
        };
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
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
                // Données de démo pour les catégories
                this.categories = [
                    { id: 1, nom: 'Nourriture' },
                    { id: 2, nom: 'Transport' },
                    { id: 3, nom: 'Logement' },
                    { id: 4, nom: 'Loisirs' },
                    { id: 5, nom: 'Santé' },
                    { id: 6, nom: 'Éducation' },
                    { id: 7, nom: 'Shopping' }
                ];
                
                // Données de démo pour les budgets
                this.budgets = [
                    { id: 1, libelle: 'Budget Maison', categories: [1, 2, 3] },
                    { id: 2, libelle: 'Budget Transport', categories: [2] },
                    { id: 3, libelle: 'Budget Loisirs', categories: [4, 5] },
                    { id: 4, libelle: 'Budget Courses', categories: [1, 7] }
                ];
                
                // Génération de données de démo pour les dépenses
                this.expenses = this.generateDemoExpenses(50);
                
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
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            
            expenses.push({
                id: i,
                libelle: `Dépense ${i} - ${category.nom}`,
                montant: amount,
                id_categorie_depense: category.id,
                IdBudget: budget.id,
                created_at: date.toISOString().split('T')[0],
                is_repetitive: Math.random() > 0.7 ? 1 : 0,
                status_is_repetitive: Math.random() > 0.5 ? 0 : 1,
                piece_jointe: Math.random() > 0.8 ? 'data:image/png;base64,...' : null
            });
        }
        
        return expenses;
    }

    getFirstDayOfMonth() {
        const date = new Date();
        date.setDate(1);
        return date.toISOString().split('T')[0];
    }

    /**
     * ============================================
     * CONFIGURATION DES ÉVÉNEMENTS
     * ============================================
     */
    setupEventListeners() {
        // Barre de recherche
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        // Toggle des filtres
        document.getElementById('filterToggleBtn').addEventListener('click', () => {
            this.toggleFilters();
        });
        
        // Filtres
        document.getElementById('startDate').addEventListener('change', (e) => {
            this.state.filters.startDate = e.target.value;
            this.updateActiveFilters();
        });
        
        document.getElementById('endDate').addEventListener('change', (e) => {
            this.state.filters.endDate = e.target.value;
            this.updateActiveFilters();
        });
        
        document.getElementById('budgetFilter').addEventListener('change', (e) => {
            this.handleBudgetFilterChange(e.target.value);
        });
        
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.state.filters.selectedCategory = parseInt(e.target.value);
            this.updateActiveFilters();
        });
        
        // Slider de montant
        const amountRange = document.getElementById('amountRange');
        const minAmountInput = document.getElementById('minAmountInput');
        const maxAmountInput = document.getElementById('maxAmountInput');
        
        amountRange.addEventListener('input', (e) => {
            const values = this.parseRangeValues(e.target.value);
            minAmountInput.value = values[0];
            maxAmountInput.value = values[1];
            this.state.filters.minAmount = values[0];
            this.state.filters.maxAmount = values[1];
            this.updateAmountLabels(values[0], values[1]);
        });
        
        minAmountInput.addEventListener('change', (e) => {
            const value = parseInt(e.target.value) || 0;
            if (value < 0 || value > 1000000) {
                e.target.value = Math.min(Math.max(value, 0), 1000000);
            }
            this.state.filters.minAmount = parseInt(e.target.value) || 0;
            this.updateAmountRange();
            this.updateActiveFilters();
        });
        
        maxAmountInput.addEventListener('change', (e) => {
            const value = parseInt(e.target.value) || 1000000;
            if (value < 0 || value > 1000000) {
                e.target.value = Math.min(Math.max(value, 0), 1000000);
            }
            this.state.filters.maxAmount = parseInt(e.target.value) || 1000000;
            this.updateAmountRange();
            this.updateActiveFilters();
        });
        
        // Boutons des filtres
        document.getElementById('applyFiltersBtn').addEventListener('click', () => {
            this.applyFilters();
        });
        
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
        
        document.getElementById('addExpenseBtn').addEventListener('click', () => {
            this.showToast('Fonctionnalité d\'ajout à implémenter', 'info');
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
        const tableBody = document.getElementById('expenseTableBody');
        const emptyState = document.getElementById('emptyState');
        const tableContainer = document.getElementById('expenseTable');
        const paginationContainer = document.getElementById('paginationContainer');
        
        // Filtrer les dépenses
        const filteredExpenses = this.getFilteredExpenses();
        this.state.totalItems = filteredExpenses.length;
        
        // Pagination
        const start = this.state.currentPage * this.state.itemsPerPage;
        const end = start + this.state.itemsPerPage;
        const paginatedExpenses = filteredExpenses.slice(start, end);
        
        if (paginatedExpenses.length === 0) {
            tableContainer.style.display = 'none';
            paginationContainer.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }
        
        tableContainer.style.display = 'table';
        paginationContainer.style.display = 'flex';
        emptyState.style.display = 'none';
        
        // Générer les lignes du tableau
        tableBody.innerHTML = paginatedExpenses.map(expense => {
            const category = this.categories.find(c => c.id === expense.id_categorie_depense);
            const budget = this.budgets.find(b => b.id === expense.IdBudget);
            const isRecurring = expense.is_repetitive === 1;
            const isActive = expense.status_is_repetitive === 0;
            
            return `
                <tr class="${isRecurring ? 'recurring-row' : ''}" data-id="${expense.id}">
                    <td>
                        <div class="category-cell">
                            <div class="category-info">
                                <div class="expense-label">${category?.nom || 'Inconnue'}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="expense-label">${expense.libelle}</div>
                        <div class="expense-details">
                            ${budget ? budget.libelle : 'Aucun budget'}
                        </div>
                    </td>
                    <td>
                        <div class="expense-details">
                            ${new Date(expense.created_at).toLocaleDateString('fr-FR')}
                        </div>
                    </td>
                    <td>
                        <div class="expense-label">
                            ${budget ? budget.libelle : '-'}
                        </div>
                    </td>
                    <td class="amount-cell">
                        - ${expense.montant.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td>
                        ${isRecurring ? `
                            <span class="recurring-badge">
                                <i class="bi bi-arrow-repeat"></i>
                                ${isActive ? 'Active' : 'Inactive'}
                            </span>
                        ` : '-'}
                    </td>
                    <td>
                        <div class="actions-cell">
                            <button class="action-btn btn-view" onclick="expenseList.viewExpenseDetail(${expense.id})">
                                <i class="bi bi-eye"></i>
                            </button>
                            ${isRecurring && isActive ? `
                                <button class="action-btn btn-stop" onclick="expenseList.showStopRecurringModal(${expense.id})">
                                    <i class="bi bi-arrow-repeat"></i>
                                </button>
                            ` : ''}
                            <button class="action-btn btn-duplicate" onclick="expenseList.showDuplicateModal(${expense.id})">
                                 
                                <i class="bi bi-layers"></i> 
                            </button>
                            <button class="action-btn btn-delete" onclick="expenseList.showDeleteModal(${expense.id})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;       // <i class="bi bi-clipboard"></i>
        }).join('');
        
        // Ajouter les événements de clic sur les lignes
        tableBody.querySelectorAll('tr').forEach(row => {
            row.addEventListener('click', (e) => {
                // Ne pas déclencher si on clique sur un bouton d'action
                if (!e.target.closest('.action-btn')) {
                    const expenseId = parseInt(row.dataset.id);
                    this.viewExpenseDetail(expenseId);
                }
            });
        });
    }

    updatePagination() {
        const totalPages = Math.ceil(this.state.totalItems / this.state.itemsPerPage);
        const startIndex = this.state.currentPage * this.state.itemsPerPage + 1;
        const endIndex = Math.min(startIndex + this.state.itemsPerPage - 1, this.state.totalItems);
        
        // Mettre à jour les informations
        document.getElementById('startIndex').textContent = startIndex;
        document.getElementById('endIndex').textContent = endIndex;
        document.getElementById('totalItems').textContent = this.state.totalItems;
        
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
            categoryFilter.appendChild(option);
        });
        
        // Dates
        document.getElementById('startDate').value = this.state.filters.startDate;
        document.getElementById('endDate').value = this.state.filters.endDate;
        
        // Montant
        document.getElementById('minAmountInput').value = this.state.filters.minAmount;
        document.getElementById('maxAmountInput').value = this.state.filters.maxAmount;
        this.updateAmountRange();
        this.updateAmountLabels(this.state.filters.minAmount, this.state.filters.maxAmount);
    }

    updateAmountRange() {
        const range = document.getElementById('amountRange');
        const avg = (this.state.filters.minAmount + this.state.filters.maxAmount) / 2;
        range.value = avg;
    }

    updateAmountLabels(min, max) {
        document.getElementById('minAmountLabel').textContent = `${min.toLocaleString('fr-FR')} FCFA`;
        document.getElementById('maxAmountLabel').textContent = `${max.toLocaleString('fr-FR')} FCFA`;
    }

    parseRangeValues(value) {
        const num = parseInt(value) || 0;
        const min = Math.max(0, num - 50000);
        const max = Math.min(1000000, num + 50000);
        return [min, max];
    }

    /**
     * ============================================
     * MODALS AJAX POUR LES CONFIRMATIONS
     * ============================================
     */
    showAjaxModal(config) {
        const {
            type = 'warning', // warning, danger, success, info
            title = 'Confirmation',
            message = 'Êtes-vous sûr de vouloir effectuer cette action ?',
            confirmText = 'Confirmer',
            cancelText = 'Annuler',
            icon = 'bi-question-circle',
            onConfirm = null,
            onCancel = null,
            data = null
        } = config;
        
        // Sauvegarder l'action en attente
        this.state.pendingAction = onConfirm;
        this.state.pendingData = data;
        
        // Configurer le modal selon le type
        const modal = document.getElementById('ajaxModal');
        const header = document.getElementById('ajaxModalHeader');
        const iconElement = document.getElementById('ajaxModalIcon');
        const mainTitle = document.getElementById('ajaxModalMainTitle');
        const messageElement = document.getElementById('ajaxModalMessage');
        const confirmBtn = document.getElementById('ajaxModalConfirmBtn');
        const cancelBtn = document.getElementById('ajaxModalCancelBtn');
        const closeBtn = document.getElementById('ajaxModalClose');
        
        // Classes selon le type
        const typeClasses = {
            warning: { header: 'warning', icon: 'warning', btn: 'warning' },
            danger: { header: 'danger', icon: 'danger', btn: 'danger' },
            success: { header: 'success', icon: 'success', btn: 'success' },
            info: { header: '', icon: 'info', btn: '' }
        };
        
        const classes = typeClasses[type] || typeClasses.warning;
        
        // Nettoyer les classes précédentes
        header.className = 'ajax-modal-header';
        iconElement.className = 'ajax-modal-icon';
        confirmBtn.className = 'ajax-modal-btn ajax-modal-btn-confirm';
        closeBtn.className = 'ajax-modal-close';
        
        // Appliquer les nouvelles classes
        if (classes.header) header.classList.add(classes.header);
        if (classes.icon) iconElement.classList.add(classes.icon);
        if (classes.btn) confirmBtn.classList.add(classes.btn);
        if (classes.header) closeBtn.classList.add(classes.header);
        
        // Mettre à jour le contenu
        document.getElementById('ajaxModalTitle').textContent = title;
        mainTitle.textContent = title;
        messageElement.textContent = message;
        confirmBtn.textContent = confirmText;
        cancelBtn.textContent = cancelText;
        
        // Mettre à jour l'icône
        iconElement.innerHTML = `<i class="bi ${icon}"></i>`;
        
        // Afficher le modal
        modal.classList.add('show');
    }

    closeAjaxModal() {
        const modal = document.getElementById('ajaxModal');
        modal.classList.remove('show');
        
        // Réinitialiser l'état
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
     * FILTRAGE ET RECHERCHE
     * ============================================
     */
    getFilteredExpenses() {
        return this.expenses.filter(expense => {
            // Recherche texte
            if (this.state.searchQuery && !expense.libelle.toLowerCase().includes(this.state.searchQuery.toLowerCase())) {
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
            if (this.state.filters.selectedBudget !== 0 && expense.IdBudget !== this.state.filters.selectedBudget) {
                return false;
            }
            
            // Filtre par catégorie
            if (this.state.filters.selectedCategory !== 0 && expense.id_categorie_depense !== this.state.filters.selectedCategory) {
                return false;
            }
            
            // Filtre par montant
            if (expense.montant < this.state.filters.minAmount || expense.montant > this.state.filters.maxAmount) {
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
        categoryFilter.innerHTML = '<option value="0">Toutes les catégories</option>';
        
        if (budgetIdNum === 0) {
            // Toutes les catégories
            this.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.nom;
                categoryFilter.appendChild(option);
            });
        } else {
            // Catégories du budget sélectionné
            const budget = this.budgets.find(b => b.id === budgetIdNum);
            if (budget && budget.categories) {
                budget.categories.forEach(categoryId => {
                    const category = this.categories.find(c => c.id === categoryId);
                    if (category) {
                        const option = document.createElement('option');
                        option.value = category.id;
                        option.textContent = category.nom;
                        option.dataset.budgetId = budgetIdNum;
                        categoryFilter.appendChild(option);
                    }
                });
            }
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
        
        // Afficher/masquer le conteneur
        if (activeFilters.length > 0) {
            activeFiltersContainer.style.display = 'flex';
            filterCountBadge.style.display = 'inline';
            filterCountBadge.textContent = activeFilters.length;
            
            // Générer les tags
            activeFiltersContainer.innerHTML = activeFilters.map(filter => `
                <div class="filter-tag">
                    ${filter.label}
                    <span class="remove" onclick="expenseList.removeFilter('${filter.type}')">
                        <i class="bi bi-x"></i>
                    </span>
                </div>
            `).join('');
        } else {
            activeFiltersContainer.style.display = 'none';
            filterCountBadge.style.display = 'none';
        }
        
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
                this.updateAmountRange();
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
        this.showTableLoading();
        
        // Simuler un délai de filtrage
        setTimeout(() => {
            this.renderExpenses();
            this.updatePagination();
            this.updateCounts();
            this.hideTableLoading();
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
        
        this.updateAmountRange();
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
     * GESTION DES DÉPENSES (AJAX)
     * ============================================
     */
    viewExpenseDetail(expenseId) {
        const expense = this.expenses.find(e => e.id === expenseId);
        if (!expense) return;
        
        this.state.selectedExpense = expense;
        const category = this.categories.find(c => c.id === expense.id_categorie_depense);
        const budget = this.budgets.find(b => b.id === expense.IdBudget);
        
        const detailBody = document.getElementById('expenseDetailBody');
        detailBody.innerHTML = `
            <div class="expense-detail-item">
                <div class="detail-label">Description</div>
                <div class="detail-value">${expense.libelle}</div>
            </div>
            
            <div class="expense-detail-item">
                <div class="detail-label">Montant</div>
                <div class="detail-value" style="color: var(--danger-color); font-weight: 600;">
                    ${expense.montant.toLocaleString('fr-FR')} FCFA
                </div>
            </div>
            
            <div class="expense-detail-item">
                <div class="detail-label">Catégorie</div>
                <div class="detail-value">
                    ${category?.nom || 'Inconnue'}
                </div>
            </div>
            
            <div class="expense-detail-item">
                <div class="detail-label">Budget</div>
                <div class="detail-value">${budget?.libelle || 'Aucun budget'}</div>
            </div>
            
            <div class="expense-detail-item">
                <div class="detail-label">Date</div>
                <div class="detail-value">${new Date(expense.created_at).toLocaleDateString('fr-FR')}</div>
            </div>
            
            ${expense.is_repetitive === 1 ? `
                <div class="expense-detail-item">
                    <div class="detail-label">Récurrence</div>
                    <div class="detail-value">
                        <span class="badge ${expense.status_is_repetitive === 0 ? 'bg-success' : 'bg-secondary'}">
                            ${expense.status_is_repetitive === 0 ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
            ` : ''}
            
            ${expense.piece_jointe ? `
                <div class="expense-detail-item">
                    <div class="detail-label">Pièce jointe</div>
                    <div class="detail-value">
                        <button class="btn btn-sm btn-outline-primary">
                            <i class="bi bi-paperclip"></i> Voir la pièce jointe
                        </button>
                    </div>
                </div>
            ` : ''}
            
            <div class="expense-detail-item">
                <div class="detail-label">Actions</div>
                <div class="detail-value">
                    <div class="d-flex gap-2 flex-wrap">
                        <button class="btn btn-sm btn-outline-warning" onclick="expenseList.showDuplicateModal(${expense.id})">
                            <i class="bi bi-copy"></i> Dupliquer
                        </button>
                        ${expense.is_repetitive === 1 && expense.status_is_repetitive === 0 ? `
                            <button class="btn btn-sm btn-outline-danger" onclick="expenseList.showStopRecurringModal(${expense.id})">
                                <i class="bi bi-arrow-repeat"></i> Arrêter la récurrence
                            </button>
                        ` : ''}
                        <button class="btn btn-sm btn-outline-danger" onclick="expenseList.showDeleteModal(${expense.id})">
                            <i class="bi bi-trash"></i> Supprimer
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('expenseDetailModal').classList.add('show');
    }

    closeExpenseDetail() {
        document.getElementById('expenseDetailModal').classList.remove('show');
        this.state.selectedExpense = null;
    }

    async deleteExpense(expenseId) {
        try {
            this.showSpinner('Suppression en cours...');
            
            // Simulation d'appel API AJAX avec jQuery
            const success = await this.ajaxCall('DELETE', `${this.API_BASE_URL}/expenses/${expenseId}`);
            
            if (success) {
                // Supprimer de la liste locale
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
            
            // Simulation d'appel API AJAX avec jQuery
            const success = await this.ajaxCall('PATCH', `${this.API_BASE_URL}/expenses/${expenseId}/stop-recurring`);
            
            if (success) {
                // Mettre à jour localement
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
            
            // Simulation d'appel API AJAX avec jQuery
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
                // Ajouter à la liste locale
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
            // Simulation avec setTimeout
            setTimeout(() => {
                // Simuler un succès dans 90% des cas
                const success = Math.random() > 0.1;
                
                if (success) {
                    console.log(`${method} ${url}`, data ? `Data: ${JSON.stringify(data)}` : '');
                    
                    // Pour simuler un vrai appel AJAX avec jQuery
                    // $.ajax({
                    //     method: method,
                    //     url: url,
                    //     data: data ? JSON.stringify(data) : null,
                    //     contentType: 'application/json',
                    //     success: function(response) {
                    //         resolve(true);
                    //     },
                    //     error: function() {
                    //         resolve(false);
                    //     }
                    // });
                    
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
    showTableLoading() {
        document.getElementById('tableLoading').style.display = 'flex';
    }

    hideTableLoading() {
        document.getElementById('tableLoading').style.display = 'none';
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