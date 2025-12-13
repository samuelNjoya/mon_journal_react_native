// OperationFilterModal.tsx
import React, { JSX } from 'react';
import {View,Text,Modal,TouchableOpacity,FlatList,StyleSheet,Dimensions,ListRenderItemInfo,StatusBar} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { OperationType } from '../../types/TransacACategoriserType';
import { useTransCat } from '../../context/TransacACategoriserContext';
import { useTranslation } from '../../hooks/useTranslation';


interface OperationFilterModalProps {
  visible: boolean; 
  onClose: () => void; 
  onOperationSelect: (operation: OperationType | null) => void; 
  selectedOperation: OperationType | null;
}

const OperationFilterModal: React.FC<OperationFilterModalProps> = ({
  visible,onClose, onOperationSelect,selectedOperation}) => {

  const {listeOperation} = useTransCat();
  const { t } = useTranslation();
  
  // ========== FONCTION DE RENDU D'UNE OPÉRATION DANS LA LISTE ==========
  const renderOperationItem = ({ item }: ListRenderItemInfo<OperationType>): JSX.Element => {
    const isSelected = selectedOperation?.id_sesampayx_operation === item.id_sesampayx_operation;
    const isAllOperations = item.id_sesampayx_operation === -1;

    return (
      <TouchableOpacity
        style={[
          styles.operationItem, 
          isSelected && styles.selectedOperationItem 
        ]}
        onPress={() => {
          if (isAllOperations) {
            onOperationSelect(null);
          } else {
            onOperationSelect(item);
          }
          onClose();
        }}
      >
        <View style={styles.operationIconContainer}>
          <MaterialIcons 
            name="account-balance-wallet" 
            size={20} 
            color="#FFFFFF" 
          />
        </View>

        {/* ========== NOM DE L'OPÉRATION ========== */}
        <View style={styles.operationInfo}>
          <Text 
            style={[
              styles.operationName,
              isSelected && styles.selectedOperationName 
            ]}
            numberOfLines={2} 
          >
            {item.operation_name}
          </Text>
        </View>

        {isSelected && (
          <MaterialIcons 
            name="check" 
            size={20} 
            color="#fcbf00" 
          />
        )}
      </TouchableOpacity>
    );
  };

  // ========== PRÉPARATION DES DONNÉES POUR LA LISTE ==========
  const operationData = [
    {
      id_sesampayx_operation: -1, 
      operation_name: t.operation_depenses.all_operations, 
      operation_type_name: 'all' 
    } as OperationType,
    // ... Spread operator pour ajouter toutes les opérations existantes
    ...listeOperation
  ];

  // ========== RENDU PRINCIPAL DU MODAL ==========
  return (
    <Modal
      visible={visible} 
      transparent={true}
      animationType="slide"
      onRequestClose={onClose} 
      statusBarTranslucent={true} 
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.overlayTouchable}
          activeOpacity={1} 
          onPress={onClose} 
        />
        <View style={styles.modalContainer}>
          <View style={styles.dragIndicator} />
          <View style={styles.modalHeader}>
           
            <Text style={styles.modalTitle}>{t.operation_depenses.title_accordeon}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* ========== LISTE DES OPÉRATIONS ========== */}
          <FlatList
            data={operationData} 
            renderItem={renderOperationItem} // Fonction pour rendre chaque item
            keyExtractor={(item) => item.id_sesampayx_operation.toString()} 
            showsVerticalScrollIndicator={false} 
            style={styles.operationsList} 
            contentContainerStyle={styles.operationsListContent}
          />
        </View>
      </View>
    </Modal>
  );
};
export default OperationFilterModal;
const { width, height } = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight || 0;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1, // Prend tout l'espace disponible
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
   
    marginTop: -statusBarHeight,
    paddingTop: statusBarHeight,
  },
  
  // Zone cliquable invisible qui couvre tout l'overlay
  overlayTouchable: {
    flex: 1, 
    width: '100%',
  },
  
  // ========== STYLES POUR LE CONTENEUR DU MODAL ==========
  modalContainer: {
    position: 'absolute', // Position absolue pour le placer précisément
    bottom: 0,
    left: 0,
    right: 0, 
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20,
    maxHeight: height * 0.6, // Hauteur maximale = 60% de l'écran
    minHeight: height * 0.4, // Hauteur minimale = 40% de l'écran
   
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 }, 
    shadowOpacity: 0.25,
    shadowRadius: 10,
   
    elevation: 10,
  },
  
  // ========== INDICATEUR DE DRAG ==========
  dragIndicator: {
    width: 40, 
    height: 4,
    backgroundColor: '#E5E7EB', 
    borderRadius: 2,
    alignSelf: 'center', 
    marginTop: 8,
    marginBottom: 4, 
  },
  
  // ========== EN-TÊTE DU MODAL ==========
  modalHeader: {
   flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 20,
    paddingBottom: 9,
    paddingTop: 15,
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6', 
  },
  
  // Style du titre
  modalTitle: {
    fontSize: 17, 
    fontFamily: 'Poppins-SemiBold', 
    color: '#1F2937', 
    flex: 1,
  },
  
  // Bouton de fermeture
  closeButton: {
    padding: 4, 
  },
  
  // ========== STYLES POUR LA LISTE ==========
  operationsList: {
    flex: 1, 
  },
  
  // Contenu de la liste
  operationsListContent: {
    padding: 16,
  },
  
  // ========== STYLES POUR CHAQUE ITEM D'OPÉRATION ==========
  operationItem: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8, 
    borderRadius: 12,
    marginBottom: 8, 
  },
  
  // Style quand l'item est sélectionné
  selectedOperationItem: {
    backgroundColor: '#FFF9E6', 
  },
  
  // ========== CONTENEUR DE L'ICÔNE ==========
  operationIconContainer: {
    width: 36, 
    height: 36, 
    borderRadius: 10, 
    backgroundColor: '#fcbf00',
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12, 
  },
  
  // ========== CONTENEUR DES INFORMATIONS ==========
  operationInfo: {
    flex: 1,
  },
  
  // Style du nom de l'opération
  operationName: {
    fontSize: 13, 
    fontFamily: 'Poppins-Regular', 
    color: '#374151', 
    lineHeight: 20, 
  },
  
  // Style du nom quand sélectionné
  selectedOperationName: {
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937', 
  },
});