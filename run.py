from app import create_app  # Make sure this import reflects the correct path to your app package

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)

