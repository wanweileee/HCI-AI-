function submitTransaction(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    const category = document.getElementById('category').value;
    const amount = document.getElementById('amount').value;

    console.log("Transaction added:", category, amount); // Log the transaction, for now

    // Here you might want to send this data to a server
    // For now, we'll just redirect to the home page
    window.location.href = 'monthly'; // Change 'homepage.html' to your actual home page URL
}


function submitTransaction(event) {
    event.preventDefault();
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);

    // Retrieve existing transactions or initialize an empty array
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push({ category, amount });

    // Store updated transactions back to localStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Simulate immediate feedback
    alert('Transaction added!');
    window.location.href = '/monthly'; // Redirect to see updates
}
