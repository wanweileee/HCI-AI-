function submitTransaction(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    const category = document.getElementById('category').value;
    const amount = document.getElementById('amount').value;

    console.log("Transaction added:", category, amount); // Log the transaction, for now

    // Here you might want to send this data to a server
    // For now, we'll just redirect to the home page
    window.location.href = 'monthly'; // Change 'homepage.html' to your actual home page URL
}
