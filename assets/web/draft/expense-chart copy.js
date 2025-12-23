class ExpenseChart {
    constructor() {
        this.expenses = [];
        this.categories = [];
        
        // État
        this.state = {
            timeframe: 'month',
            isLoading: false,
            locale: 'fr-FR'
        };
        
        // Chart instance
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
     * CHARGEMENT DES DONNÉES
     * ============================================
     */
    async loadData() {
        try {
            this.showSpinner('Chargement des données...');
            
            await this.simulateApiCalls();
            
            this.calculateStats();
            this.renderChart();
            this.renderCategories();
            
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
                
                // Génération de données de démo pour les dépenses
                this.expenses = this.generateDemoExpenses();
                
                resolve();
            }, 1500);
        });
    }

    generateDemoExpenses() {
        const expenses = [];
        const categories = this.categories;
        const now = new Date();
        
        // Générer des données pour les 365 derniers jours
        for (let i = 0; i < 365; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // Nombre aléatoire de dépenses par jour (0-3)
            const countPerDay = Math.floor(Math.random() * 4);
            
            for (let j = 0; j < countPerDay; j++) {
                const category = categories[Math.floor(Math.random() * categories.length)];
                const amount = Math.floor(Math.random() * 50000) + 1000;
                
                // Format de date : "24/10/2025"
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                
                expenses.push({
                    id: expenses.length + 1,
                    libelle: `Dépense ${expenses.length + 1}`,
                    montant: amount,
                    id_categorie_depense: category.id,
                    created_at: `${day}/${month}/${year}`,
                    is_repetitive: Math.random() > 0.8 ? 1 : 0,
                    status_is_repetitive: Math.random() > 0.5 ? 0 : 1
                });
            }
        }
        
        return expenses;
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
        document.getElementById('scrollLeftBtn').addEventListener('click', () => {
            this.scrollCategories(-200);
        });
        
        document.getElementById('scrollRightBtn').addEventListener('click', () => {
            this.scrollCategories(200);
        });
        
        // Navigation au clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.scrollCategories(-200);
            } else if (e.key === 'ArrowRight') {
                this.scrollCategories(200);
            }
        });
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
        categoriesList.scrollBy({
            left: distance,
            behavior: 'smooth'
        });
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
        day = day === 0 ? 7 : day; // Dimanche = 0, on le convertit en 7
        d.setDate(d.getDate() - day + 1);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    getDayName(date) {
        return date.toLocaleDateString(this.state.locale, { weekday: 'short' });
    }

    getMonthName(date) {
        return date.toLocaleDateString(this.state.locale, { month: 'short' });
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
        
        // Filtrer les dépenses par période
        const filteredExpenses = this.expenses.filter(exp => {
            const expDate = this.parseExpenseDate(exp.created_at);
            if (isNaN(expDate.getTime())) return false;
            
            switch (this.state.timeframe) {
                case 'week': {
                    const currentWeekStart = this.getStartOfWeek(now);
                    const currentWeekEnd = new Date(currentWeekStart);
                    currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);
                    currentWeekEnd.setHours(23, 59, 59, 999);
                    
                    const effectiveEnd = now < currentWeekEnd ? now : currentWeekEnd;
                    return expDate >= currentWeekStart && expDate <= effectiveEnd;
                }
                    
                case 'month':
                    return (
                        expDate.getMonth() === now.getMonth() &&
                        expDate.getFullYear() === now.getFullYear()
                    );
                    
                case 'year':
                    return expDate.getFullYear() === now.getFullYear();
                    
                default:
                    return false;
            }
        });
        
        // Calculer le total
        const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.montant || 0), 0);
        
        // Mettre à jour l'affichage du total
        this.updateTotalSection(totalExpenses);
        
        // Calculer la comparaison
        this.calculateComparison(totalExpenses);
        
        return {
            filteredExpenses,
            totalExpenses
        };
    }

    updateTotalSection(totalExpenses) {
        const totalElement = document.getElementById('totalExpenses');
        totalElement.textContent = totalExpenses.toLocaleString(this.state.locale) + ' FCFA';
    }

    calculateComparison(currentTotal) {
        const now = new Date();
        let previousPeriodTotal = 0;
        let previousPeriodLabel = '';
        
        // Déterminer la période précédente
        if (this.state.timeframe === 'week') {
            const currentWeekStart = this.getStartOfWeek(now);
            const previousWeekEnd = new Date(currentWeekStart);
            previousWeekEnd.setDate(previousWeekEnd.getDate() - 1);
            previousWeekEnd.setHours(23, 59, 59, 999);
            
            const previousWeekStart = new Date(previousWeekEnd);
            previousWeekStart.setDate(previousWeekStart.getDate() - 6);
            previousWeekStart.setHours(0, 0, 0, 0);
            
            previousPeriodLabel = 'vs sem préc';
            
            const previousExpenses = this.expenses.filter(exp => {
                const expDate = this.parseExpenseDate(exp.created_at);
                return expDate >= previousWeekStart && expDate <= previousWeekEnd;
            });
            
            previousPeriodTotal = previousExpenses.reduce((sum, exp) => sum + parseFloat(exp.montant || 0), 0);
            
        } else if (this.state.timeframe === 'month') {
            const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const previousMonthStart = new Date(previousMonth);
            previousMonthStart.setHours(0, 0, 0, 0);
            
            const previousMonthEnd = new Date(previousMonth);
            previousMonthEnd.setMonth(previousMonthEnd.getMonth() + 1);
            previousMonthEnd.setDate(0);
            previousMonthEnd.setHours(23, 59, 59, 999);
            
            const monthName = previousMonth.toLocaleDateString(this.state.locale, { month: 'short' });
            previousPeriodLabel = `vs ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`;
            
            const previousExpenses = this.expenses.filter(exp => {
                const expDate = this.parseExpenseDate(exp.created_at);
                return expDate >= previousMonthStart && expDate <= previousMonthEnd;
            });
            
            previousPeriodTotal = previousExpenses.reduce((sum, exp) => sum + parseFloat(exp.montant || 0), 0);
            
        } else if (this.state.timeframe === 'year') {
            const previousYearStart = new Date(now.getFullYear() - 1, 0, 1);
            const previousYearEnd = new Date(now.getFullYear() - 1, 11, 31);
            
            previousPeriodLabel = `vs ${now.getFullYear() - 1}`;
            
            const previousExpenses = this.expenses.filter(exp => {
                const expDate = this.parseExpenseDate(exp.created_at);
                return expDate >= previousYearStart && expDate <= previousYearEnd;
            });
            
            previousPeriodTotal = previousExpenses.reduce((sum, exp) => sum + parseFloat(exp.montant || 0), 0);
        }
        
        // Calculer le pourcentage de changement
        const comparisonBadge = document.getElementById('comparisonBadge');
        const comparisonText = document.getElementById('comparisonText');
        
        if (previousPeriodTotal === 0) {
            if (currentTotal > 0) {
                // Nouvelle dépense
                comparisonBadge.style.display = 'flex';
                comparisonBadge.style.background = 'var(--yellow_color)';
                comparisonBadge.style.color = 'var(--text-primary)';
                comparisonText.textContent = `Nouvelle dépense ${previousPeriodLabel}`;
            } else {
                comparisonBadge.style.display = 'none';
            }
        } else {
            const percentageChange = ((currentTotal - previousPeriodTotal) / previousPeriodTotal) * 100;
            const changeText = `${percentageChange > 0 ? '+' : ''}${percentageChange.toFixed(1)}%`;
            
            comparisonBadge.style.display = 'flex';
            comparisonBadge.style.background = 'var(--text-primary)';
            comparisonBadge.style.color = 'var(--yellow_color)';
            comparisonText.textContent = `${changeText} ${previousPeriodLabel}`;
        }
    }

    /**
     * ============================================
     * RENDU DU GRAPHIQUE
     * ============================================
     */
    renderChart() {
        const ctx = document.getElementById('expenseChart').getContext('2d');
        const stats = this.calculateStats();
        const filteredExpenses = stats.filteredExpenses;
        
        // Nettoyer le graphique existant
        if (this.expenseChart) {
            this.expenseChart.destroy();
        }
        
        // Préparer les données pour le graphique
        let labels = [];
        let data = [];
        
        // Créer une map pour agréger les données par période
        const dataMap = new Map();
        
        filteredExpenses.forEach(exp => {
            const expDate = this.parseExpenseDate(exp.created_at);
            const amount = parseFloat(exp.montant || 0);
            
            let key;
            let label;
            
            switch (this.state.timeframe) {
                case 'week':
                    // Par jour de la semaine
                    label = this.formatDate(expDate);
                    key = label;
                    break;
                    
                case 'month':
                    // Par semaine du mois
                    const weekOfMonth = Math.floor((expDate.getDate() - 1) / 7) + 1;
                    label = `S${weekOfMonth}`;
                    key = `week-${weekOfMonth}`;
                    break;
                    
                case 'year':
                    // Par mois
                    const month = expDate.getMonth();
                    label = this.getMonthName(expDate);
                    key = `month-${month}`;
                    break;
            }
            
            if (key) {
                const currentValue = dataMap.get(key) || { label, total: 0 };
                currentValue.total += amount;
                dataMap.set(key, currentValue);
            }
        });
        
        // Convertir la map en tableaux pour Chart.js
        const sortedEntries = Array.from(dataMap.entries()).sort((a, b) => {
            // Trier par date/ordre chronologique
            if (this.state.timeframe === 'week') {
                const dateA = this.parseExpenseDate(a[1].label);
                const dateB = this.parseExpenseDate(b[1].label);
                return dateA - dateB;
            } else if (this.state.timeframe === 'month') {
                const weekA = parseInt(a[0].split('-')[1]);
                const weekB = parseInt(b[0].split('-')[1]);
                return weekA - weekB;
            } else {
                const monthA = parseInt(a[0].split('-')[1]);
                const monthB = parseInt(b[0].split('-')[1]);
                return monthA - monthB;
            }
        });
        
        labels = sortedEntries.map(entry => entry[1].label);
        data = sortedEntries.map(entry => entry[1].total);
        
        // Si pas de données, afficher un état vide
        if (data.length === 0) {
            labels = ['Pas de données'];
            data = [0];
        }
        
        // Configurer les options du graphique selon la période
        let xAxisConfig = {};
        
        switch (this.state.timeframe) {
            case 'week':
                xAxisConfig = {
                    ticks: {
                        callback: function(value, index, values) {
                            // Afficher tous les labels
                            return labels[index] || '';
                        },
                        maxTicksLimit: 7
                    }
                };
                break;
                
            case 'month':
                xAxisConfig = {
                    ticks: {
                        callback: function(value, index, values) {
                            // Afficher seulement certains labels (1, 8, 15, 22, 29)
                            const shouldShow = index % 7 === 0;
                            return shouldShow ? labels[index] || '' : '';
                        },
                        maxTicksLimit: 5
                    }
                };
                break;
                
            case 'year':
                xAxisConfig = {
                    ticks: {
                        callback: function(value, index, values) {
                            // Afficher tous les mois
                            return labels[index] || '';
                        }
                    }
                };
                break;
        }
        
        // Créer le graphique
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
                    pointHoverRadius: 5
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
                            label: function(context) {
                                return `Dépenses: ${context.parsed.y.toLocaleString('fr-FR')} FCFA`;
                            }
                        }
                    }
                },
                scales: {
                    x: xAxisConfig,
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
                },
                elements: {
                    line: {
                        tension: 0.3
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
        const stats = this.calculateStats();
        const filteredExpenses = stats.filteredExpenses;
        const totalExpenses = stats.totalExpenses;
        
        // Calculer les montants par catégorie
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
        
        // Préparer les données des catégories
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
        
        // Générer le HTML des catégories
        if (categoryData.length === 0) {
            categoriesList.innerHTML = `
                <div class="empty-state" style="width: 100%; min-width: 100%;">
                    <i class="bi bi-pie-chart"></i>
                    <div class="empty-state-text">Aucune dépense catégorisée pour cette période</div>
                </div>
            `;
            return;
        }
        
        let categoriesHTML = '';
        
        categoryData.forEach(cat => {
            categoriesHTML += `
                <div class="category-card">
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

    /**
     * ============================================
     * UTILITAIRES
     * ============================================
     */
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
        // Créer une notification toast
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

// Initialiser le graphique quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    const expenseChart = new ExpenseChart();
    window.expenseChart = expenseChart; // Pour le débogage
});