import Toast from "react-native-toast-message";
import { generateRecurringExpensesApi } from "../api/ExpenseApi";

useEffect(() => {
  const init = async () => {
    try {
      // 1. Générer les dépenses répétitives si nécessaire
      const result = await generateRecurringExpensesApi();

      if (result?.generated && result.generated.length > 0) {
        Toast.show({
          type: "success",
          text1: "Nouvelles dépenses répétitives",
          text2: `${result.generated.length} dépense(s) répétitive(s) ajoutée(s).`,
          position: "top",
        });
      }

      // 2. Ensuite, charger la liste complète des dépenses
      await fetchExpenses();
    } catch (error) {
      console.log("Erreur initialisation :", error);
    }
  };

  init();
}, []);
