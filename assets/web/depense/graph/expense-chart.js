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
                
                // Génération de données de démo pour les dépenses (plus réaliste)
                this.expenses = this.generateDemoExpenses();
                
                resolve();
            }, 1500);
        });
    }

    generateDemoExpenses() {
        const expenses = [];
        const categories = this.categories;
        const now = new Date();
        
        // Générer des données pour les 365 derniers jours avec plus de réalisme
        for (let i = 0; i < 365; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // Tendance: plus de dépenses récemment
            const recentFactor = i < 30 ? 0.7 : i < 90 ? 0.5 : 0.3;
            const countPerDay = Math.floor(Math.random() * 4 * recentFactor);
            
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
        
        // Trier par date décroissante (comme votre code React)
        return expenses.sort((a, b) => {
            const dateA = this.parseExpenseDate(a.created_at);
            const dateB = this.parseExpenseDate(b.created_at);
            return dateB - dateA; // Décroissant
        });
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
     * CALCUL DES STATISTIQUES (CORRIGÉ)
     * ============================================
     */
    calculateStats() {
        const now = new Date();
        
        // Filtrer les dépenses par période (EXACTEMENT comme React Native)
        const filteredExpenses = this.expenses.filter(exp => {
            const expDate = this.parseExpenseDate(exp.created_at);
            if (isNaN(expDate.getTime())) return false;
            
            if (this.state.timeframe === 'week') {
                // Pour la semaine normale (lundi à dimanche)
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
        
        // Calculer le total
        const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.montant || 0), 0);
        
        // Mettre à jour l'affichage du total
        this.updateTotalSection(totalExpenses);
        
        // Calculer la comparaison (EXACTEMENT comme React Native)
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
        
        // Fonction de détermination des dates (EXACTEMENT comme React Native)
        const getPreviousPeriodRange = (date) => {
            const start = new Date(date);
            const end = new Date(date);

            if (this.state.timeframe === 'week') {
                // Pour la semaine normale (lundi à dimanche)
                const currentWeekStart = this.getStartOfWeek(date);
                
                // Fin de la semaine précédente (dimanche de la semaine passée)
                end.setTime(currentWeekStart.getTime());
                end.setDate(end.getDate() - 1);
                end.setHours(23, 59, 59, 999);
                
                // Début de la semaine précédente (lundi de la semaine passée)
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

        // Filtrage et total de la période précédente
        const previousExpenses = this.expenses.filter(exp => {
            const expDate = this.parseExpenseDate(exp.created_at);
            if (isNaN(expDate.getTime())) return false;
            return expDate >= prevStart && expDate <= prevEnd;
        });

        previousPeriodTotal = previousExpenses.reduce((sum, exp) => sum + parseFloat(exp.montant || 0), 0);

        // Calcul du pourcentage de changement (EXACTEMENT comme React Native)
        const comparisonBadge = document.getElementById('comparisonBadge');
        const comparisonText = document.getElementById('comparisonText');
        
        if (!comparisonBadge || !comparisonText) return;

        if (previousPeriodTotal === 0) {
            if (currentTotal > 0) {
                // Cas: Nouvelle dépense (pas de données précédentes)
                comparisonBadge.style.display = 'flex';
                comparisonBadge.style.background = 'var(--text-primary)';
                comparisonBadge.style.color = 'var(--yellow_color)';
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
     * RENDU DU GRAPHIQUE (CORRIGÉ POUR LA CHRONOLOGIE)
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
            
            // TOUJOURS utiliser le format date pour l'axe X
            label = this.formatDate(expDate); // "24 oct"
            key = expDate.toISOString().split('T')[0]; // "2024-10-24" pour le tri
            
            if (key) {
                const currentValue = dataMap.get(key) || { label, total: 0, date: expDate };
                currentValue.total += amount;
                dataMap.set(key, currentValue);
            }
        });
        
        // Convertir la map en tableaux pour Chart.js - TRIER PAR DATE CROISSANTE
        const sortedEntries = Array.from(dataMap.entries())
            .sort((a, b) => {
                // Trier par date croissante (du plus ancien au plus récent)
                return a[1].date - b[1].date;
            });
        
        // Extraire les labels et données triées
        labels = sortedEntries.map(entry => entry[1].label);
        data = sortedEntries.map(entry => entry[1].total);
        
        // Si pas de données, afficher un état vide
        if (data.length === 0) {
            labels = ['Pas de données'];
            data = [0];
        }
        
        // Configurer les options du graphique selon la période
        let xAxisConfig = {
            ticks: {
                autoSkip: true,
                maxTicksLimit: this.getMaxTicksLimit(),
                callback: (value, index) => {
                    return this.formatXLabel(labels[index], index);
                }
            }
        };
        
        // Créer le graphique avec les bonnes options
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
                    },
                    point: {
                        radius: 0,
                        hoverRadius: 6
                    }
                }
            }
        });
    }

    /**
     * ============================================
     * FONCTIONS D'AIDE POUR LE GRAPHIQUE
     * ============================================
     */
    getMaxTicksLimit() {
        switch (this.state.timeframe) {
            case 'week':
                return 7; // Maximum 7 jours
            case 'month':
                return 5; // Maximum 5 labels (1, 8, 15, 22, 29)
            case 'year':
                return 12; // Maximum 12 mois
            default:
                return 10;
        }
    }

    formatXLabel(label, index) {
        const labels = this.getCurrentChartLabels();
        
        if (this.state.timeframe === 'week') {
            // Affiche tous les labels (1 pour chaque jour)
            return label;
        }

        if (this.state.timeframe === 'month') {
            // Affiche seulement un label pour les 1, 8, 15, 22, 29 etc.
            // On vérifie si c'est le 1er, 8ème, 15ème, etc. jour du mois
            // Pour cela, on extrait le jour du label (ex: "24 oct" -> 24)
            const dayMatch = label.match(/(\d+)/);
            if (dayMatch) {
                const day = parseInt(dayMatch[1]);
                // Afficher seulement pour les jours: 1, 8, 15, 22, 29
                return (day % 7 === 1) ? label : '';
            }
            return (index % 7 === 0) ? label : '';
        }
        
        if (this.state.timeframe === 'year') {
            // Pour l'année, afficher un label tous les 10 points environ
            return (index % Math.ceil(labels.length / 12) === 0) ? label : '';
        }
        
        return label;
    }

    getCurrentChartLabels() {
        if (this.expenseChart && this.expenseChart.data && this.expenseChart.data.labels) {
            return this.expenseChart.data.labels;
        }
        return [];
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
        
        if (spinnerText) spinnerText.textContent = message;
        if (spinner) spinner.style.display = 'flex';
    }

    hideSpinner() {
        const spinner = document.getElementById('spinnerOverlay');
        if (spinner) spinner.style.display = 'none';
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
    window.expenseChart = expenseChart;
});