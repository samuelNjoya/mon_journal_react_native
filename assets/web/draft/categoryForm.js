class CategoryForm {
    constructor(config = {}) {
        this.config = {
            apiUrl: config.apiUrl || '/api/categories',
            translations: config.translations || this.getDefaultTranslations(),
            inModal: config.inModal || false,
            initialData: config.initialData || null,
            onSubmitSuccess: config.onSubmitSuccess || null
        };

        this.state = {
            name: '',
            icon: 'bi-tag-fill',
            isExpanded: !config.inModal,
            loading: false,
            toast: null
        };

        this.categories = config.categories || [];
        this.init();
    }

    getDefaultTranslations() {
        return {
            category: {
                new_title: "Nouvelle Catégorie",
                update_title: "Modifier Catégorie",
                create: "Créer",
                update: "Mettre à jour"
            },
            toast_expense_category: {
                category_added: "Catégorie ajoutée avec succès",
                category_updated: "Catégorie mise à jour avec succès"
            },
            toast_validation_category: "Une catégorie avec ce nom existe déjà",
            operation_crud_and_other: {
                validation_error: "Erreur de validation"
            }
        };
    }

    init() {
        if (this.config.inModal) {
            this.setupModalForm();
        } else {
            this.setupNormalForm();
        }

        if (this.config.initialData) {
            this.loadInitialData(this.config.initialData);
        }

        this.setupEventListeners();
    }

    setupNormalForm() {
        const title = this.config.initialData ? 
            this.config.translations.category.update_title : 
            this.config.translations.category.new_title;
        
        const buttonText = this.config.initialData ? 
            this.config.translations.category.update : 
            this.config.translations.category.create;

        document.getElementById('formTitle').textContent = title;
        document.getElementById('submitButton').textContent = buttonText;
    }

    setupModalForm() {
        const modalContent = `
            <div class="form-row">
                <input type="text" 
                       id="modalCategoryName" 
                       class="form-input" 
                       placeholder="Nom de la catégorie"
                       value="${this.state.name}">
            </div>
            
            <div class="preview-container" id="modalPreviewContainer" style="display: ${this.state.name ? 'flex' : 'none'}">
                <div class="icon-wrapper" id="modalPreviewIcon" style="background-color: ${this.stringToColor(this.state.name)}">
                    <i class="bi ${this.state.icon} text-white"></i>
                </div>
                <span class="preview-text" id="modalPreviewText">${this.state.name}</span>
            </div>
        `;

        document.getElementById('modalFormContent').innerHTML = modalContent;
        
        const modalTitle = this.config.initialData ? 
            this.config.translations.category.update_title : 
            this.config.translations.category.new_title;
        document.getElementById('modalTitle').textContent = modalTitle;

        this.setupModalEventListeners();
    }

    setupEventListeners() {
        const inputId = this.config.inModal ? 'modalCategoryName' : 'categoryName';
        const input = document.getElementById(inputId);
        
        if (input) {
            input.addEventListener('input', (e) => {
                this.setState({ name: e.target.value });
                this.updatePreview();
            });
        }
    }

    setupModalEventListeners() {
        const input = document.getElementById('modalCategoryName');
        if (input) {
            input.addEventListener('input', (e) => {
                this.setState({ name: e.target.value });
                this.updatePreview();
            });
        }
    }

    loadInitialData(data) {
        this.setState({
            name: data.nom || '',
            icon: data.icon || 'bi-tag-fill'
        });

        if (!this.config.inModal) {
            document.getElementById('categoryName').value = data.nom || '';
        } else {
            const modalInput = document.getElementById('modalCategoryName');
            if (modalInput) {
                modalInput.value = data.nom || '';
            }
        }

        this.updatePreview();
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
    }

    stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        const r = (hash >> 0) & 0xff;
        const g = (hash >> 8) & 0xff;
        const b = (hash >> 16) & 0xff;

        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }

    validateCategoryName(name, categories, currentId = null) {
        if (!name || name.trim().length === 0) {
            return "Le nom de la catégorie est requis";
        }

        const trimmedName = name.trim();
        const existingCategory = categories.find(cat => 
            cat.nom.toLowerCase() === trimmedName.toLowerCase() && 
            cat.id !== currentId
        );

        if (existingCategory) {
            return this.config.translations.toast_validation_category;
        }

        return null;
    }

    async handleSubmit() {
        const name = this.state.name.trim();
        const color = this.stringToColor(name);
        const icon = 'bi-tag-fill';

        const categoryData = {
            id: this.config.initialData?.id || undefined,
            nom: name,
            icon: icon,
            color: color,
            type: this.config.initialData?.type || 1
        };

        const error = this.validateCategoryName(
            name, 
            this.categories, 
            this.config.initialData?.id
        );

        if (error) {
            this.showAlert(
                this.config.translations.operation_crud_and_other.validation_error,
                error
            );
            return;
        }

        this.setLoading(true);

        try {
            const result = await this.submitToApi(categoryData);
            
            if (result.success) {
                this.showToast(
                    this.config.initialData ? 
                    this.config.translations.toast_expense_category.category_updated :
                    this.config.translations.toast_expense_category.category_added,
                    'success'
                );

                this.resetForm();

                if (this.config.inModal && this.config.onSubmitSuccess) {
                    this.config.onSubmitSuccess();
                }

                // Émettre un événement pour informer les autres composants
                this.emitCategoryUpdated();
            } else {
                throw new Error(result.error || 'Erreur inconnue');
            }
        } catch (error) {
            console.error("Échec de la soumission de la catégorie:", error);
            this.showToast(error.message || "Une erreur est survenue", 'error');
        } finally {
            this.setLoading(false);
        }
    }

    async submitToApi(categoryData) {
        // Simulation d'une requête AJAX
        const method = categoryData.id ? 'PUT' : 'POST';
        const url = categoryData.id ? 
            `${this.config.apiUrl}/${categoryData.id}` : 
            this.config.apiUrl;

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simuler une réponse réussie dans 90% des cas
                if (Math.random() > 0.1) {
                    resolve({
                        success: true,
                        data: { ...categoryData, id: categoryData.id || Date.now() }
                    });
                } else {
                    reject(new Error("Échec de l'enregistrement"));
                }
            }, 1000);
        });
    }

    updatePreview() {
        const name = this.state.name;
        
        if (this.config.inModal) {
            const previewContainer = document.getElementById('modalPreviewContainer');
            const previewIcon = document.getElementById('modalPreviewIcon');
            const previewText = document.getElementById('modalPreviewText');
            
            if (name.trim().length > 0) {
                previewContainer.style.display = 'flex';
                previewIcon.style.backgroundColor = this.stringToColor(name);
                previewText.textContent = name;
            } else {
                previewContainer.style.display = 'none';
            }
        } else {
            const previewContainer = document.getElementById('previewContainer');
            const previewIcon = document.getElementById('previewIcon');
            const previewText = document.getElementById('previewText');
            
            if (name.trim().length > 0) {
                previewContainer.style.display = 'flex';
                previewIcon.style.backgroundColor = this.stringToColor(name);
                previewText.textContent = name;
            } else {
                previewContainer.style.display = 'none';
            }
        }
    }

    setLoading(loading) {
        this.setState({ loading });
        const spinner = document.getElementById('spinnerOverlay');
        if (spinner) {
            spinner.style.display = loading ? 'flex' : 'none';
        }
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

    showAlert(title, message) {
        // Créer une modal Bootstrap pour l'alerte
        const alertModal = `
            <div class="modal fade" id="alertModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>${message}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', alertModal);
        const modal = new bootstrap.Modal(document.getElementById('alertModal'));
        modal.show();

        document.getElementById('alertModal').addEventListener('hidden.bs.modal', () => {
            document.getElementById('alertModal').remove();
        });
    }

    resetForm() {
        this.setState({ name: '', icon: 'bi-tag-fill' });
        
        if (this.config.inModal) {
            document.getElementById('modalCategoryName').value = '';
        } else {
            document.getElementById('categoryName').value = '';
        }
        
        this.updatePreview();
    }

    emitCategoryUpdated() {
        const event = new CustomEvent('categoryUpdated', {
            detail: { timestamp: new Date() }
        });
        window.dispatchEvent(event);
    }
}

// Fonctions globales pour l'interface
let categoryFormInstance = null;

function toggleAccordion() {
    const content = document.getElementById('accordionContent');
    const icon = document.getElementById('accordionIcon');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.className = 'bi bi-chevron-up';
    } else {
        content.style.display = 'none';
        icon.className = 'bi bi-chevron-down';
    }
}

function handleSubmit() {
    if (!categoryFormInstance) {
        categoryFormInstance = new CategoryForm();
    }
    categoryFormInstance.handleSubmit();
}

function submitModalForm() {
    if (categoryFormInstance) {
        categoryFormInstance.handleSubmit();
    }
}

// Exemple d'initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser le formulaire normal
    categoryFormInstance = new CategoryForm({
        categories: [], // Remplacer par vos données réelles
        translations: {
            category: {
                new_title: "Nouvelle Catégorie",
                update_title: "Modifier Catégorie",
                create: "Créer",
                update: "Mettre à jour"
            },
            toast_expense_category: {
                category_added: "Catégorie ajoutée avec succès!",
                category_updated: "Catégorie mise à jour avec succès!"
            },
            toast_validation_category: "Une catégorie avec ce nom existe déjà",
            operation_crud_and_other: {
                validation_error: "Erreur de validation"
            }
        }
    });

    // Exemple d'ouverture de modal avec des données
    window.openEditModal = function(categoryData) {
        const modalForm = new CategoryForm({
            inModal: true,
            initialData: categoryData,
            categories: [], // Remplacer par vos données réelles
            onSubmitSuccess: function() {
                const modal = bootstrap.Modal.getInstance(document.getElementById('categoryModal'));
                modal.hide();
            }
        });

        const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
        modal.show();
    };
});