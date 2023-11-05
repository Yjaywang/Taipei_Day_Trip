import time
import jwt
import json
from flask import make_response
from flask import render_template
from dotenv import dotenv_values
from application import bcrypt
from flask_jwt_extended import create_access_token, set_refresh_cookies
from flask_jwt_extended import set_access_cookies, JWTManager
from flask import jsonify
from flask_jwt_extended import create_refresh_token
from flask_jwt_extended import unset_access_cookies
from flask_jwt_extended import unset_refresh_cookies
from flask_jwt_extended import unset_jwt_cookies
secret_key = str(json.loads({**dotenv_values(".env")}["secret_key"]))


class Api_view:
    def response_member_token_refresh(identity):
        access_token = create_access_token(identity=identity)
        response = jsonify({"ok": True})
        set_access_cookies(response, access_token)
        return response, 200

    def response_member_page():
        return render_template("member.html")

    def response_query_member(record: tuple):
        output = {}
        if record == -1:
            return {"data": None}, 200
        else:
            output["id"] = record[0]
            output["name"] = record[1]
            output["email"] = record[2]
            output["photoName"] = record[4]
            return{"data": output}, 200

    def response_user_signup(username: str, email: str, pw_hash: str, record_count: int):
        if (not username or not email or not pw_hash):
            return {
                "error": True,
                "message": "input empty values",
            }, 400
        if record_count == 1:  # update success
            return {"ok": True}, 200
        else:
            return {
                "error": True,
                "message": "email existed",
            }, 400

    def response_query_signin(record: tuple, record_count: int, email: str, password: str):
        if not record:
            return {
                "error": True,
                "message": "email not existed",
            }, 400
        if (not email or not password):
            return {
                "error": True,
                "message": "input empty values",
            }, 400

        identity = {
            "id": record[0]
        }

        # update success
        if not bcrypt.check_password_hash(record[1], password):
            return {
                "error": True,
                "message": "wrong password, try again!",
            }, 400
        access_token = create_access_token(identity=identity)
        refresh_token = create_refresh_token(identity=identity)
        response = jsonify({"ok": True})
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
        return response, 200

    def response_input_valid(valid):
        if valid["message"] == "error email format":
            return {
                "error": True,
                "message": "error email format",
            }, 400
        elif valid["message"] == "error password format":
            return {
                "error": True,
                "message": "error password format",
            }, 400

    def response_sign_out():
        response = jsonify({"ok": True})
        unset_jwt_cookies(response)
        return response, 200

    def response_update_username(record_count):
        if record_count == -1:
            return {
                "error": True,
                "message": "input empty values",
            }, 400
        elif(not record_count):
            return {
                "error": True,
                "message": "same as previous value",
            }, 400
        return {"ok": True}, 200

    def response_update_password(record_count):
        if (record_count == -1):
            return {
                "error": True,
                "message": "input empty values",
            }, 400
        elif(record_count == -2):
            return {
                "error": True,
                "message": "password not consistent",
            }, 400
        elif(record_count == -3):
            return {
                "error": True,
                "message": "wrong old pw",
            }, 400
        elif(record_count == -4):
            return {
                "error": True,
                "message": "same as previous value",
            }, 400
        elif(not record_count):
            return {
                "error": True,
                "message": "user not found",
            }, 400
        return {"ok": True}, 200

    def response_upload_photo(record_count, url):
        if record_count == -1:
            return {
                "error": True,
                "message": "input empty values",
            }, 400
        elif record_count == -2:
            return {
                "error": True,
                "message": "must be png, jpeg, bmp, gif, svg",
            }, 400
        elif(not record_count):
            return {
                "error": True,
                "message": "same as previous filename",
            }, 400
        return {"data": url}, 200

    def response_get_photo_url(url):
        return {"data": url}, 200
