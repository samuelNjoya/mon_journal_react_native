import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ShowProfilePhoto from './ShowProfilePicture';
import { useTranslation } from '../../hooks/useTranslation';

interface BenAccType {
    reference: "SPX-BA-PLATINUM" | "SPX-BA-IVORY" | "SPX-BA-LIGHT" | "SPX-BA-SOLO";
    id: number;
    card_picture: string;
    denomination: string;
    price: number;
    min_subscription: number;
    delay: string;
}
interface SummaryStepProps {
    onChange: (data: number) => void
    data: any;
    questions1: { value: number, label: string }[]
    questions2: { value: number, label: string }[]
    ben_accounts: BenAccType[]
}

const SummaryStep: React.FC<SummaryStepProps> = ({
    data,
    questions1, questions2, ben_accounts, onChange
}) => {
    const formatDate = (dateString: string) => {
        if (!dateString) return 'Non spécifié';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    const { t } = useTranslation();

    const handleEdit = (stepIndex: number) => {
        onChange(stepIndex);
    };

    const renderSection = (title: string, content: React.ReactNode, stepIndex: number) => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEdit(stepIndex)}
                >
                    <Ionicons name="pencil" size={16} color="#fcbf00" />
                    <Text style={styles.editText}>{t.signup.summary.edit}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.sectionContent}>
                {content}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t.signup.summary.title}</Text>
            <Text style={styles.subtitle}>{t.signup.summary.description}</Text>
            <View style={{ flex: 1, alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 14, fontFamily: 'Poppins-Bold' }}>
                    {t.signup.profilePicture}
                </Text>

                <ShowProfilePhoto
                    imageUri={data.customer_account.profile_picture}
                />
            </View>


            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Informations personnelles */}
                {renderSection(t.signup.personnalTitle, (
                    <View>
                        <SummaryRow label={t.auth.name} value={data.person.lastname} />
                        <SummaryRow label={t.signup.firstname} value={data.person.firstname} />
                        <SummaryRow label={t.auth.email} value={data.person.email} />
                        <SummaryRow label={t.auth.phoneNumber} value={data.person.phone_number} />
                        <SummaryRow label={t.signup.gender} value={data.person.gender} />
                        <SummaryRow label={t.signup.birthdate} value={formatDate(data.person.birthdate || '2025-02-02')} />
                    </View>
                ), 1)}

                {/* Type de compte */}
                {renderSection(t.benacc.benaccTitle, (
                    <View>
                        <SummaryRow label={t.benacc.benaccTitle} value={ben_accounts.find(x => x.id === data.customer_account.id_type_ben_account)?.denomination || ""} />
                        {/* <SummaryRow label="Forfait" value={"MONTH"} /> */}
                    </View>
                ), 2)}

                {/* Questions de sécurité */}
                {renderSection(t.signup.securityQuestions, (
                    <View>
                        <View key={0} style={styles.questionItem}>
                            <Text style={styles.questionLabel}>{t.signup.question} {1}:</Text>
                            <Text style={styles.questionText}>{questions1.find(x => x.value === data.answers[0].id_question)?.label}</Text>
                            <Text style={styles.answerText}>{data.answers[0].answer_value}</Text>
                        </View>
                        <View key={1} style={styles.questionItem}>
                            <Text style={styles.questionLabel}>{t.signup.question} {2}:</Text>
                            <Text style={styles.questionText}>{questions2.find(x => x.value === data.answers[1].id_question)?.label}</Text>
                            <Text style={styles.answerText}>{data.answers[1].answer_value}</Text>
                        </View>
                    </View>

                ), 3)}

                {/* Documents */}
                {renderSection(t.signup.documents, (
                    <View>
                        <SummaryRow label={t.signup.identityType} value={data.person.type_identification} />
                        <SummaryRow label={t.signup.number} value={data.person.id_card_number} />

                        <View style={styles.documentsContainer}>
                            <Text style={styles.documentsTitle}>Photos:</Text>
                            <View style={styles.imagesRow}>
                                {data.person.id_card_recto ? (
                                    <Image
                                        source={{ uri: data.person.id_card_recto }}
                                        style={styles.documentImage}
                                    />
                                ) : (
                                    <View style={styles.placeholderImage}>
                                        <Ionicons name="document" size={24} color="#ccc" />
                                    </View>
                                )}

                                {data.person.id_card_verso ? (
                                    <Image
                                        source={{ uri: data.person.id_card_verso }}
                                        style={styles.documentImage}
                                    />
                                ) : (
                                    <View style={styles.placeholderImage}>
                                        <Ionicons name="document" size={24} color="#ccc" />
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                ), 4)}
            </ScrollView>

            {/* Bouton de soumission
            <TouchableOpacity
                style={[styles.submitButton]}
            >

                <>
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                    <Text style={styles.submitButtonText}>Soumettre le formulaire</Text>
                </>
            </TouchableOpacity> */}
        </View>
    );
};

// Composant pour afficher une ligne de résumé
const SummaryRow: React.FC<{ label: string; value: string }> = ({ label, value }) => {
    const { t } = useTranslation();
    return (
        <View style={styles.summaryRow}>
            <Text style={styles.label}>{label}:</Text>
            <Text style={styles.value}>{value || t.signup.summary.notSpecified}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 22,
        fontFamily: 'Poppins-Bold',
        color: '#1a171a',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
        marginBottom: 24,
    },
    scrollView: {
        flex: 1,
        marginBottom: 20,
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 12,
    },
    sectionTitle: {
        fontSize: 15,
        fontFamily: 'Poppins-Bold',
        color: '#1a171a',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
    },
    editText: {
        color: '#fcbf00',
        marginLeft: 4,
        fontWeight: '500',
    },
    sectionContent: {
        paddingHorizontal: 4,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f8f8f8',
    },
    label: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Poppins-Regular',
        flex: 1,
    },
    value: {
        fontSize: 13,
        color: '#1a171a',
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        flex: 1,
        textAlign: 'right',
    },
    questionItem: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f8f8f8',
    },
    questionLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 2,
    },
    questionText: {
        fontSize: 14,
        color: '#1a171a',
        fontWeight: '500',
        marginBottom: 4,
    },
    answerText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    documentsContainer: {
        marginTop: 12,
    },
    documentsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a171a',
        marginBottom: 8,
    },
    imagesRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 8,
    },
    documentImage: {
        width: 100,
        height: 80,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    placeholderImage: {
        width: 100,
        height: 80,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    submitButton: {
        backgroundColor: '#fcbf00',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginTop: 'auto',
    },
    submitButtonDisabled: {
        backgroundColor: '#ccc',
        opacity: 0.7,
    },
    submitButtonText: {
        color: '#1a171a',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default SummaryStep;