document.addEventListener('DOMContentLoaded', () => {
    const segments = document.querySelectorAll('.segment');
    const textElement = document.querySelector('.inside-circle .text');
    const detailsElement = document.querySelector('.inside-circle .details');
    const form = document.getElementById('expense-form');
    const categoryInput = document.getElementById('new-category');
    const amountInput = document.getElementById('amount');
    const progressCircle = document.getElementById('progress-circle');
    const budget = 150;
    let expenses = {
        Food: 69.32,
        Entertainment: 45.00,
        Utilities: 36.00,
    };

    const updateChart = () => {
        Object.keys(expenses).forEach(category => {
            let segment = document.querySelector(`.segment[data-category="${category}"]`);
            if (!segment) {
                // Create a new segment if it doesn't exist
                segment = document.createElement('div');
                segment.classList.add('segment');
                segment.setAttribute('data-category', category);
                segment.style.setProperty('--color', getRandomColor());
                progressCircle.appendChild(segment);
                // Add click event to the new segment
                segment.addEventListener('click', () => {
                    updateDetails(category);
                    segments.forEach(s => s.classList.remove('active'));
                    segment.classList.add('active');
                });
            }
            const percentage = (expenses[category] / budget) * 100;
            segment.style.setProperty('--percentage', percentage);
        });
    };

    const updateDetails = (category) => {
        const amountSpent = expenses[category];
        const percentage = (amountSpent / budget) * 100;
        textElement.textContent = category;
        detailsElement.textContent = `$${amountSpent.toFixed(2)}/$${budget} (${percentage.toFixed(1)}%)`;
    };

    segments.forEach(segment => {
        segment.addEventListener('click', () => {
            const category = segment.getAttribute('data-category');
            updateDetails(category);
            segments.forEach(s => s.classList.remove('active'));
            segment.classList.add('active');
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const category = categoryInput.value.trim();
        const amount = parseFloat(amountInput.value);
        if (category && !isNaN(amount) && amount > 0) {
            if (!expenses[category]) {
                expenses[category] = 0;
            }
            expenses[category] += amount;
            updateChart();
            updateDetails(category);
            categoryInput.value = '';
            amountInput.value = '';
            closeModal();
        }
    });

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    updateChart();
});
