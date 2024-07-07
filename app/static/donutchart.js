// Custom plugin to draw text in the center
const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: function(chart) {
        // Check if the center text configuration exists and the chart is ready
        const centerConfig = chart.config.options.plugins.centerText;
        if (centerConfig && chart.chartArea) {
            // Get ctx from string
            var ctx = chart.ctx;

            var fontStyle = centerConfig.fontStyle || 'Arial';
            var txt = centerConfig.text || '';
            var color = centerConfig.color || '#000';
            var sidePadding = centerConfig.sidePadding || 20;
            var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2);
            // Start with a base font of 30px
            ctx.font = "30px " + fontStyle;

            // Get the width of the string and also the width of the element
            var stringWidth = ctx.measureText(txt).width;
            var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

            // Find out how much the font can grow in width.
            var widthRatio = elementWidth / stringWidth;
            var newFontSize = Math.floor(30 * widthRatio);
            var elementHeight = (chart.innerRadius * 2);

            // Pick a new font size so it will not be larger than the height of label.
            var fontSizeToUse = Math.min(newFontSize, elementHeight);

            // Set font settings to draw it correctly.
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
            var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
            ctx.font = fontSizeToUse + "px " + fontStyle;
            ctx.fillStyle = color;

            // Draw text in center
            ctx.fillText(txt, centerX, centerY);
        }
    }
};

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
                'rgba(163, 213, 255, 100)',
                'rgba(204, 180, 255, 1)'
            ],
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
                color: '#FFFF99', // Default is #000000
                fontStyle: 'Arial', // Default is Arial
                sidePadding: 20 // Default is 20 (as a percentage)
            }
        },
        onClick: function(e) {
            var activePoints = myChart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false);
            if (activePoints.length > 0) {
                var index = activePoints[0].index;
                var label = myChart.data.labels[index];
                var value = myChart.data.datasets[0].data[index];
                var maxValue = 150; // Replace with actual max value if available
                var text = `${label}\n$${value}/$${maxValue}`;
                myChart.options.plugins.centerText.text = text;
                myChart.update();
            }
        }
    },
    plugins: [centerTextPlugin]
});
