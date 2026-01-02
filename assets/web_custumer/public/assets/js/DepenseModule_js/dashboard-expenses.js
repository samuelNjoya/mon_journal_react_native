class ExpenseDashboard {
    constructor() {
        this.expenses = [];
        this.categories = [];

        // État
        this.state = {
            timeframe: 'today',
            isLoading: false,
            locale: 'fr-FR'
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
        //    this.showSpinner('Chargement du dashboard...');

             // Appeler la vraie API au lieu des données fictives
           await this.loadRealApiData();

            this.updatePeriodHeader();
            this.calculateStats();
            this.renderTopCategories();

        } catch (error) {
            console.error('Erreur de chargement:', error);
            //this.showNotification('Erreur lors du chargement des données', 'error');
            alert('Erreur lors du chargement des données', error);
        } finally {
           // this.hideSpinner();
        }
    }

    // charger depuis l'api laravel
    async loadRealApiData() {
   // console.log('=== DÉBUT loadRealApiData ===');

    try {
        // 1. Faire l'appel AJAX vers Laravel
      //  console.log('1. Appel fetch vers /dashboard/expenses/data');

        const response = await fetch('/dashboard/expenses/data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        });

        // console.log('2. Réponse reçue, status:', response.status);
        // console.log('3. Response OK?', response.ok);

        // 2. Vérifier que l'appel a réussi
        if (!response.ok) {
         //   console.error('Erreur HTTP:', response.status, response.statusText);
            throw new Error('Erreur lors de la récupération des données');
        }

        // 3. Récupérer le JSON
      //  console.log('4. Lecture du JSON...');
        const result = await response.json();
      //  console.log('5. JSON reçu:', result);

        // 4. Vérifier que l'API a retourné success: true
        if (!result.success) {
        //    console.error('API a retourné success: false', result);
            throw new Error(result.message);
        }

        // 5. Extraire les données
        const apiData = result.data;
      //  console.log('6. apiData:', apiData);

        // 6. Stocker les catégories
        if (apiData.categories) {
         //   console.log('7. Categories brutes:', apiData.categories);

            if (apiData.categories.data) {
                this.categories = apiData.categories.data.map(cat => ({
                    id: cat.id,
                    nom: cat.nom,
                    color: cat.color
                }));
            }

          //  console.log('8. Categories formatées:', this.categories);
        }

        // 7. Stocker les dépenses
        if (apiData.expenses) {
           // console.log('9. Expenses brutes:', apiData.expenses);

            // if (apiData.expenses.data && apiData.expenses.data.length > 0) {
            //     console.log('📊 EXEMPLE DE DÉPENSE (première):', apiData.expenses.data[0]);
            //     console.log('📅 Format de created_at:', apiData.expenses.data[0].created_at);
            //     console.log('💰 Nom du champ montant:', Object.keys(apiData.expenses.data[0]));
            // }

            if (apiData.expenses.data) {
                this.expenses = apiData.expenses.data.map(exp => ({
                    id: exp.id,
                    libelle: exp.libelle,  // ✅ CORRECT
                    montant: parseFloat(exp.montant),  // ✅ CORRECT
                    id_categorie_depense: exp.id_categorie_depense,
                    created_at: exp.created_at
                }));
            }

        //    console.log('10. Expenses formatées:', this.expenses);

            if (this.expenses.length > 0) {
             //   console.log('📊 EXEMPLE DE DÉPENSE FORMATÉE (première):', this.expenses[0]);
            }
        }




     //   console.log('=== FIN loadRealApiData (SUCCÈS) ===');

    } catch (error) {
        console.error('=== ERREUR dans loadRealApiData ===');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        throw error;
    }
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
                    previousPeriodLabel = 'vs sem. préc';
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

        // Afficher la tendance
        const trendBadge = document.getElementById('trendBadge');

        if (currentAmount === 0 && previousPeriodTotal === 0) {
            trendBadge.style.display = 'none';
            return;
        }

        trendBadge.style.display = 'inline-flex';

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
        if (filteredExpenses.length === 0) {
            statsHTML = `
                <div class="stat-card-small">
                    <div class="stat-icon-small" style="background: rgba(255, 87, 87, 0.1)">
                        <i class="la la-arrow-up" style="color: #FF5757; font-size: 20px;"></i>
                    </div>
                    <div class="stat-item-label">Dépense la plus élevée</div>
                    <div class="stat-item-value">---</div>
                </div>

                <div class="stat-card-small">
                    <div class="stat-icon-small" style="background: rgba(76, 217, 100, 0.1)">
                        <i class="la la-arrow-down" style="color: #4CD964; font-size: 20px;"></i>
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
                if (amount > parseFloat(highest.montant || 0)) highest = exp;
                if (amount < parseFloat(lowest.montant || 0)) lowest = exp;
            });

            statsHTML = `
                <div class="stat-card-small">
                    <div class="stat-icon-small" style="background: rgba(255, 87, 87, 0.1)">
                        <i class="la la-arrow-up" style="color: #FF5757; font-size: 20px;"></i>
                    </div>
                    <div class="stat-item-label">Dépense la plus élevée</div>
                    <div class="stat-item-value">
                        ${highest.libelle}<br>
                        <span class="stat-amount">${parseFloat(highest.montant).toLocaleString(this.state.locale)} FCFA</span>
                    </div>
                </div>

                <div class="stat-card-small">
                    <div class="stat-icon-small" style="background: rgba(76, 217, 100, 0.1)">
                        <i class="la la-arrow-down" style="color: #4CD964; font-size: 20px;"></i>
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

        const now = new Date();
        let daysRemaining = 0;

        if (this.state.timeframe === 'week') {
            const weekStart = this.getStartOfWeek(now);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            const remainingMs = weekEnd.getTime() - now.getTime();
            daysRemaining = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
        } else {
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            const remainingMs = lastDay.getTime() - now.getTime();
            daysRemaining = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
        }

        statsHTML = `
            <div class="stat-card-small">
                <div class="stat-icon-small" style="background: rgba(255, 87, 87, 0.1)">
                    <i class="la la-arrow-up" style="color: #FF5757; font-size: 20px;"></i>
                </div>
                <div class="stat-item-label">Jour record</div>
                <div class="stat-item-value">
                    ${highestDate ? this.getDayName(new Date(highestDate)) : '---'}<br>
                    ${highestDate ? `<span class="stat-amount">${highestAmount.toLocaleString(this.state.locale)} FCFA</span>` : ''}
                </div>
            </div>

            <div class="stat-card-small">
                <div class="stat-icon-small" style="background: rgba(76, 217, 100, 0.1)">
                    <i class="la la-arrow-down" style="color: #4CD964; font-size: 20px;"></i>
                </div>
                <div class="stat-item-label">Jour économique</div>
                <div class="stat-item-value">
                    ${lowestDate && lowestDate !== highestDate ? this.getDayName(new Date(lowestDate)) : '---'}<br>
                    ${lowestDate && lowestDate !== highestDate ? `<span class="stat-amount">${lowestAmount.toLocaleString(this.state.locale)} FCFA</span>` : ''}
                </div>
            </div>

            <div class="stat-card-small">
                <div class="stat-icon-small" style="background: rgba(52, 199, 235, 0.1)">
                    <i class="la la-clock-o" style="color: #34C7EB; font-size: 20px;"></i>
                </div>
                <div class="stat-item-label">Jours restants</div>
                <div class="stat-item-value" style="color: #2196F3; font-weight: 600;">
                    ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''}
                </div>
            </div>
        `;
    } else if (this.state.timeframe === 'year') {
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
                    <i class="la la-bar-chart" style="color: #FF5757; font-size: 20px;"></i>
                </div>
                <div class="stat-item-label">Mois record</div>
                <div class="stat-item-value">
                    ${highestMonth ? this.getMonthName(new Date(parseInt(highestMonth.split('-')[0]), parseInt(highestMonth.split('-')[1]), 1)) : '---'}<br>
                    ${highestMonth ? `<span class="stat-amount">${highestAmount.toLocaleString(this.state.locale)} FCFA</span>` : ''}
                </div>
            </div>

            <div class="stat-card-small">
                <div class="stat-icon-small" style="background: rgba(76, 217, 100, 0.1)">
                   <i class="bi bi-graph-down-arrow" style="color: #4CD964; font-size:20px"></i>
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

        const totalAmount = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.montant || 0), 0);

        if (totalAmount === 0) {
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
                    <i class="bi ${icon}" style="font-size: 60px; color: #dee2e6; opacity: 0.7;"></i>
                    <div class="no-data-text">${message}</div>
                </div>
            `;
            return;
        }

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
                    nom: category ? category.nom : 'Catégorie inconnue',
                    amount,
                    percentage: ((amount / totalAmount) * 100).toFixed(0) + '%',
                    color: category?.color || '#FFC107'
                };
            })
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 3);

        if (categoryArray.length === 0) {
            categoriesGrid.innerHTML = `
                <div class="no-data-container">
                    <i class="flaticon-tag" style="font-size: 60px; color: #dee2e6; opacity: 0.7;"></i>
                    <div class="no-data-text">Aucune dépense catégorisée</div>
                </div>
            `;
            return;
        }

        let categoriesHTML = '';

        categoryArray.forEach((cat, index) => {
            categoriesHTML += `
                <div class="category-card">
                    <div class="category-header">
                        <div class="category-rank-badge" style="background-color: ${cat.color}">
                            <span style="color: white; font-weight: 700;">${index + 1}</span>
                        </div>
                        <div class="category-name">${cat.nom}</div>
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

    /**
     * ============================================
     * UTILITAIRES
     * ============================================
     */
    render() {
        this.updatePeriodHeader();
        this.calculateStats();
        this.renderTopCategories();
    }
}

// Initialiser le dashboard quand la page est chargée
$(document).ready(function() {
    window.expenseDashboard = new ExpenseDashboard();
});
