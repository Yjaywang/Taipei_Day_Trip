import os
import glob
from flask import Flask
from flask import Response
import json
from flask_bcrypt import Bcrypt
import mysql.connector
from dotenv import dotenv_values

config=json.loads({ **dotenv_values(".env")}["config"])
connection_pool=mysql.connector.pooling.MySQLConnectionPool(**config)
__all__ = [os.path.basename(f)[:-3] for f in glob.glob(os.path.dirname(__file__) + "/*.py")]
bcrypt=Bcrypt()


def create_app():
    from application.controller.attractions import attractions
    from application.controller.member import member
    from application.controller.booking import bookings
    from application.controller.order import order
    from application.controller.index import index_page
    from application.controller.thankyou import thankyou_page

    app = Flask(__name__)
    app.config["JSON_AS_ASCII"]=False
    app.config["TEMPLATES_AUTO_RELOAD"]=True
    bcrypt.init_app(app)


    @app.errorhandler(Exception)
    def all_exception_handler(error):
        res={
            "error": True,
            "message": "error message: server error" +str(error)
        }
        return Response(status=500, mimetype="application/json", response=json.dumps(res))


    app.register_blueprint(attractions, url_prefix="")
    app.register_blueprint(member, url_prefix="")
    app.register_blueprint(bookings, url_prefix="")
    app.register_blueprint(order, url_prefix="")
    app.register_blueprint(index_page, url_prefix="")    
    app.register_blueprint(thankyou_page, url_prefix="")

    return app











