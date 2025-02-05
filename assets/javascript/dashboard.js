// DOM elements
const addTransactionBtn = document.querySelector('.add-transaction-btn');
const transactionModal = document.querySelector('#transactionModal');
const modalOverlay = document.querySelector('.modal-overlay');
const modalClose = document.querySelector('.modal-close');
const transactionForm = document.querySelector('#transactionForm');
const transactionTypeButtons = document.querySelectorAll('.type-option');
const transactionList = document.querySelector('.transaction-list');
const accountBalanceAmount = document.querySelector('.balance-amount');
const emptyState = document.querySelector('.empty-state');
const calculatorToggle = document.querySelector('.calculator-toggle');
const calculatorPanel = document.querySelector('.calculator-panel');
const calculatorDisplay = document.querySelector('.calculator-display');
const calculatorButtons = document.querySelectorAll('.calc-btn');
const useResultBtn = document.querySelector('.use-result-btn');
const amountInput = document.querySelector('#transactionAmount');
const incomeStatAmount = document.querySelector('.income-stat');
const expenseStatAmount = document.querySelector('.expense-stat');
const savingsStatAmount = document.querySelector('.savings-stat');

// App state
let transactions = [];
let currentEditId = null;
let selectedType = 'income';

// Initialize the app
function init() {
  loadTransactions();
  calculateTotalBalance();
  renderTransactions();
  setupEventListeners();
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
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

// Calculate total balance
function calculateTotalBalance() {
  let totalBalance = 0;
  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      totalBalance += transaction.amount;
      totalIncome += transaction.amount;
    } else {
      totalBalance -= transaction.amount;
      totalExpenses += transaction.amount;
    }
  });

  // Update balance display
  accountBalanceAmount.textContent = formatCurrency(totalBalance);
  
  // Update statistics
  updateStatistics(totalIncome, totalExpenses);
  
  return totalBalance;
}

// Update statistics for income, expenses, and savings
function updateStatistics(totalIncome, totalExpenses) {
  const netSavings = totalIncome - totalExpenses;
  
  incomeStatAmount.textContent = formatCurrency(totalIncome);
  expenseStatAmount.textContent = formatCurrency(totalExpenses);
  savingsStatAmount.textContent = formatCurrency(netSavings);
}

// Render transactions
function renderTransactions() {
  // Clear the transaction list
  transactionList.innerHTML = '';
  
  if (transactions.length === 0) {
    // Show empty state
    if (emptyState) {
      emptyState.style.display = 'flex';
    }
    transactionList.style.display = 'none';
    return;
  }
  
  // Hide empty state and show transaction list
  if (emptyState) {
    emptyState.style.display = 'none';
  }
  transactionList.style.display = 'block';
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  // Add each transaction to the list
  sortedTransactions.forEach(transaction => {
    const transactionItem = document.createElement('div');
    transactionItem.classList.add('transaction-item');
    transactionItem.setAttribute('data-id', transaction.id);
    
    const dateObj = new Date(transaction.date);
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
          <h3>${transaction.description}</h3>
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
    
    transactionList.appendChild(transactionItem);
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
    document.querySelector('#transactionDescription').value = transaction.description;
    document.querySelector('#transactionAmount').value = transaction.amount;
    document.querySelector('#transactionDate').value = transaction.date;
    
    // Set transaction type
    selectedType = transaction.type;
    transactionTypeButtons.forEach(button => {
      if (button.classList.contains(transaction.type)) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    
    // Set the current edit ID
    currentEditId = id;
    
    // Show the modal
    modalOverlay.classList.add('active');
  }
}

// Delete transaction
function deleteTransaction(event) {
  if (confirm('Are you sure you want to delete this transaction?')) {
    const id = event.currentTarget.getAttribute('data-id');
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions();
    calculateTotalBalance();
    renderTransactions();
  }
}

// Add transaction
function addTransaction(event) {
  event.preventDefault();
  
  // Get form values
  const description = document.querySelector('#transactionDescription').value.trim();
  const amount = parseFloat(document.querySelector('#transactionAmount').value);
  const date = document.querySelector('#transactionDate').value;
  
  // Validate form
  if (!description || isNaN(amount) || amount <= 0 || !date) {
    alert('Please fill in all fields correctly');
    return;
  }
  
  if (currentEditId) {
    // Update existing transaction
    const index = transactions.findIndex(t => t.id === currentEditId);
    if (index !== -1) {
      transactions[index] = {
        ...transactions[index],
        description,
        amount,
        date,
        type: selectedType
      };
    }
    currentEditId = null;
  } else {
    // Add new transaction
    const newTransaction = {
      id: Date.now().toString(),
      description,
      amount,
      date,
      type: selectedType
    };
    
    transactions.push(newTransaction);
  }
  
  // Save and update UI
  saveTransactions();
  calculateTotalBalance();
  renderTransactions();
  
  // Close modal and reset form
  closeModal();
  transactionForm.reset();
}

// Open modal
function openModal() {
  // Reset form
  transactionForm.reset();
  currentEditId = null;
  
  // Set default date to today
  const today = new Date().toISOString().split('T')[0];
  document.querySelector('#transactionDate').value = today;
  
  // Set default transaction type
  selectedType = 'income';
  transactionTypeButtons.forEach(button => {
    button.classList.toggle('active', button.classList.contains('income'));
  });
  
  // Show modal
  modalOverlay.classList.add('active');
}

// Close modal
function closeModal() {
  modalOverlay.classList.remove('active');
  calculatorPanel.classList.remove('active');
}

// Set up event listeners
function setupEventListeners() {
  // Add transaction button
  if (addTransactionBtn) {
    addTransactionBtn.addEventListener('click', openModal);
  }
  
  // Close modal
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  // Click outside modal to close
  window.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });
  
  // Transaction form submit
  if (transactionForm) {
    transactionForm.addEventListener('submit', addTransaction);
  }
  
  // Transaction type buttons
  transactionTypeButtons.forEach(button => {
    button.addEventListener('click', () => {
      transactionTypeButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      selectedType = button.classList.contains('income') ? 'income' : 'expense';
    });
  });
  
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
  
  // Use result button
  if (useResultBtn) {
    useResultBtn.addEventListener('click', () => {
      const result = calculatorDisplay.textContent;
      if (result && !isNaN(parseFloat(result))) {
        amountInput.value = parseFloat(result);
        calculatorPanel.classList.remove('active');
      }
    });
  }
  
  // Click outside calculator to close
  document.addEventListener('click', (event) => {
    const isClickInside = calculatorPanel.contains(event.target) || 
                         calculatorToggle.contains(event.target);
    
    if (!isClickInside && calculatorPanel.classList.contains('active')) {
      calculatorPanel.classList.remove('active');
    }
  });
}

// Handle calculator input
function handleCalculatorInput(event) {
  const value = event.target.dataset.value;
  
  if (!value) return;
  
  let currentDisplay = calculatorDisplay.textContent.trim();
  
  switch (value) {
    case 'clear':
      calculatorDisplay.textContent = '0';
      break;
    case 'delete':
      if (currentDisplay.length === 1 || currentDisplay === 'Error') {
        calculatorDisplay.textContent = '0';
      } else {
        calculatorDisplay.textContent = currentDisplay.slice(0, -1);
      }
      break;
    case 'equals':
      try {
        // Replace × with * and ÷ with /
        currentDisplay = currentDisplay.replace(/×/g, '*').replace(/÷/g, '/');
        const result = eval(currentDisplay);
        
        if (isNaN(result) || !isFinite(result)) {
          calculatorDisplay.textContent = 'Error';
        } else {
          // Round to 2 decimal places
          calculatorDisplay.textContent = Math.round(result * 100) / 100;
        }
      } catch (error) {
        calculatorDisplay.textContent = 'Error';
      }
      break;
    default:
      if (currentDisplay === '0' || currentDisplay === 'Error') {
        calculatorDisplay.textContent = value;
      } else {
        calculatorDisplay.textContent = currentDisplay + value;
      }
  }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init); 