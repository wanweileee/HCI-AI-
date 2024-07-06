document.addEventListener('DOMContentLoaded', (event) => {
    var ctx = document.getElementById('donut').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Food', 'Entertainment', 'Transport', 'Clothing', 'Miscellaneous'],
            datasets: [{
                label: 'Spendings',
                data: [46, 9, 13.5, 20, 11.5],
                backgroundColor: [
                    'rgba(254, 255, 189, 1)',
                    'rgba(176, 241, 190, 1)',
                    'rgba(255, 178, 197, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(163, 213, 255, 1)',
                    'rgba(206, 180, 255, 1)'
                ],
                borderColor: [
                    'rgba(254, 255, 189, 1)',
                    'rgba(176, 241, 190, 1)',
                    'rgba(255, 178, 197, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(163, 213, 255, 1)',
                    'rgba(204, 180, 250, 1)'
                ],
                borderWidth: 0.5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                datalabels: {
                    formatter: (value, context) => {
                        const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        const percentage = (value / total * 100).toFixed(2) + '%';
                        return percentage;
                    },
                    color: '#fff',
                    anchor: 'end',
                    align: 'start',
                    offset: -10,
                    borderWidth: 2,
                    borderColor: '#fff',
                    borderRadius: 25,
                    backgroundColor: (context) => context.dataset.backgroundColor,
                    font: {
                        weight: 'bold'
                    }
                }
            }
        }
    });
});
