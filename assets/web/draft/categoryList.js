class CategoryList {
    constructor(config = {}) {
        this.config = {
            apiUrl: config.apiUrl || '/api/categories',
            translations: config.translations || this.getDefaultTranslations(),
            categories: config.categories || [],
            onDelete: config.onDelete || null,
            onEdit: config.onEdit || null
        };

        this.state = {
            isExpanded: false,
            isLoading: false,
            hasLoadingError: false,
            deleteModalVisible: false,
            editModalVisible: false,
            categoryToDelete: null,
            categoryToEdit: null,
            isDeleting: false,
            isEditing: false,
            isChecked: false,
            typedName: '',
            inputError: false
        };

        this.categories = [];
        this.categoryFormRef = null;
        this.init();
    }

    getDefaultTranslations() {
        return {
            category: {
                list: "Liste des Catégories",
                loading_category: "Chargement des catégories...",
                no_category_found: "Aucune catégorie trouvée",
                system: "Système",
                update_title: "Modifier Catégorie",
                update: "Mettre à jour"
            },
            operation_crud_and_other: {
                error: "Erreur",
                unable_to_load_data: "Impossible de charger les données",
                error_loading: "Erreur de chargement",
                retry: "Réessayer",
                confirm_delete: "Confirmer la suppression",
                deletion_in_progress: "Suppression en cours",
                update_in_progress: "Mise à jour en cours",
                please_wait: "Veuillez patienter...",
                concel: "Annuler",
                delete: "Supprimer",
                confirm_delete_checkbox: "Je confirme vouloir supprimer cette catégorie",
                warning_text: "Cette action est irréversible",
                incorrect_name: "Nom incorrect"
            },
            toast_expense_category: {
                category_deleted: "Catégorie supprimée avec succès"
            }
        };
    }

    init() {
        this.setupEventListeners();
        this.loadCategories();
        this.render();
    }

    setupEventListeners() {
        // Accordion toggle
        const accordionHeader = document.getElementById('accordionHeader');
        if (accordionHeader) {
            accordionHeader.addEventListener('click', () => this.toggleAccordion());
        }

        // Modal close buttons
        document.getElementById('closeDeleteModal')?.addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('closeEditModal')?.addEventListener('click', () => this.closeEditModal());

        // Close modal when clicking outside
        document.getElementById('deleteModal')?.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeDeleteModal();
        });

        document.getElementById('editModal')?.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeEditModal();
        });
    }

    async loadCategories() {
        if (!this.state.isExpanded && !this.state.deleteModalVisible && !this.state.editModalVisible) {
            return;
        }

        this.setState({ isLoading: true, hasLoadingError: false });
        this.showSpinner(true);

        try {
            // Simulate API call
            await this.simulateApiCall();
            // In a real app, you would do:
            // const response = await fetch(this.config.apiUrl);
            // const data = await response.json();
            // this.categories = data;
            
            // For demo, use sample data
            this.categories = this.getSampleCategories();
            this.renderCategoryList();
        } catch (error) {
            console.error('Erreur lors du chargement des catégories:', error);
            this.setState({ hasLoadingError: true });
            this.showToast(this.config.translations.operation_crud_and_other.unable_to_load_data, 'error');
        } finally {
            this.setState({ isLoading: false });
            this.showSpinner(false);
        }
    }

    getSampleCategories() {
        return [
            { id: 1, nom: "Nourriture", icon: "bi-cup-fill", color: "#FF6B6B", type: 1 },
            { id: 2, nom: "Transport", icon: "bi-car-front-fill", color: "#4ECDC4", type: 1 },
            { id: 3, nom: "Logement", icon: "bi-house-fill", color: "#45B7D1", type: 1 },
            { id: 4, nom: "Shopping", icon: "bi-bag-fill", color: "#96CEB4", type: 1 },
            { id: 5, nom: "Santé", icon: "bi-heart-fill", color: "#FFEAA7", type: 1 },
            { id: 6, nom: "Éducation", icon: "bi-book-fill", color: "#DDA0DD", type: 0 },
            { id: 7, nom: "Loisirs", icon: "bi-controller", color: "#98D8C8", type: 1 },
            { id: 8, nom: "Autres", icon: "bi-three-dots", color: "#F7DC6F", type: 1 }
        ];
    }

    simulateApiCall() {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 1000);
        });
    }

    toggleAccordion() {
        const newState = !this.state.isExpanded;
        this.setState({ isExpanded: newState });
        
        const content = document.getElementById('accordionContent');
        const icon = document.getElementById('accordionIcon');
        
        if (newState) {
            content.style.display = 'block';
            icon.className = 'bi bi-chevron-up';
            this.loadCategories();
        } else {
            content.style.display = 'none';
            icon.className = 'bi bi-chevron-down';
        }
    }

    render() {
        this.renderCategoryList();
    }

    renderCategoryList() {
        const container = document.getElementById('categoryList');
        if (!container) return;

        if (this.state.isLoading) {
            container.innerHTML = this.getLoadingTemplate();
            return;
        }

        if (this.state.hasLoadingError) {
            container.innerHTML = this.getErrorTemplate();
            return;
        }

        if (this.categories.length === 0) {
            container.innerHTML = this.getEmptyTemplate();
            return;
        }

        container.innerHTML = this.categories.map(category => this.getCategoryItemTemplate(category)).join('');
        
        // Add event listeners to action buttons
        this.attachCategoryEventListeners();
    }

    getLoadingTemplate() {
        return `
            <div class="loading-state">
                <div class="loading-spinner">
                    <i class="bi bi-hourglass-split" style="font-size: 40px;"></i>
                </div>
                <div class="loading-text">${this.config.translations.category.loading_category}</div>
                <div class="loading-subtext">${this.config.translations.operation_crud_and_other.please_wait}</div>
            </div>
        `;
    }

    getErrorTemplate() {
        return `
            <div class="error-state">
                <div class="error-icon">
                    <i class="bi bi-exclamation-triangle-fill" style="font-size: 40px;"></i>
                </div>
                <div class="error-text">${this.config.translations.operation_crud_and_other.error_loading}</div>
                <div class="error-subtext">${this.config.translations.operation_crud_and_other.unable_to_load_data}</div>
                <button class="retry-btn" id="retryBtn">
                    ${this.config.translations.operation_crud_and_other.retry}
                </button>
            </div>
        `;
    }

    getEmptyTemplate() {
        return `
            <div class="empty-state">
                ${this.config.translations.category.no_category_found}
            </div>
        `;
    }

    getCategoryItemTemplate(category) {
        const isUserCategory = category.type === 1;
        const categoryName = category.nom; // In real app, use translation function
        
        return `
            <div class="category-item" data-id="${category.id}">
                <div class="category-info">
                    <div class="icon-wrapper" style="background-color: ${category.color}">
                        <i class="bi ${category.icon} text-white"></i>
                    </div>
                    <span class="category-label">${categoryName}</span>
                </div>
                <div class="category-actions">
                    ${isUserCategory ? `
                        <button class="action-btn edit-btn" data-action="edit" data-id="${category.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="action-btn delete-btn" data-action="delete" data-id="${category.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    ` : `
                        <div class="system-label">
                            <span>Système</span>
                            <i class="bi bi-lock"></i>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    attachCategoryEventListeners() {
        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.handleEditCategory(id);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.confirmDeleteCategory(id);
            });
        });

        // Retry button
        const retryBtn = document.getElementById('retryBtn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.loadCategories());
        }
    }

    handleEditCategory(id) {
        const category = this.categories.find(c => c.id === id);
        if (!category) return;

        this.setState({ categoryToEdit: category, editModalVisible: true });
        this.openEditModal();
    }

    confirmDeleteCategory(id) {
        const category = this.categories.find(c => c.id === id);
        if (!category) return;

        this.setState({ 
            categoryToDelete: category, 
            deleteModalVisible: true,
            isChecked: false,
            typedName: '',
            inputError: false
        });
        this.openDeleteModal();
    }

    async handleDeleteCategory() {
        if (!this.state.categoryToDelete) return;

        this.setState({ isDeleting: true });
        this.updateDeleteModalContent();

        try {
            // Simulate API call
            await this.simulateDeleteApiCall();
            
            // In real app:
            // await fetch(`${this.config.apiUrl}/${this.state.categoryToDelete.id}`, {
            //     method: 'DELETE'
            // });

            // Remove from local array
            this.categories = this.categories.filter(c => c.id !== this.state.categoryToDelete.id);
            
            // Close modal
            this.closeDeleteModal();
            
            // Show success toast
            this.showToast(this.config.translations.toast_expense_category.category_deleted, 'success');
            
            // Reload list
            this.renderCategoryList();
            
            // Callback if provided
            if (this.config.onDelete) {
                this.config.onDelete(this.state.categoryToDelete.id);
            }
        } catch (error) {
            console.error("Échec de la suppression de la catégorie:", error);
            this.showToast(`Échec de la suppression: ${error.message || "Erreur inconnue"}`, 'error');
        } finally {
            this.setState({ isDeleting: false });
        }
    }

    simulateDeleteApiCall() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 10% failure rate
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error("Échec de la suppression"));
                }
            }, 1500);
        });
    }

    openDeleteModal() {
        const modal = document.getElementById('deleteModal');
        modal.classList.add('show');
        this.updateDeleteModalContent();
    }

    updateDeleteModalContent() {
        const body = document.getElementById('deleteModalBody');
        const footer = document.getElementById('deleteModalFooter');
        
        if (this.state.isDeleting) {
            body.innerHTML = this.getDeletingTemplate();
            footer.innerHTML = '';
            return;
        }

        if (!this.state.categoryToDelete) return;

        const categoryName = this.state.categoryToDelete.nom;
        
        body.innerHTML = `
            <div class="checkbox-container">
                <div class="checkbox ${this.state.isChecked ? 'checked' : ''}" id="confirmCheckbox">
                    ${this.state.isChecked ? '<i class="bi bi-check text-white"></i>' : ''}
                </div>
                <div class="checkbox-label">
                    ${this.config.translations.operation_crud_and_other.confirm_delete_checkbox}
                </div>
            </div>
            ${this.state.inputError ? `
                <div class="error-message">
                    <i class="bi bi-exclamation-circle me-2"></i>
                    ${this.config.translations.operation_crud_and_other.incorrect_name}
                </div>
            ` : ''}
            <div class="warning-text">
                ⚠️ ${this.config.translations.operation_crud_and_other.warning_text}
            </div>
        `;

        footer.innerHTML = `
            <button class="modal-btn modal-btn-cancel" id="cancelDeleteBtn">
                ${this.config.translations.operation_crud_and_other.concel}
            </button>
            <button class="modal-btn modal-btn-confirm" id="confirmDeleteBtn" 
                    ${!this.state.isChecked ? 'disabled' : ''}>
                ${this.config.translations.operation_crud_and_other.delete}
            </button>
        `;

        // Attach event listeners
        document.getElementById('confirmCheckbox')?.addEventListener('click', () => {
            this.setState({ isChecked: !this.state.isChecked });
            this.updateDeleteModalContent();
        });

        document.getElementById('cancelDeleteBtn')?.addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('confirmDeleteBtn')?.addEventListener('click', () => this.handleConfirmDelete());
    }

    getDeletingTemplate() {
        return `
            <div class="deleting-container">
                <div class="spinner-border text-warning" role="status">
                    <span class="visually-hidden">Chargement...</span>
                </div>
                <div class="deleting-text">
                    ${this.config.translations.operation_crud_and_other.deletion_in_progress}...
                </div>
                <div class="deleting-subtext">
                    ${this.config.translations.operation_crud_and_other.please_wait}
                </div>
            </div>
        `;
    }

    openEditModal() {
        const modal = document.getElementById('editModal');
        modal.classList.add('show');
        this.loadEditForm();
    }

    loadEditForm() {
        const container = document.getElementById('editFormContainer');
        if (!container || !this.state.categoryToEdit) return;

        // In a real app, you would load the CategoryForm1 component here
        // For this example, we'll create a simple form
        container.innerHTML = `
            <div class="form-row mb-3">
                <input type="text" 
                       id="editCategoryName" 
                       class="form-control" 
                       value="${this.state.categoryToEdit.nom}"
                       placeholder="Nom de la catégorie">
            </div>
            <div class="preview-container d-flex align-items-center gap-3 p-3 bg-light rounded mb-3" id="editPreview">
                <div class="icon-wrapper" style="background-color: ${this.state.categoryToEdit.color}">
                    <i class="bi ${this.state.categoryToEdit.icon} text-white"></i>
                </div>
                <span class="category-label">${this.state.categoryToEdit.nom}</span>
            </div>
        `;

        // Update footer
        const footer = document.getElementById('editModalFooter');
        footer.innerHTML = `
            <button class="modal-btn modal-btn-cancel" id="cancelEditBtn">
                ${this.config.translations.operation_crud_and_other.concel}
            </button>
            <button class="modal-btn modal-btn-update" id="updateCategoryBtn">
                ${this.config.translations.category.update}
            </button>
        `;

        // Attach event listeners
        document.getElementById('cancelEditBtn')?.addEventListener('click', () => this.closeEditModal());
        document.getElementById('updateCategoryBtn')?.addEventListener('click', () => this.handleUpdateCategory());
        
        // Update preview on input
        document.getElementById('editCategoryName')?.addEventListener('input', (e) => {
            const preview = document.getElementById('editPreview');
            if (preview) {
                preview.querySelector('.category-label').textContent = e.target.value;
            }
        });
    }

    async handleUpdateCategory() {
        const input = document.getElementById('editCategoryName');
        if (!input || !this.state.categoryToEdit) return;

        const newName = input.value.trim();
        if (!newName) {
            this.showToast("Le nom de la catégorie est requis", 'error');
            return;
        }

        this.setState({ isEditing: true });
        this.updateEditModalContent();

        try {
            // Simulate API call
            await this.simulateUpdateApiCall();
            
            // Update local data
            const updatedCategory = {
                ...this.state.categoryToEdit,
                nom: newName
            };
            
            const index = this.categories.findIndex(c => c.id === updatedCategory.id);
            if (index !== -1) {
                this.categories[index] = updatedCategory;
            }

            // Close modal
            this.closeEditModal();
            
            // Show success toast
            this.showToast("Catégorie mise à jour avec succès", 'success');
            
            // Reload list
            this.renderCategoryList();
            
            // Callback if provided
            if (this.config.onEdit) {
                this.config.onEdit(updatedCategory.id);
            }
        } catch (error) {
            console.error("Échec de la mise à jour de la catégorie:", error);
            this.showToast(`Échec de la mise à jour: ${error.message || "Erreur inconnue"}`, 'error');
        } finally {
            this.setState({ isEditing: false });
        }
    }

    simulateUpdateApiCall() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error("Échec de la mise à jour"));
                }
            }, 1000);
        });
    }

    updateEditModalContent() {
        const footer = document.getElementById('editModalFooter');
        if (this.state.isEditing) {
            footer.innerHTML = `
                <div class="deleting-container w-100">
                    <div class="spinner-border text-warning spinner-border-sm" role="status">
                        <span class="visually-hidden">Chargement...</span>
                    </div>
                    <div class="deleting-text mt-2">
                        ${this.config.translations.operation_crud_and_other.update_in_progress}...
                    </div>
                </div>
            `;
        }
    }

    handleConfirmDelete() {
        if (!this.state.isChecked) {
            this.setState({ inputError: true });
            this.updateDeleteModalContent();
            return;
        }

        this.handleDeleteCategory();
    }

    closeDeleteModal() {
        const modal = document.getElementById('deleteModal');
        modal.classList.remove('show');
        this.setState({ 
            deleteModalVisible: false,
            categoryToDelete: null,
            isChecked: false,
            typedName: '',
            inputError: false,
            isDeleting: false
        });
    }

    closeEditModal() {
        const modal = document.getElementById('editModal');
        modal.classList.remove('show');
        this.setState({ 
            editModalVisible: false,
            categoryToEdit: null,
            isEditing: false
        });
    }

    showToast(message, type = 'info') {
        const toastId = 'toast-' + Date.now();
        const toastHtml = `
            <div id="${toastId}" class="toast align-items-center text-bg-${type === 'success' ? 'success' : 'danger'} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;

        const container = document.getElementById('toastContainer');
        container.insertAdjacentHTML('beforeend', toastHtml);

        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
        toast.show();

        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    showSpinner(show) {
        const spinner = document.getElementById('spinnerOverlay');
        if (spinner) {
            spinner.style.display = show ? 'flex' : 'none';
        }
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
    }
}

// Initialize the component when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const categoryList = new CategoryList({
        translations: {
            category: {
                list: "Liste des Catégories",
                loading_category: "Chargement des catégories...",
                no_category_found: "Aucune catégorie trouvée",
                system: "Système",
                update_title: "Modifier Catégorie",
                update: "Mettre à jour"
            },
            operation_crud_and_other: {
                error: "Erreur",
                unable_to_load_data: "Impossible de charger les données",
                error_loading: "Erreur de chargement",
                retry: "Réessayer",
                confirm_delete: "Confirmer la suppression",
                deletion_in_progress: "Suppression en cours",
                update_in_progress: "Mise à jour en cours",
                please_wait: "Veuillez patienter...",
                concel: "Annuler",
                delete: "Supprimer",
                confirm_delete_checkbox: "Je confirme vouloir supprimer cette catégorie",
                warning_text: "Cette action est irréversible. Toutes les dépenses associées seront affectées.",
                incorrect_name: "Nom incorrect"
            },
            toast_expense_category: {
                category_deleted: "Catégorie supprimée avec succès!"
            }
        }
    });

    // Expose to global scope for debugging
    window.categoryList = categoryList;
});