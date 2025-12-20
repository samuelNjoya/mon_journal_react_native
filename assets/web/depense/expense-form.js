class ExpenseForm {
    constructor() {
        // Configuration
        this.API_BASE_URL = 'http://localhost:3000/api'; // À modifier
        this.categories = [];
        this.budgets = [];
        this.filteredCategories = [];
        
        // État du formulaire
        this.state = {
            amount: 0,
            label: '',
            category: null,
            budget: null,
            isRecurring: false,
            startDate: new Date(),
            endDate: new Date(),
            image: null,
            isEditing: false,
            editingId: null
        };
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.setupDatePickers();
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
            
            // Pour API réelle, décommentez :
            /*
            // Charger les budgets
            const budgetsResponse = await fetch(`${this.API_BASE_URL}/budgets`);
            this.budgets = await budgetsResponse.json();
            
            // Charger les catégories
            const categoriesResponse = await fetch(`${this.API_BASE_URL}/categories`);
            this.categories = await categoriesResponse.json();
            */
            
            this.filterCategoriesByBudget();
            
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
                // Données de démo pour les budgets
                this.budgets = [
                    { id: 1, libelle: 'Budget Maison', categories: [1, 2, 3] },
                    { id: 2, libelle: 'Budget Transport', categories: [4] },
                    { id: 3, libelle: 'Budget Loisirs', categories: [5, 6] },
                    { id: 4, libelle: 'Budget Courses', categories: [7, 8] }
                ];
                
                // Données de démo pour les catégories
                this.categories = [
                    { id: 1, nom: 'Nourriture', icon: 'bi-cup-fill', color: '#FF6B6B', type: 1 },
                    { id: 2, nom: 'Électricité', icon: 'bi-lightning-fill', color: '#4ECDC4', type: 1 },
                    { id: 3, nom: 'Eau', icon: 'bi-droplet-fill', color: '#45B7D1', type: 1 },
                    { id: 4, nom: 'Essence', icon: 'bi-fuel-pump-fill', color: '#96CEB4', type: 1 },
                    { id: 5, nom: 'Cinéma', icon: 'bi-film', color: '#FFEAA7', type: 1 },
                    { id: 6, nom: 'Restaurant', icon: 'bi-egg-fried', color: '#DDA0DD', type: 1 },
                    { id: 7, nom: 'Supermarché', icon: 'bi-cart-fill', color: '#98D8C8', type: 1 },
                    { id: 8, nom: 'Fruits & Légumes', icon: 'bi-apple', color: '#F7DC6F', type: 1 }
                ];
                
                resolve();
            }, 1000);
        });
    }

    /**
     * ============================================
     * CONFIGURATION DES ÉVÉNEMENTS
     * ============================================
     */
    setupEventListeners() {
        // Fermeture du formulaire
        document.getElementById('closeBtn').addEventListener('click', () => this.closeForm());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeForm());
        
        // Soumission du formulaire
        document.getElementById('expenseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Validation en temps réel
        document.getElementById('amount').addEventListener('input', (e) => this.validateAmount(e.target));
        document.getElementById('label').addEventListener('input', (e) => this.validateLabel(e.target));
        
        // Sélecteurs de budget et catégorie
        document.getElementById('budgetSelector').addEventListener('click', () => this.openModal('budgetModal'));
        document.getElementById('categorySelector').addEventListener('click', () => this.openModal('categoryModal'));
        
        // Switch dépense répétitive
        document.getElementById('recurringSwitch').addEventListener('change', (e) => {
            this.toggleRecurring(e.target.checked);
        });
        
        // Sélection d'image
        document.getElementById('imageBtn').addEventListener('click', () => {
            document.getElementById('imageInput').click();
        });
        
        document.getElementById('imageInput').addEventListener('change', (e) => {
            this.handleImageSelect(e.target.files[0]);
        });
        
        // Fermeture des modals en cliquant à l'extérieur
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    setupDatePickers() {
        // Configuration de Flatpickr en français
        flatpickr.localize(flatpickr.l10ns.fr);
        
        const options = {
            dateFormat: 'd/m/Y',
            locale: 'fr',
            allowInput: true,
            disableMobile: true,
            onChange: (selectedDates, dateStr, instance) => {
                // La gestion des dates se fait dans les événements spécifiques
            }
        };
        
        // Date de début
        const startDatePicker = flatpickr('#startDate', {
            ...options,
            defaultDate: this.state.startDate,
            onChange: (selectedDates) => {
                if (selectedDates[0]) {
                    this.state.startDate = selectedDates[0];
                }
            }
        });
        
        // Date de fin
        const endDatePicker = flatpickr('#endDate', {
            ...options,
            defaultDate: this.state.endDate,
            onChange: (selectedDates) => {
                if (selectedDates[0]) {
                    this.state.endDate = selectedDates[0];
                }
            }
        });
    }

    /**
     * ============================================
     * GESTION DE L'UI
     * ============================================
     */
    render() {
        this.renderBudgets();
        this.renderCategories();
        this.updateUI();
    }

    renderBudgets() {
        const container = document.getElementById('budgetList');
        container.innerHTML = '';
        
        // Option "Aucun budget"
        const noBudgetItem = document.createElement('div');
        noBudgetItem.className = `modal-item ${this.state.budget === null ? 'selected' : ''}`;
        noBudgetItem.innerHTML = `
            <div class="modal-icon" style="background-color: #6c757d;">
                <i class="bi bi-dash-circle"></i>
            </div>
            <div class="modal-text">Aucun budget</div>
        `;
        noBudgetItem.addEventListener('click', () => this.selectBudget(null));
        container.appendChild(noBudgetItem);
        
        // Liste des budgets
        this.budgets.forEach(budget => {
            const item = document.createElement('div');
            item.className = `modal-item ${this.state.budget === budget.id ? 'selected' : ''}`;
            item.innerHTML = `
                <div class="modal-icon" style="background-color: #ffc107;">
                    <i class="bi bi-wallet2"></i>
                </div>
                <div class="modal-text">${budget.libelle}</div>
            `;
            item.addEventListener('click', () => this.selectBudget(budget.id));
            container.appendChild(item);
        });
    }

    renderCategories() {
        const container = document.getElementById('categoryList');
        container.innerHTML = '';
        
        // Filtrer les catégories selon le budget sélectionné
        this.filterCategoriesByBudget();
        
        if (this.filteredCategories.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'modal-item';
            emptyMessage.innerHTML = `
                <div class="modal-text text-center text-muted">
                    Aucune catégorie disponible
                </div>
            `;
            container.appendChild(emptyMessage);
            return;
        }
        
        // Liste des catégories
        this.filteredCategories.forEach(category => {
            const item = document.createElement('div');
            item.className = `modal-item ${this.state.category === category.id ? 'selected' : ''}`;
            item.innerHTML = `
                <div class="modal-icon" style="background-color: ${category.color || '#6c757d'};">
                    <i class="bi ${category.icon || 'bi-tag'}"></i>
                </div>
                <div class="modal-text">${category.nom}</div>
            `;
            item.addEventListener('click', () => this.selectCategory(category.id));
            container.appendChild(item);
        });
    }

    updateUI() {
        // Mettre à jour les sélecteurs
        const budgetSelector = document.getElementById('selectedBudget');
        const categorySelector = document.getElementById('selectedCategory');
        const formTitle = document.getElementById('formTitle');
        const submitBtn = document.getElementById('submitBtn');
        const datesSection = document.getElementById('datesSection');
        const imageText = document.getElementById('imageText');
        
        // Budget
        if (this.state.budget === null) {
            budgetSelector.textContent = 'Aucun budget';
        } else {
            const budget = this.budgets.find(b => b.id === this.state.budget);
            budgetSelector.textContent = budget ? budget.libelle : 'Sélectionner un budget';
        }
        
        // Catégorie
        if (this.state.category === null) {
            categorySelector.textContent = 'Sélectionner une catégorie';
        } else {
            const category = this.categories.find(c => c.id === this.state.category);
            categorySelector.textContent = category ? category.nom : 'Sélectionner une catégorie';
        }
        
        // Titre et bouton
        if (this.state.isEditing) {
            formTitle.textContent = 'Modifier la Dépense';
            submitBtn.innerHTML = '<i class="bi bi-check-circle"></i> Modifier la dépense';
        } else {
            formTitle.textContent = 'Ajouter une Dépense';
            submitBtn.innerHTML = '<i class="bi bi-check-circle"></i> Ajouter la dépense';
        }
        
        // Section dates
        if (this.state.isRecurring) {
            datesSection.classList.add('show');
        } else {
            datesSection.classList.remove('show');
        }
        
        // Image
        if (this.state.image) {
            imageText.textContent = 'Image sélectionnée';
        } else {
            imageText.textContent = 'Ajouter une pièce jointe';
        }
        
        // Mettre à jour les valeurs des champs
        document.getElementById('amount').value = this.state.amount || '';
        document.getElementById('label').value = this.state.label || '';
        document.getElementById('recurringSwitch').checked = this.state.isRecurring;
    }

    /**
     * ============================================
     * LOGIQUE DE FILTRAGE
     * ============================================
     */
    filterCategoriesByBudget() {
        if (this.state.budget === null) {
            // Afficher toutes les catégories si pas de budget
            this.filteredCategories = [...this.categories];
            return;
        }
        
        const selectedBudget = this.budgets.find(b => b.id === this.state.budget);
        if (!selectedBudget || !selectedBudget.categories) {
            this.filteredCategories = [];
            return;
        }
        
        // Filtrer les catégories selon celles associées au budget
        this.filteredCategories = this.categories.filter(category => 
            selectedBudget.categories.includes(category.id)
        );
    }

    /**
     * ============================================
     * GESTION DES ÉVÉNEMENTS
     * ============================================
     */
    selectBudget(budgetId) {
        this.state.budget = budgetId;
        this.filterCategoriesByBudget();
        this.renderCategories();
        this.updateUI();
        this.closeModal('budgetModal');
    }

    selectCategory(categoryId) {
        this.state.category = categoryId;
        this.updateUI();
        this.closeModal('categoryModal');
    }

    toggleRecurring(isRecurring) {
        this.state.isRecurring = isRecurring;
        this.updateUI();
    }

    async handleImageSelect(file) {
        if (!file) return;
        
        // Vérifier le type de fichier
        if (!file.type.startsWith('image/')) {
            this.showToast('Veuillez sélectionner une image', 'error');
            return;
        }
        
        // Vérifier la taille (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showToast('L\'image est trop volumineuse (max 5MB)', 'error');
            return;
        }
        
        try {
            // Convertir en base64 pour la prévisualisation
            const reader = new FileReader();
            reader.onload = (e) => {
                this.state.image = e.target.result;
                this.showImagePreview(this.state.image);
                this.updateUI();
            };
            reader.readAsDataURL(file);
            
        } catch (error) {
            console.error('Erreur lors du traitement de l\'image:', error);
            this.showToast('Erreur lors du traitement de l\'image', 'error');
        }
    }

    showImagePreview(imageData) {
        const container = document.getElementById('imagePreview');
        container.innerHTML = `
            <img src="${imageData}" alt="Prévisualisation" class="img-fluid">
            <button type="button" class="btn btn-sm btn-danger mt-2" id="removeImageBtn">
                <i class="bi bi-trash"></i> Supprimer
            </button>
        `;
        
        // Ajouter l'événement pour supprimer l'image
        document.getElementById('removeImageBtn').addEventListener('click', () => {
            this.state.image = null;
            container.innerHTML = '';
            this.updateUI();
        });
    }

    /**
     * ============================================
     * VALIDATION
     * ============================================
     */
    validateAmount(input) {
        const value = parseFloat(input.value);
        
        if (!value || value <= 0) {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            this.state.amount = 0;
            return false;
        }
        
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        this.state.amount = value;
        return true;
    }

    validateLabel(input) {
        const value = input.value.trim();
        
        if (!value || value.length < 2) {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            this.state.label = '';
            return false;
        }
        
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        this.state.label = value;
        return true;
    }

    validateForm() {
        const amountInput = document.getElementById('amount');
        const labelInput = document.getElementById('label');
        
        const isAmountValid = this.validateAmount(amountInput);
        const isLabelValid = this.validateLabel(labelInput);
        const isCategoryValid = this.state.category !== null;
        
        // Validation catégorie
        const categorySelector = document.getElementById('categorySelector');
        if (!isCategoryValid) {
            categorySelector.style.borderColor = 'var(--danger-color)';
        } else {
            categorySelector.style.borderColor = '';
        }
        
        // Validation dates si dépense répétitive
        if (this.state.isRecurring) {
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            
            if (!startDate || !endDate) {
                this.showToast('Veuillez saisir les dates de début et fin', 'error');
                return false;
            }
            
            const start = new Date(this.state.startDate);
            const end = new Date(this.state.endDate);
            
            if (start > end) {
                this.showToast('La date de début doit être antérieure à la date de fin', 'error');
                return false;
            }
        }
        
        return isAmountValid && isLabelValid && isCategoryValid;
    }

    /**
     * ============================================
     * SOUMISSION DU FORMULAIRE
     * ============================================
     */
    async handleSubmit() {
        if (!this.validateForm()) {
            this.showToast('Veuillez corriger les erreurs dans le formulaire', 'error');
            return;
        }
        
        // Construction des données
        const expenseData = {
            libelle: this.state.label,
            montant: this.state.amount,
            id_categorie_depense: this.state.category,
            IdBudget: this.state.budget,
            piece_jointe: this.state.image,
            is_repetitive: this.state.isRecurring ? 1 : 0,
            status_is_repetitive: this.state.isRecurring ? 0 : undefined,
            date_debut: this.state.isRecurring ? this.formatDate(this.state.startDate) : null,
            date_fin: this.state.isRecurring ? this.formatDate(this.state.endDate) : null,
            created_at: new Date().toISOString().split('T')[0]
        };
        
        // Ajouter l'ID si on est en mode édition
        if (this.state.isEditing && this.state.editingId) {
            expenseData.id = this.state.editingId;
        }
        
        try {
            this.showSpinner(this.state.isEditing ? 'Modification en cours...' : 'Ajout en cours...');
            
            // Simulation d'appel API
            await this.simulateExpenseSubmit(expenseData);
            
            // Pour API réelle, décommentez :
            /*
            const url = this.state.isEditing 
                ? `${this.API_BASE_URL}/expenses/${this.state.editingId}`
                : `${this.API_BASE_URL}/expenses`;
            
            const method = this.state.isEditing ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(expenseData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de l\'enregistrement');
            }
            
            const result = await response.json();
            */
            
            this.showToast(
                this.state.isEditing 
                    ? 'Dépense modifiée avec succès !' 
                    : 'Dépense ajoutée avec succès !',
                'success'
            );
            
            // Réinitialiser le formulaire
            this.resetForm();
            
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement:', error);
            this.showToast(error.message || 'Erreur lors de l\'enregistrement', 'error');
        } finally {
            this.hideSpinner();
        }
    }

    simulateExpenseSubmit(expenseData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simuler un succès dans 90% des cas
                if (Math.random() > 0.1) {
                    console.log('Données envoyées:', expenseData);
                    resolve(expenseData);
                } else {
                    reject(new Error('Erreur réseau lors de l\'enregistrement'));
                }
            }, 1500);
        });
    }

    /**
     * ============================================
     * UTILITAIRES
     * ============================================
     */
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('show');
        
        // Ajouter la classe open au bouton correspondant
        const buttonId = modalId === 'budgetModal' ? 'budgetSelector' : 'categorySelector';
        document.getElementById(buttonId).classList.add('open');
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        
        // Retirer la classe open au bouton correspondant
        const buttonId = modalId === 'budgetModal' ? 'budgetSelector' : 'categorySelector';
        document.getElementById(buttonId).classList.remove('open');
    }

    closeForm() {
        if (confirm('Voulez-vous vraiment annuler ? Les modifications non enregistrées seront perdues.')) {
            this.resetForm();
            // Dans une vraie app, on pourrait rediriger ou fermer le modal parent
            this.showToast('Formulaire annulé', 'info');
        }
    }

    resetForm() {
        this.state = {
            amount: 0,
            label: '',
            category: null,
            budget: null,
            isRecurring: false,
            startDate: new Date(),
            endDate: new Date(),
            image: null,
            isEditing: false,
            editingId: null
        };
        
        // Réinitialiser l'UI
        document.getElementById('expenseForm').reset();
        document.getElementById('imagePreview').innerHTML = '';
        
        // Réinitialiser les classes de validation
        document.querySelectorAll('.form-control, .form-select').forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
        });
        
        // Réinitialiser les sélecteurs
        document.getElementById('categorySelector').style.borderColor = '';
        
        this.updateUI();
    }

    /**
     * ============================================
     * FONCTIONS POUR L'ÉDITION
     * ============================================
     */
    editExpense(expenseData) {
        this.state = {
            amount: expenseData.montant || 0,
            label: expenseData.libelle || '',
            category: expenseData.id_categorie_depense || null,
            budget: expenseData.IdBudget || null,
            isRecurring: expenseData.is_repetitive === 1,
            startDate: expenseData.date_debut ? new Date(expenseData.date_debut) : new Date(),
            endDate: expenseData.date_fin ? new Date(expenseData.date_fin) : new Date(),
            image: expenseData.piece_jointe || null,
            isEditing: true,
            editingId: expenseData.id || null
        };
        
        // Mettre à jour les champs du formulaire
        document.getElementById('amount').value = this.state.amount;
        document.getElementById('label').value = this.state.label;
        document.getElementById('recurringSwitch').checked = this.state.isRecurring;
        
        // Mettre à jour les dates
        if (expenseData.date_debut) {
            document.getElementById('startDate').value = this.formatDateForInput(expenseData.date_debut);
        }
        if (expenseData.date_fin) {
            document.getElementById('endDate').value = this.formatDateForInput(expenseData.date_fin);
        }
        
        // Mettre à jour l'image si présente
        if (this.state.image) {
            this.showImagePreview(this.state.image);
        }
        
        this.updateUI();
    }

    formatDateForInput(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    }

    /**
     * ============================================
     * FONCTIONS D'UI (SPINNER, TOAST)
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
let expenseForm;

document.addEventListener('DOMContentLoaded', () => {
    expenseForm = new ExpenseForm();
    window.expenseForm = expenseForm; // Pour accès global si besoin
    
    // Exemple d'édition (à appeler depuis l'extérieur)
    window.editExpense = (expenseData) => {
        expenseForm.editExpense(expenseData);
    };
});