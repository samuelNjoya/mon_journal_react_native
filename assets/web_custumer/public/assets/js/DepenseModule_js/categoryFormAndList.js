class CategoriesManager {
    constructor() {
        this.categories = [];
        this.systemCategories = [];
        this.currentEditId = null;
        this.currentDeleteId = null;
         this.isLoadingList = false; // pour le loading

        this.init();
    }

    /**
     * ============================================
     * INITIALISATION
     * ============================================
     */
    async init() {
        this.setupEventListeners();
        await this.loadCategories();

        setTimeout(() => {
            $('#catCategoryName').focus();
        }, 500);
    }

    /**
     * ============================================
     * ÉVÉNEMENTS
     * ============================================
     */
    setupEventListeners() {
        // Soumission du formulaire d'ajout
        $('#catCategoryForm').on('submit', (e) => {
            e.preventDefault();
            this.addCategory();
        });

        // Validation en temps réel
        $('#catCategoryName').on('input', (e) => {
            this.validateInput(e.target);
        });

        // Bouton d'enregistrement dans le modal d'édition
        $('#catSaveEditBtn').on('click', () => {
            this.saveEdit();
        });

        // Validation édition
        $('#catEditCategoryName').on('input', (e) => {
            this.validateEditInput(e.target);
        });

        // Confirmation de suppression
        $('#catConfirmDeleteCheckbox').on('change', (e) => {
            $('#catConfirmDeleteBtn').prop('disabled', !e.target.checked);
        });

        // Bouton de suppression
        $('#catConfirmDeleteBtn').on('click', () => {
            this.deleteCategory();
        });

        // Soumission formulaire d'édition avec Enter
        $('#catEditForm').on('submit', (e) => {
            e.preventDefault();
            this.saveEdit();
        });
    }

    showSpinner(message = 'Chargement...') {
        $('#catSpinnerText').text(message);
        $('#catSpinnerOverlay').fadeIn(200);
    }

    hideSpinner() {
        $('#catSpinnerOverlay').fadeOut(200);
    }


    /**
     * ============================================
     * RENDU DE LA LISTE
     * ============================================
     */

    // renderCategories() {
    //     const listContainer = $('#catCategoriesList');
    //     const emptyState = $('#catEmptyState');

    //     // Fusionner système et utilisateur
    //     const allCategories = [...this.categories, ...this.systemCategories];

    //     if (allCategories.length === 0) {
    //         listContainer.html('');
    //         emptyState.show();
    //         return;
    //     }

    //     emptyState.hide();

    //     const html = allCategories.map(category => {
    //         const isSystemCategory = category.type === 0;

    //         return `
    //             <li class="cat-category-item ${isSystemCategory ? 'cat-system-category' : ''}"
    //                 data-id="${category.id}">

    //                 <div style="flex: 1;">
    //                     <div class="cat-category-name">
    //                         ${category.nom}
    //                     </div>
    //                 </div>

    //                 <div class="cat-category-actions">
    //                     ${!isSystemCategory ? `
    //                         <button class="cat-btn-action cat-btn-edit" onclick="catCategoriesManager.editCategory(${category.id})">
    //                             <i class="bi bi-pencil"></i>
    //                         </button>
    //                         <button class="cat-btn-action cat-btn-delete" onclick="catCategoriesManager.confirmDelete(${category.id})">
    //                             <i class="bi bi-trash"></i>
    //                         </button>
    //                     ` : `
    //                         <div style="opacity: 0.5; padding: 8px 12px;">
    //                             </i> <i class="la la-lock" style="font-size: 16px;"></i>
    //                         </div>
    //                     `}
    //                 </div>
    //             </li>
    //         `;
    //     }).join('');

    //     listContainer.html(html);
    // }

        renderCategories() {
        const listContainer = $('#catCategoriesList');
        const emptyState = $('#catEmptyState');

        // AFFICHER LE LOADING DANS LA LISTE
        if (this.isLoadingList) {
            emptyState.hide();
            listContainer.html(`
                <div class="cat-loading-in-list">
                    <i class="la la-hourglass" style="font-size: 40px; color: #fcbf00;"></i>
                    <div class="cat-loading-text">Chargement des catégories...</div>
                    <div class="cat-loading-subtext">Veuillez patienter</div>
                </div>
            `);
            return;
        }

        // Fusionner utilisateur et système
        const allCategories = [...this.categories, ...this.systemCategories];

        if (allCategories.length === 0) {
            listContainer.html('');
            emptyState.show();
            return;
        }

        emptyState.hide();

        const html = allCategories.map(category => {
            const isSystemCategory = category.type === 0;

            return `
                <li class="cat-category-item ${isSystemCategory ? 'cat-system-category' : ''}"
                    data-id="${category.id}">

                    <div style="flex: 1;">
                        <div class="cat-category-name">
                            ${category.nom}
                        </div>
                    </div>

                    <div class="cat-category-actions">
                        ${!isSystemCategory ? `
                            <button class="cat-btn-action cat-btn-edit" onclick="catCategoriesManager.editCategory(${category.id})">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="cat-btn-action cat-btn-delete" onclick="catCategoriesManager.confirmDelete(${category.id})">
                                <i class="bi bi-trash"></i>
                            </button>
                        ` : `
                            <div style="opacity: 0.5; padding: 8px 12px;">
                                <i class="la la-lock" style="font-size: 16px;"></i>
                            </div>
                        `}
                    </div>
                </li>
            `;
        }).join('');

        listContainer.html(html);
    }

    /**
     * ============================================
     * VALIDATION
     * ============================================
     */
    validateInput(input) {
        const $input = $(input);
        const value = $input.val().trim();
        const $error = $('#catNameError');

        if (!value) {
            $input.removeClass('cat-is-valid').addClass('cat-is-invalid');
            $error.text('Le nom est requis.');
            return false;
        }

        if (value.length < 2) {
            $input.removeClass('cat-is-valid').addClass('cat-is-invalid');
            $error.text('Le nom doit contenir au moins 2 caractères.');
            return false;
        }

        const allCategories = [...this.systemCategories, ...this.categories];
        const duplicate = allCategories.find(cat =>
            cat.nom.toLowerCase() === value.toLowerCase()
        );

        if (duplicate) {
            $input.removeClass('cat-is-valid').addClass('cat-is-invalid');
            $error.text('Ce nom existe déjà.');
            return false;
        }

        $input.removeClass('cat-is-invalid').addClass('cat-is-valid');
        return true;
    }

    validateEditInput(input) {
        const $input = $(input);
        const value = $input.val().trim();
        const $error = $('#catEditNameError');

        if (!value) {
            $input.removeClass('cat-is-valid').addClass('cat-is-invalid');
            $error.text('Le nom est requis.');
            return false;
        }

        if (value.length < 2) {
            $input.removeClass('cat-is-valid').addClass('cat-is-invalid');
            $error.text('Le nom doit contenir au moins 2 caractères.');
            return false;
        }

        const allCategories = [...this.systemCategories, ...this.categories];
        const duplicate = allCategories.find(cat =>
            cat.nom.toLowerCase() === value.toLowerCase() &&
            cat.id !== this.currentEditId
        );

        if (duplicate) {
            $input.removeClass('cat-is-valid').addClass('cat-is-invalid');
            $error.text('Ce nom existe déjà.');
            return false;
        }

        $input.removeClass('cat-is-invalid').addClass('cat-is-valid');
        return true;
    }

    /**
     * ============================================
     * CHARGER LES CATÉGORIES
     * ============================================
     */

    // async loadCategories() {
    //     this.showSpinner('Chargement des catégories...');
    //     $.ajax({
    //         url: "/categories/list",
    //         method: 'GET',
    //         dataType: "JSON",
    //         success: (response) => {


    //             if (response.status === 1) {
    //                 this.hideSpinner();
    //                 if (response.data && response.data.data) {
    //                     const allCategories = response.data.data;

    //                     // Séparer système (type=0) et utilisateur (type=1)
    //                     this.systemCategories = allCategories.filter(cat => cat.type === 0);
    //                     this.categories = allCategories.filter(cat => cat.type === 1);
    //                 }

    //                 this.renderCategories();

    //             } else if (response.status === 0) {
    //                 this.hideSpinner();
    //                 swal.fire({
    //                     "title": response.err_title,
    //                     "text": response.err_msg + ". Code d'erreur " + response.err_code,
    //                     "type": "error",
    //                     "confirmButtonClass": "btn btn-secondary"
    //                 });
    //             } else if (response.status === -1) {
    //                 window.location.href = "{{ route('spx.signin') }}";
    //             }
    //         },
    //         error: (error) => {

    //             console.error('Erreur loadCategories:', error);

    //             swal.fire({
    //                 "title": "Erreur",
    //                 "text": "Impossible de charger les catégories",
    //                 "type": "error",
    //                 "confirmButtonClass": "btn btn-secondary"
    //             });
    //         }
    //     });
    // }

        async loadCategories() {
        //  Utiliser isLoadingList au lieu du spinner overlay
        this.isLoadingList = true;
        this.renderCategories(); // Afficher le loading dans la liste

        $.ajax({
            url: "/categories/list",
            method: 'GET',
            dataType: "JSON",
            success: (response) => {
                if (response.status === 1) {
                    this.isLoadingList = false;

                    if (response.data && response.data.data) {
                        const allCategories = response.data.data;

                        // Séparer système (type=0) et utilisateur (type=1)
                        this.systemCategories = allCategories.filter(cat => cat.type === 0);
                        this.categories = allCategories.filter(cat => cat.type === 1);
                    }

                    this.renderCategories();

                } else if (response.status === 0) {
                    this.isLoadingList = false;
                    this.renderCategories();

                    swal.fire({
                        "title": response.err_title,
                        "text": response.err_msg + ". Code d'erreur " + response.err_code,
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary"
                    });
                } else if (response.status === -1) {
                    window.location.href = "{{ route('spx.signin') }}";
                }
            },
            error: (error) => {
                this.isLoadingList = false;
                this.renderCategories();

                console.error('Erreur loadCategories:', error);

                swal.fire({
                    "title": "Erreur",
                    "text": "Impossible de charger les catégories",
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary"
                });
            }
        });
    }

    /**
     * ============================================
     * AJOUTER UNE CATÉGORIE
     * ============================================
     */
    addCategory() {
        const $input = $('#catCategoryName');
        const $btn = $('#catAddBtn');
        const name = $input.val().trim();

        if (!this.validateInput($input[0])) {
            return;
        }


        this.showSpinner('Ajout de la catégorie...');
        $.ajax({
            url: "/categories/create",
            method: 'POST',
            dataType: "JSON",
            data: JSON.stringify({
                "_token": $('meta[name="csrf-token"]').attr('content'),
                "nom": name,
                "color": "#FFC107"
            }),
            contentType: "application/json",
            success: (response) => {

                if (response.status === 1) {
                    this.hideSpinner();
                    swal.fire({
                        "title": "Catégorie ajoutée",
                        "text": `La catégorie "${name}" a été ajoutée avec succès.`,
                        "type": "success",
                        "confirmButtonClass": "btn btn-secondary",
                        "onClose": () => {
                            // Réinitialiser le formulaire
                            $input.val('').removeClass('cat-is-valid');
                            $input.focus();

                            // Recharger la liste
                            this.loadCategories();
                        }
                    });
                } else if (response.status === 0) {
                    this.hideSpinner();
                    swal.fire({
                        "title": response.err_title,
                        "text": response.err_msg + ". Code d'erreur " + response.err_code,
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary"
                    });
                } else if (response.status === -1) {
                    window.location.href = "{{ route('spx.signin') }}";
                }
            },
            error: (error) => {

                let responseText = error.responseJSON;
                swal.fire({
                    "title": responseText.err_title || "Erreur",
                    "text": (responseText.err_msg || "Erreur lors de l'ajout") + ". Code d'erreur " + (responseText.err_code || 500),
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary"
                });
            }
        });
    }

    /**
     * ============================================
     * ÉDITER
     * ============================================
     */
    editCategory(id) {
        const category = this.categories.find(c => c.id === id);
        if (!category) return;

        this.currentEditId = id;

        $('#catEditCategoryId').val(id);
        $('#catEditCategoryName').val(category.nom);

        this.validateEditInput($('#catEditCategoryName')[0]);

        $('#catEditModal').fadeIn(300);

        setTimeout(() => {
            const $editInput = $('#catEditCategoryName');
            $editInput.focus();
            $editInput[0].select();
        }, 350);
    }

    closeEditModal() {
        $('#catEditModal').fadeOut(300);
        this.resetEditForm();
    }

    saveEdit() {
        const $input = $('#catEditCategoryName');
        const $btn = $('#catSaveEditBtn');
        const newName = $input.val().trim();
        const id = this.currentEditId;

        if (!this.validateEditInput($input[0])) {
            return;
        }

        const category = this.categories.find(c => c.id === id);
        const oldName = category.nom;

        this.showSpinner('Modification en cours...');
        $.ajax({
            url: "/categories/update",
            method: 'POST',
            dataType: "JSON",
            data: JSON.stringify({
                "_token": $('meta[name="csrf-token"]').attr('content'),
                "id": id,
                "nom": newName,
                "color": category.color || "#FFC107"
            }),
            contentType: "application/json",
            success: (response) => {
                if (response.status === 1) {
                    this.hideSpinner();
                    this.closeEditModal(); //fermer le modal
                    swal.fire({
                        "title": "Catégorie modifiée",
                        "text": `La catégorie "${oldName}" a été renommée en "${newName}".`,
                        "type": "success",
                        "confirmButtonClass": "btn btn-secondary",
                        "onClose": () => {
                            this.loadCategories(); // recharger la page
                        }
                    });
                } else if (response.status === 0) {
                    this.hideSpinner();
                    swal.fire({
                        "title": response.err_title,
                        "text": response.err_msg + ". Code d'erreur " + response.err_code,
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary"
                    });
                } else if (response.status === -1) {
                    window.location.href = "{{ route('spx.signin') }}";
                }
            },
            error: (error) => {

                let responseText = error.responseJSON;
                swal.fire({
                    "title": responseText.err_title || "Erreur",
                    "text": (responseText.err_msg || "Erreur lors de la modification") + ". Code d'erreur " + (responseText.err_code || 500),
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary"
                });
            }
        });
    }

    /**
     * ============================================
     * SUPPRIMER
     * ============================================
     */
    confirmDelete(id) {
        const category = this.categories.find(c => c.id === id);
        if (!category) return;

        this.currentDeleteId = id;

        $('#catDeleteMessage').text(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.nom}" ?`);
        $('#catDeleteModal').fadeIn(300);
    }

    closeDeleteModal() {
        $('#catDeleteModal').fadeOut(300);
        this.resetDeleteForm();
    }

    deleteCategory() {
        const id = this.currentDeleteId;
        const category = this.categories.find(c => c.id === id);

        if (!category) return;

        const categoryName = category.nom;
        const $btn = $('#catConfirmDeleteBtn');


        this.showSpinner('Suppression en cours...');
        $.ajax({
            url: "/categories/delete",
            method: 'POST',
            dataType: "JSON",
            data: JSON.stringify({
                "_token": $('meta[name="csrf-token"]').attr('content'),
                "id": id
            }),
            contentType: "application/json",
            success: (response) => {

                if (response.status === 1) {
                    this.hideSpinner();
                    this.closeDeleteModal();
                    swal.fire({
                        "title": "Catégorie supprimée",
                        "text": `La catégorie "${categoryName}" a été supprimée avec succès.`,
                        "type": "success",
                        "confirmButtonClass": "btn btn-secondary",
                        "onClose": () => {
                            this.loadCategories();
                        }
                    });
                } else if (response.status === 0) {
                    this.hideSpinner();
                    swal.fire({
                        "title": response.err_title,
                        "text": response.err_msg + ". Code d'erreur " + response.err_code,
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary"
                    });
                } else if (response.status === -1) {
                    window.location.href = "{{ route('spx.signin') }}";
                }
            },
            error: (error) => {

                let responseText = error.responseJSON;
                swal.fire({
                    "title": responseText.err_title || "Erreur",
                    "text": (responseText.err_msg || "Erreur lors de la suppression") + ". Code d'erreur " + (responseText.err_code || 500),
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary"
                });
            }
        });
    }

    /**
     * ============================================
     * RÉINITIALISATION
     * ============================================
     */
    resetEditForm() {
        $('#catEditForm')[0].reset();
        $('#catEditCategoryName').removeClass('cat-is-valid cat-is-invalid');
        this.currentEditId = null;
    }

    resetDeleteForm() {
        $('#catConfirmDeleteCheckbox').prop('checked', false);
        $('#catConfirmDeleteBtn').prop('disabled', true);
        this.currentDeleteId = null;
    }
}

// Initialisation
let catCategoriesManager;

$(document).ready(function() {
    catCategoriesManager = new CategoriesManager();
    window.catCategoriesManager = catCategoriesManager;
});
