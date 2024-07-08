from flask import Blueprint, render_template, request, redirect, url_for

main = Blueprint('main', __name__)

# Sample data to simulate a database
payments = {
    1: {"id": 1, "name": "Chatgpt", "amount": 40, "date": "2024-06-29", "recurring": "Monthly", "account": "DBS bank", "type": "Planned Payments"}
}

@main.route('/')
def home():
    return render_template('homepage.html')

@main.route('/goals')
def goals():
    return render_template('goals.html', payments=payments)

@main.route('/more')
def settings():
    return render_template('settings.html')

@main.route('/add')
def add():
    return render_template('add.html')

@main.route('/scan')
def scan():
    return render_template('scan.html')

@main.route('/login')
def login():
    return render_template('login.html')

@main.route('/signup')
def signup():
    return render_template('signup.html')

@main.route('/planning')
def planning():
    return render_template('planning.html', payments=payments)

@main.route('/edit_payment/<int:payment_id>')
def edit_payment(payment_id):
    payment = payments.get(payment_id)
    if payment:
        return render_template('edit_payment.html', payment=payment)
    else:
        return "Payment not found", 404

@main.route('/update_payment/<int:payment_id>', methods=['POST'])
def update_payment(payment_id):
    # Retrieve the updated data from the form
    updated_payment = {
        "id": payment_id,
        "name": request.form['name'],
        "amount": float(request.form['amount']),
        "date": request.form['date'],
        "recurring": request.form['recurring'],
        "account": request.form['account'],
        "type": request.form.get('type', 'Planned Payments')  # Provide a default value if type is not present
    }
    # Update the payment details in the sample data (in a real app, this would be a database update)
    payments[payment_id] = updated_payment
    return redirect(url_for('main.planning'))
