import React, { useState } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    StyleSheet,
    Alert,
    Modal,
    Platform,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';

interface ProfilePhotoPickerProps {
    imageUri: string
}

const ShowProfilePhoto: React.FC<ProfilePhotoPickerProps> = ({
    imageUri,
}) => {
    const size = 120;

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity
                style={[styles.container, { width: size, height: size }]}
                activeOpacity={0.8}
            >
                {imageUri ? (
                    <>
                        <Image source={{ uri: imageUri }} style={styles.image} />
                        <Ionicons name="camera" size={16} color="white" />
                    </>
                ) : (
                    <View style={styles.placeholder}>
                        <Ionicons name="person" size={size * 0.4} color="#fcbf00" />
                        <View style={styles.addButton}>
                            <Ionicons name="add" size={20} color="white" />
                        </View>
                    </View>
                )}
            </TouchableOpacity>

        </View>
    );
};


const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        borderRadius: 100,
        backgroundColor: '#fff3c2',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fcbf00',
        overflow: 'hidden',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
    },
    placeholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButton: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#fcbf00',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
});

export default ShowProfilePhoto;