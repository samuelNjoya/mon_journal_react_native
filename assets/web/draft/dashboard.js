class Dashboard {
    constructor() {
        this.expenses = [];
        this.categories = [];
        
        // État
        this.state = {
            timeframe: 'today',
            isLoading: false,
            locale: 'fr-FR'
        };
        
        // Chart instance
        this.expensesChart = null;
        
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
            this.showSpinner('Chargement du dashboard...');
            
            await this.simulateApiCalls();
            
            this.updatePeriodHeader();
            this.calculateStats();
            this.renderTopCategories();
            this.renderChart();
            
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
                    { id: 1, nom: 'Nourriture', color: '#4CAF50', icon: 'bi-cart' },
                    { id: 2, nom: 'Transport', color: '#2196F3', icon: 'bi-car-front' },
                    { id: 3, nom: 'Logement', color: '#FF9800', icon: 'bi-house' },
                    { id: 4, nom: 'Loisirs', color: '#9C27B0', icon: 'bi-controller' },
                    { id: 5, nom: 'Santé', color: '#F44336', icon: 'bi-heart-pulse' },
                    { id: 6, nom: 'Éducation', color: '#009688', icon: 'bi-book' },
                    { id: 7, nom: 'Shopping', color: '#E91E63', icon: 'bi-bag' },
                    { id: 8, nom: 'Restaurant', color: '#795548', icon: 'bi-cup' },
                    { id: 9, nom: 'Voyage', color: '#3F51B5', icon: 'bi-airplane' },
                    { id: 10, nom: 'Épargne', color: '#00BCD4', icon: 'bi-piggy-bank' }
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
        
        // Générer des données pour les 90 derniers jours
        for (let i = 0; i < 90; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // Nombre aléatoire de dépenses par jour (0-5)
            const countPerDay = Math.floor(Math.random() * 6);
            
            for (let j = 0; j < countPerDay; j++) {
                const category = categories[Math.floor(Math.random() * categories.length)];
                const amount = Math.floor(Math.random() * 50000) + 1000;
                
                expenses.push({
                    id: expenses.length + 1,
                    libelle: `Dépense ${expenses.length + 1}`,
                    montant: amount,
                    id_categorie_depense: category.id,
                    created_at: date.toISOString().split('T')[0],
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
        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const timeframe = e.currentTarget.dataset.timeframe;
                this.setTimeframe(timeframe);
            });
        });
    }

    setTimeframe(timeframe) {
        if (this.state.timeframe === timeframe) return;
        
        this.state.timeframe = timeframe;
        
        // Mettre à jour les boutons actifs
        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.timeframe === timeframe);
        });
        
        // Recalculer et mettre à jour l'affichage
        this.updatePeriodHeader();
        this.calculateStats();
        this.renderTopCategories();
        this.renderChart();
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
        return date.toLocaleDateString(this.state.locale, { weekday: 'long' });
    }

    getMonthName(date) {
        return date.toLocaleDateString(this.state.locale, { month: 'long' });
    }

    formatDate(date) {
        return date.toLocaleDateString(this.state.locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    /**
     * ============================================
     * MISE À JOUR DE L'UI
     * ============================================
     */
    updatePeriodHeader() {
        const now = new Date();
        let periodText = '';
        
        switch (this.state.timeframe) {
            case 'today':
                periodText = now.toLocaleDateString(this.state.locale, {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                });
                break;
                
            case 'week': {
                const weekStart = this.getStartOfWeek(now);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                
                const startDay = weekStart.toLocaleDateString(this.state.locale, { day: '2-digit' });
                const endDay = weekEnd.toLocaleDateString(this.state.locale, { day: '2-digit' });
                const monthYear = weekEnd.toLocaleDateString(this.state.locale, { month: 'long', year: 'numeric' });
                
                periodText = `Semaine du ${startDay} au ${endDay} ${monthYear}`;
                break;
            }
                
            case 'month': {
                const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
                const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                
                const startDay = firstDay.toLocaleDateString(this.state.locale, { day: '2-digit' });
                const endDay = lastDay.toLocaleDateString(this.state.locale, { day: '2-digit' });
                const monthYear = lastDay.toLocaleDateString(this.state.locale, { month: 'long', year: 'numeric' });
                
                periodText = `Du ${startDay} au ${endDay} ${monthYear}`;
                break;
            }
                
            case 'year': {
                const firstDay = new Date(now.getFullYear(), 0, 1);
                const lastDay = new Date(now.getFullYear(), 11, 31);
                
                const startDay = firstDay.toLocaleDateString(this.state.locale, { day: '2-digit', month: 'long' });
                const endDay = lastDay.toLocaleDateString(this.state.locale, { day: '2-digit', month: 'long', year: 'numeric' });
                
                periodText = `Du ${startDay} au ${endDay}`;
                break;
            }
        }
        
        document.getElementById('periodText').textContent = periodText;
    }

    calculateStats() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // Filtrer les dépenses par période
        const filteredExpenses = this.expenses.filter(exp => {
            const expDate = this.parseExpenseDate(exp.created_at);
            if (isNaN(expDate.getTime())) return false;
            
            switch (this.state.timeframe) {
                case 'today':
                    return (
                        expDate.getDate() === today.getDate() &&
                        expDate.getMonth() === today.getMonth() &&
                        expDate.getFullYear() === today.getFullYear()
                    );
                    
                case 'week': {
                    const weekStart = this.getStartOfWeek(now);
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekEnd.getDate() + 6);
                    weekEnd.setHours(23, 59, 59, 999);
                    
                    const effectiveEnd = now < weekEnd ? now : weekEnd;
                    return expDate >= weekStart && expDate <= effectiveEnd;
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
        const totalAmount = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.montant || 0), 0);
        const transactionCount = filteredExpenses.length;
        
        // Mettre à jour les totaux
        this.updateTotalSection(totalAmount, transactionCount);
        
        // Mettre à jour les statistiques détaillées
        this.updateDetailedStats(filteredExpenses, totalAmount);
    }

    updateTotalSection(totalAmount, transactionCount) {
        // Mettre à jour les labels selon la période
        let totalLabel = '';
        let mainStatLabel = '';
        
        switch (this.state.timeframe) {
            case 'today':
                totalLabel = 'Dépenses quotidiennes';
                mainStatLabel = 'Dépenses du jour';
                break;
            case 'week':
                totalLabel = 'Dépenses hebdomadaires';
                mainStatLabel = 'Dépenses de la semaine';
                break;
            case 'month':
                totalLabel = 'Dépenses mensuelles';
                mainStatLabel = 'Dépenses du mois';
                break;
            case 'year':
                totalLabel = 'Dépenses annuelles';
                mainStatLabel = 'Dépenses de l\'année';
                break;
        }
        
        document.getElementById('totalLabel').textContent = totalLabel;
        document.getElementById('mainStatLabel').textContent = mainStatLabel;
        
        // Mettre à jour les montants
        document.getElementById('totalAmount').textContent = totalAmount.toLocaleString(this.state.locale) + ' FCFA';
        document.getElementById('mainStatValue').textContent = totalAmount.toLocaleString(this.state.locale) + ' FCFA';
        
        // Mettre à jour le sous-texte
        const plural = transactionCount > 1 ? 's' : '';
        document.getElementById('mainStatSubtext').textContent = `${transactionCount} dépense${plural}`;
        
        // Calculer et afficher la tendance
        this.calculateTrend(totalAmount);
    }

    calculateTrend(currentAmount) {
        const now = new Date();
        let previousPeriodTotal = 0;
        let previousPeriodLabel = '';
        
        const getPreviousPeriodRange = () => {
            const start = new Date(now);
            const end = new Date(now);
            
            switch (this.state.timeframe) {
                case 'today': {
                    start.setDate(now.getDate() - 1);
                    start.setHours(0, 0, 0, 0);
                    end.setDate(now.getDate() - 1);
                    end.setHours(23, 59, 59, 999);
                    previousPeriodLabel = 'vs hier';
                    break;
                }
                case 'week': {
                    const currentWeekStart = this.getStartOfWeek(now);
                    end.setTime(currentWeekStart.getTime());
                    end.setDate(end.getDate() - 1);
                    end.setHours(23, 59, 59, 999);
                    start.setTime(end.getTime());
                    start.setDate(start.getDate() - 6);
                    start.setHours(0, 0, 0, 0);
                    previousPeriodLabel = 'vs semaine dernière';
                    break;
                }
                case 'month': {
                    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    start.setTime(lastMonth.getTime());
                    start.setHours(0, 0, 0, 0);
                    end.setTime(lastMonth.getTime());
                    end.setMonth(end.getMonth() + 1);
                    end.setDate(0);
                    end.setHours(23, 59, 59, 999);
                    const monthName = lastMonth.toLocaleDateString(this.state.locale, { month: 'short' });
                    previousPeriodLabel = `vs ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`;
                    break;
                }
                case 'year': {
                    start.setFullYear(now.getFullYear() - 1, 0, 1);
                    start.setHours(0, 0, 0, 0);
                    end.setFullYear(now.getFullYear() - 1, 11, 31);
                    end.setHours(23, 59, 59, 999);
                    previousPeriodLabel = `vs ${now.getFullYear() - 1}`;
                    break;
                }
            }
            
            return { start, end };
        };
        
        const { start, end } = getPreviousPeriodRange();
        
        const previousExpenses = this.expenses.filter(exp => {
            const expDate = this.parseExpenseDate(exp.created_at);
            if (isNaN(expDate.getTime())) return false;
            return expDate >= start && expDate <= end;
        });
        
        previousPeriodTotal = previousExpenses.reduce((sum, exp) => sum + parseFloat(exp.montant || 0), 0);
        
        // Afficher la tendance seulement si on a des données comparables
        const trendBadge = document.getElementById('trendBadge');
        const trendText = document.getElementById('trendText');
        
        if (currentAmount === 0 && previousPeriodTotal === 0) {
            trendBadge.style.display = 'none';
            return;
        }
        
        trendBadge.style.display = 'flex';
        
        if (previousPeriodTotal === 0 && currentAmount > 0) {
            trendBadge.className = 'trend-badge trend-up';
            trendBadge.innerHTML = '<i class="bi bi-graph-up-arrow"></i><span>+100% ' + previousPeriodLabel + '</span>';
            return;
        }
        
        if (currentAmount === 0 && previousPeriodTotal > 0) {
            trendBadge.className = 'trend-badge trend-down';
            trendBadge.innerHTML = '<i class="bi bi-graph-down-arrow"></i><span>-100% ' + previousPeriodLabel + '</span>';
            return;
        }
        
        const percentageChange = ((currentAmount - previousPeriodTotal) / previousPeriodTotal) * 100;
        const changeText = `${percentageChange > 0 ? '+' : ''}${percentageChange.toFixed(1)}%`;
        
        if (percentageChange > 0) {
            trendBadge.className = 'trend-badge trend-up';
            trendBadge.innerHTML = `<i class="bi bi-graph-up-arrow"></i><span>${changeText} ${previousPeriodLabel}</span>`;
        } else {
            trendBadge.className = 'trend-badge trend-down';
            trendBadge.innerHTML = `<i class="bi bi-graph-down-arrow"></i><span>${changeText} ${previousPeriodLabel}</span>`;
        }
    }

    updateDetailedStats(filteredExpenses, totalAmount) {
        const statsContainer = document.getElementById('statsDetails');
        let statsHTML = '';
        
        if (this.state.timeframe === 'today') {
            // Statistiques pour aujourd'hui
            if (filteredExpenses.length === 0) {
                statsHTML = `
                    <div class="stat-card-small">
                        <div class="stat-icon-small" style="background: rgba(255, 87, 87, 0.1)">
                            <i class="bi bi-arrow-up-right" style="color: #FF5757"></i>
                        </div>
                        <div class="stat-item-label">Dépense la plus élevée</div>
                        <div class="stat-item-value">---</div>
                    </div>
                    
                    <div class="stat-card-small">
                        <div class="stat-icon-small" style="background: rgba(76, 217, 100, 0.1)">
                            <i class="bi bi-arrow-down-right" style="color: #4CD964"></i>
                        </div>
                        <div class="stat-item-label">Dépense la plus faible</div>
                        <div class="stat-item-value">---</div>
                    </div>
                `;
            } else {
                let highest = filteredExpenses[0];
                let lowest = filteredExpenses[0];
                
                filteredExpenses.forEach(exp => {
                    const amount = parseFloat(exp.montant || 0);
                    const highestAmount = parseFloat(highest.montant || 0);
                    const lowestAmount = parseFloat(lowest.montant || 0);
                    
                    if (amount > highestAmount) highest = exp;
                    if (amount < lowestAmount) lowest = exp;
                });
                
                const highestCategory = this.categories.find(c => c.id === highest.id_categorie_depense);
                const lowestCategory = this.categories.find(c => c.id === lowest.id_categorie_depense);
                
                statsHTML = `
                    <div class="stat-card-small">
                        <div class="stat-icon-small" style="background: rgba(255, 87, 87, 0.1)">
                            <i class="bi bi-arrow-up-right" style="color: #FF5757"></i>
                        </div>
                        <div class="stat-item-label">Dépense la plus élevée</div>
                        <div class="stat-item-value">
                            ${highest.libelle}<br>
                            <span class="stat-amount">${parseFloat(highest.montant).toLocaleString(this.state.locale)} FCFA</span>
                        </div>
                    </div>
                    
                    <div class="stat-card-small">
                        <div class="stat-icon-small" style="background: rgba(76, 217, 100, 0.1)">
                            <i class="bi bi-arrow-down-right" style="color: #4CD964"></i>
                        </div>
                        <div class="stat-item-label">Dépense la plus faible</div>
                        <div class="stat-item-value">
                            ${lowest.libelle}<br>
                            <span class="stat-amount">${parseFloat(lowest.montant).toLocaleString(this.state.locale)} FCFA</span>
                        </div>
                    </div>
                `;
            }
        } else if (this.state.timeframe === 'week' || this.state.timeframe === 'month') {
            // Statistiques pour semaine/mois
            const dayMap = new Map();
            
            filteredExpenses.forEach(exp => {
                const expDate = this.parseExpenseDate(exp.created_at);
                const dateKey = expDate.toISOString().split('T')[0];
                const amount = parseFloat(exp.montant || 0);
                
                dayMap.set(dateKey, (dayMap.get(dateKey) || 0) + amount);
            });
            
            let highestDate = null;
            let highestAmount = -Infinity;
            let lowestDate = null;
            let lowestAmount = Infinity;
            
            dayMap.forEach((amount, date) => {
                if (amount > highestAmount) {
                    highestAmount = amount;
                    highestDate = date;
                }
                if (amount < lowestAmount) {
                    lowestAmount = amount;
                    lowestDate = date;
                }
            });
            
            // Calcul des jours restants
            const now = new Date();
            let daysRemaining = 0;
            
            if (this.state.timeframe === 'week') {
                const weekStart = this.getStartOfWeek(now);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                
                const remainingMs = weekEnd.getTime() - now.getTime();
                daysRemaining = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
            } else if (this.state.timeframe === 'month') {
                const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                const remainingMs = lastDay.getTime() - now.getTime();
                daysRemaining = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
            }
            
            statsHTML = `
                <div class="stat-card-small">
                    <div class="stat-icon-small" style="background: rgba(255, 87, 87, 0.1)">
                        <i class="bi bi-graph-up" style="color: #FF5757"></i>
                    </div>
                    <div class="stat-item-label">Jour record</div>
                    <div class="stat-item-value">
                        ${highestDate ? this.getDayName(new Date(highestDate)) : '---'}<br>
                        ${highestDate ? `<span class="stat-amount">${highestAmount.toLocaleString(this.state.locale)} FCFA</span>` : ''}
                    </div>
                </div>
                
                <div class="stat-card-small">
                    <div class="stat-icon-small" style="background: rgba(76, 217, 100, 0.1)">
                        <i class="bi bi-graph-down" style="color: #4CD964"></i>
                    </div>
                    <div class="stat-item-label">Jour économique</div>
                    <div class="stat-item-value">
                        ${lowestDate && lowestDate !== highestDate ? this.getDayName(new Date(lowestDate)) : '---'}<br>
                        ${lowestDate && lowestDate !== highestDate ? `<span class="stat-amount">${lowestAmount.toLocaleString(this.state.locale)} FCFA</span>` : ''}
                    </div>
                </div>
                
                <div class="stat-card-small">
                    <div class="stat-icon-small" style="background: rgba(52, 199, 235, 0.1)">
                        <i class="bi bi-clock" style="color: #34C7EB"></i>
                    </div>
                    <div class="stat-item-label">Jours restants</div>
                    <div class="stat-item-value" style="color: var(--blue-color)">
                        ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''}
                    </div>
                </div>
            `;
        } else if (this.state.timeframe === 'year') {
            // Statistiques pour l'année
            const monthMap = new Map();
            
            filteredExpenses.forEach(exp => {
                const expDate = this.parseExpenseDate(exp.created_at);
                const monthKey = `${expDate.getFullYear()}-${expDate.getMonth()}`;
                const amount = parseFloat(exp.montant || 0);
                
                monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + amount);
            });
            
            let highestMonth = null;
            let highestAmount = -Infinity;
            let lowestMonth = null;
            let lowestAmount = Infinity;
            
            monthMap.forEach((amount, monthKey) => {
                if (amount > highestAmount) {
                    highestAmount = amount;
                    highestMonth = monthKey;
                }
                if (amount < lowestAmount) {
                    lowestAmount = amount;
                    lowestMonth = monthKey;
                }
            });
            
            statsHTML = `
                <div class="stat-card-small">
                    <div class="stat-icon-small" style="background: rgba(255, 87, 87, 0.1)">
                        <i class="bi bi-bar-chart" style="color: #FF5757"></i>
                    </div>
                    <div class="stat-item-label">Mois record</div>
                    <div class="stat-item-value">
                        ${highestMonth ? this.getMonthName(new Date(parseInt(highestMonth.split('-')[0]), parseInt(highestMonth.split('-')[1]), 1)) : '---'}<br>
                        ${highestMonth ? `<span class="stat-amount">${highestAmount.toLocaleString(this.state.locale)} FCFA</span>` : ''}
                    </div>
                </div>
                
                <div class="stat-card-small">
                    <div class="stat-icon-small" style="background: rgba(76, 217, 100, 0.1)">
                        <i class="bi bi-graph-down-arrow" style="color: #4CD964"></i>
                    </div>
                    <div class="stat-item-label">Mois économique</div>
                    <div class="stat-item-value">
                        ${lowestMonth && lowestMonth !== highestMonth ? this.getMonthName(new Date(parseInt(lowestMonth.split('-')[0]), parseInt(lowestMonth.split('-')[1]), 1)) : '---'}<br>
                        ${lowestMonth && lowestMonth !== highestMonth ? `<span class="stat-amount">${lowestAmount.toLocaleString(this.state.locale)} FCFA</span>` : ''}
                    </div>
                </div>
            `;
        }
        
        statsContainer.innerHTML = statsHTML;
    }

    renderTopCategories() {
        const categoriesGrid = document.getElementById('categoriesGrid');
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // Filtrer les dépenses par période
        const filteredExpenses = this.expenses.filter(exp => {
            const expDate = this.parseExpenseDate(exp.created_at);
            if (isNaN(expDate.getTime())) return false;
            
            switch (this.state.timeframe) {
                case 'today':
                    return (
                        expDate.getDate() === today.getDate() &&
                        expDate.getMonth() === today.getMonth() &&
                        expDate.getFullYear() === now.getFullYear()
                    );
                case 'week': {
                    const weekStart = this.getStartOfWeek(now);
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekEnd.getDate() + 6);
                    return expDate >= weekStart && expDate <= weekEnd;
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
        const totalAmount = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.montant || 0), 0);
        
        if (totalAmount === 0) {
            // Afficher l'état vide
            let message = '';
            let icon = '';
            
            switch (this.state.timeframe) {
                case 'today':
                    message = 'Aucune dépense aujourd\'hui. Commencez à enregistrer vos dépenses !';
                    icon = 'bi-emoji-smile';
                    break;
                case 'week':
                    message = 'Aucune dépense cette semaine. C\'est une excellente nouvelle !';
                    icon = 'bi-trophy';
                    break;
                case 'month':
                    message = 'Aucune dépense ce mois-ci. Excellent contrôle de vos finances !';
                    icon = 'bi-graph-up';
                    break;
                case 'year':
                    message = 'Aucune dépense cette année. Impressionnant !';
                    icon = 'bi-award';
                    break;
            }
            
            categoriesGrid.innerHTML = `
                <div class="no-data-container">
                    <i class="bi ${icon}"></i>
                    <div class="no-data-text">${message}</div>
                </div>
            `;
            return;
        }
        
        // Calculer les catégories les plus consommées
        const categoryMap = new Map();
        
        filteredExpenses.forEach(exp => {
            const categoryId = exp.id_categorie_depense;
            const amount = parseFloat(exp.montant || 0);
            
            if (categoryId) {
                categoryMap.set(categoryId.toString(), (categoryMap.get(categoryId.toString()) || 0) + amount);
            }
        });
        
        const categoryArray = Array.from(categoryMap.entries())
            .map(([catId, amount]) => {
                const category = this.categories.find(c => c.id.toString() === catId);
                return {
                    id: catId,
                    name: category ? category.nom : 'Catégorie inconnue',
                    amount,
                    percentage: ((amount / totalAmount) * 100).toFixed(0) + '%',
                    icon: category?.icon,
                    color: category?.color || '#FFC107'
                };
            })
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 3);
        
        if (categoryArray.length === 0) {
            categoriesGrid.innerHTML = `
                <div class="no-data-container">
                    <i class="bi bi-tag"></i>
                    <div class="no-data-text">Aucune dépense catégorisée</div>
                </div>
            `;
            return;
        }
        
        // Générer le HTML des catégories
        let categoriesHTML = '';
        
        categoryArray.forEach((cat, index) => {
            categoriesHTML += `
                <div class="category-card">
                    <div class="category-header">
                        <div class="category-rank-badge" style="background-color: ${cat.color}">
                            <i class="bi ${cat.icon}"></i>
                        </div>
                        <div class="category-name">${cat.name}</div>
                        <div class="category-percentage">${cat.percentage}</div>
                    </div>
                    
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${Math.min(100, parseFloat(cat.percentage))}%; background-color: ${cat.color}"></div>
                    </div>
                    
                    <div class="category-footer">
                        <div class="category-amount">
                            <strong>${cat.amount.toLocaleString(this.state.locale)}</strong> / ${totalAmount.toLocaleString(this.state.locale)} FCFA
                        </div>
                        <div class="category-rank">#${index + 1}</div>
                    </div>
                </div>
            `;
        });
        
        categoriesGrid.innerHTML = categoriesHTML;
    }

    renderChart() {
        const ctx = document.getElementById('expensesChart').getContext('2d');
        
        // Nettoyer le graphique existant
        if (this.expensesChart) {
            this.expensesChart.destroy();
        }
        
        // Générer les données selon la période
        const now = new Date();
        let labels = [];
        let data = [];
        
        if (this.state.timeframe === 'today') {
            // Heures de la journée
            labels = Array.from({length: 24}, (_, i) => `${i}h`);
            data = Array.from({length: 24}, () => 0);
            
            this.expenses.forEach(exp => {
                const expDate = this.parseExpenseDate(exp.created_at);
                if (expDate.getDate() === now.getDate() && 
                    expDate.getMonth() === now.getMonth() && 
                    expDate.getFullYear() === now.getFullYear()) {
                    const hour = expDate.getHours();
                    data[hour] += parseFloat(exp.montant || 0);
                }
            });
        } else if (this.state.timeframe === 'week') {
            // Jours de la semaine
            const weekStart = this.getStartOfWeek(now);
            labels = [];
            
            for (let i = 0; i < 7; i++) {
                const date = new Date(weekStart);
                date.setDate(date.getDate() + i);
                labels.push(this.getDayName(date).substring(0, 3));
            }
            
            data = Array.from({length: 7}, () => 0);
            
            this.expenses.forEach(exp => {
                const expDate = this.parseExpenseDate(exp.created_at);
                if (expDate >= weekStart) {
                    const dayDiff = Math.floor((expDate - weekStart) / (1000 * 60 * 60 * 24));
                    if (dayDiff >= 0 && dayDiff < 7) {
                        data[dayDiff] += parseFloat(exp.montant || 0);
                    }
                }
            });
        } else if (this.state.timeframe === 'month') {
            // Semaines du mois
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            const weeksCount = Math.ceil((lastDay.getDate() + firstDay.getDay()) / 7);
            
            labels = Array.from({length: weeksCount}, (_, i) => `S${i + 1}`);
            data = Array.from({length: weeksCount}, () => 0);
            
            this.expenses.forEach(exp => {
                const expDate = this.parseExpenseDate(exp.created_at);
                if (expDate.getMonth() === now.getMonth() && 
                    expDate.getFullYear() === now.getFullYear()) {
                    const week = Math.floor((expDate.getDate() + firstDay.getDay() - 1) / 7);
                    if (week >= 0 && week < weeksCount) {
                        data[week] += parseFloat(exp.montant || 0);
                    }
                }
            });
        } else if (this.state.timeframe === 'year') {
            // Mois de l'année
            labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
            data = Array.from({length: 12}, () => 0);
            
            this.expenses.forEach(exp => {
                const expDate = this.parseExpenseDate(exp.created_at);
                if (expDate.getFullYear() === now.getFullYear()) {
                    data[expDate.getMonth()] += parseFloat(exp.montant || 0);
                }
            });
        }
        
        // Créer le graphique
        this.expensesChart = new Chart(ctx, {
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
                    tension: 0.3
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
     * UTILITAIRES
     * ============================================
     */
    render() {
        this.updatePeriodHeader();
        this.calculateStats();
        this.renderTopCategories();
        this.renderChart();
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

// Initialiser le dashboard quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new Dashboard();
    window.dashboard = dashboard; // Pour le débogage
});