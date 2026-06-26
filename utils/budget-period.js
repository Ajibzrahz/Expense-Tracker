const getBudgetPeriod = (startDate, period) => {
  const endDate = new Date(startDate);

  switch (period) {
    case "weekly":
      endDate.setDate(endDate.getDate() + 7);
      break;

    case "monthly":
      endDate.setMonth(endDate.getMonth() + 1);
      break;

    case "yearly":
      endDate.setFullYear(endDate.getFullYear() + 1);
      break;
  }

  return endDate;
};

export { getBudgetPeriod };
