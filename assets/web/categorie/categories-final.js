class CategoriesManager {
    constructor() {
        // Configuration de l'API
        this.API_BASE_URL = 'http://localhost:3000/api'; // À MODIFIER avec votre URL d'API
        
        // Endpoints API
        this.ENDPOINTS = {
            CATEGORIES: '/categories',
            CATEGORY_BY_ID: (id) => `/categories/${id}`
        };
        
        // Initialisation
        this.categories = [];
        this.currentEditId = null;
        this.currentDeleteId = null;

         // Catégories système (type = 0)
        this.systemCategories = [
            { id: -1, name: "Alimentation", type: 0 },
            { id: -2, name: "Transport", type: 0 },
            { id: -3, name: "Logement", type: 0 },
            { id: -4, name: "Santé", type: 0 },
            { id: -5, name: "Éducation", type: 0 }
        ];
        
        this.init();
    }

    /**
     * ============================================
     * INITIALISATION DE L'APPLICATION
     * ============================================
     */
    async init() {
        this.setupEventListeners();
        await this.loadCategories(); // Charger les catégories au démarrage
        //this.updateCount();
        
        // Focus sur l'input au chargement
        setTimeout(() => {
            document.getElementById('categoryName').focus();
        }, 500);
    }

    /**
     * ============================================
     * CONFIGURATION DES ÉVÉNEMENTS
     * ============================================
     */
    setupEventListeners() {
        // 1. Soumission du formulaire d'ajout
        document.getElementById('categoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCategory();
        });

        // 2. Validation en temps réel pour l'ajout
        document.getElementById('categoryName').addEventListener('input', (e) => {
            this.validateInput(e.target);
        });

        // 3. Bouton d'enregistrement dans le modal d'édition
        document.getElementById('saveEditBtn').addEventListener('click', () => {
            this.saveEdit();
        });

        // 4. Validation en temps réel pour l'édition
        document.getElementById('editCategoryName').addEventListener('input', (e) => {
            this.validateEditInput(e.target);
        });

        // 5. Confirmation de suppression
        document.getElementById('confirmDeleteCheckbox').addEventListener('change', (e) => {
            document.getElementById('confirmDeleteBtn').disabled = !e.target.checked;
        });

        // 6. Bouton de suppression dans le modal
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.deleteCategory();
        });

        // 7. Réinitialiser les modals quand ils se ferment
        document.getElementById('editModal').addEventListener('hidden.bs.modal', () => {
            this.resetEditForm();
        });

        document.getElementById('deleteModal').addEventListener('hidden.bs.modal', () => {
            this.resetDeleteForm();
        });

        // 8. Soumission du formulaire d'édition avec Enter
        document.getElementById('editForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEdit();
        });
    }

    /**
     * ============================================
     * FONCTIONS D'AFFICHAGE (UI)
     * ============================================
     */

    // Affiche le spinner de chargement
    showSpinner(message = 'Chargement...') {
        const spinner = document.getElementById('spinnerOverlay');
        const spinnerText = document.getElementById('spinnerText');
        
        spinnerText.textContent = message;
        spinner.style.display = 'flex';
    }

    // Cache le spinner de chargement
    hideSpinner() {
        const spinner = document.getElementById('spinnerOverlay');
        spinner.style.display = 'none';
    }

    // Met à jour le compteur de catégories
    // updateCount() {
    //     const countElement = document.getElementById('categoryCount');
    //     countElement.textContent = this.categories.length;
        
    //     // Animation du badge
    //     countElement.style.transform = 'scale(1.2)';
    //     setTimeout(() => {
    //         countElement.style.transform = 'scale(1)';
    //     }, 300);
    // }

    // Affiche une notification toast
    showToast(message, type = 'info') {
        const toastId = 'toast-' + Date.now();
        
        // Configuration selon le type
        const config = {
            success: { 
                bgClass: 'bg-success', 
                icon: 'bi-check-circle-fill',
                title: 'Succès'
            },
            error: { 
                bgClass: 'bg-danger', 
                icon: 'bi-exclamation-circle-fill',
                title: 'Erreur'
            },
            warning: { 
                bgClass: 'bg-warning', 
                icon: 'bi-exclamation-triangle-fill',
                title: 'Attention'
            },
            info: { 
                bgClass: 'bg-primary', 
                icon: 'bi-info-circle-fill',
                title: 'Information'
            }
        };

        const { bgClass, icon, title } = config[type] || config.info;

        const toastHtml = `
            <div id="${toastId}" class="toast ${bgClass} text-white" role="alert">
                <div class="toast-header ${bgClass} text-white">
                    <i class="bi ${icon} me-2"></i>
                    <strong class="me-auto">${title}</strong>
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

    // Rend la liste des catégories
    // renderCategories() {
    //     const listContainer = document.getElementById('categoriesList');
    //     const emptyState = document.getElementById('emptyState');
        
    //     if (this.categories.length === 0) {
    //         listContainer.innerHTML = '';
    //         emptyState.style.display = 'block';
    //         return;
    //     }
        
    //     emptyState.style.display = 'none';
        
    //     listContainer.innerHTML = this.categories.map(category => `
    //         <li class="category-item" data-id="${category.id}">
    //             <div class="category-name">${category.name}</div>
    //             <div class="category-actions">
    //                 <button class="btn-action btn-edit" onclick="categoriesManager.editCategory(${category.id})">
    //                     <i class="bi bi-pencil"></i>
    //                 </button>
    //                 <button class="btn-action btn-delete" onclick="categoriesManager.confirmDelete(${category.id})">
    //                     <i class="bi bi-trash"></i>
    //                 </button>
    //             </div>
    //         </li>
    //     `).join('');
    // }

     // MODIFIÉ : Affichage avec distinction système/utilisateur
    renderCategories() {
        const listContainer = document.getElementById('categoriesList');
        const emptyState = document.getElementById('emptyState');
        
        // Fusionner catégories système et utilisateur
        const allCategories = [...this.systemCategories, ...this.categories];
        
        if (allCategories.length === 0) {
            listContainer.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        listContainer.innerHTML = allCategories.map(category => {
            const isSystemCategory = category.type === 0;
            
            return `
                <li class="category-item ${isSystemCategory ? 'system-category' : ''}" 
                    data-id="${category.id}" 
                    data-type="${isSystemCategory ? 'system' : 'user'}">
                    
                    <div style="flex: 1;">
                        <div class="category-name">
                            ${category.name}
                        </div>
                        ${isSystemCategory ? `
                            <div class="system-lock">
                                <i class="bi bi-lock"></i>
                                Catégorie système
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="category-actions">
                        ${!isSystemCategory ? `
                            <button class="btn-action btn-edit" onclick="categoriesManager.editCategory(${category.id})">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn-action btn-delete" onclick="categoriesManager.confirmDelete(${category.id})">
                                <i class="bi bi-trash"></i>
                            </button>
                        ` : `
                            <div style="opacity: 0.5; padding: 8px 12px;">
                                <i class="bi bi-lock" style="font-size: 16px;"></i>
                            </div>
                        `}
                    </div>
                </li>
            `;
        }).join('');
    }
    /**
     * ============================================
     * VALIDATION DES FORMULAIRES
     * ============================================ NameError
     */

    validateInput(input) {
        const value = input.value.trim();
        
        if (!value) {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
             document.getElementById('NameError').textContent = 'Le nom est requis.';
            return false;
        }

        if (value.length < 3) {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
             document.getElementById('NameError').textContent = 'Le nom doit contenir au moins 3 caractères.';
            return false;
        }

        // Vérifier les doublons (validation côté client)
        const duplicate = this.categories.find(cat => 
            cat.name.toLowerCase() === value.toLowerCase()
        );

        if (duplicate) {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
             document.getElementById('NameError').textContent = 'Ce nom existe déjà.';
            return false;
        }

        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        return true;
    }

    validateEditInput(input) {
        const value = input.value.trim();
        
        if (!value) {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            document.getElementById('editNameError').textContent = 'Le nom est requis.';
            return false;
        }

        if (value.length < 3) {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            document.getElementById('editNameError').textContent = 'Le nom doit contenir au moins 3 caractères.';
            return false;
        }

        // Vérifier les doublons (sauf la catégorie en cours d'édition)
        const duplicate = this.categories.find(cat => 
            cat.name.toLowerCase() === value.toLowerCase() && 
            cat.id !== this.currentEditId
        );

        if (duplicate) {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            document.getElementById('editNameError').textContent = 'Ce nom existe déjà.';
            return false;
        }

        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        return true;
    }

    // MODIFIÉ : Validation qui inclut les catégories système top1
    // validateInput(input) {
    //     const value = input.value.trim();
        
    //     if (!value) {
    //         input.classList.remove('is-valid');
    //         input.classList.add('is-invalid');
    //         document.getElementById('NameError').textContent = 'Le nom est requis.';
    //         return false;
    //     }

    //     if (value.length < 2) {
    //         input.classList.remove('is-valid');
    //         input.classList.add('is-invalid');
    //         document.getElementById('NameError').textContent = 'Le nom doit contenir au moins 2 caractères.';
    //         return false;
    //     }

    //     // Vérifier doublons dans système ET utilisateur
    //     const allCategories = [...this.systemCategories, ...this.categories];
    //     const duplicate = allCategories.find(cat => 
    //         cat.name.toLowerCase() === value.toLowerCase()
    //     );

    //     if (duplicate) {
    //         input.classList.remove('is-valid');
    //         input.classList.add('is-invalid');
    //         document.getElementById('NameError').textContent = 'Ce nom existe déjà.';
    //         return false;
    //     }

    //     input.classList.remove('is-invalid');
    //     input.classList.add('is-valid');
    //     return true;
    // }


    // MODIFIÉ : Validation d'édition top1
    // validateEditInput(input) {
    //     const value = input.value.trim();
        
    //     if (!value) {
    //         input.classList.remove('is-valid');
    //         input.classList.add('is-invalid');
    //         document.getElementById('editNameError').textContent = 'Le nom est requis.';
    //         return false;
    //     }

    //     if (value.length < 2) {
    //         input.classList.remove('is-valid');
    //         input.classList.add('is-invalid');
    //         document.getElementById('editNameError').textContent = 'Le nom doit contenir au moins 2 caractères.';
    //         return false;
    //     }

    //     // Vérifier doublons (système + utilisateur sauf celle en cours)
    //     const allCategories = [...this.systemCategories, ...this.categories];
    //     const duplicate = allCategories.find(cat => 
    //         cat.name.toLowerCase() === value.toLowerCase() && 
    //         cat.id !== this.currentEditId
    //     );

    //     if (duplicate) {
    //         input.classList.remove('is-valid');
    //         input.classList.add('is-invalid');
    //         document.getElementById('editNameError').textContent = 'Ce nom existe déjà.';
    //         return false;
    //     }

    //     input.classList.remove('is-invalid');
    //     input.classList.add('is-valid');
    //     return true;
    // }

    // MODIFIÉ : Suppression uniquement pour catégories utilisateur
    // confirmDelete(id) {
    //     // Si l'ID est négatif, c'est une catégorie système
    //     if (id < 0) {
    //         this.showToast('Les catégories système ne peuvent pas être supprimées', 'warning');
    //         return;
    //     }

    //     const category = this.categories.find(c => c.id === id);
    //     if (!category) return;

    //     this.currentDeleteId = id;
    //     document.getElementById('deleteMessage').textContent = 
    //         `Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`;
        
    //     const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    //     modal.show();
    // }

    // MODIFIÉ : Chargement des catégories
    // async loadCategories() {
    //     try {
    //         this.showSpinner('Chargement des catégories...');
            
    //         await new Promise(resolve => setTimeout(resolve, 800));
            
    //         // Catégories utilisateur (type = 1)
    //         const saved = localStorage.getItem('categories');
    //         this.categories = saved ? JSON.parse(saved) : [
    //             { id: 1, name: "Restaurant", type: 1 },
    //             { id: 2, name: "Cinéma", type: 1 },
    //             { id: 3, name: "Shopping", type: 1 }
    //         ];
            
    //         this.renderCategories();
            
    //     } catch (error) {
    //         console.error('Erreur lors du chargement:', error);
    //         this.showToast('Erreur lors du chargement des catégories', 'error');
    //     } finally {
    //         this.hideSpinner();
    //     }
    // }

    // MODIFIÉ : Ajout d'une catégorie utilisateur
    // async addCategory() {
    //     const input = document.getElementById('categoryName');
    //     const name = input.value.trim();

    //     if (!this.validateInput(input)) {
    //         this.showToast('Veuillez saisir un nom valide', 'error');
    //         input.focus();
    //         return;
    //     }

    //     try {
    //         this.showSpinner('Ajout de la catégorie...');
            
    //         await new Promise(resolve => setTimeout(resolve, 800));
            
    //         // Type 1 = catégorie utilisateur
    //         const newCategory = {
    //             id: this.categories.length > 0 
    //                 ? Math.max(...this.categories.map(c => c.id)) + 1 
    //                 : 1,
    //             name: name,
    //             type: 1
    //         };
            
    //         this.categories.unshift(newCategory);
    //         localStorage.setItem('categories', JSON.stringify(this.categories));
            
    //         input.value = '';
    //         input.classList.remove('is-valid');
    //         input.focus();
            
    //         this.renderCategories();
            
    //         const newItem = document.querySelector(`[data-id="${newCategory.id}"]`);
    //         if (newItem) {
    //             newItem.classList.add('new-item');
    //         }
            
    //         this.showToast(`Catégorie "${name}" ajoutée avec succès`, 'success');
            
    //     } catch (error) {
    //         console.error('Erreur lors de l\'ajout:', error);
    //         this.showToast('Erreur lors de l\'ajout de la catégorie', 'error');
    //     } finally {
    //         this.hideSpinner();
    //     }
    // }

    /**
     * ============================================
     * FONCTIONS CRUD AVEC SIMULATION API
     * ============================================
     * 
     * REMARQUE : Ces fonctions utilisent actuellement localStorage
     * Pour utiliser une vraie API, remplacez chaque section commentée
     * par les appels fetch() correspondants.
     */

    /**
     * CHARGER LES CATÉGORIES
     * Simulation → Remplacer par API
     */
    async loadCategories() {
        try {
            this.showSpinner('Chargement des catégories...');
            
            // ============================================
            // SIMULATION AVEC localStorage
            // À REMPLACER PAR UN APPEL API :
            // ============================================
            /*
            const response = await fetch(this.API_BASE_URL + this.ENDPOINTS.CATEGORIES);
            if (!response.ok) throw new Error('Erreur réseau');
            this.categories = await response.json();
            */
            
            // Simulation avec délai
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Données de démo (simule localStorage)
            const saved = localStorage.getItem('categories');
            this.categories = saved ? JSON.parse(saved) : [
                { id: 1, name: "Nourriture" },
                { id: 2, name: "Transport" },
                { id: 3, name: "Logement" },
                { id: 4, name: "Loisirs" }
            ];
            // ============================================
            
            this.renderCategories();
            //this.updateCount();
            
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            this.showToast('Erreur lors du chargement des catégories', 'error');
        } finally {
            this.hideSpinner();
        }
    }

    /**
     * AJOUTER UNE CATÉGORIE
     * Simulation → Remplacer par API
     */
    async addCategory() {
        const input = document.getElementById('categoryName');
        const name = input.value.trim();

        if (!this.validateInput(input)) {
            this.showToast('Veuillez saisir un nom valide', 'error');
            input.focus();
            return;
        }

        try {
            this.showSpinner('Ajout de la catégorie...');
            
            // ============================================
            // SIMULATION AVEC localStorage
            // À REMPLACER PAR UN APPEL API :
            // ============================================
            /*
            const response = await fetch(this.API_BASE_URL + this.ENDPOINTS.CATEGORIES, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token') // Si authentification
                },
                body: JSON.stringify({ name: name })
            });
            
            if (!response.ok) throw new Error('Erreur lors de l\'ajout');
            
            const newCategory = await response.json();
            this.categories.unshift(newCategory);
            */
            
            // Simulation avec délai
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const newCategory = {
                id: this.categories.length > 0 
                    ? Math.max(...this.categories.map(c => c.id)) + 1 
                    : 1,
                name: name
            };
            
            this.categories.unshift(newCategory);
            localStorage.setItem('categories', JSON.stringify(this.categories));
            // ============================================
            
            // Réinitialiser le formulaire
            input.value = '';
            input.classList.remove('is-valid');
            input.focus();
            
            // Mettre à jour l'affichage
            this.renderCategories();
            // this.updateCount();
            
            // Animation de la nouvelle catégorie
            const newItem = document.querySelector(`[data-id="${newCategory.id}"]`);
            if (newItem) {
                newItem.classList.add('new-item');
            }
            
            this.showToast(`Catégorie "${name}" ajoutée avec succès`, 'success');
            
        } catch (error) {
            console.error('Erreur lors de l\'ajout:', error);
            this.showToast('Erreur lors de l\'ajout de la catégorie', 'error');
        } finally {
            this.hideSpinner();
        }
    }

    /**
     * ÉDITER UNE CATÉGORIE
     * Simulation → Remplacer par API
     */
    editCategory(id) {
        const category = this.categories.find(c => c.id === id);
        if (!category) return;

        this.currentEditId = id;
        
        // Remplir le formulaire du modal
        document.getElementById('editCategoryId').value = id;
        document.getElementById('editCategoryName').value = category.name;
        
        // Valider l'input
        this.validateEditInput(document.getElementById('editCategoryName'));
        
        // Afficher le modal
        const modal = new bootstrap.Modal(document.getElementById('editModal'));
        modal.show();
        
        // Focus sur l'input
        setTimeout(() => {
            const editInput = document.getElementById('editCategoryName');
            editInput.focus();
            editInput.select();
        }, 500);
    }

    /**
     * SAUVEGARDER LES MODIFICATIONS
     * Simulation → Remplacer par API
     */
    async saveEdit() {
        const input = document.getElementById('editCategoryName');
        const newName = input.value.trim();
        const id = this.currentEditId;

        if (!this.validateEditInput(input)) {
            return;
        }

        try {
            this.showSpinner('Mise à jour de la catégorie...');
            
            // ============================================
            // SIMULATION AVEC localStorage
            // À REMPLACER PAR UN APPEL API :
            // ============================================
            /*
            const response = await fetch(this.API_BASE_URL + this.ENDPOINTS.CATEGORY_BY_ID(id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({ name: newName })
            });
            
            if (!response.ok) throw new Error('Erreur lors de la mise à jour');
            
            const updatedCategory = await response.json();
            
            // Mettre à jour localement
            const index = this.categories.findIndex(c => c.id === id);
            if (index !== -1) {
                this.categories[index] = updatedCategory;
            }
            */
            
            // Simulation avec délai
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const category = this.categories.find(c => c.id === id);
            if (category) {
                var oldName = category.name;
                category.name = newName;
                localStorage.setItem('categories', JSON.stringify(this.categories));
            }
            // ============================================
            
            // Fermer le modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
            modal.hide();
            
            // Mettre à jour l'affichage
            this.renderCategories();
            
            this.showToast(`Catégorie modifiée de "${oldName}" à "${newName}"`, 'success');
            
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            this.showToast('Erreur lors de la mise à jour de la catégorie', 'error');
        } finally {
            this.hideSpinner();
        }
    }

    /**
     * CONFIRMER LA SUPPRESSION
     */
    confirmDelete(id) {
        const category = this.categories.find(c => c.id === id);
        if (!category) return;

        this.currentDeleteId = id;
        
        // Mettre à jour le message
        document.getElementById('deleteMessage').textContent = 
            `Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`;
        
        // Afficher le modal
        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    }

    /**
     * SUPPRIMER UNE CATÉGORIE
     * Simulation → Remplacer par API
     */
    async deleteCategory() {
        const id = this.currentDeleteId;
        const category = this.categories.find(c => c.id === id);
        
        if (!category) return;

        const categoryName = category.name;
        
        try {
            this.showSpinner('Suppression de la catégorie...');
            
            // ============================================
            // SIMULATION AVEC localStorage
            // À REMPLACER PAR UN APPEL API :
            // ============================================
            /*
            const response = await fetch(this.API_BASE_URL + this.ENDPOINTS.CATEGORY_BY_ID(id), {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            
            if (!response.ok) throw new Error('Erreur lors de la suppression');
            
            // Supprimer localement
            this.categories = this.categories.filter(c => c.id !== id);
            */
            
            // Simulation avec délai
            await new Promise(resolve => setTimeout(resolve, 800));
            
            this.categories = this.categories.filter(c => c.id !== id);
            localStorage.setItem('categories', JSON.stringify(this.categories));
            // ============================================
            
            // Fermer le modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            modal.hide();
            
            // Mettre à jour l'affichage
            this.renderCategories();
            //this.updateCount();
            
            this.showToast(`Catégorie "${categoryName}" supprimée avec succès`, 'success');
            
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            this.showToast('Erreur lors de la suppression de la catégorie', 'error');
        } finally {
            this.hideSpinner();
        }
    }

    /**
     * ============================================
     * RÉINITIALISATION DES FORMULAIRES
     * ============================================
     */
    resetEditForm() {
        document.getElementById('editForm').reset();
        const input = document.getElementById('editCategoryName');
        input.classList.remove('is-valid', 'is-invalid');
        this.currentEditId = null;
    }

    resetDeleteForm() {
        document.getElementById('confirmDeleteCheckbox').checked = false;
        document.getElementById('confirmDeleteBtn').disabled = true;
        this.currentDeleteId = null;
    }
}

/**
 * ============================================
 * INSTRUCTIONS POUR L'INTÉGRATION API RÉELLE
 * ============================================
 * 
 * 1. CONFIGURATION DE L'URL DE L'API :
 *    - Modifiez la variable `API_BASE_URL` dans le constructeur
 *    - Exemple : this.API_BASE_URL = 'https://votre-api.com/api';
 * 
 * 2. REMPLACER LES FONCTIONS DE SIMULATION :
 *    Pour chaque fonction CRUD, remplacez la section "SIMULATION AVEC localStorage"
 *    par les appels fetch() correspondants (exemples fournis dans les commentaires).
 * 
 * 3. GESTION D'AUTHENTIFICATION :
 *    - Ajoutez les headers d'authentification dans les requêtes
 *    - Exemple : 'Authorization': 'Bearer ' + localStorage.getItem('token')
 * 
 * 4. GESTION DES ERREURS API :
 *    - Ajoutez une vérification du status HTTP (response.ok)
 *    - Gérez les différents codes d'erreur (400, 401, 404, 500, etc.)
 * 
 * 5. VALIDATION CÔTÉ SERVEUR :
 *    - Même si vous avez la validation côté client, gardez la validation côté serveur
 *    - L'API doit retourner des messages d'erreur clairs
 */

// Initialisation de l'application
let categoriesManager;

document.addEventListener('DOMContentLoaded', () => {
    categoriesManager = new CategoriesManager();
    window.categoriesManager = categoriesManager; // Pour les handlers inline
});