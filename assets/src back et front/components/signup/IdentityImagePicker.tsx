import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../hooks/useTranslation';

type IdentityImagePickerProps = {
    onChange?: (images: { front: string | null; back: string | null }) => void;
};

const IdentityImagePicker = ({ onChange }: IdentityImagePickerProps) => {
    const [images, setImages] = useState({ front: null, back: null });
    const [identitySide, setIdentitySide] = useState<string | null>(null);
    const [rectoImage, setRectoImage] = useState<string | null>(null);
    const [versoImage, setVersoImage] = useState<string | null>(null);
    const [showCamera, setShowCamera] = useState(false);
    const [cameraSide, setCameraSide] = useState('front');
    const cameraRef = useRef<CameraView>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [isTakingPhoto, setIsTakingPhoto] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { t } = useTranslation();

    const pickImage = async (side: string) => {

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission requise', 'Autorisez l’accès à la galerie.');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setImages(prev => {
                const updated = { ...prev, [side]: uri };
                onChange && onChange(updated);
                return updated;
            });
        }
    };

    const handleAddImage = (side: string) => {
        setShowModal(true)
        setIdentitySide(side)
    }

    const openCamera = async (side: string) => {
        setShowModal(false);
        if (!permission || !permission.granted) {
            const res = await requestPermission();
            if (!res.granted) {
                Alert.alert('Permission requise', 'Autorisez l’accès à la caméra.');
                return;
            }
        }
        setCameraSide(side);
        setShowCamera(true);;
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            setIsTakingPhoto(true);
            try {
                const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
                setImages(prev => {
                    const updated = { ...prev, [identitySide === "RECTO" ? "front" : "back"]: photo.uri };
                    onChange && onChange(updated);
                    return updated;
                });
                if (identitySide === "RECTO") {
                    setRectoImage(photo.uri);
                } else {
                    setVersoImage(photo.uri);
                }
                // setImages(prev => {
                //     const updated = { ...prev, [cameraSide]: photo.uri };
                //     onChange && onChange(updated);
                //     return updated;
                // });
                setShowCamera(false);
            } catch (error) {
                Alert.alert('Erreur', 'Impossible de prendre la photo');
            } finally {
                setIsTakingPhoto(false);
            }
        }
    };



    return (
        <View>
            <Text style={styles.label}>{t.signup.idPhotosTitle}</Text>
            <View style={styles.imageRow}>
                <View>
                    <Text style={styles.imageTitle}>{t.signup.idsideface}</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => handleAddImage('RECTO')}>
                        {rectoImage ? (
                            <Image source={{ uri: rectoImage }} style={styles.image} />
                        ) : (
                            <>
                                <Ionicons name="camera" size={32} color="#fcbf00" />
                                <Text style={styles.addText}>{t.signup.idphotoadd}</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={styles.imageTitle}>{t.signup.idsideback}</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => handleAddImage('VERSO')}>
                        {versoImage ? (
                            <Image source={{ uri: versoImage }} style={styles.image} />
                        ) : (
                            <>
                                <Ionicons name="camera" size={32} color="#fcbf00" />
                                <Text style={styles.addText}>{t.signup.idphotoadd}</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            {/* Modal choix */}
            <Modal visible={showModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{t.chooseOption}</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={() => openCamera('back')} >
                            <Ionicons name="camera" size={24} color="#fcbf00" />
                            <Text style={styles.modalButtonText}>{t.signup.takePhoto}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={() => pickImage('back')}>
                            <Ionicons name="image" size={24} color="#fcbf00" />
                            <Text style={styles.modalButtonText}>{t.signup.fromGallery}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
                            <Text style={styles.cancelText}>{t.common.cancel}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* Modal Camera */}
            <Modal visible={showCamera} animationType="slide">
                <View style={styles.cameraContainer}>
                    <CameraView
                        style={styles.camera}
                        facing={'back' as never}
                        ref={cameraRef}
                    >
                        <View style={styles.cameraButtons}>
                            <TouchableOpacity
                                style={styles.cameraCloseButton}
                                onPress={() => setShowCamera(false)}
                            >
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
                            <View style={styles.cameraPlaceholder} />
                        </View>
                    </CameraView>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        fontFamily: 'Poppins-Bold',
        fontSize: 13,
        marginTop: 16,
        marginBottom: 8,
        color: '#333',
    },
    imageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    imageButton: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 8,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#fff',
    },
    buttonText: {
        marginTop: 8,
        color: '#fcbf00',
        fontFamily: 'Poppins-Bold',
        fontSize: 11,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    camera: {
        flex: 1,
    },
    cameraButtons: {
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
    cameraPlaceholder: {
        width: 30,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        width: 280,
    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 16,
        color: '#333',
    },
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        width: '100%',
    },
    modalButtonText: {
        marginLeft: 12,
        color: '#333',
        fontSize: 16,
    },
    cancelButton: {
        marginTop: 12,
        paddingVertical: 8,
        width: '100%',
        alignItems: 'center',
    },
    cancelText: {
        color: '#fcbf00',
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
    },
    addButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#fcbf00',
        backgroundColor: '#fff',
        marginVertical: 16,
    },
    addText: {
        color: '#fcbf00',
        fontWeight: 'bold',
        marginTop: 8,
    },
    imageTitle: {
        fontFamily: 'Poppins-Regular',
        marginTop: 6,
        fontSize: 12
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },

});

export default IdentityImagePicker;