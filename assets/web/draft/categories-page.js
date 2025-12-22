class CategoriesPage {
    constructor() {
        this.categories = [];
        this.currentCategoryId = null;
        this.isEditing = false;
        this.baseUrl = 'http://localhost:3000/api/categories'; // Change this to your API endpoint
        
        this.colorPalette = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#FF9F80', '#81D4FA',
            '#A5D6A7', '#FFF59D', '#80DEEA', '#F48FB1', '#CE93D8'
        ];

        this.init();
    }

    async init() {
        this.setupColorPalette();
        this.setupEventListeners();
        this.setupFormValidation();
        await this.loadCategories();
        this.updatePreview();
    }

    setupColorPalette() {
        const paletteContainer = document.getElementById('colorPalette');
        paletteContainer.innerHTML = '';

        this.colorPalette.forEach(color => {
            const colorElement = document.createElement('div');
            colorElement.className = 'color-option';
            colorElement.style.cssText = `
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: ${color};
                cursor: pointer;
                border: 2px solid transparent;
                transition: transform 0.2s, border-color 0.2s;
            `;
            colorElement.dataset.color = color;

            if (color === '#FF6B6B') {
                colorElement.style.borderColor = '#212529';
                colorElement.style.transform = 'scale(1.1)';
            }

            colorElement.addEventListener('click', () => {
                document.getElementById('categoryColor').value = color;
                this.updatePreview();
                
                // Update visual selection
                document.querySelectorAll('.color-option').forEach(opt => {
                    opt.style.borderColor = 'transparent';
                    opt.style.transform = 'scale(1)';
                });
                colorElement.style.borderColor = '#212529';
                colorElement.style.transform = 'scale(1.1)';
            });

            paletteContainer.appendChild(colorElement);
        });
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('categoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleSubmit();
        });

        // Real-time preview updates
        document.getElementById('categoryName').addEventListener('input', () => {
            this.updatePreview();
            this.validateField('categoryName');
        });

        document.getElementById('categoryIcon').addEventListener('change', () => {
            this.updatePreview();
        });

        // Cancel button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.resetForm();
        });

        // Delete confirmation
        document.getElementById('confirmDelete').addEventListener('change', (e) => {
            document.getElementById('confirmDeleteBtn').disabled = !e.target.checked;
        });

        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.handleDelete();
        });

        // Modal events
        const deleteModal = document.getElementById('deleteModal');
        deleteModal.addEventListener('hidden.bs.modal', () => {
            document.getElementById('confirmDelete').checked = false;
            document.getElementById('confirmDeleteBtn').disabled = true;
        });
    }

    setupFormValidation() {
        const form = document.getElementById('categoryForm');
        
        // Real-time validation
        const nameInput = document.getElementById('categoryName');
        nameInput.addEventListener('blur', () => this.validateField('categoryName'));
        
        // Prevent form submission with invalid data
        form.addEventListener('submit', (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    }

    validateField(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId.replace('category', '') + 'Error');
        
        if (fieldId === 'categoryName') {
            const value = field.value.trim();
            
            if (!value) {
                field.classList.remove('is-valid');
                field.classList.add('is-invalid');
                if (errorElement) {
                    errorElement.textContent = 'Le nom de la catégorie est requis.';
                }
                return false;
            }
            
            if (value.length < 2) {
                field.classList.remove('is-valid');
                field.classList.add('is-invalid');
                if (errorElement) {
                    errorElement.textContent = 'Le nom doit contenir au moins 2 caractères.';
                }
                return false;
            }
            
            // Check for duplicate name (excluding current edited category)
            const duplicate = this.categories.find(cat => 
                cat.nom.toLowerCase() === value.toLowerCase() && 
                cat.id !== this.currentCategoryId
            );
            
            if (duplicate) {
                field.classList.remove('is-valid');
                field.classList.add('is-invalid');
                if (errorElement) {
                    errorElement.textContent = 'Une catégorie avec ce nom existe déjà.';
                }
                return false;
            }
            
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            return true;
        }
        
        return true;
    }

    validateForm() {
        const isNameValid = this.validateField('categoryName');
        return isNameValid;
    }

    updatePreview() {
        const name = document.getElementById('categoryName').value.trim();
        const icon = document.getElementById('categoryIcon').value;
        const color = document.getElementById('categoryColor').value;
        
        const previewContainer = document.getElementById('previewContainer');
        const previewIcon = document.getElementById('previewIcon');
        const previewName = document.getElementById('previewName');
        
        if (name) {
            previewContainer.classList.add('show');
            previewIcon.style.backgroundColor = color;
            previewIcon.innerHTML = `<i class="bi ${icon}"></i>`;
            previewName.textContent = name;
        } else {
            previewContainer.classList.remove('show');
        }
    }

    resetForm() {
        document.getElementById('categoryForm').reset();
        document.getElementById('categoryForm').classList.remove('was-validated');
        document.getElementById('categoryId').value = '';
        
        // Reset validation classes
        const nameInput = document.getElementById('categoryName');
        nameInput.classList.remove('is-valid', 'is-invalid');
        
        // Reset color selection
        document.getElementById('categoryColor').value = '#FF6B6B';
        this.setupColorPalette();
        
        // Update UI for create mode
        document.getElementById('formTitle').innerHTML = `
            <i class="bi bi-plus-circle"></i>
            <span>Nouvelle Catégorie</span>
        `;
        document.getElementById('submitBtn').innerHTML = `
            <i class="bi bi-check-circle"></i> Créer la catégorie
        `;
        document.getElementById('cancelBtn').style.display = 'none';
        
        this.isEditing = false;
        this.currentCategoryId = null;
        this.updatePreview();
    }

    async handleSubmit() {
        if (!this.validateForm()) {
            return;
        }

        const categoryData = {
            nom: document.getElementById('categoryName').value.trim(),
            icon: document.getElementById('categoryIcon').value,
            color: document.getElementById('categoryColor').value,
            type: 1 // User category
        };

        const categoryId = document.getElementById('categoryId').value;
        const isUpdate = !!categoryId;

        try {
            if (isUpdate) {
                await this.updateCategory(categoryId, categoryData);
                this.showToast('Catégorie mise à jour avec succès !', 'success');
            } else {
                await this.createCategory(categoryData);
                this.showToast('Catégorie créée avec succès !', 'success');
            }
            
            this.resetForm();
            await this.loadCategories();
            
        } catch (error) {
            console.error('Erreur:', error);
            this.showToast('Une erreur est survenue. Veuillez réessayer.', 'error');
        }
    }

    async loadCategories() {
        try {
            this.showLoading(true);
            
            // Simulated API call - replace with real API
            // const response = await fetch(this.baseUrl);
            // const data = await response.json();
            // this.categories = data;
            
            // For demo - simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Demo data - replace with API response
            this.categories = this.getDemoCategories();
            
            this.renderCategories();
            this.showLoading(false);
            
        } catch (error) {
            console.error('Erreur de chargement:', error);
            this.showToast('Impossible de charger les catégories', 'error');
            this.showLoading(false);
        }
    }

    getDemoCategories() {
        return [
            { id: 1, nom: "Nourriture", icon: "bi-cup-fill", color: "#FF6B6B", type: 1 },
            { id: 2, nom: "Transport", icon: "bi-car-front-fill", color: "#4ECDC4", type: 1 },
            { id: 3, nom: "Logement", icon: "bi-house-fill", color: "#45B7D1", type: 1 },
            { id: 4, nom: "Shopping", icon: "bi-cart-fill", color: "#96CEB4", type: 1 },
            { id: 5, nom: "Santé", icon: "bi-heart-fill", color: "#FFEAA7", type: 1 },
            { id: 6, nom: "Loisirs", icon: "bi-film", color: "#DDA0DD", type: 0 },
            { id: 7, nom: "Éducation", icon: "bi-book-fill", color: "#98D8C8", type: 1 }
        ];
    }

    async createCategory(categoryData) {
        // Simulated API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const newCategory = {
                    id: Date.now(),
                    ...categoryData
                };
                this.categories.unshift(newCategory);
                resolve(newCategory);
            }, 800);
        });
        
        // Real API implementation:
        // const response = await fetch(this.baseUrl, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(categoryData)
        // });
        // return await response.json();
    }

    async updateCategory(id, categoryData) {
        // Simulated API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = this.categories.findIndex(cat => cat.id == id);
                if (index !== -1) {
                    this.categories[index] = { ...this.categories[index], ...categoryData };
                }
                resolve();
            }, 800);
        });
        
        // Real API implementation:
        // const response = await fetch(`${this.baseUrl}/${id}`, {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(categoryData)
        // });
        // return await response.json();
    }

    async deleteCategory(id) {
        // Simulated API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const initialLength = this.categories.length;
                this.categories = this.categories.filter(cat => cat.id != id);
                
                if (this.categories.length < initialLength) {
                    resolve();
                } else {
                    reject(new Error('Catégorie non trouvée'));
                }
            }, 800);
        });
        
        // Real API implementation:
        // const response = await fetch(`${this.baseUrl}/${id}`, {
        //     method: 'DELETE'
        // });
        // if (!response.ok) throw new Error('Échec de la suppression');
        // return response.json();
    }

    renderCategories() {
        const listContainer = document.getElementById('categoryList');
        const emptyState = document.getElementById('emptyState');
        const categoryCount = document.getElementById('categoryCount');
        
        if (this.categories.length === 0) {
            listContainer.style.display = 'none';
            emptyState.style.display = 'block';
            categoryCount.textContent = '0';
            return;
        }
        
        emptyState.style.display = 'none';
        listContainer.style.display = 'block';
        categoryCount.textContent = this.categories.length.toString();
        
        listContainer.innerHTML = this.categories.map(category => `
            <div class="category-item" data-id="${category.id}">
                <div class="category-info">
                    <div class="category-icon" style="background-color: ${category.color}">
                        <i class="bi ${category.icon}"></i>
                    </div>
                    <div class="category-details">
                        <div class="category-name">${category.nom}</div>
                        <div class="category-type">
                            ${category.type === 1 ? 'Catégorie utilisateur' : 'Catégorie système'}
                            ${category.type === 0 ? '<span class="system-badge ms-2">Système</span>' : ''}
                        </div>
                    </div>
                </div>
                <div class="category-actions">
                    ${category.type === 1 ? `
                        <button class="action-btn btn-edit" onclick="categoriesPage.editCategory(${category.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="action-btn btn-delete" onclick="categoriesPage.confirmDelete(${category.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    editCategory(id) {
        const category = this.categories.find(cat => cat.id == id);
        if (!category) return;

        // Fill form with category data
        document.getElementById('categoryId').value = category.id;
        document.getElementById('categoryName').value = category.nom;
        document.getElementById('categoryIcon').value = category.icon;
        document.getElementById('categoryColor').value = category.color;
        
        // Update color palette selection
        this.setupColorPalette();
        const selectedColor = document.querySelector(`.color-option[data-color="${category.color}"]`);
        if (selectedColor) {
            selectedColor.style.borderColor = '#212529';
            selectedColor.style.transform = 'scale(1.1)';
        }
        
        // Update UI for edit mode
        document.getElementById('formTitle').innerHTML = `
            <i class="bi bi-pencil"></i>
            <span>Modifier la catégorie</span>
        `;
        document.getElementById('submitBtn').innerHTML = `
            <i class="bi bi-check-circle"></i> Mettre à jour
        `;
        document.getElementById('cancelBtn').style.display = 'block';
        
        // Update preview
        this.updatePreview();
        
        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        
        // Focus on name field
        document.getElementById('categoryName').focus();
        
        this.isEditing = true;
        this.currentCategoryId = id;
    }

    confirmDelete(id) {
        const category = this.categories.find(cat => cat.id == id);
        if (!category) return;

        this.currentCategoryId = id;
        document.getElementById('deleteMessage').textContent = 
            `Êtes-vous sûr de vouloir supprimer la catégorie "${category.nom}" ?`;
        
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        deleteModal.show();
    }

    async handleDelete() {
        try {
            await this.deleteCategory(this.currentCategoryId);
            
            // Close modal
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            deleteModal.hide();
            
            // Show success message
            this.showToast('Catégorie supprimée avec succès !', 'success');
            
            // Reload categories
            await this.loadCategories();
            
            // Reset form if editing the deleted category
            if (this.isEditing && this.currentCategoryId == document.getElementById('categoryId').value) {
                this.resetForm();
            }
            
        } catch (error) {
            console.error('Erreur de suppression:', error);
            this.showToast('Erreur lors de la suppression', 'error');
        }
    }

    showLoading(show) {
        const loadingState = document.getElementById('loadingState');
        const listContainer = document.getElementById('categoryList');
        const emptyState = document.getElementById('emptyState');
        
        if (show) {
            loadingState.style.display = 'block';
            listContainer.style.display = 'none';
            emptyState.style.display = 'none';
        } else {
            loadingState.style.display = 'none';
        }
    }

    showToast(message, type = 'info') {
        const toastId = 'toast-' + Date.now();
        const bgClass = type === 'success' ? 'bg-success' : 
                       type === 'error' ? 'bg-danger' : 
                       'bg-primary';
        
        const icon = type === 'success' ? 'bi-check-circle-fill' :
                    type === 'error' ? 'bi-exclamation-circle-fill' :
                    'bi-info-circle-fill';
        
        const toastHtml = `
            <div id="${toastId}" class="toast ${bgClass} text-white" role="alert">
                <div class="toast-header ${bgClass} text-white">
                    <i class="bi ${icon} me-2"></i>
                    <strong class="me-auto">${type === 'success' ? 'Succès' : type === 'error' ? 'Erreur' : 'Information'}</strong>
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
            autohide: true
        });
        
        toast.show();

        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }
}

// Initialize the application
let categoriesPage;
document.addEventListener('DOMContentLoaded', () => {
    categoriesPage = new CategoriesPage();
    window.categoriesPage = categoriesPage; // Expose globally for inline event handlers
});