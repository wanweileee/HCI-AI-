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

    // Store categoryId in the form for use when submitting
    document.getElementById('editForm').dataset.categoryId = categoryId;
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

function submitForm(event) {
    event.preventDefault(); // This prevents the default form submission which refreshes the page

    // Retrieve values from the form
    var name = document.getElementById('categoryName').value;
    var limit = document.getElementById('categoryLimit').value;

    // Retrieve the category ID stored in the form's data attribute
    var categoryId = document.getElementById('editForm').dataset.categoryId;

    // Update the category name and limit details on the page
    if (categoryId) {
        var label = document.getElementById('label' + categoryId);
        var details = document.getElementById('details' + categoryId);
        var progressBar = document.getElementById('progress' + categoryId);

        if (label && details && progressBar) {
            label.textContent = name;
            details.textContent = `$${limit.split('/')[0]}/$${limit}`;

            // Update progress bar
            var currentSpend = parseFloat(limit.split('/')[0]);
            var newLimit = parseFloat(limit);
            var spendPercentage = (currentSpend / newLimit) * 100;
            progressBar.style.width = `${spendPercentage}%`;
        }
    }

    // Close the modal
    closeModal();
}



