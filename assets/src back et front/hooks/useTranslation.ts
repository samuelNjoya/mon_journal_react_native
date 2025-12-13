import { useAuthAuthContext } from '../context/auth/AuthContext';
import { getTranslations } from '../utils/i18n';

export const useTranslation = () => {
    const { appSettings } = useAuthAuthContext();
    const t = getTranslations(appSettings.language);

    // Déterminer la locale basée sur la langue
    const locale = appSettings.language === 'en' ? 'en-US' : 'fr-FR'; // pour les graphs


    return { t, language: appSettings.language, locale };  // AJOUT de locale
};