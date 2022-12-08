import time
import jwt
import json
from flask import make_response
from dotenv import dotenv_values

secret_key=str(json.loads({ **dotenv_values(".env")}["secret_key"]))

class Api_view:
    
    def response_query_member(record : tuple):
        output={}
        if record:
            output["id"]=record[0]
            output["username"]=record[1]
            output["email"]=record[2]
            return{"data":output}, 200

    def response_user_signup(username: str, email: str, pw_hash: str, record_count: int):
        if (not username or not email or not pw_hash):
            return {
                "error": True,
                "message": "input empty values",
            }, 400
        if record_count==1: # update success
            return {"ok":True}, 200
        else: 
            return {
                "error": True,
                "message": "email existed",
            }, 400
    def response_query_signin(record: tuple, record_count: int, email: str, password: str):
        from application import bcrypt
        print(type(password))
        if (not email or not password):
            return {
                "error": True,
                "message": "input empty values",
            }, 400
        if record_count==1: # update success   
            if not bcrypt.check_password_hash(record[0], password):
                return {
                    "error": True,
                    "message": "wrong password, try again!",
                }, 400            
            
            now = time.time()
            exp= 60*60*24*7
            payload = {
                "email": email,
                "expire": now + exp,
            }
            token=jwt.encode(payload, secret_key, algorithm='HS256')            
            resp = make_response({"ok":True}, 200)
            resp.set_cookie(key="user",value= token, expires=time.time()+7*60*60*24) #unit: second
            return resp
        else: 
            return {
                "error": True,
                "message": "email not existed",
            }, 400
            
    def response_sign_out():
        resp = make_response({"ok":True}, 200)
        resp.set_cookie(key="user",value= "", expires=0) #unit: second
        return resp