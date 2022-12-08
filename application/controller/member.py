from flask import Blueprint
from flask import request
from application.model.member_model import Database
from application.view.member_resp import Api_view
import jwt
import json
from dotenv import dotenv_values
from application import bcrypt

secret_key=str(json.loads({ **dotenv_values(".env")}["secret_key"]))


member = Blueprint(
    "member", 
    __name__,
    static_folder="static",
    template_folder="templates",
    )


@member.route("/api/user/auth", methods=["GET"])
def query_member() ->tuple[dict[str:bool], int]:
    """get jwt token from cookie, parse and retrieve email to authenticate member"""
    token=request.cookies.get("user")
    jwt_res = jwt.decode(token, secret_key, algorithms='HS256')
    email=jwt_res["email"]
    record=Database.query_member(email)
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
    
         

@member.route("/api/user/auth", methods=["DELETE"])
def sign_out():
    """clear cookie and reload"""
    return Api_view.response_sign_out()


@member.route("/api/user", methods=["POST"])
def signup() ->tuple[dict[str:bool], int]:    
    """sign up function, 
    password will process by bcrypt and store in database"""

    username=request.json["username"]
    email=request.json["email"]
    password=request.json["password"]
    if not password:
        return Api_view.response_user(username, email, 0, 0)

    pw_hash = bcrypt.generate_password_hash(str(password)).decode("utf-8")
    record_count=Database.insert_signup(username, email, pw_hash)
    return Api_view.response_user_signup(username, email, pw_hash, record_count)
