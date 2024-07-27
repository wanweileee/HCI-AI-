document.addEventListener('DOMContentLoaded', function () {
    initializeDefaultCategories();
    updateUI();
    initializeChart();
});

function initializeChart() {
    const totalSpending = getTotalSpending();
    const ctx = document.getElementById('spendingsChart').getContext('2d');
    window.spendingsChart = new Chart(ctx, {
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
}

function initializeDefaultCategories() {
    const defaultCategories = [
        { category: 'Food', amount: 200, limit: 300 },
        { category: 'Clothing', amount: 250, limit: 400 }
    ];

    let transactions = JSON.parse(localStorage.getItem('monthlyTransactions')) || [];

    defaultCategories.forEach(defaultCategory => {
        if (!transactions.some(tx => tx.category === defaultCategory.category && tx.date === 'default')) {
            transactions.push({ category: defaultCategory.category, amount: defaultCategory.amount, limit: defaultCategory.limit, date: 'default' });
        }
    });

    localStorage.setItem('monthlyTransactions', JSON.stringify(transactions));
}

function getTotalSpending() {
    let transactions = JSON.parse(localStorage.getItem('monthlyTransactions')) || [];
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
}

function openNotificationModal(message) {
    const notificationModal = document.getElementById('notificationModal');
    const notificationMessage = document.getElementById('notificationMessage');
    notificationMessage.innerText = message;
    notificationModal.style.display = 'block';
}

function closeNotificationModal() {
    document.getElementById('notificationModal').style.display = 'none';
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

    let transactions = JSON.parse(localStorage.getItem('monthlyTransactions')) || [];
    transactions.push({ category, amount, date: new Date().toISOString() });
    localStorage.setItem('monthlyTransactions', JSON.stringify(transactions));

    updateUI();
    checkCategoryLimits(); // Check limits after adding expense
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

    let transactions = JSON.parse(localStorage.getItem('monthlyTransactions')) || [];
    transactions.push({ category, amount: -amount, date: new Date().toISOString() });
    localStorage.setItem('monthlyTransactions', JSON.stringify(transactions));

    updateUI();
    checkCategoryLimits(); // Check limits after deducting expense
    closeDeductExpenseModal();
}

function checkCategoryLimits() {
    let transactions = JSON.parse(localStorage.getItem('monthlyTransactions')) || [];
    let categoryLimits = JSON.parse(localStorage.getItem('categoryLimits')) || {};
    let categories = {};

    transactions.forEach(tx => {
        if (categories[tx.category]) {
            categories[tx.category].amount += tx.amount;
        } else {
            categories[tx.category] = { amount: tx.amount, limit: categoryLimits[tx.category] || 300 };
        }
    });

    let exceededCategories = [];

    for (let category in categories) {
        if (categories[category].amount > categories[category].limit) {
            exceededCategories.push(category);
        }
    }

    if (exceededCategories.length > 0) {
        let message = exceededCategories.map(category => `Your spending for ${category} has exceeded the limit!`).join('\n');
        openNotificationModal(message);
    }
}

function updateUI() {
    let transactions = JSON.parse(localStorage.getItem('monthlyTransactions')) || [];
    let totalSpending = 0;
    let categories = {};

    transactions.forEach(tx => {
        totalSpending += tx.amount;
        if (!categories[tx.category]) {
            categories[tx.category] = { amount: 0, limit: tx.limit || 300 };
        }
        categories[tx.category].amount += tx.amount;
        if (tx.limit) {
            categories[tx.category].limit = tx.limit;
        }
    });

    document.getElementById('totalSpending').innerHTML = totalSpending;
    document.getElementById('moneyOut').textContent = ` -$${totalSpending}`;

    const container = document.getElementById('spendingCategories');
    container.innerHTML = '';

    for (let category in categories) {
        createCategoryBar(category, categories[category].amount, categories[category].limit);
    }
}

function createCategoryBar(category, amount, limit) {
    if (typeof limit === 'undefined') {
        limit = 300;
    }

    let container = document.getElementById('spendingCategories');
    let newCategory = document.createElement('div');
    newCategory.className = 'category';
    newCategory.id = `category${category}`;
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

function toggleView(view) {
    if (view === 'weekly') {
        window.location.href = '/';
    } else {
        window.location.href = '/monthly';
    }
}
