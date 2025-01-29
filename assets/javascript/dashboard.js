// DOM Elements
const addTransactionBtn = document.getElementById('addTransactionBtn');
const transactionModal = document.getElementById('transactionModal');
const transactionModalClose = document.getElementById('transactionModalClose');
const transactionForm = document.getElementById('transactionForm');
const transactionName = document.getElementById('transactionName');
const transactionAmount = document.getElementById('transactionAmount');
const transactionCategory = document.getElementById('transactionCategory');
const incomeBtn = document.getElementById('incomeBtn');
const expenseBtn = document.getElementById('expenseBtn');
const submitTransaction = document.getElementById('submitTransaction');
const transactionsList = document.getElementById('transactionsList');
const calculatorToggle = document.getElementById('calculatorToggle');
const calculatorPanel = document.getElementById('calculatorPanel');
const calculatorInput = document.getElementById('calculatorInput');
const useCalculatorResult = document.getElementById('useCalculatorResult');
const totalBalance = document.getElementById('totalBalance');
const totalIncome = document.getElementById('totalIncome');
const totalExpenses = document.getElementById('totalExpenses');
const netSavings = document.getElementById('netSavings');

// Initial balance
const initialBalance = 0;

// Transactions array
let transactions = [];

// Calculator current calculation
let currentCalculation = '';

// Transaction type
let transactionType = 'income';

// Load transactions from localStorage
function loadTransactions() {
  const savedTransactions = localStorage.getItem('transactions');
  if (savedTransactions) {
    transactions = JSON.parse(savedTransactions);
    renderTransactions();
    calculateTotalBalance();
  }
}

// Calculate total balance and update display
function calculateTotalBalance() {
  let balance = initialBalance;
  let income = 0;
  let expenses = 0;
  
  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      balance += parseFloat(transaction.amount);
      income += parseFloat(transaction.amount);
    } else {
      balance -= parseFloat(transaction.amount);
      expenses += parseFloat(transaction.amount);
    }
  });
  
  const savings = income - expenses;
  
  // Update UI
  updateBalanceDisplay(balance);
  updateStatistics(income, expenses, savings);
}

// Update balance display
function updateBalanceDisplay(balance) {
  totalBalance.textContent = formatCurrency(balance);
}

// Update statistics cards
function updateStatistics(income, expenses, savings) {
  totalIncome.textContent = formatCurrency(income);
  totalExpenses.textContent = formatCurrency(expenses);
  netSavings.textContent = formatCurrency(savings);
}

// Format currency
function formatCurrency(amount) {
  return '₹' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Load budget categories for transaction form
function loadCategories() {
  const savedCategories = localStorage.getItem('budgetCategories');
  if (savedCategories) {
    const categories = JSON.parse(savedCategories);
    
    // Clear existing options except the default
    while (transactionCategory.options.length > 1) {
      transactionCategory.remove(1);
    }
    
    // Add categories as options
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.name;
      option.textContent = category.name;
      transactionCategory.appendChild(option);
    });
  }
}

// Update budgets when adding expense transactions
function updateBudgetCategories(transactionName, transactionAmount, categoryName) {
  if (!categoryName) return;
  
  const savedCategories = localStorage.getItem('budgetCategories');
  if (savedCategories) {
    const categories = JSON.parse(savedCategories);
    
    // Find the category
    const categoryIndex = categories.findIndex(c => c.name === categoryName);
    if (categoryIndex !== -1) {
      // Update spent amount
      categories[categoryIndex].spent = (parseFloat(categories[categoryIndex].spent) || 0) + parseFloat(transactionAmount);
      
      // Save updated categories
      localStorage.setItem('budgetCategories', JSON.stringify(categories));
    }
  }
}

// Render transactions
function renderTransactions() {
  // Clear the list
  transactionsList.innerHTML = '';
  
  if (transactions.length === 0) {
    // Show empty state
    transactionsList.innerHTML = `
      <div class="no-transactions">
        <i class="fas fa-receipt"></i>
        <p>No transactions yet</p>
      </div>
    `;
    return;
  }
  
  // Add transactions to the list
  transactions.forEach(transaction => {
    const transactionItem = document.createElement('div');
    transactionItem.className = 'transaction-item';
    
    const transactionDate = new Date(transaction.date);
    const formattedDate = transactionDate.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    let transactionHTML = `
      <div class="transaction-details">
        <div class="transaction-icon ${transaction.type === 'income' ? 'income-icon' : 'expense-icon'}">
          <i class="fas ${transaction.type === 'income' ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
        </div>
        <div class="transaction-info">
          <h4>${transaction.name}</h4>
          <div class="transaction-date">${formattedDate}</div>`;
    
    // Add category if it exists
    if (transaction.category) {
      transactionHTML += `
          <div class="transaction-category">
            <i class="fas fa-tag"></i> ${transaction.category}
          </div>`;
    }
    
    transactionHTML += `
        </div>
      </div>
      <div class="transaction-amount ${transaction.type === 'income' ? 'income-amount' : 'expense-amount'}">
        ${formatCurrency(transaction.amount)}
        <div class="transaction-actions">
          <div class="edit-transaction" data-id="${transaction.id}"><i class="fas fa-edit"></i></div>
          <div class="delete-transaction" data-id="${transaction.id}"><i class="fas fa-trash"></i></div>
        </div>
      </div>
    `;
    
    transactionItem.innerHTML = transactionHTML;
    transactionsList.appendChild(transactionItem);
    
    // Add event listeners for edit and delete
    const editBtn = transactionItem.querySelector('.edit-transaction');
    const deleteBtn = transactionItem.querySelector('.delete-transaction');
    
    editBtn.addEventListener('click', function() {
      const id = this.dataset.id;
      editTransaction(Number(id));
    });
    
    deleteBtn.addEventListener('click', function() {
      const id = this.dataset.id;
      deleteTransaction(Number(id));
    });
  });
}

// Function to edit a transaction
function editTransaction(id) {
  // Find the transaction
  const transaction = transactions.find(t => t.id === id);
  if (!transaction) return;
  
  // Set form values
  transactionName.value = transaction.name;
  transactionAmount.value = transaction.amount;
  
  // Set transaction type
  transactionType = transaction.type;
  if (transaction.type === 'income') {
    incomeBtn.classList.add('active');
    expenseBtn.classList.remove('active');
  } else {
    expenseBtn.classList.add('active');
    incomeBtn.classList.remove('active');
  }
  
  // Set category if it exists
  if (transaction.category) {
    transactionCategory.value = transaction.category;
  } else {
    transactionCategory.value = '';
  }
  
  // Set edit ID
  submitTransaction.dataset.editId = id;
  submitTransaction.textContent = 'Update Transaction';
  
  // Open modal
  transactionModal.classList.add('active');
  
  // Focus on name input
  setTimeout(() => {
    transactionName.focus();
  }, 300);
}

// Function to delete a transaction
function deleteTransaction(id) {
  if (confirm('Are you sure you want to delete this transaction?')) {
    // Find the transaction to check if it's an expense with a category
    const transaction = transactions.find(t => t.id === id);
    
    if (transaction && transaction.type === 'expense' && transaction.category) {
      // Revert the amount from the budget category
      const savedCategories = localStorage.getItem('budgetCategories');
      if (savedCategories) {
        const categories = JSON.parse(savedCategories);
        const categoryIndex = categories.findIndex(c => c.name === transaction.category);
        
        if (categoryIndex !== -1) {
          // Subtract the amount from the spent
          categories[categoryIndex].spent = Math.max(
            0, 
            (parseFloat(categories[categoryIndex].spent) || 0) - parseFloat(transaction.amount)
          );
          
          // Save updated categories
          localStorage.setItem('budgetCategories', JSON.stringify(categories));
        }
      }
    }
    
    // Remove from transactions array
    transactions = transactions.filter(t => t.id !== id);
    
    // Save to localStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // Update UI
    renderTransactions();
    calculateTotalBalance();
  }
}

// Add transaction function
function addTransaction() {
  const name = transactionName.value.trim();
  const amount = transactionAmount.value.trim();
  const category = transactionCategory.value;
  
  // Validate inputs
  let isValid = true;
  
  if (!name) {
    document.getElementById('nameError').classList.add('active');
    transactionName.focus();
    isValid = false;
  } else {
    document.getElementById('nameError').classList.remove('active');
  }
  
  if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
    document.getElementById('amountError').classList.add('active');
    if (isValid) {
      transactionAmount.focus();
    }
    isValid = false;
  } else {
    document.getElementById('amountError').classList.remove('active');
  }
  
  if (!isValid) {
    return;
  }
  
  // Check if we're editing or adding
  const editId = submitTransaction.dataset.editId;
  
  if (editId) {
    // Edit existing transaction
    const index = transactions.findIndex(t => t.id === Number(editId));
    
    if (index !== -1) {
      // Check if we need to update category spent
      const oldTransaction = transactions[index];
      
      // If it was an expense with a category, revert the old amount
      if (oldTransaction.type === 'expense' && oldTransaction.category) {
        const savedCategories = localStorage.getItem('budgetCategories');
        if (savedCategories) {
          const categories = JSON.parse(savedCategories);
          const categoryIndex = categories.findIndex(c => c.name === oldTransaction.category);
          
          if (categoryIndex !== -1) {
            // Subtract the old amount
            categories[categoryIndex].spent = Math.max(
              0, 
              (parseFloat(categories[categoryIndex].spent) || 0) - parseFloat(oldTransaction.amount)
            );
            
            // Save updated categories
            localStorage.setItem('budgetCategories', JSON.stringify(categories));
          }
        }
      }
      
      // Update transaction data but keep the original date and id
      transactions[index].name = name;
      transactions[index].amount = parseFloat(amount);
      transactions[index].type = transactionType;
      transactions[index].category = category;
      
      // If the updated transaction is an expense with a category, add the new amount
      if (transactionType === 'expense' && category) {
        updateBudgetCategories(name, amount, category);
      }
    }
    
    // Reset the edit ID
    delete submitTransaction.dataset.editId;
    submitTransaction.textContent = 'Add Transaction';
  } else {
    // Create new transaction
    const newTransaction = {
      id: Date.now(),
      name: name,
      amount: parseFloat(amount),
      type: transactionType,
      date: new Date().toISOString(),
      category: category
    };
    
    // Add to transactions array
    transactions.unshift(newTransaction); // Add to beginning of array
    
    // If this is an expense with a category, update the budget category
    if (transactionType === 'expense' && category) {
      updateBudgetCategories(name, amount, category);
    }
  }
  
  // Save to localStorage
  localStorage.setItem('transactions', JSON.stringify(transactions));
  
  // Calculate new total balance
  calculateTotalBalance();
  
  // Update UI
  renderTransactions();
  
  // Reset form
  transactionForm.reset();
  
  // Close modal
  transactionModal.classList.remove('active');
}

// Update Cash Flow Chart
function updateCashFlowDisplay() {
  const cashflowChartElement = document.getElementById('cashflowChart');
  if (!cashflowChartElement) return;
  
  const cashflowCtx = cashflowChartElement.getContext('2d');
  
  // Destroy existing chart if it exists
  if (window.cashflowChart) {
    window.cashflowChart.destroy();
  }
  
  // Get the last 7 days for the chart
  const days = 7;
  const labels = [];
  const incomeData = Array(days).fill(0);
  const expenseData = Array(days).fill(0);
  
  // Get date range
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days + 1);
  start.setHours(0, 0, 0, 0);
  
  // Create labels for the last 7 days
  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    labels.push(date.toLocaleDateString('en-IN', { weekday: 'short' }));
  }
  
  // Group transactions by day
  transactions.forEach(transaction => {
    const transactionDate = new Date(transaction.date);
    
    if (transactionDate >= start && transactionDate <= end) {
      const dayIndex = Math.floor((transactionDate - start) / (24 * 60 * 60 * 1000));
      
      if (dayIndex >= 0 && dayIndex < days) {
        if (transaction.type === 'income') {
          incomeData[dayIndex] += parseFloat(transaction.amount);
        } else {
          expenseData[dayIndex] += parseFloat(transaction.amount);
        }
      }
    }
  });
  
  // Create chart
  window.cashflowChart = new Chart(cashflowCtx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Expenses',
          data: expenseData,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            color: 'rgba(200, 200, 200, 0.2)'
          },
          ticks: {
            callback: function(value) {
              return '₹' + value;
            }
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              family: 'Inter, sans-serif'
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              label += formatCurrency(context.raw);
              return label;
            }
          }
        }
      }
    }
  });
}

// Calculator functionality
function initializeCalculator() {
  // Toggle calculator panel
  if (calculatorToggle) {
    calculatorToggle.addEventListener('click', function() {
      calculatorPanel.classList.toggle('active');
      if (calculatorPanel.classList.contains('active')) {
        calculatorInput.focus();
      }
    });
  }
  
  // Use calculator result
  if (useCalculatorResult) {
    useCalculatorResult.addEventListener('click', function() {
      if (calculatorInput.value && calculatorInput.value !== 'Error') {
        transactionAmount.value = calculatorInput.value;
        calculatorPanel.classList.remove('active');
      }
    });
  }
  
  // Calculator button click handlers
  document.querySelectorAll('.calc-btn').forEach(button => {
    button.addEventListener('click', function() {
      const value = this.textContent;
      
      // Handle different button types
      if (this.classList.contains('number') || this.classList.contains('operator')) {
        // Replace operator symbols for calculation
        let calcValue = value;
        
        if (value === '×') {
          calcValue = '*';
        } else if (value === '÷') {
          calcValue = '/';
        }
        
        currentCalculation += calcValue;
        calculatorInput.value = currentCalculation;
      } 
      else if (this.classList.contains('clear')) {
        // Clear the input
        currentCalculation = '';
        calculatorInput.value = '';
      } 
      else if (this.classList.contains('delete')) {
        // Delete the last character
        currentCalculation = currentCalculation.slice(0, -1);
        calculatorInput.value = currentCalculation;
      } 
      else if (this.classList.contains('equals')) {
        // Calculate the result
        try {
          const result = eval(currentCalculation);
          
          if (isNaN(result) || !isFinite(result)) {
            calculatorInput.value = 'Error';
            currentCalculation = '';
          } else {
            const roundedResult = parseFloat(result.toFixed(2));
            calculatorInput.value = roundedResult;
            currentCalculation = roundedResult.toString();
          }
        } catch (error) {
          calculatorInput.value = 'Error';
          currentCalculation = '';
        }
      }
    });
  });
}

// Initialize event listeners
function initializeEventListeners() {
  // Navigation
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }
  
  document.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar && window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else if (navbar) {
      navbar.classList.remove('scrolled');
    }
  });
  
  // Open modal when clicking add button
  if (addTransactionBtn) {
    addTransactionBtn.addEventListener('click', function() {
      transactionModal.classList.add('active');
      
      // Reset form
      transactionForm.reset();
      
      // Reset calculator
      if (calculatorPanel) {
        currentCalculation = '';
        calculatorInput.value = '';
        calculatorPanel.classList.remove('active');
      }
      
      // Set default transaction type
      transactionType = 'income';
      incomeBtn.classList.add('active');
      expenseBtn.classList.remove('active');
      
      // Reset edit state
      if (submitTransaction.dataset.editId) {
        delete submitTransaction.dataset.editId;
        submitTransaction.textContent = 'Add Transaction';
      }
      
      setTimeout(() => {
        transactionName.focus();
      }, 300);
    });
  }
  
  // Close modal when clicking the X
  if (transactionModalClose) {
    transactionModalClose.addEventListener('click', function() {
      transactionModal.classList.remove('active');
      if (calculatorPanel) {
        calculatorPanel.classList.remove('active');
      }
    });
  }
  
  // Close modal when clicking outside
  if (transactionModal) {
    transactionModal.addEventListener('click', function(e) {
      if (e.target === transactionModal) {
        transactionModal.classList.remove('active');
        if (calculatorPanel) {
          calculatorPanel.classList.remove('active');
        }
      }
    });
  }
  
  // Transaction type toggle
  if (incomeBtn && expenseBtn) {
    incomeBtn.addEventListener('click', function() {
      transactionType = 'income';
      incomeBtn.classList.add('active');
      expenseBtn.classList.remove('active');
    });
    
    expenseBtn.addEventListener('click', function() {
      transactionType = 'expense';
      expenseBtn.classList.add('active');
      incomeBtn.classList.remove('active');
    });
  }
  
  // Input validation - only allow numbers and decimals
  if (transactionAmount) {
    transactionAmount.addEventListener('input', function() {
      this.value = this.value.replace(/[^0-9.]/g, '');
    });
  }
  
  // Form submission
  if (submitTransaction) {
    submitTransaction.addEventListener('click', addTransaction);
  }
  
  if (transactionForm) {
    transactionForm.addEventListener('submit', function(e) {
      e.preventDefault();
      addTransaction();
    });
  }
  
  // Initialize calculator if present
  if (calculatorToggle && calculatorPanel) {
    initializeCalculator();
  }
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
  loadTransactions();
  loadCategories();
  calculateTotalBalance();
  updateCashFlowDisplay();
  initializeEventListeners();
}); 