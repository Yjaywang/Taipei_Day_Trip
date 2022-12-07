from flask import Blueprint
from flask import request
from application.model.database import Database
from application.view.api_response import Api_view
from application import bcrypt

user = Blueprint(
    "user",
    __name__,
    static_folder="static",
    template_folder="templates",
    )

@user.route("/api/user", methods=["POST"])
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



    