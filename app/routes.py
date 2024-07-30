import json
from flask import Blueprint, render_template, request, redirect, url_for, jsonify
import pytesseract
from PIL import Image
import os
from transformers import pipeline
from .extensions import db
from .models import *
from sqlalchemy import distinct
import datetime

classifier = pipeline('zero-shot-classification', model='facebook/bart-large-mnli')

pytesseract.pytesseract.tesseract_cmd = r'C:\Users\fawzi\Desktop\TERM 5\60.005 HCI and AI\HCI-AI-\tesseract.exe'  # Adjust the path if needed

main = Blueprint('main', __name__)


# Sample data to simulate a database
payments = {
    1: {"id": 1, "name": "Chatgpt", "amount": 40, "date": "2024-06-29", "recurring": "Monthly", "account": "DBS bank", "type": "Planned Payments"}
}

transaction_data = {
    1: { "type": "Food","typeOther": "", "amount": 20, "date": "2024-07-01", "account": "DBS bank", "weekly": "1", "monthly": "July", "day": "Monday"},
    2: { "type": "Transport","typeOther": "", "amount": 20.25, "date": "2024-07-01", "account": "DBS bank", "weekly": "1", "monthly": "July", "day": "Monday"},
    3: { "type": "Clothing","typeOther": "", "amount": 30, "date": "2024-07-02", "account": "DBS bank", "weekly": "1", "monthly": "July", "day": "Tuesday"},
    4: { "type": "Food","typeOther": "", "amount": 20, "date": "2024-07-03", "account": "DBS bank", "weekly": "1", "monthly": "July", "day": "Wednesday"},
    5: { "type": "Entertainment","typeOther": "", "amount": 13.50, "date": "2024-07-04", "account": "DBS bank", "weekly": "1", "monthly": "July", "day": "Thursday"},
    6: { "type": "Clothing","typeOther": "", "amount": 50, "date": "2024-07-05", "account": "DBS bank", "weekly": "1", "monthly": "July", "day": "Friday"},
    7: { "type": "Miscellaneous","typeOther": "", "amount": 17.25, "date": "2024-07-06", "account": "DBS bank", "weekly": "1", "monthly": "July", "day": "Saturday"},
    8: { "type": "Food","typeOther": "", "amount": 20, "date": "2024-07-07", "account": "DBS bank", "weekly": "1", "monthly": "July", "day": "Sunday"},
    9: { "type": "Food","typeOther": "", "amount": 9, "date": "2024-07-07", "account": "DBS bank", "weekly": "1", "monthly": "July", "day": "Sunday"},
    10: { "type": "Food","typeOther": "", "amount": 20, "date": "2024-07-08", "account": "DBS bank", "weekly": "2", "monthly": "July", "day": "Monday"},
    11: { "type": "Transport","typeOther": "", "amount": 20.25, "date": "2024-07-08", "account": "DBS bank", "weekly": "2", "monthly": "July", "day": "Monday"},
    12: { "type": "Clothing","typeOther": "", "amount": 30, "date": "2024-07-09", "account": "DBS bank", "weekly": "2", "monthly": "July", "day": "Tuesday"},
    13: { "type": "Food","typeOther": "", "amount": 20, "date": "2024-07-09", "account": "DBS bank", "weekly": "2", "monthly": "July", "day": "Wednesday"},
    14: { "type": "Entertainment","typeOther": "", "amount": 13.50, "date": "2024-07-10", "account": "DBS bank", "weekly": "2", "monthly": "July", "day": "Thursday"},
    15: { "type": "Clothing","typeOther": "", "amount": 50, "date": "2024-07-11", "account": "DBS bank", "weekly": "2", "monthly": "July", "day": "Friday"},
    16: { "type": "Miscellaneous","typeOther": "", "amount": 17.25, "date": "2024-07-12", "account": "DBS bank", "weekly": "2", "monthly": "July", "day": "Saturday"},
    17: { "type": "Food","typeOther": "", "amount": 20, "date": "2024-07-13", "account": "DBS bank", "weekly": "2", "monthly": "July", "day": "Sunday"},
    18: { "type": "Food","typeOther": "", "amount": 9, "date": "2024-07-13", "account": "DBS bank", "weekly": "2", "monthly": "July", "day": "Sunday"}
}

init_limit = {
    1: { "type": "Food", 'limitAmt': 100},
    2: { "type": "Transport", 'limitAmt': 100},
    3: { "type": "Clothing", 'limitAmt': 100},
    4: { "type": "Entertainment", 'limitAmt': 100},
    5: { "type": "Miscellaneous", 'limitAmt': 100},
    6: { "type": "Others", 'limitAmt': 100}

}

dump_data = {
    "January": 800,
    "February": 900,
    "March": 1200,
    "April": 1100,
    "May": 1200,
    "June": 1000,
}

@main.route('/home/<int:ids>')
def home(ids):
    foundtransaction = Transaction.query.filter_by(userid=ids).first()
    if not foundtransaction:
        for trans_id, details in transaction_data.items():
            new_transaction = Transaction(
                type=details["type"],
                typeOther=details["typeOther"],
                amount=details["amount"],
                date=details["date"],
                account=details["account"],
                weekly=details["weekly"],
                monthly=details["monthly"],
                day=details["day"],
                userid=ids
            )
            db.session.add(new_transaction)

    foundtransactionLimit = TransLimit.query.filter_by(userid=ids).first()
    if not foundtransactionLimit:
        for trans_id, details in init_limit.items():
            new_transaction_limit = TransLimit(
                type=details["type"],
                limit=details["limitAmt"],
                userid=ids
            )
            db.session.add(new_transaction_limit)

        db.session.commit()
    
    usertransactions = Transaction.query.filter_by(userid=ids, monthly='July', weekly = '1').all()
    total_spent = sum([transaction.amount for transaction in usertransactions])
    if len(usertransactions) > 0:
        avg_spent = str("${:.2f}".format(total_spent / len(usertransactions)))
    else:
        avg_spent = "$0"  # Default or fallback value if no transactions are present


        
    return render_template('homepage.html', id=ids, totalspent= ("$" + str(total_spent)), avgspent=avg_spent )

@main.route('/goals/<int:ids>')
def goals(ids):
    return render_template('goals.html', payments=payments)

@main.route('/more/<int:ids>', methods=['GET', 'POST'])
def settings(ids):
    if(request.method == 'POST'):
        user_to_delete = User.query.filter_by(id=ids).first()
        if (user_to_delete):
            db.session.delete(user_to_delete)
            db.session.commit()
            return jsonify({"status": "success", "message": "Logged out successfully"}), 200
        else:
            return jsonify({"status": "error", "message": "User not found"}), 404
        
    return render_template('settings.html', id=ids)

@main.route('/add/<int:ids>', methods=['GET', 'POST'])
def add(ids):
    if(request.method == 'POST'):
        data = request.get_json()
        category = data.get('category')
        categoryOther = data.get('categoryOther')
        amount = data.get('amount')

        month,week,day = get_month_week_day(datetime.datetime.now())

        if category and amount:
            new_transaction = Transaction(
                type=category,
                typeOther=categoryOther,
                amount=amount,
                date=datetime.datetime.now().strftime("%Y-%m-%d"),
                account='',
                weekly=week,
                monthly=month,
                day=day,
                userid=ids
            )
            db.session.add(new_transaction)
            db.session.commit()

        return jsonify({"status": "success", "id": ids}), 200
    return render_template('add.html', id=ids)

@main.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        numofusers = User.query.count()
        if numofusers > 5:
            db.session.query(User).delete()
            db.session.commit()
        
        new_user = User()
        db.session.add(new_user)
        db.session.commit()

        id = User.query.order_by(User.id.desc()).first().id
        
        return redirect(url_for("main.home", ids=id));
    return render_template('login.html')

@main.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        # numofusers = User.query.count()
        # if numofusers > 5:
        #     db.session.query(User).delete()
        #     db.session.commit()
        
        new_user = User()
        db.session.add(new_user)
        db.session.commit()

        id = User.query.order_by(User.id.desc()).first().id
        
        return redirect(url_for("main.home", ids=id));
    else:
        return render_template('signup.html')

@main.route('/planning/<int:ids>', methods=['GET', 'POST'])
def planning(ids):
    foundpayments = Payment.query.filter_by(userid=ids,name='Chatgpt').first()
    if not foundpayments:
        new_payment = Payment(name='Chatgpt', amount=40, date='2024-06-29', recurring='Monthly', account='DBS bank', type='Planned Payments', userid=ids)
        db.session.add(new_payment)
        db.session.commit()

    return render_template('planning.html', id=ids, payments=payments)


@main.route('/monthly/<int:ids>', methods=['GET', 'POST'])
@main.route('/monthly/<int:ids>/<cater>', methods=['GET', 'POST'])
def monthly(ids, cater=None):
    if request.method == 'POST':
        data = request.get_json()
        if data.get('location') == 'Limit':
            category_id = data.get('categoryId')
            new_limit = data.get('newLimit')
            
            if category_id and new_limit:
                category = TransLimit.query.filter_by(userid=ids, type=category_id).first()
                if category:
                    category.limit = new_limit
                    db.session.commit()
                    return jsonify({"status": "success", "id": ids}), 200
                else:
                    return jsonify({"status": "error", "message": "Category not found"}), 404
        else:
            category = data.get('category')
            categoryOther = data.get('categoryOther')
            amount = data.get('amount')

            month,week,day = get_month_week_day(datetime.datetime.now())

            if category and amount:
                new_transaction = Transaction(
                    type=category,
                    typeOther=categoryOther,
                    amount=amount,
                    date=datetime.datetime.now().strftime("%Y-%m-%d"),
                    account='',
                    weekly=week,
                    monthly=month,
                    day=day,
                    userid=ids
                )
                db.session.add(new_transaction)
                db.session.commit()

            return jsonify({"status": "success", "id": ids}), 200   

        return redirect(url_for('main.monthly', ids=ids))
    else:
        month = 'July'
        months_up_to_selected, months_full_up_to_selected = get_months_up_to(month)
        month_display = json.dumps(months_up_to_selected)

        if(month == 'July' or month == 'August' or month == 'September' or month == 'October' or month == 'November' or month == 'December'):
            usertransactions = Transaction.query.filter_by(userid=ids, monthly=month).all()
            total_spent = sum([transaction.amount for transaction in usertransactions])
            print(total_spent)
            if len(usertransactions) > 0:
                avg_spent = str("${:.2f}".format(total_spent / 4))
            else:
                avg_spent = "$0"  # Default or fallback value if no transactions are present
        else:
            for key, value in dump_data.items():
                if key == month:
                    total_spent = value
                    avg_spent = str("${:.2f}".format(total_spent / 4))
                    break
        
        number_of_months = len(months_up_to_selected)
        dump_data_list = [800,900,1200,1100,1200,1000]
        if number_of_months < 7:
            amount_display = json.dumps(dump_data_list)
        else:
            for month in months_full_up_to_selected:
                if month in dump_data:
                    continue
                else:
                    usertransactions = Transaction.query.filter_by(userid=ids, monthly=month).all()
                    total_spent = sum([transaction.amount for transaction in usertransactions])
                    dump_data_list.append(total_spent)
                
            amount_display = json.dumps(dump_data_list)
        

        distinct_types_query = db.session.query(db.distinct(Transaction.type)).filter(
            Transaction.userid == ids,
            Transaction.monthly == month
        )
        distinct_types = distinct_types_query.all()
        distinct_types_list = [type[0] for type in distinct_types]
        
        distinct_types_info = []
        for type in distinct_types_list:
            distinct_types_spend = {}
            type_spend = db.session.query(db.func.sum(Transaction.amount)).filter(
                Transaction.userid == ids,
                Transaction.monthly == month,
                Transaction.type == type
            ).scalar()

            type_limit = db.session.query(TransLimit.limit).filter(TransLimit.userid == ids, TransLimit.type == type).scalar()

            distinct_types_spend['category'] = type
            distinct_types_spend['amount'] = type_spend
            distinct_types_spend['limit'] = type_limit
            distinct_types_info.append(distinct_types_spend)

        distinct_types_info_list = json.dumps(distinct_types_info)
    
    return render_template('monthly.html', id=ids, month=month, month_display=month_display,amount_display = amount_display,totalspent= ("$" + str(total_spent)), avgspent=avg_spent, distinctType = distinct_types_info_list, catar = cater)

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

@main.route('/scan', methods=['GET', 'POST'])
def scan():
    if request.method == 'POST':
        if 'file' not in request.files:
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            return redirect(request.url)
        if file:
            upload_folder = os.path.join('app/static/uploads')
            if not os.path.exists(upload_folder):
                os.makedirs(upload_folder)
            file_path = os.path.join(upload_folder, file.filename)
            file.save(file_path)
            text = pytesseract.image_to_string(Image.open(file_path))
            categorized_expenses = categorize_expenses(text)
            return render_template('scan_results.html', text=text, categories=categorized_expenses)
    return render_template('scan.html')

def categorize_expenses(text):
    categories = {'Food': [], 'Transport': [], 'Entertainment':[],'Others': []}
    candidate_labels = ['Food', 'Transport','Entertainment','Shopping' ,'Groceries','Others']
    lines = text.split('\n')
    for line in lines:
        line = line.strip()  # Remove any leading/trailing whitespace
        if line:  # Only process non-empty lines
            try:
                result = classifier(line, candidate_labels)
                label = result['labels'][0]
                categories[label].append(line)
            except Exception as e:
                print(f"Error processing line: {line}. Error: {e}")
                categories['Others'].append(line)
    return categories

def get_month_week_day(date):
    # Parse the date if it's a string, or use directly if it's already a datetime.date object
    if isinstance(date, str):
        date = datetime.datetime.strptime(date, '%Y-%m-%d').date()

    # Get the month name and the day name
    month_name = date.strftime("%B")
    day_name = date.strftime("%A")

    # Calculate the week of the month
    first_day_of_month = date.replace(day=1)
    start_day_of_week = first_day_of_month.weekday()
    day_of_month = date.day
    week_of_month = (day_of_month + start_day_of_week - 1) // 7 + 1

    return month_name, week_of_month, day_name


def month_to_number(month_name):
    # Parses the month name to a datetime object assuming it's the first of that month in any year
    # '%B' is the format code for the full month name
    month_number = datetime.datetime.strptime(month_name, '%B').month
    return month_number

def get_months_up_to(selected_month):
    # List of full month names
    months_full = ["January", "February", "March", "April", "May", "June", 
                   "July", "August", "September", "October", "November", "December"]

    # Abbreviated month names for return
    months_abbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    # Find index of the selected month in the full month list
    try:
        index = months_full.index(selected_month)
    except ValueError:
        return []  # Return an empty list if the month is not found

    # Return the slice of abbreviated months up to and including the selected month
    return months_abbr[:index + 1], months_full[:index + 1]
