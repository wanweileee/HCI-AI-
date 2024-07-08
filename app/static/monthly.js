function getTotalSpending() {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
}

document.addEventListener('DOMContentLoaded', function () {
    const totalSpending = getTotalSpending(); // Ensure this is called here

    const ctx = document.getElementById('spendingsChart').getContext('2d');
    const spendingsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Spendings',
                data: [800, 900, 1200, 1100, 1200, 450 + totalSpending],
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
});


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
    var newLimit = document.getElementById('categoryLimit').value; // This is the new limit
    var categoryId = document.getElementById('editForm').dataset.categoryId;

    var label = document.getElementById('label' + categoryId);
    var details = document.getElementById('details' + categoryId);
    var progressBar = document.getElementById('progress' + categoryId);

    if (label && details && progressBar) {
        label.textContent = name;

        // Extract current spending from the details and update only the limit part
        var currentSpend = details.textContent.split('/')[0].replace('$', ''); // Gets current spend removing '$'
        details.textContent = `$${currentSpend}/$${newLimit}`; // Updates with new limit

        var spendPercentage = (parseFloat(currentSpend) / parseFloat(newLimit)) * 100;
        progressBar.style.width = `${spendPercentage}%`;
    }

    closeModal();
}


document.addEventListener('DOMContentLoaded', function() {
    updateUI();
});

function updateUI() {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let totalSpending = 0;
    let categories = {};

    // Aggregate transactions into categories and total spending
    transactions.forEach(tx => {
        totalSpending += tx.amount;
        if (categories[tx.category]) {
            categories[tx.category] += tx.amount;
        } else {
            categories[tx.category] = tx.amount;
        }
    });

    // Update total spending and money out
    document.querySelector('.current-spending').innerHTML = `Total spending:<br>$${450 + totalSpending}`;
    document.querySelector('.money-out').textContent = ` -$${450 + totalSpending}`;

    // Update categories
    for (let category in categories) {
        updateCategory(category, categories[category]);
    }
}

function updateCategory(category, amount) {
    let details = document.getElementById(`details${category}`);
    let progressBar = document.getElementById(`progress${category}`);

    if (details && progressBar) {
        // Extract current spending and limit from the details element
        let currentDetails = details.textContent.split('/'); // E.g., "$150/$300"
        let currentSpend = parseFloat(currentDetails[0].slice(1)); // Removes the '$' and converts to float
        let limit = parseFloat(currentDetails[1].slice(1)); // Removes the '$' and converts to float

        let newSpend = currentSpend + amount; // Add the new amount to the current spend
        details.textContent = `$${newSpend}/$${limit}`; // Update the text content with the new spend

        // Calculate new percentage for the progress bar
        let spendPercentage = Math.min((newSpend / limit) * 100, 100); // Ensure it does not exceed 100%
        progressBar.style.width = `${spendPercentage}%`; // Update the width of the progress bar
    } else {
        // If the category does not exist, create a new category bar
        createCategoryBar(category, amount);
    }
}


function createCategoryBar(category, amount) {
    let container = document.querySelector('.spending-categories');
    let newCategory = document.createElement('div');
    newCategory.className = 'category';
    newCategory.innerHTML = `
        <label id="label${category}">${category}</label>
        <div class="progress-container">
            <div class="progress-bar" id="progress${category}" style="width: 50%;"></div>
        </div>
        <div class="category-details" id="details${category}">$${amount}/$300</div>
        <button onclick="openModal('${category}', '300', '${category}')">✎</button>
    `;
    container.appendChild(newCategory);
}

/*
// Clears all local storage
localStorage.clear();

// Clear a specific item in local storage
localStorage.removeItem('keyName'); // Replace 'keyName' with the key you want to remove
*/