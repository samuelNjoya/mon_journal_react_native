import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    TextInput,
    Image,
    Alert,
    Platform,
    KeyboardAvoidingView,
    Modal,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SelectInput from '../components/SelectInput';
import IdentityImagePicker from '../components/signup/IdentityImagePicker';
import Step1 from '../components/signup/PhoneNumberStep';
import { userService } from '../api/services/user';
import { Preloader, CustomPreloader } from '../components/Preloader';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Step2 from '../components/signup/personnal1';
import Step3 from '../components/signup/Questions';
import Step4 from '../components/signup/Benacc';
import { useTranslation } from '../hooks/useTranslation';
import ProfilePhotoPicker from '../components/signup/PhotoProfil';
import SummaryStep from '../components/signup/Summary';
import { useAuthAuthContext } from '../context/auth/AuthContext';
import getDeviceNetworkInfo from '../utils/deviceInfo';
import ErrorModal from '../components/Notification';
import { authService } from '../api';


type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;


const SignupScreen = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const [questions1, setQuestions1] = useState([]);
    const [questions2, setQuestions2] = useState([]);
    const [ben_accounts, setBenaccounts] = useState([]);
    const { t, language } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);
    const { signUp } = useAuthAuthContext();
    const [message, setMessage] = useState('');
    const [messageTitle, setMessageTitle] = useState('')

    const [formData, setFormData] = useState({
        lan: language,
        host: {
            hostname: '',
            host_platform: Platform.OS,
            host_os: Platform.OS,
            app_version: ''
        },
        customer_account: {
            phone_number: '',
            email: '',
            id_type_ben_account: -1,
            profile_picture: '',
            password: '',
        },
        person: {
            lastname: '',
            firstname: '',
            email: '',
            birthdate: '',
            gender: '',
            phone_number: '',
            type_identification: '',
            passport_number: '',
            id_card_number: '',
            id_card_recto: '',
            id_card_verso: ''
        },
        password: '',
        confirmPassword: '',
        answers: [
            { id_question: '', answer_value: '' },
            { id_question: '', answer_value: '' },
        ],
    });
    useEffect(() => {
        const getAppVersionInfo = async () => {
            try {
                const deviceInfo = await getDeviceNetworkInfo();
                setFormData({
                    ...formData,
                    host: {
                        ...formData.host,
                        hostname: deviceInfo?.deviceName ? deviceInfo?.deviceName : '',
                        app_version: deviceInfo?.appVersion ? deviceInfo?.appVersion : ''
                    }
                })
            } catch (error) {
                console.error('Erreur récupération version:', error);
            }
        };

        getAppVersionInfo();
    }, []);

    const navigation = useNavigation<SignupScreenNavigationProp>();
    // Types de cartes d'identité
    const idCardTypes = [
        { id: 'CNI', name: t.signup.cni },
        { id: 'PASSPORT', name: t.signup.passport },
    ];
    const [profilePhoto, setProfilePhoto] = useState('');

    const handlePhotoSelected = (uri: string) => {
        setFormData({
            ...formData,
            customer_account: {
                ...formData.customer_account,
                profile_picture: uri || 'None1'
            }
        })
        setProfilePhoto(uri);
        Alert.alert(t.alerts.success, t.signup.profilepictureUpdated);
    };

    const handleNext = async () => {

        if (await validateStep(currentStep)) {
            if (currentStep < 5) {
                setCurrentStep(currentStep + 1);

            } else {
                // Soumission finale du formulaire
                await submitForm();
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const validateStep = async (step: number) => {
        switch (step) {
            case 0:
                if (!formData.customer_account.phone_number || formData.customer_account.phone_number.length < 9) {
                    Alert.alert(t.alerts.error, t.alerts.invalidPhoneNumber);
                    return false;
                }
                setLoading(true)
                const result = await userService.checkPhoneNumber(formData.customer_account.phone_number);
                if (!result || !result.success || !result.data) {
                    setLoading(false)
                    Alert.alert('Erreur', result.error);
                    return false;
                }
                let temp1 = result.data.datas.questions[0].questions.map((x: { id_question: number, question: string }) => {
                    return {
                        label: x.question,
                        value: x.id_question
                    }
                })
                let temp2 = result.data.datas.questions[1].questions.map((x: { id_question: number, question: string }) => {
                    return {
                        label: x.question,
                        value: x.id_question
                    }
                })
                setLoading(false)
                setBenaccounts(result.data.datas.ben_accounts)
                setQuestions1(temp1)
                setQuestions2(temp2)
                return true;
            case 1:
                if (!formData.person.lastname || !formData.person.email || !formData.person.gender! || !formData.person.birthdate) {
                    Alert.alert(t.alerts.error, t.alerts.fillAllFields);
                    return false;
                }
                if (!/\S+@\S+\.\S+/.test(formData.person.email)) {
                    Alert.alert(t.alerts.error, t.alerts.invalidEmail);
                    return false;
                }
                return true;
            case 2:
                if (!formData.password || formData.password.length < 6) {
                    Alert.alert(t.alerts.error, t.alerts.weakPassword);
                    return false;
                }
                if (formData.password !== formData.confirmPassword) {
                    Alert.alert(t.alerts.error, t.alerts.passwordMismatch);
                    return false;
                }
                if (!formData.answers[0].id_question || !formData.answers[0].answer_value ||
                    !formData.answers[1].id_question || !formData.answers[1].answer_value) {
                    Alert.alert(t.alerts.error, t.alerts.securityQuestionsIncomplete);
                    return false;
                }
                return true;
            case 3:
                if (!formData.customer_account.id_type_ben_account || formData.customer_account.id_type_ben_account === -1) {
                    Alert.alert(t.alerts.error, t.alerts.selectAccountType);
                    return false;
                }
                return true;
            case 4:
                if (!formData.person.id_card_recto || !formData.person.id_card_verso) {
                    Alert.alert(t.alerts.error, t.alerts.uploadIDPhotos);
                    return false;
                }
                return true;
            default:
                return true;
        }
    };
    const hideError = () => {
        setModalVisible(false);
    };

    const submitForm = async () => {
        try {
            setLoading(true)
            const result = await authService.register(formData);
            //const result = await signUp(formData)
            if (result.success && result.data) {
                if (result.data.status === 1) {
                    await signUp({
                        phone_number: formData.customer_account.phone_number,
                        firstname: formData.person.firstname,
                        lastname: formData.person.lastname,
                        sessionToken: result.data.sessionToken,
                        accessToken: result.data.accessToken,
                        email: formData.customer_account.email,
                        id: 0
                    })
                } else {
                    setMessage(result.data.err_msg)
                    setMessageTitle(result.data.err_title)
                    setModalVisible(true);
                }
            } else {
                console.log(result)
                setModalVisible(true);
                setMessage(result.error)
            }

            // Ici, vous enverriez les données à votre API
            // Alert.alert(
            //     t.alerts.congrats,
            //     t.alerts.accountcreated,
            //     [{ text: t.alerts.ok, onPress: () => setCurrentStep(0) }]
            // );
        } catch (error) {
            console.log("error")
        } finally {
            setLoading(false)
        }
    };

    const handleInputChangePerson = (field: string, value: string) => {
        if (field === "type_identification") {
            setFormData({
                ...formData,
                person: {
                    ...formData.person,
                    type_identification: value,
                }
            });
        }
        if (field === "id_card_number") {
            setFormData({
                ...formData,
                person: {
                    ...formData.person,
                    passport_number: value,
                    id_card_number: value,
                }
            });
        }

    }



    const renderStepIndicator = () => {
        return (
            <View style={styles.stepIndicator}>
                {[0, 1, 2, 3, 4, 5].map((step) => (
                    <View key={step} style={styles.stepContainer}>
                        <View style={[
                            styles.stepCircle,
                            currentStep === step && styles.stepCircleActive,
                            currentStep > step && styles.stepCircleCompleted
                        ]}>
                            {currentStep > step ? (
                                <Ionicons name="checkmark" size={16} color="white" />
                            ) : (
                                <Text style={[
                                    styles.stepNumber,
                                    currentStep === step && styles.stepNumberActive
                                ]}>
                                    {step + 1}
                                </Text>
                            )}
                        </View>
                        {step < 5 && <View style={[
                            styles.stepLine,
                            currentStep > step && styles.stepLineCompleted
                        ]} />}
                    </View>
                ))}
            </View>
        );
    };

    const renderStepContent = () => {
        return (
            <>
                <View
                    key={0}
                    style={[
                        styles.step,
                        { display: currentStep === 0 ? 'flex' : 'none' }
                    ]}
                >
                    <Step1
                        onChange={(data: string) => setFormData({
                            ...formData,
                            customer_account: {
                                ...formData.customer_account,
                                phone_number: data // data est la nouvelle valeur du numéro
                            },
                            person: {
                                ...formData.person,
                                phone_number: data
                            }
                        })
                        }
                    />
                </View>
                <View
                    key={1}
                    style={[
                        styles.step,
                        { display: currentStep === 1 ? 'flex' : 'none' }
                    ]}
                >
                    <Step2
                        onChange={(data: any) => setFormData({
                            ...formData,
                            person: {
                                ...formData.person,
                                lastname: data.lastname,
                                firstname: data.firstname,
                                birthdate: data.birthdate,
                                gender: data.gender,
                                email: data.email
                            },
                            customer_account: {
                                ...formData.customer_account,
                                email: data.email // data est la nouvelle valeur du numéro
                            }
                        })}
                    />
                </View>
                <View
                    key={2}
                    style={[
                        styles.step,
                        { display: currentStep === 2 ? 'flex' : 'none' }
                    ]}
                >
                    <Step3
                        onChange={(data: any) => setFormData({
                            ...formData,
                            answers: data.answers,
                            customer_account: {
                                ...formData.customer_account,
                                password: data.password // data est la nouvelle valeur du numéro
                            },
                            password: data.password,
                            confirmPassword: data.confirm_password,

                        })}
                        questions1={questions1}
                        questions2={questions2}
                    />
                </View>
                <View
                    key={3}
                    style={[
                        styles.step,
                        { display: currentStep === 3 ? 'flex' : 'none' }
                    ]}
                >
                    <Step4
                        onChange={(data: { id_type_ben_account: number }) => setFormData({
                            ...formData,
                            customer_account: {
                                ...formData.customer_account,
                                id_type_ben_account: data.id_type_ben_account // data est la nouvelle valeur du numéro
                            },
                        })}
                        benaccs={ben_accounts}
                    />
                </View>
                {/** Ceci est l etape 5 */}
                <View
                    key={4}
                    style={[
                        styles.step,
                        { display: currentStep === 4 ? 'flex' : 'none' }
                    ]}
                >
                    <View style={styles.stepContent}>
                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', }}>
                            <View>
                                <Text style={{ fontSize: 12, marginBottom: 2, fontFamily: 'Poppins-Bold' }}>
                                    {t.signup.profilePicture}
                                </Text>
                                <Text style={{ fontSize: 8, color: '#666', fontFamily: 'Poppins-Regular' }}>
                                    {t.signup.ppNote}
                                </Text>
                            </View>

                            <ProfilePhotoPicker
                                onPhotoSelected={handlePhotoSelected}
                                initialImage={profilePhoto}
                                size={70}
                            />
                        </View>
                        <Text style={styles.stepTitle}>{t.signup.identityTitle}</Text>
                        <Text style={styles.stepDescription}>
                            {t.signup.identityDescription}
                        </Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>{t.signup.identityType}</Text>
                            <View style={styles.cardTypeContainer}>
                                {idCardTypes.map((cardType) => (
                                    <TouchableOpacity
                                        key={cardType.id}
                                        style={[
                                            styles.cardTypeButton,
                                            formData.person.type_identification === cardType.id && styles.cardTypeButtonSelected
                                        ]}
                                        onPress={() => handleInputChangePerson('type_identification', cardType.id)}
                                    >
                                        <Text style={[
                                            styles.cardTypeText,
                                            formData.person.type_identification === cardType.id && styles.cardTypeTextSelected
                                        ]}>
                                            {cardType.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>{t.signup.idNumber}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={t.signup.idplaceholder}
                                value={formData.person.id_card_number}
                                onChangeText={(text) => handleInputChangePerson('id_card_number', text)}
                            />
                        </View>
                        <IdentityImagePicker onChange={(images: any) => setFormData({
                            ...formData,
                            person: {
                                ...formData.person,
                                id_card_recto: images.front ? images.front : 'string1',
                                id_card_verso: images.back ? images.back : 'string1'
                            }
                        })} />

                        <Text style={styles.noteText}>
                            {t.signup.warningMsg}
                        </Text>
                    </View>
                </View>
                <View
                    key={5}
                    style={[
                        styles.step,
                        { display: currentStep === 5 ? 'flex' : 'none' }
                    ]}
                >
                    <View style={styles.stepContent}>
                        <SummaryStep
                            data={formData}
                            questions1={questions1}
                            questions2={questions2}
                            ben_accounts={ben_accounts}
                            onChange={(data: number) => setCurrentStep(data)}
                        />
                    </View>

                </View>
            </>
        )
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fcbf00" />
            {
                loading && <Preloader
                    visible={loading} />
            }
            <View style={styles.header}>
                {currentStep > 0 ? (
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#1a171a" />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.backButton} />
                )}

                <Text style={styles.headerTitle}>{t.signup.headerTitle}</Text>

                <TouchableOpacity onPress={() => Alert.alert(
                    t.common.cancel,
                    t.alerts.cancelOpertionQuestion,
                    [
                        {
                            text: t.common.cancel,
                            style: 'cancel',
                        },
                        {
                            text: t.common.quit,
                            onPress: () => { navigation.navigate('Login' as never); },
                            style: 'destructive',
                        },
                    ]
                )}
                >
                    <Text style={styles.cancelText}>{t.common.cancel}</Text>
                </TouchableOpacity>
            </View>

            {renderStepIndicator()}

            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                <ScrollView style={[styles.content, { marginBottom: insets.bottom }]}>
                    {renderStepContent()}

                </ScrollView>
            </KeyboardAvoidingView>

            <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
                <Text style={styles.stepCounter}>{t.common.step} {currentStep + 1} {t.common.on} 6</Text>

                <TouchableOpacity
                    style={[styles.nextButton]}
                    onPress={handleNext}
                // disabled={!isStepValid}
                >
                    <Text style={styles.nextButtonText}>
                        {currentStep === 5 ? t.alerts.createMyAccount : t.common.next}
                    </Text>
                    <Ionicons
                        name={currentStep === 5 ? "checkmark" : "arrow-forward"}
                        size={20}
                        color="white"
                    />
                </TouchableOpacity>
            </View>
            <ErrorModal
                visible={modalVisible}
                title={messageTitle}
                message={messageTitle}
                type={"error"}
                onClose={hideError}
            // primaryButton={{
            //     text: 'Compris',
            //     onPress: hideError,
            // }}
            // secondaryButton={{
            //     text: 'Aide',
            //     onPress: () => {
            //         // Ouvrir l'aide
            //         hideError();
            //     },
            // }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FB',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingTop: 40, // Grand padding pour créer de l'espace avec la StatusBar
        backgroundColor: '#fcbf00',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        width: 40,
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#1a171a',
    },
    cancelText: {
        color: '#FF3B30',
        fontWeight: '500',
    },
    stepIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: 'white',

    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepCircleActive: {
        backgroundColor: '#fcbf00',
    },
    stepCircleCompleted: {
        backgroundColor: '#fcbf00',
    },
    stepNumber: {
        color: '#666',
        fontWeight: 'bold',
    },
    stepNumberActive: {
        color: 'white',
    },
    stepLine: {
        width: 30,
        height: 2,
        backgroundColor: '#E0E0E0',
    },
    stepLineCompleted: {
        backgroundColor: '#fcbf00',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    stepContent: {
        marginBottom: 20,
    },
    stepTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
        color: '#1a171a',
        marginBottom: 8,
    },
    stepDescription: {
        fontSize: 12,
        color: '#666',
        marginBottom: 24,
        fontFamily: 'Poppins-Regular',
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 12,
        fontFamily: 'Poppins-Bold',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
    },
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    radioButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    radioButtonSelected: {
        backgroundColor: '#fcbf00',
        borderColor: '#fcbf00',
    },
    radioText: {
        color: '#666',
        fontWeight: '500',
    },
    radioTextSelected: {
        color: 'white',
    },
    datePickerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 16,
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },

    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    picker: {
        fontSize: 16,
        color: '#333',
    },
    idContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    idSection: {
        flex: 1,
        marginHorizontal: 8,
    },
    idTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    idUploadButton: {
        height: 150,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        backgroundColor: 'white',
        overflow: 'hidden',
    },
    idImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    uploadPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadText: {
        marginTop: 8,
        color: '#fcbf00',
        fontWeight: '500',
    },
    noteText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 16,
    },
    footer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 10,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    stepCounter: {
        color: '#666',
        fontWeight: '500',
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fcbf00',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    nextButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    nextButtonText: {
        color: '#1a171a',
        //fontWeight: 'bold',
        fontFamily: 'Poppins-Bold',
        fontSize: 12,
        marginRight: 8,
    },
    countryPicker: {
        marginRight: 8,
        marginBottom: 6.5
    },
    inputPhoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e9ecef',
        paddingHorizontal: 15,
        height: 54,
    },
    inputPhone: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#2c3e50',
        height: '100%',
    },
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#3498db',
        borderRadius: 8,
        color: '#2c3e50',
        backgroundColor: '#ecf0f1',
        paddingRight: 30,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#3498db',
        borderRadius: 8,
        color: '#2c3e50',
        backgroundColor: '#ecf0f1',
        paddingRight: 30,
    },
    cardTypeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cardTypeButton: {
        width: '48%',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: 'white',
    },
    cardTypeButtonSelected: {
        backgroundColor: '#fcbf00',
        borderColor: '#fcbf00',
    },
    cardTypeText: {
        color: '#666',
        fontWeight: '500',
        textAlign: 'center',
    },
    cardTypeTextSelected: {
        color: 'white',
    },
    alternativeButton: {
        marginTop: 8,
        padding: 8,
        alignItems: 'center',
    },
    alternativeButtonText: {
        color: '#fcbf00',
        fontSize: 12,
    },
    step: {

    },
});

export default SignupScreen;