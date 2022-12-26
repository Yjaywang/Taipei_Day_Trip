from flask import Blueprint
from flask import request
from application.model.member_model import Database
from application.view.member_resp import Api_view
import json
from dotenv import dotenv_values
from application import bcrypt
from utils import validate_input
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt


secret_key=str(json.loads({ **dotenv_values(".env")}["secret_key"]))


member = Blueprint(
    "member", 
    __name__,
    static_folder="static",
    template_folder="templates",
    )



@member.route("/member")
def member_page():
    return Api_view.response_member_page()



@member.route("/api/user/auth", methods=["GET"])
@jwt_required(refresh=False) #use access token
def query_member() ->tuple[dict[str:bool], int]:
    """get jwt token from cookie, parse and retrieve email to authenticate member"""
    
    print(request.cookies)
    user_id = get_jwt()["sub"]["id"]
    record=Database.query_member(user_id)
    return Api_view.response_query_member(record)   


@member.route("/api/user/auth", methods=["PUT"])
def sign_in() ->tuple[dict[str:bool], int]:
    """use email and password check member
    if ok, set jwt cookie 7 days and reload page"""

    email=request.json["email"]
    password=request.json["password"]
    if not password:
        return Api_view.response_query_signin(0, 0, email, password)

    record, row_count=Database.query_signin(email)
    return Api_view.response_query_signin(record, row_count, email, password)
    


@member.route("/api/user/refresh", methods=["POST"])
@jwt_required(refresh=True) #use refresh token
def refresh():    

    identity = get_jwt_identity()
    return Api_view.response_member_token_refresh(identity)
    
    

@member.route("/api/user/auth", methods=["DELETE"])
@jwt_required()
def sign_out():
    """clear cookie and reload"""
    return Api_view.response_sign_out()


@member.route("/api/user", methods=["POST"])
def signup() ->tuple[dict[str:bool], int]:    
    """sign up function, 
    password will process by bcrypt and store in database"""

    username=request.json["name"]
    email=request.json["email"]
    password=request.json["password"]

    #valid part
    valid_email=validate_input.validate_email(email)
    valid_pw=validate_input.validate_password(password)  

    if not password:
        return Api_view.response_user_signup(username, email, 0, 0)
    elif not valid_email["valid"]:
        return Api_view.response_input_valid(valid_email)
    elif not valid_pw["valid"]:
        return Api_view.response_input_valid(valid_pw)
 



    pw_hash = bcrypt.generate_password_hash(str(password)).decode("utf-8")
    record_count=Database.insert_signup(username, email, pw_hash)
    return Api_view.response_user_signup(username, email, pw_hash, record_count)
