from flask import Blueprint
from flask import request
from application.model.booking_model import Database
from application.view.booking_resp import Api_view
from dotenv import dotenv_values
import json
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt

secret_key=str(json.loads({ **dotenv_values(".env")}["secret_key"]))


bookings =Blueprint(
    "bookings",
    __name__,
    static_folder="static",
    template_folder="templates",
    )

@bookings.route("/booking")
def booking():
    """render booking page"""
    return Api_view.response_booking_page()

@bookings.route("/api/booking", methods=["GET"])
@jwt_required(refresh=False) #use access token
def get_booking() ->tuple[dict[str:str], int]:
    """query booking record by user_id from DB, return data with status code"""

    user_id = get_jwt()["sub"]["id"]
    records, row_count=Database.query_booking(user_id)
    return Api_view.response_query_booking(records, row_count)


@bookings.route("/api/booking", methods=["POST"])
@jwt_required(refresh=False) #use access token
def insert_booking() ->tuple[dict[str:bool], int]:
    """insert booking info into DB"""    
      
    user_id = get_jwt()["sub"]["id"]
    attraction_id=request.json["attractionId"]
    date=request.json["date"]
    time=request.json["time"]            
    if not date or not time:
        return Api_view.response_insert_booking(-1) #-1: empty input
    row_count=Database.insert_booking(user_id, attraction_id, date, time)
    return Api_view.response_insert_booking(row_count)

@bookings.route("/api/booking", methods=["DELETE"])
@jwt_required(refresh=False) #use access token
def delete_booking() ->tuple[dict[str:bool], int]: 
    """delete specify booking info from DB by user_id, attraction_id, date, time"""

    
    user_id = get_jwt()["sub"]["id"]
    attraction_id=request.json["attractionId"]
    date=request.json["date"]
    time=request.json["time"]
    row_count=Database.delete_booking(user_id, attraction_id, date, time)
    return Api_view.response_delete_booking(row_count)