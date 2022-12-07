#sys.path append
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


from flask import Blueprint
from flask import request
from model.database import Database
from view.api_response import Api_view

user = Blueprint("user", __name__,
                        template_folder='templates')

@user.route("/api/user", methods=["POST"])
def signup():    
    username=request.json["username"]
    email=request.json["email"]
    password=request.json["password"]

    record_count=Database.insert_signup(username, email, password)
    return Api_view.response_user(username, email, password, record_count)



    