// DOM elements
const addTransactionBtn = document.querySelector('#addTransactionBtn');
const transactionModal = document.querySelector('#transactionModal');
const transactionModalClose = document.querySelector('#transactionModalClose');
const transactionForm = document.querySelector('#transactionForm');
const transactionTypeButtons = document.querySelectorAll('.transaction-type-btn');
const transactionsList = document.querySelector('#transactionsList');
const noTransactions = document.querySelector('#noTransactions');
const accountBalance = document.querySelector('#accountBalance');
const calculatorToggle = document.querySelector('#calculatorToggle');
const calculatorPanel = document.querySelector('#calculatorPanel');
const calculatorInput = document.querySelector('#calculatorInput');
const calculatorButtons = document.querySelectorAll('.calc-btn');
const useCalculatorResult = document.querySelector('#useCalculatorResult');
const transactionAmountInput = document.getElementById('transactionAmount');
const totalIncome = document.querySelector('#totalIncome');
const totalExpenses = document.querySelector('#totalExpenses');
const netSavings = document.querySelector('#netSavings');
const submitTransaction = document.querySelector('#submitTransaction');
const clearTransactionsBtn = document.querySelector('#clearTransactionsBtn');
const welcomeName = document.querySelector('#welcomeName');
const cashflowTotal = document.querySelector('#cashflowTotal');
const cashflowPercentage = document.querySelector('#cashflowPercentage');
const barIncome = document.querySelector('#barIncome');
const barExpenses = document.querySelector('#barExpenses');
const incomeBar = document.querySelector('#incomeBar');
const expenseBar = document.querySelector('#expenseBar');
const editGoalBtn = document.querySelector('#editGoalBtn');
const goalModal = document.querySelector('#goalModal');
const cancelGoalBtn = document.querySelector('#cancelGoalBtn');
const goalForm = document.querySelector('#goalForm');
const goalDisplay = document.querySelector('#goalDisplay');
const noGoalMessage = document.querySelector('#noGoalMessage');
const setGoalBtn = document.querySelector('#setGoalBtn');
const goalNameInput = document.querySelector('#goalNameInput');
const goalAmountInput = document.querySelector('#goalAmountInput');
const goalDateInput = document.querySelector('#goalDateInput');
const goalNameElement = document.querySelector('#goalName');
const goalAmountElement = document.querySelector('#goalAmount');
const goalTotalElement = document.querySelector('#goalTotal');
const goalSavedElement = document.querySelector('#goalSaved');
const goalPercentageElement = document.querySelector('#goalPercentage');
const goalProgressBar = document.querySelector('#goalProgressBar');
const goalEtaElement = document.querySelector('#goalEta');

// App state
let transactions = [];
let currentEditId = null;
let selectedType = 'income';
let userName = localStorage.getItem('userName') || 'Investor';

// Category data
const categoryIcons = {
  // Income categories
  'salary': { icon: 'fas fa-wallet', color: '#4caf50', name: 'Salary & Wages' },
  'investments': { icon: 'fas fa-chart-line', color: '#00bcd4', name: 'Investments' },
  'freelance': { icon: 'fas fa-laptop-code', color: '#3f51b5', name: 'Freelance' },
  'gifts_received': { icon: 'fas fa-gift', color: '#9c27b0', name: 'Gifts Received' },
  'refunds': { icon: 'fas fa-undo', color: '#8bc34a', name: 'Refunds' },
  'other_income': { icon: 'fas fa-coins', color: '#ffc107', name: 'Other Income' },
  
  // Expense categories
  'food': { icon: 'fas fa-utensils', color: '#ff9800', name: 'Food & Dining' },
  'shopping': { icon: 'fas fa-shopping-bag', color: '#9c27b0', name: 'Shopping' },
  'housing': { icon: 'fas fa-home', color: '#03a9f4', name: 'Housing & Rent' },
  'transportation': { icon: 'fas fa-bus', color: '#2196f3', name: 'Transportation' },
  'vehicle': { icon: 'fas fa-car', color: '#009688', name: 'Vehicle' },
  'entertainment': { icon: 'fas fa-film', color: '#e91e63', name: 'Entertainment' },
  'communication': { icon: 'fas fa-mobile-alt', color: '#673ab7', name: 'Communication' },
  'technology': { icon: 'fas fa-laptop', color: '#4caf50', name: 'Technology' },
  'healthcare': { icon: 'fas fa-heartbeat', color: '#f44336', name: 'Healthcare' },
  'education': { icon: 'fas fa-graduation-cap', color: '#2196f3', name: 'Education' },
  'travel': { icon: 'fas fa-plane', color: '#ffc107', name: 'Travel' },
  'gifts': { icon: 'fas fa-gift', color: '#8bc34a', name: 'Gifts & Donations' },
  'others': { icon: 'fas fa-ellipsis-h', color: '#9e9e9e', name: 'Others' }
};

// Initialize the app
function init() {
  // Set welcome name
  if (welcomeName) welcomeName.textContent = userName;
  
  // Load data from localStorage
  loadTransactions();
  
  // Update UI
  calculateTotalBalance();
  renderTransactions();
  updateCashFlowBars();
  initializeGoalDisplay();
  
  // Setup event listeners
  setupEventListeners();
}

// Load transactions from localStorage
function loadTransactions() {
  const savedTransactions = localStorage.getItem('transactions');
  if (savedTransactions) {
    transactions = JSON.parse(savedTransactions);
  }
}

// Save transactions to localStorage
function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
}

// Calculate total balance
function calculateTotalBalance() {
  let totalBalanceAmount = 0;
  let totalIncomeAmount = 0;
  let totalExpensesAmount = 0;

  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      totalBalanceAmount += transaction.amount;
      totalIncomeAmount += transaction.amount;
    } else {
      totalBalanceAmount -= transaction.amount;
      totalExpensesAmount += transaction.amount;
    }
  });

  // Update balance display
  if (accountBalance) {
    accountBalance.textContent = formatCurrency(totalBalanceAmount);
  }
  
  // Update statistics
  updateStatistics(totalIncomeAmount, totalExpensesAmount);
  
  return totalBalanceAmount;
}

// Update statistics for income, expenses, and savings
function updateStatistics(totalIncomeAmount, totalExpensesAmount) {
  const netSavingsAmount = totalIncomeAmount - totalExpensesAmount;
  
  // Update with proper formatting
  if (totalIncome) totalIncome.textContent = formatCurrency(totalIncomeAmount);
  if (totalExpenses) totalExpenses.textContent = formatCurrency(totalExpensesAmount);
  if (netSavings) netSavings.textContent = formatCurrency(netSavingsAmount);
}

// Update cash flow bars
function updateCashFlowBars() {
  if (!incomeBar || !expenseBar) return;
  
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Update amount labels
  if (barIncome) barIncome.textContent = formatCurrency(income);
  if (barExpenses) barExpenses.textContent = formatCurrency(expenses);
  
  // Calculate bar widths
  const maxValue = Math.max(income, expenses);
  let incomeWidth = 0;
  let expenseWidth = 0;
  
  if (maxValue > 0) {
    incomeWidth = (income / maxValue) * 100;
    expenseWidth = (expenses / maxValue) * 100;
  }
  
  // Update bar widths
  incomeBar.style.width = `${incomeWidth}%`;
  expenseBar.style.width = `${expenseWidth}%`;
}

// Render transactions
function renderTransactions() {
  if (!transactionsList) return;
  
  // Clear transactions list
  transactionsList.innerHTML = '';
  
  // Handle empty state
  if (transactions.length === 0) {
    if (noTransactions) {
      noTransactions.style.display = 'flex';
      transactionsList.style.display = 'none';
    }
    return;
  }
  
  // Show transactions
  if (noTransactions) {
    noTransactions.style.display = 'none';
    transactionsList.style.display = 'block';
  }
  
  // Sort transactions (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Create transaction items
  sortedTransactions.forEach(transaction => {
    const { icon, color } = getCategoryIcon(transaction.category, transaction.type);
    const transactionItem = document.createElement('div');
    
    transactionItem.className = 'transaction-item';
    transactionItem.dataset.id = transaction.id;
    
    transactionItem.innerHTML = `
      <div class="transaction-icon ${transaction.type === 'income' ? 'income-icon' : 'expense-icon'}">
        <i class="${icon}" style="color: ${color}"></i>
      </div>
      <div class="transaction-details">
        <h3>${transaction.name}</h3>
        <div class="transaction-date">${formatDate(transaction.date)}</div>
        <div class="transaction-category">${getCategoryDisplayName(transaction.category)}</div>
      </div>
      <div class="transaction-amount ${transaction.type === 'income' ? 'income-amount' : 'expense-amount'}">
        ${formatCurrency(transaction.amount)}
      </div>
      <div class="transaction-actions">
        <button class="transaction-edit" data-id="${transaction.id}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="transaction-delete" data-id="${transaction.id}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    
    transactionsList.appendChild(transactionItem);
  });
  
  // Add event listeners for edit/delete
  document.querySelectorAll('.transaction-edit').forEach(button => {
    button.addEventListener('click', editTransaction);
  });
  
  document.querySelectorAll('.transaction-delete').forEach(button => {
    button.addEventListener('click', deleteTransaction);
  });
}

// Edit transaction
function editTransaction(event) {
  const id = event.currentTarget.getAttribute('data-id');
  const transaction = transactions.find(t => t.id === id);
  
  if (transaction) {
    // Set form values
    document.querySelector('#transactionName').value = transaction.name;
    document.querySelector('#transactionAmount').value = transaction.amount;
    document.querySelector('#transactionCategory').value = transaction.category;
    
    // Set transaction type
    selectedType = transaction.type;
    transactionTypeButtons.forEach(button => {
      button.classList.toggle('active', button.id === `${transaction.type}Btn`);
    });
    
    // Set the current edit ID
    currentEditId = id;
    
    // Update submit button text
    submitTransaction.textContent = 'Update Transaction';
    
    // Show the modal
    transactionModal.classList.add('active');
  }
}

// Delete transaction
function deleteTransaction(event) {
  const id = event.currentTarget.getAttribute('data-id');
  const transaction = transactions.find(t => t.id === id);
  
  if (confirm(`Are you sure you want to delete transaction "${transaction.name}"?`)) {
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions();
    calculateTotalBalance();
    renderTransactions();
    updateCashFlowBars();
    updateGoalProgress();
  }
}

// Handle transaction form submission
function handleTransactionSubmit(event) {
  event.preventDefault();
  
  // Get form values
  const name = document.querySelector('#transactionName').value.trim();
  const amount = parseFloat(document.querySelector('#transactionAmount').value);
  const category = document.querySelector('#transactionCategory').value;
  
  // Validate form
  if (!name || !amount || amount <= 0 || !category) {
    alert('Please fill all fields correctly');
    return;
  }
  
  // Create transaction object
  const now = new Date();
  
  if (currentEditId) {
    // Update existing transaction
    const index = transactions.findIndex(t => t.id === currentEditId);
    if (index !== -1) {
      transactions[index] = {
        ...transactions[index],
        name,
        amount,
        category,
        type: selectedType,
        updatedAt: now.toISOString()
      };
    }
    currentEditId = null;
  } else {
    // Add new transaction
    const newTransaction = {
      id: Date.now().toString(),
      name,
      amount,
      category,
      type: selectedType,
      date: now.toISOString()
    };
    
    transactions.push(newTransaction);
  }
  
  // Save to localStorage
  saveTransactions();
  
  // Close modal and reset form
  transactionModal.classList.remove('active');
  transactionForm.reset();
  submitTransaction.textContent = 'Add Transaction';
  
  // Update UI
  calculateTotalBalance();
  renderTransactions();
  updateCashFlowBars();
  updateGoalProgress();
}

// Handle calculator input
function handleCalculatorInput(event) {
  const button = event.currentTarget;
  const value = button.getAttribute('data-value');
  
  if (value === 'clear') {
    calculatorInput.value = '0';
  } else if (value === 'delete') {
    calculatorInput.value = calculatorInput.value.slice(0, -1) || '0';
  } else if (value === 'equals') {
    try {
      const result = eval(calculatorInput.value.replace(/×/g, '*').replace(/÷/g, '/'));
      calculatorInput.value = !isNaN(result) && isFinite(result) ? result : 'Error';
    } catch (e) {
      calculatorInput.value = 'Error';
    }
  } else {
    if (calculatorInput.value === '0' || calculatorInput.value === 'Error') {
      calculatorInput.value = value;
    } else {
      calculatorInput.value += value;
    }
  }
}

// Set up event listeners
function setupEventListeners() {
  // Transaction modal
  if (addTransactionBtn) {
    addTransactionBtn.addEventListener('click', () => {
      // Reset form for new transaction
      currentEditId = null;
      transactionForm.reset();
      submitTransaction.textContent = 'Add Transaction';
      
      // Default to income type
      selectedType = 'income';
      transactionTypeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.id === 'incomeBtn');
      });
      
      transactionModal.classList.add('active');
    });
  }
  
  if (transactionModalClose) {
    transactionModalClose.addEventListener('click', () => {
      transactionModal.classList.remove('active');
    });
  }
  
  // Transaction type buttons
  transactionTypeButtons.forEach(button => {
    button.addEventListener('click', () => {
      transactionTypeButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      selectedType = button.id === 'incomeBtn' ? 'income' : 'expense';
    });
  });
  
  // Submit transaction
  if (transactionForm) {
    transactionForm.addEventListener('submit', handleTransactionSubmit);
  }
  
  // Clear transactions
  if (clearTransactionsBtn) {
    clearTransactionsBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all transactions? This action cannot be undone.')) {
        transactions = [];
        saveTransactions();
        calculateTotalBalance();
        renderTransactions();
        updateCashFlowBars();
        updateGoalProgress();
      }
    });
  }
  
  // Calculator toggle
  if (calculatorToggle) {
    calculatorToggle.addEventListener('click', () => {
      calculatorPanel.classList.toggle('active');
    });
  }
  
  // Calculator buttons
  calculatorButtons.forEach(button => {
    button.addEventListener('click', handleCalculatorInput);
  });
  
  // Use calculator result
  if (useCalculatorResult) {
    useCalculatorResult.addEventListener('click', () => {
      if (calculatorInput.value !== 'Error') {
        transactionAmountInput.value = calculatorInput.value;
        calculatorPanel.classList.remove('active');
      }
    });
  }
  
  // Close modals when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === transactionModal) {
      transactionModal.classList.remove('active');
    }
    if (event.target === goalModal) {
      goalModal.style.display = 'none';
    }
    if (calculatorPanel && calculatorPanel.classList.contains('active') && 
        !calculatorPanel.contains(event.target) && 
        !calculatorToggle.contains(event.target)) {
      calculatorPanel.classList.remove('active');
    }
  });
  
  // Goal functionality
  if (setGoalBtn) {
    setGoalBtn.addEventListener('click', () => {
      goalNameInput.value = '';
      goalAmountInput.value = '';
      goalDateInput.value = '';
      goalModal.style.display = 'block';
    });
  }
  
  if (editGoalBtn) {
    editGoalBtn.addEventListener('click', () => {
      const goal = JSON.parse(localStorage.getItem('goal'));
      if (goal) {
        goalNameInput.value = goal.name;
        goalAmountInput.value = goal.amount;
        if (goal.date) goalDateInput.value = goal.date;
      }
      goalModal.style.display = 'block';
    });
  }
  
  if (cancelGoalBtn) {
    cancelGoalBtn.addEventListener('click', () => {
      goalModal.style.display = 'none';
    });
  }
  
  if (goalForm) {
    goalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = goalNameInput.value.trim();
      const amount = parseFloat(goalAmountInput.value);
      const date = goalDateInput.value || null;
      
      if (name && amount > 0) {
        const goal = { name, amount, date };
        localStorage.setItem('goal', JSON.stringify(goal));
        initializeGoalDisplay();
        goalModal.style.display = 'none';
      }
    });
  }
}

// Initialize goal display
function initializeGoalDisplay() {
  const goal = JSON.parse(localStorage.getItem('goal'));
  
  if (goal) {
    noGoalMessage.style.display = 'none';
    goalDisplay.style.display = 'block';
    
    goalNameElement.textContent = goal.name;
    goalAmountElement.textContent = formatCurrency(goal.amount);
    goalTotalElement.textContent = formatCurrency(goal.amount);
    
    updateGoalProgress();
  } else {
    noGoalMessage.style.display = 'block';
    goalDisplay.style.display = 'none';
  }
}

// Calculate and update goal progress
function updateGoalProgress() {
  const goal = JSON.parse(localStorage.getItem('goal'));
  if (!goal) return;
  
  // Calculate total savings (use only income transactions as savings)
  let totalSavings = 0;
  
  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      totalSavings += parseFloat(transaction.amount);
    }
  });
  
  // Calculate percentage saved
  const savedAmount = Math.min(totalSavings, goal.amount); // Can't save more than the goal
  const percentage = Math.floor((savedAmount / goal.amount) * 100);
  
  // Update UI
  goalSavedElement.textContent = formatCurrency(savedAmount);
  goalPercentageElement.textContent = `${percentage}%`;
  goalProgressBar.style.width = `${percentage}%`;
  
  // Calculate ETA if target date exists
  if (goal.date) {
    const targetDate = new Date(goal.date);
    const today = new Date();
    const daysLeft = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft > 0) {
      goalEtaElement.textContent = `${daysLeft} days left`;
    } else {
      goalEtaElement.textContent = 'Goal date passed';
    }
  } else if (percentage < 100) {
    // Estimate completion based on average savings rate
    const avgSavingsPerDay = calculateAverageSavingsRate();
    if (avgSavingsPerDay > 0) {
      const amountLeft = goal.amount - savedAmount;
      const daysToComplete = Math.ceil(amountLeft / avgSavingsPerDay);
      
      if (daysToComplete > 0) {
        const completionDate = new Date();
        completionDate.setDate(completionDate.getDate() + daysToComplete);
        
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        goalEtaElement.textContent = completionDate.toLocaleDateString(undefined, options);
      } else {
        goalEtaElement.textContent = 'Today';
      }
    } else {
      goalEtaElement.textContent = 'No savings yet';
    }
  } else {
    goalEtaElement.textContent = 'Goal completed!';
  }
}

// Calculate average savings rate (per day)
function calculateAverageSavingsRate() {
  if (transactions.length === 0) return 0;
  
  let totalSavings = 0;
  let oldestTransactionDate = new Date();
  
  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      totalSavings += parseFloat(transaction.amount);
      
      const transactionDate = new Date(transaction.date);
      if (transactionDate < oldestTransactionDate) {
        oldestTransactionDate = transactionDate;
      }
    }
  });
  
  const today = new Date();
  const daysSinceFirstTransaction = Math.max(1, Math.ceil((today - oldestTransactionDate) / (1000 * 60 * 60 * 24)));
  
  return totalSavings / daysSinceFirstTransaction;
}

// Format date to a friendly string
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Get category display name
function getCategoryDisplayName(category) {
  const categoryData = categoryIcons[category];
  return categoryData ? categoryData.name : category.replace(/_/g, ' ');
}

// Get category icon
function getCategoryIcon(category, type = 'expense') {
  const categoryData = categoryIcons[category];
  const defaultIcon = type === 'income' 
    ? { icon: 'fas fa-money-bill-wave', color: '#4caf50' }
    : { icon: 'fas fa-shopping-cart', color: '#f44336' };
  
  return categoryData || defaultIcon;
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 