import apiClient from '../config/base';

export const userService = {
    // Récupérer le profil utilisateur
    getProfile: async () => {
        try {
            const response = await apiClient.get('/user/profile');
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    // Mettre à jour le profil
    updateProfile: async (userData: any) => {
        try {
            const response = await apiClient.put('/user/profile', userData);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    // Changer le mot de passe
    changePassword: async (currentPassword: string, newPassword: string) => {
        try {
            await apiClient.put('/user/change-password', {
                currentPassword,
                newPassword
            });
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    // Upload de photo de profil
    uploadProfilePhoto: async (imageUri: any) => {
        try {
            const formData = new FormData();
            formData.append('photo', {
                uri: imageUri,
                type: 'image/jpeg',
                name: 'profile.jpg'
            });

            const response = await apiClient.post('/user/upload-photo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    // Supprimer le compte
    deleteAccount: async () => {
        try {
            await apiClient.delete('/user/account');
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },
    checkPhoneNumber: async (phone: string) => {
        try {
            const response = await apiClient.post('/spayxauth/signup/signupMobilePart1', { phone_number: phone, lan: 'fr' });
            return { success: true, data: response.data };
        } catch (error: any) {
            console.log(JSON.stringify(error))
            return { success: false, error: error.response?.data || error.message };
        }
    },
};