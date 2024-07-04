from flask import Blueprint, render_template, request, redirect, url_for
import pytesseract
from PIL import Image
import os
from transformers import pipeline

classifier = pipeline('zero-shot-classification', model='facebook/bart-large-mnli')

pytesseract.pytesseract.tesseract_cmd = r'C:\Users\banan\OneDrive\Documents\GitHub\HCI-AI-\tesseract.exe'  # Adjust the path if needed

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

@main.route('/login')
def login():
    return render_template('login.html')

@main.route('/signup')
def signup():
    return render_template('signup.html')

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
    categories = {'Food': [], 'Transport': [], 'Others': []}
    candidate_labels = ['Food', 'Transport', 'Others']
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