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

    update_record=Database.update_tappay_msg(tappay_rec_trade_id, tappay_msg, status, order_id)
    return Api_view.response_create_order(update_record, order_number, status)
    


@order.route("/api/order/<orderNumber>", methods=["GET"])
@jwt_required(refresh=False) #use access token
def get_order(orderNumber: str):

    records, rowcount=Database.query_order_details(orderNumber)
    return Api_view.response_get_order(records, rowcount)

@order.route("/api/order/refund", methods=["PATCH"])
@jwt_required(refresh=False) #use access token
def refund():    
    
    order_number=request.json["orderNumber"]
    refund_reason=request.json["refundReason"]
    refund_id_record=Database.query_refund_id(order_number)
    if(not refund_id_record):
        #DB return None
        return Api_view.response_update_refund(-1) #can not find transaction
    refund_id=refund_id_record[0]
    refund_time = datetime.datetime.now()
    

    ####tappay post####
    url="https://sandbox.tappaysdk.com/tpc/transaction/refund"
    headers={
    "Content-Type": "application/json",
    "x-api-key": parent_key,
    }
    data={
        "partner_key": parent_key,
        "rec_trade_id": refund_id,
    }
    response = requests.post(url, json=data, headers=headers)
    if(response.json()["status"]==10050):
        return Api_view.response_update_refund(-2) #already refund

    record_count=Database.update_refund(response.json(), refund_reason, refund_time, order_number)
    return Api_view.response_update_refund(record_count)


@order.route("/api/order", methods=["GET"])
@jwt_required(refresh=False) #use access token
def query_user_orders():

    user_id = get_jwt()["sub"]["id"]
    records=Database.query_user_transactions_detail(user_id)
    print(not records)
    return Api_view.response_query_user_transactions_detail(records)
    