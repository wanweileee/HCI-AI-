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
                data: [2500, 2300, 2200, 2100, 2200, totalSpending],
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

function submitForm(event) {
    event.preventDefault(); 

    var name = document.getElementById('categoryName').value;
    var newLimit = document.getElementById('categoryLimit').value;
    var categoryId = document.getElementById('editForm').dataset.categoryId;

    var label = document.getElementById('label' + categoryId);
    var details = document.getElementById('details' + categoryId);
    var progressBar = document.getElementById('progress' + categoryId);

    if (label && details && progressBar) {
        label.textContent = name;

        var currentSpend = details.textContent.split('/')[0].replace('$', '');
        details.textContent = `$${currentSpend}/$${newLimit}`;

        var spendPercentage = (parseFloat(currentSpend) / parseFloat(newLimit)) * 100;
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

function createCategoryBar(category, amount, limit) {
    const defaultLimits = {
        Food: 300,
        Clothing: 400
    };
    limit = limit || defaultLimits[category] || 300; // Set limit based on default category limits or use 300 as fallback

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


/*
// Clears all local storage
localStorage.clear();

// Clear a specific item in local storage
localStorage.removeItem('keyName'); // Replace 'keyName' with the key you want to remove
*/