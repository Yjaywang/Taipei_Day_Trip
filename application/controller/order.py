from flask import Blueprint
from flask import request
import requests
from application.model.order_model import Database
from application.view.order_resp import Api_view
import json
from dotenv import dotenv_values
import datetime
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt


secret_key=str(json.loads({ **dotenv_values(".env")}["secret_key"]))
parent_key=str({ **dotenv_values(".env")}["parent_key"])



order =Blueprint(
    "order",
    __name__,
    static_folder="static",
    template_folder="templates",
    )


@order.route("/api/orders", methods=["POST"])
@jwt_required(refresh=False) #use access token
def create_order():
    status=-4 #unknown fail status       
    user_id = get_jwt()["sub"]["id"]
    prime=request.json["prime"]
    order=request.json["order"]
    total_money=order["price"]
    name=order["contact"]["name"]
    phone=order["contact"]["phone"]
    email=order["contact"]["email"]
    trips=order["trip"]
    transaction_time = datetime.datetime.now()
    order_number=f'{user_id}_{transaction_time.strftime("%Y%m%d%H%M%S")}'

    if(not name or not email or not phone):
        return Api_view.response_create_order(0, "", status)
    transaction_rowcount=Database.insert_transaction(order_number, total_money, transaction_time, user_id, phone, status)
    order_id=int(Database.query_order_id(order_number)[0])
    order_details_rowcounts=Database.insert_order_details(trips, order_id)
    if transaction_rowcount==0 or 0 in order_details_rowcounts:
        return Api_view.response_create_order(0, "", status)

    ####tappay post####
    url="https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
    headers={
    "Content-Type": "application/json",
    "x-api-key": parent_key,
    }
    data={
        "prime": prime,
        "partner_key": parent_key,
        "merchant_id": "asdfasdf_TAISHIN",
        "details":"TapPay Test",
        "amount": total_money,
        "order_number":order_number,
        "cardholder": {
            "phone_number": phone,
            "name": name,
            "email": email,
            "zip_code": "100",
            "address": "台北市天龍區芝麻街1號1樓",
            "national_id": "A123456789"
        },
        "remember": True
    }
    response = requests.post(url, json=data, headers=headers)

    status=response.json()["status"]
    tappay_msg=response.json()["msg"]
    tappay_rec_trade_id=response.json()["rec_trade_id"]

    if status==0:
        update_record=Database.update_tappay_msg(tappay_rec_trade_id, tappay_msg, status, order_id)
        return Api_view.response_create_order(update_record, order_number, status)
    else:
        update_record=Database.update_tappay_msg(tappay_rec_trade_id, tappay_msg, status, order_id)
        return Api_view.response_create_order(update_record, order_number, status)


    # records, row_count=Database.query_booking(user_id)
    # return Api_view.response_query_booking(records, row_count)

    


@order.route("/api/order/<orderNumber>", methods=["GET"])
@jwt_required(refresh=False) #use access token
def get_order(orderNumber: str):

    records, rowcount=Database.query_order_details(orderNumber)
    return Api_view.response_get_order(records, rowcount)


