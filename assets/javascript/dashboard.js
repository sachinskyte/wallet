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
const transactionAmount = document.querySelector('#transactionAmount');
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
const goalModalClose = document.querySelector('#goalModalClose');
const goalForm = document.querySelector('#goalForm');
const submitGoal = document.querySelector('#submitGoal');
const deleteGoal = document.querySelector('#deleteGoal');
const goalDisplay = document.querySelector('#goalDisplay');
const noGoalMessage = document.querySelector('#noGoalMessage');
const setGoalBtn = document.querySelector('#setGoalBtn');

// App state
let transactions = [];
let currentEditId = null;
let selectedType = 'income';
let userName = localStorage.getItem('userName') || 'Investor';
let savingsGoal = null;

// Initialize the app
function init() {
  // Set welcome name
  welcomeName.textContent = userName;
  
  // Load data from localStorage
  loadTransactions();
  loadSavingsGoal();
  
  // Update UI
  calculateTotalBalance();
  renderTransactions();
  updateCashFlowBars();
  updateSavingsGoal();
  
  // Setup event listeners
  setupEventListeners();
  
  // Add fade-in animation to dashboard elements
  animateDashboardLoad();
}

// Load transactions from localStorage
function loadTransactions() {
  const savedTransactions = localStorage.getItem('transactions');
  if (savedTransactions) {
    transactions = JSON.parse(savedTransactions);
  }
}

// Load savings goal from localStorage
function loadSavingsGoal() {
  const savedGoal = localStorage.getItem('savingsGoal');
  if (savedGoal) {
    savingsGoal = JSON.parse(savedGoal);
  }
  
  // Show appropriate goal UI
  if (savingsGoal) {
    goalDisplay.style.display = 'block';
    noGoalMessage.style.display = 'none';
  } else {
    goalDisplay.style.display = 'none';
    noGoalMessage.style.display = 'block';
  }
}

// Save transactions to localStorage
function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Save savings goal to localStorage
function saveSavingsGoal() {
  localStorage.setItem('savingsGoal', JSON.stringify(savingsGoal));
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

  // Update balance display with animation
  animateCounter(accountBalance, totalBalanceAmount);
  
  // Update statistics
  updateStatistics(totalIncomeAmount, totalExpensesAmount);
  
  return totalBalanceAmount;
}

// Animate number counter
function animateCounter(element, targetValue) {
  const duration = 1000; // ms
  const stepTime = 20; // ms
  const startValue = parseFloat(element.textContent.replace(/[^0-9.-]+/g, "")) || 0;
  const difference = targetValue - startValue;
  const steps = Math.floor(duration / stepTime);
  const increment = difference / steps;
  
  let currentValue = startValue;
  let step = 0;
  
  const timer = setInterval(() => {
    step++;
    currentValue += increment;
    element.textContent = formatCurrency(currentValue);
    
    if (step >= steps) {
      clearInterval(timer);
      element.textContent = formatCurrency(targetValue);
    }
  }, stepTime);
}

// Update statistics for income, expenses, and savings
function updateStatistics(totalIncomeAmount, totalExpensesAmount) {
  const netSavingsAmount = totalIncomeAmount - totalExpensesAmount;
  
  // Update with animation
  animateCounter(totalIncome, totalIncomeAmount);
  animateCounter(totalExpenses, totalExpensesAmount);
  animateCounter(netSavings, netSavingsAmount);
  
  // Update cash flow section
  updateCashFlowSection(totalIncomeAmount, totalExpensesAmount);
}

// Update cash flow section
function updateCashFlowSection(income, expenses) {
  const cashFlow = income - expenses;
  const previousCashFlow = 0; // For demo, this would be calculated from previous period
  
  let percentage = 0;
  if (previousCashFlow !== 0) {
    percentage = ((cashFlow - previousCashFlow) / Math.abs(previousCashFlow)) * 100;
  } else if (cashFlow !== 0) {
    percentage = cashFlow > 0 ? 100 : -100;
  }
  
  cashflowTotal.textContent = formatCurrency(cashFlow);
  cashflowPercentage.textContent = `${percentage > 0 ? '+' : ''}${Math.round(percentage)}%`;
  
  // Set appropriate color for percentage
  if (percentage > 0) {
    cashflowPercentage.style.color = 'var(--success)';
  } else if (percentage < 0) {
    cashflowPercentage.style.color = 'var(--error)';
  } else {
    cashflowPercentage.style.color = 'var(--gray-600)';
  }
}

// Update cash flow bars
function updateCashFlowBars() {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Update amount labels
  barIncome.textContent = formatCurrency(income);
  barExpenses.textContent = formatCurrency(expenses);
  
  // Calculate bar widths
  const maxValue = Math.max(income, expenses);
  let incomeWidth = 0;
  let expenseWidth = 0;
  
  if (maxValue > 0) {
    incomeWidth = (income / maxValue) * 100;
    expenseWidth = (expenses / maxValue) * 100;
  }
  
  // Animate bar widths
  setTimeout(() => {
    incomeBar.style.width = `${incomeWidth}%`;
    expenseBar.style.width = `${expenseWidth}%`;
  }, 300);
}

// Update savings goal
function updateSavingsGoal() {
  if (!savingsGoal) return;
  
  const { name, amount } = savingsGoal;
  const totalSaved = calculateSavedAmount();
  const percentage = Math.min(100, Math.round((totalSaved / amount) * 100));
  
  // Update goal display
  document.getElementById('goalAmount').textContent = formatCurrency(amount);
  document.getElementById('goalName').textContent = name;
  document.getElementById('goalSaved').textContent = formatCurrency(totalSaved);
  document.getElementById('goalTotal').textContent = formatCurrency(amount);
  document.getElementById('goalPercentage').textContent = `${percentage}%`;
  
  // Animate progress bar
  setTimeout(() => {
    document.getElementById('goalProgressBar').style.width = `${percentage}%`;
  }, 300);
  
  // Estimate completion date
  updateGoalETA(totalSaved, amount);
}

// Calculate saved amount for goal
function calculateSavedAmount() {
  // For this demo, we'll use net savings (income - expenses) as the saved amount
  const totalIncomeAmount = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpensesAmount = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return Math.max(0, totalIncomeAmount - totalExpensesAmount);
}

// Update goal ETA
function updateGoalETA(saved, target) {
  const etaElement = document.getElementById('goalEta');
  
  if (saved >= target) {
    etaElement.textContent = 'Goal reached!';
    etaElement.style.color = 'var(--success)';
    return;
  }
  
  // Calculate average monthly savings (for simplicity, we'll use a fixed amount)
  const averageMonthlySavings = 5000; // Replace with calculation based on actual data
  
  if (averageMonthlySavings <= 0) {
    etaElement.textContent = 'Unable to calculate';
    return;
  }
  
  const remaining = target - saved;
  const monthsRemaining = Math.ceil(remaining / averageMonthlySavings);
  
  // Calculate future date
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setMonth(today.getMonth() + monthsRemaining);
  
  const options = { year: 'numeric', month: 'long' };
  etaElement.textContent = futureDate.toLocaleDateString('en-US', options);
}

// Render transactions
function renderTransactions() {
  if (!transactionsList) return;
  
  // Clear the transactions list
  transactionsList.innerHTML = '';
  
  if (transactions.length === 0) {
    // Show empty state
    if (noTransactions) {
      noTransactions.style.display = 'block';
    }
    return;
  }
  
  // Hide empty state
  if (noTransactions) {
    noTransactions.style.display = 'none';
  }
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp);
  });
  
  // Add each transaction to the list
  sortedTransactions.slice(0, 10).forEach((transaction, index) => {
    const transactionItem = document.createElement('div');
    transactionItem.classList.add('transaction-item');
    transactionItem.setAttribute('data-id', transaction.id);
    
    // Format date
    const dateObj = new Date(transaction.date || transaction.timestamp);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    transactionItem.innerHTML = `
      <div class="transaction-left">
        <div class="transaction-icon ${transaction.type}-icon">
          <i class="fas ${transaction.type === 'income' ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
        </div>
        <div class="transaction-details">
          <h3>${transaction.description || transaction.name}</h3>
          <div class="transaction-date">${formattedDate}</div>
        </div>
      </div>
      <div class="transaction-amount ${transaction.type}-amount">${formatCurrency(transaction.amount)}</div>
      <div class="transaction-actions">
        <button class="transaction-edit" data-id="${transaction.id}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="transaction-delete" data-id="${transaction.id}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    
    // Add animation delay
    transactionItem.style.animation = `fadeIn 0.3s ease forwards ${index * 0.05}s`;
    transactionItem.style.opacity = '0';
    
    transactionsList.appendChild(transactionItem);
  });
  
  // Add event listeners to edit and delete buttons
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
    document.querySelector('#transactionName').value = transaction.description || transaction.name;
    document.querySelector('#transactionAmount').value = transaction.amount;
    
    // Set transaction type
    selectedType = transaction.type;
    transactionTypeButtons.forEach(button => {
      button.classList.toggle('active', 
        (button.id === 'incomeBtn' && transaction.type === 'income') || 
        (button.id === 'expenseBtn' && transaction.type === 'expense')
      );
    });
    
    // Set the current edit ID
    currentEditId = id;
    
    // Update submit button text
    submitTransaction.textContent = 'Update Transaction';
    
    // Show the modal
    openModal();
  }
}

// Delete transaction
function deleteTransaction(event) {
  event.stopPropagation();
  
  const id = event.currentTarget.getAttribute('data-id');
  const transaction = transactions.find(t => t.id === id);
  
  if (confirm(`Are you sure you want to delete the transaction "${transaction.description || transaction.name}"?`)) {
    // Add a fade-out animation to the element
    const element = event.currentTarget.closest('.transaction-item');
    element.style.animation = 'fadeOut 0.3s ease forwards';
    
    // Remove after animation
    setTimeout(() => {
      transactions = transactions.filter(t => t.id !== id);
      saveTransactions();
      calculateTotalBalance();
      renderTransactions();
      updateCashFlowBars();
      updateSavingsGoal();
    }, 300);
  }
}

// Handle transaction form submission
function handleTransactionSubmit() {
  // Get form values
  const description = document.querySelector('#transactionName').value.trim();
  const amount = parseFloat(document.querySelector('#transactionAmount').value);
  
  // Validate form
  let valid = true;
  
  if (!description) {
    document.querySelector('#nameError').style.display = 'block';
    valid = false;
  } else {
    document.querySelector('#nameError').style.display = 'none';
  }
  
  if (!amount || isNaN(amount) || amount <= 0) {
    document.querySelector('#amountError').style.display = 'block';
    valid = false;
  } else {
    document.querySelector('#amountError').style.display = 'none';
  }
  
  if (!valid) return;
  
  // Create transaction object
  const now = new Date();
  const category = document.querySelector('#transactionCategory').value;
  
  if (currentEditId) {
    // Update existing transaction
    const index = transactions.findIndex(t => t.id === currentEditId);
    if (index !== -1) {
      transactions[index] = {
        ...transactions[index],
        description: description,
        name: description, // For compatibility
        amount: amount,
        category: category,
        type: selectedType,
        updatedAt: now.toISOString()
      };
    }
    currentEditId = null;
  } else {
    // Add new transaction
    const newTransaction = {
      id: Date.now().toString(),
      description: description,
      name: description, // For compatibility
      amount: amount,
      category: category,
      type: selectedType,
      date: now.toISOString(),
      timestamp: now.toISOString() // For compatibility
    };
    
    transactions.push(newTransaction);
  }
  
  // Save and update UI
  saveTransactions();
  calculateTotalBalance();
  renderTransactions();
  updateCashFlowBars();
  updateSavingsGoal();
  
  // Close modal and reset form
  closeModal();
  transactionForm.reset();
  submitTransaction.textContent = 'Add Transaction';
  
  // Show success toast notification
  showToast('Transaction saved successfully!');
}

// Handle goal form submission
function handleGoalSubmit() {
  // Get form values
  const name = document.querySelector('#goalNameInput').value.trim();
  const amount = parseFloat(document.querySelector('#goalAmountInput').value);
  
  // Validate form
  let valid = true;
  
  if (!name) {
    document.querySelector('#goalNameError').style.display = 'block';
    valid = false;
  } else {
    document.querySelector('#goalNameError').style.display = 'none';
  }
  
  if (!amount || isNaN(amount) || amount <= 0) {
    document.querySelector('#goalAmountError').style.display = 'block';
    valid = false;
  } else {
    document.querySelector('#goalAmountError').style.display = 'none';
  }
  
  if (!valid) return;
  
  // Create or update goal
  savingsGoal = { name, amount };
  
  // Save and update UI
  saveSavingsGoal();
  updateSavingsGoal();
  
  // Close modal and reset form
  closeGoalModal();
  goalForm.reset();
  
  // Show success toast notification
  showToast('Savings goal saved successfully!');
}

// Delete savings goal
function handleGoalDelete() {
  if (confirm('Are you sure you want to delete this savings goal?')) {
    savingsGoal = null;
    localStorage.removeItem('savingsGoal');
    
    // Update UI
    updateSavingsGoal();
    closeGoalModal();
    
    // Show UI
    goalDisplay.style.display = 'none';
    noGoalMessage.style.display = 'block';
    
    // Show success toast notification
    showToast('Savings goal deleted successfully!');
  }
}

// Clear all transactions
function handleClearTransactions() {
  if (confirm('Are you sure you want to clear all transactions? This action cannot be undone.')) {
    transactions = [];
    saveTransactions();
    calculateTotalBalance();
    renderTransactions();
    updateCashFlowBars();
    updateSavingsGoal();
    
    // Show success toast notification
    showToast('All transactions cleared successfully!');
  }
}

// Show toast notification
function showToast(message, type = 'success') {
  // Create toast element if it doesn't exist
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.classList.add('toast');
    document.body.appendChild(toast);
  }
  
  // Set message and type
  toast.textContent = message;
  toast.className = 'toast'; // Reset classes
  toast.classList.add(`toast-${type}`);
  
  // Show toast
  toast.classList.add('show');
  
  // Hide after timeout
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Handle calculator input
function handleCalculatorInput(event) {
  const button = event.currentTarget;
  
  if (button.classList.contains('number')) {
    appendCalculatorValue(button.textContent);
  } else if (button.classList.contains('operator')) {
    let operator = button.textContent;
    if (operator === '×') operator = '*';
    if (operator === '÷') operator = '/';
    appendCalculatorValue(operator);
  } else if (button.classList.contains('equals')) {
    calculateResult();
  } else if (button.classList.contains('clear')) {
    clearCalculator();
  } else if (button.classList.contains('delete')) {
    deleteLastCharacter();
  }
}

// Append value to calculator input
function appendCalculatorValue(value) {
  if (calculatorInput.value === '0' || calculatorInput.value === 'Error') {
    calculatorInput.value = value;
  } else {
    calculatorInput.value += value;
  }
}

// Calculate result
function calculateResult() {
  try {
    const expression = calculatorInput.value.replace(/×/g, '*').replace(/÷/g, '/');
    const result = eval(expression);
    
    if (isNaN(result) || !isFinite(result)) {
      calculatorInput.value = 'Error';
    } else {
      calculatorInput.value = Math.round(result * 100) / 100;
    }
  } catch (error) {
    calculatorInput.value = 'Error';
  }
}

// Clear calculator
function clearCalculator() {
  calculatorInput.value = '0';
}

// Delete last character
function deleteLastCharacter() {
  if (calculatorInput.value === 'Error' || calculatorInput.value.length === 1) {
    calculatorInput.value = '0';
  } else {
    calculatorInput.value = calculatorInput.value.slice(0, -1);
  }
}

// Open transaction modal
function openModal() {
  transactionModal.classList.add('active');
  
  // If it's a new transaction, set default values
  if (!currentEditId) {
    // Reset form
    transactionForm.reset();
    
    // Default to income
    selectedType = 'income';
    transactionTypeButtons.forEach(button => {
      button.classList.toggle('active', button.id === 'incomeBtn');
    });
    
    // Set submit button text
    submitTransaction.textContent = 'Add Transaction';
  }
}

// Close transaction modal
function closeModal() {
  transactionModal.classList.remove('active');
  calculatorPanel.classList.remove('active');
  
  // Reset form and errors
  document.querySelector('#nameError').style.display = 'none';
  document.querySelector('#amountError').style.display = 'none';
  
  // Reset current edit ID
  currentEditId = null;
}

// Open goal modal
function openGoalModal() {
  goalModal.classList.add('active');
  
  // If we have an existing goal, populate the form
  if (savingsGoal) {
    document.querySelector('#goalNameInput').value = savingsGoal.name;
    document.querySelector('#goalAmountInput').value = savingsGoal.amount;
    deleteGoal.style.display = 'block';
  } else {
    goalForm.reset();
    deleteGoal.style.display = 'none';
  }
}

// Close goal modal
function closeGoalModal() {
  goalModal.classList.remove('active');
  
  // Reset form and errors
  document.querySelector('#goalNameError').style.display = 'none';
  document.querySelector('#goalAmountError').style.display = 'none';
}

// Setup event listeners
function setupEventListeners() {
  // Transaction modal
  if (addTransactionBtn) {
    addTransactionBtn.addEventListener('click', openModal);
  }
  
  if (transactionModalClose) {
    transactionModalClose.addEventListener('click', closeModal);
  }
  
  // Transaction type buttons
  transactionTypeButtons.forEach(button => {
    button.addEventListener('click', () => {
      transactionTypeButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
      selectedType = button.id === 'incomeBtn' ? 'income' : 'expense';
    });
  });
  
  // Submit transaction
  if (submitTransaction) {
    submitTransaction.addEventListener('click', handleTransactionSubmit);
  }
  
  // Calculator toggle
  if (calculatorToggle) {
    calculatorToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      calculatorPanel.classList.toggle('active');
      if (calculatorPanel.classList.contains('active')) {
        calculatorInput.value = transactionAmount.value || '0';
      }
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
        transactionAmount.value = calculatorInput.value;
        calculatorPanel.classList.remove('active');
      }
    });
  }
  
  // Goal modal
  if (editGoalBtn) {
    editGoalBtn.addEventListener('click', openGoalModal);
  }
  
  if (setGoalBtn) {
    setGoalBtn.addEventListener('click', openGoalModal);
  }
  
  if (goalModalClose) {
    goalModalClose.addEventListener('click', closeGoalModal);
  }
  
  if (submitGoal) {
    submitGoal.addEventListener('click', handleGoalSubmit);
  }
  
  if (deleteGoal) {
    deleteGoal.addEventListener('click', handleGoalDelete);
  }
  
  // Clear transactions
  if (clearTransactionsBtn) {
    clearTransactionsBtn.addEventListener('click', handleClearTransactions);
  }
  
  // Close modals when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === transactionModal) {
      closeModal();
    }
    if (event.target === goalModal) {
      closeGoalModal();
    }
  });
  
  // Close calculator when clicking outside
  document.addEventListener('click', (event) => {
    if (calculatorPanel && calculatorPanel.classList.contains('active')) {
      const isClickInside = calculatorPanel.contains(event.target) || 
                        (calculatorToggle && calculatorToggle.contains(event.target));
      
      if (!isClickInside) {
        calculatorPanel.classList.remove('active');
      }
    }
  });
}

// Animate dashboard elements on load
function animateDashboardLoad() {
  const elements = [
    '.dashboard-welcome',
    '.account-balance',
    '.statistics-cards',
    '.cashflow-section',
    '.goal-section',
    '.transactions-section'
  ];
  
  elements.forEach((selector, index) => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, 100 + (index * 100));
    }
  });
}

// Add CSS for toast notifications
function addToastStyles() {
  if (!document.querySelector('#toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.innerHTML = `
      .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: white;
        color: #333;
        padding: 12px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
        font-weight: 500;
      }
      
      .toast.show {
        opacity: 1;
        transform: translateY(0);
      }
      
      .toast-success {
        border-left: 4px solid var(--success);
      }
      
      .toast-error {
        border-left: 4px solid var(--error);
      }
      
      .toast-warning {
        border-left: 4px solid #ff9800;
      }
      
      @keyframes fadeOut {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(10px);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  init();
  addToastStyles();
}); 