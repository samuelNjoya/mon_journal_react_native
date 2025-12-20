// services/api-client.js - Version corrigée
console.log('=== Chargement api-client.js ===');

// Configuration
const BASE_URL = 'http://192.168.1.162:8000/api';
console.log('URL de base API:', BASE_URL);

// Stockage local
const storage = {
    getAuthToken: () => {
        const token = localStorage.getItem('auth_token');
        console.log('Token récupéré:', token ? 'OUI' : 'NON');
        return token;
    },
    
    getUser: () => {
        const userStr = localStorage.getItem('user_data');
        const user = userStr ? JSON.parse(userStr) : null;
        console.log('Utilisateur récupéré:', user ? 'OUI' : 'NON');
        return user;
    },
    
    setAuthToken: (token) => {
        localStorage.setItem('auth_token', token);
        console.log('Token sauvegardé');
    },
    
    setUser: (userData) => {
        localStorage.setItem('user_data', JSON.stringify(userData));
        console.log('Utilisateur sauvegardé');
    },
    
    clearAuth: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        console.log('Authentification effacée');
    }
};

// Client API principal
class ApiClient {
    constructor() {
        this.baseURL = BASE_URL;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        console.log('ApiClient initialisé');
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        console.log(`API Request: ${options.method || 'GET'} ${url}`);
        
        // Préparer les headers
        const headers = { ...this.defaultHeaders };
        const token = storage.getAuthToken();
        const user = storage.getUser();
        
        // Ajouter le token d'authentification
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            console.log('Token ajouté aux headers');
        }
        
        // Ajouter le sessionToken selon la méthode
        let finalUrl = url;
        let finalBody = options.body;
        
        if (user?.sessionToken) {
            console.log('SessionToken trouvé:', user.sessionToken);
            
            if (options.method === 'GET' || !options.method) {
                // Pour GET, ajouter comme paramètre
                const separator = url.includes('?') ? '&' : '?';
                finalUrl = `${url}${separator}sessionToken=${encodeURIComponent(user.sessionToken)}`;
                console.log('SessionToken ajouté à l\'URL');
            } else if (options.body) {
                // Pour POST/PUT, ajouter au body
                try {
                    const bodyObj = typeof options.body === 'string' 
                        ? JSON.parse(options.body) 
                        : options.body;
                    
                    bodyObj.sessionToken = user.sessionToken;
                    finalBody = JSON.stringify(bodyObj);
                    console.log('SessionToken ajouté au body');
                } catch (error) {
                    console.error('Erreur parsing body:', error);
                }
            }
        }
        
        // Configuration de la requête
        const config = {
            method: options.method || 'GET',
            headers: headers,
            body: finalBody
        };
        
        console.log('Config requête:', {
            url: finalUrl,
            method: config.method,
            headers: Object.keys(headers),
            hasBody: !!finalBody
        });
        
        try {
            // Exécuter la requête
            const startTime = Date.now();
            const response = await fetch(finalUrl, config);
            const endTime = Date.now();
            
            console.log(`API Response: ${response.status} ${response.statusText} (${endTime - startTime}ms)`);
            
            // Vérifier le statut HTTP
            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch {
                    errorData = await response.text();
                }
                
                console.error('Erreur API:', {
                    status: response.status,
                    statusText: response.statusText,
                    data: errorData
                });
                
                const error = new Error(errorData?.message || `Erreur ${response.status}: ${response.statusText}`);
                error.response = { status: response.status, data: errorData };
                throw error;
            }
            
            // Parser la réponse JSON
            const data = await response.json();
            console.log('Données reçues:', data);
            
            return {
                data: data,
                status: response.status,
                headers: response.headers
            };
            
        } catch (error) {
            console.error('Erreur réseau/API:', error);
            
            // Si c'est une erreur réseau
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion.');
            }
            
            throw error;
        }
    }
    
    // Méthodes HTTP simplifiées
    async get(endpoint, params = {}) {
        let url = endpoint;
        
        // Ajouter les paramètres à l'URL
        if (Object.keys(params).length > 0) {
            const searchParams = new URLSearchParams(params);
            url = `${url}?${searchParams.toString()}`;
        }
        
        return this.request(url, { method: 'GET' });
    }
    
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

// Interface compatible
const apiClient = {
    get: async (endpoint, config) => {
        try {
            const client = new ApiClient();
            const response = await client.get(endpoint, config?.params || {});
            return response.data;
        } catch (error) {
            console.error('Erreur apiClient.get:', error);
            throw error;
        }
    },
    
    post: async (endpoint, data) => {
        try {
            const client = new ApiClient();
            const response = await client.post(endpoint, data);
            return response.data;
        } catch (error) {
            console.error('Erreur apiClient.post:', error);
            throw error;
        }
    },
    
    put: async (endpoint, data) => {
        try {
            const client = new ApiClient();
            const response = await client.put(endpoint, data);
            return response.data;
        } catch (error) {
            console.error('Erreur apiClient.put:', error);
            throw error;
        }
    },
    
    delete: async (endpoint) => {
        try {
            const client = new ApiClient();
            const response = await client.delete(endpoint);
            return response.data;
        } catch (error) {
            console.error('Erreur apiClient.delete:', error);
            throw error;
        }
    }
};

// Instance globale
window.apiClient = apiClient;
console.log('=== api-client.js chargé avec succès ===');