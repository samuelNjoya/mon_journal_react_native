import { useTranslation } from '../../hooks/useTranslation';

export const handleApiError = (error: any) => {
    if (error.response) {
        // Erreur du serveur avec code de statut
        const status = error.response.status;
        const message = error.response.data?.err_msg || error.response.data?.message || "Erreur inconnue";
        const data = error.response.data || null;
        console.log(data)
        switch (status) {
            case 400:
                return { message: "Requête invalide", details: message, status, data };
            case 401:
                return { message: "Non autorisé", details: "Veuillez vous reconnecter", status, data };
            case 403:
                return { message: "Accès refusé", details: message, status, data };
            case 404:
                return { message: error.response.data?.err_msg || "Ressource non trouvée", details: message, status, data };
            case 500:
                return { message: "Server error", details: "Veuillez réessayer plus tard", status, data };
            default:
                return { message: "Erreur inconnue", details: message, status, data };
        }
    } else if (error.request) {
        // Erreur de réseau
        return { message: "Erreur reseau", details: "Vérifiez votre connexion internet" };
    } else {
        // Erreur inconnue
        return { message: "Erreur inconnue", details: error.message };
    }
};

export const isNetworkError = (error: any) => {
    return error.message === 'Network Error' || error.request;
};