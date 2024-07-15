let trans = [];
let transToRemove = null;

function generatePastelColourHex() {
    const r = Math.floor((Math.random() * 127) + 127).toString(16).padStart(2, '0');
    const g = Math.floor((Math.random() * 127) + 127).toString(16).padStart(2, '0');
    const b = Math.floor((Math.random() * 127) + 127).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}

function getUniquePastelColourHex() {
    let colour;
    do {
        colour = generatePastelColourHex();
    } while (Object.values(labelColours).includes(colour));
    return colour;
}

function updateDonutChart() {
    const totalSpent = Object.values(spendings).reduce((total, value) => total + value, 0) - spendings['Remaining'];
    spendings['Remaining'] = maxValue - totalSpent;

    const updatedLabels = Object.keys(spendings);
    const updatedData = Object.values(spendings);

    // Assuming myChart is defined and is a Chart.js instance
    myChart.data.labels = updatedLabels;
    myChart.data.datasets[0].data = updatedData;
    myChart.data.datasets[0].backgroundColor = updatedLabels.map(label => labelColours[label] || generatePastelColourHex());
    myChart.data.datasets[0].borderColor = updatedLabels.map(label => labelColours[label] || generatePastelColourHex());
    myChart.update();
}

function addTrans(cat, amt) {
    const lowCat = cat.toLowerCase();
    const exstCatKey = spendingLabels.find(label => label.toLowerCase() === lowCat);

    trans.push({ cat, amt });

    if (exstCatKey) {
        spendings[exstCatKey] += parseFloat(amt);
    } else {
        spendings[cat] = parseFloat(amt);
        spendingLabels.push(cat);
        labelColours[cat] = getUniquePastelColourHex();
    }

    updateDonutChart();
}

function removeTrans(index) {
    if (index >= 0 && index < trans.length) {
        const { cat, amt } = trans[index];
        trans.splice(index, 1);
        spendings[cat] -= parseFloat(amt);
        if (spendings[cat] <= 0) {
            delete spendings[cat];
            delete labelColours[cat];
            const labelIndex = spendingLabels.indexOf(cat);
            if (labelIndex > -1) {
                spendingLabels.splice(labelIndex, 1);
            }
        }
        updateDonutChart();
    } else {
        console.error(`Invalid index: ${index}`);
    }
}

function updateTransList() {
    const transList = document.getElementById('removeList');
    transList.innerHTML = '';

    if (trans.length === 0) {
        const noExpensesMessage = document.createElement('li');
        noExpensesMessage.textContent = 'No expenses to remove';
        noExpensesMessage.style.listStyleType = 'none'; // Optional: to remove bullet point
        transList.appendChild(noExpensesMessage);
    } else {
        trans.forEach((transaction, index) => {
            const li = document.createElement('li');
            li.textContent = `${transaction.cat}: $${transaction.amt}`;
            li.setAttribute('data-index', index);
            li.addEventListener('click', function() {
                showConfirmPopup(index);
            });
            transList.appendChild(li);
        });
    }
}

function showConfirmPopup(index) {
    transToRemove = index; // Set the global variable
    const confirmPopup = document.getElementById('confirmPopup');
    confirmPopup.classList.remove('hidden');
}

function hideConfirmPopup() {
    transToRemove = null; // Clear the global variable
    const confirmPopup = document.getElementById('confirmPopup');
    confirmPopup.classList.add('hidden');
}

function performRemove() {
    if (transToRemove !== null) {
        removeTrans(transToRemove);
        updateTransList();
        hideConfirmPopup();
    }
}

function showAddTransForm() {
    const addTransContainer = document.getElementById('addTransContainer');
    const removeTransContainer = document.getElementById('removeTransContainer');

    if (!addTransContainer.innerHTML.trim()) {
        fetch('static/addtrans.html') // Ensure the path is correct
            .then(response => response.text())
            .then(data => {
                addTransContainer.innerHTML = data;
                attachFormEvents(); // Attach events after loading the form
            });
    } else{
        resetAddTransForm();
    }

    removeTransContainer.style.display = 'none'; // Hide remove trans form
    addTransContainer.style.display = 'flex'; // Show add trans form
}

function resetAddTransForm() {
    const categorySelect = document.getElementById('category');
    const otherCategoryInput = document.getElementById('other-category');
    const amountInput = document.getElementById('amount');

    if (categorySelect) categorySelect.value = 'Food'; // Reset to default category
    if (otherCategoryInput) otherCategoryInput.value = ''; // Clear other category input
    if (amountInput) amountInput.value = ''; // Clear amount input

    toggleOtherCategoryInput(); // Ensure the "other category" input is hidden by default
}

function showRemoveTransForm() {
    const addTransContainer = document.getElementById('addTransContainer');
    const removeTransContainer = document.getElementById('removeTransContainer');
    
    addTransContainer.style.display = 'none'; // Hide add trans form
    removeTransContainer.style.display = 'flex'; // Show remove trans form
    updateTransList();
}

function hideAddTransForm() {
    document.getElementById('addTransContainer').style.display = 'none';
}

function hideRemoveTransForm() {
    document.getElementById('removeTransContainer').style.display = 'none';
}

function attachFormEvents() {
    const form = document.getElementById('trans-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const categorySelect = document.getElementById('category');
            const otherCategoryInput = document.getElementById('other-category');
            const amount = document.getElementById('amount').value;

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
    attachFormEvents();
});
