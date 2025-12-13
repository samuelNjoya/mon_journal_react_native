import * as Device from 'expo-device';
import * as Application from 'expo-application';

const getDeviceNetworkInfo = async () => {
    try {
        const deviceInfo = {
            // Informations de l'appareil
            deviceName: Device ? Device.deviceName : 'empty',
            brand: Device.brand,
            model: Device.modelName,
            osVersion: Device.osVersion,
            osBuildId: Device.osBuildId,
            deviceType: Device.deviceType,
            isDevice: Device.isDevice,
            appVersion: Application.nativeApplicationVersion ? Application.nativeApplicationVersion : '',
            buildVersion: Application.nativeBuildVersion
            // Informations de l'application
        };
        return deviceInfo
    } catch (error) {
        console.error('Erreur lors de la récupération des infos:', error);
        return null;
    }
};

export default getDeviceNetworkInfo

// Utilisation
// const deviceInfo = await getDeviceNetworkInfo();
// console.log('Hostname:', deviceInfo?.hostname);
// console.log('Nom du device:', deviceInfo?.deviceName);
// console.log('Adresse IP:', deviceInfo?.ipAddress);