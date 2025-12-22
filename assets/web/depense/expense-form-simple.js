class ExpenseForm {
    constructor() {
        this.API_BASE_URL = 'http://localhost:3000/api';
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
            startDate: this.formatDate(new Date()),
            endDate: this.formatDate(new Date()),
            image: null,
            isEditing: false,
            editingId: null
        };
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.updateUI();
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
            
            this.populateBudgets();
            this.populateCategories();
            
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
                    { id: 4, libelle: 'Budget Courses', categories: [7, 8] },
                    { id: 5, libelle: 'Budget Santé', categories: [9, 10] }
                ];
                
                // Données de démo pour les catégories
                this.categories = [
                    { id: 1, nom: 'Nourriture' },
                    { id: 2, nom: 'Électricité' },
                    { id: 3, nom: 'Eau' },
                    { id: 4, nom: 'Essence' },
                    { id: 5, nom: 'Cinéma' },
                    { id: 6, nom: 'Restaurant' },
                    { id: 7, nom: 'Supermarché' },
                    { id: 8, nom: 'Fruits & Légumes' },
                    { id: 9, nom: 'Médecin' },
                    { id: 10, nom: 'Pharmacie' }
                ];
                
                resolve();
            }, 1000);
        });
    }

    populateBudgets() {
        const select = document.getElementById('budgetSelect');
        select.innerHTML = '<option value="">-- Sélectionner un budget --</option>';
        
        this.budgets.forEach(budget => {
            const option = document.createElement('option');
            option.value = budget.id;
            option.textContent = budget.libelle;
            if (budget.id === this.state.budget) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    }

    populateCategories() {
        this.filterCategoriesByBudget();
        const select = document.getElementById('categorySelect');
        select.innerHTML = '<option value="">-- Sélectionner une catégorie --</option>';
        
        this.filteredCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.nom;
            if (category.id === this.state.category) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    }

    /**
     * ============================================
     * FILTRAGE DES CATÉGORIES PAR BUDGET
     * ============================================
     */
    filterCategoriesByBudget() {
        const budgetSelect = document.getElementById('budgetSelect');
        const selectedBudgetId = parseInt(budgetSelect.value);
        
        if (!selectedBudgetId) {
            // Si aucun budget sélectionné, afficher toutes les catégories
            this.filteredCategories = [...this.categories];
            return;
        }
        
        const selectedBudget = this.budgets.find(b => b.id === selectedBudgetId);
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
     * CONFIGURATION DES ÉVÉNEMENTS
     * ============================================
     */
    setupEventListeners() {
        // Fermeture du formulaire
        document.getElementById('closeBtn').addEventListener('click', () => this.closeForm());
       // document.getElementById('cancelBtn').addEventListener('click', () => this.closeForm());
        
        // Soumission du formulaire
        document.getElementById('expenseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Changement de budget
        document.getElementById('budgetSelect').addEventListener('change', () => {
            this.handleBudgetChange();
        });
        
        // Changement de catégorie
        document.getElementById('categorySelect').addEventListener('change', (e) => {
            this.state.category = e.target.value ? parseInt(e.target.value) : null;
            this.validateCategory();
        });
        
        // Switch dépense répétitive
        document.getElementById('recurringSwitch').addEventListener('change', (e) => {
            this.toggleRecurring(e.target.checked);
        });
        
        // Gestion de l'image
        document.getElementById('imageInput').addEventListener('change', (e) => {
            this.handleImageSelect(e.target.files[0]);
        });
        
        // document.getElementById('clearImageBtn').addEventListener('click', () => {
        //     this.clearImage();
        // });

          // Sélection d'image
        document.getElementById('imageBtn').addEventListener('click', () => {
            document.getElementById('imageInput').click();
        });
        
        // document.getElementById('imageInput').addEventListener('change', (e) => {
        //     this.handleImageSelect(e.target.files[0]);
        // });
        
      
        
        // Validation en temps réel
        document.getElementById('amount').addEventListener('input', (e) => this.validateAmount(e.target));
        document.getElementById('label').addEventListener('input', (e) => this.validateLabel(e.target));
        
        // Validation des dates
        document.getElementById('startDate').addEventListener('change', (e) => {
            this.state.startDate = e.target.value;
            this.validateDates();
        });
        
        document.getElementById('endDate').addEventListener('change', (e) => {
            this.state.endDate = e.target.value;
            this.validateDates();
        });
    }

    /**
     * ============================================
     * GESTION DES ÉVÉNEMENTS
     * ============================================
     */
    handleBudgetChange() {
        const budgetSelect = document.getElementById('budgetSelect');
        this.state.budget = budgetSelect.value ? parseInt(budgetSelect.value) : null;
        
        // Filtrer les catégories selon le budget sélectionné
        this.filterCategoriesByBudget();
        this.populateCategories();
        
        // Réinitialiser la sélection de catégorie
        this.state.category = null;
        document.getElementById('categorySelect').value = '';
    }

    toggleRecurring(isRecurring) {
        this.state.isRecurring = isRecurring;
        const datesSection = document.getElementById('datesSection');
        
        if (isRecurring) {
            datesSection.classList.add('show');
        } else {
            datesSection.classList.remove('show');
        }
    }

    async handleImageSelect(file) {
        if (!file) return;
        
        // Vérifier le type de fichier
        if (!file.type.startsWith('image/')) {
            this.showToast('Veuillez sélectionner une image', 'error');
            document.getElementById('imageInput').value = '';
            return;
        }
        
        // Vérifier la taille (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showToast('L\'image est trop volumineuse (max 5MB)', 'error');
            document.getElementById('imageInput').value = '';
            return;
        }
        
        try {
            // Convertir en base64 pour la prévisualisation
            const reader = new FileReader();
            reader.onload = (e) => {
                this.state.image = e.target.result;
                this.showImagePreview(this.state.image);
            };
            reader.readAsDataURL(file);
            
        } catch (error) {
            console.error('Erreur lors du traitement de l\'image:', error);
            this.showToast('Erreur lors du traitement de l\'image', 'error');
            document.getElementById('imageInput').value = '';
        }
    }

    clearImage() {
        this.state.image = null;
        document.getElementById('imageInput').value = '';
        document.getElementById('imagePreview').innerHTML = '';
    }

    showImagePreview(imageData) {
        const container = document.getElementById('imagePreview');
        container.innerHTML = `
            <img src="${imageData}" alt="Prévisualisation" class="img-fluid mt-2">
            <div class="mt-2">
                <small class="text-success">Image sélectionnée ✓</small>
            </div>
        `;
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
            document.getElementById('amountError').textContent = 'Veuillez saisir un montant valide.';
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
            document.getElementById('labelError').textContent = 'Le libellé doit contenir au moins 2 caractères.';
            this.state.label = '';
            return false;
        }
        
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        this.state.label = value;
        return true;
    }

    validateCategory() {
        const select = document.getElementById('categorySelect');
        
        if (!this.state.category) {
            select.classList.remove('is-valid');
            select.classList.add('is-invalid');
            return false;
        }
        
        select.classList.remove('is-invalid');
        select.classList.add('is-valid');
        return true;
    }

    validateDates() {
        if (!this.state.isRecurring) return true;
        
        const startDate = document.getElementById('startDate');
        const endDate = document.getElementById('endDate');
        
        if (!this.state.startDate || !this.state.endDate) {
            this.showToast('Veuillez saisir les dates de début et fin', 'error');
            return false;
        }
        
        const start = new Date(this.state.startDate);
        const end = new Date(this.state.endDate);
        
        if (start > end) {
            this.showToast('La date de début doit être antérieure à la date de fin', 'error');
            return false;
        }
        
        return true;
    }

    validateForm() {
        const amountInput = document.getElementById('amount');
        const labelInput = document.getElementById('label');
        
        const isAmountValid = this.validateAmount(amountInput);
        const isLabelValid = this.validateLabel(labelInput);
        const isCategoryValid = this.validateCategory();
        const areDatesValid = this.validateDates();
        
        return isAmountValid && isLabelValid && isCategoryValid && areDatesValid;
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
            date_debut: this.state.isRecurring ? this.state.startDate : null,
            date_fin: this.state.isRecurring ? this.state.endDate : null,
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
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    updateUI() {
        const formTitle = document.getElementById('formTitle');
        const submitBtn = document.getElementById('submitBtn');
         const imageText = document.getElementById('imageText');
        
        if (this.state.isEditing) {
            formTitle.textContent = 'Modifier la Dépense';
            submitBtn.innerHTML = '<i class="bi bi-check-circle"></i> Modifier la dépense';
        } else {
            formTitle.textContent = 'Ajouter une Dépense';
            submitBtn.innerHTML = 'Ajouter';
        }

         // Image <i class="bi bi-check-circle"></i>
        // if (this.state.image) {
        //     imageText.textContent = 'Image sélectionnée';
        // } else {
        //     imageText.textContent = 'Ajouter une pièce jointe';
        // }
        
        // Mettre à jour les valeurs des champs
        document.getElementById('amount').value = this.state.amount || '';
        document.getElementById('label').value = this.state.label || '';
        document.getElementById('recurringSwitch').checked = this.state.isRecurring;
        document.getElementById('startDate').value = this.state.startDate;
        document.getElementById('endDate').value = this.state.endDate;
        
        // Afficher/masquer les dates
        this.toggleRecurring(this.state.isRecurring);
    }

    closeForm() {
        if (confirm('Voulez-vous vraiment annuler ? Les modifications non enregistrées seront perdues.')) {
            this.resetForm();
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
            startDate: this.formatDate(new Date()),
            endDate: this.formatDate(new Date()),
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
        
        // Réinitialiser les listes
        this.populateBudgets();
        this.populateCategories();
        
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
            startDate: expenseData.date_debut || this.formatDate(new Date()),
            endDate: expenseData.date_fin || this.formatDate(new Date()),
            image: expenseData.piece_jointe || null,
            isEditing: true,
            editingId: expenseData.id || null
        };
        
        // Mettre à jour les listes
        this.populateBudgets();
        this.populateCategories();
        
        // Mettre à jour l'image si présente
        if (this.state.image) {
            this.showImagePreview(this.state.image);
        }
        
        this.updateUI();
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
    window.expenseForm = expenseForm;
    
    // Exemple d'édition (à appeler depuis l'extérieur)
    window.editExpense = (expenseData) => {
        expenseForm.editExpense(expenseData);
    };
    
    // Exemple de test du filtrage
    window.testFilter = () => {
        // Simule la sélection d'un budget
        const budgetSelect = document.getElementById('budgetSelect');
        budgetSelect.value = '1'; // Budget Maison
        expenseForm.handleBudgetChange();
    };
});