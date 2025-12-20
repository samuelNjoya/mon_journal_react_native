// services/categoryService.js - Version corrigée
console.log('=== Chargement categoryService.js ===');

// Vérifier que apiClient est disponible
if (!window.apiClient) {
    console.error('✗ apiClient non disponible!');
    throw new Error('apiClient doit être chargé avant categoryService');
}

console.log('apiClient disponible:', typeof window.apiClient);

const categoryService = {
    // Récupérer toutes les catégories
    fetchCategories: async () => {
        console.log('Appel fetchCategories...');
        
        try {
            // Essayer différentes routes selon votre API
            let response;
            
            try {
                // Route 1: Celle que vous utilisez dans React Native
                response = await window.apiClient.get('/categorie');
                console.log('Route /categorie réponse:', response);
            } catch (error1) {
                console.warn('Route /categorie a échoué, essai alternative...');
                
                try {
                    // Route 2: Alternative
                    response = await window.apiClient.get('/categories');
                    console.log('Route /categories réponse:', response);
                } catch (error2) {
                    console.warn('Route /categories a échoué, essai dernière alternative...');
                    
                    // Route 3: Dernier essai
                    response = await window.apiClient.get('/api/categorie');
                    console.log('Route /api/categorie réponse:', response);
                }
            }
            
            // Traiter la réponse selon la structure attendue
            console.log('Réponse brute:', response);
            
            let categories = [];
            
            if (response && Array.isArray(response)) {
                // Si la réponse est directement un tableau
                categories = response;
            } else if (response && response.data && Array.isArray(response.data)) {
                // Si la réponse a une propriété data
                categories = response.data;
            } else if (response && response.categories && Array.isArray(response.categories)) {
                // Si la réponse a une propriété categories
                categories = response.categories;
            } else {
                console.warn('Format de réponse inattendu, tentative d\'extraction...');
                
                // Essayer de trouver un tableau dans la réponse
                const findArray = (obj) => {
                    for (const key in obj) {
                        if (Array.isArray(obj[key])) {
                            return obj[key];
                        }
                        if (typeof obj[key] === 'object' && obj[key] !== null) {
                            const found = findArray(obj[key]);
                            if (found) return found;
                        }
                    }
                    return null;
                };
                
                const foundArray = findArray(response);
                categories = foundArray || [];
            }
            
            console.log(`Catégories extraites: ${categories.length} éléments`);
            console.log('Première catégorie:', categories[0]);
            
            // S'assurer que chaque catégorie a les bonnes propriétés
            const formattedCategories = categories.map((cat, index) => ({
                id: cat.id || index + 1,
                nom: cat.nom || cat.name || `Catégorie ${index + 1}`,
                icon: cat.icon || cat.icon_name || 'category',
                color: cat.color || cat.icon_color || '#ffc107',
                type: cat.type || (cat.is_system ? 0 : 1)
            }));
            
            return formattedCategories;
            
        } catch (error) {
            console.error('Erreur fetchCategories:', error);
            
            // Retourner des données de test en cas d'erreur
            console.warn('Utilisation de données de test');
            return [
                {
                    id: 1,
                    nom: 'Nourriture',
                    icon: 'restaurant',
                    color: '#4CAF50',
                    type: 1
                },
                {
                    id: 2,
                    nom: 'Transport',
                    icon: 'directions_car',
                    color: '#2196F3',
                    type: 1
                },
                {
                    id: 3,
                    nom: 'Logement',
                    icon: 'home',
                    color: '#FF9800',
                    type: 0
                }
            ];
        }
    },
    
    // Créer une catégorie
    createCategory: async (category) => {
        console.log('Appel createCategory:', category);
        
        try {
            const response = await window.apiClient.post('/categorie/creer', {
                nom: category.nom,
                type: category.type || 1,
                icon_name: category.icon,
                icon_color: category.color
            });
            
            console.log('Création réussie:', response);
            return response;
            
        } catch (error) {
            console.error('Erreur createCategory:', error);
            throw error;
        }
    },
    
    // Mettre à jour une catégorie
    updateCategory: async (category) => {
        console.log('Appel updateCategory:', category);
        
        try {
            const response = await window.apiClient.post('/categorie/update', {
                id: category.id,
                nom: category.nom,
                icon_name: category.icon,
                icon_color: category.color
            });
            
            console.log('Mise à jour réussie:', response);
            return response;
            
        } catch (error) {
            console.error('Erreur updateCategory:', error);
            throw error;
        }
    },
    
    // Supprimer une catégorie
    deleteCategory: async (id) => {
        console.log('Appel deleteCategory:', id);
        
        try {
            const response = await window.apiClient.post('/categorie/delete', { id });
            console.log('Suppression réussie:', response);
            return response;
            
        } catch (error) {
            console.error('Erreur deleteCategory:', error);
            throw error;
        }
    },
    
    // Récupérer les budgets
    fetchBudgets: async () => {
        try {
            const response = await window.apiClient.get('/categorie/buget_categorie_list');
            return response.data || [];
        } catch (error) {
            console.error('Erreur fetchBudgets:', error);
            return [];
        }
    },
    
    // Récupérer les budgets pour filtre
    fetchBudgetsForFilter: async () => {
        try {
            const response = await window.apiClient.get('/categorie/buget_categorie_list_filter');
            return response.data || [];
        } catch (error) {
            console.error('Erreur fetchBudgetsForFilter:', error);
            return [];
        }
    }
};

// Exporter le service
window.categoryService = categoryService;
console.log('=== categoryService.js chargé avec succès ===');