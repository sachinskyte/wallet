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
const categoryChart = document.querySelector('#categoryChart');
const categoryList = document.querySelector('#categoryList');
const categoryPills = document.querySelectorAll('.category-pill');

// App state
let transactions = [];
let currentEditId = null;
let selectedType = 'income';
let userName = localStorage.getItem('userName') || 'Investor';
let savingsGoal = null;
let chart = null;

// Category data
const categoryIcons = {
  // Income categories
  'salary': { icon: 'fas fa-wallet', color: '#4caf50' },
  'investments': { icon: 'fas fa-chart-line', color: '#00bcd4' },
  'freelance': { icon: 'fas fa-laptop-code', color: '#3f51b5' },
  'gifts_received': { icon: 'fas fa-gift', color: '#9c27b0' },
  'refunds': { icon: 'fas fa-undo', color: '#8bc34a' },
  'other_income': { icon: 'fas fa-coins', color: '#ffc107' },
  
  // Expense categories
  'food': { icon: 'fas fa-utensils', color: '#ff9800' },
  'shopping': { icon: 'fas fa-shopping-bag', color: '#9c27b0' },
  'housing': { icon: 'fas fa-home', color: '#03a9f4' },
  'transportation': { icon: 'fas fa-bus', color: '#2196f3' },
  'vehicle': { icon: 'fas fa-car', color: '#009688' },
  'entertainment': { icon: 'fas fa-film', color: '#e91e63' },
  'communication': { icon: 'fas fa-mobile-alt', color: '#673ab7' },
  'technology': { icon: 'fas fa-laptop', color: '#4caf50' },
  'healthcare': { icon: 'fas fa-heartbeat', color: '#f44336' },
  'education': { icon: 'fas fa-graduation-cap', color: '#2196f3' },
  'travel': { icon: 'fas fa-plane', color: '#ffc107' },
  'gifts': { icon: 'fas fa-gift', color: '#8bc34a' },
  'others': { icon: 'fas fa-ellipsis-h', color: '#9e9e9e' }
};

// Initialize the app
function init() {
  // Set welcome name
  if (welcomeName) welcomeName.textContent = userName;
  
  // Load data from localStorage
  loadTransactions();
  loadSavingsGoal();
  
  // Update UI
  calculateTotalBalance();
  renderTransactions();
  updateCashFlowBars();
  updateSavingsGoal();
  
  // Initialize charts with a small delay for smooth animation
  setTimeout(() => {
    createCategoryChart();
    updateCategoryList();
  }, 100);
  
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
  
  // Update with animation and format properly
  animateCounter(totalIncome, totalIncomeAmount);
  animateCounter(totalExpenses, totalExpensesAmount);
  animateCounter(netSavings, netSavingsAmount);
  
  // Apply appropriate color to net savings
  if (netSavingsAmount > 0) {
    netSavings.style.color = 'var(--success)';
  } else if (netSavingsAmount < 0) {
    netSavings.style.color = 'var(--error)';
  } else {
    netSavings.style.color = '';
  }
  
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
      noTransactions.style.display = 'flex';
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
    transactionItem.classList.add(transaction.type); // Add class based on type
    transactionItem.setAttribute('data-id', transaction.id);
    transactionItem.setAttribute('data-category', transaction.category || 'others');
    
    // Format date
    const dateObj = new Date(transaction.date || transaction.timestamp);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    // Get category icon info
    const category = transaction.category || 'others';
    const { icon, color } = categoryIcons[category] || categoryIcons.others;
    const displayName = getCategoryDisplayName(category);
    
    transactionItem.innerHTML = `
      <div class="transaction-left">
        <div class="transaction-icon ${transaction.type}-icon">
          <i class="fas ${transaction.type === 'income' ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
        </div>
        <div class="transaction-details">
          <h3>${transaction.description || transaction.name}</h3>
          <div class="transaction-date">${formattedDate}</div>
          <div class="transaction-category">
            <i class="${icon}" style="color: ${color}"></i>
            ${displayName}
          </div>
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
    transactionItem.style.animation = `fadeIn 0.4s ease forwards ${index * 0.05}s`;
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
    
    // Set transaction category if it exists
    if (transaction.category) {
      document.querySelector('#transactionCategory').value = transaction.category;
    }
    
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
      
      // Ensure category visualizations are updated
      createCategoryChart();
      updateCategoryList();
      
      // Show toast notification
      showToast('Transaction deleted successfully');
    }, 300);
  }
}

// Handle transaction form submission
function handleTransactionSubmit() {
  // Get form values
  const description = document.querySelector('#transactionName').value.trim();
  const amount = parseFloat(document.querySelector('#transactionAmount').value);
  const category = document.querySelector('#transactionCategory').value;
  
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
  
  if (!category) {
    document.querySelector('#categoryError').style.display = 'block';
    valid = false;
  } else {
    document.querySelector('#categoryError').style.display = 'none';
  }
  
  if (!valid) return;
  
  // Create transaction object
  const now = new Date();
  let newTransaction = null;
  
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
      newTransaction = transactions[index];
    }
    currentEditId = null;
  } else {
    // Add new transaction
    newTransaction = {
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
  
  // Save to localStorage
  saveTransactions();
  
  // Close modal and reset form first for better UX
  closeModal();
  transactionForm.reset();
  submitTransaction.textContent = 'Add Transaction';
  
  // Update balance and visualizations
  calculateTotalBalance();
  updateCashFlowBars();
  updateSavingsGoal();
  
  // If it's an expense, handle category selection and visualization
  if (selectedType === 'expense') {
    // Look for a matching category pill
    const categoryPill = document.querySelector(`.category-pill[data-filter="${category}"]`);
    
    if (categoryPill) {
      // If we have a direct pill for this category, select it
      categoryPills.forEach(p => p.classList.remove('active'));
      categoryPill.classList.add('active');
      window.currentSelectedCategory = category;
    } else {
      // If it's in the "More" dropdown, handle that
      const visibleCategories = Array.from(document.querySelectorAll('.category-pill:not([data-filter="more"])')).map(pill => 
        pill.getAttribute('data-filter')
      );
      
      if (!visibleCategories.includes(category)) {
        // Select the "More" pill
        categoryPills.forEach(p => p.classList.remove('active'));
        const morePill = document.querySelector('.category-pill[data-filter="more"]');
        if (morePill) {
          morePill.classList.add('active');
          window.currentSelectedCategory = category;
        }
      }
    }
  }
  
  // Now update the category visualization
  createCategoryChart();
  updateCategoryList();
  
  // Finally, render transactions
  renderTransactions();
  
  // Show notification based on the transaction type
  showToast(`${selectedType === 'income' ? 'Income' : 'Expense'} saved successfully!`);
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
    
    // Ensure category visualizations are updated
    createCategoryChart();
    updateCategoryList();
    
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
    
    // Update category selector for income type
    updateCategorySelector('income');
    
    // Set submit button text
    submitTransaction.textContent = 'Add Transaction';
  } else {
    // Set category selector based on the transaction being edited
    const transaction = transactions.find(t => t.id === currentEditId);
    if (transaction) {
      updateCategorySelector(transaction.type);
    }
  }
}

// Close transaction modal
function closeModal() {
  transactionModal.classList.remove('active');
  calculatorPanel.classList.remove('active');
  
  // Reset form and errors
  document.querySelector('#nameError').style.display = 'none';
  document.querySelector('#amountError').style.display = 'none';
  document.querySelector('#categoryError').style.display = 'none';
  
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
      
      // Update category selector based on transaction type
      updateCategorySelector(selectedType);
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
  
  // Category filter pills
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      
      const filter = pill.getAttribute('data-filter');
      filterTransactionsByCategory(filter);
    });
  });
  
  // Function to handle the "More" category pill click
  handleMoreCategoriesClick();
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

// Update the createCategoryChart function for a better, cleaner visualization
function createCategoryChart() {
  if (!categoryChart) return;
  
  const categoryData = calculateCategoryData();
  
  if (categoryData.length === 0) {
    if (chart) {
      chart.destroy();
      chart = null;
    }
    
    const chartContainer = categoryChart.parentElement;
    const emptyState = document.createElement('div');
    emptyState.className = 'chart-empty-state';
    emptyState.innerHTML = `
      <i class="fas fa-chart-pie"></i>
      <h4>No expense data yet</h4>
      <p>Start adding expenses to see your spending breakdown by category.</p>
    `;
    
    chartContainer.innerHTML = '';
    chartContainer.appendChild(emptyState);
    return;
  }
  
  const chartContainer = categoryChart.parentElement;
  const emptyState = chartContainer.querySelector('.chart-empty-state');
  if (emptyState) {
    emptyState.remove();
    chartContainer.innerHTML = '<canvas id="categoryChart"></canvas>';
  }
  
  const labels = categoryData.map(item => item.name);
  const data = categoryData.map(item => item.amount);
  const backgroundColor = categoryData.map(item => item.color);
  const borderColor = backgroundColor.map(color => adjustColorBrightness(color, -10));
  
  if (chart) {
    chart.destroy();
  }
  
  const ctx = document.getElementById('categoryChart').getContext('2d');
  
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
        hoverOffset: 12,
        borderRadius: 2,
        spacing: 2,
        hoverBorderColor: '#ffffff',
        hoverBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      radius: '90%',
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 800,
        easing: 'easeOutCirc'
      },
      layout: {
        padding: 15
      },
      onClick: (event, elements) => {
        if (elements && elements.length > 0) {
          const index = elements[0].index;
          const category = categoryData[index].category;
          
          const pill = document.querySelector(`.category-pill[data-filter="${category}"]`);
          if (pill) {
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            
            filterTransactionsByCategory(category);
          } else if (category !== 'all') {
            const morePill = document.querySelector('.category-pill[data-filter="more"]');
            if (morePill) {
              categoryPills.forEach(p => p.classList.remove('active'));
              morePill.classList.add('active');
              
              filterTransactionsByCategory(category);
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#333',
          bodyColor: '#555',
          bodyFont: {
            size: 13,
            weight: '500',
            family: 'Inter, sans-serif'
          },
          titleFont: {
            size: 15,
            weight: '600',
            family: 'Inter, sans-serif'
          },
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          callbacks: {
            title: function(tooltipItems) {
              return tooltipItems[0].label.split(' (')[0];
            },
            label: function(context) {
              const value = context.raw;
              const total = context.chart.getDatasetMeta(0).total;
              const percentage = Math.round((value / total) * 100);
              return ` ${formatCurrency(value)} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
  
  if (Chart.registry.plugins.get('doughnutCenterText') === undefined) {
    Chart.register({
      id: 'doughnutCenterText',
      beforeDraw: function(chart) {
        const width = chart.width;
        const height = chart.height;
        const ctx = chart.ctx;
        
        ctx.restore();
        const fontSize = (height / 150).toFixed(2);
        ctx.font = `600 ${fontSize}em Inter, sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        
        const totalAmount = chart.data.datasets[0].data.reduce((sum, value) => sum + value, 0);
        const text = formatCurrency(totalAmount);
        
        ctx.fillStyle = '#333';
        ctx.fillText(text, width/2, height/2 - 10);
        
        const subTextFontSize = (height / 300).toFixed(2);
        ctx.font = `500 ${subTextFontSize}em Inter, sans-serif`;
        ctx.fillStyle = '#666';
        
        ctx.fillText('Total Expenses', width/2, height/2 + 15);
        ctx.save();
      }
    });
  }
}

// Helper function to adjust color brightness
function adjustColorBrightness(color, percent) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
  const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
  const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

  return "#" + RR + GG + BB;
}

function calculateCategoryData() {
  // Create a map to store totals for each category
  const categoryTotals = new Map();
  
  // Get the active filter from the category pills
  const activeFilter = document.querySelector('.category-pill.active');
  const filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
  
  // Filter transactions based on type and potentially category
  let filteredTransactions = transactions.filter(t => t.type === 'expense');
  
  // Apply additional category filter if needed
  if (filter !== 'all' && filter !== 'more') {
    filteredTransactions = filteredTransactions.filter(t => t.category === filter);
  } else if (filter === 'more') {
    // For "more" filter, get the specific category from local state or use all
    if (window.currentSelectedCategory && window.currentSelectedCategory !== 'all' && window.currentSelectedCategory !== 'more') {
      filteredTransactions = filteredTransactions.filter(t => t.category === window.currentSelectedCategory);
    }
  }
  
  // Calculate totals for each category
  filteredTransactions.forEach(transaction => {
    const category = transaction.category || 'others';
    const currentTotal = categoryTotals.get(category) || 0;
    categoryTotals.set(category, currentTotal + transaction.amount);
  });
  
  // Convert the map to an array of objects with name, amount, and color
  const categoryData = Array.from(categoryTotals.entries())
    .map(([category, amount]) => {
      const { icon, color } = categoryIcons[category] || categoryIcons.others;
      const displayName = getCategoryDisplayName(category);
      return {
        name: displayName,
        category: category,
        amount: amount,
        color: color,
        icon: icon
      };
    })
    .sort((a, b) => b.amount - a.amount);
  
  return categoryData;
}

// Get a user-friendly display name for a category
function getCategoryDisplayName(category) {
  const displayNames = {
    'food': 'Food & Dining',
    'shopping': 'Shopping',
    'housing': 'Housing & Rent',
    'transportation': 'Transportation',
    'vehicle': 'Vehicle & Maintenance',
    'entertainment': 'Entertainment',
    'communication': 'Communication',
    'technology': 'Technology & Software',
    'healthcare': 'Healthcare',
    'education': 'Education',
    'travel': 'Travel',
    'gifts': 'Gifts & Donations',
    'salary': 'Salary & Wages',
    'investments': 'Investments',
    'freelance': 'Freelance Work',
    'gifts_received': 'Gifts Received',
    'refunds': 'Refunds',
    'other_income': 'Other Income',
    'others': 'Others'
  };
  
  return displayNames[category] || capitalizeFirstLetter(category.replace('_', ' '));
}

function updateCategoryList() {
  if (!categoryList) return;
  
  categoryList.innerHTML = '';
  
  const categoryData = calculateCategoryData();
  const totalAmount = categoryData.reduce((sum, item) => sum + item.amount, 0);
  
  // Get the active filter
  const activeFilter = document.querySelector('.category-pill.active');
  const currentFilter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
  
  if (categoryData.length === 0) {
    // Show empty state
    const emptyState = document.createElement('div');
    emptyState.className = 'category-empty-state';
    emptyState.innerHTML = `
      <i class="fas fa-filter"></i>
      <p>No transactions in this category</p>
    `;
    categoryList.appendChild(emptyState);
    return;
  }
  
  // Only show top 5 categories
  categoryData.slice(0, 5).forEach(item => {
    const percentage = totalAmount > 0 ? Math.round((item.amount / totalAmount) * 100) : 0;
    
    const categoryItem = document.createElement('div');
    categoryItem.classList.add('category-item');
    
    // Highlight the active category
    if (currentFilter === item.category || (currentFilter === 'all' && item === categoryData[0])) {
      categoryItem.classList.add('active-category');
    }
    
    // Make category items clickable
    categoryItem.addEventListener('click', () => {
      // Find the matching pill and click it
      const matchingPill = document.querySelector(`.category-pill[data-filter="${item.category}"]`);
      if (matchingPill) {
        matchingPill.click();
      } else {
        // Handle categories in the "more" dropdown
        categoryPills.forEach(p => p.classList.remove('active'));
        const morePill = document.querySelector('.category-pill[data-filter="more"]');
        if (morePill) {
          morePill.classList.add('active');
        }
        filterTransactionsByCategory(item.category);
      }
    });
    
    categoryItem.innerHTML = `
      <div class="category-label">
        <div class="category-icon-small category-${item.category}">
          <i class="${item.icon}"></i>
        </div>
        ${item.name}
      </div>
      <div class="category-percentage">${percentage}%</div>
    `;
    
    categoryList.appendChild(categoryItem);
  });
  
  // Add a "View All" button if there are more than 5 categories
  if (categoryData.length > 5) {
    const viewAllItem = document.createElement('div');
    viewAllItem.classList.add('category-view-all');
    viewAllItem.innerHTML = `
      <span>View All Categories</span>
      <i class="fas fa-chevron-right"></i>
    `;
    
    // Reset to "All Categories" when clicking View All
    viewAllItem.addEventListener('click', () => {
      const allPill = document.querySelector('.category-pill[data-filter="all"]');
      if (allPill) {
        allPill.click();
      }
    });
    
    categoryList.appendChild(viewAllItem);
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function filterTransactionsByCategory(category) {
  // Get the display name for the category
  let categoryDisplayName = category === 'all' ? 'All Categories' : 
    getCategoryDisplayName(category);
  
  if (category === 'more') {
    // Don't actually filter for the "more" option
    return;
  }
  
  // Update active pill visually if it's not already done
  const activePill = document.querySelector(`.category-pill[data-filter="${category}"]`);
  if (activePill && !activePill.classList.contains('active')) {
    categoryPills.forEach(p => p.classList.remove('active'));
    activePill.classList.add('active');
  }
  
  // Create or refresh the chart with the filtered data
  createCategoryChart();
  updateCategoryList();
  
  // Update UI to show which transactions match the selected category
  if (category !== 'all') {
    // Highlight matching transactions in the list
    const transactionItems = document.querySelectorAll('.transaction-item');
    transactionItems.forEach(item => {
      if (item.getAttribute('data-category') === category) {
        item.classList.add('highlighted');
      } else {
        item.classList.remove('highlighted');
      }
    });
    
    // Show notification
    const { color } = categoryIcons[category] || categoryIcons.others;
    showToast(`Filtered by ${categoryDisplayName}`, 'info');
  } else {
    // Remove highlighting from all transactions
    const transactionItems = document.querySelectorAll('.transaction-item');
    transactionItems.forEach(item => {
      item.classList.remove('highlighted');
    });
  }
}

// Function to update category selector based on transaction type
function updateCategorySelector(type) {
  const categorySelect = document.querySelector('#transactionCategory');
  if (!categorySelect) return;
  
  const incomeOptgroup = categorySelect.querySelector('optgroup.income-categories');
  const expenseOptgroup = categorySelect.querySelector('optgroup.expense-categories');
  
  if (!incomeOptgroup || !expenseOptgroup) return;
  
  // Reset selection and show correct optgroup
  categorySelect.selectedIndex = 0;
  
  if (type === 'income') {
    incomeOptgroup.style.display = '';
    expenseOptgroup.style.display = 'none';
    
    // Make only income options selectable
    for (let i = 0; i < categorySelect.options.length; i++) {
      const option = categorySelect.options[i];
      const parent = option.parentNode;
      
      if (parent === incomeOptgroup) {
        option.disabled = false;
      } else if (parent === expenseOptgroup) {
        option.disabled = true;
      }
    }
  } else {
    incomeOptgroup.style.display = 'none';
    expenseOptgroup.style.display = '';
    
    // Make only expense options selectable
    for (let i = 0; i < categorySelect.options.length; i++) {
      const option = categorySelect.options[i];
      const parent = option.parentNode;
      
      if (parent === expenseOptgroup) {
        option.disabled = false;
      } else if (parent === incomeOptgroup) {
        option.disabled = true;
      }
    }
  }
}

// Function to handle the "More" category pill click
function handleMoreCategoriesClick() {
  const morePill = document.querySelector('.category-pill[data-filter="more"]');
  if (!morePill) return;
  
  // Initialize the current selected category global variable if it doesn't exist
  window.currentSelectedCategory = window.currentSelectedCategory || 'all';
  
  morePill.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent immediate filtering
    
    // Check if dropdown already exists
    let dropdown = document.querySelector('.category-more-dropdown');
    if (dropdown) {
      dropdown.remove();
      return;
    }
    
    // Create dropdown
    dropdown = document.createElement('div');
    dropdown.className = 'category-more-dropdown';
    
    // Get all expense categories that aren't already shown as pills
    const visibleCategories = Array.from(document.querySelectorAll('.category-pill:not([data-filter="more"])')).map(pill => 
      pill.getAttribute('data-filter')
    );
    
    const expenseCategories = Object.keys(categoryIcons).filter(category => 
      !visibleCategories.includes(category) && 
      !['salary', 'investments', 'freelance', 'gifts_received', 'refunds', 'other_income'].includes(category)
    );
    
    // Add dropdown items
    expenseCategories.forEach(category => {
      const { icon, color } = categoryIcons[category];
      const displayName = getCategoryDisplayName(category);
      
      const item = document.createElement('div');
      item.className = 'category-dropdown-item';
      item.setAttribute('data-filter', category);
      
      // Highlight the current selected category
      if (window.currentSelectedCategory === category) {
        item.classList.add('active');
      }
      
      item.innerHTML = `
        <i class="${icon}" style="color: ${color}"></i>
        ${displayName}
      `;
      
      item.addEventListener('click', () => {
        // Store the selected category globally
        window.currentSelectedCategory = category;
        
        // Filter by this category
        categoryPills.forEach(p => p.classList.remove('active'));
        morePill.classList.add('active');
        
        filterTransactionsByCategory(category);
        dropdown.remove();
      });
      
      dropdown.appendChild(item);
    });
    
    // Position dropdown below the More pill
    const rect = morePill.getBoundingClientRect();
    dropdown.style.top = rect.bottom + 'px';
    dropdown.style.left = rect.left + 'px';
    
    // Add to document
    document.body.appendChild(dropdown);
    
    // Close dropdown when clicking outside
    const closeDropdown = (e) => {
      if (!dropdown.contains(e.target) && e.target !== morePill) {
        dropdown.remove();
        document.removeEventListener('click', closeDropdown);
      }
    };
    
    document.addEventListener('click', closeDropdown);
  });
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  init();
  addToastStyles();
}); 