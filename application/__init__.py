import os
import glob
from flask import Flask
from flask import Response
import json
from flask_bcrypt import Bcrypt
import mysql.connector
from dotenv import dotenv_values
from datetime import timedelta

config = json.loads({**dotenv_values(".env")}["config"])
connection_pool = mysql.connector.pooling.MySQLConnectionPool(**config)
__all__ = [os.path.basename(f)[:-3]
           for f in glob.glob(os.path.dirname(__file__) + "/*.py")]
bcrypt = Bcrypt()


def create_app():
    from application.controller.attractions import attractions
    from application.controller.member import member
    from application.controller.booking import bookings
    from application.controller.order import order
    from application.controller.index import index_page
    from application.controller.thankyou import thankyou_page
    from flask_jwt_extended import JWTManager

    app = Flask(__name__)
    app.config["JSON_AS_ASCII"] = False
    app.config["TEMPLATES_AUTO_RELOAD"] = True
    bcrypt.init_app(app)
    jwt = JWTManager(app)
    app.config["JWT_SECRET_KEY"] = {**dotenv_values(".env")}["secret_key"]
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = 604800
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_COOKIE_SAMESITE"] = 'Strict'
    app.config['JWT_COOKIE_CSRF_PROTECT'] = True

    @app.errorhandler(Exception)
    def all_exception_handler(error):
        res = {
            "error": True,
            "message": "error message: server error" + str(error)
        }
        return Response(status=500, mimetype="application/json", response=json.dumps(res))

    # #expire exceptions
    @jwt.expired_token_loader
    @jwt.needs_fresh_token_loader
    def my_expired_token_callback(jwt_header, jwt_payload):
        return {
            "error": True,
            "message": "no access or expired token"
        }, 403
    # token failed exceptions

    @jwt.unauthorized_loader
    @jwt.invalid_token_loader
    def my_unauthorized_token_callback(self):
        return {
            "error": True,
            "message": "no access, expired token, or jwt failed"
        }, 403

    app.register_blueprint(attractions, url_prefix="")
    app.register_blueprint(member, url_prefix="")
    app.register_blueprint(bookings, url_prefix="")
    app.register_blueprint(order, url_prefix="")
    app.register_blueprint(index_page, url_prefix="")
    app.register_blueprint(thankyou_page, url_prefix="")

    return app
