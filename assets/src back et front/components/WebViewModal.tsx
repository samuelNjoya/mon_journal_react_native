import React, { useState, useCallback } from 'react';
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
    onNavigationStateChange?: (navState: WebViewNavigation) => void;
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
    onError?: (error: any) => void;
}

const WebViewModal: React.FC<WebViewModalProps> = ({
    visible,
    onClose,
    url,
    title = "Paiement",
    onNavigationStateChange,
    onLoadStart,
    onLoadEnd,
    onError,
}) => {
    const [loading, setLoading] = useState(true);
    const [canGoBack, setCanGoBack] = useState(false);
    const webViewRef = React.useRef<WebView>(null);
    const { t, language } = useTranslation();

    // Gestionnaire de navigation
    const handleNavigationStateChange = useCallback((navState: WebViewNavigation) => {
        setCanGoBack(navState.canGoBack);
        setLoading(navState.loading);

        if (onNavigationStateChange) {
            onNavigationStateChange(navState);
        }
    }, [onNavigationStateChange]);

    // Gestionnaire de retour
    const handleGoBack = useCallback(() => {
        if (canGoBack && webViewRef.current) {
            webViewRef.current.goBack();
        } else {
            onClose();
        }
    }, [canGoBack, onClose]);

    // Gestionnaire de chargement
    const handleLoadStart = useCallback(() => {
        setLoading(true);
        if (onLoadStart) onLoadStart();
    }, [onLoadStart]);

    // Gestionnaire de fin de chargement
    const handleLoadEnd = useCallback(() => {
        setLoading(false);
        if (onLoadEnd) onLoadEnd();
    }, [onLoadEnd]);

    // Gestionnaire d'erreur
    const handleError = useCallback((error: any) => {
        setLoading(false);
        console.error('WebView Error:', error);
        if (onError) onError(error);
    }, [onError]);

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
                            <Text style={styles.loadingText}>{t.common.processing}...</Text>
                        </View>
                    )}

                    <WebView
                        ref={webViewRef}
                        source={{ uri: url }}
                        style={styles.webview}
                        onLoadStart={handleLoadStart}
                        onLoadEnd={handleLoadEnd}
                        onError={handleError}
                        onNavigationStateChange={handleNavigationStateChange}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                    // startInLoadingState={true}
                    // mixedContentMode="compatibility"
                    // allowsBackForwardNavigationGestures={true}
                    // sharedCookiesEnabled={true}
                    // thirdPartyCookiesEnabled={true}
                    // userAgent={
                    //     Platform.OS === 'ios'
                    //         ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
                    //         : 'Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36'
                    // }
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

export default WebViewModal;