import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';

interface ErrorModalProps {
    visible: boolean;
    title?: string;
    color: string;
    message: string;
    onClose: () => void;
}

const BadgeDetails: React.FC<ErrorModalProps> = ({
    visible,
    title,
    message,
    color,
    onClose,
}) => {
    const { t } = useTranslation();
    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>

                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        {
                            <Ionicons name="medal-outline" size={28} color={color} />
                        }
                        <Text style={styles.title}>{title}</Text>
                    </View>

                    <View style={styles.modalBody}>
                        <Text style={styles.message}>{message}</Text>
                    </View>

                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeText}>{t.common.close}</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>

    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(26, 23, 26, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: Platform.OS === 'web' ? '40%' : '85%',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {

        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#fcbf00',
        width: '100%',
        padding: 10
    },
    title: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1a171a',
        marginLeft: 10,
        fontFamily: 'Poppins-Bold',
    },
    message: {
        fontSize: 12,
        color: '#333',
        marginBottom: 24,
        lineHeight: 20,
        fontFamily: 'Poppins-Regular',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 10
    },
    retryButton: {
        backgroundColor: '#fcbf00',
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 8,
        marginRight: 10,
    },
    retryText: {
        color: '#1a171a',
        fontWeight: '600',
        fontSize: 14,
    },
    closeButton: {
        backgroundColor: '#1a171a',
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 8,
    },
    closeText: {
        color: '#fff',
        fontFamily: 'Poppins-Bold',
        fontSize: 13,
    },
    modalBody: {
        paddingHorizontal: 16
    },
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
    title2: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    message2: {
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

export default BadgeDetails;