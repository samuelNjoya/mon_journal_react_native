// components/ErrorHandler.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from '../hooks/useTranslation';
import { Preloader } from './Preloader';

interface ErrorHandlerType {
    error: any;
    onRetry: any;
    loading: boolean;
}

const ErrorHandler = ({ error, onRetry, loading }: ErrorHandlerType) => {
    const { t } = useTranslation();
    if (loading) {
        return (
            <Preloader visible={loading} />
        );
    }
    if (error) {
        return (
            <View style={styles.container}>
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/7564/7564908.png' }}
                    style={styles.image}
                />
                <Text style={styles.title}>{t.alerts.error}</Text>
                <Text style={styles.message}>{error}</Text>
                <TouchableOpacity style={styles.button} onPress={onRetry}>
                    <Text style={styles.buttonText}>{t.common.retry}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return null;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    image: {
        width: 80,
        height: 80,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#666',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
});

export default ErrorHandler;