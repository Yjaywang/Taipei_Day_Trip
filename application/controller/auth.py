from flask import Blueprint
from flask import request
from application.model.database import Database
from application.view.api_response import Api_view
import jwt
import json
from dotenv import dotenv_values

secret_key=str(json.loads({ **dotenv_values(".env")}["secret_key"]))


auth = Blueprint(
    "auth", 
    __name__,
    static_folder="static",
    template_folder="templates",
    )


@auth.route("/api/user/auth", methods=["GET"])
def query_member() ->tuple[dict[str:bool], int]:
    """get jwt token from cookie, parse and retrieve email to authenticate member"""
    token=request.cookies.get("user")
    jwt_res = jwt.decode(token, secret_key, algorithms='HS256')
    email=jwt_res["email"]
    record=Database.query_member(email)
    return Api_view.response_query_member(record)   
    
    

@auth.route("/api/user/auth", methods=["PUT"])
def sign_in() ->tuple[dict[str:bool], int]:
    """use email and password check member
    if ok, set jwt cookie 7 days and reload page"""

    email=request.json["email"]
    password=request.json["password"]
    if not password:
        return Api_view.response_query_signin(0, 0, email, password)

    record, row_count=Database.query_signin(email)
    return Api_view.response_query_signin(record, row_count, email, password)
    
         

@auth.route("/api/user/auth", methods=["DELETE"])
def sign_out():
    """clear cookie and reload"""
    return Api_view.response_sign_out()
