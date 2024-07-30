// function getTotalSpending() {
//     let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
//     return transactions.reduce((total, transaction) => total + transaction.amount, 0);
// }

// document.addEventListener('DOMContentLoaded', function () {
//     const container = document.getElementById('categoriesContainer');
//     const categories = JSON.parse(document.getElementById('categoriesContainer').getAttribute('data-information'));
//     categories.forEach(category => {
//         const percent = (category.spent / category.limit) * 100;

//         // Create elements
//         const categoryDiv = document.createElement('div');
//         categoryDiv.className = 'category';

//         const label = document.createElement('label');
//         label.id = `label${category.name}`;
//         label.textContent = category.name;

//         const progressContainer = document.createElement('div');
//         progressContainer.className = 'progress-container';

//         const progressBar = document.createElement('div');
//         progressBar.className = 'progress-bar';
//         progressBar.id = `progress${category.name}`;
//         progressBar.style.width = `${percent}%`;

//         const categoryDetails = document.createElement('div');
//         categoryDetails.className = 'category-details';
//         categoryDetails.id = `details${category.name}`;
//         categoryDetails.textContent = `$${category.spent}/$${category.limit}`;

//         const editButton = document.createElement('button');
//         editButton.onclick = function() { openModal(category.name, category.limit, category.name); };
//         editButton.textContent = '✎';

//         // Assemble the category div
//         progressContainer.appendChild(progressBar);
//         categoryDiv.appendChild(label);
//         categoryDiv.appendChild(progressContainer);
//         categoryDiv.appendChild(categoryDetails);
//         categoryDiv.appendChild(editButton);

//         // Append to container
//         container.appendChild(categoryDiv);
//     });

//     const totalSpending = getTotalSpending(); // Ensure this is called here

//     const label = JSON.parse(document.getElementById('spendingsChart').getAttribute('data-Label'));
//     const data = JSON.parse(document.getElementById('spendingsChart').getAttribute('data-amount'));

//     const ctx = document.getElementById('spendingsChart').getContext('2d');
    
    
//     const spendingsChart = new Chart(ctx, {
//         type: 'bar',
//         data: {
//             labels: label,
//             datasets: [{
//                 label: 'Spendings',
//                 data: data,
//                 backgroundColor: [
//                     'rgba(255, 99, 132, 0.2)',
//                     'rgba(54, 162, 235, 0.2)',
//                     'rgba(255, 206, 86, 0.2)',
//                     'rgba(75, 192, 192, 0.2)',
//                     'rgba(153, 102, 255, 0.2)',
//                     'rgba(255, 159, 64, 0.2)',
//                     'rgba(54, 159, 64, 0.2)'
//                 ],
//                 borderColor: [
//                     'rgba(255, 99, 132, 1)',
//                     'rgba(54, 162, 235, 1)',
//                     'rgba(255, 206, 86, 1)',
//                     'rgba(75, 192, 192, 1)',
//                     'rgba(153, 102, 255, 1)',
//                     'rgba(255, 159, 64, 1)',
//                     'rgba(54, 159, 64, 1)'
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


// function openModal(categoryName, categoryLimit, categoryId) {
//     console.log(categoryName, categoryLimit, categoryId);
//     // document.getElementById('categoryName').value = categoryName;
//     // document.getElementById('categoryLimit').value = categoryLimit;
//     // document.getElementById('editModal').style.display = 'block';

//     // document.getElementById('editForm').dataset.categoryId = categoryId;
//     const nameInput = document.getElementById('categoryName');
//     const limitInput = document.getElementById('categoryLimit');
//     const modal = document.getElementById('editModal');
//     const form = document.getElementById('editForm');

//     if (nameInput && limitInput && modal && form) {
//         nameInput.value = categoryName;
//         limitInput.value = categoryLimit;
//         modal.style.display = 'block';
//         form.dataset.categoryId = categoryId;
//     } else {
//         console.error('One or more modal elements are missing!');
//     }
// }

// function closeModal() {
//     document.getElementById('editModal').style.display = 'none';
// }

// function submitForm(event) {
//     event.preventDefault(); 

//     var name = document.getElementById('categoryName').value;
//     var newLimit = document.getElementById('categoryLimit').value; // This is the new limit
//     var categoryId = document.getElementById('editForm').dataset.categoryId;

//     var label = document.getElementById('label' + categoryId);
//     var details = document.getElementById('details' + categoryId);
//     var progressBar = document.getElementById('progress' + categoryId);

//     var data = {
//         name: name,
//         newLimit: newLimit,
//         categoryId: categoryId
//     };

//     // Send the POST request to the same URL
//     fetch(window.location.href, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.status === 'success') {
//             closeModal();
//             window.location.href = '/monthly/' + data.id;
//         } else {
//             alert('Failed to delete user: ' + data.message);
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });

//     // if (label && details && progressBar) {
//     //     label.textContent = name;

//     //     // Extract current spending from the details and update only the limit part
//     //     var currentSpend = details.textContent.split('/')[0].replace('$', ''); // Gets current spend removing '$'
//     //     details.textContent = `$${currentSpend}/$${newLimit}`; // Updates with new limit

//     //     var spendPercentage = (parseFloat(currentSpend) / parseFloat(newLimit)) * 100;
//     //     progressBar.style.width = `${spendPercentage}%`;
//     // }

//     closeModal();
// }


// document.addEventListener('DOMContentLoaded', function() {
//     updateUI();
// });

// function updateUI() {
//     let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
//     let totalSpending = 0;
//     let categories = {};

//     // Aggregate transactions into categories and total spending
//     transactions.forEach(tx => {
//         totalSpending += tx.amount;
//         if (categories[tx.category]) {
//             categories[tx.category] += tx.amount;
//         } else {
//             categories[tx.category] = tx.amount;
//         }
//     });

//     // Update total spending and money out
//     //console.log(totalSpending);
//     //document.querySelector('.current-spending').innerHTML = `Total spending:<br>$${450 + totalSpending}`;
//     //document.querySelector('.money-out').textContent = ` -$${450 + totalSpending}`;

//     // Update categories
//     for (let category in categories) {
//         updateCategory(category, categories[category]);
//     }
// }

// function updateCategory(category, amount) {
//     let details = document.getElementById(`details${category}`);
//     let progressBar = document.getElementById(`progress${category}`);

//     if (details && progressBar) {
//         // Extract current spending and limit from the details element
//         let currentDetails = details.textContent.split('/'); // E.g., "$150/$300"
//         let currentSpend = parseFloat(currentDetails[0].slice(1)); // Removes the '$' and converts to float
//         let limit = parseFloat(currentDetails[1].slice(1)); // Removes the '$' and converts to float

//         let newSpend = currentSpend + amount; // Add the new amount to the current spend
//         details.textContent = `$${newSpend}/$${limit}`; // Update the text content with the new spend

//         // Calculate new percentage for the progress bar
//         let spendPercentage = Math.min((newSpend / limit) * 100, 100); // Ensure it does not exceed 100%
//         progressBar.style.width = `${spendPercentage}%`; // Update the width of the progress bar
//     } else {
//         // If the category does not exist, create a new category bar
//         createCategoryBar(category, amount);
//     }
// }


// function createCategoryBar(category, amount) {
//     let container = document.querySelector('.spending-categories');
//     let newCategory = document.createElement('div');
//     newCategory.className = 'category';
//     newCategory.innerHTML = `
//         <label id="label${category}">${category}</label>
//         <div class="progress-container">
//             <div class="progress-bar" id="progress${category}" style="width: 50%;"></div>
//         </div>
//         <div class="category-details" id="details${category}">$${amount}/$300</div>
//         <button onclick="openModal('${category}', '300', '${category}')">✎</button>
//     `;
//     container.appendChild(newCategory);
// }


// // // Clears all local storage
// // localStorage.clear();

// // // Clear a specific item in local storage
// // localStorage.removeItem('keyName'); // Replace 'keyName' with the key you want to remove

document.addEventListener('DOMContentLoaded', function () {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 3) {
        checkCategoryLimits(segments[2]);
    }
    updateUI();
    initializeChart();
});

function initializeChart() {
    const totalSpending = getTotalSpending();
    const ctx = document.getElementById('spendingsChart').getContext('2d');
    const label = JSON.parse(document.getElementById('spendingsChart').getAttribute('data-Label'));
    const data = JSON.parse(document.getElementById('spendingsChart').getAttribute('data-amount'));
    window.spendingsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: label,
            datasets: [{
                label: 'Spendings',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(54, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(54, 159, 64, 1)'
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
//     // const defaultCategories = [
//     //     { category: 'Food', amount: 200, limit: 300 },
//     //     { category: 'Clothing', amount: 250, limit: 400 }
//     // ];
    
//     const defaultCategories = JSON.parse(document.getElementById('spendingCategories').getAttribute('data-information'));

//     let transactions = JSON.parse(localStorage.getItem('monthlyTransactions')) || [];

//     defaultCategories.forEach(defaultCategory => {
//         if (!transactions.some(tx => tx.category === defaultCategory.category && tx.date === 'default')) {
//             transactions.push({ category: defaultCategory.category, amount: defaultCategory.amount, limit: defaultCategory.limit, date: 'default' });
//         }
//     });

//     localStorage.setItem('monthlyTransactions', JSON.stringify(transactions));
// }

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

    // const categorySelect = document.getElementById('category');
    // const customCategoryInput = document.getElementById('customCategory');
    // const amountInput = document.getElementById('amount');

    // let category = categorySelect.value;
    // if (category === 'Custom') {
    //     category = customCategoryInput.value;
    // }
    // const amount = parseFloat(amountInput.value);

    // let transactions = JSON.parse(localStorage.getItem('monthlyTransactions')) || [];
    // transactions.push({ category, amount, date: new Date().toISOString() });
    // localStorage.setItem('monthlyTransactions', JSON.stringify(transactions));

    // //updateUI();
    // //checkCategoryLimits(); // Check limits after adding expense
    // closeAddExpenseModal();

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
            window.location.href = '/monthly/' + data.id + '/' + category;
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

    // const categorySelect = document.getElementById('deductCategory');
    // const customCategoryInput = document.getElementById('deductCustomCategory');
    // const amountInput = document.getElementById('deductAmount');

    // let category = categorySelect.value;
    // if (category === 'Custom') {
    //     category = customCategoryInput.value;
    // }
    // const amount = parseFloat(amountInput.value);

    // let transactions = JSON.parse(localStorage.getItem('monthlyTransactions')) || [];
    // transactions.push({ category, amount: -amount, date: new Date().toISOString() });
    // localStorage.setItem('monthlyTransactions', JSON.stringify(transactions));

    // //updateUI();
    // //checkCategoryLimits(); // Check limits after deducting expense
    // closeDeductExpenseModal();


    var categorySelect = document.getElementById('deductCategory');
    var category = categorySelect.value;
    var amount = parseFloat(document.getElementById('deductAmount').value);
    var categoryOther = ""; // Initialize the custom category name

    // // Check if custom category is selected and use that value
    // if (category === 'Others') {
    //     categoryOther = document.getElementById('deductCustomCategory').value;
    //     if (!category) { // Ensure the custom category is not empty
    //         alert('Please enter a name for the custom category.');
    //         return; // Stop the submission if no custom category name is provided
    //     }
    // }

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
            window.location.href = '/monthly/' + data.id;
        } else {
            alert('Failed to delete user: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function checkCategoryLimits(cataergy) {
    // let transactions = JSON.parse(localStorage.getItem('monthlyTransactions')) || [];
    // let categoryLimits = JSON.parse(localStorage.getItem('categoryLimits')) || {};
    // let categories = {};

    // transactions.forEach(tx => {
    //     if (categories[tx.category]) {
    //         categories[tx.category].amount += tx.amount;
    //     } else {
    //         categories[tx.category] = { amount: tx.amount, limit: categoryLimits[tx.category] || 300 };
    //     }
    // });

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
    // let transactions = JSON.parse(localStorage.getItem('monthlyTransactions')) || [];
    // let totalSpending = 0;
    // let categories = {};

    const categoriesList = JSON.parse(document.getElementById('spendingCategories').getAttribute('data-information'));

    // transactions.forEach(tx => {
    //     alert(tx.amount);
    //     totalSpending += tx.amount;
    //     if (!categories[tx.category]) {
    //         categories[tx.category] = { amount: 0, limit: tx.limit || 300 };
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

    if (categorySelect.value === 'Others') {
        customInput.style.display = 'block';
    } else {
        customInput.style.display = 'none';
    }
}

function checkCustomDeductCategory() {
    alert('here');
    var deductCategorySelect = document.getElementById('deductCategory');
    var deductcustomInput = document.getElementById('deductCustomCategory');

    if (deductCategorySelect.value === 'Others') {
        alert('here1');
        deductcustomInput.style.display = 'block';
    } else {
        deductcustomInput.style.display = 'none';
    }
}


function submitEditForm(event) {
    event.preventDefault();

    // const categoryName = document.getElementById('categoryName').value;
    // const categoryLimit = document.getElementById('categoryLimit').value;
    // const categoryId = document.getElementById('editForm').dataset.categoryId;

    // const label = document.getElementById('label' + categoryId);
    // const details = document.getElementById('details' + categoryId);
    // const progressBar = document.getElementById('progress' + categoryId);

    // if (label && details && progressBar) {
    //     label.textContent = categoryName;

    //     const currentSpend = details.textContent.split('/')[0].replace('$', '');
    //     details.textContent = `$${currentSpend}/$${categoryLimit}`;

    //     const spendPercentage = (parseFloat(currentSpend) / parseFloat(categoryLimit)) * 100;
    //     progressBar.style.width = `${spendPercentage}%`;
    // }

    // closeModal();

    var name = document.getElementById('categoryName').value;
    var newLimit = document.getElementById('categoryLimit').value; // This is the new limit
    var categoryId = document.getElementById('editForm').dataset.categoryId;

    var label = document.getElementById('label' + categoryId);
    var details = document.getElementById('details' + categoryId);
    var progressBar = document.getElementById('progress' + categoryId);

    var data = {
        location: 'LIMIT',
        name: name,
        newLimit: newLimit,
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
            window.location.href = '/monthly/' + data.id;
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
