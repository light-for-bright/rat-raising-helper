// Основная логика приложения

// Инициализация приложения
function initApp() {
  console.log('🚀 [DEBUG] initApp started');
  log('Инициализация приложения');
  
  // Загружаем сохраненную игру
  const gameLoaded = loadGame();
  
  if (gameLoaded) {
    log('Игра загружена из LocalStorage');
  } else {
    log('Создана новая игра');
    saveGame(); // Сохраняем начальное состояние
  }
  
  // Обновляем видимость вкладок
  updateTabVisibility();
  
  // Инициализируем обработчики событий
  initEventHandlers();
  
  // Загружаем данные в поля
  loadDataToFields();
  
  // Выполняем первоначальный пересчет
  if (typeof recalculateAll === 'function') {
    recalculateAll();
  }
  
  // Инициализируем вкладку бланка учета денежных средств
  // Инициализируем вкладку 2 этапа
  if (typeof initStage2Tab === "function") {
    initStage2Tab();
  }
  if (typeof initCashFlowTab === 'function') {
    initCashFlowTab();
  }

  log('Приложение инициализировано');
}

// Обновление видимости вкладок
function updateTabVisibility() {
  const stage2Tab = document.getElementById('stage2-tab');
  if (stage2Tab) {
    if (gameState.stage2Unlocked) {
      stage2Tab.classList.remove('disabled');
      stage2Tab.style.pointerEvents = 'auto';
    } else {
      stage2Tab.classList.add('disabled');
      stage2Tab.style.pointerEvents = 'none';
    }
  }
}

// Загрузка данных в поля формы
function loadDataToFields() {
  // Информационные поля
  document.getElementById('profession').value = gameState.profession || '';
  document.getElementById('dream').value = gameState.dream || '';
  document.getElementById('auditor').value = gameState.auditor || '';
  
  // Доходы
  document.getElementById('salary').value = gameState.income.salary || '';
  
  // Расходы
  document.getElementById('taxes').value = gameState.expenses.taxes || '';
  document.getElementById('house-mortgage').value = gameState.expenses.houseMortgage || '';
  document.getElementById('education-loan').value = gameState.expenses.educationLoan || '';
  document.getElementById('car-loan').value = gameState.expenses.carLoan || '';
  document.getElementById('credit-cards').value = gameState.expenses.creditCards || '';
  document.getElementById('other-expenses').value = gameState.expenses.otherExpenses || '';
  document.getElementById('bank-loan').value = gameState.expenses.bankLoan || '';
  document.getElementById('children-expenses').value = gameState.expenses.childrenExpenses || '';
  document.getElementById('children-count').value = gameState.expenses.childrenCount || '';
  
  // Активы
  document.getElementById('savings').value = gameState.assets.savings || '';
  document.getElementById('precious-metals').value = gameState.assets.preciousMetals || '';
  
  // Пассивы
  document.getElementById('house-mortgage-liability').value = gameState.liabilities.houseMortgage || '';
  document.getElementById('education-loan-liability').value = gameState.liabilities.educationLoan || '';
  document.getElementById('car-loan-liability').value = gameState.liabilities.carLoan || '';
  document.getElementById('credit-cards-liability').value = gameState.liabilities.creditCards || '';
  document.getElementById('bank-loan-liability').value = gameState.liabilities.bankLoan || '';
  
  // Загружаем таблицы
  loadTableData();
}

// Загрузка данных в таблицы
function loadTableData() {
  // Таблица доходов от недвижимости/бизнеса
  loadRealEstateIncomeTable();
  
  // Таблица акций
  loadStocksTable();
  
  // Таблица активов недвижимости/бизнеса
  loadRealEstateAssetsTable();
  
  // Таблица пассивов недвижимости/бизнеса
  loadRealEstateLiabilitiesTable();
}

// Загрузка таблицы доходов от недвижимости/бизнеса
function loadRealEstateIncomeTable() {
  const table = document.getElementById('real-estate-income-table').getElementsByTagName('tbody')[0];
  table.innerHTML = '';
  
  if (gameState.income.realEstateBusiness && gameState.income.realEstateBusiness.length > 0) {
    gameState.income.realEstateBusiness.forEach((item, index) => {
      addRealEstateIncomeRow(item.name, item.monthlyIncome, index);
    });
  } else {
    addRealEstateIncomeRow();
  }
}

// Загрузка таблицы акций
function loadStocksTable() {
  const table = document.getElementById('stocks-table').getElementsByTagName('tbody')[0];
  table.innerHTML = '';
  
  if (gameState.assets.stocks && gameState.assets.stocks.length > 0) {
    gameState.assets.stocks.forEach((stock, index) => {
      addStockRow(stock.name, stock.quantity, stock.price, index);
    });
  } else {
    addStockRow();
  }
}

// Загрузка таблицы активов недвижимости/бизнеса
function loadRealEstateAssetsTable() {
  const table = document.getElementById('real-estate-assets-table').getElementsByTagName('tbody')[0];
  table.innerHTML = '';
  
  if (gameState.assets.realEstateBusiness && gameState.assets.realEstateBusiness.length > 0) {
    gameState.assets.realEstateBusiness.forEach((item, index) => {
      addRealEstateAssetRow(item.name, item.downPayment, item.price, index);
    });
  } else {
    addRealEstateAssetRow();
  }
}

// Загрузка таблицы пассивов недвижимости/бизнеса
function loadRealEstateLiabilitiesTable() {
  const table = document.getElementById('real-estate-liabilities-table').getElementsByTagName('tbody')[0];
  table.innerHTML = '';
  
  if (gameState.liabilities.realEstateBusiness && gameState.liabilities.realEstateBusiness.length > 0) {
    gameState.liabilities.realEstateBusiness.forEach((item, index) => {
      addRealEstateLiabilityRow(item.name, item.mortgage, index);
    });
  } else {
    addRealEstateLiabilityRow();
  }
}

// ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ РАБОТЫ С ТАБЛИЦАМИ

// Функции для добавления строк в таблицы
function addRealEstateIncomeRow(name = '', monthlyIncome = '', index = null) {
  const table = document.getElementById('real-estate-income-table').getElementsByTagName('tbody')[0];
  const row = table.insertRow();
  
  row.innerHTML = `
    <td><input type="text" class="form-control form-control-sm" value="${name}" placeholder="Название" onchange="updateRealEstateIncome(${index || table.rows.length - 1}, this.value, 'name')"></td>
    <td><input type="number" class="form-control form-control-sm" value="${monthlyIncome}" placeholder="0" onchange="updateRealEstateIncome(${index || table.rows.length - 1}, this.value, 'monthlyIncome')"></td>
    <td style="text-align: center; background-color: #f8f9fa; padding: 0.5rem;">
      <button type="button" class="btn btn-sm btn-success" onclick="addRealEstateIncomeRow()" style="margin-right: 0.5rem; min-width: 40px; min-height: 40px; background-color: #198754 !important; color: white !important;">+</button>
      <button type="button" class="btn btn-sm btn-danger" onclick="removeRealEstateIncomeRow(${index || table.rows.length - 1})" style="min-width: 40px; min-height: 40px; background-color: #6c757d !important; color: white !important;">🗑️</button>
    </td>
  `;
  
  if (index === null) {
    // Добавляем новый элемент в gameState
    if (!gameState.income.realEstateBusiness) {
      gameState.income.realEstateBusiness = [];
    }
    gameState.income.realEstateBusiness.push({ name: '', monthlyIncome: 0 });
    log('Добавлена новая строка в таблицу доходов от недвижимости/бизнеса');
  }
}

function addStockRow(name = '', quantity = '', price = '', index = null) {
  const table = document.getElementById('stocks-table').getElementsByTagName('tbody')[0];
  const row = table.insertRow();
  
  row.innerHTML = `
    <td><input type="text" class="form-control form-control-sm" value="${name}" placeholder="Название" onchange="updateStock(${index || table.rows.length - 1}, this.value, 'name')"></td>
    <td><input type="number" class="form-control form-control-sm" value="${quantity}" placeholder="0" onchange="updateStock(${index || table.rows.length - 1}, this.value, 'quantity')"></td>
    <td><input type="number" class="form-control form-control-sm" value="${price}" placeholder="0" onchange="updateStock(${index || table.rows.length - 1}, this.value, 'price')"></td>
    <td><span class="form-control-plaintext small">${formatCurrency((parseFloat(quantity) || 0) * (parseFloat(price) || 0))}</span></td>
    <td style="text-align: center; background-color: #f8f9fa; padding: 0.5rem;">
      <button type="button" class="btn btn-sm btn-success" onclick="addStockRow()" style="margin-right: 0.5rem; min-width: 40px; min-height: 40px; background-color: #198754 !important; color: white !important;">+</button>
      <button type="button" class="btn btn-sm btn-danger" onclick="removeStockRow(${index || table.rows.length - 1})" style="min-width: 40px; min-height: 40px; background-color: #6c757d !important; color: white !important;">🗑️</button>
    </td>
  `;
  
  if (index === null) {
    // Добавляем новый элемент в gameState
    if (!gameState.assets.stocks) {
      gameState.assets.stocks = [];
    }
    gameState.assets.stocks.push({ name: '', quantity: 0, price: 0 });
    log('Добавлена новая строка в таблицу акций');
  }
}

function addRealEstateAssetRow(name = '', downPayment = '', price = '', index = null) {
  const table = document.getElementById('real-estate-assets-table').getElementsByTagName('tbody')[0];
  const row = table.insertRow();
  
  const actualIndex = index !== null ? index : table.rows.length - 1;
  
  row.innerHTML = `
    <td><input type="text" class="form-control form-control-sm" value="${name}" placeholder="Название" onchange="updateRealEstateAsset(${actualIndex}, this.value, 'name')"></td>
    <td><input type="number" class="form-control form-control-sm" value="${downPayment}" placeholder="0" onchange="updateRealEstateAsset(${actualIndex}, this.value, 'downPayment')"></td>
    <td><input type="number" class="form-control form-control-sm" value="${price}" placeholder="0" onchange="updateRealEstateAsset(${actualIndex}, this.value, 'price')"></td>
    <td class="text-center" style="background-color: #f8f9fa; padding: 0.5rem;">
      <button type="button" class="btn btn-sm btn-success" onclick="addRealEstateAssetRow()" title="Добавить строку" style="margin-right: 0.5rem; min-width: 40px; min-height: 40px; background-color: #198754 !important; color: white !important;">+</button>
      <button type="button" class="btn btn-sm btn-danger" onclick="removeRealEstateAssetRow(${actualIndex})" title="Удалить строку" style="min-width: 40px; min-height: 40px; background-color: #6c757d !important; color: white !important;">🗑️</button>
    </td>
  `;
  
  if (index === null) {
    // Добавляем новый элемент в gameState
    if (!gameState.assets.realEstateBusiness) {
      gameState.assets.realEstateBusiness = [];
    }
    gameState.assets.realEstateBusiness.push({ name: '', downPayment: 0, price: 0 });
    log('Добавлена новая строка в таблицу активов недвижимости/бизнеса');
  }
  
  log(`Создана строка активов с индексом ${actualIndex}, HTML:`, row.innerHTML);
}

function addRealEstateLiabilityRow(name = '', mortgage = '', index = null) {
  const table = document.getElementById('real-estate-liabilities-table').getElementsByTagName('tbody')[0];
  const row = table.insertRow();
  
  row.innerHTML = `
    <td><input type="text" class="form-control form-control-sm" value="${name}" placeholder="Название" onchange="updateRealEstateLiability(${index || table.rows.length - 1}, this.value, 'name')"></td>
    <td><input type="number" class="form-control form-control-sm" value="${mortgage}" placeholder="0" onchange="updateRealEstateLiability(${index || table.rows.length - 1}, this.value, 'mortgage')"></td>
    <td>
      <button type="button" class="btn btn-sm btn-success me-1" onclick="addRealEstateLiabilityRow()">+</button>
      <button type="button" class="btn btn-sm btn-danger" onclick="removeRealEstateLiabilityRow(${index || table.rows.length - 1})">🗑️</button>
    </td>
  `;
  
  if (index === null) {
    // Добавляем новый элемент в gameState
    if (!gameState.liabilities.realEstateBusiness) {
      gameState.liabilities.realEstateBusiness = [];
    }
    gameState.liabilities.realEstateBusiness.push({ name: '', mortgage: 0 });
    log('Добавлена новая строка в таблицу пассивов недвижимости/бизнеса');
  }
}

// Функции обновления данных в таблицах
function updateRealEstateIncome(index, value, field) {
  if (gameState.income.realEstateBusiness && gameState.income.realEstateBusiness[index]) {
    if (field === 'monthlyIncome') {
      gameState.income.realEstateBusiness[index][field] = parseFloat(value) || 0;
    } else {
      gameState.income.realEstateBusiness[index][field] = value;
    }
    recalculateAll();
  }
}

function updateStock(index, value, field) {
  if (gameState.assets.stocks && gameState.assets.stocks[index]) {
    if (field === 'quantity' || field === 'price') {
      gameState.assets.stocks[index][field] = parseFloat(value) || 0;
    } else {
      gameState.assets.stocks[index][field] = value;
    }
    recalculateAll();
  }
}

function updateRealEstateAsset(index, value, field) {
  // Инициализируем массив, если он не существует
  if (!gameState.assets.realEstateBusiness) {
    gameState.assets.realEstateBusiness = [];
  }
  
  // Создаем элемент, если он не существует
  if (!gameState.assets.realEstateBusiness[index]) {
    gameState.assets.realEstateBusiness[index] = { name: '', downPayment: 0, price: 0 };
  }
  
  // Обновляем значение
  if (field === 'downPayment' || field === 'price') {
    gameState.assets.realEstateBusiness[index][field] = parseFloat(value) || 0;
  } else {
    gameState.assets.realEstateBusiness[index][field] = value;
  }
  
  recalculateAll();
  log(`Обновлен актив недвижимости/бизнеса [${index}].${field}:`, value);
}

function updateRealEstateLiability(index, value, field) {
  if (gameState.liabilities.realEstateBusiness && gameState.liabilities.realEstateBusiness[index]) {
    if (field === 'mortgage') {
      gameState.liabilities.realEstateBusiness[index][field] = parseFloat(value) || 0;
    } else {
      gameState.liabilities.realEstateBusiness[index][field] = value;
    }
    recalculateAll();
  }
}

// Функции удаления строк
function removeRealEstateIncomeRow(index) {
  if (gameState.income.realEstateBusiness && gameState.income.realEstateBusiness.length > index) {
    gameState.income.realEstateBusiness.splice(index, 1);
    loadRealEstateIncomeTable();
    recalculateAll();
    log('Удалена строка из таблицы доходов от недвижимости/бизнеса');
  }
}

function removeStockRow(index) {
  if (gameState.assets.stocks && gameState.assets.stocks.length > index) {
    gameState.assets.stocks.splice(index, 1);
    loadStocksTable();
    recalculateAll();
    log('Удалена строка из таблицы акций');
  }
}

function removeRealEstateAssetRow(index) {
  if (gameState.assets.realEstateBusiness && gameState.assets.realEstateBusiness.length > index) {
    gameState.assets.realEstateBusiness.splice(index, 1);
    loadRealEstateAssetsTable();
    recalculateAll();
    log('Удалена строка из таблицы активов недвижимости/бизнеса');
  }
}

function removeRealEstateLiabilityRow(index) {
  if (gameState.liabilities.realEstateBusiness && gameState.liabilities.realEstateBusiness.length > index) {
    gameState.liabilities.realEstateBusiness.splice(index, 1);
    loadRealEstateLiabilitiesTable();
    recalculateAll();
    log('Удалена строка из таблицы пассивов недвижимости/бизнеса');
  }
}

// Инициализация обработчиков событий
function initEventHandlers() {
  // Обработчик для кнопки сброса игры
  const resetButton = document.getElementById('reset-game-btn');
  if (resetButton) {
    resetButton.addEventListener('click', function() {
      if (confirm('Вы уверены, что хотите сбросить игру? Все данные будут потеряны.')) {
        resetGame();
        location.reload(); // Перезагружаем страницу
      }
    });
  }
  
  // Обработчик для автоматического сохранения и пересчета при изменении данных
  document.addEventListener('input', function(event) {
    // Сохраняем игру при любом изменении в полях ввода
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      // Обновляем соответствующее поле в gameState
      updateGameStateFromInput(event.target);
      
      // Выполняем пересчет
      if (typeof recalculateAll === 'function') {
        recalculateAll();
      }
    }
  });
  
  log('Обработчики событий инициализированы');
}

// Обновление состояния игры из поля ввода

// Валидация ввода данных
function validateInput(inputElement) {
  const id = inputElement.id;
  const value = inputElement.value;
  const type = inputElement.type;
  
  // Очистка от ошибок валидации
  inputElement.classList.remove("is-invalid");
  
  // Валидация числовых полей
  if (type === "number") {
    const numValue = parseFloat(value);
    
    // Проверка на отрицательные значения для денежных полей
    const moneyFields = ["salary", "taxes", "house-mortgage", "education-loan", "car-loan", "credit-cards", "other-expenses", "bank-loan", "children-expenses", "savings", "precious-metals", "house-mortgage-liability", "education-loan-liability", "car-loan-liability", "credit-cards-liability", "bank-loan-liability", "initial-balance"];
    
    if (moneyFields.includes(id) && numValue < 0) {
      showValidationError(inputElement, "Сумма не может быть отрицательной");
      return false;
    }
    
    // Проверка на разумные пределы
    if (numValue > 1000000000) {
      showValidationError(inputElement, "Сумма слишком большая (максимум 1 млрд)");
      return false;
    }
    
    // Проверка количества детей
    if (id === "children-count" && (numValue < 0 || numValue > 3)) {
      showValidationError(inputElement, "Количество детей должно быть от 0 до 3");
      return false;
    }
  }
  
  // Валидация текстовых полей
  if (type === "text" || type === "textarea") {
    if (value.length > 100) {
      showValidationError(inputElement, "Текст слишком длинный (максимум 100 символов)");
      return false;
    }
  }
  
  return true;
}

// Показать ошибку валидации
function showValidationError(inputElement, message) {
  inputElement.classList.add("is-invalid");
  
  // Удаляем предыдущее сообщение об ошибке
  const existingError = inputElement.parentNode.querySelector(".invalid-feedback");
  if (existingError) {
    existingError.remove();
  }
  
  // Создаем новое сообщение об ошибке
  const errorDiv = document.createElement("div");
  errorDiv.className = "invalid-feedback";
  errorDiv.textContent = message;
  inputElement.parentNode.appendChild(errorDiv);
}

function updateGameStateFromInput(inputElement) {
  const id = inputElement.id;

  // Валидация ввода
  if (!validateInput(inputElement)) {
    return; // Не обновляем состояние при ошибке валидации
  }

  const value = inputElement.value;
  
  // Маппинг полей ввода на свойства gameState
  const fieldMapping = {
    'profession': 'profession',
    'dream': 'dream',
    'auditor': 'auditor',
    'salary': 'income.salary',
    'taxes': 'expenses.taxes',
    'house-mortgage': 'expenses.houseMortgage',
    'education-loan': 'expenses.educationLoan',
    'car-loan': 'expenses.carLoan',
    'credit-cards': 'expenses.creditCards',
    'other-expenses': 'expenses.otherExpenses',
    'bank-loan': 'expenses.bankLoan',
    'children-expenses': 'expenses.childrenExpenses',
    'children-count': 'expenses.childrenCount',
    'savings': 'assets.savings',
    'precious-metals': 'assets.preciousMetals',
    'house-mortgage-liability': 'liabilities.houseMortgage',
    'education-loan-liability': 'liabilities.educationLoan',
    'car-loan-liability': 'liabilities.carLoan',
    'credit-cards-liability': 'liabilities.creditCards',
    'bank-loan-liability': 'liabilities.bankLoan',
    'initial-balance': 'cashFlow.initialBalance'
  };
  
  const fieldPath = fieldMapping[id];
  if (fieldPath) {
    const numValue = parseFloat(value) || 0;
    
    if (fieldPath.includes('.')) {
      const [parent, child] = fieldPath.split('.');
      gameState[parent][child] = numValue;
      
      // Специальная логика для банковского кредита
      if (id === 'bank-loan-liability') {
        updateBankLoanExpense(numValue);
      }
      
      // Специальная логика для количества детей
      if (id === 'children-count') {
        updateChildrenExpenses();
      }
      
      // Специальная логика для расходов на одного ребенка
      if (id === 'children-expenses') {
        updateChildrenExpenses();
      }
    } else {
      gameState[fieldPath] = value;
    }
    
    log(`Обновлено поле ${fieldPath}:`, value);
  }
}

// Функция для обновления расходов по банковскому кредиту
function updateBankLoanExpense(bankLoanAmount) {
  // 10% от суммы банковского кредита идет в расходы
  const bankLoanExpense = bankLoanAmount * GAME_CONFIG.BANK_LOAN_RATE;
  gameState.expenses.bankLoan = bankLoanExpense;
  
  // Обновляем поле в UI
  const bankLoanExpenseField = document.getElementById('bank-loan');
  if (bankLoanExpenseField) {
    bankLoanExpenseField.value = bankLoanExpense;
  }
  
  log(`Обновлены расходы по банковскому кредиту: ${bankLoanExpense} ₽ (10% от ${bankLoanAmount} ₽)`);
}

// Функция для обновления расходов на детей
function updateChildrenExpenses() {
  log("Обновление расходов на детей");
  const childrenCount = Math.min(Math.max(parseInt(gameState.expenses.childrenCount) || 0, 0), 3); // Ограничиваем от 0 до 3
  const expensesPerChild = parseFloat(gameState.expenses.childrenExpenses) || 0;
  const totalChildrenExpenses = childrenCount * expensesPerChild;
  
  // Обновляем количество детей в gameState (с ограничением)
  gameState.expenses.childrenCount = childrenCount;
  
  // Обновляем поле количества детей в UI
  const childrenCountField = document.getElementById('children-count');
  if (childrenCountField) {
    childrenCountField.value = childrenCount;
  }
  
  log(`Обновлены расходы на детей: ${expensesPerChild} ₽ × ${childrenCount} = ${totalChildrenExpenses} ₽`);
}

// Функция для обновления состояния игры
function updateGameState() {
  saveGame();
  updateTabVisibility();
  
  // Выполняем пересчет
  if (typeof recalculateAll === 'function') {
    recalculateAll();
  }
}

// Запуск приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  initApp();
});

// Функции для работы с бланком учета денежных средств

// Добавление строки транзакции
function addTransactionRow() {
  const tbody = document.getElementById("transactions-table-body");
  
  const transactionId = Date.now().toString();
  
  const row = document.createElement("tr");
  row.id = `transaction-row-${transactionId}`;
  row.innerHTML = `
    <td>
      <div class="btn-group btn-group-sm" role="group">
        <input type="radio" class="btn-check" name="transaction-type-${transactionId}" id="income-${transactionId}" value="income" autocomplete="off">
        <label class="btn btn-outline-success" for="income-${transactionId}" title="Доход">➕</label>
        
        <input type="radio" class="btn-check" name="transaction-type-${transactionId}" id="expense-${transactionId}" value="expense" autocomplete="off">
        <label class="btn btn-outline-danger" for="expense-${transactionId}" title="Расход">➖</label>
      </div>
    </td>
    <td>
      <input type="number" class="form-control form-control-sm" id="transaction-amount-${transactionId}" placeholder="0" step="0.01">
    </td>
    <td>
      <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeTransactionRow('${transactionId}')" title="Удалить">
        🗑️
      </button>
    </td>
  `;
  
  tbody.appendChild(row);
  
  // Добавляем обработчики событий БЕЗ дебаунсинга
  const amountInput = document.getElementById(`transaction-amount-${transactionId}`);
  const typeInputs = document.querySelectorAll(`input[name="transaction-type-${transactionId}"]`);
  
  amountInput.addEventListener("input", () => updateTransactionFromUI(transactionId));
  typeInputs.forEach(input => {
    input.addEventListener("change", () => updateTransactionFromUI(transactionId));
  });
  
  log("Добавлена строка транзакции", { transactionId });
}

// Удаление строки транзакции
function removeTransactionRow(transactionId) {
  const row = document.getElementById(`transaction-row-${transactionId}`);
  if (row) {
    row.remove();
    removeTransaction(transactionId);
    log('Удалена строка транзакции', { transactionId });
  }
}

// Обновление транзакции
function updateTransactionFromUI(transactionId) {
  const amount = document.getElementById(`transaction-amount-${transactionId}`)?.value;
  const typeInput = document.querySelector(`input[name="transaction-type-${transactionId}"]:checked`);
  const type = typeInput?.value;
  
  if (amount && type) {
    // Проверяем, существует ли транзакция
    let transaction = gameState.cashFlow.transactions.find(t => t.id === transactionId);
    
    if (transaction) {
      // Обновляем существующую транзакцию
      transaction.amount = parseFloat(amount) || 0;
      transaction.type = type;
    } else {
      // Создаем новую транзакцию
      transaction = {
        id: transactionId,
        amount: parseFloat(amount) || 0,
        type: type,
        description: ""
      };
      gameState.cashFlow.transactions.push(transaction);
    }
    
    // Пересчитываем текущий баланс
    calculateCurrentBalance();
    
    // Обновляем отображение баланса
    document.getElementById("current-balance").textContent = formatCurrency(gameState.cashFlow.currentBalance);
    
    // Сохраняем изменения
    // Очищаем пустые бизнесы
    cleanupEmptyBusinesses();
    saveGame();
    
    log("Транзакция обновлена", { transactionId, amount, type, currentBalance: gameState.cashFlow.currentBalance });
  }
}

// Обновление стартового капитала
function updateStartingCapital() {
  const savings = parseFloat(document.getElementById("cashflow-savings")?.value) || 0;
  const monthlyCashFlow = parseFloat(document.getElementById("cashflow-monthly-cashflow")?.value) || 0;
  
  gameState.cashFlow.savings = savings;
  gameState.cashFlow.monthlyCashFlow = monthlyCashFlow;
  
  // Стартовый капитал = сбережения + месячный денежный поток
  gameState.cashFlow.startingCapital = savings + monthlyCashFlow;
  
  // Пересчитываем текущий баланс
  calculateCurrentBalance();
  
  // Обновляем UI
  document.getElementById("starting-capital").textContent = formatCurrency(gameState.cashFlow.startingCapital);
  document.getElementById("current-balance").textContent = formatCurrency(gameState.cashFlow.currentBalance);
  
  saveGame();
  log("Стартовый капитал обновлен", { savings, monthlyCashFlow, startingCapital: gameState.cashFlow.startingCapital, currentBalance: gameState.cashFlow.currentBalance });
}

// Инициализация бланка учета денежных средств
function initCashFlowTab() {
  // Загружаем данные в поля
  document.getElementById("cashflow-savings").value = gameState.cashFlow.savings || "";
  document.getElementById("cashflow-monthly-cashflow").value = gameState.cashFlow.monthlyCashFlow || "";
  
  // Пересчитываем стартовый капитал
  const savings = parseFloat(gameState.cashFlow.savings) || 0;
  const monthlyCashFlow = parseFloat(gameState.cashFlow.monthlyCashFlow) || 0;
  gameState.cashFlow.startingCapital = savings + monthlyCashFlow;
  
  // Пересчитываем текущий баланс
  calculateCurrentBalance();
  
  // Обновляем отображение
  document.getElementById("starting-capital").textContent = formatCurrency(gameState.cashFlow.startingCapital);
  document.getElementById("current-balance").textContent = formatCurrency(gameState.cashFlow.currentBalance);
  
  // Добавляем обработчики событий БЕЗ дебаунсинга для стартового капитала
  document.getElementById("cashflow-savings").addEventListener("input", updateStartingCapital);
  document.getElementById("cashflow-monthly-cashflow").addEventListener("input", updateStartingCapital);
  
  // Загружаем существующие транзакции
  renderTransactions();
  
  log("Вкладка бланка учета денежных средств инициализирована");
}

// Отображение транзакций в таблице
function renderTransactions() {
  const tbody = document.getElementById("transactions-table-body");
  tbody.innerHTML = "";
  
  gameState.cashFlow.transactions.forEach(transaction => {
    const row = document.createElement("tr");
    row.id = `transaction-row-${transaction.id}`;
    row.innerHTML = `
      <td>
        <div class="btn-group btn-group-sm" role="group">
          <input type="radio" class="btn-check" name="transaction-type-${transaction.id}" id="income-${transaction.id}" value="income" autocomplete="off" ${transaction.type === "income" ? "checked" : ""}>
          <label class="btn btn-outline-success" for="income-${transaction.id}" title="Доход">➕</label>
          
          <input type="radio" class="btn-check" name="transaction-type-${transaction.id}" id="expense-${transaction.id}" value="expense" autocomplete="off" ${transaction.type === "expense" ? "checked" : ""}>
          <label class="btn btn-outline-danger" for="expense-${transaction.id}" title="Расход">➖</label>
        </div>
      </td>
      <td>
        <input type="number" class="form-control form-control-sm" id="transaction-amount-${transaction.id}" value="${transaction.amount}" step="0.01">
      </td>
      <td>
        <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeTransactionRow('${transaction.id}')" title="Удалить">
          🗑️
        </button>
      </td>
    `;
    
    tbody.appendChild(row);
    
    // Добавляем обработчики событий БЕЗ дебаунсинга
    const amountInput = document.getElementById(`transaction-amount-${transaction.id}`);
    const typeInputs = document.querySelectorAll(`input[name="transaction-type-${transaction.id}"]`);
    
    amountInput.addEventListener("input", () => updateTransactionFromUI(transaction.id));
    typeInputs.forEach(input => {
      input.addEventListener("change", () => updateTransactionFromUI(transaction.id));
    });
  });
  
  log("Транзакции отображены", { count: gameState.cashFlow.transactions.length });
}

// Делаем функции глобально доступными
window.addTransactionRow = addTransactionRow;
window.removeTransactionRow = removeTransactionRow;
window.updateTransactionFromUI = updateTransactionFromUI;
window.updateStartingCapital = updateStartingCapital;
window.initCashFlowTab = initCashFlowTab;


// Функции для работы с 2 этапом - Скоростная дорожка

// Добавление строки бизнеса
function addBusinessRow() {
  const tbody = document.getElementById("businesses-table-body");
  
  const businessId = Date.now().toString();
  
  const row = document.createElement("tr");
  row.id = `business-row-${businessId}`;
  row.innerHTML = `
    <td>
      <input type="text" class="form-control form-control-sm" id="business-name-${businessId}" placeholder="Название бизнеса">
    </td>
    <td>
      <input type="number" class="form-control form-control-sm" id="business-cashflow-${businessId}" placeholder="0" step="0.01">
    </td>
    <td>
      <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeBusinessRow('${businessId}')" title="Удалить">
        🗑️
      </button>
    </td>
  `;
  
  tbody.appendChild(row);
  
  // Добавляем обработчики событий
  const nameInput = document.getElementById(`business-name-${businessId}`);
  const cashflowInput = document.getElementById(`business-cashflow-${businessId}`);
  
  nameInput.addEventListener("input", () => updateBusinessFromUI(businessId));
  cashflowInput.addEventListener("input", () => updateBusinessFromUI(businessId));
  
  log("Добавлена строка бизнеса", { businessId });
}


// Обновление бизнеса
function updateBusinessFromUI(businessId) {
  const name = document.getElementById(`business-name-${businessId}`)?.value;
  const cashflow = document.getElementById(`business-cashflow-${businessId}`)?.value;
  
  if (name || cashflow) {
    // Проверяем, существует ли бизнес
    let business = gameState.stage2.businesses.find(b => b.id === businessId);
    
    if (business) {
      // Обновляем существующий бизнес
      business.name = name || "";
      business.monthlyCashFlow = parseFloat(cashflow) || 0;
    } else {
      // Создаем новый бизнес
      business = {
        id: businessId,
        name: name || "",
        monthlyCashFlow: parseFloat(cashflow) || 0,
      };
      gameState.stage2.businesses.push(business);
    }
    
    // Пересчитываем текущий доход от бизнесов
    calculateStage2CurrentIncome();
    calculateStage2CurrentIncome();
    
    // Обновляем отображение
    updateStage2Display();
    
    // Проверяем условие победы
    checkWinCondition();
    
    // Сохраняем изменения
    // Очищаем пустые бизнесы
    cleanupEmptyBusinesses();
    saveGame();
    
    log("Бизнес обновлен", { businessId, name, cashflow, income });
  }
}

// Инициализация 2 этапа
function initStage2Tab() {
  // Обновляем отображение целевых сумм
  updateStage2Display();
  
  // Загружаем существующие бизнесы
  renderBusinesses();
  
  log("Вкладка 2 этапа инициализирована");
}

// Обновление отображения 2 этапа
function updateStage2Display() {
  // Пассивный доход при переходе
  document.getElementById("stage2-passive-income").textContent = formatCurrency(gameState.stage2.passiveIncomeAtTransition || 0);
  
  // Поле 1 (×100)
  const field1 = (gameState.stage2.passiveIncomeAtTransition || 0) * GAME_CONFIG.STAGE2_MULTIPLIER;
  document.getElementById("stage2-field1").textContent = formatCurrency(field1);
  
  // Поле 2 (Поле 1 + 50,000)
  const field2 = field1 + GAME_CONFIG.STAGE2_BONUS;
  document.getElementById("stage2-field2").textContent = formatCurrency(field2);
  
  // Текущий доход от бизнесов
  const currentIncome = calculateStage2CurrentIncome();
  document.getElementById("stage2-current-income").textContent = formatCurrency(currentIncome);
  
  log("Отображение 2 этапа обновлено", { field1, field2, currentIncome });
}

// Отображение бизнесов в таблице
function renderBusinesses() {
  const tbody = document.getElementById("businesses-table-body");
  tbody.innerHTML = "";
  
  gameState.stage2.businesses.forEach(business => {
    const row = document.createElement("tr");
    row.id = `business-row-${business.id}`;
    row.innerHTML = `
      <td>
        <input type="text" class="form-control form-control-sm" id="business-name-${business.id}" value="${business.name}">
      </td>
      <td>
        <input type="number" class="form-control form-control-sm" id="business-cashflow-${business.id}" value="${business.monthlyCashFlow}" step="0.01">
      </td>
      <td>
        <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeBusinessRow('${business.id}')" title="Удалить">
          🗑️
        </button>
      </td>
    `;
    
    tbody.appendChild(row);
    
    // Добавляем обработчики событий
    const nameInput = document.getElementById(`business-name-${business.id}`);
    const cashflowInput = document.getElementById(`business-cashflow-${business.id}`);
    
    nameInput.addEventListener("input", () => updateBusinessFromUI(business.id));
    cashflowInput.addEventListener("input", () => updateBusinessFromUI(business.id));
  });
  
  log("Бизнесы отображены", { count: gameState.stage2.businesses.length });
}

// Делаем функции глобально доступными
window.addBusinessRow = addBusinessRow;
window.updateBusinessFromUI = updateBusinessFromUI;
window.initStage2Tab = initStage2Tab;
window.updateStage2Display = updateStage2Display;
window.renderBusinesses = renderBusinesses;




// Автоматическое удаление пустых бизнесов
function cleanupEmptyBusinesses() {
  const initialCount = gameState.stage2.businesses.length;
  
  // Удаляем бизнесы с пустыми названиями и нулевым денежным потоком
  gameState.stage2.businesses = gameState.stage2.businesses.filter(business => {
    const hasName = business.name && business.name.trim() !== '';
    const hasCashFlow = parseFloat(business.monthlyCashFlow) > 0;
    return hasName || hasCashFlow;
  });
  
  const removedCount = initialCount - gameState.stage2.businesses.length;
  
  if (removedCount > 0) {
    log(`Удалено ${removedCount} пустых бизнесов`);
    // Пересчитываем текущий доход
    calculateStage2CurrentIncome();
    // Обновляем отображение
    updateStage2Display();
    // Сохраняем изменения
    // Очищаем пустые бизнесы
    cleanupEmptyBusinesses();
    saveGame();
  }
}

// Делаем функцию глобально доступной
window.cleanupEmptyBusinesses = cleanupEmptyBusinesses;


// Удаление строки бизнеса
function removeBusinessRow(businessId) {
  const row = document.getElementById(`business-row-${businessId}`);
  if (row) {
    row.remove();
    removeBusiness(businessId);
    log('Удалена строка бизнеса', { businessId });
  }
}

// Делаем функцию глобально доступной
window.removeBusinessRow = removeBusinessRow;

// Функции навигации по таблицам для мобильных устройств

// Прокрутка таблицы влево
function scrollTableLeft(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    const scrollStep = 150; // Шаг прокрутки в пикселях
    container.scrollBy({
      left: -scrollStep,
      behavior: 'smooth'
    });
    log(`Прокрутка таблицы ${containerId} влево на ${scrollStep}px`);
  }
}

// Прокрутка таблицы вправо
function scrollTableRight(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    const scrollStep = 150; // Шаг прокрутки в пикселях
    container.scrollBy({
      left: scrollStep,
      behavior: 'smooth'
    });
    log(`Прокрутка таблицы ${containerId} вправо на ${scrollStep}px`);
  }
}

// Прокрутка к началу таблицы
function scrollTableToStart(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.scrollTo({
      left: 0,
      behavior: 'smooth'
    });
    log(`Прокрутка таблицы ${containerId} к началу`);
  }
}

// Прокрутка к концу таблицы
function scrollTableToEnd(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.scrollTo({
      left: container.scrollWidth,
      behavior: 'smooth'
    });
    log(`Прокрутка таблицы ${containerId} к концу`);
  }
}

// Делаем функции глобально доступными
window.scrollTableLeft = scrollTableLeft;
window.scrollTableRight = scrollTableRight;
window.scrollTableToStart = scrollTableToStart;
window.scrollTableToEnd = scrollTableToEnd;

