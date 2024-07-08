// Custom plugin to draw text in the center
const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: function(chart) {
        const centerConfig = chart.config.options.plugins.centerText;
        if (centerConfig && chart.chartArea) {
            const ctx = chart.ctx;

            const fontStyle = centerConfig.fontStyle || 'Arial';
            const txt = centerConfig.text || '';
            const colour = centerConfig.colour || '#000';

            // Split the text into two lines
            const lines = txt.split('\n');

            // Get the radius of the inner circle
            const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;

            // Calculate the maximum font size that fits within the inner circle
            let newFontSize = Math.min(innerRadius / 3, 20); // Adjust to ensure it fits

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
            const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
            ctx.fillStyle = colour;

            // Set the font once
            ctx.font = newFontSize + "px " + fontStyle;

            // Draw each line
            lines.forEach((line, index) => {
                const lineY = centerY - newFontSize / 2 + (index * newFontSize * 1.2); // Adjust line spacing
                ctx.fillText(line, centerX, lineY);
            });
        }
    }
};

function formatCurrency(value) {
    return value%1 == 0 ? value.toString() : value.toFixed(2);
}

let spendings ={
    'Food': 0.46*150,
    'Entertainment': 0.09*150,
    'Transport': 0.135*150,
    'Clothing': 0.20*150,
    'Miscellaneous': 0.115*150
};

const spendingLabels = Object.keys(spendings);
const spendingData = Object.values(spendings);

const labelColours = {
    'Food': '#FEFFBD',
    'Entertainment': '#B0F1BE',
    'Transport': '#FFB2C5',
    'Clothing': '#CEB4FF',
    'Miscellaneous': '#A3D5FF'
};

const ctx = document.getElementById('donut').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: spendingLabels,
        datasets: [{
            label: 'Spendings',
            data: spendingData,
            backgroundColor: spendingLabels.map(label => labelColours[label]),
            borderColor: spendingLabels.map(label => labelColours[label]),
            borderWidth: 0.5
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '80%',
        plugins: {
            centerText: {
                text: '', // Start with no text
                colour: '#FFFFFF', // Default is #000000
                fontStyle: 'Inter', // Default is Arial
                sidePadding: 20 // Default is 20 (as a percentage)
            },
            tooltip: {
                enabled: false // Disable tooltips
            }
        },
        onClick: function(e) {
            const activePoints = myChart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false);
            if (activePoints.length > 0) {
                const index = activePoints[0].index;
                const label = myChart.data.labels[index];
                const value = myChart.data.datasets[0].data[index];
                const maxValue = 150; // Replace with actual max value if available
                const text = `${label}\n$${formatCurrency(value)} / $${formatCurrency(maxValue)}`;
                const colour = labelColours[label] || '#FFFFFF';                myChart.options.plugins.centerText.text = text;
                myChart.options.plugins.centerText.colour = colour;
                myChart.update();
            }
        }
    },
    plugins: [centerTextPlugin]
});
