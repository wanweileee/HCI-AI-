// document.addEventListener('DOMContentLoaded', function () {
//     const spendings = JSON.parse(document.getElementById('spendingsChart').getAttribute('data-spendings'));
//     console.log(spendings);
//     const ctx = document.getElementById('spendingsChart').getContext('2d');
//     const spendingsChart = new Chart(ctx, {
//         type: 'bar',
//         data: {
//             labels: ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'],
//             datasets: [{
//                 label: 'Spendings',
//                 data: spendings,
//                 backgroundColor: [
//                     'rgba(255, 99, 132, 0.2)',
//                     'rgba(54, 162, 235, 0.2)',
//                     'rgba(255, 206, 86, 0.2)',
//                     'rgba(75, 192, 192, 0.2)',
//                     'rgba(153, 102, 255, 0.2)',
//                     'rgba(255, 159, 64, 0.2)',
//                     'rgba(54, 162, 235, 0.2)',
//                 ],
//                 borderColor: [
//                     'rgba(255, 99, 132, 1)',
//                     'rgba(54, 162, 235, 1)',
//                     'rgba(255, 206, 86, 1)',
//                     'rgba(75, 192, 192, 1)',
//                     'rgba(153, 102, 255, 1)',
//                     'rgba(255, 159, 64, 1)',
//                     'rgba(54, 162, 235, 1)'
//                 ],
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             },
//             responsive: true,
//             maintainAspectRatio: false
//         }
//     });
// });


document.addEventListener('DOMContentLoaded', function () {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 3) {
        checkCategoryLimits(segments[2]);
    }
    //initializeDefaultCategories();
    updateUI();
    initializeChart();
});

function initializeChart() {
    const ctx = document.getElementById('spendingsChart').getContext('2d');
    const spendings = JSON.parse(document.getElementById('spendingsChart').getAttribute('data-spendings'));
    window.spendingsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{
                label: 'Spendings',
                data: spendings, // Initial data, will be updated
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(54, 162, 235, 1)'
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

// function initializeDefaultCategories() {
//     const defaultCategories = [
//         { category: 'Food', amount: 40, limit: 100 },
//         { category: 'Clothing', amount: 25, limit: 100 }
//     ];

//     let transactions = JSON.parse(localStorage.getItem('weeklyTransactions')) || [];

//     defaultCategories.forEach(defaultCategory => {
//         if (!transactions.some(tx => tx.category === defaultCategory.category && tx.date === 'default')) {
//             transactions.push({ category: defaultCategory.category, amount: defaultCategory.amount, limit: defaultCategory.limit, date: 'default' });
//         }
//     });

//     localStorage.setItem('weeklyTransactions', JSON.stringify(transactions));
// }

// function getTotalSpending() {
//     let transactions = JSON.parse(localStorage.getItem('weeklyTransactions')) || [];
//     return transactions.reduce((total, transaction) => total + transaction.amount, 0);
// }

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

    var categorySelect = document.getElementById('category');
    var category = categorySelect.value;
    var amount = parseFloat(document.getElementById('amount').value);
    var categoryOther = ""; // Initialize the custom category name

    // Check if custom category is selected and use that value
    if (category === 'Others') {
        categoryOther = document.getElementById('customCategory').value;
        if (!category) { // Ensure the custom category is not empty
            alert('Please enter a name for the custom category.');
            return; // Stop the submission if no custom category name is provided
        }
    }

    var data = {
        location: 'ADD',
        category: category,
        categoryOther: categoryOther,
        amount: amount
    };

    fetch(window.location.href, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            closeAddExpenseModal();
            window.location.href = '/home/' + data.id + '/' + category;
        } else {
            alert('Failed to delete user: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function deductExpense(event) {
    event.preventDefault();

    var categorySelect = document.getElementById('deductCategory');
    var category = categorySelect.value;
    var amount = parseFloat(document.getElementById('deductAmount').value);
    var categoryOther = ""; // Initialize the custom category name

    // Check if custom category is selected and use that value
    if (category === 'Others') {
        categoryOther = document.getElementById('deductCustomCategory').value;
        if (!category) { // Ensure the custom category is not empty
            alert('Please enter a name for the custom category.');
            return; // Stop the submission if no custom category name is provided
        }
    }

    var data = {
        location: 'DEDUCT',
        category: category,
        categoryOther: categoryOther,
        amount: -amount
    };

    fetch(window.location.href, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            closeDeductExpenseModal();
            window.location.href = '/home/' + data.id + '/' + category;
        } else {
            alert('Failed to delete user: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function checkCategoryLimits() {
    // let transactions = JSON.parse(localStorage.getItem('weeklyTransactions')) || [];
    // let categoryLimits = JSON.parse(localStorage.getItem('categoryLimits')) || {};
    // let categories = {};

    // transactions.forEach(tx => {
    //     if (categories[tx.category]) {
    //         categories[tx.category].amount += tx.amount;
    //     } else {
    //         categories[tx.category] = { amount: tx.amount, limit: categoryLimits[tx.category] || 100 };
    //     }
    // });

    // let exceededCategories = [];

    // for (let category in categories) {
    //     if (categories[category].amount > categories[category].limit) {
    //         exceededCategories.push(category);
    //     }
    // }

    // if (exceededCategories.length > 0) {
    //     let message = exceededCategories.map(category => `Your spending for ${category} has exceeded the limit!`).join('\n');
    //     openNotificationModal(message);
    // }
    const categoriesList = JSON.parse(document.getElementById('spendingCategories').getAttribute('data-information'));

    let exceededCategories = [];

    for (let categories in categoriesList) {
        if (categoriesList[categories].amount > categoriesList[categories].limit) {
            exceededCategories.push(categoriesList[categories].category);
        }
    }

    if (exceededCategories.length > 0) {
        let message = exceededCategories.map(category => `Your spending for ${category} has exceeded the limit!`).join('\n');
        openNotificationModal(message);
    }
}

function updateUI() {
    // let transactions = JSON.parse(localStorage.getItem('weeklyTransactions')) || [];
    // let totalSpending = 0;
    const categoriesList = JSON.parse(document.getElementById('spendingCategories').getAttribute('data-information'));

    // transactions.forEach(tx => {
    //     totalSpending += tx.amount;
    //     if (!categories[tx.category]) {
    //         categories[tx.category] = { amount: 0, limit: tx.limit || 100 };
    //     }
    //     categories[tx.category].amount += tx.amount;
    //     if (tx.limit) {
    //         categories[tx.category].limit = tx.limit;
    //     }
    // });

    //document.getElementById('totalSpending').innerHTML = totalSpending;
    //document.getElementById('moneyOut').textContent = ` -$${totalSpending}`;

    const container = document.getElementById('spendingCategories');
    container.innerHTML = '';

    for (let categories in categoriesList) {
        createCategoryBar(categoriesList[categories].category, categoriesList[categories].amount, categoriesList[categories].limit);
    }
}

function createCategoryBar(category, amount, limit) {
    if (typeof limit === 'undefined') {
        limit = 100;
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

    if (categorySelect.value === 'Others') {
        customInput.style.display = 'block';
    } else {
        customInput.style.display = 'none';
    }
}

function checkCustomDeductCategory() {
    var deductCategorySelect = document.getElementById('deductCategory');
    var deductcustomInput = document.getElementById('deductCustomCategory');

    if (deductCategorySelect.value === 'Others') {
        deductcustomInput.style.display = 'block';
    } else {
        deductcustomInput.style.display = 'none';
    }
}

function submitEditForm(event) {
    event.preventDefault();

    const categoryName = document.getElementById('categoryName').value;
    const categoryLimit = document.getElementById('categoryLimit').value;
    const categoryId = document.getElementById('editForm').dataset.categoryId;

    var data = {
        location: 'LIMIT',
        name: categoryName,
        newLimit: categoryLimit,
        categoryId: categoryId
    };

    // Send the POST request to the same URL
    fetch(window.location.href, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            closeModal();
            window.location.href = '/home/' + data.id;
        } else {
            alert('Failed to delete user: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

}

function toggleView(view,id) {
    if (view === 'weekly') {
        window.location.href = '/home/' + id;
    } else {
        window.location.href = '/monthly/' + id;

    }
}
