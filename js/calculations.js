// Функции автоматических расчетов

// Главная функция пересчета всех значений
function recalculateAll() {
  try {
    log('Начинаем пересчет всех значений');
    
    // Рассчитываем основные показатели
    const totalIncome = calculateTotalIncome();
    const totalExpenses = calculateTotalExpenses();
    const monthlyCashFlow = calculateMonthlyCashFlow();
    const passiveIncome = calculatePassiveIncome();
    
    // Обновляем состояние игры
    gameState.calculatedValues = {
      totalIncome: totalIncome,
      totalExpenses: totalExpenses,
      monthlyCashFlow: monthlyCashFlow,
      passiveIncome: passiveIncome
    };
    
    // Проверяем условия перехода на 2 этап
    checkStage2Conditions();
    
    // Обновляем UI
    updateCalculatedFields();
    
    // Сохраняем игру
    saveGame();
    
    log('Пересчет завершен', {
      totalIncome,
      totalExpenses,
      monthlyCashFlow,
      passiveIncome
    });
    
  } catch (error) {
    handleError(error, 'Пересчет значений');
  }
}

// Расчет общих доходов
function calculateTotalIncome() {
  let total = 0;
  
  // Зарплата
  total += gameState.income.salary || 0;
  
  // Доходы от недвижимости/бизнеса
  if (gameState.income.realEstateBusiness) {
    gameState.income.realEstateBusiness.forEach(item => {
      total += item.monthlyIncome || 0;
    });
  }
  
  return total;
}

// Расчет общих расходов
function calculateTotalExpenses() {
  let total = 0;
  
  // Все виды расходов
  total += gameState.expenses.taxes || 0;
  total += gameState.expenses.houseMortgage || 0;
  total += gameState.expenses.educationLoan || 0;
  total += gameState.expenses.carLoan || 0;
  total += gameState.expenses.creditCards || 0;
  total += gameState.expenses.otherExpenses || 0;
  total += gameState.expenses.bankLoan || 0;
  // Расходы на детей рассчитываются как расходы на одного ребенка × количество детей
  const childrenCount = Math.min(Math.max(parseInt(gameState.expenses.childrenCount) || 0, 0), 3);
  const expensesPerChild = parseFloat(gameState.expenses.childrenExpenses) || 0;
  total += childrenCount * expensesPerChild;
  
  return total;
}

// Расчет месячного денежного потока
function calculateMonthlyCashFlow() {
  const totalIncome = calculateTotalIncome();
  const totalExpenses = calculateTotalExpenses();
  return totalIncome - totalExpenses;
}

// Расчет пассивного дохода
function calculatePassiveIncome() {
  let passiveIncome = 0;
  
  // Доходы от недвижимости/бизнеса
  if (gameState.income.realEstateBusiness) {
    gameState.income.realEstateBusiness.forEach(item => {
      passiveIncome += item.monthlyIncome || 0;
    });
  }
  
  // Дивиденды от акций (предполагаем 5% годовых)
  if (gameState.assets.stocks) {
    gameState.assets.stocks.forEach(stock => {
      const totalValue = (stock.quantity || 0) * (stock.price || 0);
      passiveIncome += totalValue * 0.05 / 12; // 5% годовых / 12 месяцев
    });
  }
  
  return passiveIncome;
}

// Проверка условий перехода на 2 этап
function checkStage2Conditions() {
  const totalLiabilities = calculateTotalLiabilities();
  const passiveIncome = calculatePassiveIncome();
  const totalExpenses = calculateTotalExpenses();
  
  // Условие: все пассивы = 0 И пассивный доход > общие расходы
  const canUnlockStage2 = totalLiabilities === 0 && passiveIncome > totalExpenses;
  
  if (canUnlockStage2 && !gameState.stage2Unlocked) {
    gameState.stage2Unlocked = true;
    gameState.currentStage = 2;
    gameState.stage2.passiveIncomeAtTransition = passiveIncome;
    gameState.stage2.targetAmount = (passiveIncome * GAME_CONFIG.STAGE2_MULTIPLIER) + GAME_CONFIG.STAGE2_BONUS;
    
    log('2 этап разблокирован!', {
      passiveIncome,
      targetAmount: gameState.stage2.targetAmount
    });
    
    // Обновляем видимость вкладок
    updateTabVisibility();
    
    // Показываем уведомление
    showNotification('Поздравляем! 2 этап "Скоростная дорожка" разблокирован!');
  }
  
  return canUnlockStage2;
}

// Расчет общих пассивов
function calculateTotalLiabilities() {
  let total = 0;
  
  // Все виды пассивов
  total += gameState.liabilities.houseMortgage || 0;
  total += gameState.liabilities.educationLoan || 0;
  total += gameState.liabilities.carLoan || 0;
  total += gameState.liabilities.creditCards || 0;
  total += gameState.liabilities.bankLoan || 0;
  
  // Пассивы от недвижимости/бизнеса
  if (gameState.liabilities.realEstateBusiness) {
    gameState.liabilities.realEstateBusiness.forEach(item => {
      total += item.mortgage || 0;
    });
  }
  
  return total;
}

// Обновление полей с рассчитанными значениями в UI
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
  updateField("total-income", values.totalIncome);
  updateField("total-expenses", values.totalExpenses);
  updateField("monthly-cash-flow", values.monthlyCashFlow);
  updateField("passive-income", values.passiveIncome);
  updateField("total-liabilities", calculateTotalLiabilities());
  
  // Обновляем цвет поля денежного потока
  const cashFlowElement = document.getElementById("monthly-cash-flow");
  if (cashFlowElement) {
    if (values.monthlyCashFlow > 0) {
      cashFlowElement.classList.add("text-success");
      cashFlowElement.classList.remove("text-danger");
    } else if (values.monthlyCashFlow < 0) {
      cashFlowElement.classList.add("text-danger");
      cashFlowElement.classList.remove("text-success");
    } else {
      cashFlowElement.classList.remove("text-success", "text-danger");
    }
  }
}

// Вспомогательная функция для обновления поля
function updateField(fieldId, value) {
  const element = document.getElementById(fieldId);
  if (element) {
    element.textContent = formatCurrency(value);
  }
}

// Форматирование валюты
function formatCurrency(amount) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Показ уведомления
function showNotification(message) {
  // Простое уведомление через alert (можно заменить на более красивое)
  alert(message);
}

// Функция для добавления дохода от недвижимости/бизнеса
function addRealEstateBusinessIncome(name, monthlyIncome) {
  if (!gameState.income.realEstateBusiness) {
    gameState.income.realEstateBusiness = [];
  }
  
  gameState.income.realEstateBusiness.push({
    name: name,
    monthlyIncome: monthlyIncome || 0
  });
  
  recalculateAll();
}

// Функция для добавления акции
function addStock(name, quantity, price) {
  if (!gameState.assets.stocks) {
    gameState.assets.stocks = [];
  }
  
  gameState.assets.stocks.push({
    name: name,
    quantity: quantity || 0,
    price: price || 0
  });
  
  recalculateAll();
}

// Функция для добавления недвижимости/бизнеса в активы
function addRealEstateBusinessAsset(name, downPayment, price) {
  if (!gameState.assets.realEstateBusiness) {
    gameState.assets.realEstateBusiness = [];
  }
  
  gameState.assets.realEstateBusiness.push({
    name: name,
    downPayment: downPayment || 0,
    price: price || 0
  });
  
  recalculateAll();
}

// Функция для добавления пассива от недвижимости/бизнеса
function addRealEstateBusinessLiability(name, mortgage) {
  if (!gameState.liabilities.realEstateBusiness) {
    gameState.liabilities.realEstateBusiness = [];
  }
  
  gameState.liabilities.realEstateBusiness.push({
    name: name,
    mortgage: mortgage || 0
  });
  
  recalculateAll();
}
