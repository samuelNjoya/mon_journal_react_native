import React, { useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    SafeAreaView,
    ActivityIndicator,
    Dimensions,
    Platform,
    Alert,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';

const { width, height } = Dimensions.get('window');

// Types pour les props
interface WebViewModalProps {
    visible: boolean;
    onClose: () => void;
    url: string;
    title?: string;
    onSuccess?: (data: any) => void;
    onCancel?: () => void;
    onError?: (error: any) => void;
    successUrlPattern?: string | RegExp;
    cancelUrlPattern?: string | RegExp;
    errorUrlPattern?: string | RegExp;
}

const AdvancedWebViewModal: React.FC<WebViewModalProps> = ({
    visible,
    onClose,
    url,
    title = "Paiement",
    onSuccess,
    onCancel,
    onError,
    successUrlPattern = /payment\/success/,
    cancelUrlPattern = /payment\/cancel/,
    errorUrlPattern = /payment\/error/,
}) => {
    const [loading, setLoading] = useState(true);
    const [canGoBack, setCanGoBack] = useState(false);
    const webViewRef = useRef<WebView>(null);
    const { t } = useTranslation();

    // Gestionnaire de navigation
    const handleNavigationStateChange = useCallback((navState: WebViewNavigation) => {
        setCanGoBack(navState.canGoBack);
        setLoading(navState.loading);

        // Vérifier les URLs de callback
        const currentUrl = navState.url;

        if (successUrlPattern && new RegExp(successUrlPattern).test(currentUrl)) {
            // Extraire les données de l'URL si nécessaire
            const urlParams = new URL(currentUrl).searchParams;
            const successData = {
                transactionId: urlParams.get('transaction_id'),
                amount: urlParams.get('amount'),
                status: urlParams.get('status'),
            };

            if (onSuccess) onSuccess(successData);
            onClose();
        }

        else if (cancelUrlPattern && new RegExp(cancelUrlPattern).test(currentUrl)) {
            if (onCancel) onCancel();
            onClose();
        }

        else if (errorUrlPattern && new RegExp(errorUrlPattern).test(currentUrl)) {
            const errorMessage = new URL(currentUrl).searchParams.get('message') || t.alerts.paymentError;
            if (onError) onError(new Error(errorMessage));
            onClose();
        }
    }, [onSuccess, onCancel, onError, onClose, successUrlPattern, cancelUrlPattern, errorUrlPattern]);

    // Gestionnaire de retour
    const handleGoBack = useCallback(() => {
        if (canGoBack && webViewRef.current) {
            webViewRef.current.goBack();
        } else {
            onClose();
        }
    }, [canGoBack, onClose]);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <SafeAreaView style={styles.modalContainer}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                        <Ionicons
                            name={canGoBack ? "arrow-back" : "close"}
                            size={24}
                            color="#007AFF"
                        />
                    </TouchableOpacity>

                    <Text style={styles.title} numberOfLines={1}>
                        {title}
                    </Text>

                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#007AFF" />
                    </TouchableOpacity>
                </View>

                {/* WebView avec indicateur de chargement */}
                <View style={styles.webViewContainer}>
                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#007AFF" />
                            <Text style={styles.loadingText}>{t.payment.visaWebProcessing}...</Text>
                        </View>
                    )}

                    <WebView
                        ref={webViewRef}
                        source={{ uri: url }}
                        style={styles.webview}
                        onLoadStart={() => setLoading(true)}
                        onLoadEnd={() => setLoading(false)}
                        onError={(error) => {
                            setLoading(false);
                            console.error('WebView Error:', error);
                            Alert.alert(t.alerts.error, t.payment.visaWebError);
                        }}
                        onNavigationStateChange={handleNavigationStateChange}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        mixedContentMode="compatibility"
                        allowsBackForwardNavigationGestures={true}
                    />
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        backgroundColor: '#F8F9FA',
    },
    backButton: {
        padding: 8,
        minWidth: 40,
    },
    closeButton: {
        padding: 8,
        minWidth: 40,
        alignItems: 'flex-end',
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginHorizontal: 8,
    },
    webViewContainer: {
        flex: 1,
        position: 'relative',
    },
    webview: {
        flex: 1,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 1000,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
});

export default AdvancedWebViewModal