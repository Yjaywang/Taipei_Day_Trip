from flask import Blueprint
from flask import request
from application.model.booking_model import Database
from application.view.booking_resp import Api_view
from dotenv import dotenv_values
from utils import auth
import jwt
import json
secret_key=str(json.loads({ **dotenv_values(".env")}["secret_key"]))


bookings =Blueprint(
    "bookings",
    __name__,
    static_folder="static",
    template_folder="templates",
    )

@bookings.route("/booking")
def booking():
    return Api_view.response_booking_page()

@bookings.route("/api/booking", methods=["GET"])
def get_booking():
    token=request.cookies.get("user")
    if(not token):
        return Api_view.response_query_booking(-1, 1)
    else:
        jwt_res = jwt.decode(token, secret_key, algorithms='HS256')
        user_id=jwt_res["id"]
        auth_result=auth.check_auth(user_id)
        if (not auth_result):
            return Api_view.response_query_booking(-1, 1)
        else: 
            records, row_count=Database.query_booking(user_id)
            return Api_view.response_query_booking(records, row_count)

@bookings.route("/api/booking", methods=["POST"])
def insert_booking():
    token=request.cookies.get("user")
    if(not token):
        return Api_view.response_insert_booking(-1)
    else:        
        jwt_res = jwt.decode(token, secret_key, algorithms='HS256')
        user_id=jwt_res["id"]
        auth_result=auth.check_auth(user_id)
        if (not auth_result):
            return Api_view.response_insert_booking(-1)
        else: 
            attraction_id=request.json["attractionId"]
            date=request.json["date"]
            time=request.json["time"]            

            row_count=Database.insert_booking(user_id, attraction_id, date, time)
            return Api_view.response_insert_booking(row_count)

@bookings.route("/api/booking", methods=["DELETE"])
def delete_booking():
    token=request.cookies.get("user")
    print(token)
    if(not token):
        return Api_view.response_delete_booking(-1)
    else:         
        jwt_res = jwt.decode(token, secret_key, algorithms='HS256')
        user_id=jwt_res["id"]
        auth_result=auth.check_auth(user_id)
        if (not auth_result):
            return Api_view.response_delete_booking(-1)
        else: 
            attraction_id=request.json["attractionId"]
            date=request.json["date"]
            time=request.json["time"]
            
            print(attraction_id)
            print(date)
            print(time)
            row_count=Database.delete_booking(user_id, attraction_id, date, time)
            return Api_view.response_delete_booking(row_count)