<!-- Bouton d'ajout de dépense -->
<div id="expense-button-container" class="row" style="margin-bottom: 20px;">
    <div class="col-lg-12">
        <button type="button" class="btn btn-warning btn-block btn-lg" onclick="showExpenseForm()">
            <i class="flaticon2-plus"></i> Nouvelle dépense
        </button>
    </div>
</div>

<!-- Formulaire d'ajout de dépense (caché par défaut) -->
<div id="expense-form-container" style="display: none;">
    <div class="kt-portlet">
        <div class="kt-portlet__head">
            <div class="kt-portlet__head-label">
                <h3 class="kt-portlet__head-title">
                    <i class="la la-plus-circle"></i>
                    <span id="exp-form-title">Ajouter une dépense</span>
                </h3>
            </div>
            <div class="kt-portlet__head-toolbar">
                <button type="button" class="btn btn-sm btn-secondary" onclick="hideExpenseForm()">
                    <i class="la la-close"></i>
                </button>
            </div>
        </div>

        <div class="kt-portlet__body">
            <form id="exp-form-main">

                <!-- Montant et Libellé -->
                <div class="row">
                    <div class="form-group col-md-6">
                        <label class="exp-form-label">Montant * (FCFA)</label>
                        <input type="number"
                               id="exp-form-amount"
                               class="form-control exp-form-control"
                               placeholder="0.00"
                               step="0.01"
                               min="0"
                               required>
                        <div class="invalid-feedback" id="exp-form-amount-error">
                            Veuillez saisir un montant valide.
                        </div>
                    </div>

                    <div class="form-group col-md-6">
                        <label class="exp-form-label">Libellé *</label>
                        <input type="text"
                               id="exp-form-label"
                               class="form-control exp-form-control"
                               placeholder="Description de la dépense"
                               maxlength="100"
                               required>
                        <div class="invalid-feedback" id="exp-form-label-error">
                            Veuillez saisir un libellé.
                        </div>
                    </div>
                </div>

                <!-- Budget -->
                <div class="form-group">
                    <label class="exp-form-label">Budget</label>
                    <select class="form-control exp-form-select" id="exp-form-budget">
                        <option value="">-- Sélectionner un budget --</option>
                    </select>
                </div>

                <!-- Catégorie -->
                <div class="form-group">
                    <label class="exp-form-label">Catégorie *</label>
                    <select class="form-control exp-form-select" id="exp-form-category" required>
                        <option value="">-- Sélectionner une catégorie --</option>
                    </select>
                    <div class="invalid-feedback" id="exp-form-category-error">
                        Veuillez sélectionner une catégorie.
                    </div>
                </div>


                <!-- Switch pour dépense répétitive -->
            <div class="recurring-switch">
                <div class="switch-label">
                    <i class="flaticon-refresh"></i>
                    <span>Dépense répétitive</span>
                </div>
                <label class="switch">
                    <input type="checkbox" id="exp-form-recurring-switch">
                    <span class="slider"></span>
                </label>
            </div>

                <!-- Dates (conditionnel) -->
                <div class="exp-form-dates-section" id="exp-form-dates-section">
                    <div class="row">
                        <div class="form-group col-md-6">
                            <label class="exp-form-label">Date de début</label>
                            <input type="date"
                                   id="exp-form-start-date"
                                   class="form-control exp-form-control">
                        </div>
                        <div class="form-group col-md-6">
                            <label class="exp-form-label">Date de fin</label>
                            <input type="date"
                                   id="exp-form-end-date"
                                   class="form-control exp-form-control">
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="form-group col-md-6">
                        <!-- Image -->
                        <button type="button" class="exp-form-image-btn" id="exp-form-image-btn">
                            <i class="bi bi-camera"></i>
                            <span id="exp-form-image-text">Photo</span>
                        </button>
                        <input type="file"
                               id="exp-form-image-input"
                               accept="image/*"
                               style="display: none;">

                        <div class="exp-form-image-preview" id="exp-form-image-preview"></div>
                    </div>

                    <div class="form-group col-md-6">
                        <button type="submit"
                                class="btn-submit exp-form-btn-submit"
                                id="exp-form-submit-btn">
                            Ajouter
                        </button>
                    </div>
                </div>

            </form>
        </div>
    </div>
</div>

<!-- Spinner (uniquement pour l'ajout) -->
<div class="exp-form-spinner-overlay" id="exp-form-spinner-overlay">
    <div class="exp-form-spinner"></div>
    <div class="exp-form-spinner-text" id="exp-form-spinner-text">Chargement...</div>
</div>
