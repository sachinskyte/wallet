// DOM Elements
const addCategoryBtn = document.getElementById('addCategoryBtn');
const emptyStateAddBtn = document.getElementById('emptyStateAddBtn');
const categoryModal = document.getElementById('categoryModal');
const categoryModalClose = document.getElementById('categoryModalClose');
const categoryForm = document.getElementById('categoryForm');
const categoryName = document.getElementById('categoryName');
const categoryAmount = document.getElementById('categoryAmount');
const submitCategory = document.getElementById('submitCategory');
const categoriesList = document.getElementById('categoriesList');
const emptyState = document.getElementById('emptyState');
const categoryModalTitle = document.getElementById('categoryModalTitle');
const iconSelector = document.getElementById('iconSelector');

// Add expense related elements
const addExpenseBtn = document.getElementById('addExpenseBtn');
const expenseModal = document.getElementById('expenseModal');
const expenseModalClose = document.getElementById('expenseModalClose');
const expenseForm = document.getElementById('expenseForm');
const expenseName = document.getElementById('expenseName');
const expenseAmount = document.getElementById('expenseAmount');
const expenseCategory = document.getElementById('expenseCategory');
const expenseDate = document.getElementById('expenseDate');
const submitExpense = document.getElementById('submitExpense');
const expenseCalculatorToggle = document.getElementById('expenseCalculatorToggle');
const expenseCalculatorPanel = document.getElementById('expenseCalculatorPanel');
const calculatorInput = document.getElementById('calculatorInput');
const useCalculatorResult = document.getElementById('useCalculatorResult');

// Monthly spending elements
const prevMonth = document.getElementById('prevMonth');
const nextMonth = document.getElementById('nextMonth');
const currentMonthDisplay = document.getElementById('currentMonth');
const monthlyTransactionsList = document.getElementById('monthlyTransactionsList');
const emptyTransactionsState = document.getElementById('emptyTransactionsState');
const spendingChartCanvas = document.getElementById('spendingChart');

// Budget Categories Management
let categories = [];
let selectedIcon = 'fa-home';
let editingCategoryId = null;

// Calculator variables
let currentCalculation = '';

// Chart instance
let spendingChart = null;

// Current month for viewing (0-based: 0 = January)
let viewMonth = new Date().getMonth();
let viewYear = new Date().getFullYear();

// Month names for display
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Navigation functionality
function initNavigation() {
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
}

// Format currency function
function formatCurrency(amount) {
  return '₹' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Format date to YYYY-MM-DD for input value
function formatDateForInput(date) {
  const d = new Date(date);
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

// Load categories from localStorage
function loadCategories() {
  const savedCategories = localStorage.getItem('budgetCategories');
  if (savedCategories) {
    categories = JSON.parse(savedCategories);
    renderCategories();
    updateBudgetOverview();
  }
}

// Save categories to localStorage
function saveCategories() {
  localStorage.setItem('budgetCategories', JSON.stringify(categories));
}

// Render categories
function renderCategories() {
  if (!categoriesList) return;
  
  if (categories.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
  } else {
    if (emptyState) emptyState.style.display = 'none';
    
    // Clear existing categories (except empty state)
    const existingCategoryItems = document.querySelectorAll('.category-item');
    existingCategoryItems.forEach(item => {
      categoriesList.removeChild(item);
    });
    
    // Add category items
    categories.forEach(category => {
      const categoryItem = document.createElement('div');
      categoryItem.className = 'category-item';
      categoryItem.id = `category-${category.id}`;
      
      // Calculate percentage spent
      const spent = category.spent || 0;
      const percentSpent = category.budget > 0 ? (spent / category.budget) * 100 : 0;
      let progressClass = 'progress-healthy';
      
      if (percentSpent > 85) {
        progressClass = 'progress-danger';
      } else if (percentSpent > 70) {
        progressClass = 'progress-warning';
      }
      
      categoryItem.innerHTML = `
        <div class="category-header">
          <div class="category-title">
            <div class="category-icon"><i class="fas ${category.icon}"></i></div>
            ${category.name}
          </div>
          <div class="category-actions">
            <div class="edit-category" data-id="${category.id}"><i class="fas fa-edit"></i></div>
            <div class="delete-category" data-id="${category.id}"><i class="fas fa-trash"></i></div>
          </div>
        </div>
        <div class="category-budget">${formatCurrency(category.budget)}</div>
        <div class="progress-container">
          <div class="progress-bar ${progressClass}" style="width: ${percentSpent > 100 ? 100 : percentSpent}%"></div>
        </div>
        <div class="category-spent">
          <span>Spent: ${formatCurrency(spent)}</span>
          <span>${percentSpent.toFixed(1)}%</span>
        </div>
      `;
      
      categoriesList.insertBefore(categoryItem, emptyState);
      
      // Add event listeners to edit and delete buttons
      const editBtn = categoryItem.querySelector('.edit-category');
      const deleteBtn = categoryItem.querySelector('.delete-category');
      
      editBtn.addEventListener('click', () => {
        openEditCategoryModal(category.id);
      });
      
      deleteBtn.addEventListener('click', () => {
        deleteCategory(category.id);
      });
    });
  }
}

// Update budget overview
function updateBudgetOverview() {
  const totalBudgetElement = document.querySelector('.total-budget');
  const totalSpentElement = document.querySelector('.total-spent');
  const remainingBudgetElement = document.querySelector('.remaining-budget');
  
  if (!totalBudgetElement || !totalSpentElement || !remainingBudgetElement) return;
  
  let totalBudget = 0;
  let totalSpent = 0;
  
  categories.forEach(category => {
    totalBudget += parseFloat(category.budget);
    totalSpent += parseFloat(category.spent || 0);
  });
  
  const remainingBudget = totalBudget - totalSpent;
  
  totalBudgetElement.textContent = formatCurrency(totalBudget);
  totalSpentElement.textContent = formatCurrency(totalSpent);
  remainingBudgetElement.textContent = formatCurrency(remainingBudget);
}

// Category management functions
function openAddCategoryModal() {
  if (!categoryModal) return;
  
  categoryModalTitle.textContent = 'Add Budget Category';
  submitCategory.textContent = 'Add Category';
  editingCategoryId = null;
  
  // Reset form
  categoryForm.reset();
  
  // Reset icon selection
  document.querySelectorAll('.icon-option').forEach(option => {
    option.classList.remove('selected');
  });
  document.querySelector('.icon-option[data-icon="fa-home"]').classList.add('selected');
  selectedIcon = 'fa-home';
  
  // Show modal
  categoryModal.classList.add('active');
  
  // Focus on name input
  setTimeout(() => {
    categoryName.focus();
  }, 300);
}

function openEditCategoryModal(categoryId) {
  if (!categoryModal) return;
  
  const category = categories.find(c => c.id === categoryId);
  if (!category) return;
  
  categoryModalTitle.textContent = 'Edit Budget Category';
  submitCategory.textContent = 'Update Category';
  editingCategoryId = categoryId;
  
  // Populate form fields
  categoryName.value = category.name;
  categoryAmount.value = category.budget;
  
  // Set icon selection
  document.querySelectorAll('.icon-option').forEach(option => {
    option.classList.remove('selected');
  });
  const iconOption = document.querySelector(`.icon-option[data-icon="${category.icon}"]`);
  if (iconOption) {
    iconOption.classList.add('selected');
    selectedIcon = category.icon;
  } else {
    document.querySelector('.icon-option[data-icon="fa-home"]').classList.add('selected');
    selectedIcon = 'fa-home';
  }
  
  // Show modal
  categoryModal.classList.add('active');
  
  // Focus on name input
  setTimeout(() => {
    categoryName.focus();
  }, 300);
}

function addCategory() {
  const name = categoryName.value.trim();
  const budget = categoryAmount.value.trim();
  
  // Validate inputs
  let isValid = true;
  
  if (!name) {
    document.getElementById('nameError').classList.add('active');
    categoryName.focus();
    isValid = false;
  } else {
    document.getElementById('nameError').classList.remove('active');
  }
  
  if (!budget || isNaN(parseFloat(budget)) || parseFloat(budget) <= 0) {
    document.getElementById('amountError').classList.add('active');
    if (isValid) {
      categoryAmount.focus();
    }
    isValid = false;
  } else {
    document.getElementById('amountError').classList.remove('active');
  }
  
  if (!isValid) {
    return;
  }
  
  if (editingCategoryId !== null) {
    // Update existing category
    const index = categories.findIndex(c => c.id === editingCategoryId);
    
    if (index !== -1) {
      // Preserve the spent amount
      const spent = categories[index].spent || 0;
      
      categories[index] = {
        id: editingCategoryId,
        name: name,
        budget: parseFloat(budget),
        icon: selectedIcon,
        spent: spent
      };
    }
    
    editingCategoryId = null;
  } else {
    // Create new category
    const newCategory = {
      id: Date.now(),
      name: name,
      budget: parseFloat(budget),
      icon: selectedIcon,
      spent: 0
    };
    
    categories.push(newCategory);
  }
  
  // Save to localStorage
  saveCategories();
  
  // Update UI
  renderCategories();
  updateBudgetOverview();
  
  // Close modal
  categoryModal.classList.remove('active');
}

function deleteCategory(categoryId) {
  if (confirm('Are you sure you want to delete this category?')) {
    categories = categories.filter(c => c.id !== categoryId);
    
    // Save to localStorage
    saveCategories();
    
    // Update UI
    renderCategories();
    updateBudgetOverview();
  }
}

// Expense management functions
function populateCategoryDropdown() {
  if (!expenseCategory) return;
  
  // Clear existing options except the placeholder
  while (expenseCategory.options.length > 1) {
    expenseCategory.remove(1);
  }
  
  // Add categories as options
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    expenseCategory.appendChild(option);
  });
}

function openAddExpenseModal() {
  if (!expenseModal) return;
  
  // Reset form
  expenseForm.reset();
  
  // Set today's date as default
  expenseDate.value = formatDateForInput(new Date());
  
  // Populate category dropdown
  populateCategoryDropdown();
  
  // Reset calculator
  currentCalculation = '';
  calculatorInput.value = '';
  expenseCalculatorPanel.classList.remove('active');
  
  // Show modal
  expenseModal.classList.add('active');
  
  // Focus on name input
  setTimeout(() => {
    expenseName.focus();
  }, 300);
}

function recordExpense() {
  const name = expenseName.value.trim();
  const amount = expenseAmount.value.trim();
  const categoryId = expenseCategory.value;
  const date = expenseDate.value;
  
  // Validate inputs
  let isValid = true;
  
  if (!name) {
    document.getElementById('expenseNameError').classList.add('active');
    expenseName.focus();
    isValid = false;
  } else {
    document.getElementById('expenseNameError').classList.remove('active');
  }
  
  if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
    document.getElementById('expenseAmountError').classList.add('active');
    if (isValid) {
      expenseAmount.focus();
    }
    isValid = false;
  } else {
    document.getElementById('expenseAmountError').classList.remove('active');
  }
  
  if (!categoryId) {
    document.getElementById('expenseCategoryError').classList.add('active');
    if (isValid) {
      expenseCategory.focus();
    }
    isValid = false;
  } else {
    document.getElementById('expenseCategoryError').classList.remove('active');
  }
  
  if (!date) {
    document.getElementById('expenseDateError').classList.add('active');
    if (isValid) {
      expenseDate.focus();
    }
    isValid = false;
  } else {
    document.getElementById('expenseDateError').classList.remove('active');
  }
  
  if (!isValid) {
    return;
  }
  
  // Find category
  const categoryIndex = categories.findIndex(c => c.id === parseInt(categoryId));
  if (categoryIndex === -1) return;
  
  // Update category's spent amount
  const parsedAmount = parseFloat(amount);
  categories[categoryIndex].spent = (parseFloat(categories[categoryIndex].spent) || 0) + parsedAmount;
  
  // Save updated categories
  saveCategories();
  
  // Record transaction in the dashboard
  const newTransaction = {
    id: Date.now(),
    name: name,
    amount: parsedAmount,
    type: 'expense',
    date: new Date(date).toISOString(),
    category: categories[categoryIndex].name
  };
  
  // Get existing transactions from localStorage
  let transactions = [];
  const savedTransactions = localStorage.getItem('transactions');
  if (savedTransactions) {
    transactions = JSON.parse(savedTransactions);
  }
  
  // Add new transaction
  transactions.unshift(newTransaction); // Add to beginning of array
  
  // Save to localStorage
  localStorage.setItem('transactions', JSON.stringify(transactions));
  
  // Update UI
  renderCategories();
  updateBudgetOverview();
  updateMonthlySpending();
  
  // Show success message
  alert(`Expense of ${formatCurrency(parsedAmount)} added to ${categories[categoryIndex].name}`);
  
  // Close modal
  expenseModal.classList.remove('active');
}

// Monthly spending functions
function updateMonthDisplay() {
  if (!currentMonthDisplay) return;
  currentMonthDisplay.textContent = `${monthNames[viewMonth]} ${viewYear}`;
}

function goToPrevMonth() {
  viewMonth--;
  if (viewMonth < 0) {
    viewMonth = 11;
    viewYear--;
  }
  updateMonthDisplay();
  updateMonthlySpending();
}

function goToNextMonth() {
  viewMonth++;
  if (viewMonth > 11) {
    viewMonth = 0;
    viewYear++;
  }
  updateMonthDisplay();
  updateMonthlySpending();
}

function getMonthTransactions() {
  const startDate = new Date(viewYear, viewMonth, 1);
  const endDate = new Date(viewYear, viewMonth + 1, 0); // Last day of the month
  
  // Get transactions from localStorage
  let transactions = [];
  const savedTransactions = localStorage.getItem('transactions');
  if (savedTransactions) {
    transactions = JSON.parse(savedTransactions);
  }
  
  // Filter for expenses in the current month
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transaction.type === 'expense' && 
          transactionDate >= startDate && 
          transactionDate <= endDate;
  });
}

function getMonthSpendingByCategory() {
  const monthTransactions = getMonthTransactions();
  const spendingByCategory = {};
  
  // Group by category and sum amounts
  monthTransactions.forEach(transaction => {
    const category = transaction.category || 'Uncategorized';
    if (!spendingByCategory[category]) {
      spendingByCategory[category] = 0;
    }
    spendingByCategory[category] += parseFloat(transaction.amount);
  });
  
  return spendingByCategory;
}

function renderSpendingChart() {
  if (!spendingChartCanvas) return;
  
  const spendingByCategory = getMonthSpendingByCategory();
  
  // Prepare data for chart
  const categories = Object.keys(spendingByCategory);
  const amounts = Object.values(spendingByCategory);
  
  // Generate colors for each category
  const backgroundColors = categories.map((_, index) => {
    // Generate a color based on the index
    const hue = (index * 137) % 360; // Golden ratio to spread colors nicely
    return `hsl(${hue}, 70%, 60%)`;
  });
  
  // Destroy existing chart if it exists
  if (spendingChart) {
    spendingChart.destroy();
  }
  
  // Create new chart
  if (categories.length > 0) {
    spendingChart = new Chart(spendingChartCanvas, {
      type: 'doughnut',
      data: {
        labels: categories,
        datasets: [{
          data: amounts,
          backgroundColor: backgroundColors,
          borderColor: 'rgba(255, 255, 255, 0.8)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {
                family: 'Inter, sans-serif'
              },
              color: '#333'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${formatCurrency(value)}`;
              }
            }
          }
        },
        cutout: '70%'
      }
    });
  }
}

function renderMonthlyTransactions() {
  if (!monthlyTransactionsList || !emptyTransactionsState) return;
  
  const monthTransactions = getMonthTransactions();
  
  // Clear existing transactions
  while (monthlyTransactionsList.firstChild) {
    if (monthlyTransactionsList.firstChild === emptyTransactionsState) break;
    monthlyTransactionsList.removeChild(monthlyTransactionsList.firstChild);
  }
  
  // Show or hide empty state
  if (monthTransactions.length === 0) {
    emptyTransactionsState.style.display = 'block';
  } else {
    emptyTransactionsState.style.display = 'none';
    
    // Add transactions to the list
    monthTransactions.forEach(transaction => {
      const transactionItem = document.createElement('div');
      transactionItem.className = 'transaction-item';
      
      const transactionDate = new Date(transaction.date);
      const formattedDate = transactionDate.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      transactionItem.innerHTML = `
        <div class="transaction-details">
          <div class="transaction-icon expense-icon">
            <i class="fas fa-arrow-down"></i>
          </div>
          <div class="transaction-info">
            <h4>${transaction.name}</h4>
            <div class="transaction-date">${formattedDate}</div>
          </div>
        </div>
        <div class="transaction-amount">${formatCurrency(transaction.amount)}</div>
      `;
      
      monthlyTransactionsList.insertBefore(transactionItem, emptyTransactionsState);
    });
  }
}

function updateMonthlySpending() {
  renderSpendingChart();
  renderMonthlyTransactions();
}

// Calculator functionality
function initializeCalculator() {
  if (!expenseCalculatorToggle || !expenseCalculatorPanel) return;
  
  // Toggle calculator panel
  expenseCalculatorToggle.addEventListener('click', function() {
    expenseCalculatorPanel.classList.toggle('active');
    if (expenseCalculatorPanel.classList.contains('active')) {
      calculatorInput.focus();
    }
  });
  
  // Use calculator result
  if (useCalculatorResult) {
    useCalculatorResult.addEventListener('click', function() {
      if (calculatorInput.value && calculatorInput.value !== 'Error') {
        expenseAmount.value = calculatorInput.value;
        expenseCalculatorPanel.classList.remove('active');
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

// Event listeners setup
function setupEventListeners() {
  // Category modal
  if (addCategoryBtn) {
    addCategoryBtn.addEventListener('click', openAddCategoryModal);
  }
  
  if (emptyStateAddBtn) {
    emptyStateAddBtn.addEventListener('click', openAddCategoryModal);
  }
  
  if (categoryModalClose) {
    categoryModalClose.addEventListener('click', function() {
      categoryModal.classList.remove('active');
    });
  }
  
  if (categoryModal) {
    categoryModal.addEventListener('click', function(e) {
      if (e.target === categoryModal) {
        categoryModal.classList.remove('active');
      }
    });
  }
  
  if (submitCategory) {
    submitCategory.addEventListener('click', addCategory);
  }
  
  if (categoryForm) {
    categoryForm.addEventListener('submit', function(e) {
      e.preventDefault();
      addCategory();
    });
  }
  
  // Icon selection
  if (iconSelector) {
    iconSelector.addEventListener('click', function(e) {
      const iconOption = e.target.closest('.icon-option');
      if (!iconOption) return;
      
      document.querySelectorAll('.icon-option').forEach(option => {
        option.classList.remove('selected');
      });
      
      iconOption.classList.add('selected');
      selectedIcon = iconOption.dataset.icon;
    });
  }
  
  // Input validation
  if (categoryAmount) {
    categoryAmount.addEventListener('input', function() {
      this.value = this.value.replace(/[^0-9.]/g, '');
    });
  }
  
  // Expense modal
  if (addExpenseBtn) {
    addExpenseBtn.addEventListener('click', openAddExpenseModal);
  }
  
  if (expenseModalClose) {
    expenseModalClose.addEventListener('click', function() {
      expenseModal.classList.remove('active');
      expenseCalculatorPanel.classList.remove('active');
    });
  }
  
  if (expenseModal) {
    expenseModal.addEventListener('click', function(e) {
      if (e.target === expenseModal) {
        expenseModal.classList.remove('active');
        expenseCalculatorPanel.classList.remove('active');
      }
    });
  }
  
  if (submitExpense) {
    submitExpense.addEventListener('click', recordExpense);
  }
  
  if (expenseForm) {
    expenseForm.addEventListener('submit', function(e) {
      e.preventDefault();
      recordExpense();
    });
  }
  
  if (expenseAmount) {
    expenseAmount.addEventListener('input', function() {
      this.value = this.value.replace(/[^0-9.]/g, '');
    });
  }
  
  // Monthly navigation
  if (prevMonth) {
    prevMonth.addEventListener('click', goToPrevMonth);
  }
  
  if (nextMonth) {
    nextMonth.addEventListener('click', goToNextMonth);
  }
}

// Initialize the budget page
document.addEventListener('DOMContentLoaded', function() {
  // Load sample data for demo
  function loadSampleData() {
    if (!localStorage.getItem('budgetCategories')) {
      categories = [
        {
          id: 1,
          name: 'Housing',
          budget: 15000,
          icon: 'fa-home',
          spent: 12500
        },
        {
          id: 2,
          name: 'Groceries',
          budget: 8000,
          icon: 'fa-shopping-cart',
          spent: 5600
        },
        {
          id: 3,
          name: 'Transportation',
          budget: 5000,
          icon: 'fa-car',
          spent: 4800
        },
        {
          id: 4,
          name: 'Entertainment',
          budget: 3000,
          icon: 'fa-film',
          spent: 1500
        },
        {
          id: 5,
          name: 'Dining Out',
          budget: 4000,
          icon: 'fa-utensils',
          spent: 3500
        }
      ];
      
      // Save to localStorage
      saveCategories();
    }
  }
  
  initNavigation();
  loadSampleData();
  loadCategories();
  setupEventListeners();
  initializeCalculator();
  
  // Set default date for expense modal
  if (expenseDate) {
    const today = new Date();
    expenseDate.value = formatDateForInput(today);
  }
  
  // Initialize monthly view
  updateMonthDisplay();
  updateMonthlySpending();
}); 