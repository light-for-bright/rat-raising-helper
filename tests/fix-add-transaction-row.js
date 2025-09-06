// Исправленная функция addTransactionRow
function addTransactionRow() {
  const tbody = document.getElementById('transactions-table-body');
  const transactionId = Date.now().toString();
  
  const row = document.createElement('tr');
  row.id = `transaction-row-${transactionId}`;
  row.innerHTML = `
    <td>
      <input type="number" class="form-control form-control-sm" id="transaction-amount-${transactionId}" placeholder="0" step="0.01">
    </td>
    <td>
      <div class="btn-group btn-group-sm" role="group">
        <input type="radio" class="btn-check" name="transaction-type-${transactionId}" id="income-${transactionId}" value="income" autocomplete="off">
        <label class="btn btn-outline-success" for="income-${transactionId}" title="Доход">➕</label>
        
        <input type="radio" class="btn-check" name="transaction-type-${transactionId}" id="expense-${transactionId}" value="expense" autocomplete="off">
        <label class="btn btn-outline-danger" for="expense-${transactionId}" title="Расход">➖</label>
      </div>
    </td>
    <td>
      <input type="text" class="form-control form-control-sm" id="transaction-description-${transactionId}" placeholder="Описание операции">
    </td>
    <td>
      <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeTransactionRow('${transactionId}')" title="Удалить">
        <i class="bi bi-trash"></i>
      </button>
    </td>
  `;
  
  tbody.appendChild(row);
  
  // Добавляем обработчики событий
  const amountInput = document.getElementById(`transaction-amount-${transactionId}`);
  const typeInputs = document.querySelectorAll(`input[name="transaction-type-${transactionId}"]`);
  const descriptionInput = document.getElementById(`transaction-description-${transactionId}`);
  
  amountInput.addEventListener('input', () => updateTransactionFromUI(transactionId));
  typeInputs.forEach(input => {
    input.addEventListener('change', () => updateTransactionFromUI(transactionId));
  });
  descriptionInput.addEventListener('input', () => updateTransactionFromUI(transactionId));
  
  // Автоматически добавляем новую строку при заполнении текущей
  amountInput.addEventListener('blur', () => {
    if (amountInput.value && !document.getElementById(`transaction-amount-${Date.now() + 1}`)) {
      addTransactionRow();
    }
  });
  
  log('Добавлена строка транзакции', { transactionId });
}
