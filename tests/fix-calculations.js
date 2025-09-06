// Исправленная функция updateCalculatedFields
function updateCalculatedFields() {
  // Пересчитываем все значения
  const totalIncome = calculateTotalIncome();
  const totalExpenses = calculateTotalExpenses();
  const monthlyCashFlow = calculateMonthlyCashFlow();
  const passiveIncome = calculatePassiveIncome();
  
  const values = {
    totalIncome,
    totalExpenses,
    monthlyCashFlow,
    passiveIncome
  };
  
  gameState.calculatedValues = values;
  
  // Обновляем поля, если они существуют
  updateField('total-income', values.totalIncome);
  updateField('total-expenses', values.totalExpenses);
  updateField('monthly-cash-flow', values.monthlyCashFlow);
  updateField('passive-income', values.passiveIncome);
  updateField('total-liabilities', calculateTotalLiabilities());
  
  // Обновляем цвет поля денежного потока
  const cashFlowElement = document.getElementById('monthly-cash-flow');
  if (cashFlowElement) {
    if (values.monthlyCashFlow > 0) {
      cashFlowElement.classList.add('text-success');
      cashFlowElement.classList.remove('text-danger');
    } else if (values.monthlyCashFlow < 0) {
      cashFlowElement.classList.add('text-danger');
      cashFlowElement.classList.remove('text-success');
    } else {
      cashFlowElement.classList.remove('text-success', 'text-danger');
    }
  }
}
