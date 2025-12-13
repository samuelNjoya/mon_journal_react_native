import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
    USER: 'user',
    ONBOARDING_COMPLETED: 'onboarding_completed',
    IS_FIRST_LAUNCH: 'is_first_launch',
    LANGUAGE: 'language',
    APP_SETTINGS: 'app_settings',
    HAS_SEEN_WELCOME: '@has_seen_welcome',
    AUTH_TOKEN_KEY: 'auth_token',
    REFRESH_TOKEN_KEY: 'refresh_token',
    PROFIL: 'profil'
};

export const storage = {
    // Sauvegarder les données
    setItem: async (key: string, value: any) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            console.error('Error saving data', e);
        }
    },

    // Récupérer les données
    getItem: async (key: string) => {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error('Error reading data', e);
            return null;
        }
    },

    // Supprimer les données
    removeItem: async (key: string) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing data', e);
        }
    },

    // Vérifier si c'est le premier lancement
    isFirstLaunch: async () => {
        const isFirstLaunch = await storage.getItem(STORAGE_KEYS.IS_FIRST_LAUNCH);
        if (isFirstLaunch === null) {
            await storage.setItem(STORAGE_KEYS.IS_FIRST_LAUNCH, false);
            return true;
        }
        return false;
    },

    // Marquer l'onboarding comme terminé
    setOnboardingCompleted: async (value: boolean) => {
        await storage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, value);
    },

    // Vérifier si l'onboarding est terminé
    isOnboardingCompleted: async () => {
        return await storage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    },

    // Marquer que WelcomeScreen a été vu
    setWelcomeSeen: async (value: boolean): Promise<void> => {
        try {
            await storage.setItem(STORAGE_KEYS.HAS_SEEN_WELCOME, value);
        } catch (error) {
            console.error('Error setting welcome seen', error);
        }
    },
    // Vérifier si WelcomeScreen a été vu
    hasSeenWelcome: async (): Promise<boolean> => {
        try {
            const hasSeen = await storage.getItem(STORAGE_KEYS.HAS_SEEN_WELCOME);
            return !!hasSeen;
        } catch (error) {
            console.error('Error checking welcome seen', error);
            return false;
        }
    },

    // Sauvegarder l'utilisateur
    setUser: async (user: any) => {
        await storage.setItem(STORAGE_KEYS.USER, user);
    },

    // Récupérer l'utilisateur
    getUser: async () => {
        return await storage.getItem(STORAGE_KEYS.USER);
    },

    // Déconnexion
    clearAuthData: async () => {
        await storage.removeItem(STORAGE_KEYS.USER);
        await storage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
        await storage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    },

    // Effacer toutes les données (pour le débogage)
    clearAll: async (): Promise<void> => {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error('Error clearing all data', error);
        }
    },

    // Sauvegarder la langue
    setLanguage: async (language: string) => {
        await storage.setItem(STORAGE_KEYS.LANGUAGE, language);
    },

    // Récupérer la langue
    getLanguage: async (): Promise<string> => {
        const language = await storage.getItem(STORAGE_KEYS.LANGUAGE);
        return language || 'fr'; // Français par défaut
    },

    // Sauvegarder les paramètres de l'app
    setAppSettings: async (settings: any) => {
        await storage.setItem(STORAGE_KEYS.APP_SETTINGS, settings);
    },

    // Récupérer les paramètres de l'app
    getAppSettings: async () => {
        return await storage.getItem(STORAGE_KEYS.APP_SETTINGS) || {
            language: 'fr',
            currency: 'EUR',
            theme: 'light'
        };
    },

    // Sauvegarder le token
    storeAuthToken: async (token: string, refreshToken: any) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN_KEY, token);
            if (refreshToken) {
                await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN_KEY, refreshToken);
            }
        } catch (error) {
            console.error('Erreur lors du stockage du token:', error);
        }
    },

    //recuperer le token
    getAuthToken: async () => {
        try {
            return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN_KEY);
        } catch (error) {
            console.error('Erreur lors de la récupération du token:', error);
            return null;
        }
    },

    // recuperer le refresh token
    getRefreshToken: async () => {
        try {
            return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN_KEY);
        } catch (error) {
            console.error('Erreur lors de la récupération du refresh token:', error);
            return null;
        }
    },

    clearAuthToken: async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN_KEY);
            await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN_KEY);
        } catch (error) {
            console.error('Erreur lors de la suppression du token:', error);
        }
    },
    // Sauvegarder l'utilisateur
    setProfil: async (profil: any) => {
        await storage.setItem(STORAGE_KEYS.PROFIL, profil);
    },

    // Récupérer l'utilisateur
    getProfil: async () => {
        return await storage.getItem(STORAGE_KEYS.PROFIL);
    },
};