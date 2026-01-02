class ExpenseFormManager {
    constructor() {
        this.categories = [];
        this.budgets = [];
        this.filteredCategories = [];

        this.state = {
            amount: 0,
            label: '',
            category: null,
            budget: null,
            isRecurring: false,
            startDate: this.formatDate(new Date()),
            endDate: this.formatDate(new Date()),
            image: null,
            imageFile: null,
            isEditing: false,
            editingId: null
        };

        this.init();
    }

    async init() {
        // PAS de spinner au chargement
        await this.loadData();
        this.setupEventListeners();
    }

    /**
     * ============================================
     * CHARGEMENT DES DONNÉES (sans spinner)
     * ============================================
     */
    async loadData() {
        try {
            await Promise.all([
                this.loadCategoriesAndExpenses(),
                this.loadBudgetCategoryFilter()
            ]);

            this.populateBudgets();
            this.populateCategories();

        } catch (error) {
            console.error('Erreur loadData:', error);
        }
    }

    async loadCategoriesAndExpenses() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/dashboard/expenses/data",
                method: 'GET',
                dataType: "JSON",
                success: (response) => {
                    if (response.success) {
                        const apiData = response.data;

                        // Extraire les catégories
                        if (apiData.categories && apiData.categories.data) {
                            this.categories = apiData.categories.data.map(cat => ({
                                id: cat.id,
                                nom: cat.nom,
                                color: cat.color
                            }));
                        }

                        resolve();
                    } else {
                        reject(new Error(response.message));
                    }
                },
                error: (error) => {
                    console.error('Erreur loadCategoriesAndExpenses:', error);
                    reject(error);
                }
            });
        });
    }

    async loadBudgetCategoryFilter() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/dashboard/expenses/budget-category-filter",
                method: 'GET',
                dataType: "JSON",
                success: (response) => {
                    if (response.success) {
                        let budgetData = null;

                        if (response.data && response.data.data) {
                            budgetData = response.data.data;
                        } else if (response.data && Array.isArray(response.data)) {
                            budgetData = response.data;
                        }

                        if (Array.isArray(budgetData)) {
                            this.budgets = budgetData.map(budget => ({
                                id: budget.id || budget.IdBudget,
                                libelle: budget.libelle || budget.nom_budget || budget.libelle_budget || `Budget ${budget.id}`,
                                categories: budget.categories || budget.id_categories || budget.categorie_ids || []
                            }));
                        }

                        resolve();
                    } else {
                        console.warn('Pas de budgets disponibles');
                        this.budgets = [];
                        resolve();
                    }
                },
                error: (error) => {
                    console.error('Erreur loadBudgetCategoryFilter:', error);
                    this.budgets = [];
                    resolve();
                }
            });
        });
    }

    /**
     * ============================================
     * POPULATION DES SELECTS
     * ============================================
     */
    populateBudgets() {
        const select = $('#exp-form-budget');
        select.html('<option value="">-- Sélectionner un budget --</option>');

        this.budgets.forEach(budget => {
            const option = $('<option></option>')
                .val(budget.id)
                .text(budget.libelle);

            if (budget.id === this.state.budget) {
                option.prop('selected', true);
            }

            select.append(option);
        });
    }

    populateCategories() {
        this.filterCategoriesByBudget();
        const select = $('#exp-form-category');
        select.html('<option value="">-- Sélectionner une catégorie --</option>');

        this.filteredCategories.forEach(category => {
            const option = $('<option></option>')
                .val(category.id)
                .text(category.nom);

            if (category.id === this.state.category) {
                option.prop('selected', true);
            }

            select.append(option);
        });
    }

    /**
     * ============================================
     * FILTRAGE CATÉGORIES PAR BUDGET
     * ============================================
     */
    filterCategoriesByBudget() {
        const budgetId = parseInt($('#exp-form-budget').val());

        if (!budgetId) {
            this.filteredCategories = [...this.categories];
            return;
        }

        const budget = this.budgets.find(b => b.id === budgetId);
        if (!budget || !budget.categories) {
            this.filteredCategories = [];
            return;
        }

        this.filteredCategories = this.categories.filter(cat =>
            budget.categories.includes(cat.id)
        );
    }

    /**
     * ============================================
     * ÉVÉNEMENTS
     * ============================================
     */
    setupEventListeners() {
        // Soumission
        $('#exp-form-main').on('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Budget
        $('#exp-form-budget').on('change', () => {
            this.handleBudgetChange();
        });

        // Catégorie
        $('#exp-form-category').on('change', (e) => {
            this.state.category = e.target.value ? parseInt(e.target.value) : null;
            this.validateCategory();
        });

        // Récurrent
        $('#exp-form-recurring-switch').on('change', (e) => {
            this.toggleRecurring(e.target.checked);
        });

        // Image
        $('#exp-form-image-btn').on('click', () => {
            $('#exp-form-image-input').click();
        });

        $('#exp-form-image-input').on('change', (e) => {
            this.handleImageSelect(e.target.files[0]);
        });

        // Validation temps réel
        $('#exp-form-amount').on('input', (e) => this.validateAmount(e.target));
        $('#exp-form-label').on('input', (e) => this.validateLabel(e.target));

        // Dates
        $('#exp-form-start-date').on('change', (e) => {
            this.state.startDate = e.target.value;
        });

        $('#exp-form-end-date').on('change', (e) => {
            this.state.endDate = e.target.value;
        });
    }

    handleBudgetChange() {
        this.state.budget = $('#exp-form-budget').val() ? parseInt($('#exp-form-budget').val()) : null;

        this.filterCategoriesByBudget();
        this.populateCategories();

        this.state.category = null;
        $('#exp-form-category').val('');
    }

    toggleRecurring(isRecurring) {
        this.state.isRecurring = isRecurring;
        const datesSection = $('#exp-form-dates-section');

        if (isRecurring) {
            datesSection.addClass('show');
        } else {
            datesSection.removeClass('show');
        }
    }

    async handleImageSelect(file) {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            swal.fire({
                "title": "Erreur",
                "text": "Veuillez sélectionner une image",
                "type": "error",
                "confirmButtonClass": "btn btn-secondary"
            });
            $('#exp-form-image-input').val('');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            swal.fire({
                "title": "Erreur",
                "text": "L'image est trop volumineuse (max 5MB)",
                "type": "error",
                "confirmButtonClass": "btn btn-secondary"
            });
            $('#exp-form-image-input').val('');
            return;
        }

        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.state.image = e.target.result;
                this.state.imageFile = file;
                this.showImagePreview(this.state.image);
            };
            reader.readAsDataURL(file);

        } catch (error) {
            console.error('Erreur image:', error);
            $('#exp-form-image-input').val('');
        }
    }

    showImagePreview(imageData) {
        $('#exp-form-image-preview').html(`<img src="${imageData}" alt="Prévisualisation">`);
        $('#exp-form-image-text').html('Photo <i class="bi bi-check-circle"></i>');
    }

    clearImage() {
        this.state.image = null;
        this.state.imageFile = null;
        $('#exp-form-image-input').val('');
        $('#exp-form-image-preview').html('');
        $('#exp-form-image-text').text('Photo');
    }

    /**
     * ============================================
     * VALIDATION
     * ============================================
     */
    validateAmount(input) {
        const $input = $(input);
        const value = parseFloat($input.val());

        if (!value || value <= 0) {
            $input.removeClass('is-valid').addClass('is-invalid');
            $('#exp-form-amount-error').text('Montant invalide');
            this.state.amount = 0;
            return false;
        }

        $input.removeClass('is-invalid').addClass('is-valid');
        $('#exp-form-amount-error').text('');
        this.state.amount = value;
        return true;
    }

    validateLabel(input) {
        const $input = $(input);
        const value = $input.val().trim();

        if (!value || value.length < 2) {
            $input.removeClass('is-valid').addClass('is-invalid');
            $('#exp-form-label-error').text('Libellé trop court');
            this.state.label = '';
            return false;
        }

        $input.removeClass('is-invalid').addClass('is-valid');
        $('#exp-form-label-error').text('');
        this.state.label = value;
        return true;
    }

    validateCategory() {
        const $select = $('#exp-form-category');

        if (!this.state.category) {
            $select.removeClass('is-valid').addClass('is-invalid');
            $('#exp-form-category-error').text('Catégorie requise');
            return false;
        }

        $select.removeClass('is-invalid').addClass('is-valid');
        $('#exp-form-category-error').text('');
        return true;
    }

    validateDates() {
        if (!this.state.isRecurring) return true;

        if (!this.state.startDate || !this.state.endDate) {
            swal.fire({
                "title": "Erreur",
                "text": "Veuillez saisir les dates",
                "type": "error",
                "confirmButtonClass": "btn btn-secondary"
            });
            return false;
        }

        const start = new Date(this.state.startDate);
        const end = new Date(this.state.endDate);

        if (start > end) {
            swal.fire({
                "title": "Erreur",
                "text": "La date de début doit être avant la date de fin",
                "type": "error",
                "confirmButtonClass": "btn btn-secondary"
            });
            return false;
        }

        return true;
    }

    validateForm() {
        const isAmountValid = this.validateAmount($('#exp-form-amount')[0]);
        const isLabelValid = this.validateLabel($('#exp-form-label')[0]);
        const isCategoryValid = this.validateCategory();
        const areDatesValid = this.validateDates();

        return isAmountValid && isLabelValid && isCategoryValid && areDatesValid;
    }

    /**
     * ============================================
     * SOUMISSION (spinner uniquement ici)
     * ============================================
     */
   /**
 * ============================================
 * SOUMISSION (avec gestion des alertes)
 * ============================================
 */
async handleSubmit() {
    if (!this.validateForm()) {
        swal.fire({
            "title": "Erreur",
            "text": "Veuillez corriger les erreurs",
            "type": "error",
            "confirmButtonClass": "btn btn-secondary"
        });
        return;
    }

    const expenseData = {
        "_token": $('meta[name="csrf-token"]').attr('content'),
        "libelle": this.state.label,
        "montant": this.state.amount,
        "id_categorie_depense": this.state.category,
        "IdBudget": this.state.budget || null,
        "piece_jointe": this.state.image,
        "is_repetitive": this.state.isRecurring ? 1 : 0,
        "status_is_repetitive": this.state.isRecurring ? 0 : null,
        "date_debut": this.state.isRecurring ? this.state.startDate : null,
        "date_fin": this.state.isRecurring ? this.state.endDate : null,
        "created_at": new Date().toISOString().split('T')[0] // ✅ Ajouter created_at
    };

    if (this.state.isEditing && this.state.editingId) {
        expenseData.id = this.state.editingId;
    }

    try {
        this.showSpinner(this.state.isEditing ? 'Modification...' : 'Ajout en cours...');

        const url = this.state.isEditing ? "/expenses/update" : "/expenses/creer";

        $.ajax({
            url: url,
            method: 'POST',
            dataType: "JSON",
            data: JSON.stringify(expenseData),
            contentType: "application/json",
            success: (response) => {
                this.hideSpinner();

                console.log('Response:', response); // ✅ Debug

                if (response.status === 1) {
                    // ✅ Vérifier s'il y a des alertes de dépassement
                    if (response.alerts && response.alerts.length > 0) {
                        // Construire le message d'alerte
                        let alertMessages = response.alerts.map(alert => {
                            let icon = '';
                            if (alert.type === 'budget') {
                                icon = '💰';
                            } else if (alert.type === 'category') {
                                icon = '📊';
                            }
                            return `${icon} ${alert.message}`;
                        }).join('<br><br>');

                        // Afficher les alertes
                        swal.fire({
                            "title": this.state.isEditing ? "Dépense modifiée !" : "Dépense ajoutée !",
                            "html": `<div style="text-align: left; margin-top: 15px;">
                                        <strong>⚠️ Attention :</strong><br><br>
                                        ${alertMessages}
                                     </div>`,
                            "type": "warning",
                            "confirmButtonClass": "btn btn-warning",
                            "confirmButtonText": "J'ai compris",
                            "onClose": () => {
                                this.resetForm();
                                hideExpenseForm();

                                if (window.expensesHistory) {
                                    expensesHistory.loadData();
                                }
                            }
                        });
                    } else {
                        // Pas d'alertes - succès normal
                        swal.fire({
                            "title": "Succès",
                            "text": this.state.isEditing ? "Dépense modifiée !" : "Dépense ajoutée !",
                            "type": "success",
                            "confirmButtonClass": "btn btn-secondary",
                            "onClose": () => {
                                this.resetForm();
                                hideExpenseForm();

                                if (window.expensesHistory) {
                                    expensesHistory.loadData();
                                }
                            }
                        });
                    }
                } else if (response.status === 0) {
                    swal.fire({
                        "title": response.err_title || "Erreur",
                        "text": response.err_msg || "Erreur lors de l'enregistrement",
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary"
                    });
                } else if (response.status === -1) {
                    window.location.href = "/login";
                }
            },
            error: (error) => {
                this.hideSpinner();

                console.error('Error:', error); // ✅ Debug

                let responseText = error.responseJSON;
                swal.fire({
                    "title": responseText?.err_title || "Erreur",
                    "text": responseText?.err_msg || "Erreur lors de l'enregistrement",
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary"
                });
            }
        });

    } catch (error) {
        this.hideSpinner();
        console.error('Erreur submit:', error);
    }
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
            imageFile: null,
            isEditing: false,
            editingId: null
        };

        $('#exp-form-main')[0].reset();
        $('#exp-form-image-preview').html('');
        $('#exp-form-image-text').text('Photo');

        $('.exp-form-control, .exp-form-select').removeClass('is-valid is-invalid');
        $('.invalid-feedback').text('');

        this.populateBudgets();
        this.populateCategories();
        this.updateUI();
    }

    updateUI() {
        const title = this.state.isEditing ? 'Modifier la dépense' : 'Ajouter une dépense';
        const btnText = this.state.isEditing ? 'Modifier' : 'Ajouter';

        $('#exp-form-title').text(title);
        $('#exp-form-submit-btn').text(btnText);

        $('#exp-form-amount').val(this.state.amount || '');
        $('#exp-form-label').val(this.state.label || '');
        $('#exp-form-recurring-switch').prop('checked', this.state.isRecurring);
        $('#exp-form-start-date').val(this.state.startDate);
        $('#exp-form-end-date').val(this.state.endDate);

        this.toggleRecurring(this.state.isRecurring);
    }

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
            imageFile: null,
            isEditing: true,
            editingId: expenseData.id || null
        };

        this.populateBudgets();
        this.populateCategories();

        if (this.state.image) {
            this.showImagePreview(this.state.image);
        }

        this.updateUI();
        showExpenseForm();
    }

    showSpinner(message = 'Chargement...') {
        $('#exp-form-spinner-text').text(message);
        $('#exp-form-spinner-overlay').css('display', 'flex').hide().fadeIn(200);
    }

    hideSpinner() {
        $('#exp-form-spinner-overlay').fadeOut(200);
    }
}

// Initialisation
let expenseFormManager;

$(document).ready(function() {
    expenseFormManager = new ExpenseFormManager();
    window.expenseFormManager = expenseFormManager;
});

// Fonctions globales
function showExpenseForm() {
    $('#expense-button-container').slideUp(300);
    $('#expense-form-container').slideDown(300);
}

function hideExpenseForm() {
    expenseFormManager.resetForm();
    $('#expense-form-container').slideUp(300);
    $('#expense-button-container').slideDown(300);
}
