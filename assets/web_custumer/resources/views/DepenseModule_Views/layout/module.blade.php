{{-- resources/views/DepenseModule_Views/layout/module.blade.php --}}
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Module Dépenses - @yield('title', 'Dashboard')</title>

    <!-- CSS spécifique au module -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

    @stack('styles')
</head>
<body>
    <div class="container-fluid">
        <!-- Header du module -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center py-3 border-bottom">
                    <h1 class="h3 mb-0">
                        <i class="fas fa-chart-pie me-2"></i>
                        Module Dépenses
                    </h1>

                    <div class="btn-group">
                        <a href="{{ route('depense.categories.index') }}"
                           class="btn btn-outline-primary {{ request()->is('depense/categories*') ? 'active' : '' }}">
                            <i class="fas fa-tags"></i> Catégories
                        </a>
                        <a href="#" class="btn btn-outline-primary">
                            <i class="fas fa-wallet"></i> Budgets
                        </a>
                        <a href="#" class="btn btn-outline-primary">
                            <i class="fas fa-money-bill"></i> Dépenses
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Contenu principal -->
        <div class="row">
            <div class="col-12">
                <!-- Messages flash -->
                @if(session('success'))
                <div class="alert alert-success alert-dismissible fade show">
                    {{ session('success') }}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
                @endif

                @if(session('error') || session('errors'))
                <div class="alert alert-danger alert-dismissible fade show">
                    {{ session('error') }}
                    @if($errors->any())
                        <ul class="mb-0">
                            @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    @endif
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
                @endif

                <!-- Contenu spécifique -->
                @yield('content')
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    @stack('scripts')
</body>
</html>
