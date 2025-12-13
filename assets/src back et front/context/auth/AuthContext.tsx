import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import { AuthState, User, Profil, AppSettings } from '../../types';

// Ajoutez cette interface
interface AppState {
  user: User | null;
  profil: Profil | null;
  isOnboardingCompleted: boolean;
  isFirstLaunch: boolean;
  isLoading: boolean;
}

interface AuthContextData {
  authState: AuthState;
  appSettings: AppSettings;
  signIn: (data: any) => Promise<boolean>;
  signUp: (data: any) => Promise<boolean>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  changeLanguage: (language: string) => Promise<void>;
  updateAppSettings: (settings: Partial<AppSettings>) => Promise<void>;
  completeFirstLaunch: () => Promise<void>;
  refreshToken: (token: string, refreshToken: string) => Promise<any>;
  setProfil: (data: any) => Promise<boolean>;
  changePassword: (data: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuthAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AppState>({
    user: null,
    profil: null,
    isOnboardingCompleted: false,
    isFirstLaunch: true, // Nouveau état pour première utilisation
    isLoading: true,
  });

  const [appSettings, setAppSettings] = useState<AppSettings>({
    language: 'fr',
    currency: 'EUR',
    theme: 'light'
  });

  // Charger l'état d'authentification et les paramètres au démarrage
  useEffect(() => {
    loadAuthStateAndSettings();
  }, []);

  // Ajoutez cette méthode pour simuler un temps de chargement
  const loadAuthStateAndSettings = async () => {
    try {
      const [user, profil, isOnboardingCompleted, settings, isFirstLaunch] = await Promise.all([
        storage.getUser(),
        storage.getProfil(),
        storage.isOnboardingCompleted(),
        storage.getAppSettings(),
        storage.isFirstLaunch(), // Vérifie si c'est le premier lancement
        storage.getItem(STORAGE_KEYS.HAS_SEEN_WELCOME) // Nouvelle clé
      ]);

      setAuthState({
        user,
        profil,
        isOnboardingCompleted: !!isOnboardingCompleted,
        isFirstLaunch,
        isLoading: false,
      });

      setAppSettings(settings);
    } catch (error) {
      console.error('Error loading auth state and settings', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const changeLanguage = async (language: string): Promise<void> => {
    try {
      const newSettings = { ...appSettings, language };
      await storage.setAppSettings(newSettings);
      setAppSettings(newSettings);
    } catch (error) {
      console.error('Error changing language', error);
    }
  };

  const updateAppSettings = async (settings: Partial<AppSettings>): Promise<void> => {
    try {
      const newSettings = { ...appSettings, ...settings };
      await storage.setAppSettings(newSettings);
      setAppSettings(newSettings);
    } catch (error) {
      console.error('Error updating app settings', error);
    }
  };

  const signIn = async (data: any): Promise<any> => {
    try {
      // Simulation de connexion - à remplacer par votre API
      const user: User = {
        id: '1',
        email: '',
        name: '',
        phone_number: data.phone_number || '',
        sessionToken: data.sessionToken || ''
      };
      const profil: Profil = {
        profile_picture: null,
        account_number: '',
        account_state: '',
        name: '',
        benacc: null
      }

      await storage.setUser(user);
      setAuthState({
        user,
        profil,
        isOnboardingCompleted: true,
        isFirstLaunch: false,
        isLoading: false,
      });
      const { accessToken } = data;
      await storage.storeAuthToken(accessToken, null);
      return true;
    } catch (error) {
      console.error('Sign in error', error);
      return error;
    }
  };

  const signUp = async (data: any): Promise<boolean> => {
    try {
      const user: User = {
        phone_number: data.phone_number,
        email: data.email,
        id: data.id,
        name: data.firstname + ' ' + data.lastname,
        sessionToken: data.sessionToken || ''
      };
      const profil: Profil = {
        profile_picture: null,
        account_number: '',
        account_state: '',
        name: data.firstname + ' ' + data.lastname,
        benacc: null
      }
      await storage.setUser(user);
      setAuthState({
        user,
        profil,
        isOnboardingCompleted: true,
        isFirstLaunch: false,
        isLoading: false,
      });
      const { accessToken } = data;
      await storage.storeAuthToken(accessToken, null);
      return true
    } catch (error) {
      console.error('Sign up error', error);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await storage.clearAuthData();
      await storage.clearAuthToken();
      setAuthState({
        user: null,
        profil: null,
        isOnboardingCompleted: false,
        isLoading: false,
        isFirstLaunch: false,
      });
    } catch (error) {
      await storage.clearAuthData();
      await storage.clearAuthToken();
      console.error('Sign out error', error);
    }
  };

  const changePassword = async (data: any): Promise<boolean> => {
    try {
      const user = authState.user
      if (user) {
        user["sessionToken"] = data.sessionToken
        await storage.setUser(user);
        await storage.storeAuthToken(data.accessToken, null)
        setAuthState(prev => ({ ...prev, user: user }));
        return true
      }
      return false
    } catch (error) {
      console.error('Sign up error', error);
      return false;
    }
  };

  const completeOnboarding = async (): Promise<void> => {
    try {
      await storage.setOnboardingCompleted(true);
      setAuthState(prev => ({ ...prev, isOnboardingCompleted: true }));
    } catch (error) {
      console.error('Complete onboarding error', error);
    }
  };

  // Ajoutez cette fonction pour marquer la première utilisation comme terminée
  const completeFirstLaunch = async (): Promise<void> => {
    try {
      await storage.setItem(STORAGE_KEYS.IS_FIRST_LAUNCH, false);
      setAuthState(prev => ({ ...prev, isFirstLaunch: false }));
    } catch (error) {
      console.error('Error completing first launch', error);
    }
  };

  // Rafraîchissement du token
  const refreshToken = async (token: string, refreshToken: string) => {
    try {
      await storage.storeAuthToken(token, refreshToken);
      return { success: true, token };
    } catch (error: any) {
      await storage.clearAuthToken();
      return { success: false, error: error.response?.data || error.message };
    }
  };

  const setProfil = async (data: any) => {
    try {
      const profil: Profil = {
        profile_picture: data.profile_picture,
        account_number: data.account_number,
        account_state: data.account_state,
        name: data.name,
        benacc: data.benacc
      };
      await storage.setProfil(profil);
      setAuthState(prev => ({ ...prev, profil: profil }));
      return true
    } catch (err) {
      return false
    }
  }

  const value = {
    authState,
    appSettings,
    signIn,
    signUp,
    signOut,
    completeOnboarding,
    changeLanguage,
    updateAppSettings,
    completeFirstLaunch,
    refreshToken,
    setProfil,
    changePassword
  };



  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};