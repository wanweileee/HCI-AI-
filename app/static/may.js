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


// Clears all local storage
localStorage.clear();

// Clear a specific item in local storage
localStorage.removeItem('keyName'); // Replace 'keyName' with the key you want to remove
