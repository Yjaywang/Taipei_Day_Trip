#sys.path append
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

print((os.path.dirname(os.path.abspath(__file__))))
from flask import Blueprint
from flask import request
from application.model.database import Database
from application.view.api_response import Api_view
import jwt
import json
from dotenv import dotenv_values
# from application import bcrypt

# pw_hash = bcrypt.generate_password_hash('hunter2')
# bcrypt.check_password_hash(pw_hash, 'hunter2') # returns True



secret_key=str(json.loads({ **dotenv_values(".env")}["secret_key"]))


auth = Blueprint("auth", __name__,
                        template_folder='templates')



@auth.route("/api/user/auth", methods=["GET"])
def query_member():

    token=request.cookies.get("user")
    res = jwt.decode(token, secret_key, algorithms='HS256')
    email=res["email"]
    record=Database.query_member(email)
    return Api_view.response_query_member(record)   
    
    

@auth.route("/api/user/auth", methods=["PUT"])
def sign_in():
    
    email=request.json["email"]
    password=request.json["password"]
    
    record, record_count=Database.query_signin(email)
    return Api_view.response_query_signin(record, record_count, email, password)
    
         

@auth.route("/api/user/auth", methods=["DELETE"])
def sign_out():
    return Api_view.response_sign_out()
