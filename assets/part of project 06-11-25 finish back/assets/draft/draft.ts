//  const addCategory = async (cat: Category) => {
//     try {

//       const apiResponse = await createCategory(cat);

//       const createdCategory: Category = {
//         id: apiResponse.data?.id,
//         nom: apiResponse.data?.nom,
//         type: apiResponse.data?.type,
//         icon: apiResponse.data?.icon_name,
//         color: apiResponse.data?.icon_color,
//       };

//       //  Mise à jour du state
//       setCategories([...categories, createdCategory]); // ici la categorie est ajouter a la fin dela liste
//       loadCategories(); //chargement
//     } catch (error) {
//       console.error("Erreur ajout catégorie via API :", error);
//       alert("Impossible de créer la catégorie sur le serveur");
//     }
//   };



//Catégories par défaut
// const DEFAULT_CATEGORIES: Category[] = [
//   { id: 1, name: "Alimentation", icon: "car", color: "#2196f3" },
//   { id: 3, name: "Logentation", icon: "food", color: "#f44336" },
//   { id: 2, name: "Transment", icon: "home", color: "#4caf50" },
//   { id: 4, name: "Loisirs", icon: "gamepad-variant", color: "#ff9800" },
//   { id: 5, name: "Santé", icon: "heart", color: "#9c27b0" },
//   { id: 6, name: "Éducation", icon: "school", color: "#3f51b5" },

// 🌟 Nouvelles catégories
  // { id: 7, name: "Shopping", icon: "shopping-outline", color: "#EC407A" },
  // { id: 8, name: "Factures", icon: "file-document", color: "#009688" },
  // { id: 9, name: "Télécommunications", icon: "cellphone", color: "#607D8B" },
  // { id: 10, name: "Abonnements", icon: "credit-card", color: "#795548" },
  // { id: 11, name: "Cadeaux", icon: "gift", color: "#F06292" },
  // { id: 12, name: "Voyages", icon: "airplane", color: "#00BCD4" },
  // { id: 14, name: "Animaux", icon: "paw", color: "#FFB300" },
  // { id: 15, name: "Technologie", icon: "laptop", color: "#2196F3" },
  // { id: 16, name: "Entretien Maison", icon: "tools", color: "#FF5722" },
  // { id: 17, name: "Impôts", icon: "cash-multiple", color: "#B71C1C" },
  // { id: 18, name: "Dons", icon: "hand-heart", color: "#BA68C8" },
  // { id: 19, name: "Enfants", icon: "baby-face-outline", color: "#F48FB1" },
  // { id: 20, name: "Autres", icon: "dots-horizontal", color: "#9E9E9E" },
  
// ];

// export const DEFAULT_CATEGORY_IDS = [1, 2, 3, 4, 5, 6];



//  const [budgets, setBudgets] = useState<Budget[]>([

//     { id: 1, Libelle: "Essentiel", categoryIds: [1, 2, 3,19,20,27,31,32] },
//     { id: 2, Libelle: "Personnel", categoryIds: [4, 5, 6] },
//     { id: 3, Libelle: "Maison", categoryIds: [2, 5, 6] },
//     { id: 4, Libelle: "Budget Camping", categoryIds: [1, 2, 3, 6] },
//     { id: 5, Libelle: "Budget Voiture", categoryIds: [1, 4, 5, 6] },

//   ]);
 
// function stringToColor(str: string) {
//   let hash = 0;
//   for (let i = 0; i < str.length; i++) {
//     hash = str.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   const h = hash % 360;
//   return `hsl(${h}, 70%, 50%)`;
// }

  // pour deburger
//   useEffect(() => {
//      console.log("Catégories récupérées :", categories);
//     console.log("budgets récupérées :", budgets);
//   }, [categories, budgets]);


// libelle: expense.label libelle:valeur dans le backend et label: valeur du frontend

 //updated_at?: string; // Date de mise à jour
  //is_archive?: boolean; // Archivée ou non


  // date_debut: expense.is_repetitive ? expense.date_debut : null,
      // date_fin: expense.is_repetitive ? expense.date_fin : null,

// ExpenseList
       {/* - {item.montant.toLocaleString()} FCFA */}

  // console.log('filteredExpenses', filteredExpenses.map(e => ({ date: e.created_at, montant: e.montant })));
  // console.log('timeframe', timeframe);
  //  console.log('chartData', chartData);
  // console.log("Dépenses API :", expenses);

//   console.log("Expenses (avant filtrage):", expenses.length, expenses.slice(0, 3));
// console.log("FilteredExpenses (après filtrage):", filteredExpenses.length);
// console.log("Timeframe:", timeframe);


  // ExpenseScreen
  // const getFilteredExpenses = () => {
  //   if (!expenses?.length) return [];

  //   const s = new Date(filters.startDate);
  //   s.setHours(0, 0, 0, 0);
  //   const e = new Date(filters.endDate);
  //   e.setHours(23, 59, 59, 999);

  //   let allowedCategoryIds: number[] | null = null;
  //   if (filters.selectedBudget && filters.selectedBudget !== 0) {
  //     const b = budgets.find((bb) => bb.IdBudget === filters.selectedBudget);
  //     if (b && b.categories) {
  //       // On récupère les id des catégories associées à ce budget
  //       allowedCategoryIds = b.categories.map((cat: any) => cat.id);
  //     }
  //   }

  //   return expenses
  //     .filter((ex) => {
  //       // --- Date ---
  //       if (!ex.created_at) return false;

  //       //  Ton API renvoie `created_at` sous forme de texte "d/m/Y" => on le convertit
  //       const [day, month, year] = ex.created_at.split("/");
  //       const expenseDate = new Date(`${year}-${month}-${day}`);
  //       if (expenseDate < s || expenseDate > e) return false;

  //       // --- Montant ---
  //       if (ex.montant < filters.minAmountFilter || ex.montant > filters.maxAmountFilter)
  //         return false;

  //       // --- Catégorie ---
  //       if (
  //         filters.selectedCategory &&
  //         filters.selectedCategory !== 0 &&
  //         ex.id_categorie_depense !== filters.selectedCategory
  //       )
  //         return false;

  //       // --- Budget ---
  //       if (allowedCategoryIds && !allowedCategoryIds.includes(ex.id_categorie_depense))
  //         return false;

  //       return true;
  //     })
  //     .sort((a, b) => Number(b.id) - Number(a.id));
  // };
