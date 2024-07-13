from .extensions import db

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

    def __init__(self, name, amount, date, recurring, account, type):
       self.name = name
       self.amount = amount
       self.date = date
       self.recurring = recurring
       self.account = account
       self.type = type