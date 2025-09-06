// Конфигурация игры
const GAME_CONFIG = {
  BANK_LOAN_RATE: 0.10,        // 10% от суммы кредита
  STAGE2_MULTIPLIER: 100,      // Пассивный доход × 100
  STAGE2_BONUS: 50000,         // +50,000 к целевой сумме
  STORAGE_KEY: 'rat_race_game' // Ключ для LocalStorage
};

// Отладочный режим
const DEBUG = true;

// Модель данных игры
let gameState = {
  // Информационные поля
  profession: "",
  dream: "",
  auditor: "",
  
  // Доходы
  income: {
    salary: 0,
    realEstateBusiness: []
  },
  
  // Расходы
  expenses: {
    taxes: 0,
    houseMortgage: 0,
    educationLoan: 0,
    carLoan: 0,
    creditCards: 0,
    otherExpenses: 0,
    bankLoan: 0,
    childrenExpenses: 0,
      childrenCount: 0,
    childrenCount: 0
  },
  
  // Активы
  assets: {
    savings: 0,
    preciousMetals: 0,
    stocks: [], // [{name, quantity, price}]
    realEstateBusiness: [] // [{name, downPayment, price}]
  },
  
  // Пассивы
  liabilities: {
    houseMortgage: 0,
    educationLoan: 0,
    carLoan: 0,
    creditCards: 0,
    bankLoan: 0,
    realEstateBusiness: [] // [{name, mortgage}]
  },
  
  // Бланк учета денежных средств
  cashFlow: {
    initialBalance: 0,
    transactions: [] // [{date, description, amount, type}]
  },
  
  // 2 этап
  stage2: {
    passiveIncomeAtTransition: 0,
    targetAmount: 0,
    businesses: [] // [{name, monthlyCashFlow, income}]
  },
  
  // Состояние игры
  currentStage: 1,
  stage2Unlocked: false
};

// Функция логирования
function log(message, data = null) {
  if (DEBUG) {
    console.log(`[Rat Race] ${message}`, data);
  }
}

// Функция обработки ошибок
function handleError(error, context) {
  if (DEBUG) {
    console.error(`[Rat Race Error] ${context}:`, error);
  }
  alert(`Произошла ошибка: ${context}`);
}

// Сохранение игры в LocalStorage
function saveGame() {
  try {
    const gameData = JSON.stringify(gameState);
    localStorage.setItem(GAME_CONFIG.STORAGE_KEY, gameData);
    log('Игра сохранена', { size: gameData.length });
  } catch (error) {
    handleError(error, 'Сохранение игры');
  }
}

// Загрузка игры из LocalStorage
function loadGame() {
  try {
    const savedData = localStorage.getItem(GAME_CONFIG.STORAGE_KEY);
    if (savedData) {
      const loadedState = JSON.parse(savedData);
      gameState = { ...gameState, ...loadedState };
      log('Игра загружена', { currentStage: gameState.currentStage });
      return true;
    } else {
      log('Сохраненная игра не найдена, используется начальное состояние');
      return false;
    }
  } catch (error) {
    handleError(error, 'Загрузка игры');
    return false;
  }
}

// Сброс игры к начальному состоянию
function resetGame() {
  try {
    gameState = {
      profession: "",
      dream: "",
      auditor: "",
      income: {
        salary: 0,
        realEstateBusiness: []
      },
      expenses: {
        taxes: 0,
        houseMortgage: 0,
        educationLoan: 0,
        carLoan: 0,
        creditCards: 0,
        otherExpenses: 0,
        bankLoan: 0,
        childrenExpenses: 0,
      childrenCount: 0,
    childrenCount: 0
      },
      assets: {
        savings: 0,
        preciousMetals: 0,
        stocks: [],
        realEstateBusiness: []
      },
      liabilities: {
        houseMortgage: 0,
        educationLoan: 0,
        carLoan: 0,
        creditCards: 0,
        bankLoan: 0,
        realEstateBusiness: []
      },
      cashFlow: {
        initialBalance: 0,
        transactions: []
      },
      stage2: {
        passiveIncomeAtTransition: 0,
        targetAmount: 0,
        businesses: []
      },
      currentStage: 1,
      stage2Unlocked: false
    };
    saveGame();
    log('Игра сброшена к начальному состоянию');
  } catch (error) {
    handleError(error, 'Сброс игры');
  }
}

// Функции для работы с бланком учета денежных средств

// Расчет стартового капитала
function calculateStartingCapital() {
  const savings = parseFloat(gameState.cashFlow.savings) || 0;
  const monthlyCashFlow = parseFloat(gameState.cashFlow.monthlyCashFlow) || 0;
  gameState.cashFlow.startingCapital = savings + monthlyCashFlow;
  log("Стартовый капитал рассчитан", { savings, monthlyCashFlow, startingCapital: gameState.cashFlow.startingCapital });
  return gameState.cashFlow.startingCapital;
}

// Расчет текущего баланса
function calculateCurrentBalance() {
  const startingCapital = gameState.cashFlow.startingCapital || 0;
  let transactionSum = 0;
  
  gameState.cashFlow.transactions.forEach(transaction => {
    if (transaction.type === "income") {
      transactionSum += parseFloat(transaction.amount) || 0;
    } else if (transaction.type === "expense") {
      transactionSum -= parseFloat(transaction.amount) || 0;
    }
  });
  
  gameState.cashFlow.currentBalance = startingCapital + transactionSum;
  log("Текущий баланс рассчитан", { startingCapital, transactionSum, currentBalance: gameState.cashFlow.currentBalance });
  return gameState.cashFlow.currentBalance;
}

// Добавление транзакции
function addTransaction(amount, type, description) {
  const transaction = {
    id: Date.now().toString(),
    amount: parseFloat(amount) || 0,
    type: type, // "income" или "expense"
    description: description || ""
  };
  
  gameState.cashFlow.transactions.push(transaction);
  calculateCurrentBalance();
  saveGame();
  log("Транзакция добавлена", transaction);
  return transaction;
}

// Удаление транзакции
function removeTransaction(transactionId) {
  const index = gameState.cashFlow.transactions.findIndex(t => t.id === transactionId);
  if (index !== -1) {
    const removed = gameState.cashFlow.transactions.splice(index, 1)[0];
    calculateCurrentBalance();
    saveGame();
    log('Транзакция удалена', removed);
    return removed;
  }
  return null;
}

// Обновление транзакции
function updateTransaction(transactionId, amount, type, description) {
  const transaction = gameState.cashFlow.transactions.find(t => t.id === transactionId);
  if (transaction) {
    transaction.amount = parseFloat(amount) || 0;
    transaction.type = type;
    transaction.description = description || "";
    calculateCurrentBalance();
    saveGame();
    log("Транзакция обновлена", transaction);
    return transaction;
  } else {
    // Если транзакция не найдена, создаем новую
    return addTransaction(amount, type, description);
  }
}


// Функции для работы с 2 этапом

// Расчет текущего дохода от бизнесов (сумма месячных денежных потоков)
function calculateStage2CurrentIncome() {
  let totalIncome = 0;
  
  gameState.stage2.businesses.forEach(business => {
    totalIncome += parseFloat(business.monthlyCashFlow) || 0;
  });
  
  gameState.stage2.currentIncome = totalIncome;
  log("Текущий доход от бизнесов рассчитан (сумма денежных потоков)", { totalIncome });
  return totalIncome;
}

// Добавление бизнеса
function addBusiness(name, monthlyCashFlow, income) {
  const business = {
    id: Date.now().toString(),
    name: name || "",
    monthlyCashFlow: parseFloat(monthlyCashFlow) || 0,
    income: parseFloat(income) || 0
  };
  
  gameState.stage2.businesses.push(business);
  calculateStage2CurrentIncome();
  saveGame();
  log("Бизнес добавлен", business);
  return business;
}

// Удаление бизнеса
function removeBusiness(businessId) {
  const index = gameState.stage2.businesses.findIndex(b => b.id === businessId);
  if (index !== -1) {
    const removed = gameState.stage2.businesses.splice(index, 1)[0];
    calculateStage2CurrentIncome();
    saveGame();
    log('Бизнес удален', removed);
    return removed;
  }
  return null;
}

// Обновление бизнеса
function updateBusiness(businessId, name, monthlyCashFlow, income) {
  const business = gameState.stage2.businesses.find(b => b.id === businessId);
  if (business) {
    business.name = name || "";
    business.monthlyCashFlow = parseFloat(monthlyCashFlow) || 0;
    business.income = parseFloat(income) || 0;
    calculateStage2CurrentIncome();
    saveGame();
    log("Бизнес обновлен", business);
    return business;
  } else {
    // Если бизнес не найден, создаем новый
    return addBusiness(name, monthlyCashFlow, income);
  }
}

// Проверка условия победы
function checkWinCondition() {
  if (!gameState.stage2Unlocked) {
    return false;
  }
  
  const currentIncome = calculateStage2CurrentIncome();
  const targetAmount = gameState.stage2.targetAmount || 0;
  
  if (currentIncome >= targetAmount) {
    gameState.gameWon = true;
    showWinNotification();
    log("Игра выиграна!", { currentIncome, targetAmount });
    return true;
  }
  
  return false;
}

// Показ уведомления о победе
function showWinNotification() {
  const winStatus = document.getElementById("win-status");
  if (winStatus) {
    winStatus.style.display = "block";
    winStatus.classList.remove("alert-info");
    winStatus.classList.add("alert-success");
  }
  
  // Показываем уведомление
  showNotification("🎉 Поздравляем! Вы выиграли игру 'Крысиные бега'!");
}



