const getDefaultCategories = (userId) => [
  { name: "Salary", type: "income", user: userId, isDefault: true },
  { name: "Freelance", type: "income", user: userId, isDefault: true },
  { name: "Gift", type: "income", user: userId, isDefault: true },

  { name: "Food", type: "expense", user: userId, isDefault: true },
  { name: "Transport", type: "expense", user: userId, isDefault: true },
  { name: "Bills", type: "expense", user: userId, isDefault: true },
  { name: "Shopping", type: "expense", user: userId, isDefault: true },
];

export default getDefaultCategories