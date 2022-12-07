import os
import glob
from flask import Flask
from flask import Response
from flask import render_template
import json
from application.controller.category import category
from application.controller.attractions import attractions
from application.controller.user import user
from application.controller.auth import auth
from application.controller.index import index_page
from application.controller.attraction import attraction_page
from application.controller.booking import booking_page
from application.controller.thankyou import thankyou_page

__all__ = [os.path.basename(f)[:-3] for f in glob.glob(os.path.dirname(__file__) + "/*.py")]

app = Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

@app.errorhandler(Exception)
def all_exception_handler(error):
    res={
        "error": True,
        "message": "error message: server error" +str(error)
    }
    return Response(status=500, mimetype="application/json", response=json.dumps(res))


app.register_blueprint(category, url_prefix="")
app.register_blueprint(attractions, url_prefix="")
app.register_blueprint(user, url_prefix="")
app.register_blueprint(auth, url_prefix="")
app.register_blueprint(index_page, url_prefix="")
app.register_blueprint(attraction_page, url_prefix="")
app.register_blueprint(booking_page, url_prefix="")
app.register_blueprint(thankyou_page, url_prefix="")









