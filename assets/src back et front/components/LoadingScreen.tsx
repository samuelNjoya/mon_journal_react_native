import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';

const LoadinScreen = ({ message = 'Traiement en cours...' }) => {
    return (
        <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#fcbf00" />
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

export default LoadinScreen

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject, // ✅ couvre tout l'écran
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    message: {
        marginTop: 12,
        color: '#fcbf00',
        fontSize: 16,
        fontWeight: '500',
    },
});
