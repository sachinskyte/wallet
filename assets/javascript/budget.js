// DOM elements
const addCategoryBtn = document.querySelector('.add-category-btn');
const categoryModal = document.querySelector('#categoryModal');
const modalOverlay = document.querySelector('.modal-overlay');
const modalClose = document.querySelector('.modal-close');
const categoryForm = document.querySelector('#categoryForm');
const categoriesContainer = document.querySelector('.categories-container');
const addExpenseBtn = document.querySelector('.add-expense-btn');
const expenseModal = document.querySelector('#expenseModal');
const expenseForm = document.querySelector('#expenseForm');
const budgetTotalAmount = document.querySelector('.total-budget-card .overview-card-amount');
const spentAmount = document.querySelector('.spent-card .overview-card-amount');
const remainingAmount = document.querySelector('.remaining-card .overview-card-amount');
const progressFill = document.querySelector('.progress-fill');
const progressPercentage = document.querySelector('.progress-percentage');
const periodOptions = document.querySelectorAll('.period-option');
const emptyState = document.querySelector('.empty-state');
const spendingChartContainer = document.querySelector('.spending-chart-container');

// App state
let categories = [];
let expenses = [];
let selectedPeriod = 'month';
let spendingChart = null;

// Initialize the app
function init() {
  loadCategories();
  loadExpenses();
  renderCategories();
  updateBudgetOverview();
  renderSpendingChart();
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

// Load categories from localStorage
function loadCategories() {
  const savedCategories = localStorage.getItem('budgetCategories');
  if (savedCategories) {
    categories = JSON.parse(savedCategories);
  }
}

// Save categories to localStorage
function saveCategories() {
  localStorage.setItem('budgetCategories', JSON.stringify(categories));
}

// Load expenses from localStorage
function loadExpenses() {
  const savedExpenses = localStorage.getItem('budgetExpenses');
  if (savedExpenses) {
    expenses = JSON.parse(savedExpenses);
  }
}

// Save expenses to localStorage
function saveExpenses() {
  localStorage.setItem('budgetExpenses', JSON.stringify(expenses));
}

// Render budget categories
function renderCategories() {
  categoriesContainer.innerHTML = '';
  
  // Add the "add category" button first
  const addButtonDiv = document.createElement('div');
  addButtonDiv.classList.add('add-category-btn');
  addButtonDiv.innerHTML = `
    <i class="fas fa-plus"></i>
    <p>Add New Category</p>
  `;
  addButtonDiv.addEventListener('click', () => openCategoryModal());
  categoriesContainer.appendChild(addButtonDiv);
  
  if (categories.length === 0) {
    // Show empty state if needed
    if (emptyState) {
      emptyState.style.display = 'flex';
    }
    return;
  }
  
  // Hide empty state
  if (emptyState) {
    emptyState.style.display = 'none';
  }
  
  // Sort categories alphabetically
  const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));
  
  sortedCategories.forEach(category => {
    // Calculate spent amount for this category
    const spent = getCategorySpent(category.id);
    const budget = parseFloat(category.budget);
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;
    
    // Create category card
    const categoryCard = document.createElement('div');
    categoryCard.classList.add('category-card');
    categoryCard.setAttribute('data-id', category.id);
    
    categoryCard.innerHTML = `
      <div class="category-header">
        <div class="category-title">
          <i class="fas ${category.icon}" style="color: ${category.color}"></i>
          ${category.name}
        </div>
        <div class="category-actions">
          <button class="category-action edit" data-id="${category.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="category-action delete" data-id="${category.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="category-budget">${formatCurrency(budget)}</div>
      <div class="category-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%; background-color: ${getProgressColor(percentage)};"></div>
        </div>
        <div class="category-stats">
          <div class="category-spent">Spent: ${formatCurrency(spent)}</div>
          <div class="category-percentage">${Math.round(percentage)}%</div>
        </div>
      </div>
    `;
    
    categoriesContainer.appendChild(categoryCard);
    
    // Add event listeners for edit and delete buttons
    const editBtn = categoryCard.querySelector('.edit');
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      editCategory(category.id);
    });
    
    const deleteBtn = categoryCard.querySelector('.delete');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteCategory(category.id);
    });
    
    // Add click event to the entire card to open expense modal
    categoryCard.addEventListener('click', () => {
      openExpenseModal(category.id);
    });
  });
}

// Get color based on percentage for progress bar
function getProgressColor(percentage) {
  if (percentage < 70) {
    return '#4caf50'; // Green for good
  } else if (percentage < 90) {
    return '#ff9800'; // Orange for warning
  } else {
    return '#f44336'; // Red for danger
  }
}

// Calculate total spent for a specific category
function getCategorySpent(categoryId) {
  // Filter expenses by category and sum amounts
  return expenses
    .filter(expense => expense.categoryId === categoryId)
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);
}

// Get total budget across all categories
function getTotalBudget() {
  return categories.reduce((total, category) => total + parseFloat(category.budget), 0);
}

// Get total spent across all categories
function getTotalSpent() {
  return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
}

// Update budget overview cards and progress bar
function updateBudgetOverview() {
  const totalBudget = getTotalBudget();
  const totalSpent = getTotalSpent();
  const remaining = totalBudget - totalSpent;
  const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  
  // Update overview cards
  budgetTotalAmount.textContent = formatCurrency(totalBudget);
  spentAmount.textContent = formatCurrency(totalSpent);
  remainingAmount.textContent = formatCurrency(remaining);
  
  // Update progress bar
  progressFill.style.width = `${Math.min(percentage, 100)}%`;
  progressFill.style.backgroundColor = getProgressColor(percentage);
  progressPercentage.textContent = `${Math.round(percentage)}%`;
}

// Open category modal for adding a new category
function openCategoryModal(categoryId = null) {
  const modal = document.querySelector('#categoryModal');
  const modalTitle = modal.querySelector('.modal-header h3');
  const modalForm = modal.querySelector('#categoryForm');
  const iconOptions = modal.querySelectorAll('.icon-option');
  const colorOptions = modal.querySelectorAll('.color-option');
  const submitBtn = modal.querySelector('.btn-submit');
  
  // Reset form
  modalForm.reset();
  
  // Deselect all icon and color options
  iconOptions.forEach(option => option.classList.remove('selected'));
  colorOptions.forEach(option => option.classList.remove('selected'));
  
  if (categoryId) {
    // Edit mode
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      modalTitle.textContent = 'Edit Budget Category';
      submitBtn.textContent = 'Update Category';
      
      // Set form values
      document.querySelector('#categoryName').value = category.name;
      document.querySelector('#categoryBudget').value = category.budget;
      
      // Select the icon
      const iconOption = Array.from(iconOptions).find(opt => opt.querySelector('i').classList.contains(category.icon.split(' ')[1]));
      if (iconOption) {
        iconOption.classList.add('selected');
      }
      
      // Select the color
      const colorOption = Array.from(colorOptions).find(opt => opt.style.backgroundColor === category.color);
      if (colorOption) {
        colorOption.classList.add('selected');
      }
      
      // Store category ID in form data attribute
      modalForm.setAttribute('data-category-id', categoryId);
    }
  } else {
    // Add mode
    modalTitle.textContent = 'Add Budget Category';
    submitBtn.textContent = 'Add Category';
    modalForm.removeAttribute('data-category-id');
    
    // Select first options as default
    if (iconOptions.length > 0) iconOptions[0].classList.add('selected');
    if (colorOptions.length > 0) colorOptions[0].classList.add('selected');
  }
  
  // Show modal
  modalOverlay.classList.add('active');
}

// Open expense modal for adding a new expense
function openExpenseModal(categoryId = null) {
  const modal = document.querySelector('#expenseModal');
  const modalTitle = modal.querySelector('.modal-header h3');
  const modalForm = modal.querySelector('#expenseForm');
  const categorySelect = document.querySelector('#expenseCategory');
  const submitBtn = modal.querySelector('.btn-submit');
  
  // Reset form
  modalForm.reset();
  
  // Populate category dropdown
  categorySelect.innerHTML = '';
  
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
  
  // Set default date to today
  const today = new Date().toISOString().split('T')[0];
  document.querySelector('#expenseDate').value = today;
  
  // If category is specified, select it
  if (categoryId) {
    categorySelect.value = categoryId;
  }
  
  // Set modal title and button text
  modalTitle.textContent = 'Add Expense';
  submitBtn.textContent = 'Add Expense';
  
  // Show modal
  modalOverlay.classList.add('active');
}

// Add or update a category
function handleCategorySubmit(event) {
  event.preventDefault();
  
  // Get form values
  const name = document.querySelector('#categoryName').value.trim();
  const budget = parseFloat(document.querySelector('#categoryBudget').value);
  const iconOption = document.querySelector('.icon-option.selected');
  const colorOption = document.querySelector('.color-option.selected');
  
  // Validate inputs
  if (!name || isNaN(budget) || budget <= 0 || !iconOption || !colorOption) {
    alert('Please fill in all fields correctly');
    return;
  }
  
  // Get icon and color values
  const iconElement = iconOption.querySelector('i');
  const icon = iconElement ? iconElement.className : 'fa-folder';
  const color = colorOption.style.backgroundColor;
  
  // Check if we're editing or adding
  const categoryId = categoryForm.getAttribute('data-category-id');
  
  if (categoryId) {
    // Update existing category
    const index = categories.findIndex(c => c.id === categoryId);
    if (index !== -1) {
      categories[index] = {
        ...categories[index],
        name,
        budget,
        icon,
        color
      };
    }
  } else {
    // Add new category
    const newCategory = {
      id: Date.now().toString(),
      name,
      budget,
      icon,
      color
    };
    
    categories.push(newCategory);
  }
  
  // Save and update UI
  saveCategories();
  renderCategories();
  updateBudgetOverview();
  renderSpendingChart();
  
  // Close modal
  closeModal();
}

// Add an expense
function handleExpenseSubmit(event) {
  event.preventDefault();
  
  // Get form values
  const description = document.querySelector('#expenseDescription').value.trim();
  const amount = parseFloat(document.querySelector('#expenseAmount').value);
  const date = document.querySelector('#expenseDate').value;
  const categoryId = document.querySelector('#expenseCategory').value;
  
  // Validate inputs
  if (!description || isNaN(amount) || amount <= 0 || !date || !categoryId) {
    alert('Please fill in all fields correctly');
    return;
  }
  
  // Create new expense
  const newExpense = {
    id: Date.now().toString(),
    description,
    amount,
    date,
    categoryId
  };
  
  // Add to expenses array
  expenses.push(newExpense);
  
  // Save and update UI
  saveExpenses();
  renderCategories();
  updateBudgetOverview();
  renderSpendingChart();
  
  // Close modal
  closeModal();
}

// Edit a category
function editCategory(categoryId) {
  openCategoryModal(categoryId);
}

// Delete a category
function deleteCategory(categoryId) {
  if (confirm('Are you sure you want to delete this category? All associated expenses will also be deleted.')) {
    // Remove category
    categories = categories.filter(c => c.id !== categoryId);
    saveCategories();
    
    // Remove associated expenses
    expenses = expenses.filter(e => e.categoryId !== categoryId);
    saveExpenses();
    
    // Update UI
    renderCategories();
    updateBudgetOverview();
    renderSpendingChart();
  }
}

// Close any open modal
function closeModal() {
  modalOverlay.classList.remove('active');
}

// Render spending chart
function renderSpendingChart() {
  if (!spendingChartContainer) return;
  
  // Destroy existing chart if it exists
  if (spendingChart) {
    spendingChart.destroy();
  }
  
  // Get data by category
  const categoryData = [];
  const categoryColors = [];
  const categoryLabels = [];
  
  categories.forEach(category => {
    const spent = getCategorySpent(category.id);
    if (spent > 0) {
      categoryData.push(spent);
      categoryColors.push(category.color);
      categoryLabels.push(category.name);
    }
  });
  
  // Check if there's data to display
  if (categoryData.length === 0) {
    spendingChartContainer.innerHTML = '<div class="empty-chart">No expense data to display</div>';
    return;
  }
  
  // Create the chart
  const ctx = document.createElement('canvas');
  spendingChartContainer.innerHTML = '';
  spendingChartContainer.appendChild(ctx);
  
  spendingChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: categoryLabels,
      datasets: [{
        data: categoryData,
        backgroundColor: categoryColors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 15,
            padding: 15
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${formatCurrency(value)} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// Filter expenses by period
function filterExpensesByPeriod(period) {
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate = new Date(0); // All time
  }
  
  return expenses.filter(expense => new Date(expense.date) >= startDate);
}

// Set up event listeners
function setupEventListeners() {
  // Add category button
  if (addCategoryBtn) {
    addCategoryBtn.addEventListener('click', () => openCategoryModal());
  }
  
  // Add expense button
  if (addExpenseBtn) {
    addExpenseBtn.addEventListener('click', () => openExpenseModal());
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
  
  // Category form submit
  if (categoryForm) {
    categoryForm.addEventListener('submit', handleCategorySubmit);
  }
  
  // Expense form submit
  if (expenseForm) {
    expenseForm.addEventListener('submit', handleExpenseSubmit);
  }
  
  // Icon selection
  document.querySelectorAll('.icon-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.icon-option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
    });
  });
  
  // Color selection
  document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
    });
  });
  
  // Period selection for chart
  if (periodOptions.length > 0) {
    periodOptions.forEach(option => {
      option.addEventListener('click', () => {
        periodOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        selectedPeriod = option.getAttribute('data-period');
        renderSpendingChart();
      });
    });
  }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init); 