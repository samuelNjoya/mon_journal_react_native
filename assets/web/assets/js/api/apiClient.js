/**
 * Gestion du stockage local (remplace AsyncStorage)
 */
const storage = {
    // Récupérer le token d'authentification
    getAuthToken: () => {
        return localStorage.getItem('auth_token');
    },

    // Récupérer les infos utilisateur
    getUser: () => {
        const userStr = localStorage.getItem('user_data');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Sauvegarder le token
    setAuthToken: (token) => {
        localStorage.setItem('auth_token', token);
    },

    // Sauvegarder les données utilisateur
    setUser: (userData) => {
        localStorage.setItem('user_data', JSON.stringify(userData));
    },

    // Supprimer toutes les données d'authentification
    clearAuth: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
    }
};

// URL de base de l'API (identique à React Native)
const BASE_URL = 'http://192.168.1.162:8000/api';

/**
 * Client API avec intercepteurs (remplacement d'Axios par Fetch)
 */
class ApiClient {
    constructor() {
        this.baseURL = BASE_URL;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    }

    /**
     * Intercepteur de requête (équivalent à Axios interceptor)
     */
    async interceptRequest(config) {
        const token = await storage.getAuthToken();
        const user = await storage.getUser();

        // Ajouter le token d'authentification
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Ajouter le sessionToken selon la méthode HTTP
        if (user?.sessionToken) {
            if (config.method === 'GET') {
                // Pour les requêtes GET, ajouter comme paramètre
                const params = new URLSearchParams(config.params || {});
                params.append('sessionToken', user.sessionToken);
                config.params = params.toString();
            } else if (config.method === 'POST' && config.body) {
                // Pour les requêtes POST, ajouter dans le body
                const body = JSON.parse(config.body);
                body.sessionToken = user.sessionToken;
                config.body = JSON.stringify(body);
            }
        }

        return config;
    }

    /**
     * Intercepteur de réponse (équivalent à Axios interceptor)
     */
    async interceptResponse(response) {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Erreur API:', {
                status: response.status,
                statusText: response.statusText,
                data: errorData
            });
            
            // Gestion des erreurs spécifiques
            if (response.status === 401) {
                // Token expiré ou invalide
                storage.clearAuth();
                window.location.href = '/login';
            }
            
            throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
        }
        
        return response;
    }

    /**
     * Méthode générique pour les requêtes
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        // Configuration de base
        let config = {
            method: options.method || 'GET',
            headers: {
                ...this.defaultHeaders,
                ...options.headers
            }
        };

        // Ajouter le body pour les méthodes POST/PUT/PATCH
        if (options.data) {
            config.body = JSON.stringify(options.data);
        }

        // Ajouter les paramètres pour les requêtes GET
        if (options.params && config.method === 'GET') {
            const params = new URLSearchParams(options.params);
            endpoint = `${endpoint}?${params.toString()}`;
        }

        // Appliquer l'intercepteur de requête
        config = await this.interceptRequest(config);

        try {
            // Exécuter la requête
            let response = await fetch(`${this.baseURL}${endpoint}`, config);
            
            // Appliquer l'intercepteur de réponse
            response = await this.interceptResponse(response);
            
            // Parser la réponse JSON
            const data = await response.json();
            return { data, status: response.status, headers: response.headers };
        } catch (error) {
            console.error('Erreur réseau:', error);
            throw error;
        }
    }

    /**
     * Méthode GET
     */
    async get(endpoint, params = {}) {
        return this.request(endpoint, { method: 'GET', params });
    }

    /**
     * Méthode POST
     */
    async post(endpoint, data = {}) {
        return this.request(endpoint, { method: 'POST', data });
    }

    /**
     * Méthode PUT
     */
    async put(endpoint, data = {}) {
        return this.request(endpoint, { method: 'PUT', data });
    }

    /**
     * Méthode DELETE
     */
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    /**
     * Upload de fichiers (FormData)
     */
    async upload(endpoint, formData) {
        const config = {
            method: 'POST',
            headers: {
                'Authorization': this.defaultHeaders['Authorization'] || ''
            },
            body: formData
        };

        config.headers = await this.interceptRequest(config);
        delete config.headers['Content-Type']; // Important pour FormData

        try {
            let response = await fetch(`${this.baseURL}${endpoint}`, config);
            response = await this.interceptResponse(response);
            return await response.json();
        } catch (error) {
            console.error('Erreur upload:', error);
            throw error;
        }
    }
}

/**
 * Fonctions utilitaires pour la compatibilité
 */

// Gestion des réponses (similaire à handleResponse React Native)
const handleResponse = (response) => {
    return response.data;
};

// Gestion des erreurs (similaire à handleError React Native)
const handleError = (error) => {
    console.error('Erreur API:', error);
    throw error;
};

/**
 * Interface compatible avec le code React Native
 * (Pour faciliter la migration)
 */
export const apiClient = {
    // GET avec gestion d'erreur
    get: async (endpoint, params = {}) => {
        const client = new ApiClient();
        try {
            const response = await client.get(endpoint, params);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },

    // POST avec gestion d'erreur
    post: async (endpoint, data = {}) => {
        const client = new ApiClient();
        try {
            const response = await client.post(endpoint, data);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },

    // PUT avec gestion d'erreur
    put: async (endpoint, data = {}) => {
        const client = new ApiClient();
        try {
            const response = await client.put(endpoint, data);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },

    // DELETE avec gestion d'erreur
    delete: async (endpoint) => {
        const client = new ApiClient();
        try {
            const response = await client.delete(endpoint);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },

    // Upload de fichiers
    upload: async (endpoint, formData) => {
        const client = new ApiClient();
        try {
            return await client.upload(endpoint, formData);
        } catch (error) {
            return handleError(error);
        }
    }
};

/**
 * Instance d'API pour une utilisation globale
 * (Similaire à l'export 'api' dans React Native)
 */
export const api = {
    // Interface pour utiliser directement l'instance
    get: (endpoint, config) => apiClient.get(endpoint, config?.params),
    post: (endpoint, data, config) => apiClient.post(endpoint, data),
    
    // Méthode pour configurer le token globalement
    setToken: (token) => {
        storage.setAuthToken(token);
    },
    
    // Méthode pour configurer l'utilisateur
    setUser: (userData) => {
        storage.setUser(userData);
    },
    
    // Méthode pour vider l'authentification
    clearAuth: () => {
        storage.clearAuth();
    },
    
    // Méthode pour récupérer l'état d'authentification
    isAuthenticated: () => {
        return !!storage.getAuthToken();
    }
};

// Export par défaut pour faciliter l'import
export default api;

// Variables globales pour compatibilité (optionnel)
window.api = api;
window.apiClient = apiClient;