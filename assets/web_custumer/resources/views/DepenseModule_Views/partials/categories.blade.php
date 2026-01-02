<!-- Section 1: Ajout de catégorie -->
<div class="cat-card">
    <div class="cat-section-header">
        <h3>Nouvelle catégorie</h3>
    </div>
    <div class="cat-card-body">
        <form id="catCategoryForm" class="cat-add-form-container">
            <div>
                <input type="text"
                       id="catCategoryName"
                       class="cat-form-control"
                       placeholder="Saisissez le nom de la catégorie..."
                       maxlength="50"
                       required
                       autofocus>
                <div class="cat-invalid-feedback" id="catNameError">
                    Veuillez saisir un nom valide.
                </div>
            </div>
            <button type="submit" class="cat-btn-add" id="catAddBtn">
                Créer
            </button>
        </form>
    </div>
</div>

<!-- Section 2: Liste des catégories -->
<div class="cat-card">
    <div class="cat-section-header">
        <h3>Liste des catégories</h3>
    </div>
    <div class="cat-card-body">
        <div class="cat-categories-list-container" id="catCategoriesListContainer">
            <ul class="cat-categories-list" id="catCategoriesList">
                <!-- Les catégories seront chargées ici dynamiquement -->
            </ul>
        </div>

        <!-- État vide -->
        <div class="cat-empty-state" id="catEmptyState">
            <i class="la la-inbox"></i>
            <h5>Aucune catégorie trouvée</h5>
        </div>
    </div>
</div>

<!-- Modal pour la modification -->
<div class="cat-modal" id="catEditModal" style="display: none;">
    <div class="cat-modal-content">
        <div class="cat-modal-header">
            <h5>
                <i class="la la-edit"></i>
                Modifier la catégorie
            </h5>
            <button type="button" class="cat-modal-close" onclick="catCategoriesManager.closeEditModal()">
                <i class="la la-times"></i>
            </button>
        </div>
        <div class="cat-modal-body">
            <form id="catEditForm">
                <input type="hidden" id="catEditCategoryId">
                <div class="cat-form-group">
                    <label for="catEditCategoryName" class="cat-form-label">Nouveau nom</label>
                    <input type="text"
                           class="cat-form-control"
                           id="catEditCategoryName"
                           placeholder="Entrez le nouveau nom..."
                           required
                           maxlength="50">
                    <div class="cat-invalid-feedback" id="catEditNameError">
                        Veuillez saisir un nom valide.
                    </div>
                </div>
            </form>
        </div>
        <div class="cat-modal-footer">
            <button type="button" class="cat-btn-secondary" onclick="catCategoriesManager.closeEditModal()">
                <i class="la la-times-circle"></i> Annuler
            </button>
            <button type="button" class="cat-btn-primary" id="catSaveEditBtn">
                <i class="la la-check-circle"></i> Enregistrer
            </button>
        </div>
    </div>
</div>

<!-- Modal pour la suppression -->
<div class="cat-modal" id="catDeleteModal" style="display: none;">
    <div class="cat-modal-content">
        <div class="cat-modal-header cat-modal-header-danger">
            <h5>
                <i class="la la-exclamation-triangle"></i>
                Confirmer la suppression
            </h5>
            <button type="button" class="cat-modal-close" onclick="catCategoriesManager.closeDeleteModal()">
                <i class="la la-times"></i>
            </button>
        </div>
        <div class="cat-modal-body">
            <div class="cat-delete-icon">
                <i class="la la-trash"></i>
            </div>
            <p class="cat-delete-message" id="catDeleteMessage">
                Êtes-vous sûr de vouloir supprimer cette catégorie ?
            </p>
            <div class="cat-alert cat-alert-warning">
                <i class="la la-exclamation-circle"></i>
                Cette action est irréversible. Toutes les données associées seront perdues.
            </div>
            <div class="cat-form-check">
                <input class="cat-form-check-input" type="checkbox" id="catConfirmDeleteCheckbox">
                <label class="cat-form-check-label" for="catConfirmDeleteCheckbox">
                    Je confirme vouloir supprimer cette catégorie
                </label>
            </div>
        </div>
        <div class="cat-modal-footer">
            <button type="button" class="cat-btn-secondary" onclick="catCategoriesManager.closeDeleteModal()">
                <i class="la la-times-circle"></i> Annuler
            </button>
            <button type="button" class="cat-btn-danger" id="catConfirmDeleteBtn" disabled>
                <i class="la la-trash"></i> Supprimer
            </button>
        </div>
    </div>
</div>

<!-- Modal AJAX (remplace les toasts) -->
<div class="cat-ajax-modal" id="catAjaxModal" style="display: none;">
    <div class="cat-ajax-modal-content">
        <div class="cat-ajax-modal-icon" id="catAjaxModalIcon">
            <i class="la la-check-circle"></i>
        </div>
        <h4 id="catAjaxModalTitle">Succès</h4>
        <p id="catAjaxModalMessage">Opération réussie</p>
        <button type="button" class="cat-btn-primary" onclick="catCategoriesManager.closeAjaxModal()">
            OK
        </button>
    </div>
</div>

<!-- Spinner -->
<div class="cat-spinner-overlay" id="catSpinnerOverlay" style="display: none;">
    <div class="cat-spinner-container">
        <div class="cat-spinner"></div>
        <div class="cat-spinner-text" id="catSpinnerText">Chargement...</div>
    </div>
</div>
