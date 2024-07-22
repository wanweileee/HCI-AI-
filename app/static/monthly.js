document.addEventListener('DOMContentLoaded', function () {
    initializeDefaultCategories();
    const totalSpending = getTotalSpending();

    const ctx = document.getElementById('spendingsChart').getContext('2d');
    const spendingsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Spendings',
                data: [800, 900, 1200, 1100, 1200, totalSpending],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    updateUI();
});

function initializeDefaultCategories() {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const defaultCategories = [
        { category: 'Food', amount: 200, limit: 300 },
        { category: 'Clothing', amount: 250, limit: 400 }
    ];

    defaultCategories.forEach(defaultCategory => {
        if (!transactions.some(tx => tx.category === defaultCategory.category)) {
            transactions.push(defaultCategory);
        } else {
            // Update the existing default category amounts
            transactions = transactions.map(tx => 
                tx.category === defaultCategory.category ? { ...tx, amount: defaultCategory.amount } : tx
            );
        }
    });

    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function getTotalSpending() {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
}

function openModal(categoryName, categoryLimit, categoryId) {
    document.getElementById('categoryName').value = categoryName;
    document.getElementById('categoryLimit').value = categoryLimit;
    document.getElementById('editModal').style.display = 'block';

    document.getElementById('editForm').dataset.categoryId = categoryId;
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

function openAddExpenseModal() {
    document.getElementById('addExpenseModal').style.display = 'block';
}

function closeAddExpenseModal() {
    document.getElementById('addExpenseModal').style.display = 'none';
}

function openDeductExpenseModal() {
    document.getElementById('deductExpenseModal').style.display = 'block';
}

function closeDeductExpenseModal() {
    document.getElementById('deductExpenseModal').style.display = 'none';
}

function checkCustomCategory() {
    var categorySelect = document.getElementById('category');
    var customInput = document.getElementById('customCategory');

    if (categorySelect.value === 'Custom') {
        customInput.style.display = 'block';
    } else {
        customInput.style.display = 'none';
    }
}

function addExpense(event) {
    event.preventDefault();

    const categorySelect = document.getElementById('category');
    const customCategoryInput = document.getElementById('customCategory');
    const amountInput = document.getElementById('amount');

    let category = categorySelect.value;
    if (category === 'Custom') {
        category = customCategoryInput.value;
    }
    const amount = parseFloat(amountInput.value);

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push({ category, amount, date: new Date() });
    localStorage.setItem('transactions', JSON.stringify(transactions));

    updateUI();
    closeAddExpenseModal();
}

function deductExpense(event) {
    event.preventDefault();

    const categorySelect = document.getElementById('deductCategory');
    const customCategoryInput = document.getElementById('deductCustomCategory');
    const amountInput = document.getElementById('deductAmount');

    let category = categorySelect.value;
    if (category === 'Custom') {
        category = customCategoryInput.value;
    }
    const amount = parseFloat(amountInput.value);

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push({ category, amount: -amount, date: new Date() });
    localStorage.setItem('transactions', JSON.stringify(transactions));

    updateUI();
    closeDeductExpenseModal();
}

function submitEditForm(event) {
    event.preventDefault();

    const categoryName = document.getElementById('categoryName').value;
    const categoryLimit = document.getElementById('categoryLimit').value;
    const categoryId = document.getElementById('editForm').dataset.categoryId;

    const label = document.getElementById('label' + categoryId);
    const details = document.getElementById('details' + categoryId);
    const progressBar = document.getElementById('progress' + categoryId);

    if (label && details && progressBar) {
        label.textContent = categoryName;

        const currentSpend = details.textContent.split('/')[0].replace('$', '');
        details.textContent = `$${currentSpend}/$${categoryLimit}`;

        const spendPercentage = (parseFloat(currentSpend) / parseFloat(categoryLimit)) * 100;
        progressBar.style.width = `${spendPercentage}%`;
    }

    closeModal();
}

function updateUI() {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let totalSpending = 0;
    let categories = {};

    transactions.forEach(tx => {
        totalSpending += tx.amount;
        if (categories[tx.category]) {
            categories[tx.category] += tx.amount;
        } else {
            categories[tx.category] = tx.amount;
        }
    });

    document.querySelector('.current-spending').innerHTML = `Total spending:<br>$${totalSpending}`;
    document.querySelector('.money-out').textContent = ` -$${totalSpending}`;

    // Clear and recreate the category elements to avoid duplicates
    const container = document.querySelector('.spending-categories');
    container.innerHTML = ''; // Clear the container

    for (let category in categories) {
        createCategoryBar(category, categories[category]);
    }
}

function createCategoryBar(category, amount, limit = 300) {
    let container = document.querySelector('.spending-categories');
    let newCategory = document.createElement('div');
    newCategory.className = 'category';
    newCategory.id = `category${category}`; // Ensure unique ID
    newCategory.innerHTML = `
        <label id="label${category}">${category}</label>
        <div class="progress-container">
            <div class="progress-bar" id="progress${category}" style="width: ${Math.min((amount / limit) * 100, 100)}%;"></div>
        </div>
        <div class="category-details" id="details${category}">$${amount}/$${limit}</div>
        <button onclick="openModal('${category}', '${limit}', '${category}')">✎</button>
    `;
    container.appendChild(newCategory);
}
