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
const goalModalClose = document.querySelector('#goalModalClose');
const goalForm = document.querySelector('#goalForm');
const submitGoal = document.querySelector('#submitGoal');
const deleteGoal = document.querySelector('#deleteGoal');
const goalDisplay = document.querySelector('#goalDisplay');
const noGoalMessage = document.querySelector('#noGoalMessage');
const setGoalBtn = document.querySelector('#setGoalBtn');
const categoryChart = document.querySelector('#categoryChart');
const categoryFilter = document.querySelector('.category-filter');
const categoryPills = document.querySelectorAll('.category-pill');
const spendingChartCanvas = document.getElementById('spending-chart');
const categoryContainer = document.getElementById('category-list');

// App state
let transactions = [];
let currentEditId = null;
let selectedType = 'income';
let userName = localStorage.getItem('userName') || 'Investor';
let savingsGoal = null;
let chart = null;
let calculationResult = '';
let spendingChart = null;
let currentFilter = 'all';

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

// Render transactions with optional filtering
function renderTransactions(filteredTransactions = null) {
  if (!transactionsList) return;
  
  // Clear transactions list
  transactionsList.innerHTML = '';
  
  // Determine which transactions to show
  const transactionsToShow = filteredTransactions || transactions;
  
  // Handle empty state
  if (transactionsToShow.length === 0) {
    // No transactions to show
    if (filteredTransactions) {
      // No transactions match filter
      transactionsList.innerHTML = `
        <div class="no-transactions filtered">
          <i class="fas fa-filter"></i>
          <p>No transactions match this filter</p>
        </div>`;
    } else {
      // No transactions at all
      document.getElementById('noTransactions').style.display = 'flex';
      transactionsList.style.display = 'none';
    }
    return;
  }
  
  // Show transactions
  document.getElementById('noTransactions').style.display = 'none';
  transactionsList.style.display = 'block';
  
  // Sort transactions (newest first)
  const sortedTransactions = [...transactionsToShow].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Create transaction items
  sortedTransactions.forEach(transaction => {
    const { icon, color, name: categoryName } = getCategoryIcon(transaction.category, transaction.type);
    const transactionItem = document.createElement('div');
    
    transactionItem.className = 'transaction-item';
    transactionItem.dataset.id = transaction.id;
    transactionItem.dataset.category = transaction.category;
    
    transactionItem.innerHTML = `
      <div class="transaction-left">
        <div class="transaction-icon ${transaction.type === 'income' ? 'income-icon' : 'expense-icon'}">
          <i class="fas fa-arrow-${transaction.type === 'income' ? 'down' : 'up'}"></i>
        </div>
        <div class="transaction-details">
          <h3>${transaction.name}</h3>
          <div class="transaction-date">${formatDate(transaction.date)}</div>
          <div class="transaction-category">
            <i class="${icon}" style="color: ${color}"></i>
            ${categoryName}
          </div>
        </div>
      </div>
      <div class="transaction-amount ${transaction.type === 'income' ? 'income-amount' : 'expense-amount'}">
        ${transaction.type === 'income' ? '' : '-'}₹${formatCurrency(transaction.amount)}
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
  attachTransactionEventListeners();
}

// Attach event listeners to transaction items
function attachTransactionEventListeners() {
  // Edit buttons
  document.querySelectorAll('.transaction-edit').forEach(button => {
    button.addEventListener('click', editTransaction);
  });
  
  // Delete buttons
  document.querySelectorAll('.transaction-delete').forEach(button => {
    button.addEventListener('click', deleteTransaction);
  });
}

// Filter transactions by category
function filterTransactionsByCategory(category) {
  if (category === 'all') {
    renderTransactions();
  } else if (category === 'more') {
    // "More" is handled by the dropdown
    return;
  } else {
    // Filter by selected category
    const filteredTransactions = transactions.filter(t => t.category === category);
    renderTransactions(filteredTransactions);
  }
  
  // Get category display name for toast
  const categoryDisplayName = category === 'all' ? 'All Categories' : getCategoryDisplayName(category);
  
  // Show toast notification
  if (category !== 'all') {
    showToast(`Filtered by ${categoryDisplayName}`, 'info');
  }
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
        calculatorInput.value = transactionAmountInput.value || '0';
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
        transactionAmountInput.value = calculatorInput.value;
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
  
  // Add event listeners for category pills
  if (categoryPills) {
    categoryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        // Remove active class from all pills
        categoryPills.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked pill
        pill.classList.add('active');
        
        // Get category filter
        const filter = pill.getAttribute('data-filter');
        
        // Filter transactions
        currentFilter = filter;
        filterTransactionsByCategory(filter);
        
        // Update the spending chart
        updateSpendingByCategory();
      });
    });
  }
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
  
  // Handle empty data case
  if (categoryData.length === 0) {
    if (chart) {
      chart.destroy();
      chart = null;
    }
    
    const chartContainer = categoryChart.parentElement;
    chartContainer.innerHTML = `
      <div class="chart-empty-state">
        <i class="fas fa-chart-pie"></i>
        <h4>No expense data yet</h4>
        <p>Start adding expenses to see your spending breakdown by category.</p>
      </div>`;
    return;
  }
  
  // Clear any empty state and restore canvas
  const chartContainer = categoryChart.parentElement;
  if (chartContainer.querySelector('.chart-empty-state')) {
    chartContainer.innerHTML = '<canvas id="categoryChart"></canvas>';
  }
  
  // Prepare chart data
  const data = {
    labels: categoryData.map(item => item.name),
    datasets: [{
      data: categoryData.map(item => item.amount),
      backgroundColor: categoryData.map(item => item.color),
      hoverBackgroundColor: categoryData.map(item => adjustColorBrightness(item.color, 15)),
      borderColor: 'white',
      borderWidth: 2,
      hoverOffset: 7,
      borderRadius: 4
    }]
  };
  
  // Chart.js options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    layout: {
      padding: 15
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 15,
          usePointStyle: true,
          boxWidth: 10,
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: '500'
          },
          generateLabels: chart => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const percentage = Math.round((value / total) * 100);
                return {
                  text: `${label} - ${percentage}%`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: 'white',
                  lineWidth: 2,
                  hidden: !chart.getDataVisibility(i),
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: context => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return ` ${formatCurrency(value)} (${percentage}%)`;
          }
        },
        padding: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#333',
        bodyColor: '#555',
        titleFont: { size: 14, weight: 'bold', family: "'Inter', sans-serif" },
        bodyFont: { size: 13, family: "'Inter', sans-serif" },
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        usePointStyle: true,
        cornerRadius: 8
      },
      doughnutCenterText: {
        display: true,
        text: formatCurrency(categoryData.reduce((sum, item) => sum + item.amount, 0)),
        subText: 'Total Expenses'
      }
    },
    onClick: (e, elements) => {
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
            window.currentSelectedCategory = category;
            filterTransactionsByCategory(category);
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 800,
      easing: 'easeOutCirc'
    }
  };
  
  // Register plugin for center text
  Chart.register({
    id: 'doughnutCenterText',
    beforeDraw: chart => {
      if (chart.config.type === 'doughnut' && chart.config.options.plugins.doughnutCenterText?.display) {
        const {ctx, width, height} = chart;
        ctx.save();
        
        // Draw white inner circle
        ctx.beginPath();
        ctx.fillStyle = '#ffffff';
        ctx.arc(width/2, height/2, chart.innerRadius * 0.9, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw main text
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `600 ${Math.min(width, height) / 16}px 'Inter', sans-serif`;
        ctx.fillStyle = '#333333';
        ctx.fillText(chart.config.options.plugins.doughnutCenterText.text, width/2, height/2 - 10);
        
        // Draw subtext
        ctx.font = `500 ${Math.min(width, height) / 30}px 'Inter', sans-serif`;
        ctx.fillStyle = '#666666';
        ctx.fillText(chart.config.options.plugins.doughnutCenterText.subText, width/2, height/2 + 15);
        
        ctx.restore();
      }
    }
  });
  
  // Create or update chart
  if (chart) {
    chart.destroy();
  }
  chart = new Chart(categoryChart.getContext('2d'), {
    type: 'doughnut',
    data: data,
    options: options
  });
}

// Utility function to adjust color brightness for hover effects
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
  // Get active filter
  const activeFilter = document.querySelector('.category-pill.active');
  const filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
  
  // Filter transactions to expenses only
  let filteredTransactions = transactions.filter(t => t.type === 'expense');
  
  // Apply category filter if not showing all
  if (filter !== 'all' && filter !== 'more') {
    filteredTransactions = filteredTransactions.filter(t => t.category === filter);
  } else if (filter === 'more' && window.currentSelectedCategory) {
    if (window.currentSelectedCategory !== 'all' && window.currentSelectedCategory !== 'more') {
      filteredTransactions = filteredTransactions.filter(t => t.category === window.currentSelectedCategory);
    }
  }
  
  // Calculate total for each category
  const categoryTotals = new Map();
  filteredTransactions.forEach(transaction => {
    const category = transaction.category || 'others';
    const currentTotal = categoryTotals.get(category) || 0;
    categoryTotals.set(category, currentTotal + transaction.amount);
  });
  
  // Category colors
  const colors = {
    food: '#ff9800',         // Orange
    shopping: '#9c27b0',     // Purple
    housing: '#03a9f4',      // Light Blue
    transportation: '#2196f3',// Blue
    vehicle: '#424242',      // Dark Gray
    entertainment: '#e91e63', // Pink
    communication: '#673ab7', // Deep Purple
    technology: '#4caf50',   // Green
    healthcare: '#f44336',   // Red
    education: '#009688',    // Teal
    travel: '#ffc107',       // Amber
    gifts: '#8bc34a',        // Light Green
    others: '#9e9e9e'        // Gray
  };
  
  // Convert to array and sort by amount (descending)
  return Array.from(categoryTotals.entries())
    .map(([category, amount]) => {
      const { icon } = getCategoryIcon(category);
      return {
        name: getCategoryDisplayName(category),
        category,
        amount,
        color: colors[category] || '#9e9e9e',
        icon
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

// Get a user-friendly display name for a category
function getCategoryDisplayName(category) {
  const displayNames = {
    // Income categories
    salary: 'Salary & Wages',
    investments: 'Investments',
    freelance: 'Freelance',
    gifts_received: 'Gifts Received',
    refunds: 'Refunds',
    other_income: 'Other Income',
    
    // Expense categories
    food: 'Food & Dining',
    shopping: 'Shopping',
    housing: 'Housing & Rent',
    transportation: 'Transportation',
    vehicle: 'Vehicle',
    entertainment: 'Entertainment',
    communication: 'Communication',
    technology: 'Technology',
    healthcare: 'Healthcare',
    education: 'Education',
    travel: 'Travel',
    gifts: 'Gifts & Donations',
    others: 'Others'
  };
  
  return displayNames[category] || capitalizeFirstLetter(category.replace('_', ' '));
}

function updateCategoryList() {
  if (!categoryContainer) return;
  
  // Clear previous list
  categoryContainer.innerHTML = '';
  
  // Get category data
  const categoryData = calculateCategoryData();
  
  // Show empty state if no data
  if (categoryData.length === 0) {
    categoryContainer.innerHTML = `
      <div class="category-empty-state">
        <i class="fas fa-filter"></i>
        <p>No transactions in this category</p>
      </div>`;
    return;
  }
  
  // Get current filter
  const activeFilter = document.querySelector('.category-pill.active');
  const currentFilter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
  
  // Add top 5 categories
  categoryData.slice(0, 5).forEach(item => {
    const totalAmount = categoryData.reduce((sum, c) => sum + c.amount, 0);
    const percentage = totalAmount > 0 ? Math.round((item.amount / totalAmount) * 100) : 0;
    
    const categoryItem = document.createElement('div');
    categoryItem.className = `category-item category-${item.category}`;
    
    // Highlight active category
    if (currentFilter === item.category || (currentFilter === 'all' && item === categoryData[0])) {
      categoryItem.classList.add('active-category');
    }
    
    // Make item clickable for filtering
    categoryItem.addEventListener('click', () => selectCategory(item.category));
    
    // Set color
    categoryItem.style.borderLeftColor = item.color;
    
    // Add content
    categoryItem.innerHTML = `
      <div class="category-label">
        <div class="category-icon-small category-${item.category}">
          <i class="${item.icon}"></i>
        </div>
        <span>${item.name}</span>
      </div>
      <div class="category-percentage">
        <span>${percentage}%</span>
        <div class="amount-detail">${formatCurrency(item.amount)}</div>
      </div>`;
    
    categoryContainer.appendChild(categoryItem);
  });
  
  // Add "View All" button if needed
  if (categoryData.length > 5) {
    const viewAllItem = document.createElement('div');
    viewAllItem.className = 'category-view-all';
    viewAllItem.innerHTML = `
      <span>View All Categories (${categoryData.length})</span>
      <i class="fas fa-chevron-right"></i>`;
    
    viewAllItem.addEventListener('click', () => selectCategory('all'));
    categoryContainer.appendChild(viewAllItem);
  }
}

// Helper function to select category
function selectCategory(category) {
  const pill = document.querySelector(`.category-pill[data-filter="${category}"]`);
  if (pill) {
    pill.click();
  } else if (category !== 'all') {
    const morePill = document.querySelector('.category-pill[data-filter="more"]');
    if (morePill) {
      categoryPills.forEach(p => p.classList.remove('active'));
      morePill.classList.add('active');
      window.currentSelectedCategory = category;
      filterTransactionsByCategory(category);
    }
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
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

// Update spending by category
function updateSpendingByCategory() {
  if (!spendingChartCanvas || !categoryContainer) return;
  
  // Get category data
  const categoryData = calculateCategoryData();
  const totalExpenses = categoryData.reduce((total, item) => total + item.amount, 0);
  
  // Clear container
  categoryContainer.innerHTML = '';
  
  // Show empty state if no data
  if (categoryData.length === 0) {
    categoryContainer.innerHTML = '<div class="no-data">No expense data available</div>';
    
    if (spendingChart) {
      spendingChart.destroy();
      spendingChart = null;
    }
    return;
  }
  
  // Prepare chart data
  const chartData = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderColor: 'white',
      borderWidth: 1,
      hoverOffset: 5
    }]
  };
  
  // Get top categories (limited to 5 for display)
  categoryData.slice(0, 5).forEach(category => {
    const percentage = totalExpenses ? ((category.amount / totalExpenses) * 100).toFixed(1) : 0;
    if (parseFloat(percentage) === 0) return;
    
    // Add to chart data
    chartData.labels.push(category.name);
    chartData.datasets[0].data.push(percentage);
    chartData.datasets[0].backgroundColor.push(category.color);
    
    // Create category item
    const categoryItem = document.createElement('div');
    categoryItem.className = 'category-item';
    categoryItem.innerHTML = `
      <div class="category-name">
        <div class="color-indicator" style="background-color: ${category.color};"></div>
        <span>${category.name}</span>
      </div>
      <div class="category-percentage">
        <span>${percentage}%</span>
        <div class="amount-detail">₹${formatCurrency(category.amount)}</div>
      </div>
    `;
    
    categoryContainer.appendChild(categoryItem);
  });
  
  // Add "View All" if we have more categories
  if (categoryData.length > 5) {
    const viewAll = document.createElement('div');
    viewAll.className = 'category-view-all';
    viewAll.innerHTML = `<span>View All Categories (${categoryData.length})</span><i class="fas fa-chevron-right"></i>`;
    viewAll.addEventListener('click', () => {
      const allPill = document.querySelector('.category-pill[data-filter="all"]');
      if (allPill) allPill.click();
    });
    categoryContainer.appendChild(viewAll);
  }
  
  // Create or update chart
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw;
            return `${label}: ${value}%`;
          }
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#333',
        bodyColor: '#555',
        padding: 10,
        cornerRadius: 6
      }
    },
    animation: {
      animateRotate: true,
      duration: 800
    }
  };
  
  if (spendingChart) {
    spendingChart.data = chartData;
    spendingChart.update();
  } else {
    spendingChart = new Chart(spendingChartCanvas, {
      type: 'doughnut',
      data: chartData,
      options: chartOptions
    });
  }
}

// Functions to run when dashboard loads or transactions change
function updateDashboard() {
  calculateTotalBalance();
  updateBalanceDisplay();
  updateStatistics();
  renderTransactions();
  updateSpendingByCategory();
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
  // Load transactions from localStorage
  loadTransactions();
  
  // Initialize the dashboard
  updateDashboard();
  
  // ... existing code ...
});

// Update transactions after adding, editing or deleting
function updateTransactions() {
  // Save transactions to localStorage
  localStorage.setItem('transactions', JSON.stringify(transactions));
  
  // Update dashboard
  updateDashboard();
  
  // Close modal
  closeModal(transactionModal);
}

// Format date nicely
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Get category icon and color
function getCategoryIcon(category, type = 'expense') {
  const categoryIcons = {
    // Income categories
    'salary': { icon: 'fas fa-briefcase', color: '#4caf50', name: 'Salary & Wages' },
    'investments': { icon: 'fas fa-chart-line', color: '#2196f3', name: 'Investments' },
    'freelance': { icon: 'fas fa-laptop', color: '#673ab7', name: 'Freelance' },
    'gifts_received': { icon: 'fas fa-gift', color: '#e91e63', name: 'Gifts Received' },
    'refunds': { icon: 'fas fa-undo', color: '#009688', name: 'Refunds' },
    'other_income': { icon: 'fas fa-money-bill-wave', color: '#8bc34a', name: 'Other Income' },
    
    // Expense categories
    'food': { icon: 'fas fa-utensils', color: '#ff9800', name: 'Food & Dining' },
    'shopping': { icon: 'fas fa-shopping-bag', color: '#9c27b0', name: 'Shopping' },
    'housing': { icon: 'fas fa-home', color: '#03a9f4', name: 'Housing & Rent' },
    'transportation': { icon: 'fas fa-bus', color: '#4caf50', name: 'Transportation' },
    'vehicle': { icon: 'fas fa-car', color: '#795548', name: 'Vehicle' },
    'entertainment': { icon: 'fas fa-film', color: '#e91e63', name: 'Entertainment' },
    'communication': { icon: 'fas fa-phone', color: '#9e9e9e', name: 'Communication' },
    'technology': { icon: 'fas fa-laptop', color: '#607d8b', name: 'Technology' },
    'healthcare': { icon: 'fas fa-heartbeat', color: '#f44336', name: 'Healthcare' },
    'education': { icon: 'fas fa-graduation-cap', color: '#ff5722', name: 'Education' },
    'travel': { icon: 'fas fa-plane', color: '#3f51b5', name: 'Travel' },
    'gifts': { icon: 'fas fa-gift', color: '#e91e63', name: 'Gifts & Donations' },
    'others': { icon: 'fas fa-ellipsis-h', color: '#9e9e9e', name: 'Others' }
  };
  
  // Default icon if category not found
  const defaultIcon = type === 'income' 
    ? { icon: 'fas fa-money-bill-wave', color: '#4caf50', name: 'Income' }
    : { icon: 'fas fa-shopping-cart', color: '#f44336', name: 'Expense' };
  
  return categoryIcons[category] || defaultIcon;
} 
} 