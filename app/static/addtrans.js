let trans = [];

// Function to generate a random pastel colour
function generatePastelColourHex() {
    const r = Math.floor((Math.random() * 127) + 127).toString(16).padStart(2, '0');
    const g = Math.floor((Math.random() * 127) + 127).toString(16).padStart(2, '0');
    const b = Math.floor((Math.random() * 127) + 127).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}

// Function to get a unique pastel colour
function getUniquePastelColourHex() {
    let colour;
    do {
        colour = generatePastelColourHex();
    } while (Object.values(labelColours).includes(colour));
    return colour;
}

// To update donut chart
function updateDonutChart(){
    myChart.data.labels = spendingLabels;
    myChart.data.datasets[0].data = Object.values(spendings);
    myChart.data.datasets[0].backgroundColor = spendingLabels.map(label => labelColours[label]);
    myChart.data.datasets[0].borderColor = spendingLabels.map(label => labelColours[label]);
    myChart.update();
}

function addTrans(cat, amt){
    const lowCat = cat.toLowerCase();
    const exstCatKey = spendingLabels.find(label => label.toLowerCase() === lowCat);

    trans.push({ cat, amt });

    if (exstCatKey){
        spendings[exstCatKey] += parseFloat(amt);
    } else {
        spendings[cat] = parseFloat(amt);
        spendingLabels.push(cat);
        labelColours[cat] = getUniquePastelColourHex();
    }

    updateDonutChart();
}

function removeTrans(index){
    const { cat, amt } = trans[index];
    trans.splice(index, 1);
    spendings[cat] -= parseFloat(amt);
    if (spendings[cat] <= 0) {
        delete spendings[cat];
        delete labelColours[cat];
    }

    updateDonutChart();
}


function addTransForm() {
    fetch('/static/addtrans.html')
        .then(response => response.text())
        .then(data => {
            const container = document.getElementById('addTransContainer');
            container.innerHTML = data;
            container.style.display = 'flex';

            // Attach event listener for form submission
            const form = document.getElementById('trans-form');
            if (form) {
                form.addEventListener('submit', function(event) {
                    event.preventDefault();
                    const categorySelect = document.getElementById('category');
                    const otherCategoryInput = document.getElementById('other-category');
                    const amount = document.getElementById('amount').value;

                    // Check if the amount is strictly valid
                    if (amount <= 0) {
                        alert("Please enter a valid amount.");
                        return;
                    }

                    const category = categorySelect.value === 'Others' ? otherCategoryInput.value : categorySelect.value;
                    
                    addTrans(category, amount);

                    hideAddTransForm();
                });
            }

            // Attach event listener for category change
            const categorySelect = document.getElementById('category');
            if (categorySelect) {
                categorySelect.addEventListener('change', toggleOtherCategoryInput);
            }

            // Initially hide the "other category" input field
            toggleOtherCategoryInput();
        });
}

function hideAddTransForm() {
    document.getElementById('addTransContainer').style.display = 'none';
}

function toggleOtherCategoryInput() {
    const categorySelect = document.getElementById('category');
    const otherCatGrp = document.getElementById('other-cat-group');
    if (categorySelect.value === 'Others') {
        otherCatGrp.style.display = 'block';
    } else {
        otherCatGrp.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('trans-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const categorySelect = document.getElementById('category');
            const otherCategoryInput = document.getElementById('other-category');
            const amount = document.getElementById('amount').value;

            // Check if the amount is strictly valid
            if (amount <= 0) {
                alert("Please enter a valid amount.");
                return;
            }

            const category = categorySelect.value === 'Others' ? otherCategoryInput.value : categorySelect.value;
            
            addTrans(category, amount);

            hideAddTransForm();
        });

        const categorySelect = document.getElementById('category');
        if (categorySelect) {
            categorySelect.addEventListener('change', toggleOtherCategoryInput);
        }

        toggleOtherCategoryInput();
    }
});
