import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Données fictives pour les transactions à catégoriser
const transactions = [
  { id: 1, title: "Transfert reçu", date: "2025-01-28", amount: "75 000 FCFA", category: "Non catégorisé" },
  { id: 2, title: "Payment Orange Money", date: "2025-01-26", amount: "30 000 FCFA", category: "Non catégorisé" },
  { id: 3, title: "Achat supermarché", date: "2025-01-25", amount: "95 000 FCFA", category: "Non catégorisé" },
];

const TransactionsACategoriser = () => {
  // État pour gérer l'accordéon (true = déployé, false = masqué)
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      {/* En-tête de l'accordéon */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.title}>Transactions à catégoriser</Text>
        {/* Icône qui change selon l'état (déployé/masqué) */}
        <Icon
          name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color="#000"
        />
      </TouchableOpacity>

      {/* Contenu de l'accordéon (affiché uniquement si `expanded` est true) */}
      {expanded && (
        <View style={styles.content}>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionHeader}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionAmount}>{transaction.amount}</Text>
              </View>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// Styles pour le composant
const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 15,
  },
  transactionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionTitle: {
    fontSize: 14,
  },
  transactionAmount: {
    fontSize: 14,
    color: '#e74c3c',
  },
  transactionDate: {
    fontSize: 12,
    color: '#7f8c8d',
  },
});

export default TransactionsACategoriser;
