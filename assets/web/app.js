// app.js - Version corrigée avec débogage
class ExpenseApp {
    constructor() {
        console.log('=== ExpenseApp initialisé ===');
        this.init();
    }
    
    async init() {
        try {
            console.log('1. Début de l\'initialisation');
            
            // 1. Vérifier que les services sont chargés
            console.log('Services disponibles:', {
                apiClient: typeof window.apiClient,
                categoryService: typeof window.categoryService
            });
            
            // 2. Tester directement l'API
            await this.testApiConnection();
            
            // 3. Initialiser la page des catégories directement
            await this.loadCategoriesPage();
            
            // 4. Masquer le loading
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
            
            console.log('✓ Initialisation terminée avec succès');
            
        } catch (error) {
            console.error('✗ Erreur lors de l\'initialisation:', error);
            this.showError('Erreur de chargement: ' + error.message);
        }
    }
    
    async testApiConnection() {
        console.log('2. Test de connexion API...');
        
        try {
            // Test simple de l'API
            const testResponse = await window.apiClient.get('/categorie');
            console.log('Réponse API catégories:', testResponse);
            
            // Vérifier la structure de la réponse
            if (testResponse && testResponse.data) {
                console.log(`✓ API OK - ${testResponse.data.length} catégories trouvées`);
                console.log('Première catégorie:', testResponse.data[0]);
            } else {
                console.warn('⚠ Structure de réponse inattendue:', testResponse);
            }
            
        } catch (error) {
            console.error('✗ Erreur API:', error);
            throw new Error(`API inaccessible: ${error.message}`);
        }
    }
    
    async loadCategoriesPage() {
        console.log('3. Chargement de la page catégories...');
        
        const content = document.getElementById('app-content');
        if (!content) {
            console.error('✗ Element app-content non trouvé');
            return;
        }
        
        // Créer un conteneur simple pour tester
        content.innerHTML = `
            <div class="categories-page">
                <h2><i class="material-icons">category</i> Catégories</h2>
                
                <div class="test-controls">
                    <button id="test-api-btn" class="btn btn-primary">
                        <i class="material-icons">refresh</i>
                        Tester l'API
                    </button>
                    <button id="manual-load-btn" class="btn btn-secondary">
                        <i class="material-icons">download</i>
                        Charger manuellement
                    </button>
                </div>
                
                <div class="debug-info" id="debug-info">
                    <!-- Les infos de débogage seront affichées ici -->
                </div>
                
                <div id="categories-container">
                    <div class="loading-state">
                        <div class="spinner"></div>
                        <p>Chargement des catégories...</p>
                    </div>
                </div>
            </div>
        `;
        
        // Ajouter les événements de test
        document.getElementById('test-api-btn').addEventListener('click', () => this.testApiConnection());
        document.getElementById('manual-load-btn').addEventListener('click', () => this.loadCategoriesData());
        
        // Charger les données
        await this.loadCategoriesData();
    }
    
    async loadCategoriesData() {
        console.log('4. Chargement des données catégories...');
        
        const container = document.getElementById('categories-container');
        const debugInfo = document.getElementById('debug-info');
        
        if (!container) {
            console.error('✗ Container non trouvé');
            return;
        }
        
        // Afficher le loading
        container.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Chargement en cours...</p>
            </div>
        `;
        
        // Effacer les anciennes infos de débogage
        if (debugInfo) {
            debugInfo.innerHTML = '';
        }
        
        try {
            // 1. Vérifier si le service existe
            if (!window.categoryService || !window.categoryService.fetchCategories) {
                console.error('✗ Service catégorie non disponible');
                throw new Error('Service catégorie non initialisé');
            }
            
            console.log('Service catégorie trouvé');
            
            // 2. Appeler le service
            console.log('Appel de fetchCategories()...');
            const categories = await window.categoryService.fetchCategories();
            console.log('Catégories reçues:', categories);
            
            // 3. Afficher les infos de débogage
            if (debugInfo) {
                debugInfo.innerHTML = `
                    <div class="debug-card success">
                        <h4><i class="material-icons">check_circle</i> Données reçues</h4>
                        <p><strong>Nombre de catégories:</strong> ${categories.length}</p>
                        <p><strong>Type:</strong> ${Array.isArray(categories) ? 'Array' : typeof categories}</p>
                        <details>
                            <summary>Voir les données brutes</summary>
                            <pre>${JSON.stringify(categories, null, 2)}</pre>
                        </details>
                    </div>
                `;
            }
            
            // 4. Afficher les catégories
            if (categories.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="material-icons">inbox</i>
                        <h3>Aucune catégorie trouvée</h3>
                        <p>Il n'y a pas encore de catégories dans la base de données.</p>
                        <button class="btn btn-primary" onclick="window.expenseApp.openAddCategoryModal()">
                            <i class="material-icons">add</i>
                            Créer une catégorie
                        </button>
                    </div>
                `;
            } else {
                container.innerHTML = this.renderCategoriesList(categories);
            }
            
            console.log('✓ Catégories chargées avec succès');
            
        } catch (error) {
            console.error('✗ Erreur chargement catégories:', error);
            
            container.innerHTML = `
                <div class="error-state">
                    <i class="material-icons">error</i>
                    <h3>Erreur de chargement</h3>
                    <p>${error.message || 'Impossible de charger les catégories'}</p>
                    <button class="btn btn-primary" onclick="window.expenseApp.loadCategoriesData()">
                        <i class="material-icons">refresh</i>
                        Réessayer
                    </button>
                </div>
            `;
            
            // Afficher les détails de l'erreur
            if (debugInfo) {
                debugInfo.innerHTML = `
                    <div class="debug-card error">
                        <h4><i class="material-icons">error</i> Erreur détectée</h4>
                        <p><strong>Message:</strong> ${error.message}</p>
                        <p><strong>Stack:</strong> ${error.stack}</p>
                        <details>
                            <summary>Voir les détails</summary>
                            <pre>${JSON.stringify(error, null, 2)}</pre>
                        </details>
                    </div>
                `;
            }
        }
    }
    
    renderCategoriesList(categories) {
        if (!Array.isArray(categories)) {
            return `<div class="error">Format de données invalide</div>`;
        }
        
        return `
            <div class="categories-stats">
                <div class="stat-card">
                    <i class="material-icons">category</i>
                    <span class="stat-number">${categories.length}</span>
                    <span class="stat-label">Catégories</span>
                </div>
                <div class="stat-card">
                    <i class="material-icons">person</i>
                    <span class="stat-number">${categories.filter(c => c.type === 1).length}</span>
                    <span class="stat-label">Personnelles</span>
                </div>
                <div class="stat-card">
                    <i class="material-icons">settings</i>
                    <span class="stat-number">${categories.filter(c => c.type !== 1).length}</span>
                    <span class="stat-label">Système</span>
                </div>
            </div>
            
            <div class="categories-grid">
                ${categories.map(category => `
                    <div class="category-card" data-id="${category.id}">
                        <div class="category-header">
                            <div class="category-icon" style="background-color: ${category.color || '#ffc107'}">
                                <i class="material-icons">${category.icon || 'category'}</i>
                            </div>
                            <div class="category-info">
                                <h4 class="category-name">${category.nom || 'Sans nom'}</h4>
                                <span class="category-type ${category.type === 1 ? 'user' : 'system'}">
                                    ${category.type === 1 ? 'Personnelle' : 'Système'}
                                </span>
                            </div>
                        </div>
                        <div class="category-actions">
                            ${category.type === 1 ? `
                            <button class="btn-icon edit" onclick="window.expenseApp.editCategory(${category.id})">
                                <i class="material-icons">edit</i>
                            </button>
                            <button class="btn-icon delete" onclick="window.expenseApp.deleteCategory(${category.id})">
                                <i class="material-icons">delete</i>
                            </button>
                            ` : `
                            <span class="system-badge">
                                <i class="material-icons">lock</i> Système
                            </span>
                            `}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="categories-actions">
                <button class="btn btn-primary" onclick="window.expenseApp.openAddCategoryModal()">
                    <i class="material-icons">add</i>
                    Ajouter une catégorie
                </button>
            </div>
        `;
    }
    
    editCategory(id) {
        console.log('Édition catégorie:', id);
        this.showToast('Fonctionnalité en développement', 'info');
    }
    
    deleteCategory(id) {
        console.log('Suppression catégorie:', id);
        this.showToast('Fonctionnalité en développement', 'info');
    }
    
    openAddCategoryModal() {
        console.log('Ouverture modal ajout catégorie');
        this.showToast('Fonctionnalité en développement', 'info');
    }
    
    showError(message) {
        const content = document.getElementById('app-content');
        if (content) {
            content.innerHTML = `
                <div class="global-error">
                    <i class="material-icons">error_outline</i>
                    <h2>Erreur de l'application</h2>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="window.location.reload()">
                        <i class="material-icons">refresh</i>
                        Recharger l'application
                    </button>
                </div>
            `;
        }
    }
    
    showToast(message, type = 'info') {
        console.log(`Toast [${type}]: ${message}`);
        // Implémentation simple
        alert(`${type.toUpperCase()}: ${message}`);
    }
}

// Démarrer l'application
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOM Chargé ===');
    window.expenseApp = new ExpenseApp();
});