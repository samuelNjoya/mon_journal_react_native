import apiClient from '../config/base';
import { storage } from '../../utils/storage';

export const homeService = {
    // Connexion
    getDatas: async () => {
        try {
            const response = await apiClient.post('/spayxhome');
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    // Inscription
    getCommissions: async (userData: any) => {
        try {
            const response = await apiClient.post('/spayxop/onlinedeposit', userData);
            return { success: true, data: response.data };
        } catch (error: any) {
            console.log("Erreur produit", error.data)
            return { success: false, error: error.message };
        }
    },

    // delete subscription
    deleteSubscription: async (data: any) => {
        try {
            const response = await apiClient.post('/spayxserv/tv/subscription/delete', data);
            return { success: true, data: response.data };
        } catch (error: any) {
            console.log("Erreur produit", error.data)
            return { success: false, error: error.message };
        }
    },

    // Souscription a un compte de privilege
    subscribeBenefit: async (credentials: any) => {
        try {
            const response = await apiClient.post('/spayxbenacc/subscribe', credentials);
            return { success: true, data: response.data };
        } catch (error: any) {
            console.log(error)
            return { success: false, error: error.response?.data || error.message };
        }
    },

    // Check payment status
    checkMomoPayStatus: async (data: any) => {
        try {
            const response = await apiClient.post('/spayxop/momo/requestpaystatus', data);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    // Check payment status
    checkOmPayStatus: async (data: any) => {
        try {
            const response = await apiClient.post('/spayxop/om/paymentstatus', data);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    // Tv subscriptions
    getTvSubscriptions: async () => {
        try {
            const response = await apiClient.post('/spayxserv/tv/subscription/list');
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },
    // Tv subscriptions 
    getTvBouquets: async () => {
        try {
            const response = await apiClient.post('/spayxop/tvpackage', { op_reference: 'SO_PYBCANAL', part_abbr: 'CPLUS' });
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    createSubscription: async (data: any) => {
        try {
            const response = await apiClient.post('/spayxserv/tv/subscription/create', data);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    updateSubscription: async (data: any) => {
        try {
            const response = await apiClient.post('/spayxserv/tv/subscription/edit', data);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    getTVRenewalOrders: async () => {
        try {
            const response = await apiClient.post('/spayxserv/tv/command/list');
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    // Tv subscriptions 
    payTVPackages: async (data: any) => {
        try {
            const response = await apiClient.post('/spayxop/paytvpackage', data);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    // Sesampayx deposit 
    deposit: async (data: any) => {
        try {
            const response = await apiClient.post('/spayxop/deposit/requestpay', data);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    // methodes de paiement
    getPaymentMethodes: async (data: { type_deposit: string }) => {
        try {
            const response = await apiClient.post('/spayxserv/payment_mode/list', data);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    // previsualisation du cout d'une recharge visa
    previewVisaDeposit: async (data: any) => {
        try {
            const response = await apiClient.post('/spayxop/previewVisaDeposit', data);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    // requete de recharge visa 
    requestVisaDeposit: async (data: any) => {
        try {
            const response = await apiClient.post('/spayxop/deposit/visarequest', data);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    //solde transactions
    balance: async (data: any) => {
        try {
            const response = await apiClient.post('/spayxop/balance', data);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    transactions: async (data: any) => {
        try {
            const response = await apiClient.post('/spayxop/transactions', data);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    // Standard commission
    getStandardCommissions: async (userData: any) => {
        try {
            const response = await apiClient.post('/spayxop/getcom', userData);
            return { success: true, data: response.data };
        } catch (error: any) {
            console.log("Erreur produit", error.data)
            return { success: false, error: error.message };
        }
    },

    // Previsualiser le transfert
    previewAccTransfert: async (userData: any) => {
        try {
            const response = await apiClient.post('/spayxop/preview/acctransf', userData);
            return { success: true, data: response.data };
        } catch (error: any) {
            console.log("Erreur produit", error.data)
            return { success: false, error: error.message };
        }
    },

    // transfert vers un abonne sesame
    accTransfert: async (userData: any) => {
        try {
            const response = await apiClient.post('/spayxop/acctransf', userData);
            return { success: true, data: response.data };
        } catch (error: any) {
            console.log("Erreur produit", error.data)
            return { success: false, error: error.message };
        }
    },

    // Previsualiser le transfert vers un client non abonne sesame
    previewNonAccTransfert: async (userData: any) => {
        try {
            const response = await apiClient.post('/spayxop/preview/nonacctransf', userData);
            return { success: true, data: response.data };
        } catch (error: any) {
            console.log("Erreur produit", error.data)
            return { success: false, error: error.message };
        }
    },

    // transfert vers un non abonne sesame
    nonAccTransfert: async (userData: any) => {
        try {
            const response = await apiClient.post('/spayxop/nonacctransf', userData);
            return { success: true, data: response.data };
        } catch (error: any) {
            console.log("Erreur produit", error.data)
            return { success: false, error: error.message };
        }
    },

    // Réinitialisation du mot de passe 
    getGains: async (data: any) => {
        try {
            const response = await apiClient.post('/spayxbenacc/advantages', data);
            return { success: true, data: response.data };
        } catch (error: any) {
            console.log(error)
            return { success: false, error: error.response?.data || error.message };
        }
    },

    //Lister les tickets d'assistance
    getTickets: async () => {
        try {
            const response = await apiClient.post('/spayxassist/ticket/list');
            return { success: true, data: response.data };
        } catch (error: any) {
            console.log(error)
            return { success: false, error: error.response?.data || error.message };
        }
    },

    // lister les annonces
    getAnnouncements: async () => {
        try {
            const response = await apiClient.post('/spayxassist/announcement/list');
            return { success: true, data: response.data };
        } catch (error: any) {
            console.log(error)
            return { success: false, error: error.response?.data || error.message };
        }
    },
    async getTicketMessages(data: any) {
        try {
            const response = await apiClient.post(`/spayxassist/message/list`, data);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    async sendTicketMessage(data: { id_ticket: string; message: string; }) {
        try {
            const response = await apiClient.post(`/spayxassist/message/sendtext`, data);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    async createTicket(ticketData: { id_category: string; title: string; description: string }) {
        try {
            const response = await apiClient.post('/spayxassist/ticket/create', ticketData);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },
    async getCategories() {
        try {
            const response = await apiClient.post('/spayxassist/listcat');
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },
    async getAgencies() {
        try {
            const response = await apiClient.post('/spayxassist/agency/list');
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },
    async getProfileData() {
        try {
            const response = await apiClient.post('/spayxuser/infos');
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },
    async disconnectSession(data: any) {
        try {
            const response = await apiClient.post('/spayxuser/discsession', data);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },
    async setOnlinePayment(data: any) {
        try {
            const response = await apiClient.post('/spayxuser/payment/state/switch', data);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },
    async changePassword(data: any) {
        try {
            const response = await apiClient.post('/spayxuser/changepsw', data);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },
    async listSubscriptions() {
        try {
            const response = await apiClient.post('/spayxbenacc/listsubscript');
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    }


};