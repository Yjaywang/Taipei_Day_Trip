from application.model.member_model import Database

def check_auth(user_id):
    return Database.query_member(user_id)