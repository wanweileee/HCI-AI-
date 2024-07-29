document.addEventListener('DOMContentLoaded', function () {
    const spendings = JSON.parse(document.getElementById('spendingsChart').getAttribute('data-spendings'));
    console.log(spendings);
    const ctx = document.getElementById('spendingsChart').getContext('2d');
    const spendingsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{
                label: 'Spendings',
                data: spendings,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
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
});
