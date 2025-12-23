class AnalyticsDashboard {
    constructor() {
        this.expenses = [];
        this.categories = [];
        this.budgets = [];
        
        // État partagé
        this.state = {
            filters: {
                startDate: this.getFirstDayOfMonth(),
                endDate: new Date().toISOString().split('T')[0],
                selectedBudget: 0,
                selectedCategory: 0,
                minAmount: 0,
                maxAmount: 1000000
            },
            isLoading: false,
            isFiltering: false,
            locale: 'fr-FR'
        };
        
        // Chart instances
        this.barChart = null;
        this.pieChart = null;
        
        // Double slider state
        this.minAmountThumb = null;
        this.maxAmountThumb = null;
        this.isDragging = false;
        this.activeThumb = null;
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.initDoubleSlider();
        this.renderAllCharts();
    }

    /**
     * ============================================
     * CHARGEMENT DES DONNÉES
     * ============================================
     */
    async loadData() {
        try {
            this.showSpinner('Chargement des données...');
            
            await this.simulateApiCalls();
            
            this.populateFilters();
            this.applyFilters();
            
        } catch (error) {
            console.error('Erreur de chargement:', error);
            this.showNotification('Erreur lors du chargement des données', 'error');
        } finally {
            this.hideSpinner();
        }
    }

    simulateApiCalls() {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Données de démo pour les catégories
                this.categories = [
                    { id: 1, nom: 'Nourriture', color: '#4CAF50' },
                    { id: 2, nom: 'Transport', color: '#2196F3' },
                    { id: 3, nom: 'Logement', color: '#FF9800' },
                    { id: 4, nom: 'Loisirs', color: '#9C27B0' },
                    { id: 5, nom: 'Santé', color: '#F44336' },
                    { id: 6, nom: 'Éducation', color: '#009688' },
                    { id: 7, nom: 'Shopping', color: '#E91E63' },
                    { id: 8, nom: 'Restaurant', color: '#795548' },
                    { id: 9, nom: 'Voyage', color: '#3F51B5' },
                    { id: 10, nom: 'Épargne', color: '#00BCD4' }
                ];
                
                // Données de démo pour les budgets
                this.budgets = [
                    { id: 1, libelle: 'Budget Maison', categories: [1, 2, 3] },
                    { id: 2, libelle: 'Budget Transport', categories: [2] },
                    { id: 3, libelle: 'Budget Loisirs', categories: [4, 5] },
                    { id: 4, libelle: 'Budget Courses', categories: [1, 7, 8] }
                ];
                
                // Génération de données de démo pour les dépenses
                this.expenses = this.generateDemoExpenses();
                
                resolve();
            }, 1500);
        });
    }

    generateDemoExpenses() {
        const expenses = [];
        const categories = this.categories;
        const budgets = this.budgets;
        
        // Générer des données pour les 90 derniers jours
        for (let i = 0; i < 90; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // Format de date : "24/10/2025"
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            
            // Nombre aléatoire de dépenses par jour (0-4)
            const countPerDay = Math.floor(Math.random() * 5);
            
            for (let j = 0; j < countPerDay; j++) {
                const category = categories[Math.floor(Math.random() * categories.length)];
                const budget = budgets[Math.floor(Math.random() * budgets.length)];
                const amount = Math.floor(Math.random() * 50000) + 1000;
                
                expenses.push({
                    id: expenses.length + 1,
                    libelle: `Dépense ${expenses.length + 1}`,
                    montant: amount,
                    id_categorie_depense: category.id,
                    IdBudget: budget.id,
                    created_at: `${day}/${month}/${year}`,
                    is_repetitive: Math.random() > 0.8 ? 1 : 0,
                    status_is_repetitive: Math.random() > 0.5 ? 0 : 1
                });
            }
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
        
        this.minAmountThumb = minThumb;
        this.maxAmountThumb = maxThumb;
        
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
            this.isDragging = true;
            this.activeThumb = thumbType;
            
            const moveHandler = (e) => {
                if (!this.isDragging) return;
                
                const rect = track.getBoundingClientRect();
                const x = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
                let percent = ((x - rect.left) / rect.width) * 100;
                percent = Math.max(0, Math.min(100, percent));
                
                const value = Math.round((percent / 100) * 1000000);
                
                if (this.activeThumb === 'min') {
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
                this.debouncedApplyFilters();
            };
            
            const stopDrag = () => {
                this.isDragging = false;
                this.activeThumb = null;
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
        // Dates
        document.getElementById('startDate').addEventListener('change', (e) => {
            this.state.filters.startDate = e.target.value;
            this.debouncedApplyFilters();
        });
        
        document.getElementById('endDate').addEventListener('change', (e) => {
            this.state.filters.endDate = e.target.value;
            this.debouncedApplyFilters();
        });
        
        // Budget et Catégorie
        document.getElementById('budgetFilter').addEventListener('change', (e) => {
            this.handleBudgetFilterChange(e.target.value);
            this.debouncedApplyFilters();
        });
        
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.state.filters.selectedCategory = parseInt(e.target.value);
            this.debouncedApplyFilters();
        });
        
        // Inputs de montant
        const minAmountInput = document.getElementById('minAmountInput');
        const maxAmountInput = document.getElementById('maxAmountInput');
        
        minAmountInput.addEventListener('input', () => {
            const min = parseInt(minAmountInput.value) || 0;
            const max = this.state.filters.maxAmount;
            
            if (min >= 0 && min <= 1000000 && min <= max) {
                this.state.filters.minAmount = min;
                this.updateSliderFromInputs();
                this.debouncedApplyFilters();
            }
        });
        
        maxAmountInput.addEventListener('input', () => {
            const max = parseInt(maxAmountInput.value) || 1000000;
            const min = this.state.filters.minAmount;
            
            if (max >= 0 && max <= 1000000 && max >= min) {
                this.state.filters.maxAmount = max;
                this.updateSliderFromInputs();
                this.debouncedApplyFilters();
            }
        });
    }

    handleBudgetFilterChange(budgetId) {
        const budgetIdNum = parseInt(budgetId);
        this.state.filters.selectedBudget = budgetIdNum;
        
        // Filtrer les catégories selon le budget sélectionné
        const categoryFilter = document.getElementById('categoryFilter');
        
        if (budgetIdNum === 0) {
            // Toutes les catégories
            this.populateCategoryFilter(this.categories);
        } else {
            // Catégories du budget sélectionné
            const budget = this.budgets.find(b => b.id === budgetIdNum);
            if (budget && budget.categories) {
                const filteredCategories = budget.categories
                    .map(categoryId => this.categories.find(c => c.id === categoryId))
                    .filter(c => c !== undefined);
                
                this.populateCategoryFilter(filteredCategories);
            } else {
                this.populateCategoryFilter([]);
            }
        }
        
        // Réinitialiser la catégorie sélectionnée si elle n'est pas disponible
        const availableCategoryIds = Array.from(categoryFilter.options)
            .map(opt => parseInt(opt.value));
        
        if (!availableCategoryIds.includes(this.state.filters.selectedCategory)) {
            this.state.filters.selectedCategory = 0;
            categoryFilter.value = '0';
        }
    }

    updateSliderFromInputs() {
        const minPercent = (this.state.filters.minAmount / 1000000) * 100;
        const maxPercent = (this.state.filters.maxAmount / 1000000) * 100;
        
        if (this.minAmountThumb && this.maxAmountThumb) {
            this.minAmountThumb.style.left = `${minPercent}%`;
            this.maxAmountThumb.style.left = `${maxPercent}%`;
            
            const range = document.querySelector('.slider-range');
            range.style.left = `${minPercent}%`;
            range.style.width = `${maxPercent - minPercent}%`;
            
            document.getElementById('minSliderValue').textContent = this.formatAmount(this.state.filters.minAmount);
            document.getElementById('maxSliderValue').textContent = this.formatAmount(this.state.filters.maxAmount);
        }
        
        this.updateAmountLabels(this.state.filters.minAmount, this.state.filters.maxAmount);
    }

    updateAmountLabels(min, max) {
        document.getElementById('minAmountLabel').textContent = `${min.toLocaleString('fr-FR')} FCFA`;
        document.getElementById('maxAmountLabel').textContent = `${max.toLocaleString('fr-FR')} FCFA`;
    }

    // Debounce pour éviter trop de recalculs
    debouncedApplyFilters() {
        this.showFilteringIndicator();
        
        if (this.filterTimeout) {
            clearTimeout(this.filterTimeout);
        }
        
        this.filterTimeout = setTimeout(() => {
            this.applyFilters();
            this.hideFilteringIndicator();
        }, 500);
    }

    /**
     * ============================================
     * FILTRAGE DES DONNÉES
     * ============================================
     */
    parseExpenseDate(dateString) {
        if (typeof dateString === 'string' && dateString.includes('/')) {
            const [day, month, year] = dateString.split('/');
            return new Date(`${year}-${month}-${day}`);
        }
        return new Date(dateString || 0);
    }

    getFilteredExpenses() {
        return this.expenses.filter(expense => {
            const expDate = this.parseExpenseDate(expense.created_at);
            const startDate = new Date(this.state.filters.startDate);
            const endDate = new Date(this.state.filters.endDate);
            endDate.setHours(23, 59, 59, 999);
            
            // Filtre par date
            if (expDate < startDate || expDate > endDate) {
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

    /**
     * ============================================
     * RENDU DES FILTRES
     * ============================================
     */
    populateFilters() {
        // Dates
        document.getElementById('startDate').value = this.state.filters.startDate;
        document.getElementById('endDate').value = this.state.filters.endDate;
        
        // Budgets
        const budgetFilter = document.getElementById('budgetFilter');
        budgetFilter.innerHTML = '<option value="0">Tous les budgets</option>';
        
        this.budgets.forEach(budget => {
            const option = document.createElement('option');
            option.value = budget.id;
            option.textContent = budget.libelle;
            budgetFilter.appendChild(option);
        });
        
        // Catégories initiales
        this.populateCategoryFilter(this.categories);
        
        // Montant
        document.getElementById('minAmountInput').value = this.state.filters.minAmount;
        document.getElementById('maxAmountInput').value = this.state.filters.maxAmount;
        this.updateAmountLabels(this.state.filters.minAmount, this.state.filters.maxAmount);
    }

    populateCategoryFilter(categories) {
        const categoryFilter = document.getElementById('categoryFilter');
        categoryFilter.innerHTML = '<option value="0">Toutes les catégories</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.nom;
            categoryFilter.appendChild(option);
        });
    }

    /**
     * ============================================
     * GRAPHIQUE EN BARRES (WeeklyBarChart)
     * ============================================
     */
    renderBarChart(filteredExpenses) {
        const ctx = document.getElementById('barChart').getContext('2d');
        const emptyState = document.getElementById('barChartEmpty');
        
        // Nettoyer le graphique existant
        if (this.barChart) {
            this.barChart.destroy();
        }
        
        if (filteredExpenses.length === 0) {
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        // Grouper les dépenses par période
        const startDate = new Date(this.state.filters.startDate);
        const endDate = new Date(this.state.filters.endDate);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let labels = [];
        let data = [];
        
        if (diffDays <= 7) {
            // Vue quotidienne
            for (let i = 0; i <= diffDays; i++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + i);
                
                labels.push(currentDate.toLocaleDateString(this.state.locale, {
                    weekday: 'short'
                }));
                
                const dayExpenses = filteredExpenses.filter(exp => {
                    const expDate = this.parseExpenseDate(exp.created_at);
                    return expDate.toDateString() === currentDate.toDateString();
                });
                
                data.push(dayExpenses.reduce((sum, exp) => sum + exp.montant, 0));
            }
        } else if (diffDays <= 30) {
            // Vue hebdomadaire
            const weeksCount = Math.ceil(diffDays / 7);
            
            for (let week = 0; week < weeksCount; week++) {
                const weekStart = new Date(startDate);
                weekStart.setDate(startDate.getDate() + (week * 7));
                
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);
                
                labels.push(this.state.locale === 'fr-FR' ? `Sem ${week + 1}` : `Week ${week + 1}`);
                
                const weekExpenses = filteredExpenses.filter(exp => {
                    const expDate = this.parseExpenseDate(exp.created_at);
                    return expDate >= weekStart && expDate <= weekEnd;
                });
                
                data.push(weekExpenses.reduce((sum, exp) => sum + exp.montant, 0));
            }
        } else if (diffDays > 365) {
            // Vue annuelle
            const startYear = startDate.getFullYear();
            const endYear = endDate.getFullYear();
            
            for (let year = startYear; year <= endYear; year++) {
                labels.push(year.toString());
                
                const yearExpenses = filteredExpenses.filter(exp => {
                    const expDate = this.parseExpenseDate(exp.created_at);
                    return expDate.getFullYear() === year;
                });
                
                data.push(yearExpenses.reduce((sum, exp) => sum + exp.montant, 0));
            }
        } else {
            // Vue mensuelle
            const startMonth = startDate.getMonth();
            const startYear = startDate.getFullYear();
            const endMonth = endDate.getMonth();
            const endYear = endDate.getFullYear();
            
            let currentMonth = startMonth;
            let currentYear = startYear;
            let monthIndex = 0;
            
            while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
                const monthDate = new Date(currentYear, currentMonth, 1);
                labels.push(monthDate.toLocaleDateString(this.state.locale, { month: 'short' }));
                
                const monthExpenses = filteredExpenses.filter(exp => {
                    const expDate = this.parseExpenseDate(exp.created_at);
                    return expDate.getMonth() === currentMonth && 
                           expDate.getFullYear() === currentYear;
                });
                
                data.push(monthExpenses.reduce((sum, exp) => sum + exp.montant, 0));
                
                currentMonth++;
                if (currentMonth > 11) {
                    currentMonth = 0;
                    currentYear++;
                }
                monthIndex++;
            }
        }
        
        // Créer le graphique en barres
        this.barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Dépenses',
                    data: data,
                    backgroundColor: 'rgba(255, 193, 7, 0.7)',
                    borderColor: 'rgba(255, 193, 7, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `Dépenses: ${context.parsed.y.toLocaleString('fr-FR')} FCFA`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString('fr-FR') + ' FCFA';
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * ============================================
     * GRAPHIQUE EN CAMEMBERT (CategoryPieChart)
     * ============================================
     */
    renderPieChart(filteredExpenses) {
        const ctx = document.getElementById('pieChart').getContext('2d');
        const legendContainer = document.getElementById('pieChartLegend');
        const emptyState = document.getElementById('pieChartEmpty');
        
        // Nettoyer le graphique existant
        if (this.pieChart) {
            this.pieChart.destroy();
        }
        
        // Calculer les montants par catégorie
        const categoryMap = new Map();
        
        filteredExpenses.forEach(exp => {
            const categoryId = exp.id_categorie_depense;
            if (categoryId) {
                const current = categoryMap.get(categoryId) || { amount: 0, count: 0 };
                current.amount += exp.montant;
                current.count += 1;
                categoryMap.set(categoryId, current);
            }
        });
        
        if (categoryMap.size === 0) {
            emptyState.style.display = 'block';
            legendContainer.innerHTML = '';
            return;
        }
        
        emptyState.style.display = 'none';
        
        // Préparer les données pour le graphique
        const categoryData = Array.from(categoryMap.entries()).map(([categoryId, data]) => {
            const category = this.categories.find(c => c.id === categoryId);
            return {
                id: categoryId,
                nom: category ? category.nom : 'Inconnue',
                montant: data.amount,
                color: category ? category.color : this.stringToColor(categoryId.toString()),
                count: data.count
            };
        }).sort((a, b) => b.montant - a.montant);
        
        const totalAmount = categoryData.reduce((sum, cat) => sum + cat.montant, 0);
        
        // Données pour Chart.js
        const pieData = {
            labels: categoryData.map(cat => cat.nom),
            datasets: [{
                data: categoryData.map(cat => cat.montant),
                backgroundColor: categoryData.map(cat => cat.color),
                borderWidth: 1,
                borderColor: 'white'
            }]
        };
        
        // Créer le graphique en camembert
        this.pieChart = new Chart(ctx, {
            type: 'pie',
            data: pieData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.raw;
                                const percentage = ((value / totalAmount) * 100).toFixed(1);
                                return `${context.label}: ${value.toLocaleString('fr-FR')} FCFA (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        
        // Générer la légende
        this.renderPieChartLegend(categoryData, totalAmount);
    }

    renderPieChartLegend(categoryData, totalAmount) {
        const legendContainer = document.getElementById('pieChartLegend');
        
        let legendHTML = '';
        
        categoryData.forEach(cat => {
            const percentage = ((cat.montant / totalAmount) * 100).toFixed(1);
            
            legendHTML += `
                <div class="legend-item">
                    <div class="legend-color" style="background-color: ${cat.color}"></div>
                    <div class="legend-text">
                        <strong>${cat.nom}</strong>: ${cat.montant.toLocaleString('fr-FR')} FCFA (${percentage}%)
                    </div>
                </div>
            `;
        });
        
        legendContainer.innerHTML = legendHTML;
    }

    stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const h = hash % 360;
        return `hsl(${h}, 65%, 55%)`;
    }

    /**
     * ============================================
     * GESTION DES FILTRES
     * ============================================
     */
    applyFilters() {
        const filteredExpenses = this.getFilteredExpenses();
        this.renderBarChart(filteredExpenses);
        this.renderPieChart(filteredExpenses);
    }

    renderAllCharts() {
        const filteredExpenses = this.getFilteredExpenses();
        this.renderBarChart(filteredExpenses);
        this.renderPieChart(filteredExpenses);
    }

    /**
     * ============================================
     * INDICATEURS ET UTILITAIRES
     * ============================================
     */
    showFilteringIndicator() {
        this.state.isFiltering = true;
        const indicator = document.getElementById('filteringIndicator');
        indicator.style.display = 'flex';
    }

    hideFilteringIndicator() {
        setTimeout(() => {
            this.state.isFiltering = false;
            const indicator = document.getElementById('filteringIndicator');
            indicator.style.display = 'none';
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

    showNotification(message, type = 'info') {
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
            <div id="${toastId}" class="toast ${bgClass} text-white" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
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

        const container = document.createElement('div');
        container.innerHTML = toastHtml;
        document.body.appendChild(container.firstElementChild);

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

// Initialiser le dashboard quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    const analyticsDashboard = new AnalyticsDashboard();
    window.analyticsDashboard = analyticsDashboard;
});