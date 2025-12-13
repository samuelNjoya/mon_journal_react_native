import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Image,
    Dimensions,
    TextInput,
    Alert,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '../hooks/useTranslation';
import { showBenaccPricePeriod, showValidity } from '../utils/helpers';
import PrivilegeList from '../components/Benaccs';

const { width, height } = Dimensions.get('window');

interface Card {
    id_type_ben_account: number,
    denomination: string;
    reference: string;
    main_color: string;
    price: number;
    delay: string;
    min_subscription: number;
    description: string;
    badges: any[];
}


const MigrationScreen = ({ route, navigation }: any) => {
    const { benaccs, linked_benacc } = route.params || {};
    const initBenaccState = benaccs.find((x: any) => x.reference === linked_benacc.reference)
    const [selectedCard, setSelectedCard] = useState<Card>({
        id_type_ben_account: initBenaccState.id_type_ben_account,
        denomination: initBenaccState.denomination,
        reference: initBenaccState.reference,
        main_color: initBenaccState.main_color,
        price: initBenaccState.price,
        delay: initBenaccState.delay,
        min_subscription: initBenaccState.min_subscription,
        description: initBenaccState.description,
        badges: initBenaccState.badges
    });
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    const sortBadge = (badges: any[]) => {
        return badges.sort((a, b) => b.priority - a.priority)
    }


    return (
        <SafeAreaView style={styles.safeArea}>
            {/* <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#1a171a" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Vos comptes de privilèges</Text>
                </View>
                <View style={styles.headerRight} />
            </View> */}
            <View style={styles.container}>

                <Text style={styles.title}>{t.migrations.selectCard}</Text>

                <View style={styles.content}>
                    {/* Carte sélectionnée (grand format à gauche) */}
                    <View style={[styles.selectedCardContainer, { backgroundColor: selectedCard.main_color }]}>

                        <View style={{
                            borderBottomWidth: 0.5,
                            borderBottomColor: '#f8f8f8',
                            width: '100%',

                        }}>
                            <Text style={{ fontSize: 22, textTransform: 'uppercase', fontFamily: 'Poppins-SemiBold', padding: 10 }}>{selectedCard.denomination}</Text>
                        </View>
                        <View style={{ flex: 1, width: '100%' }}>
                            <View style={[styles.summaryRow, { marginTop: 10 }]}>
                                <Text style={styles.label}>{t.migrations.maintenanceFees}:</Text>
                                <Text style={styles.value}>{showBenaccPricePeriod(selectedCard.price, selectedCard.min_subscription, selectedCard.delay, t.benacc.month, t.benacc.day)}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.label}>{t.migrations.validity}:</Text>
                                <Text style={styles.value}>{showValidity(selectedCard.min_subscription, selectedCard.delay, t.benacc.month, t.benacc.day)}</Text>
                            </View>
                            <View style={styles.statusBadge}>
                                <Ionicons name="add-circle-outline" size={16} color="#3FA9F5" />
                                <Text style={styles.statusText}>{t.migrations.offerVisa}</Text>
                            </View>


                        </View>
                        <TouchableOpacity
                            style={styles.paymentButton}
                            onPress={() => navigation.navigate('Payment', { selectedCard })}
                        >
                            {
                                selectedCard.id_type_ben_account === linked_benacc.id ?
                                    <Text style={styles.paymentButtonText}>{t.migrations.update}</Text> :
                                    <Text style={styles.paymentButtonText}>{t.migrations.migrate}</Text>
                            }
                        </TouchableOpacity>
                    </View>

                    {/* Liste des cartes disponibles (petit format à droite) */}
                    <ScrollView style={styles.cardsList}>
                        {benaccs.map((card: any) => (
                            <TouchableOpacity
                                key={card.id_type_ben_account}
                                style={[
                                    styles.cardItem,
                                    selectedCard.id_type_ben_account === card.id_type_ben_account && styles.selectedCardItem,
                                    {
                                        backgroundColor: card.main_color
                                    }

                                ]}
                                onPress={() => setSelectedCard(card)}
                            >
                                <Text style={styles.cardItemName}>{card.denomination}</Text>
                                {/* <Text style={styles.cardItemType}>{card.type}</Text> */}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>


            </View>
            <View style={styles.description}>
                <View style={styles.descriptionHeader}>
                    <Text style={[styles.descriptionHeaderText, { color: selectedCard.main_color }]}>{selectedCard.denomination}</Text>
                </View>
                <Text style={styles.descriptionText}>{selectedCard.description}</Text>
                <PrivilegeList badges={sortBadge(selectedCard.badges)} />
            </View>
        </SafeAreaView>

    );
};

// Screen de paiement
// const PaymentScreen = ({ route, navigation }) => {
//   const { selectedCard } = route.params;
//   const [password, setPassword] = useState('');
//   const [selectedMethod, setSelectedMethod] = useState('card');

//   const paymentMethods = [
//     { id: 'card', name: 'Carte Bancaire' },
//     { id: 'paypal', name: 'PayPal' },
//     { id: 'applepay', name: 'Apple Pay' },
//     { id: 'googlepay', name: 'Google Pay' },
//   ];

//   const handleSubscribe = () => {
//     if (!password) {
//       Alert.alert('Erreur', 'Veuillez entrer votre mot de passe');
//       return;
//     }

//     // Ici, vous ajouteriez la logique de traitement du paiement
//     Alert.alert('Succès', 'Votre abonnement a été souscrit avec succès!');
//     navigation.goBack();
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Finaliser votre abonnement</Text>

//       <View style={styles.paymentContainer}>
//         <Text style={styles.sectionTitle}>Méthode de paiement</Text>

//         {paymentMethods.map(method => (
//           <TouchableOpacity
//             key={method.id}
//             style={[
//               styles.methodItem,
//               selectedMethod === method.id && styles.selectedMethod
//             ]}
//             onPress={() => setSelectedMethod(method.id)}
//           >
//             <Text style={styles.methodText}>{method.name}</Text>
//           </TouchableOpacity>
//         ))}

//         <Text style={styles.sectionTitle}>Sécurité</Text>
//         <TextInput
//           style={styles.passwordInput}
//           placeholder="Entrez votre mot de passe"
//           secureTextEntry
//           value={password}
//           onChangeText={setPassword}
//         />

//         <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
//           <Text style={styles.subscribeButtonText}>Valider et souscrire</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    container: {
        flex: 1,
        backgroundColor: '#eaeaea',
        padding: 20,
    },
    title: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
    },
    selectedCardContainer: {
        flex: 3,
        // backgroundColor: 'white',
        borderRadius: 15,
        // padding: 20,
        marginRight: 40,

        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    // selectedCardImage: {
    //     width: width * 0.5,
    //     height: width * 0.3,
    //     resizeMode: 'contain',
    //     marginBottom: 15,
    // },
    // selectedCardName: {
    //     fontSize: 12,
    //     fontWeight: 'bold',
    //     marginBottom: 5,
    // },
    // selectedCardNumber: {
    //     fontSize: 16,
    //     color: '#666',
    //     marginBottom: 5,
    // },
    // selectedCardExpiry: {
    //     fontSize: 14,
    //     color: '#888',
    //     marginBottom: 20,
    // },
    paymentButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 8,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
        width: '90%'


    },
    paymentButtonText: {
        color: 'white',
        fontFamily: 'Poppins-SemiBold',
        textTransform: 'uppercase',
        fontSize: 11,
    },
    cardsList: {
        flex: 1,
    },
    cardItem: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    selectedCardItem: {
        borderWidth: 3,
        borderColor: '#fff',
    },
    cardItemName: {
        fontSize: 10,
        fontFamily: 'Poppins-SemiBold',
        textTransform: 'uppercase'
    },
    // cardItemType: {
    //     fontSize: 12,
    //     color: '#666',
    // },
    // paymentContainer: {
    //     flex: 1,
    //     backgroundColor: 'white',
    //     borderRadius: 15,
    //     padding: 20,
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.1,
    //     shadowRadius: 4,
    //     elevation: 3,
    // },
    // sectionTitle: {
    //     fontSize: 18,
    //     fontWeight: 'bold',
    //     marginTop: 15,
    //     marginBottom: 10,
    // },
    // methodItem: {
    //     padding: 15,
    //     borderWidth: 1,
    //     borderColor: '#ddd',
    //     borderRadius: 8,
    //     marginBottom: 10,
    // },
    // selectedMethod: {
    //     borderColor: '#007AFF',
    //     backgroundColor: '#e6f2ff',
    // },
    // subscribeButton: {
    //     backgroundColor: '#007AFF',
    //     padding: 15,
    //     borderRadius: 8,
    //     alignItems: 'center',
    // },
    // subscribeButtonText: {
    //     color: 'white',
    //     fontWeight: 'bold',
    //     fontSize: 16,
    // },
    // header: {
    //     backgroundColor: '#fcbf00',
    //     paddingHorizontal: 16,
    //     paddingVertical: 10,
    //     borderBottomWidth: 1,
    //     borderBottomColor: '#e0e0e0',
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.1,
    //     shadowRadius: 3,
    //     elevation: 3,
    //     justifyContent: 'space-between',
    //     flexDirection: 'row',
    // },
    // headerTop1: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     alignItems: 'center',
    //     marginBottom: 10,
    // },
    // cardFooter: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     alignItems: 'center',
    // },
    // headerTop: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     alignItems: 'center',

    // },
    // headerTitle: {
    //     fontSize: 18,
    //     fontWeight: '700',
    //     color: '#1a171a',
    // },
    // headerRight: {
    //     width: 32,
    // },
    // backButton: {
    //     padding: 4,
    // },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        marginHorizontal: 10,
        // borderBottomWidth: 1,
        // borderBottomColor: '#f8f8f8',
    },
    label: {
        fontSize: 9,
        fontFamily: 'Poppins-Regular',
        flex: 1,
    },
    value: {
        fontSize: 12,
        color: '#1a171a',
        fontFamily: 'Poppins-Bold',
        flex: 1,
        textAlign: 'right',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3F5EF',
        paddingHorizontal: 12,
        marginHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 16,
        marginBottom: 10,
    },
    statusText: {
        color: '#3FA9F5',
        fontWeight: '600',
        fontSize: 9,
        marginLeft: 4,
    },
    description: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: 'white'
    },
    descriptionHeader: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#666',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    descriptionHeaderText: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',

    },
    descriptionText: {
        fontSize: 10,
        fontFamily: 'Poppins-Regular',
        backgroundColor: '#f7f6f6ff',
        marginHorizontal: 20,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginTop: 5,
        paddingVertical: 5,
    }
});

// Dans votre App.js ou votre navigateur
// Vous devrez configurer la navigation entre ces écrans
// Exemple avec React Navigation:
/*
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="CardSelection" component={BankCardSelectionScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
*/

export default MigrationScreen;