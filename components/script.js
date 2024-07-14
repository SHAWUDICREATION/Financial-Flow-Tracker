document.addEventListener('DOMContentLoaded', function () {
  let expenses = [];
  let incomes = [];
  let totalExpense = 0;
  let totalIncome = 0;

  const incomeCategorySelect = document.getElementById('income-category-select');
  const incomeDateInput = document.getElementById('income-date-input');
  const incomeDescriptionInput = document.getElementById('income-description');
  const incomeAmountInput = document.getElementById('income-amount-input');
  const addIncomeBtn = document.getElementById('add-income-btn');
  const incomeTableBody = document.getElementById('income-table-body');
  const expenseCategorySelect = document.getElementById('expense-category-select');
  const expenseDateInput = document.getElementById('date-input');
  const expenseDescriptionInput = document.getElementById('description');
  const expenseAmountInput = document.getElementById('amount-input');
  const addExpenseBtn = document.getElementById('add-expense-btn');
  const expenseTableBody = document.getElementById('expense-table-body');
  const totalBalanceSpan = document.getElementById('total-balance');
  const totalIncomeSpan = document.getElementById('income');
  const totalExpenseSpan = document.getElementById('expense');

  const categoryColorMap = {
    "Utilities": "violet",
    "Clothings": "fuchsia",
    "Healthcare": "#f36584",
    "Education": "mediumpurple",
    "Travel": "lightpink",
    "Gifts-&-Donations": "#ac14f3",
    "Home-Maintenance": "yellow",
    "Insurance": "tomato",
    "Savings": "#6ebff5",
    "Salary": "#41f13b",
    "Business": "#42e285",
    "Investment": "#20b2aa",
    "Other": "#479116",
  };

  window.addEventListener('load', function() {
    const savedExpenses = localStorage.getItem('expenses');
    const savedIncomes = localStorage.getItem('incomes');
    if (savedExpenses) {
      expenses = JSON.parse(savedExpenses);
      expenses.forEach(expense => {
        renderExpense(expense);
      });
      calculateTotalExpense();
    }
    if (savedIncomes) {
      incomes = JSON.parse(savedIncomes);
      incomes.forEach(income => {
        renderIncome(income);
      });
      calculateTotalIncome();
    }
    updateTotalBalance();
  });

  document.getElementById('toggle-income-form').addEventListener('click', () => {
    document.getElementById('add-income-form').style.display = 'block';
    document.getElementById('add-expense-form').style.display = 'none';
    resetIncomeForm();
  });

  document.getElementById('toggle-expense-form').addEventListener('click', () => {
    document.getElementById('add-income-form').style.display = 'none';
    document.getElementById('add-expense-form').style.display = 'block';
    resetExpenseForm();
  });

  addIncomeBtn.addEventListener('click', function() {
    if (addIncomeBtn.textContent === 'Update Income') return;

    const income = {
      category: incomeCategorySelect.value,
      date: incomeDateInput.value,
      description: incomeDescriptionInput.value,
      amount: Number(incomeAmountInput.value)
    };

    if (!validateForm(income)) return;

    incomes.push(income);
    renderIncome(income);
    calculateTotalIncome();
    saveIncomesToLocalStorage();
    resetIncomeForm();
  });

  addExpenseBtn.addEventListener('click', function() {
    if (addExpenseBtn.textContent === 'Update Expense') return;

    const expense = {
      category: expenseCategorySelect.value,
      date: expenseDateInput.value,
      description: expenseDescriptionInput.value,
      amount: Number(expenseAmountInput.value)
    };

    if (!validateForm(expense)) return;

    expenses.push(expense);
    renderExpense(expense);
    calculateTotalExpense();
    saveExpensesToLocalStorage();
    resetExpenseForm();
  });

  function validateForm(item) {
    if (item.category === '' || item.date === '' || isNaN(item.amount) || item.amount <= 0) {
      alert('Please fill out all fields correctly.');
      return false;
    }
    return true;
  }

  function calculateTotalIncome() {
    totalIncome = incomes.reduce((total, income) => total + income.amount, 0);
    totalIncomeSpan.textContent = `$${totalIncome.toFixed(2)}`;
    updateTotalBalance();
  }

  function calculateTotalExpense() {
    totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
    totalExpenseSpan.textContent = `$${totalExpense.toFixed(2)}`;
    updateTotalBalance();
  }

  function updateTotalBalance() {
    const totalBalance = totalIncome - totalExpense;
    totalBalanceSpan.textContent = `$${totalBalance.toFixed(2)}`;
  }

  function saveIncomesToLocalStorage() {
    localStorage.setItem('incomes', JSON.stringify(incomes));
  }

  function saveExpensesToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }

  function renderIncome(income) {
    const newRow = incomeTableBody.insertRow();
    const categoryCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const descriptionCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const actionCell = newRow.insertCell();

    categoryCell.textContent = income.category;
    dateCell.textContent = income.date;
    descriptionCell.textContent = income.description;
    amountCell.textContent = `$${income.amount.toFixed(2)}`;

   
    const categoryColor = categoryColorMap[income.category] || "white";
    newRow.style.background = categoryColor;

    const editBtn = document.createElement('i');
    editBtn.classList.add('fas', 'fa-edit', 'edit-btn');
    editBtn.style.cursor = 'pointer';
    editBtn.addEventListener('click', function() {
      showIncomeFormForEdit(income, newRow);
    });

    const deleteBtn = document.createElement('i');
    deleteBtn.classList.add('fas', 'fa-trash-alt', 'delete-btn');
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.addEventListener('click', function() {
      deleteIncome(income, newRow);
    });

    actionCell.style.textAlign = 'center';
    actionCell.appendChild(editBtn);
    actionCell.appendChild(deleteBtn);
  }

  function renderExpense(expense) {
    const newRow = expenseTableBody.insertRow();
    const categoryCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const descriptionCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const actionCell = newRow.insertCell();

    const categoryColor = categoryColorMap[expense.category] || "white";
    newRow.style.background = categoryColor;

    categoryCell.textContent = expense.category;
    dateCell.textContent = expense.date;
    descriptionCell.textContent = expense.description;
    amountCell.textContent = `$${expense.amount.toFixed(2)}`;

    const editBtn = document.createElement('i');
    editBtn.classList.add('fas', 'fa-edit', 'edit-btn');
    editBtn.style.cursor = 'pointer';
    editBtn.addEventListener('click', function() {
      showExpenseFormForEdit(expense, newRow);
    });

    const deleteBtn = document.createElement('i');
    deleteBtn.classList.add('fas', 'fa-trash-alt', 'delete-btn');
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.addEventListener('click', function() {
      deleteExpense(expense, newRow);
    });

    actionCell.style.textAlign = 'center';
    actionCell.appendChild(editBtn);
    actionCell.appendChild(deleteBtn);
  }

  function resetIncomeForm() {
    incomeCategorySelect.value = '';
    incomeDateInput.value = '';
    incomeDescriptionInput.value = '';
    incomeAmountInput.value = '';
    addIncomeBtn.textContent = 'Add Income';
  }

  function resetExpenseForm() {
    expenseCategorySelect.value = '';
    expenseDateInput.value = '';
    expenseDescriptionInput.value = '';
    expenseAmountInput.value = '';
    addExpenseBtn.textContent = 'Add Expense';
  }

  function deleteIncome(income, row) {
    const index = incomes.indexOf(income);
    if (index !== -1) {
      totalIncome -= income.amount;
      incomes.splice(index, 1);
      incomeTableBody.removeChild(row);
      calculateTotalIncome();
      saveIncomesToLocalStorage();
    }
  }

  function deleteExpense(expense, row) {
    const index = expenses.indexOf(expense);
    if (index !== -1) {
      totalExpense -= expense.amount;
      expenses.splice(index, 1);
      expenseTableBody.removeChild(row);
      calculateTotalExpense();
      saveExpensesToLocalStorage();
    }
  }

  function showIncomeFormForEdit(income, row) {
    document.getElementById('add-income-form').style.display = 'block';
    document.getElementById('add-expense-form').style.display = 'none';

    incomeCategorySelect.value = income.category;
    incomeDateInput.value = income.date;
    incomeDescriptionInput.value = income.description;
    incomeAmountInput.value = income.amount;
    addIncomeBtn.textContent = 'Update Income';

    addIncomeBtn.onclick = function() {
      updateIncome(income, row);
    };
  }

  function showExpenseFormForEdit(expense, row) {
    document.getElementById('add-income-form').style.display = 'none';
    document.getElementById('add-expense-form').style.display = 'block';

    expenseCategorySelect.value = expense.category;
    expenseDateInput.value = expense.date;
    expenseDescriptionInput.value = expense.description;
    expenseAmountInput.value = expense.amount;
    addExpenseBtn.textContent = 'Update Expense';

    addExpenseBtn.onclick = function() {
      updateExpense(expense, row);
    };
  }

  function updateIncome(income, row) {
    income.category = incomeCategorySelect.value;
    income.date = incomeDateInput.value;
    income.description = incomeDescriptionInput.value;
    income.amount = Number(incomeAmountInput.value);

    if (!validateForm(income)) return;

    row.cells[0].textContent = income.category;
    row.cells[1].textContent = income.date;
    row.cells[2].textContent = income.description;
    row.cells[3].textContent = `$${income.amount.toFixed(2)}`;

    calculateTotalIncome();
    saveIncomesToLocalStorage();
    resetIncomeForm();
    addIncomeBtn.textContent = 'Add Income';
    addIncomeBtn.onclick = addIncome;
  }

  function updateExpense(expense, row) {
    expense.category = expenseCategorySelect.value;
    expense.date = expenseDateInput.value;
    expense.description = expenseDescriptionInput.value;
    expense.amount = Number(expenseAmountInput.value);

    if (!validateForm(expense)) return;

    row.cells[0].textContent = expense.category;
    row.cells[1].textContent = expense.date;
    row.cells[2].textContent = expense.description;
    row.cells[3].textContent = `$${expense.amount.toFixed(2)}`;

    calculateTotalExpense();
    saveExpensesToLocalStorage();
    resetExpenseForm();
    addExpenseBtn.textContent = 'Add Expense';
    addExpenseBtn.onclick = addExpense;
  }
});
