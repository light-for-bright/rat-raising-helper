// Исправленная функция updateTransactionFromUI
function updateTransactionFromUI(transactionId) {
  const amount = document.getElementById(`transaction-amount-${transactionId}`)?.value;
  const type = document.getElementById(`transaction-type-${transactionId}`)?.value;
  const description = document.getElementById(`transaction-description-${transactionId}`)?.value;
  
  if (amount && type) {
    updateTransaction(transactionId, amount, type, description);
    
    // Обновляем отображение баланса
    document.getElementById('current-balance').textContent = formatCurrency(gameState.cashFlow.currentBalance);
  }
}
