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
import { useTranslation } from '../../hooks/useTranslation';

interface ProfilePhotoPickerProps {
    onPhotoSelected: (uri: string) => void;
    initialImage?: string;
    size?: number;
}

const ProfilePhotoPicker: React.FC<ProfilePhotoPickerProps> = ({
    onPhotoSelected,
    initialImage,
    size = 120
}) => {
    const [imageUri, setImageUri] = useState<string | null>(initialImage || null);
    const [modalVisible, setModalVisible] = useState(false);
    const [cameraVisible, setCameraVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const { t } = useTranslation();
    const requestGalleryPermission = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission requise', 'Nous avons besoin d\'accéder à vos photos');
                return false;
            }
        }
        return true;
    };

    const takePhoto = async () => {
        setModalVisible(false);

        if (!permission) {
            await requestPermission();
        }

        if (permission?.granted) {
            setCameraVisible(true);
        } else {
            Alert.alert('Permission requise', 'Nous avons besoin d\'accéder à votre caméra');
        }
    };

    const pickFromGallery = async () => {
        setModalVisible(false);
        setLoading(true);

        const hasPermission = await requestGalleryPermission();
        if (!hasPermission) {
            setLoading(false);
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0].uri) {
                const selectedImage = result.assets[0].uri;
                setImageUri(selectedImage);
                onPhotoSelected(selectedImage);
            }
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de sélectionner une image');
        } finally {
            setLoading(false);
        }
    };

    const handlePictureTaken = (photo: any) => {
        setCameraVisible(false);
        if (photo.uri) {
            setImageUri(photo.uri);
            onPhotoSelected(photo.uri);
        }
    };

    const removePhoto = () => {
        setImageUri(null);
        onPhotoSelected('');
    };

    if (loading) {
        return (
            <View style={[styles.container, { width: size, height: size }]}>
                <ActivityIndicator size="large" color="#fcbf00" />
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity
                style={[styles.container, { width: size, height: size }]}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
            >
                {imageUri ? (
                    <>
                        <Image source={{ uri: imageUri }} style={styles.image} />
                        <TouchableOpacity style={styles.editBadge} onPress={() => setModalVisible(true)}>
                            <Ionicons name="camera" size={16} color="white" />
                        </TouchableOpacity>
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

            {imageUri && (
                <TouchableOpacity style={styles.removeButton} onPress={removePhoto}>
                    <Ionicons name="close-circle" size={24} color="#ff3b30" />
                </TouchableOpacity>
            )}

            {/* Modal de choix */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{t.chooseOption}</Text>

                        <TouchableOpacity style={styles.modalOption} onPress={takePhoto}>
                            <Ionicons name="camera" size={24} color="#fcbf00" />
                            <Text style={styles.modalOptionText}>{t.signup.takePhoto}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalOption} onPress={pickFromGallery}>
                            <Ionicons name="images" size={24} color="#fcbf00" />
                            <Text style={styles.modalOptionText}>{t.signup.fromGallery}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>{t.common.cancel}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Camera Modal */}
            <Modal
                visible={cameraVisible}
                animationType="slide"
                transparent={false}
            >
                <CameraModal
                    onPictureTaken={handlePictureTaken}
                    onClose={() => setCameraVisible(false)}
                />
            </Modal>

        </View>
    );
};

// Composant Camera séparé
const CameraModal: React.FC<{ onPictureTaken: (photo: any) => void; onClose: () => void }> = ({
    onPictureTaken,
    onClose
}) => {
    const cameraRef = React.useRef<any>(null);
    const [isTakingPhoto, setIsTakingPhoto] = useState(false);

    const takePicture = async () => {
        if (cameraRef.current) {
            setIsTakingPhoto(true);
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    base64: true,
                });
                onPictureTaken(photo);
            } catch (error) {
                Alert.alert('Erreur', 'Impossible de prendre la photo');
            } finally {
                setIsTakingPhoto(false);
            }
        }
    };

    return (
        <View style={styles.cameraContainer}>
            <CameraView
                style={styles.camera}
                facing="back"
                ref={cameraRef}
            >
                <View style={styles.cameraControls}>
                    <TouchableOpacity style={styles.cameraCloseButton} onPress={onClose}>
                        <Ionicons name="close" size={30} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.captureButton}
                        onPress={takePicture}
                        disabled={isTakingPhoto}
                    >
                        {isTakingPhoto ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <View style={styles.captureButtonInner} />
                        )}
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 2,
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
    editBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButton: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'white',
        borderRadius: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        width: '90%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a171a',
        marginBottom: 20,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalOptionText: {
        marginLeft: 15,
        fontSize: 16,
        color: '#1a171a',
    },
    cancelButton: {
        marginTop: 10,
        padding: 15,
        width: '100%',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#ff3b30',
        fontSize: 16,
        fontWeight: '500',
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    camera: {
        flex: 1,
    },
    cameraControls: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: 20,
    },
    cameraCloseButton: {
        alignSelf: 'flex-start',
    },
    captureButton: {
        alignSelf: 'center',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
    },
});

export default ProfilePhotoPicker;