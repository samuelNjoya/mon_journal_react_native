{{-- resources/views/DepenseModule_Views/categories/index.blade.php --}}
@extends('DepenseModule_Views.layout.module')

@section('title', 'Gestion des Catégories')

@section('content')
<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0">
            <i class="fas fa-tags me-2"></i>
            Liste des Catégories
        </h5>

        <div>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createCategoryModal">
                <i class="fas fa-plus me-1"></i> Nouvelle Catégorie
            </button>
        </div>
    </div>

    <div class="card-body">
        <!-- Barre de recherche -->
        <div class="row mb-4">
            <div class="col-md-6">
                <form method="GET" action="{{ route('depense.categories.index') }}">
                    <div class="input-group">
                        <input type="text"
                               name="search"
                               class="form-control"
                               placeholder="Rechercher une catégorie..."
                               value="{{ $search }}">
                        <button type="submit" class="btn btn-outline-secondary">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </form>
            </div>

            <div class="col-md-3">
                <select class="form-select" onchange="window.location.href = '{{ route('depense.categories.index') }}?per_page=' + this.value">
                    <option value="10" {{ $per_page == 10 ? 'selected' : '' }}>10 par page</option>
                    <option value="25" {{ $per_page == 25 ? 'selected' : '' }}>25 par page</option>
                    <option value="50" {{ $per_page == 50 ? 'selected' : '' }}>50 par page</option>
                    <option value="100" {{ $per_page == 100 ? 'selected' : '' }}>100 par page</option>
                </select>
            </div>
        </div>

        <!-- Tableau des catégories -->
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th width="50">#</th>
                        <th>Nom</th>
                        <th>Couleur</th>
                        <th>Créé le</th>
                        <th width="150">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($categories as $category)
                    @php
                        // Convertir en objet si c'est un tableau
                        $category = is_object($category) ? $category : (object) $category;
                    @endphp
                    <tr>
                        <td>{{ $loop->iteration }}</td>
                        <td>{{ $category->nom ?? 'Aucune description' }}</td>
                        <td>
                            <span class="badge" style="background-color: {{ $category->couleur ?? '#3498db' }}; color: white;">
                                {{ $category->couleur ?? '#3498db' }}
                            </span>
                        </td>
                        <td>{{ isset($category->created_at) ? date('d/m/Y', strtotime($category->created_at)) : 'N/A' }}</td>
                        <td>
                            <div class="btn-group btn-group-sm">
                                <button type="button"
                                        class="btn btn-outline-info edit-category-btn"
                                        data-id="{{ $category->id ?? '' }}"
                                        data-description="{{ $category->nom ?? '' }}"
                                        data-couleur="{{ $category->couleur ?? '' }}"
                                       >
                                    <i class="fas fa-edit"></i>
                                </button>

                                <button type="button"
                                        class="btn btn-outline-danger delete-category-btn"
                                        data-id="{{ $category->id ?? '' }}"
                                        data-libelle="{{ $category->nom ?? '' }}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="6" class="text-center py-4">
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle me-2"></i>
                                Aucune catégorie trouvée.
                                <button type="button" class="btn btn-link p-0" data-bs-toggle="modal" data-bs-target="#createCategoryModal">
                                    Créer votre première catégorie
                                </button>
                            </div>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        @if(isset($categories->links))
        <div class="d-flex justify-content-center mt-3">
            {{-- $categories->links() --}}
        </div>
        @endif
    </div>
</div>

<!-- Modal de création -->
<div class="modal fade" id="createCategoryModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <form id="createCategoryForm" action="{{ route('depense.categories.store') }}" method="POST">
                @csrf

                <div class="modal-header">
                    <h5 class="modal-title">Nouvelle Catégorie</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <div class="mb-3">
                        <label for="libelle" class="form-label">Libellé *</label>
                        <input type="text" class="form-control" id="libelle" name="libelle" required>
                    </div>

                    <div class="mb-3">
                        <label for="description" class="form-label">Description</label>
                        <textarea class="form-control" id="description" name="description" rows="3"></textarea>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="couleur" class="form-label">Couleur</label>
                            <input type="color" class="form-control form-control-color" id="couleur" name="couleur" value="#3498db">
                        </div>

                        <div class="col-md-6 mb-3">
                            <label for="icone" class="form-label">Icône FontAwesome</label>
                            <input type="text" class="form-control" id="icone" name="icone" placeholder="fas fa-tag">
                            <small class="text-muted">Ex: fas fa-tag, fas fa-car, fas fa-home</small>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                    <button type="submit" class="btn btn-primary">Enregistrer</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Modal d'édition -->
<div class="modal fade" id="editCategoryModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <form id="editCategoryForm" method="POST">
                @csrf
                @method('PUT')

                <div class="modal-header">
                    <h5 class="modal-title">Modifier la Catégorie</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <input type="hidden" id="edit_id" name="id">

                    <div class="mb-3">
                        <label for="edit_libelle" class="form-label">Libellé *</label>
                        <input type="text" class="form-control" id="edit_libelle" name="libelle" required>
                    </div>

                    <div class="mb-3">
                        <label for="edit_description" class="form-label">Description</label>
                        <textarea class="form-control" id="edit_description" name="description" rows="3"></textarea>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="edit_couleur" class="form-label">Couleur</label>
                            <input type="color" class="form-control form-control-color" id="edit_couleur" name="couleur">
                        </div>

                        <div class="col-md-6 mb-3">
                            <label for="edit_icone" class="form-label">Icône FontAwesome</label>
                            <input type="text" class="form-control" id="edit_icone" name="icone">
                            <small class="text-muted">Ex: fas fa-tag, fas fa-car, fas fa-home</small>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                    <button type="submit" class="btn btn-primary">Modifier</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Modal de confirmation suppression -->
<div class="modal fade" id="deleteCategoryModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <form id="deleteCategoryForm" method="POST">
                @csrf
                @method('DELETE')

                <div class="modal-header">
                    <h5 class="modal-title">Confirmer la suppression</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <p>Êtes-vous sûr de vouloir supprimer la catégorie <strong id="delete_category_name"></strong> ?</p>
                    <p class="text-danger"><small>Cette action est irréversible.</small></p>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                    <button type="submit" class="btn btn-danger">Supprimer</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
$(document).ready(function() {
    // Gestion des boutons d'édition
    $('.edit-category-btn').click(function() {
        const id = $(this).data('id');
        const libelle = $(this).data('libelle');
        const description = $(this).data('description');
        const couleur = $(this).data('couleur') || '#3498db';
        const icone = $(this).data('icone') || 'fas fa-tag';

        // Remplir le formulaire
        $('#edit_id').val(id);
        $('#edit_libelle').val(libelle);
        $('#edit_description').val(description);
        $('#edit_couleur').val(couleur);
        $('#edit_icone').val(icone);

        // Mettre à jour l'action du formulaire
        $('#editCategoryForm').attr('action', `/depense/categories/${id}/modifier`);

        // Afficher le modal
        $('#editCategoryModal').modal('show');
    });

    // Gestion des boutons de suppression
    $('.delete-category-btn').click(function() {
        const id = $(this).data('id');
        const libelle = $(this).data('libelle');

        // Remplir les informations
        $('#delete_category_name').text(libelle);
        $('#deleteCategoryForm').attr('action', `/depense/categories/${id}/supprimer`);

        // Afficher le modal
        $('#deleteCategoryModal').modal('show');
    });

    // Validation des formulaires
    $('#createCategoryForm, #editCategoryForm').submit(function(e) {
        e.preventDefault();

        const form = $(this);
        const url = form.attr('action');
        const method = form.attr('method');
        const data = form.serialize();

        $.ajax({
            url: url,
            type: method,
            data: data,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    // Fermer le modal
                    $('.modal').modal('hide');

                    // Afficher message de succès
                    alert(response.message);

                    // Recharger la page
                    window.location.reload();
                } else {
                    alert('Erreur: ' + response.message);
                }
            },
            error: function(xhr) {
                alert('Erreur serveur: ' + xhr.responseJSON?.message || 'Une erreur est survenue');
            }
        });
    });

    // Gestion de la suppression AJAX
    $('#deleteCategoryForm').submit(function(e) {
        e.preventDefault();

        const form = $(this);
        const url = form.attr('action');

        $.ajax({
            url: url,
            type: 'POST',
            data: form.serialize(),
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    // Fermer le modal
                    $('#deleteCategoryModal').modal('hide');

                    // Afficher message de succès
                    alert(response.message);

                    // Recharger la page
                    window.location.reload();
                } else {
                    alert('Erreur: ' + response.message);
                }
            },
            error: function(xhr) {
                alert('Erreur serveur: ' + xhr.responseJSON?.message || 'Une erreur est survenue');
            }
        });
    });
});
</script>
@endpush
