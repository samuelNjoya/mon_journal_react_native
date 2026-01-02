class AnalyticsDashboard {
    constructor() {
        this.expenses = [];
        this.categories = [];
        this.budgets = [];

        this.state = {
            filters: {
                startDate: this.getFirstDayOfMonth(),
                endDate: new Date().toISOString().split('T')[0],
                selectedBudget: 0,
                selectedCategory: 0,
                minAmount: 0,
                maxAmount: 1000000
            },
            locale: 'fr-FR'
        };

        this.barChart = null;
        this.pieChart = null;

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
     * CHARGEMENT DES DONNÉES DEPUIS L'API
     * ============================================
     */
    async loadData() {
        try {
        //    console.log('=== DÉBUT loadData (Analytics) ===');

            await this.loadRealApiData();

            this.populateFilters();
            this.applyFilters();

        //    console.log('=== FIN loadData (Analytics) - SUCCÈS ===');

        } catch (error) {
            console.error('Erreur de chargement:', error);
            alert('Erreur lors du chargement des données d\'analyse');
        }
    }

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

    // Stocker les catégories
    if (apiData.categories && apiData.categories.data) {
        this.categories = apiData.categories.data.map(cat => ({
            id: cat.id,
            nom: cat.nom,
            color: cat.color
        }));
    }

    // Stocker les dépenses
    if (apiData.expenses && apiData.expenses.data) {
        this.expenses = apiData.expenses.data.map(exp => ({
            id: exp.id,
            libelle: exp.libelle,
            montant: parseFloat(exp.montant),
            id_categorie_depense: exp.id_categorie_depense,
            IdBudget: exp.IdBudget,
            created_at: exp.created_at
        }));
    }

    // Charger les budgets avec leurs catégories
    await this.loadBudgetCategoryFilter();

   // console.log('Données chargées - Categories:', this.categories.length, 'Expenses:', this.expenses.length, 'Budgets:', this.budgets.length);
}

    /**
 * Charger les budgets avec leurs catégories liées
 */
// async loadBudgetCategoryFilter() {
//     try {
//         const response = await fetch('/dashboard/expenses/budget-category-filter', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
//             }
//         });

//         if (!response.ok) {
//             console.warn('Impossible de charger les budgets');
//             return;
//         }

//         const result = await response.json();

//         if (!result.success) {
//             console.warn('Erreur lors du chargement des budgets:', result.message);
//             return;
//         }

//         // Stocker les budgets avec leurs catégories
//         // Structure attendue : {data: [{id, libelle, categories: [1, 2, 3]}]}
//         if (result.data && result.data.data) {
//             this.budgets = result.data.data.map(budget => ({
//                 id: budget.id,
//                 libelle: budget.libelle || budget.nom_budget || 'Budget sans nom',
//                 categories: budget.categories || budget.id_categories || []
//             }));
//         }

//         console.log('Budgets chargés avec succès:', this.budgets);

//     } catch (error) {
//         console.error('Erreur loadBudgetCategoryFilter:', error);
//         // En cas d'erreur, continuer sans les budgets
//         this.budgets = [];
//     }
// }

async loadBudgetCategoryFilter() {
    //console.log('=== DÉBUT loadBudgetCategoryFilter ===');

    try {
       // console.log('1. Appel fetch vers /dashboard/expenses/budget-category-filter');

        const response = await fetch('/dashboard/expenses/budget-category-filter', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        });

       // console.log('2. Response status:', response.status);
       // console.log('3. Response OK?', response.ok);

        if (!response.ok) {
            console.error('Erreur HTTP:', response.status, response.statusText);
            console.warn('Impossible de charger les budgets - Continuons sans budgets');
            return;
        }

       // console.log('4. Lecture du JSON...');
        const result = await response.json();
       // console.log('5. Result complet:', result);

        if (!result.success) {
            console.error('API a retourné success: false', result);
            console.warn('Erreur lors du chargement des budgets:', result.message);
            return;
        }

       // console.log('6. result.data:', result.data);

        // Vérifier différentes structures possibles
        let budgetData = null;

        if (result.data && result.data.data) {
            budgetData = result.data.data;
          //  console.log('7. Structure trouvée: result.data.data');
        } else if (result.data && Array.isArray(result.data)) {
            budgetData = result.data;
           // console.log('7. Structure trouvée: result.data (array direct)');
        } else {
            console.error('7. Structure non reconnue:', result);
            return;
        }

       // console.log('8. budgetData:', budgetData);
       // console.log('9. Type de budgetData:', typeof budgetData, 'isArray?', Array.isArray(budgetData));

        if (!Array.isArray(budgetData)) {
            console.error('budgetData n\'est pas un tableau !');
            return;
        }

       // console.log('10. Nombre de budgets:', budgetData.length);

        // if (budgetData.length > 0) {
        //     console.log('11. Exemple de budget (premier):', budgetData[0]);
        //     console.log('12. Clés disponibles:', Object.keys(budgetData[0]));
        // }

        // Mapper les budgets
        this.budgets = budgetData.map((budget, index) => {
           // console.log(`13. Mapping budget ${index + 1}:`, budget);

            const mapped = {
                id: budget.id || budget.IdBudget,
                libelle: budget.libelle || budget.nom_budget || budget.libelle_budget || `Budget ${budget.id}`,
                categories: budget.categories || budget.id_categories || budget.categorie_ids || []
            };

         //   console.log(`14. Budget mappé ${index + 1}:`, mapped);
            return mapped;
        });

        // console.log('15. this.budgets final:', this.budgets);
        // console.log('=== FIN loadBudgetCategoryFilter - SUCCÈS ===');

    } catch (error) {
        console.error('=== ERREUR dans loadBudgetCategoryFilter ===');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        this.budgets = [];
    }
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
        const container = document.getElementById('analyticsAmountSliderContainer');
        if (!container) return;

        const track = container.querySelector('.analytics-slider-track');
        const range = container.querySelector('.analytics-slider-range');
        const minThumb = container.querySelector('#analyticsMinSliderThumb');
        const maxThumb = container.querySelector('#analyticsMaxSliderThumb');
        const minValue = container.querySelector('#analyticsMinSliderValue');
        const maxValue = container.querySelector('#analyticsMaxSliderValue');

        this.minAmountThumb = minThumb;
        this.maxAmountThumb = maxThumb;

        const updateSlider = () => {
            const minPercent = (this.state.filters.minAmount / 1000000) * 100;
            const maxPercent = (this.state.filters.maxAmount / 1000000) * 100;

            range.style.left = `${minPercent}%`;
            range.style.width = `${maxPercent - minPercent}%`;

            minThumb.style.left = `${minPercent}%`;
            maxThumb.style.left = `${maxPercent}%`;

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
                        document.getElementById('analyticsMinAmountInput').value = value;
                    }
                } else {
                    if (value > this.state.filters.minAmount) {
                        this.state.filters.maxAmount = value;
                        document.getElementById('analyticsMaxAmountInput').value = value;
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

        minThumb.addEventListener('mousedown', (e) => startDrag(e, 'min'));
        maxThumb.addEventListener('mousedown', (e) => startDrag(e, 'max'));
        minThumb.addEventListener('touchstart', (e) => startDrag(e, 'min'));
        maxThumb.addEventListener('touchstart', (e) => startDrag(e, 'max'));

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
        const startDate = document.getElementById('analyticsStartDate');
        const endDate = document.getElementById('analyticsEndDate');

        if (startDate) {
            startDate.addEventListener('change', (e) => {
                this.state.filters.startDate = e.target.value;
                this.debouncedApplyFilters();
            });
        }

        if (endDate) {
            endDate.addEventListener('change', (e) => {
                this.state.filters.endDate = e.target.value;
                this.debouncedApplyFilters();
            });
        }

        // Budget et Catégorie
        const budgetFilter = document.getElementById('analyticsBudgetFilter');
        const categoryFilter = document.getElementById('analyticsCategoryFilter');

        if (budgetFilter) {
            budgetFilter.addEventListener('change', (e) => {
                this.handleBudgetFilterChange(e.target.value);
                this.debouncedApplyFilters();
            });
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.state.filters.selectedCategory = parseInt(e.target.value);
                this.debouncedApplyFilters();
            });
        }

        // Inputs de montant
        const minAmountInput = document.getElementById('analyticsMinAmountInput');
        const maxAmountInput = document.getElementById('analyticsMaxAmountInput');

        if (minAmountInput) {
            minAmountInput.addEventListener('input', () => {
                const min = parseInt(minAmountInput.value) || 0;
                const max = this.state.filters.maxAmount;

                if (min >= 0 && min <= 1000000 && min <= max) {
                    this.state.filters.minAmount = min;
                    this.updateSliderFromInputs();
                    this.debouncedApplyFilters();
                }
            });
        }

        if (maxAmountInput) {
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
    }

    handleBudgetFilterChange(budgetId) {
        const budgetIdNum = parseInt(budgetId);
        this.state.filters.selectedBudget = budgetIdNum;

        const categoryFilter = document.getElementById('analyticsCategoryFilter');

        if (budgetIdNum === 0) {
            this.populateCategoryFilter(this.categories);
        } else {
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

            const range = document.querySelector('.analytics-slider-range');
            range.style.left = `${minPercent}%`;
            range.style.width = `${maxPercent - minPercent}%`;

            document.getElementById('analyticsMinSliderValue').textContent = this.formatAmount(this.state.filters.minAmount);
            document.getElementById('analyticsMaxSliderValue').textContent = this.formatAmount(this.state.filters.maxAmount);
        }

        this.updateAmountLabels(this.state.filters.minAmount, this.state.filters.maxAmount);
    }

    updateAmountLabels(min, max) {
        const minLabel = document.getElementById('analyticsMinAmountLabel');
        const maxLabel = document.getElementById('analyticsMaxAmountLabel');

        if (minLabel) minLabel.textContent = `${min.toLocaleString('fr-FR')} FCFA`;
        if (maxLabel) maxLabel.textContent = `${max.toLocaleString('fr-FR')} FCFA`;
    }

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

            if (expDate < startDate || expDate > endDate) {
                return false;
            }

            if (this.state.filters.selectedBudget !== 0 &&
                expense.IdBudget !== this.state.filters.selectedBudget) {
                return false;
            }

            if (this.state.filters.selectedCategory !== 0 &&
                expense.id_categorie_depense !== this.state.filters.selectedCategory) {
                return false;
            }

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
        document.getElementById('analyticsStartDate').value = this.state.filters.startDate;
        document.getElementById('analyticsEndDate').value = this.state.filters.endDate;

        const budgetFilter = document.getElementById('analyticsBudgetFilter');
        budgetFilter.innerHTML = '<option value="0">Tous les budgets</option>';

        this.budgets.forEach(budget => {
            const option = document.createElement('option');
            option.value = budget.id;
            option.textContent = budget.libelle;
            budgetFilter.appendChild(option);
        });

        this.populateCategoryFilter(this.categories);

        document.getElementById('analyticsMinAmountInput').value = this.state.filters.minAmount;
        document.getElementById('analyticsMaxAmountInput').value = this.state.filters.maxAmount;
        this.updateAmountLabels(this.state.filters.minAmount, this.state.filters.maxAmount);
    }

    populateCategoryFilter(categories) {
        const categoryFilter = document.getElementById('analyticsCategoryFilter');
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
     * GRAPHIQUE EN BARRES
     * ============================================
     */
    renderBarChart(filteredExpenses) {
        const ctx = document.getElementById('analyticsBarChart');
        if (!ctx) return;

        const emptyState = document.getElementById('analyticsBarChartEmpty');

        if (this.barChart) {
            this.barChart.destroy();
        }

        if (filteredExpenses.length === 0) {
            emptyState.style.display = 'block';
            ctx.style.display = 'none';
            return;
        }

        emptyState.style.display = 'none';
        ctx.style.display = 'block';

        const startDate = new Date(this.state.filters.startDate);
        const endDate = new Date(this.state.filters.endDate);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let labels = [];
        let data = [];

        if (diffDays <= 7) {
            for (let i = 0; i <= diffDays; i++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + i);

                labels.push(currentDate.toLocaleDateString(this.state.locale, { weekday: 'short' }));

                const dayExpenses = filteredExpenses.filter(exp => {
                    const expDate = this.parseExpenseDate(exp.created_at);
                    return expDate.toDateString() === currentDate.toDateString();
                });

                data.push(dayExpenses.reduce((sum, exp) => sum + exp.montant, 0));
            }
        } else if (diffDays <= 30) {
            const weeksCount = Math.ceil(diffDays / 7);

            for (let week = 0; week < weeksCount; week++) {
                const weekStart = new Date(startDate);
                weekStart.setDate(startDate.getDate() + (week * 7));

                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);

                labels.push(`Sem ${week + 1}`);

                const weekExpenses = filteredExpenses.filter(exp => {
                    const expDate = this.parseExpenseDate(exp.created_at);
                    return expDate >= weekStart && expDate <= weekEnd;
                });

                data.push(weekExpenses.reduce((sum, exp) => sum + exp.montant, 0));
            }
        } else if (diffDays > 365) {
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
            const startMonth = startDate.getMonth();
            const startYear = startDate.getFullYear();
            const endMonth = endDate.getMonth();
            const endYear = endDate.getFullYear();

            let currentMonth = startMonth;
            let currentYear = startYear;

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
            }
        }

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
     * GRAPHIQUE EN CAMEMBERT
     * ============================================
     */
    renderPieChart(filteredExpenses) {
        const ctx = document.getElementById('analyticsPieChart');
        if (!ctx) return;

        const legendContainer = document.getElementById('analyticsPieChartLegend');
        const emptyState = document.getElementById('analyticsPieChartEmpty');

        if (this.pieChart) {
            this.pieChart.destroy();
        }

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
            ctx.style.display = 'none';
            legendContainer.innerHTML = '';
            return;
        }

        emptyState.style.display = 'none';
        ctx.style.display = 'block';

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

        const pieData = {
            labels: categoryData.map(cat => cat.nom),
            datasets: [{
                data: categoryData.map(cat => cat.montant),
                backgroundColor: categoryData.map(cat => cat.color),
                borderWidth: 1,
                borderColor: 'white'
            }]
        };

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

        this.renderPieChartLegend(categoryData, totalAmount);
    }

    renderPieChartLegend(categoryData, totalAmount) {
        const legendContainer = document.getElementById('analyticsPieChartLegend');

        let legendHTML = '';

        categoryData.forEach(cat => {
            const percentage = ((cat.montant / totalAmount) * 100).toFixed(1);

            legendHTML += `
                <div class="analytics-legend-item">
                    <div class="analytics-legend-color" style="background-color: ${cat.color}"></div>
                    <div class="analytics-legend-text">
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

    showFilteringIndicator() {
        const indicator = document.getElementById('analyticsFilteringIndicator');
        if (indicator) indicator.style.display = 'flex';
    }

    hideFilteringIndicator() {
        setTimeout(() => {
            const indicator = document.getElementById('analyticsFilteringIndicator');
            if (indicator) indicator.style.display = 'none';
        }, 300);
    }
}

// Initialiser le dashboard quand le document est prêt
$(document).ready(function() {
    window.analyticsDashboard = new AnalyticsDashboard();
});
