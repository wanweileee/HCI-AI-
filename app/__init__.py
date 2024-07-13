from flask import Flask
from .extensions import db
from .models import Payment

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///payment.sqlite3';
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    from .routes import main
    app.register_blueprint(main)
    
    with app.app_context():
        db.create_all()

    return app
