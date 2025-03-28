// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
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

  // Initialize app
  init();

  function init() {
    // Load transactions
    loadTransactions();
    
    // Update UI
    calculateTotalBalance();
    renderTransactions();
    initializeGoalDisplay();
    
    // Set up event listeners
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
        totalBalanceAmount += parseFloat(transaction.amount);
        totalIncomeAmount += parseFloat(transaction.amount);
      } else {
        totalBalanceAmount -= parseFloat(transaction.amount);
        totalExpensesAmount += parseFloat(transaction.amount);
      }
    });

    // Update balance display
    if (accountBalance) {
      accountBalance.textContent = formatCurrency(totalBalanceAmount);
    }
    
    // Update statistics
    if (totalIncome) totalIncome.textContent = formatCurrency(totalIncomeAmount);
    if (totalExpenses) totalExpenses.textContent = formatCurrency(totalExpensesAmount);
    if (netSavings) netSavings.textContent = formatCurrency(totalIncomeAmount - totalExpensesAmount);
    
    updateGoalProgress();
    
    return totalBalanceAmount;
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
    
    // Calculate total savings
    let totalSavings = 0;
    
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totalSavings += parseFloat(transaction.amount);
      }
    });
    
    // Calculate percentage saved
    const savedAmount = Math.min(totalSavings, goal.amount);
    const percentage = Math.floor((savedAmount / goal.amount) * 100);
    
    // Update UI
    goalSavedElement.textContent = formatCurrency(savedAmount);
    goalPercentageElement.textContent = `${percentage}%`;
    goalProgressBar.style.width = `${percentage}%`;
    
    // Calculate ETA
    if (goal.date) {
      const targetDate = new Date(goal.date);
      const today = new Date();
      const daysLeft = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysLeft > 0) {
        goalEtaElement.textContent = `${daysLeft} days left`;
      } else {
        goalEtaElement.textContent = 'Goal date passed';
      }
    } else {
      goalEtaElement.textContent = 'No target date set';
    }
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
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp)
    );
    
    // Create transaction items
    sortedTransactions.forEach(transaction => {
      const transactionItem = document.createElement('div');
      
      transactionItem.className = 'transaction-item';
      transactionItem.dataset.id = transaction.id;
      
      transactionItem.innerHTML = `
        <div class="transaction-left">
          <div class="transaction-icon ${transaction.type === 'income' ? 'income-icon' : 'expense-icon'}">
            <i class="fas fa-arrow-${transaction.type === 'income' ? 'down' : 'up'}"></i>
          </div>
          <div class="transaction-details">
            <h3>${transaction.name || transaction.description}</h3>
            <div class="transaction-date">${formatDate(transaction.date || transaction.timestamp)}</div>
            <div class="transaction-category">
              <i class="fas fa-tag"></i>
              ${transaction.category || 'Uncategorized'}
            </div>
          </div>
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

  // Format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Setup event listeners
  function setupEventListeners() {
    // Toggle calculator
    if (calculatorToggle) {
      calculatorToggle.addEventListener('click', () => {
        calculatorPanel.classList.toggle('active');
      });
    }
    
    // Calculator buttons
    calculatorButtons.forEach(button => {
      button.addEventListener('click', () => {
        const buttonType = button.classList.contains('number') ? 'number' :
                          button.classList.contains('operator') ? 'operator' :
                          button.classList.contains('equals') ? 'equals' :
                          button.classList.contains('clear') ? 'clear' : 'delete';
                          
        const buttonValue = button.textContent.trim();
        
        if (buttonType === 'clear') {
          calculatorInput.value = '0';
        } else if (buttonType === 'delete') {
          calculatorInput.value = calculatorInput.value.slice(0, -1) || '0';
        } else if (buttonType === 'equals') {
          try {
            const result = eval(calculatorInput.value.replace(/×/g, '*').replace(/÷/g, '/'));
            calculatorInput.value = isFinite(result) ? result : 'Error';
          } catch (e) {
            calculatorInput.value = 'Error';
          }
        } else {
          if (calculatorInput.value === '0' || calculatorInput.value === 'Error') {
            calculatorInput.value = buttonValue;
          } else {
            calculatorInput.value += buttonValue;
          }
        }
      });
    });
    
    // Use calculator result
    if (useCalculatorResult) {
      useCalculatorResult.addEventListener('click', () => {
        if (calculatorInput.value !== 'Error' && transactionAmountInput) {
          transactionAmountInput.value = calculatorInput.value;
          calculatorPanel.classList.remove('active');
        }
      });
    }
    
    // Add transaction button
    if (addTransactionBtn) {
      addTransactionBtn.addEventListener('click', () => {
        openModal();
      });
    }
    
    // Close modal
    if (transactionModalClose) {
      transactionModalClose.addEventListener('click', () => {
        closeModal();
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
    if (submitTransaction) {
      submitTransaction.addEventListener('click', handleSubmitTransaction);
    }
    
    // Goal buttons
    if (setGoalBtn) {
      setGoalBtn.addEventListener('click', openGoalModal);
    }
    
    if (editGoalBtn) {
      editGoalBtn.addEventListener('click', () => {
        const goal = JSON.parse(localStorage.getItem('goal'));
        if (goal) {
          goalNameInput.value = goal.name;
          goalAmountInput.value = goal.amount;
          if (goal.date) goalDateInput.value = goal.date;
        }
        openGoalModal();
      });
    }
    
    if (cancelGoalBtn) {
      cancelGoalBtn.addEventListener('click', closeGoalModal);
    }
    
    if (goalForm) {
      goalForm.addEventListener('submit', handleGoalSubmit);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', event => {
      if (event.target === transactionModal) {
        closeModal();
      }
      
      if (event.target === goalModal) {
        closeGoalModal();
      }
    });
  }

  // Open transaction modal
  function openModal() {
    if (!transactionModal) return;
    
    // Reset form
    if (transactionForm) {
      transactionForm.reset();
    }
    
    // Reset transaction type
    selectedType = 'income';
    transactionTypeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.id === 'incomeBtn');
    });
    
    // Reset edit ID
    currentEditId = null;
    
    // Update button text
    if (submitTransaction) {
      submitTransaction.textContent = 'Add Transaction';
    }
    
    // Show modal
    transactionModal.classList.add('active');
  }

  // Close transaction modal
  function closeModal() {
    if (!transactionModal) return;
    
    transactionModal.classList.remove('active');
    
    // Reset calculator
    if (calculatorPanel) {
      calculatorPanel.classList.remove('active');
    }
  }

  // Open goal modal
  function openGoalModal() {
    if (!goalModal) return;
    
    goalModal.style.display = 'block';
  }

  // Close goal modal
  function closeGoalModal() {
    if (!goalModal) return;
    
    goalModal.style.display = 'none';
  }

  // Handle submit transaction
  function handleSubmitTransaction() {
    // Get form values
    const name = document.querySelector('#transactionName').value;
    const amount = parseFloat(document.querySelector('#transactionAmount').value);
    const category = document.querySelector('#transactionCategory').value;
    
    // Validate form
    if (!name || !amount || isNaN(amount) || amount <= 0 || !category) {
      alert('Please fill all fields correctly');
      return;
    }
    
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
          date: now.toISOString()
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
    
    // Save and update UI
    saveTransactions();
    calculateTotalBalance();
    renderTransactions();
    closeModal();
    
    // Provide feedback
    console.log(`Transaction ${currentEditId ? 'updated' : 'added'} successfully`);
  }

  // Handle goal submit
  function handleGoalSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const name = goalNameInput.value.trim();
    const amount = parseFloat(goalAmountInput.value);
    const date = goalDateInput.value || null;
    
    if (!name || !amount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid goal name and amount');
      return;
    }
    
    // Save goal
    const goal = { name, amount, date };
    localStorage.setItem('goal', JSON.stringify(goal));
    
    // Update UI
    initializeGoalDisplay();
    closeGoalModal();
  }

  // Edit transaction
  function editTransaction(e) {
    const id = e.currentTarget.getAttribute('data-id');
    const transaction = transactions.find(t => t.id === id);
    
    if (transaction) {
      // Set form values
      document.querySelector('#transactionName').value = transaction.name || transaction.description;
      document.querySelector('#transactionAmount').value = transaction.amount;
      document.querySelector('#transactionCategory').value = transaction.category || '';
      
      // Set transaction type
      selectedType = transaction.type;
      transactionTypeButtons.forEach(btn => {
        btn.classList.toggle('active', 
          (btn.id === 'incomeBtn' && transaction.type === 'income') || 
          (btn.id === 'expenseBtn' && transaction.type === 'expense')
        );
      });
      
      // Set edit ID
      currentEditId = id;
      
      // Update button text
      submitTransaction.textContent = 'Update Transaction';
      
      // Open modal
      openModal();
    }
  }

  // Delete transaction
  function deleteTransaction(e) {
    const id = e.currentTarget.getAttribute('data-id');
    
    if (confirm('Are you sure you want to delete this transaction?')) {
      transactions = transactions.filter(t => t.id !== id);
      
      // Save and update UI
      saveTransactions();
      calculateTotalBalance();
      renderTransactions();
    }
  }
});
