#sys.path append
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from flask import Blueprint
from flask import render_template

index_page = Blueprint(
    "index_page", 
    __name__,
    static_folder="static",
    template_folder="templates",
    )

@index_page.route("/")
def index():
    return render_template("index.html")




