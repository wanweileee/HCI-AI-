from .extensions import db
import random

first_names = ["John", "Jane", "Alice", "Bob", "Charlie", "Daisy"]
last_names = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis"]

def generate_random_name():
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    return f"{first_name} {last_name}"

class Payment(db.Model):
    __tablename__ = 'payment'
    __table_args__ = {'extend_existing': True}  # Add this line

    _id = db.Column("id", db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    amount = db.Column(db.Float)
    date = db.Column(db.String(100))
    recurring = db.Column(db.String(100))
    account = db.Column(db.String(100))
    type = db.Column(db.String(100))
    userid = db.Column(db.Integer,  db.ForeignKey('user.id', ondelete='CASCADE'))

    def __init__(self, name, amount, date, recurring, account, type, userid):
       self.name = name
       self.amount = amount
       self.date = date
       self.recurring = recurring
       self.account = account
       self.type = type
       self.userid = userid


class User(db.Model):
    __tablename__ = 'user'
    __table_args__ = {'extend_existing': True}  # Add this line

    id = db.Column("id", db.Integer, primary_key=True)
    username = db.Column(db.String(100))
    password = db.Column(db.String(100))
    transaction = db.relationship('Transaction', backref='user', cascade="all, delete-orphan", lazy='dynamic')
    payment = db.relationship('Payment', backref='user', cascade="all, delete-orphan", lazy='dynamic')
    translimit = db.relationship('TransLimit', backref='user', cascade="all, delete-orphan", lazy='dynamic')

    def __init__(self):
        self.username = generate_random_name()
        self.password = 'password123'


class Transaction(db.Model):
    __tablename__ = 'transaction'
    __table_args__ = {'extend_existing': True}  # Add this line

    id = db.Column("id", db.Integer, primary_key=True)
    type = db.Column(db.String(100))
    typeOther = db.Column(db.String(100))
    amount = db.Column(db.Float)
    date = db.Column(db.String(100))
    account = db.Column(db.String(100))
    weekly = db.Column(db.String(100))
    monthly = db.Column(db.String(100))
    day = db.Column(db.String(100))
    userid = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))

    def __init__(self, type,typeOther, amount, date, account, weekly, monthly, day, userid):
       self.type = type
       self.typeOther = typeOther
       self.amount = amount
       self.date = date
       self.account = account
       self.weekly = weekly
       self.monthly = monthly
       self.day = day
       self.userid = userid


class TransLimit(db.Model):
    __tablename__ = 'transLimit'
    __table_args__ = {'extend_existing': True}  # Add this line

    id = db.Column("id", db.Integer, primary_key=True)
    type = db.Column(db.String(100))
    limit = db.Column(db.Float)
    userid = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))
    
    def __init__(self, type, limit, userid):
        self.type = type
        self.limit = limit
        self.userid = userid



