#sys.path append
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


from flask import Blueprint
from flask import render_template
from model.database import Database
from view.api_response import Api_view


attraction_page =Blueprint(
    "attraction_page",
    __name__,
    static_folder="static",
    template_folder="templates",
    )

@attraction_page.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html")
