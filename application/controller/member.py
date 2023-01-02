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
import boto3
from botocore.client import Config

secret_key=str({ **dotenv_values(".env")}["secret_key"])

AWS_ACCESS_KEY=str({ **dotenv_values(".env")}["AWS_ACCESS_KEY"])
AWS_SECRET_KEY=str({ **dotenv_values(".env")}["AWS_SECRET_KEY"])
AWS_BUCKET=str({ **dotenv_values(".env")}["AWS_BUCKET"])
member = Blueprint(
    "member", 
    __name__,
    static_folder="static",
    template_folder="templates",
    )

@member.route("/user", methods=["GET"])
def member_page():
    return Api_view.response_member_page()

@member.route("/api/user/name", methods=["PATCH"])
@jwt_required(refresh=False) #use access token
def change_name():
    new_name=request.json["newName"]
    user_id = get_jwt()["sub"]["id"]
    if (not new_name):
        return Api_view.response_update_username(-1) #empty input
    
    record_count=Database.update_username(user_id, new_name)
    return Api_view.response_update_username(record_count)

@member.route("/api/user/pw", methods=["PATCH"])
@jwt_required(refresh=False) #use access token
def change_pw():
    new_pw=request.json["newPW"]
    confirm_new_pw=request.json["confirmNewPW"]
    old_pw=request.json["oldPW"]
    user_id = get_jwt()["sub"]["id"]
    valid_pw=validate_input.validate_password(new_pw)  
    db_member_record=Database.query_member(user_id)
    db_pw_hash=db_member_record[3]


    if( not new_pw or 
        not confirm_new_pw or 
        not old_pw):
        return Api_view.response_update_password(-1) #empty input
    elif new_pw != confirm_new_pw:
        return Api_view.response_update_password(-2)   #not equal
    elif not valid_pw["valid"]:
        return Api_view.response_input_valid(valid_pw) #not valid
    elif not bcrypt.check_password_hash(db_pw_hash, old_pw):
        return Api_view.response_update_password(-3)   #wrong old pw
    elif bcrypt.check_password_hash(db_pw_hash, new_pw):
        return Api_view.response_update_password(-4)   #same pw

    new_pw_hash = bcrypt.generate_password_hash(str(new_pw)).decode("utf-8")
    old_pw_hash = bcrypt.generate_password_hash(str(old_pw)).decode("utf-8")
    print(old_pw_hash)
    record_count=Database.update_password(user_id, new_pw_hash)
    return Api_view.response_update_password(record_count)
    

@member.route("/api/user/headshot", methods=["POST"])
@jwt_required(refresh=False) #use access token
def upload_image():
    user_id = get_jwt()["sub"]["id"]

    if not request.files:
        return Api_view.response_upload_photo(-1, "") # no file
    file = request.files['image']  # get the uploaded image file
    valid_image_contents=["image/png",
                          "image/jpeg",
                          "image/bmp",
                          "image/gif",
                          "image/svg+xml"
                          ]    
    
    if file.content_type not in valid_image_contents:
        return Api_view.response_upload_photo(-2, "") #no valid content type
    
    url=Database.upload_S3(file) #upload to s3    
    record_count=Database.upload_photo(user_id, file.filename) #upload to db
    return Api_view.response_upload_photo(record_count, url)
    
@member.route("/api/user/headshot/<filename>", methods=["GET"])
@jwt_required(refresh=False) #use access token
def get_photo_url(filename):
    
    url=Database.get_photo_url(filename)
    return Api_view.response_get_photo_url(url)




@member.route("/api/user/auth", methods=["GET"])
@jwt_required(refresh=False) #use access token
def query_member() ->tuple[dict[str:bool], int]:
    """get jwt token from cookie, parse and retrieve email to authenticate member"""
    
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
