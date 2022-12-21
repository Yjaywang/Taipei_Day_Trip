from flask import Blueprint
from flask import request
from application.model.order_model import Database
from application.view.thankyou_resp import Api_view
import jwt
import json
from dotenv import dotenv_values
from application import bcrypt
from utils import validate_input

secret_key=str(json.loads({ **dotenv_values(".env")}["secret_key"]))


thankyou_page =Blueprint(
    "thankyou_page",
    __name__,
    static_folder="static",
    template_folder="templates",
    )


@thankyou_page.route("/thankyou")
def thankyou():
    return Api_view.response_thankyou_page()