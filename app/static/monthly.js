document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('spendingsChart').getContext('2d');
    const spendingsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Spendings',
                data: [800, 900, 1200, 1100, 1200, 1000],
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

