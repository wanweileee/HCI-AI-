from flask import Blueprint, render_template

main = Blueprint('main', __name__)

@main.route('/')
def home():
    return render_template('homepage.html')

@main.route('/goals')
def goals():
    return render_template('goals.html')

@main.route('/settings')
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

@main.route('/monthly')
def monthly():
    return render_template('monthly.html')

@main.route('/may')
def may():
    return render_template('may.html')  # Assuming you have a template for May
