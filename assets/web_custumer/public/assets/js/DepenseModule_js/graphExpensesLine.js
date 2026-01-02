class ExpenseChart {
    constructor() {
        this.expenses = [];
        this.categories = [];
        
        this.state = {
            timeframe: 'month',
            locale: 'fr-FR'
        };
        
        this.expenseChart = null;
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.render();
    }

    /**
     * ============================================
     * CHARGEMENT DES DONNÉES DEPUIS L'API
     * ============================================
     */
    async loadData() {
        try {
          //  console.log('=== DÉBUT loadData (Graph) ===');
            
            await this.loadRealApiData();
            
            this.calculateStats();
            this.renderChart();
            this.renderCategories();
            
         //   console.log('=== FIN loadData (Graph) - SUCCÈS ===');
            
        } catch (error) {
            console.error('Erreur de chargement:', error);
            alert('Erreur lors du chargement des données du graphique');
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
                created_at: exp.created_at
            }));
        }

       // console.log('Données chargées - Categories:', this.categories.length, 'Expenses:', this.expenses.length);
    }

    /**
     * ============================================
     * CONFIGURATION DES ÉVÉNEMENTS
     * ============================================
     */
    setupEventListeners() {
        // Boutons de période
        document.querySelectorAll('.time-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const timeframe = e.currentTarget.dataset.timeframe;
                this.setTimeframe(timeframe);
            });
        });
        
        // Boutons de navigation du scroll
        const scrollLeftBtn = document.getElementById('scrollLeftBtn');
        const scrollRightBtn = document.getElementById('scrollRightBtn');
        
        if (scrollLeftBtn) {
            scrollLeftBtn.addEventListener('click', () => {
                this.scrollCategories(-200);
            });
        }
        
        if (scrollRightBtn) {
            scrollRightBtn.addEventListener('click', () => {
                this.scrollCategories(200);
            });
        }
    }

    setTimeframe(timeframe) {
        if (this.state.timeframe === timeframe) return;
        
        this.state.timeframe = timeframe;
        
        // Mettre à jour les boutons actifs
        document.querySelectorAll('.time-filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.timeframe === timeframe);
        });
        
        // Recalculer et mettre à jour l'affichage
        this.calculateStats();
        this.renderChart();
        this.renderCategories();
    }

    scrollCategories(distance) {
        const categoriesList = document.getElementById('categoriesList');
        if (categoriesList) {
            categoriesList.scrollBy({
                left: distance,
                behavior: 'smooth'
            });
        }
    }

    /**
     * ============================================
     * UTILITAIRES DE DATE
     * ============================================
     */
    parseExpenseDate(dateString) {
        if (typeof dateString === 'string' && dateString.includes('/')) {
            const [day, month, year] = dateString.split('/');
            return new Date(`${year}-${month}-${day}`);
        }
        return new Date(dateString || 0);
    }

    getStartOfWeek(date) {
        const d = new Date(date);
        let day = d.getDay();
        day = day === 0 ? 7 : day;
        d.setDate(d.getDate() - day + 1);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    formatDate(date) {
        return date.toLocaleDateString(this.state.locale, {
            day: '2-digit',
            month: 'short'
        });
    }

    /**
     * ============================================
     * CALCUL DES STATISTIQUES
     * ============================================
     */
    calculateStats() {
        const now = new Date();
        
        const filteredExpenses = this.expenses.filter(exp => {
            const expDate = this.parseExpenseDate(exp.created_at);
            if (isNaN(expDate.getTime())) return false;
            
            if (this.state.timeframe === 'week') {
                const currentWeekStart = this.getStartOfWeek(now);
                const currentWeekEnd = new Date(currentWeekStart);
                currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);
                currentWeekEnd.setHours(23, 59, 59, 999);
                
                const effectiveEnd = now < currentWeekEnd ? now : currentWeekEnd;
                return expDate >= currentWeekStart && expDate <= effectiveEnd;
                    
            } else if (this.state.timeframe === 'month') {
                return (
                    expDate.getMonth() === now.getMonth() &&
                    expDate.getFullYear() === now.getFullYear()
                );
                    
            } else if (this.state.timeframe === 'year') {
                return expDate.getFullYear() === now.getFullYear();
            }
            return false;
        });
        
        const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.montant || 0), 0);
        
        this.updateTotalSection(totalExpenses);
        this.calculateComparison(totalExpenses);
        
        return {
            filteredExpenses,
            totalExpenses
        };
    }

    updateTotalSection(totalExpenses) {
        const totalElement = document.getElementById('totalExpenses');
        if (totalElement) {
            totalElement.textContent = totalExpenses.toLocaleString(this.state.locale) + ' FCFA';
        }
    }

    calculateComparison(currentTotal) {
        const now = new Date();
        let previousPeriodTotal = 0;
        let previousPeriodLabel = '';
        
        const getPreviousPeriodRange = (date) => {
            const start = new Date(date);
            const end = new Date(date);

            if (this.state.timeframe === 'week') {
                const currentWeekStart = this.getStartOfWeek(date);
                
                end.setTime(currentWeekStart.getTime());
                end.setDate(end.getDate() - 1);
                end.setHours(23, 59, 59, 999);
                
                start.setTime(end.getTime());
                start.setDate(start.getDate() - 6);
                start.setHours(0, 0, 0, 0);
                
                previousPeriodLabel = 'vs sem. préc.';
                
            } else if (this.state.timeframe === 'month') {
                start.setMonth(date.getMonth() - 1, 1);
                start.setHours(0, 0, 0, 0);
                end.setMonth(date.getMonth(), 0);
                end.setHours(23, 59, 59, 999);

                const monthName = new Date(start).toLocaleDateString(this.state.locale, { month: 'short' });
                previousPeriodLabel = `vs ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`;
                
            } else if (this.state.timeframe === 'year') {
                start.setFullYear(date.getFullYear() - 1, 0, 1);
                start.setHours(0, 0, 0, 0);
                end.setFullYear(date.getFullYear() - 1, 11, 31);
                end.setHours(23, 59, 59, 999);
                
                previousPeriodLabel = `vs ${date.getFullYear() - 1}`;
            }
            
            return { start, end };
        };

        const { start: prevStart, end: prevEnd } = getPreviousPeriodRange(now);

        const previousExpenses = this.expenses.filter(exp => {
            const expDate = this.parseExpenseDate(exp.created_at);
            if (isNaN(expDate.getTime())) return false;
            return expDate >= prevStart && expDate <= prevEnd;
        });

        previousPeriodTotal = previousExpenses.reduce((sum, exp) => sum + parseFloat(exp.montant || 0), 0);

        const comparisonBadge = document.getElementById('comparisonBadge');
        const comparisonText = document.getElementById('comparisonText');
        
        if (!comparisonBadge || !comparisonText) return;

        if (previousPeriodTotal === 0) {
            if (currentTotal > 0) {
                comparisonBadge.style.display = 'flex';
                comparisonText.textContent = `Nouvelle dépense ${previousPeriodLabel}`;
            } else {
                comparisonBadge.style.display = 'none';
            }
        } else {
            const percentageChange = ((currentTotal - previousPeriodTotal) / previousPeriodTotal) * 100;
            const changeText = `${percentageChange > 0 ? '+' : ''}${percentageChange.toFixed(1)}%`;
            
            comparisonBadge.style.display = 'flex';
            comparisonText.textContent = `${changeText} ${previousPeriodLabel}`;
        }
    }

    /**
     * ============================================
     * RENDU DU GRAPHIQUE
     * ============================================
     */
    renderChart() {
        const ctx = document.getElementById('expenseChart');
        if (!ctx) return;
        
        const stats = this.calculateStats();
        const filteredExpenses = stats.filteredExpenses;
        
        if (this.expenseChart) {
            this.expenseChart.destroy();
        }
        
        let labels = [];
        let data = [];
        
        const dataMap = new Map();
        
        filteredExpenses.forEach(exp => {
            const expDate = this.parseExpenseDate(exp.created_at);
            const amount = parseFloat(exp.montant || 0);
            
            let key;
            let label;
            
            label = this.formatDate(expDate);
            key = expDate.toISOString().split('T')[0];
            
            if (key) {
                const currentValue = dataMap.get(key) || { label, total: 0, date: expDate };
                currentValue.total += amount;
                dataMap.set(key, currentValue);
            }
        });
        
        const sortedEntries = Array.from(dataMap.entries())
            .sort((a, b) => a[1].date - b[1].date);
        
        labels = sortedEntries.map(entry => entry[1].label);
        data = sortedEntries.map(entry => entry[1].total);
        
        if (data.length === 0) {
            labels = ['Pas de données'];
            data = [0];
        }
        
        this.expenseChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Dépenses',
                    data: data,
                    borderColor: '#FFC107',
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointBackgroundColor: '#FFC107'
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
                            },
                            title: (context) => {
                                return context[0].label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: this.state.timeframe === 'week' ? 7 : this.state.timeframe === 'month' ? 5 : 12
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString('fr-FR') + ' FCFA';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                }
            }
        });
    }

    /**
     * ============================================
     * RENDU DES CATÉGORIES
     * ============================================
     */
    renderCategories() {
        const categoriesList = document.getElementById('categoriesList');
        if (!categoriesList) return;
        
        const stats = this.calculateStats();
        const filteredExpenses = stats.filteredExpenses;
        const totalExpenses = stats.totalExpenses;
        
        const categoryMap = new Map();
        
        filteredExpenses.forEach(exp => {
            const categoryId = exp.id_categorie_depense;
            const amount = parseFloat(exp.montant || 0);
            
            if (categoryId) {
                const current = categoryMap.get(categoryId) || { amount: 0, count: 0 };
                current.amount += amount;
                current.count += 1;
                categoryMap.set(categoryId, current);
            }
        });
        
        const categoryData = Array.from(categoryMap.entries()).map(([categoryId, data]) => {
            const category = this.categories.find(c => c.id === categoryId);
            const percentage = totalExpenses > 0 ? ((data.amount / totalExpenses) * 100).toFixed(0) + '%' : '0%';
            
            return {
                id: categoryId,
                nom: category ? category.nom : 'Catégorie inconnue',
                montant: data.amount,
                percentage: percentage,
                color: category ? category.color : '#6c757d',
                count: data.count
            };
        }).sort((a, b) => b.montant - a.montant);
        
        if (categoryData.length === 0) {
            categoriesList.innerHTML = `
                <div class="empty-state">
                    <i class="la la-pie-chart"></i>
                    <div class="empty-state-text">Aucune dépense catégorisée pour cette période</div>
                </div>
            `;
            return;
        }
        
        let categoriesHTML = '';
        
        categoryData.forEach(cat => {
            categoriesHTML += `
                <div class="category-card-graph">
                    <div class="category-name">${cat.nom}</div>
                    <div class="category-amount">${cat.montant.toLocaleString(this.state.locale)} FCFA</div>
                    <div class="category-percentage">${cat.percentage}</div>
                </div>
            `;
        });
        
        categoriesList.innerHTML = categoriesHTML;
    }

    /**
     * ============================================
     * RENDU COMPLET
     * ============================================
     */
    render() {
        this.calculateStats();
        this.renderChart();
        this.renderCategories();
    }
}

// Initialiser le graphique quand le document est prêt
$(document).ready(function() {
    window.expenseChart = new ExpenseChart();
});