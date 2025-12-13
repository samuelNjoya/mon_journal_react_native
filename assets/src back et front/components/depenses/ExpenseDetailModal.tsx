import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Modal from "react-native-modal";
import { COLORS, FONTS } from "../../../assets/constants";
import { Expense, Category, Budget } from "../../context/ExpenseContext";
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useTranslation } from "../../hooks/useTranslation";
import { useCategoryTranslation } from "../../hooks/useCategoryTranslation";

interface ExpenseDetailModalProps {
  visible: boolean;
  expense?: Expense | null;
  category?: Category | null;
  budget?: Budget | null;
  onClose: () => void;
}

export default function ExpenseDetailModal({
  visible,
  expense,
  category,
  budget,
  onClose,
}: ExpenseDetailModalProps) {
  const { t, locale } = useTranslation();
  const { getTranslatedCategoryName } = useCategoryTranslation();

  if (!expense) return null;

  // Conversion sûre du montant en nombre
  const montant = parseFloat(expense.montant as any) || 0;

  // Vérification sécurisée du cycle répétitif
  const isCycleActive =
    expense.is_repetitive && (expense.status_is_repetitive === 0); //|| expense.status_is_repetitive === "0"

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      backdropOpacity={0.4}
      useNativeDriver
    >
      <View style={styles.container}>
        {/* Titre */}
        <Text style={styles.title}>🧾 {t.expense.detail_of_expense}</Text>

        {/*Image (si disponible) */}
        {expense.piece_jointe && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: expense.piece_jointe }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}

        <View style={styles.separator} />

        {/* Informations principales */}
        <View style={styles.infoSection}>
          {/* Libellé */}
          <View style={styles.row}>
            <MaterialIcons name="label-outline" size={20} color={COLORS.textPrimary} />
            <Text style={styles.infoText}>
              <Text style={styles.label}>{t.expense.wording} : </Text>
              {expense.libelle || "—"}
            </Text>
          </View>

          {/* Montant */}
          <View style={styles.row}>
            <MaterialCommunityIcons name="cash" size={20} color={COLORS.yellow_color} />
            <Text style={styles.infoText}>
              <Text style={styles.label}>{t.expense.amount} : </Text>
              {/* {montant.toLocaleString("fr-FR")} FCFA */}
              {montant.toLocaleString(locale)} FCFA
            </Text>
          </View>

          {/* Date */}
          <View style={styles.row}>
            <MaterialCommunityIcons name="calendar" size={20} color={COLORS.blueColor} />
            <Text style={styles.infoText}>
              <Text style={styles.label}>{t.expense.date} : </Text>
              {expense.created_at || "—"}
            </Text>
          </View>

          {/* Catégorie */}
          {category && (
            <View style={styles.row}>
              <MaterialCommunityIcons
                name={(category.icon as keyof typeof MaterialCommunityIcons.glyphMap) || "account-group"}
                size={20}
                color={category.color || COLORS.textPrimary}
              />
              <Text style={styles.infoText}>
                <Text style={styles.label}>{t.expense.category} : </Text>
                {/* {category.nom || "—"} */}
                {getTranslatedCategoryName(category) || "—"}
              </Text>
            </View>
          )}

          {/* Budget */}
          {budget && (
            <View style={styles.row}>
              <FontAwesome5 name="wallet" size={18} color={COLORS.yellow_color} />
              <Text style={styles.infoText}>
                <Text style={styles.label}>{t.expense.budget} : </Text>
                {budget.libelle || "—"}
              </Text>
            </View>
          )}

          {/* Cycle répétitif */}
          {expense.is_repetitive ? (
            <View style={styles.row}>
              <MaterialCommunityIcons name="autorenew" size={20} color={COLORS.textPrimary} />
              <Text style={styles.infoText}>
                <Text style={styles.label}>Cycle : </Text>
                {expense.date_debut || "?"} → {expense.date_fin || "?"}{" "}
                <Text
                  style={{
                    color: isCycleActive ? COLORS.greenColor : COLORS.error,
                    fontWeight: "600",
                  }}
                >
                  ({isCycleActive ? t.expense.active : t.expense.stop_terminate})
                </Text>
              </Text>
            </View>
          ) : (
            <View style={styles.row}>
              <MaterialCommunityIcons name="progress-close" size={20} color={COLORS.error} />
              <Text style={styles.infoText}>{t.expense.no_repetive_cycle}</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 22,
    paddingHorizontal: 18,
  },
  title: {
    fontFamily: FONTS.Poppins_SemiBold,
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 12,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 14,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.textSecondary + "20",
    marginVertical: 10,
  },
  infoSection: {
    marginTop: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  infoText: {
    fontFamily: FONTS.Poppins_Regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    flexShrink: 1,
  },
  label: {
    fontFamily: FONTS.Poppins_Medium,
    color: COLORS.textPrimary,
  },
});
